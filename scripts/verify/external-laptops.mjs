import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const WIDTHS = [320, 390, 768, 1024, 1440, 1920];
const SECTION = "#external-laptop-recommendations";
const TARGETS = new Set([
  "www.dustin.dk/product/5020082334/thinkpad-t14-g2-pre-owned-meget-god-stand",
  "www.dustin.dk/product/5020100838/elitebook-840-g8-pre-owned-meget-god-stand",
  "www.proshop.dk/Baerbar/Dell-Refurbished-Latitude-5420-14-Core-i5-16GB-256GB-B-Grade/3499860",
]);
const MODEL_PHOTOS = {
  "thinkpad-t14-g2": {
    source: "/models/t14/gen2-intel-reference.webp",
    width: 1600,
    height: 1200,
    alt: /ThinkPad\s+T14.*(?:Gen\s*2|G2)/i,
  },
  "elitebook-840-g8": {
    source: "/models/elitebook/840-g8-reference.webp",
    width: 1280,
    height: 1182,
    alt: /EliteBook\s+840\s+G8/i,
  },
};
const PHOTO_CREDITS = new Set([
  "https://commons.wikimedia.org/wiki/File:ThinkPad_T14.jpg",
  "https://creativecommons.org/publicdomain/zero/1.0/",
  "https://commons.wikimedia.org/wiki/File:HP_EliteBook_840_G8.png",
  "https://creativecommons.org/licenses/by-sa/4.0/",
]);

/** Recommendations send the buyer to another merchant, never to a Kestro checkout. */
export async function verifyExternalLaptops(browser, base, fail) {
  console.log("verify: external laptop recommendations and honest merchant handoff");
  const origin = new URL(base);
  assert.ok(
    ["localhost", "127.0.0.1", "[::1]"].includes(origin.hostname),
    "external laptop verification is local only",
  );
  const directory = process.env.VERIFY_ARTIFACT_DIR && resolve(process.env.VERIFY_ARTIFACT_DIR);
  if (directory) {
    const repository = fileURLToPath(new URL("../../", import.meta.url));
    const fromRepository = relative(repository, directory);
    assert.ok(
      fromRepository.startsWith("..") || isAbsolute(fromRepository),
      "laptop screenshots must stay outside the repository",
    );
    await mkdir(directory, { recursive: true });
  }

  // Retain local optimizer sockets independently of the visitor. Closing a
  // scenario must not strand a resize that a later scenario needs.
  const images = await browser.newContext();
  const pendingImages = new Set();

  async function scenario(language, path, width, javaScriptEnabled) {
    const name = `${language} ${width}px ${javaScriptEnabled ? "JS" : "no JS"}`;
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
      assert.equal(response?.status(), 200, "the laptop category is available");
      await page.evaluate(() => document.fonts.ready);
      const introduction = page.locator("main > section").first();
      assert.equal(
        await introduction.locator("a[href='#models']").count(),
        0,
        "a redundant jump control does not push the directly following models further down",
      );
      const catalogue = page.locator("#models [data-catalogue='models']");
      assert.equal(await catalogue.count(), 1, "one primary Kestro model catalogue is available");
      assert.ok(
        await introduction.evaluate((element) => element.nextElementSibling?.id === "models"),
        "the actual model collection follows the introduction without an intervening product shelf",
      );
      const firstModel = catalogue.locator("li[data-catalogue-item]").first();
      assert.ok(
        await firstModel.isVisible(),
        "model choices are rendered on arrival, including without JavaScript",
      );
      if (width < 640) {
        const position = await firstModel.evaluate((element) => ({
          top: element.getBoundingClientRect().top + window.scrollY,
          scroll: window.scrollY,
        }));
        assert.ok(position.scroll <= 1, "the first model is measured before any browsing scroll");
        assert.ok(
          position.top > 0 && position.top <= 600,
          `a phone visitor reaches the first real model within 600px of the document: ${position.top}px`,
        );
      }
      const section = page.locator(SECTION);
      assert.equal(await section.count(), 1, "one recommendations section is server-rendered");
      const retailerOptions = page.locator("#laptop-retailer-options");
      assert.equal(await retailerOptions.count(), 1, "external buying has one optional entry");
      assert.equal(
        await retailerOptions.evaluate((element) => element.tagName),
        "DETAILS",
        "retailer choices use a native disclosure",
      );
      assert.equal(
        await retailerOptions.getAttribute("open"),
        null,
        "a second product collection is not expanded by default",
      );
      assert.equal(await section.isVisible(), false, "retailer cards wait for an explicit choice");
      assert.equal(await catalogue.count(), 1, "the category has one main model catalogue");
      assert.equal(
        await page.locator("#models #laptop-model-library").count(),
        1,
        "the old library fragment aliases the actual model collection",
      );
      assert.equal(
        await page.locator("details#laptop-model-library").count(),
        0,
        "the duplicate model library is removed",
      );
      assert.ok(
        await page.locator("#models").evaluate((element) => {
          const external = document.querySelector("#laptop-retailer-options");
          return (
            external &&
            Boolean(element.compareDocumentPosition(external) & Node.DOCUMENT_POSITION_FOLLOWING)
          );
        }),
        "the actual catalogue precedes optional retailer choices",
      );
      const retailerSummary = retailerOptions.locator(":scope > summary");
      const retailerTarget = await retailerSummary.boundingBox();
      assert.ok(
        retailerTarget && retailerTarget.width >= 44 && retailerTarget.height >= 44,
        "retailer choices open with a touch-sized summary",
      );
      await retailerSummary.click();
      assert.notEqual(
        await retailerOptions.getAttribute("open"),
        null,
        "one click reveals retailer choices",
      );
      assert.ok(await section.isVisible(), "recommendations remain accessible when requested");
      const cards = section.locator("[data-external-laptop]");
      assert.equal(await cards.count(), 3, "three distinct recommendations are available");
      const featured = section.locator("[data-featured-laptop]");
      assert.equal(
        await featured.count(),
        2,
        "two primary choices have accurate model photography",
      );
      assert.equal(
        await section.locator("img").count(),
        2,
        "featured recommendations each show one licensed model photograph",
      );
      assert.equal(
        await section.locator("canvas").count(),
        0,
        "a synthetic rotating model does not replace product photography",
      );
      assert.equal(
        await section.locator("form,button,input,select,textarea").count(),
        0,
        "there is no local checkout or add-to-cart control",
      );

      const text = await section.innerText();
      assert.match(
        text,
        language === "da" ? /ikke\s+Kestros\s+lager/i : /not\s+Kestro\s+stock/i,
        "the external offers cannot be mistaken for Kestro stock",
      );
      assert.match(
        text,
        language === "da"
          ? /købet\s+foregår\s+hos\s+forhandleren/i
          : /purchases\s+are\s+made\s+with\s+the\s+retailer/i,
        "the buyer is told who handles the purchase",
      );
      assert.match(
        text,
        language === "da" ? /modelfotos/i : /model\s+photos/i,
        "model photography is distinguished from seller unit photography",
      );
      assert.doesNotMatch(
        text,
        /\b(?:\d[\d.,\s]*\s*(?:DKK|kr\.?)|DKK\s*\d)\b/i,
        "unconnected third-party prices are not presented as live quotes",
      );
      assert.doesNotMatch(
        text,
        /\b(?:på\s+lager|in\s+stock)\b/i,
        "the page does not make a persistent live-stock claim",
      );

      const actualTargets = new Set();
      const links = section.locator("a[data-merchant-link]");
      assert.equal(await links.count(), 3, "each card has one clear merchant destination");
      for (const card of await cards.all()) {
        const heading = card.getByRole("heading", { level: 3 });
        assert.equal(await heading.count(), 1, "each recommendation names its model");
        assert.ok((await heading.innerText()).trim(), "a model title is readable");
        const link = card.locator("a[data-merchant-link]");
        assert.equal(
          await link.count(),
          1,
          "each recommendation keeps a single buying destination",
        );
        assert.ok(await link.isVisible(), "the merchant link is visible without a hover");
        const href = new URL(await link.getAttribute("href"));
        assert.equal(href.protocol, "https:", "merchant links use HTTPS");
        assert.ok(
          TARGETS.has(href.hostname + href.pathname),
          "the link is the verified product SKU",
        );
        actualTargets.add(href.hostname + href.pathname);
        assert.equal(await link.getAttribute("target"), "_blank", "merchant opens in another tab");
        assert.ok(
          ((await link.getAttribute("rel")) ?? "").split(/\s+/).includes("noopener"),
          "the merchant cannot control the Kestro tab",
        );
        const box = await link.boundingBox();
        assert.ok(box && box.width >= 44 && box.height >= 44, "merchant action has a 44px target");
        const layout = await card.evaluate((element) => {
          const box = element.getBoundingClientRect();
          const clipped = [...element.querySelectorAll("h3,p,a")].some((child) => {
            const style = getComputedStyle(child);
            return (
              Number.parseFloat(style.fontSize) < 12 || child.scrollWidth > child.clientWidth + 2
            );
          });
          return { left: box.left, right: box.right, width: box.width, clipped };
        });
        assert.ok(
          layout.width > 0 && layout.left >= -1 && layout.right <= width + 1,
          "each card fits its viewport",
        );
        assert.equal(layout.clipped, false, "card titles and actions are not clipped or too small");
        const id = await card.getAttribute("data-external-laptop");
        const expectedPhoto = MODEL_PHOTOS[id];
        if (expectedPhoto) {
          const image = card.locator("img");
          assert.equal(await image.count(), 1, "the featured model has one real photo");
          await image.scrollIntoViewIfNeeded();
          const handle = await image.elementHandle();
          try {
            await page.waitForFunction(async (element) => {
              if (!element?.complete || !element.naturalWidth) return false;
              await element.decode();
              return true;
            }, handle);
          } finally {
            await handle?.dispose();
          }
          const photo = await image.evaluate((element) => {
            const box = element.getBoundingClientRect();
            const frame = element.parentElement.getBoundingClientRect();
            const source = new URL(element.currentSrc);
            return {
              source: source.searchParams.get("url") || source.pathname,
              width: Number(element.getAttribute("width")),
              height: Number(element.getAttribute("height")),
              alt: element.alt,
              fit: getComputedStyle(element).objectFit,
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
            photo.source,
            expectedPhoto.source,
            "the photograph is the verified exact model",
          );
          assert.equal(photo.width, expectedPhoto.width, "photo width matches the licensed asset");
          assert.equal(
            photo.height,
            expectedPhoto.height,
            "photo height matches the licensed asset",
          );
          assert.match(
            photo.alt,
            expectedPhoto.alt,
            "the alternative text identifies the real model",
          );
          assert.equal(photo.fit, "contain", "the product photograph is not cropped or distorted");
          assert.ok(photo.fits, "the photo fits its frame");
        } else {
          assert.equal(id, "latitude-5420", "an unpictured alternative is the checked Dell model");
          assert.equal(
            await card.locator("img").count(),
            0,
            "a different Dell generation is not used as a fake photo",
          );
          const detail = card.locator("details");
          if (await detail.count()) {
            const summary = detail.locator("summary");
            const target = await summary.boundingBox();
            assert.ok(
              target && target.width >= 44 && target.height >= 44,
              "alternative specifications have a touch-sized disclosure",
            );
            await summary.click();
            assert.notEqual(
              await detail.getAttribute("open"),
              null,
              "the alternative specifications can be read without JavaScript",
            );
          }
          const detailText = await card.innerText();
          assert.match(
            detailText,
            /(?:i5-1145G7)/i,
            "the compact alternative preserves its exact processor",
          );
          assert.match(
            detailText,
            /256\s*GB/i,
            "the compact alternative preserves its checked SSD size",
          );
          assert.match(
            detailText,
            /70\s*%/i,
            "the compact alternative preserves its battery limitation",
          );
          assert.match(
            detailText,
            language === "da" ? /skærmspor/i : /marks\s+on\s+the\s+screen/i,
            "the compact alternative preserves its visible wear limitation",
          );
        }
      }
      assert.equal(actualTargets.size, 3, "recommendations point to three different products");

      const credits = section.locator("details[data-photo-credits]");
      assert.equal(await credits.count(), 1, "photo attribution has one native disclosure");
      const creditSummary = credits.locator("summary");
      const creditTarget = await creditSummary.boundingBox();
      assert.ok(
        creditTarget && creditTarget.width >= 44 && creditTarget.height >= 44,
        "photo credits are accessible by touch",
      );
      await creditSummary.click();
      assert.notEqual(
        await credits.getAttribute("open"),
        null,
        "photo credits open without JavaScript",
      );
      const creditText = await credits.innerText();
      assert.match(creditText, /Edvard10/, "the T14 photographer is credited");
      assert.match(creditText, /Infinatious/, "the EliteBook photographer is credited");
      const creditLinks = await credits
        .locator("a[href]")
        .evaluateAll((nodes) => nodes.map((node) => node.href));
      assert.deepEqual(
        new Set(creditLinks),
        PHOTO_CREDITS,
        "both model photos retain their source and licence links",
      );
      for (const link of await credits.locator("a[href]").all()) {
        assert.ok(await link.isVisible(), "the attribution link is readable when opened");
        const target = await link.boundingBox();
        assert.ok(
          target && target.width >= 44 && target.height >= 44,
          "attribution links are touch-sized",
        );
      }
      await creditSummary.click();

      // Detailed comparison remains a deliberate second step, including in a
      // script-disabled browser, rather than disappearing when the page is simplified.
      if ([390, 1440].includes(width)) {
        for (const [id, content] of [
          [
            "laptop-buying-help",
            "a[href*='check-a-used-laptop'],a[href*='tjek-brugt-baerbar-foer-koeb']",
          ],
        ]) {
          const detail = page.locator(`#${id}`);
          assert.equal(await detail.count(), 1, "secondary buying guidance remains available");
          assert.equal(
            await detail.evaluate((element) => element.tagName),
            "DETAILS",
            "secondary guidance uses a native disclosure",
          );
          assert.equal(await detail.getAttribute("open"), null, "secondary guidance starts closed");
          const summary = detail.locator(":scope > summary");
          const target = await summary.boundingBox();
          assert.ok(
            target && target.width >= 44 && target.height >= 44,
            "secondary guidance is touch-sized",
          );
          await summary.click();
          assert.notEqual(
            await detail.getAttribute("open"),
            null,
            "secondary guidance opens without JavaScript",
          );
          assert.ok(
            await detail.locator(content).first().isVisible(),
            "comparison links remain usable when requested",
          );
          await summary.click();
          assert.equal(await detail.getAttribute("open"), null, "secondary guidance closes again");
        }
      }

      if (directory) {
        await section.screenshot({
          path: join(
            directory,
            `laptop-recommendations-${language}-${width}-${javaScriptEnabled ? "js" : "nojs"}.png`,
          ),
          animations: "disabled",
        });
      }

      const offers = await page
        .locator("script[type='application/ld+json']")
        .evaluateAll((nodes) => {
          const found = [];
          const visit = (value) => {
            if (!value || typeof value !== "object") return;
            if (Array.isArray(value)) return value.forEach(visit);
            const types = Array.isArray(value["@type"]) ? value["@type"] : [value["@type"]];
            if (types.some((type) => /^(?:Offer|AggregateOffer)$/.test(type ?? "")))
              found.push(value);
            Object.values(value).forEach(visit);
          };
          nodes.forEach((node) => visit(JSON.parse(node.textContent)));
          return found;
        });
      assert.equal(
        offers.length,
        0,
        "editorial links do not become a fabricated Kestro sales offer",
      );

      const anchor = page.locator("main > section").first().locator(`a[href='${SECTION}']`);
      assert.equal(
        await anchor.count(),
        1,
        "the category introduction offers a direct route to recommendations",
      );
      const anchorBox = await anchor.boundingBox();
      assert.ok(
        anchorBox && anchorBox.width >= 44 && anchorBox.height >= 44,
        "the jump action is touch-sized",
      );
      await retailerSummary.click();
      assert.equal(
        await retailerOptions.getAttribute("open"),
        null,
        "retailer choices can be closed before using the direct jump",
      );
      await anchor.click();
      await page.waitForURL((url) => url.pathname === path && url.hash === SECTION);
      await page.waitForFunction(() => {
        if (!document.querySelector("#laptop-retailer-options")?.open) return false;
        const heading = document.querySelector("#external-laptops-heading");
        if (!heading) return false;
        const box = heading.getBoundingClientRect();
        const header = document.querySelector("body > header")?.getBoundingClientRect();
        return box.top >= (header?.bottom ?? 0) - 1 && box.bottom <= innerHeight;
      });
      assert.ok(
        await section.isVisible(),
        "the header jump reveals the closed disclosure in one click, including without JavaScript",
      );
      if ([390, 1440].includes(width)) {
        const fresh = await context.newPage();
        fresh.on("pageerror", (error) => pageErrors.push(error.message));
        try {
          const direct = await fresh.goto(base + path + SECTION, { waitUntil: "networkidle" });
          assert.equal(
            direct?.status(),
            200,
            "a shared retailer fragment keeps its existing route",
          );
          await fresh.evaluate(() => document.fonts.ready);
          await fresh.waitForFunction(() => {
            const disclosure = document.querySelector("#laptop-retailer-options");
            const heading = document.querySelector("#external-laptops-heading");
            if (!disclosure?.open || !heading) return false;
            const box = heading.getBoundingClientRect();
            const header = document.querySelector("body > header")?.getBoundingClientRect();
            return box.top >= (header?.bottom ?? 0) - 1 && box.bottom <= innerHeight;
          });
          assert.ok(
            await fresh.locator(SECTION).isVisible(),
            "a fresh fragment URL natively reveals recommendations with or without JavaScript",
          );
        } finally {
          await fresh.close();
        }
      }
      assert.ok(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
        "the category has no horizontal overflow",
      );
      assert.deepEqual(externalImages, [], "no retailer product image was requested");
      assert.deepEqual(
        unexpectedWrites,
        [],
        "the recommendation journey makes no purchase request",
      );
      assert.deepEqual(pageErrors, [], "the category has no JavaScript errors");
      console.log(`verify: external laptops passed: ${name}`);
    } catch (error) {
      fail(`external laptops ${name}`, error.stack || error.message);
    } finally {
      closing = true;
      await context.unrouteAll({ behavior: "ignoreErrors" });
      await context.close();
    }
  }

  try {
    for (const [language, path] of [
      ["da", "/produkter/baerbare-computere"],
      ["en", "/en/products/business-laptops"],
    ]) {
      for (const width of WIDTHS) await scenario(language, path, width, true);
      await scenario(language, path, 390, false);
    }
  } finally {
    await Promise.allSettled([...pendingImages]);
    await images.close();
  }
}
