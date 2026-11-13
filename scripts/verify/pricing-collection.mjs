import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const WIDTHS = [320, 390, 768, 1024, 1440, 1920];
const SECTION = "#budget-collection";
const EXAMPLES = [
  {
    model: "lenovo-thinkpad-t480",
    name: "Lenovo ThinkPad T480",
    configuration: {
      da: "i5-8250U · 16 GB · 256 GB SSD · nordisk tastatur",
      en: "i5-8250U · 16 GB · 256 GB SSD · Nordic keyboard",
    },
    observed: 2655,
    fee: 37,
    source: "https://www.refurbed.dk/p/lenovo-tp-t480-8250u/95266/",
    photo: /^\/thinkpad-t480-6\.jpg$/,
    alt: /ThinkPad\s+T480/i,
  },
  {
    model: "lenovo-thinkpad-t14",
    name: "Lenovo ThinkPad T14 G2",
    configuration: {
      da: "i5-1145G7 · 16 GB · 256 GB SSD · nordisk tastatur · stand God",
      en: "i5-1145G7 · 16 GB · 256 GB SSD · Nordic keyboard · Good condition",
    },
    observed: 2955,
    fee: 37,
    source: "https://www.refurbed.dk/p/lenovo-thinkpad-t14-g2-1145g7/",
    photo: /^\/models\/t14\/gen2-intel-reference\.webp$/,
    alt: /ThinkPad\s+T14.*(?:Gen\s*2|G2)/i,
  },
  {
    model: "dell-optiplex-5060",
    name: "Dell OptiPlex 5060 SFF",
    configuration: {
      da: "i5-8400 · 8 GB · 256 GB SSD · stand Fremragende",
      en: "i5-8400 · 8 GB · 256 GB SSD · Excellent condition",
    },
    observed: 2029,
    fee: 30,
    source: "https://www.refurbed.dk/en-dk/p/dell-optiplez-5060-sff/",
    photo: /^\/pricing\/optiplex-5060-sff-illustration\.svg$/,
    alt: /OptiPlex\s+5060\s+SFF/i,
    illustration: true,
  },
  {
    model: "dell-ultrasharp-u2419h",
    name: "Dell UltraSharp U2419H",
    configuration: {
      da: "23,8″ · Full HD · fod medfølger · stand God",
      en: "23.8-inch · Full HD · stand included · Good condition",
    },
    observed: 1185,
    fee: 15,
    source: "https://www.refurbed.dk/p/dell-ultrasharp-u2419h/",
    photo: /^\/pricing\/ultrasharp-u2419h-illustration\.svg$/,
    alt: /(?:UltraSharp\s+)?U2419H/i,
    illustration: true,
  },
];

const T14_CREDITS = [
  "https://commons.wikimedia.org/wiki/File:ThinkPad_T14.jpg",
  "https://creativecommons.org/publicdomain/zero/1.0/",
];

/** A dated budget reference is not a live sale; its enquiry retains the exact configuration. */
export async function verifyPricingCollection(browser, base, fail) {
  console.log("verify: photographic budget collection and exact enquiry handoff");
  const origin = new URL(base);
  assert.ok(
    ["localhost", "127.0.0.1", "[::1]"].includes(origin.hostname),
    "pricing checks are local only",
  );
  const repository = fileURLToPath(new URL("../../", import.meta.url));
  const publicRoot = resolve(repository, "public");
  const directory = process.env.VERIFY_ARTIFACT_DIR && resolve(process.env.VERIFY_ARTIFACT_DIR);
  if (directory) {
    const fromRepository = relative(repository, directory);
    assert.ok(
      fromRepository.startsWith("..") || isAbsolute(fromRepository),
      "pricing screenshots stay outside the repository",
    );
    await mkdir(directory, { recursive: true });
  }

  // A browser may navigate away while Next still resizes another lazy image.
  // Keep each optimizer socket alive independently until its response arrives.
  const images = await browser.newContext();
  const pendingImages = new Set();

  async function scenario(language, width, javaScriptEnabled) {
    const name = `${language} ${width}px ${javaScriptEnabled ? "JS" : "no JS"}`;
    const path = language === "da" ? "/priser" : "/en/pricing";
    const quotePath = language === "da" ? "/tilbud" : "/en/get-a-quote";
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      javaScriptEnabled,
      locale: language === "da" ? "da-DK" : "en-GB",
      reducedMotion: "reduce",
    });
    context.setDefaultTimeout(15000);
    context.setDefaultNavigationTimeout(30000);
    await context.addInitScript(() => {
      localStorage.setItem("kestro-consent", "denied");
      localStorage.setItem("kestro-lang-hint", "1");
    });
    let closing = false;
    const externalImages = [];
    const unexpectedWrites = [];
    const routingErrors = [];
    const pageErrors = [];
    await context.route("**/*", async (route) => {
      const request = route.request();
      try {
        const url = new URL(request.url());
        if (url.origin !== origin.origin) {
          if (request.resourceType() === "image") externalImages.push(url.href);
          return await route.abort();
        }
        if (!["GET", "HEAD"].includes(request.method())) {
          if (url.pathname === "/api/track") return await route.fulfill({ status: 204 });
          unexpectedWrites.push(`${request.method()} ${url.pathname}`);
          return await route.abort();
        }
        if (request.method() === "GET" && url.pathname === "/_next/image") {
          const source = url.searchParams.get("url");
          if (source && new URL(source, origin).origin !== origin.origin) {
            externalImages.push(source);
            return await route.abort();
          }
          const fetched = images.request.get(url.href, {
            maxRedirects: 0,
            headers: await request.allHeaders(),
          });
          pendingImages.add(fetched);
          let response;
          try {
            response = await fetched;
          } finally {
            pendingImages.delete(fetched);
          }
          return await route.fulfill({ response });
        }
        if (
          request.method() === "GET" &&
          (request.isNavigationRequest() || request.headers().rsc === "1")
        ) {
          const response = await route.fetch({
            maxRedirects: 0,
            headers: await request.allHeaders(),
          });
          const headers = response.headers();
          // The deployed TLS policy stays unchanged. Only this local HTTP test
          // removes the directive that would upgrade loopback into missing TLS.
          if (request.isNavigationRequest() && headers["content-security-policy"])
            headers["content-security-policy"] = headers["content-security-policy"].replace(
              /(^|;)\s*upgrade-insecure-requests\s*(?=;|$)/g,
              "$1",
            );
          return await route.fulfill({ response, headers });
        }
        return await route.continue();
      } catch (error) {
        if (closing || request.failure()?.errorText === "net::ERR_ABORTED") return;
        routingErrors.push(`${request.method()} ${request.url()}: ${error.message}`);
        await route.abort().catch(() => {});
      }
    });
    const page = await context.newPage();
    page.on("pageerror", (error) => pageErrors.push(error.message));
    try {
      assert.equal(
        (await page.goto(base + path, { waitUntil: "networkidle" }))?.status(),
        200,
        "the pricing page is available",
      );
      await page.evaluate(() => document.fonts.ready);
      assert.equal(
        await page.locator("main h1").count(),
        1,
        "pricing retains a single primary heading",
      );
      const section = page.locator(SECTION);
      assert.equal(await section.count(), 1, "one budget collection is server-rendered");
      assert.ok(await section.isVisible(), "the collection is visible without a filter or script");
      const cards = section.locator("[data-budget-model]");
      assert.equal(await cards.count(), 4, "four distinct dated budget examples remain");
      assert.equal(await section.locator("img").count(), 4, "every reference has an image");
      assert.equal(
        await section
          .locator("canvas,[data-checkout],a[href*='/checkout'],a[href*='/cart']")
          .count(),
        0,
        "catalogue controls do not introduce a checkout, basket or rotating scene",
      );
      for (const form of await section.locator("form").all()) {
        assert.equal(
          ((await form.getAttribute("method")) || "get").toLowerCase(),
          "get",
          "any native catalogue form is read-only filtering, not order submission",
        );
      }
      assert.equal(
        await section
          .getByRole("button", { name: /(?:læg i kurv|add to cart|køb nu|buy now)/i })
          .count(),
        0,
        "filtering and comparison never become purchase controls",
      );

      const text = (await section.innerText()).replace(/\s+/g, " ");
      assert.match(
        text,
        language === "da" ? /ikke\s+Kestros\s+salgspriser/i : /not\s+Kestro\s+selling\s+prices/i,
        "the collection does not present these as Kestro selling prices",
      );
      assert.match(
        text,
        language === "da" ? /lager/i : /stock/i,
        "stock is distinguished from the reference collection",
      );
      assert.match(
        text,
        language === "da" ? /inkl(?:usive|\.)?\s*moms/i : /(?:including|incl\.)\s*VAT/i,
        "the VAT basis is visible near the cards",
      );
      assert.match(
        text,
        language === "da" ? /servicegebyr/i : /service\s*fee/i,
        "the service-fee basis is visible",
      );
      const dates = section.locator("time[datetime='2026-10-14']");
      assert.ok(await dates.count(), "the historical observation date is in the collection");
      assert.ok(
        await dates.first().isVisible(),
        "the historical date does not require opening small print",
      );
      assert.doesNotMatch(text, /\b2026-10-14\b/, "the visible date is human-formatted");
      assert.match(
        await page.locator("main").innerText(),
        language === "da"
          ? /modtager\s+ikke\s+ordrer\s+eller\s+betaling/i
          : /do\s+not\s+accept\s+orders\s+or\s+payments/i,
        "the pre-launch no-order notice is retained",
      );
      assert.doesNotMatch(
        text,
        /\b(?:Læg i kurv|Add to cart|Køb nu|Buy now)\b/i,
        "there is no misleading purchase action",
      );

      const destinations = new Map();
      for (const expected of EXAMPLES) {
        const card = section.locator(`[data-budget-model='${expected.model}']`);
        assert.equal(await card.count(), 1, "each reference appears once");
        assert.equal(
          await card.getByRole("heading", { level: 3, name: expected.name, exact: true }).count(),
          1,
          "the exact model is named",
        );
        const cardText = (await card.innerText()).replace(/\s+/g, " ");
        assert.ok(
          cardText.includes(expected.configuration[language]),
          "the historical configuration remains readable",
        );
        const number = new Intl.NumberFormat(language === "da" ? "da-DK" : "en-GB").format(
          Math.ceil((expected.observed + expected.fee) / 100) * 100,
        );
        assert.ok(
          cardText.includes(`${number} DKK`),
          "the documented total is rounded to the correct DKK 100 budget",
        );
        if (expected.illustration)
          assert.match(
            cardText,
            /illustration/i,
            "the Dell artwork is visibly labelled as an illustration",
          );

        const photo = card.locator("img");
        await photo.scrollIntoViewIfNeeded();
        const handle = await photo.elementHandle();
        try {
          await page.waitForFunction(async (image) => {
            if (!image?.complete || !image.naturalWidth) return false;
            await image.decode();
            return true;
          }, handle);
        } finally {
          await handle?.dispose();
        }
        const rendered = await photo.evaluate((image) => {
          const box = image.getBoundingClientRect();
          const frame = image.parentElement.getBoundingClientRect();
          const card = image.closest("[data-budget-model]").getBoundingClientRect();
          const source = new URL(image.currentSrc);
          const style = getComputedStyle(image);
          return {
            source: source.searchParams.get("url") || source.pathname,
            alt: image.alt,
            width: Number(image.getAttribute("width")),
            height: Number(image.getAttribute("height")),
            ratio: image.naturalWidth / image.naturalHeight,
            fit: style.objectFit,
            transform: style.transform,
            fits:
              box.width > 0 &&
              box.height > 0 &&
              box.left >= frame.left - 1 &&
              box.right <= frame.right + 1 &&
              box.top >= frame.top - 1 &&
              box.bottom <= frame.bottom + 1,
            frameFits:
              frame.left >= card.left - 1 &&
              frame.right <= card.right + 1 &&
              frame.top >= card.top - 1 &&
              frame.bottom <= card.bottom + 1,
          };
        });
        assert.match(
          rendered.source,
          expected.photo,
          "the intended model photograph or original illustration is local",
        );
        assert.match(
          rendered.alt,
          expected.alt,
          "alternative text identifies the correct model and form factor",
        );
        const filename = resolve(publicRoot, `.${rendered.source}`);
        assert.ok(
          filename.startsWith(publicRoot + "/") || filename.startsWith(publicRoot + "\\"),
          "the image file stays under public",
        );
        const metadata = await sharp(filename).metadata();
        assert.ok(
          Math.abs(rendered.ratio - metadata.width / metadata.height) < 0.015,
          "delivered dimensions preserve the asset aspect ratio",
        );
        if (rendered.width && rendered.height) {
          assert.equal(rendered.width, metadata.width, "intrinsic width matches the asset");
          assert.equal(rendered.height, metadata.height, "intrinsic height matches the asset");
        }
        assert.equal(rendered.fit, "contain", "the whole product remains inside its frame");
        assert.equal(
          rendered.transform,
          "none",
          "the model media is not zoomed into a misleading crop",
        );
        assert.ok(rendered.fits && rendered.frameFits, "the picture and frame fit their card");

        const enquiry = card.locator("a[data-budget-enquiry]");
        const model = card.locator("a[data-budget-model-link]");
        const source = card.locator("a[data-budget-source]");
        for (const link of [enquiry, model, source]) {
          assert.equal(
            await link.count(),
            1,
            "every reference has one clear enquiry, specification and historical-source action",
          );
          assert.ok(await link.isVisible(), "actions are usable without hover");
          const box = await link.boundingBox();
          assert.ok(box && box.width >= 44 && box.height >= 44, "actions are at least 44px");
        }
        for (const [link, visibleLabel] of [
          [enquiry, language === "da" ? "Spørg om pris" : "Enquire"],
          [model, language === "da" ? "Detaljer" : "Details"],
        ]) {
          const namedLink = card.getByRole("link", {
            name: new RegExp(`^${visibleLabel}(?:\\s|:|$)`, "i"),
          });
          assert.equal(
            await link.and(namedLink).count(),
            1,
            "the accessible action name begins with its visible label for speech-input users",
          );
        }
        const enquiryUrl = new URL(await enquiry.getAttribute("href"), origin);
        const configuration = `${expected.name} — ${expected.configuration[language]}`;
        assert.equal(enquiryUrl.origin, origin.origin, "an enquiry stays on Kestro");
        assert.equal(
          enquiryUrl.pathname,
          quotePath,
          "the enquiry reaches the locale's existing quote page",
        );
        assert.equal(
          enquiryUrl.searchParams.get("model"),
          configuration,
          "the exact name, generation, form factor and configuration reach the enquiry",
        );
        assert.ok(
          configuration.length <= 120,
          "the supplied configuration fits the form's existing text limit",
        );
        destinations.set(expected.model, { href: enquiryUrl.href, configuration });
        const modelUrl = new URL(await model.getAttribute("href"), origin);
        assert.equal(modelUrl.origin, origin.origin, "model specifications stay on Kestro");
        assert.equal(
          modelUrl.pathname,
          `${language === "da" ? "/modeller/" : "/en/models/"}${expected.model}`,
          "model links keep their existing URL",
        );
        assert.equal(
          await source.getAttribute("href"),
          expected.source,
          "the historical source is the documented retailer page",
        );
        assert.equal(
          await source.getAttribute("target"),
          "_blank",
          "the source opens in a new tab",
        );
        const relations = ((await source.getAttribute("rel")) || "").split(/\s+/);
        for (const relation of ["noopener", "noreferrer", "nofollow"])
          assert.ok(relations.includes(relation), "external sources retain safe relations");
        assert.match(
          (await source.getAttribute("aria-label")) || (await source.innerText()),
          language === "da" ? /historisk/i : /historical/i,
          "the source action is not represented as a current offer",
        );
        const layout = await card.evaluate((card) => {
          const bounds = card.getBoundingClientRect();
          return {
            left: bounds.left,
            right: bounds.right,
            height: bounds.height,
            clipped: [...card.querySelectorAll("h3,p,a")]
              .filter((node) => {
                const box = node.getBoundingClientRect();
                const style = getComputedStyle(node);
                if (
                  !box.width ||
                  !box.height ||
                  style.display === "none" ||
                  style.visibility === "hidden" ||
                  node.closest("[aria-hidden='true']") ||
                  node.classList.contains("sr-only")
                )
                  return false;
                return (
                  node.scrollWidth > node.clientWidth + 2 ||
                  box.left < bounds.left - 1 ||
                  box.right > bounds.right + 1 ||
                  Number.parseFloat(style.fontSize) < 12
                );
              })
              .map((node) => node.textContent.trim()),
          };
        });
        assert.ok(layout.left >= -1 && layout.right <= width + 1, "each card fits its viewport");
        if (width < 640)
          assert.ok(
            layout.height > 0 && layout.height <= 440,
            "mobile reference cards remain compact without sacrificing their existing readable content or actions",
          );
        assert.deepEqual(
          layout.clipped,
          [],
          "model names, prices and actions remain readable without clipping",
        );
      }

      const basis = section.locator("details[data-budget-basis]");
      assert.equal(await basis.count(), 1, "the arithmetic has one native calculation disclosure");
      assert.equal(
        await basis.getAttribute("open"),
        null,
        "detailed calculations do not expand the initial collection",
      );
      const basisSummary = basis.locator(":scope > summary");
      const basisTarget = await basisSummary.boundingBox();
      assert.ok(
        basisTarget && basisTarget.width >= 44 && basisTarget.height >= 44,
        "the calculation basis has a touch-sized control",
      );
      await basisSummary.click();
      assert.notEqual(
        await basis.getAttribute("open"),
        null,
        "the calculation basis opens natively, including without JavaScript",
      );
      assert.equal(
        await basis.locator("[data-budget-calculation]").count(),
        4,
        "all four historical calculations remain available",
      );
      const numberFormat = new Intl.NumberFormat(language === "da" ? "da-DK" : "en-GB");
      for (const expected of EXAMPLES) {
        const row = basis.locator(`[data-budget-calculation='${expected.model}']`);
        assert.equal(await row.count(), 1, "each model has its own calculation row");
        assert.equal(
          (await row.locator("dt").innerText()).trim(),
          expected.name,
          "the calculation names the exact reference model",
        );
        const amounts = [
          expected.observed,
          expected.fee,
          Math.ceil((expected.observed + expected.fee) / 100) * 100,
        ].map((amount) => `${numberFormat.format(amount)} DKK`);
        const equation = `${amounts[0]} + ${amounts[1]} ${language === "da" ? "servicegebyr" : "service fee"} → ${amounts[2]}`;
        assert.equal(
          (await row.locator("dd").innerText()).replace(/\s+/g, " ").trim(),
          equation,
          "the observed price, fee and correctly rounded budget are all formatted and associated accurately",
        );
        assert.ok(await row.isVisible(), "the model's calculation is readable when opened");
      }
      await basisSummary.click();
      assert.equal(
        await basis.getAttribute("open"),
        null,
        "the native calculation basis can be closed again",
      );

      const credits = section.locator("details[data-budget-credits]");
      assert.equal(
        await credits.count(),
        1,
        "image provenance is available in a native disclosure",
      );
      const summary = credits.locator(":scope > summary");
      const target = await summary.boundingBox();
      assert.ok(
        target && target.width >= 44 && target.height >= 44,
        "credits have a touch-sized control",
      );
      await summary.click();
      assert.notEqual(
        await credits.getAttribute("open"),
        null,
        "photo credits open without JavaScript",
      );
      const creditLinks = await credits
        .locator("a[href]")
        .evaluateAll((nodes) => nodes.map((node) => node.href));
      for (const url of T14_CREDITS)
        assert.ok(
          creditLinks.includes(url),
          "the T14 photograph retains its source and CC0 licence",
        );
      for (const url of T14_CREDITS) {
        const credit = credits.locator(`a[href='${url}']`);
        assert.ok(await credit.isVisible(), "source and licence credits are visible when opened");
        const box = await credit.boundingBox();
        assert.ok(
          box && box.width >= 44 && box.height >= 44,
          "source and licence credits are touch-sized",
        );
      }
      assert.match(await credits.innerText(), /Edvard10/, "the T14 photographer is credited");
      assert.match(
        await credits.innerText(),
        /illustration/i,
        "original Dell illustrations are distinguished from photographs",
      );
      await summary.click();
      assert.equal(await credits.getAttribute("open"), null, "credits can be closed again");

      const offers = await page
        .locator("script[type='application/ld+json']")
        .evaluateAll((nodes) => {
          const found = [];
          const visit = (value) => {
            if (!value || typeof value !== "object") return;
            if (Array.isArray(value)) return value.forEach(visit);
            const types = Array.isArray(value["@type"]) ? value["@type"] : [value["@type"]];
            if (types.some((type) => /^(?:Offer|AggregateOffer)$/.test(type || "")))
              found.push(value);
            Object.values(value).forEach(visit);
          };
          nodes.forEach((node) => visit(JSON.parse(node.textContent)));
          return found;
        });
      assert.equal(
        offers.length,
        0,
        "historical references do not become fabricated Kestro sales offers",
      );
      if (directory)
        await section.screenshot({
          path: join(
            directory,
            `pricing-collection-${language}-${width}-${javaScriptEnabled ? "js" : "nojs"}.png`,
          ),
          animations: "disabled",
        });

      if (javaScriptEnabled && [390, 1440].includes(width)) {
        for (const [index, expected] of EXAMPLES.entries()) {
          const link = page.locator(
            `${SECTION} [data-budget-model='${expected.model}'] a[data-budget-enquiry]`,
          );
          const destination = destinations.get(expected.model);
          if (index === 0) {
            await link.focus();
            assert.ok(
              await link.evaluate((node) => node === document.activeElement),
              "the enquiry supports keyboard focus",
            );
            await page.keyboard.press("Enter");
          } else await link.click();
          await page.waitForURL(
            (url) =>
              url.pathname === quotePath &&
              url.searchParams.get("model") === destination.configuration,
          );
          await page.waitForFunction(
            (expected) => document.querySelector("#udstyr")?.value === expected,
            destination.configuration,
          );
          assert.equal(
            await page.locator("#udstyr").inputValue(),
            destination.configuration,
            "the quote form keeps every card's exact configuration",
          );
          await page.goBack({ waitUntil: "networkidle" });
          await page.waitForURL((url) => url.pathname === path);
          assert.equal(
            await page.locator(`${SECTION} [data-budget-model]`).count(),
            4,
            "Back restores the full collection",
          );
        }
      } else if (!javaScriptEnabled) {
        await section.locator("a[data-budget-enquiry]").first().click();
        await page.waitForURL(
          (url) =>
            url.pathname === quotePath &&
            url.searchParams.get("model") === destinations.get(EXAMPLES[0].model).configuration,
        );
        assert.match(
          await page.locator("main").innerText(),
          /requires JavaScript|kræver JavaScript/i,
          "the script-disabled form states its existing requirement honestly",
        );
        assert.ok(
          await page.locator("#udstyr").isDisabled(),
          "the script-disabled form does not pretend to be ready",
        );
        await page.goBack({ waitUntil: "networkidle" });
        assert.equal(
          await page.locator(`${SECTION} [data-budget-model]`).count(),
          4,
          "native Back restores the no-JS collection",
        );
      }
      assert.ok(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
        "the pricing journey has no horizontal overflow",
      );
      assert.deepEqual(externalImages, [], "there are no third-party picture requests");
      assert.deepEqual(unexpectedWrites, [], "the journey sends no enquiry or purchase");
      assert.deepEqual(
        routingErrors,
        [],
        "local navigation and image routing completed successfully",
      );
      assert.deepEqual(pageErrors, [], "the pricing journey has no JavaScript errors");
      console.log(`verify: pricing collection passed: ${name}`);
    } catch (error) {
      fail(`pricing collection ${name}`, error.stack || error.message);
    } finally {
      closing = true;
      await context.unrouteAll({ behavior: "ignoreErrors" });
      await context.close();
    }
  }
  try {
    for (const language of ["da", "en"]) {
      for (const width of WIDTHS) await scenario(language, width, true);
      await scenario(language, 390, false);
    }
  } finally {
    await Promise.allSettled([...pendingImages]);
    await images.close();
  }
}
