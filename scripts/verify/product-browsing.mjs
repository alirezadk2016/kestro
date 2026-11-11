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
      const links = gallery.locator("a[href]");
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
        actualTargets.add(href.pathname);
        assert.ok(await link.isVisible(), "every category has a visible control");
        const heading = link.getByRole("heading", { level: 3 });
        assert.equal(await heading.count(), 1, "every category keeps its full accessible title");
        assert.ok(await heading.isVisible(), "category titles remain visible at every width");
        const box = await link.boundingBox();
        assert.ok(box && box.width >= 44 && box.height >= 44, "a category is touch-sized");
        assert.ok(box.x >= -1 && box.x + box.width <= width + 1, "the category fits the viewport");
        const image = link.locator("img");
        assert.equal(await image.count(), 1, "a category has one recognisable image");
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
          const painted = element.getBoundingClientRect();
          const well = element.parentElement;
          const frame = well.getBoundingClientRect();
          const control = element.closest("a");
          const card = control.getBoundingClientRect();
          const src = new URL(element.currentSrc);
          return {
            source: src.searchParams.get("url") || src.pathname,
            alt: element.alt,
            wellFits:
              frame.left >= card.left - 1 &&
              frame.right <= card.right + 1 &&
              frame.top >= card.top - 1 &&
              frame.bottom <= card.bottom + 1,
            overflow: getComputedStyle(well).overflow,
            coversWell:
              painted.width > 0 &&
              painted.height > 0 &&
              painted.left <= frame.left + 1 &&
              painted.right >= frame.right - 1 &&
              painted.top <= frame.top + 1 &&
              painted.bottom >= frame.bottom - 1,
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
        assert.ok(photo.source.startsWith("/"), "category artwork is delivered locally");
        assert.match(
          photo.alt,
          /illustration|illustrative/i,
          "category artwork is honestly labelled",
        );
        assert.ok(photo.wellFits, "the image well stays within its category card");
        assert.equal(photo.overflow, "hidden", "the image well clips intentional focus crops");
        assert.ok(photo.coversWell, "the loaded artwork covers the whole image well");
        assert.deepEqual(
          photo.clippedText,
          [],
          "category titles and descriptions fit without clipping",
        );
      }
      assert.deepEqual(actualTargets, new Set(CATEGORIES[language]), "every category appears once");

      const disclosures = [
        [
          "product-buying-choices",
          language === "da"
            ? "Kontor, hjemmearbejde og startup"
            : "Office, home working and startups",
        ],
        [
          "product-purchase-checks",
          language === "da" ? "Stand og batteri" : "Condition and battery",
        ],
      ];
      for (const [id, heading] of disclosures) {
        const detail = page.locator(`#${id}`);
        assert.equal(await detail.count(), 1, "detailed buying help remains available");
        assert.equal(
          await detail.evaluate((element) => element.tagName),
          "DETAILS",
          "help uses native disclosure",
        );
        assert.equal(
          await detail.getAttribute("open"),
          null,
          "long buying help is initially quiet",
        );
        const summary = detail.locator("summary");
        const target = await summary.boundingBox();
        assert.ok(
          target && target.width >= 44 && target.height >= 44,
          "help opens with a touch-sized control",
        );
        await summary.click();
        assert.notEqual(await detail.getAttribute("open"), null, "the native disclosure opens");
        assert.ok(
          await detail.getByText(heading, { exact: true }).isVisible(),
          "the preserved advice is readable",
        );
        assert.ok(
          await detail.locator("a[href]").count(),
          "advice preserves its further reading links",
        );
        await summary.click();
        assert.equal(await detail.getAttribute("open"), null, "the advice can be closed again");
      }

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
      assert.ok(
        await page.locator("#external-laptop-recommendations").isVisible(),
        "recommendations are available after choosing laptops",
      );
      await page.goBack({ waitUntil: "networkidle" });
      await page.waitForURL((url) => url.pathname === path);
      assert.equal(
        await page.locator(`${GALLERY} a[href]`).count(),
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
