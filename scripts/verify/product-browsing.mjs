import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const GALLERY = "#product-categories";
const CATEGORIES = {
  da: [
    "/produkter/baerbare-computere",
    "/produkter/stationaere-computere",
    "/produkter/skaerme",
    "/produkter/mini-pc",
    "/produkter/tablets",
    "/produkter/smartphones",
    "/produkter/dockingstationer",
  ],
  en: [
    "/en/products/business-laptops",
    "/en/products/desktop-computers",
    "/en/products/monitors",
    "/en/products/mini-pc",
    "/en/products/tablets",
    "/en/products/smartphones",
    "/en/products/docking-stations",
  ],
};

// Independently identify the devices shown, rather than accepting whatever
// the component happens to label a photograph. Tablet/phone marks deliberately
// represent a format; none of this media represents an available stock unit.
const ARTWORK = [
  {
    kind: "photo",
    src: "/thinkpad-t480-6.jpg",
    width: 1179,
    height: 1115,
    subject: /ThinkPad T480/i,
  },
  {
    kind: "illustration",
    src: "/pricing/optiplex-5060-sff-illustration.svg",
    width: 1200,
    height: 900,
    subject: /SFF/i,
  },
  {
    kind: "illustration",
    src: "/pricing/ultrasharp-u2419h-illustration.svg",
    width: 1200,
    height: 900,
    subject: /skærm|monitor/i,
  },
  {
    kind: "illustration",
    src: "/products/lenovo-thinkcentre-m720q.svg",
    width: 1200,
    height: 900,
    subject: /mini.?pc/i,
  },
  { kind: "illustration", subject: /tablet/i },
  { kind: "illustration", subject: /smartphone/i },
  {
    kind: "photo",
    src: "/models/dell-wd19/front-reference.webp",
    width: 1600,
    height: 900,
    subject: /Dell WD19/i,
  },
];

/** A category can be recognised and reached without working through buying advice. */
export async function verifyProductBrowsing(browser, base, fail) {
  console.log("verify: visual product categories and direct browsing journeys");
  const origin = new URL(base);
  assert.ok(
    ["localhost", "127.0.0.1", "[::1]"].includes(origin.hostname),
    "product browsing verification is local only",
  );
  const directory = process.env.VERIFY_ARTIFACT_DIR && resolve(process.env.VERIFY_ARTIFACT_DIR);
  if (directory) {
    const repository = fileURLToPath(new URL("../../", import.meta.url));
    const fromRepository = relative(repository, directory);
    assert.ok(
      fromRepository.startsWith("..") || isAbsolute(fromRepository),
      "product browsing screenshots must stay outside the repository",
    );
    await mkdir(directory, { recursive: true });
  }

  // A journey may navigate away while Next still resizes a lazy picture. Keep
  // those optimizer requests alive independently until their results arrive.
  const images = await browser.newContext();
  const pendingImages = new Set();

  async function scenario(language, width, javaScriptEnabled) {
    const name = `${language} ${width}px ${javaScriptEnabled ? "JS" : "no JS"}`;
    const path = language === "da" ? "/produkter" : "/en/products";
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      locale: language === "da" ? "da-DK" : "en-GB",
      javaScriptEnabled,
      reducedMotion: "reduce",
    });
    context.setDefaultTimeout(15000);
    context.setDefaultNavigationTimeout(30000);
    await context.addInitScript(() => {
      localStorage.setItem("kestro-consent", "denied");
      localStorage.setItem("kestro-lang-hint", "1");
    });
    let closing = false;
    const pageErrors = [];
    const externalImages = [];
    const unexpectedWrites = [];
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
          // The production upgrade directive would target nonexistent TLS on
          // loopback HTTP. Production's unchanged policy is checked separately.
          if (request.isNavigationRequest() && headers["content-security-policy"])
            headers["content-security-policy"] = headers["content-security-policy"].replace(
              /(^|;)\s*upgrade-insecure-requests\s*(?=;|$)/g,
              "$1",
            );
          return await route.fulfill({ response, headers });
        }
        return await route.continue();
      } catch (error) {
        if (!closing && request.failure()?.errorText !== "net::ERR_ABORTED") throw error;
      }
    });
    const page = await context.newPage();
    page.on("pageerror", (error) => pageErrors.push(error.message));
    try {
      const response = await page.goto(base + path, { waitUntil: "networkidle" });
      assert.equal(response?.status(), 200, "the product hub is available");
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.locator("main h1").count(), 1, "the hub has one primary heading");
      const gallery = page.locator(GALLERY);
      assert.equal(await gallery.count(), 1, "one primary category gallery is available");
      const links = gallery.locator("ul > li > a[href]");
      assert.equal(
        await links.count(),
        7,
        "the gallery contains seven clear category destinations",
      );
      const actualTargets = new Set();
      for (const link of await links.all()) {
        const href = new URL(await link.getAttribute("href"), origin);
        assert.equal(href.origin, origin.origin, "a category stays on Kestro");
        assert.ok(CATEGORIES[language].includes(href.pathname), "the category keeps its real URL");
        const expected = ARTWORK[CATEGORIES[language].indexOf(href.pathname)];
        actualTargets.add(href.pathname);
        assert.ok(await link.isVisible(), "every category has a visible control");
        const heading = link.getByRole("heading", { level: 3 });
        assert.equal(await heading.count(), 1, "every category keeps its full accessible title");
        assert.ok(await heading.isVisible(), "category titles remain visible at every width");
        const box = await link.boundingBox();
        assert.ok(box && box.width >= 44 && box.height >= 44, "a category is touch-sized");
        assert.ok(box.x >= -1 && box.x + box.width <= width + 1, "the category fits the viewport");
        const well = link.locator("[data-category-artwork]");
        assert.equal(await well.count(), 1, "each category has one deliberate media frame");
        assert.equal(
          await well.getAttribute("data-category-artwork"),
          expected.kind,
          "the displayed media type matches the actual source",
        );
        const media = well.getByRole("img");
        assert.equal(
          await media.count(),
          1,
          "each category has one accessible device representation",
        );
        assert.ok(await media.isVisible(), "the category representation is visible");
        const label =
          expected.kind === "photo"
            ? language === "da"
              ? "Referencefoto"
              : "Reference photo"
            : "Illustration";
        assert.ok(
          await link.getByText(label, { exact: true }).isVisible(),
          "the visible label distinguishes model references from drawings",
        );
        await media.scrollIntoViewIfNeeded();
        const frame = await well.evaluate((element) => {
          const frame = element.getBoundingClientRect();
          const control = element.closest("a");
          const card = control.getBoundingClientRect();
          return {
            wellFits:
              frame.left >= card.left - 1 &&
              frame.right <= card.right + 1 &&
              frame.top >= card.top - 1 &&
              frame.bottom <= card.bottom + 1,
            overflow: getComputedStyle(element).overflow,
            ratio: frame.width / frame.height,
            clippedText: [...control.querySelectorAll("h3,p")]
              .filter((child) => {
                const box = child.getBoundingClientRect();
                const style = getComputedStyle(child);
                if (
                  style.display === "none" ||
                  style.visibility === "hidden" ||
                  box.width === 0 ||
                  box.height === 0
                )
                  return false;
                return (
                  child.scrollWidth > child.clientWidth + 1 ||
                  box.left < card.left - 1 ||
                  box.right > card.right + 1 ||
                  Number.parseFloat(style.fontSize) < 12
                );
              })
              .map((child) => child.textContent.trim()),
          };
        });
        assert.ok(frame.wellFits, "the media frame stays within its category card");
        assert.equal(frame.overflow, "hidden", "the neutral media frame contains its contents");
        assert.ok(
          Math.abs(frame.ratio - 4 / 3) < 0.03,
          "the media frames keep a consistent 4:3 shape",
        );
        if (expected.src) {
          assert.equal(
            await media.evaluate((element) => element.tagName),
            "IMG",
            "photographs and full-device drawings are delivered as image assets",
          );
          const handle = await media.elementHandle();
          try {
            await page.waitForFunction(async (element) => {
              if (!element?.complete || !element.naturalWidth) return false;
              await element.decode();
              return true;
            }, handle);
          } finally {
            await handle?.dispose();
          }
          const image = await media.evaluate((element) => {
            const box = element.getBoundingClientRect();
            const frame = element.closest("[data-category-artwork]").getBoundingClientRect();
            const src = new URL(element.currentSrc);
            return {
              source: src.searchParams.get("url") || src.pathname,
              alt: element.alt,
              width: Number(element.getAttribute("width")),
              height: Number(element.getAttribute("height")),
              ratio: element.naturalWidth / element.naturalHeight,
              fit: getComputedStyle(element).objectFit,
              transform: getComputedStyle(element).transform,
              fits:
                box.width > 0 &&
                box.height > 0 &&
                box.left >= frame.left - 1 &&
                box.right <= frame.right + 1 &&
                box.top >= frame.top - 1 &&
                box.bottom <= frame.bottom + 1,
            };
          });
          assert.equal(
            image.source,
            expected.src,
            "the category shows the intended local reference, not an unrelated device or scene crop",
          );
          assert.equal(image.width, expected.width, "declared image width matches its asset");
          assert.equal(image.height, expected.height, "declared image height matches its asset");
          assert.ok(
            Math.abs(image.ratio - expected.width / expected.height) < 0.015,
            "the delivered image preserves its natural aspect ratio",
          );
          assert.equal(
            image.fit,
            "contain",
            "the full device remains visible without a cover crop",
          );
          assert.equal(image.transform, "none", "the device is not zoomed beyond its frame");
          assert.ok(image.fits, "the device image stays within its frame");
          assert.match(
            image.alt,
            expected.subject,
            "the accessible description identifies the actual device or format shown",
          );
          assert.match(
            image.alt,
            expected.kind === "photo" ? /referencefoto|reference photo/i : /illustration/i,
            "the accessible description tells the truth about the media type",
          );
        } else {
          assert.equal(
            await well.locator("img").count(),
            0,
            "a format mark is not replaced by a misleading product photograph",
          );
          const vector = await media.evaluate((element) => {
            const svg = element.matches("svg") ? element : element.querySelector("svg");
            const box = svg?.getBoundingClientRect();
            const frame = element.closest("[data-category-artwork]").getBoundingClientRect();
            const viewBox = svg?.viewBox.baseVal;
            return {
              label: element.getAttribute("aria-label"),
              valid: Boolean(svg && viewBox && viewBox.width > 0 && viewBox.height > 0),
              fits: Boolean(
                box &&
                box.width > 0 &&
                box.height > 0 &&
                box.left >= frame.left - 1 &&
                box.right <= frame.right + 1 &&
                box.top >= frame.top - 1 &&
                box.bottom <= frame.bottom + 1,
              ),
            };
          });
          assert.ok(
            vector.valid && vector.fits,
            "the complete vector format illustration renders within its frame",
          );
          assert.match(
            vector.label || "",
            /illustration/i,
            "the format mark is announced as an illustration",
          );
          assert.match(
            vector.label || "",
            expected.subject,
            "the format mark names the right equipment type",
          );
        }
        assert.deepEqual(
          frame.clippedText,
          [],
          "category titles and descriptions fit without clipping",
        );
      }
      assert.deepEqual(actualTargets, new Set(CATEGORIES[language]), "every category appears once");

      assert.match(
        await gallery.innerText(),
        language === "da"
          ? /ikke lager eller den enkelte enheds stand/i
          : /not stock or the condition of an individual unit/i,
        "reference media does not claim stock availability or individual condition",
      );
      const credits = gallery.locator("[data-category-photo-credit]");
      assert.equal(
        await credits.count(),
        1,
        "licensed category photography has an accessible provenance disclosure",
      );
      assert.equal(
        await credits.evaluate((element) => element.tagName),
        "DETAILS",
        "photo provenance uses a native disclosure",
      );
      assert.equal(await credits.getAttribute("open"), null, "photo provenance is initially quiet");
      const creditSummary = credits.locator("summary");
      const creditBox = await creditSummary.boundingBox();
      assert.ok(
        creditBox && creditBox.width >= 44 && creditBox.height >= 44,
        "photo credit has a touch-sized disclosure target",
      );
      await creditSummary.click();
      assert.ok(
        await credits.getByText("Dell WD19 · Raimond Spekking", { exact: true }).isVisible(),
        "the licensed photograph credits its real author",
      );
      assert.equal(
        await credits.locator('a[href^="https://commons.wikimedia.org/"]').getAttribute("href"),
        "https://commons.wikimedia.org/wiki/File:Dell_WD19_(model_K20A)-5812.jpg",
        "the credit links the exact source photograph",
      );
      const licence = credits.locator('a[rel~="license"]');
      assert.equal(
        await licence.getAttribute("href"),
        "https://creativecommons.org/licenses/by-sa/4.0/",
        "the reused photograph preserves its licence",
      );
      assert.match(
        await licence.innerText(),
        /CC BY-SA 4\.0/,
        "the licence is visible after opening provenance",
      );
      await creditSummary.click();

      const modelIndex = language === "da" ? "/modeller" : "/en/models";
      const modelEntry = page.locator("main [data-model-index-entry]");
      assert.equal(
        await modelEntry.count(),
        1,
        "one clear entrance leads to cross-category model comparison",
      );
      assert.equal(
        await modelEntry.getAttribute("href"),
        modelIndex,
        "the model entrance retains its established route",
      );
      assert.equal(
        await page.locator("main a[href='" + modelIndex + "']").count(),
        1,
        "the hub does not repeat the same model-index action",
      );
      const modelEntryBox = await modelEntry.boundingBox();
      assert.ok(
        modelEntryBox && modelEntryBox.width >= 44 && modelEntryBox.height >= 44,
        "the model-comparison entrance is touch-sized",
      );
      assert.equal(
        await page.locator("main a[href^='" + modelIndex + "/']").count(),
        0,
        "individual model cards are not repeated below the category gallery",
      );

      const detail = page.locator("#product-buying-help");
      assert.equal(
        await detail.count(),
        1,
        "one consolidated buying-help disclosure remains available",
      );
      assert.equal(
        await page.locator("#product-buying-choices,#product-purchase-checks").count(),
        0,
        "the former parallel buying-help panels are consolidated",
      );
      assert.equal(
        await detail.evaluate((element) => element.tagName),
        "DETAILS",
        "buying help uses native disclosure",
      );
      assert.equal(await detail.getAttribute("open"), null, "long buying help is initially quiet");
      const summary = detail.locator("summary");
      const helpTarget = await summary.boundingBox();
      assert.ok(
        helpTarget && helpTarget.width >= 44 && helpTarget.height >= 44,
        "buying help opens with a touch-sized control",
      );
      await summary.click();
      assert.notEqual(
        await detail.getAttribute("open"),
        null,
        "the native buying-help disclosure opens",
      );
      const advice =
        language === "da"
          ? [
              "Kontor, hjemmearbejde og startup",
              "CAD og krævende programmer",
              "Nordisk tastatur og tilbehør",
              "Konfiguration og tilbehør",
              "Stand og batteri",
              "Software og licenser",
              "Samlet pris og ansvar",
            ]
          : [
              "Office, home working and startups",
              "CAD and demanding software",
              "Nordic keyboards and accessories",
              "Configuration and accessories",
              "Condition and battery",
              "Software and licences",
              "Total cost and responsibility",
            ];
      for (const heading of advice) {
        assert.ok(
          await detail.getByText(heading, { exact: true }).isVisible(),
          "the consolidated help preserves every buying topic: " + heading,
        );
      }
      const adviceDestinations =
        language === "da"
          ? [
              "/produkter/baerbare-computere",
              "/produkter/mini-pc",
              "/produkter/stationaere-computere",
              "/produkter/dockingstationer",
              "/ydelser/nordisk-tilpasning",
              "/kvalitet",
              "/saelg-til-os",
            ]
          : [
              "/en/products/business-laptops",
              "/en/products/mini-pc",
              "/en/products/desktop-computers",
              "/en/products/docking-stations",
              "/en/services/nordic-preparation",
              "/en/condition-and-quality",
              "/en/sell-to-us",
            ];
      const adviceLinks = new Set(
        await detail
          .locator("a[href]")
          .evaluateAll((nodes) => nodes.map((node) => node.getAttribute("href"))),
      );
      assert.deepEqual(
        adviceLinks,
        new Set(adviceDestinations),
        "the consolidated advice preserves its category and further-reading links",
      );
      await summary.click();
      assert.equal(await detail.getAttribute("open"), null, "the buying help can be closed again");

      if (directory) {
        await gallery.screenshot({
          path: join(
            directory,
            `product-categories-${language}-${width}-${javaScriptEnabled ? "js" : "nojs"}.png`,
          ),
          animations: "disabled",
        });
      }
      const laptop = gallery.locator(`a[href='${CATEGORIES[language][0]}']`);
      await laptop.focus();
      assert.ok(
        await laptop.evaluate((element) => element === document.activeElement),
        "the category supports keyboard focus",
      );
      await page.keyboard.press("Enter");
      await page.waitForURL((url) => url.pathname === CATEGORIES[language][0]);
      assert.equal(
        await page.locator("main h1").count(),
        1,
        "one click reaches the laptop category",
      );
      const retailerOptions = page.locator("#laptop-retailer-options");
      const recommendations = page.locator("#external-laptop-recommendations");
      assert.equal(await retailerOptions.count(), 1, "external buying options remain available");
      assert.equal(
        await retailerOptions.evaluate((element) => element.tagName),
        "DETAILS",
        "secondary retailer options use native disclosure",
      );
      assert.equal(
        await retailerOptions.getAttribute("open"),
        null,
        "secondary retailer options are initially quiet after choosing a category",
      );
      assert.equal(
        await recommendations.isVisible(),
        false,
        "external listings do not compete with the primary Kestro model list",
      );
      const retailerSummary = retailerOptions.locator(":scope > summary");
      const retailerTarget = await retailerSummary.boundingBox();
      assert.ok(
        retailerTarget && retailerTarget.width >= 44 && retailerTarget.height >= 44,
        "external retailer options have a touch-sized disclosure control",
      );
      await retailerSummary.click();
      assert.notEqual(
        await retailerOptions.getAttribute("open"),
        null,
        "external buying options open on demand",
      );
      assert.ok(
        await recommendations.isVisible(),
        "recommendations remain readable after the visitor chooses them",
      );
      await page.goBack({ waitUntil: "networkidle" });
      await page.waitForURL((url) => url.pathname === path);
      assert.equal(
        await page.locator(`${GALLERY} ul > li > a[href]`).count(),
        7,
        "Back restores the full category gallery",
      );
      assert.ok(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
        "the browsing journey has no horizontal overflow",
      );
      assert.deepEqual(externalImages, [], "the gallery does not hotlink third-party pictures");
      assert.deepEqual(unexpectedWrites, [], "browsing does not submit an enquiry or purchase");
      assert.deepEqual(pageErrors, [], "the browsing journey has no JavaScript errors");
      console.log(`verify: product browsing passed: ${name}`);
    } catch (error) {
      fail(`product browsing ${name}`, error.stack || error.message);
    } finally {
      closing = true;
      await context.unrouteAll({ behavior: "ignoreErrors" });
      await context.close();
    }
  }

  try {
    for (const language of ["da", "en"]) {
      for (const width of [320, 390, 768, 1024, 1440, 1920]) await scenario(language, width, true);
      await scenario(language, 390, false);
    }
  } finally {
    await Promise.allSettled([...pendingImages]);
    await images.close();
  }
}
