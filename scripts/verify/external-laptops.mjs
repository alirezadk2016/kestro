import assert from "node:assert/strict";

const WIDTHS = [320, 390, 768, 1024, 1440, 1920];
const SECTION = "#external-laptop-recommendations";
const TARGETS = new Set([
  "www.dustin.dk/product/5020082334/thinkpad-t14-g2-pre-owned-meget-god-stand",
  "www.dustin.dk/product/5020100838/elitebook-840-g8-pre-owned-meget-god-stand",
  "www.proshop.dk/Baerbar/Dell-Refurbished-Latitude-5420-14-Core-i5-16GB-256GB-B-Grade/3499860",
]);

/** Recommendations send the buyer to another merchant, never to a Kestro checkout. */
export async function verifyExternalLaptops(browser, base, fail) {
  console.log("verify: external laptop recommendations and honest merchant handoff");
  const origin = new URL(base);
  assert.ok(
    ["localhost", "127.0.0.1", "[::1]"].includes(origin.hostname),
    "external laptop verification is local only",
  );

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
      const section = page.locator(SECTION);
      assert.equal(await section.count(), 1, "one recommendations section is server-rendered");
      assert.ok(await section.isVisible(), "recommendations are not hidden");
      const cards = section.locator("ul > li");
      assert.equal(await cards.count(), 3, "three distinct recommendations are available");
      assert.equal(
        await section.locator("img,picture,canvas").count(),
        0,
        "editorial recommendations do not copy or hotlink retailer product pictures",
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
      const links = section.locator("a[href]");
      assert.equal(await links.count(), 3, "each card has one clear merchant destination");
      for (const card of await cards.all()) {
        const heading = card.getByRole("heading", { level: 3 });
        assert.equal(await heading.count(), 1, "each recommendation names its model");
        assert.ok((await heading.innerText()).trim(), "a model title is readable");
        const link = card.locator("a[href]");
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
      }
      assert.equal(actualTargets.size, 3, "recommendations point to three different products");

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
      await anchor.click();
      await page.waitForURL((url) => url.pathname === path && url.hash === SECTION);
      await page.waitForFunction(() => {
        const heading = document.querySelector("#external-laptops-heading");
        if (!heading) return false;
        const box = heading.getBoundingClientRect();
        const header = document.querySelector("body > header")?.getBoundingClientRect();
        return box.top >= (header?.bottom ?? 0) - 1 && box.bottom <= innerHeight;
      });
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
