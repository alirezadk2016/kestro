import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/** Check the real delivered images without running a server or reaching a public host. */
export async function verifySiteImages(browser, base, fail) {
  console.log("verify: guide image framing and metadata");
  const origin = new URL(base);
  assert.ok(
    ["127.0.0.1", "localhost", "[::1]"].includes(origin.hostname),
    "image verification is local only",
  );
  const directory = process.env.VERIFY_ARTIFACT_DIR && resolve(process.env.VERIFY_ARTIFACT_DIR);
  if (directory) {
    const repository = fileURLToPath(new URL("../../", import.meta.url));
    const fromRepository = relative(repository, directory);
    assert.ok(
      fromRepository.startsWith("..") || isAbsolute(fromRepository),
      "image screenshots must stay outside the repository",
    );
    await mkdir(directory, { recursive: true });
  }

  // Keep every optimizer request alive until it finishes, even if its page
  // fails. Closing the visitor's socket mid-resize can poison Next's image cache.
  const images = await browser.newContext();
  const pendingImages = new Set();

  async function scenario(name, options, run) {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      reducedMotion: "reduce",
      ...options,
    });
    context.setDefaultTimeout(15000);
    context.setDefaultNavigationTimeout(30000);
    let closing = false;
    await context.route("**/*", async (route) => {
      const request = route.request();
      try {
        const url = new URL(request.url());
        if (url.origin !== origin.origin) return await route.abort();
        if (request.method() === "GET" && url.pathname === "/_next/image") {
          const fetch = images.request.get(request.url(), {
            maxRedirects: 0,
            headers: await request.allHeaders(),
          });
          pendingImages.add(fetch);
          let response;
          try {
            response = await fetch;
          } finally {
            pendingImages.delete(fetch);
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
          // The production upgrade directive would turn local HTTP requests
          // into nonexistent loopback TLS. Keep the rest of the real policy.
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
        throw error;
      }
    });
    const page = await context.newPage();
    page.on("pageerror", (error) => fail(`images ${name}`, error.stack || error.message));
    try {
      await run(page);
      console.log(`verify: images passed: ${name}`);
    } catch (error) {
      fail(`images ${name}`, error.stack || error.message);
    } finally {
      closing = true;
      await context.unrouteAll({ behavior: "ignoreErrors" });
      await context.close();
    }
  }

  async function visit(page, path, javaScriptEnabled = true) {
    const response = await page.goto(base + path, { waitUntil: "networkidle" });
    assert.equal(response?.status(), 200, `${path} responds successfully`);
    if (javaScriptEnabled) {
      const consent = page.getByRole("button", { name: /^(Kun nødvendige|Necessary only)$/ });
      await consent.waitFor({ state: "visible" });
      await consent.click();
    }
  }

  async function imageReady(page, image) {
    await image.waitFor({ state: "visible" });
    await image.scrollIntoViewIfNeeded();
    const element = await image.elementHandle();
    try {
      await page.waitForFunction(async (image) => {
        if (!image?.complete || !image.naturalWidth) return false;
        await image.decode();
        return true;
      }, element);
    } finally {
      await element?.dispose();
    }
  }

  async function capture(page, name, javaScriptEnabled = true) {
    if (!directory) return;
    await page.waitForFunction(
      async ({ javaScriptEnabled }) => {
        if (javaScriptEnabled) await document.fonts.ready;
        else if (document.fonts.status !== "loaded") return false;
        const visible = [...document.images].filter((image) => {
          const box = image.getBoundingClientRect();
          const style = getComputedStyle(image);
          return (
            box.width > 0 &&
            box.height > 0 &&
            box.bottom > 0 &&
            box.top < innerHeight &&
            style.visibility !== "hidden" &&
            style.opacity !== "0"
          );
        });
        if (!visible.every((image) => image.complete && image.naturalWidth > 0)) return false;
        await Promise.all(visible.map((image) => image.decode()));
        // Script-disabled documents can be inspected and decoded through the
        // utility world, but their page animation callbacks do not run.
        if (javaScriptEnabled)
          await new Promise((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(resolve)),
          );
        return true;
      },
      { javaScriptEnabled },
    );
    await page.screenshot({
      path: join(directory, `kestro-site-images-${name}.png`),
      fullPage: false,
      animations: "disabled",
    });
  }

  async function checkGuide(page, cover) {
    const image = page.locator(".guide-plate img");
    await imageReady(page, image);
    const rendered = await image.evaluate((element) => {
      const box = element.getBoundingClientRect();
      const frame = element.parentElement.getBoundingClientRect();
      return {
        source:
          new URL(element.currentSrc).searchParams.get("url") ||
          new URL(element.currentSrc).pathname,
        width: Number(element.getAttribute("width")),
        height: Number(element.getAttribute("height")),
        naturalRatio: element.naturalWidth / element.naturalHeight,
        fit: getComputedStyle(element).objectFit,
        insideFrame:
          box.left >= frame.left - 1 &&
          box.right <= frame.right + 1 &&
          box.top >= frame.top - 1 &&
          box.bottom <= frame.bottom + 1,
      };
    });
    assert.equal(rendered.source, cover.src, "the intended guide artwork is displayed");
    assert.equal(rendered.width, cover.width, "intrinsic width matches the artwork");
    assert.equal(rendered.height, cover.height, "intrinsic height matches the artwork");
    assert.ok(
      Math.abs(rendered.naturalRatio - cover.width / cover.height) < 0.01,
      "the delivered image retains its natural aspect ratio",
    );
    assert.equal(rendered.fit, "contain", "the full guide subject fits without a cover crop");
    assert.ok(rendered.insideFrame, "the image stays inside its guide frame");

    const metadata = await page.evaluate((src) => {
      const content = (property) =>
        document.querySelector(`meta[property="${property}"]`)?.getAttribute("content");
      const collect = (value) => {
        if (Array.isArray(value)) return value.flatMap(collect);
        if (!value || typeof value !== "object") return [];
        return [value, ...Object.values(value).flatMap(collect)];
      };
      const nodes = [...document.querySelectorAll('script[type="application/ld+json"]')].flatMap(
        (script) => collect(JSON.parse(script.textContent)),
      );
      const article = nodes.find(
        (node) =>
          [node["@type"]].flat().includes("Article") &&
          node.image &&
          new URL(node.image.url, location.origin).pathname === src,
      );
      return {
        image: content("og:image"),
        width: Number(content("og:image:width")),
        height: Number(content("og:image:height")),
        articleImage: article?.image,
      };
    }, cover.src);
    assert.equal(
      new URL(metadata.image).pathname,
      cover.src,
      "Open Graph uses the displayed cover",
    );
    assert.equal(metadata.width, cover.width, "Open Graph width matches the file");
    assert.equal(metadata.height, cover.height, "Open Graph height matches the file");
    assert.ok(metadata.articleImage, "Article schema includes the displayed cover");
    assert.equal(metadata.articleImage.width, cover.width, "Article image width matches the file");
    assert.equal(
      metadata.articleImage.height,
      cover.height,
      "Article image height matches the file",
    );
  }

  const covers = [
    {
      name: "ram",
      src: "/images/practical/ram.webp",
      width: 1200,
      height: 900,
      paths: [
        ["da", "/vejledninger/hvorfor-er-ram-blevet-dyrere"],
        ["en", "/en/knowledge/why-memory-prices-rise"],
      ],
    },
    {
      name: "grade-a",
      src: "/graphics/grade-a.webp",
      width: 720,
      height: 720,
      paths: [
        ["da", "/vejledninger/refurbished-eller-ny-baerbar"],
        ["en", "/en/knowledge/refurbished-or-new-laptop"],
      ],
    },
  ];

  try {
    for (const cover of covers) {
      for (const [language, path] of cover.paths) {
        for (const [device, width, height] of [
          ["mobile", 390, 844],
          ["desktop", 1440, 1000],
        ]) {
          const name = `${cover.name}-${language}-${device}`;
          await scenario(name, { viewport: { width, height } }, async (page) => {
            await visit(page, path);
            await checkGuide(page, cover);
            await capture(page, name);
          });
        }
      }
    }
  } finally {
    await Promise.allSettled([...pendingImages]);
    await images.close();
  }
}
