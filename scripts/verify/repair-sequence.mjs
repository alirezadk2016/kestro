import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import sharp from "sharp";

const STAGES = [
  ["cover", "/images/repairs/ram-01-cover.webp"],
  ["open", "/images/repairs/ram-02-open.webp"],
  ["removed", "/images/repairs/ram-03-removed.webp"],
  ["installed", "/images/repairs/ram-04-installed.webp"],
];
const WIDTHS = [320, 390, 768, 1440, 1920];

/** The repair sequence uses the browser's radio behaviour, including without JS. */
export async function verifyRepairSequence(browser, base, fail) {
  console.log("verify: bilingual repair photographs, native controls and no-JS behaviour");
  const origin = new URL(base);
  assert.ok(
    ["localhost", "127.0.0.1", "[::1]"].includes(origin.hostname),
    "repair verification is local only",
  );

  // Check decoded pixels, rather than file bytes: a renamed copy or a metadata
  // change cannot stand in for the four different service photographs.
  const fingerprints = [];
  for (const [, source] of STAGES) {
    const file = new URL(`../../public${source}`, import.meta.url);
    const bytes = await readFile(file);
    const metadata = await sharp(bytes).metadata();
    assert.equal(metadata.width, 1200, `${source} has the promised intrinsic width`);
    assert.equal(metadata.height, 900, `${source} has the promised intrinsic height`);
    fingerprints.push(
      createHash("sha256")
        .update(await sharp(bytes).raw().toBuffer())
        .digest("hex"),
    );
  }
  assert.equal(
    new Set(fingerprints).size,
    4,
    "all four stages have different decoded image pixels",
  );

  // A request on this context must finish even if its visitor closes. Next's
  // local optimizer reuses the visitor's socket; aborting a resize poisons the
  // shared cache and makes a later scenario wait forever for the same image.
  const images = await browser.newContext();
  const pendingImages = new Set();
  const localizedText = new Map();

  async function scenario(language, path, width, javaScriptEnabled) {
    const name = `${language} ${width}px ${javaScriptEnabled ? "JS" : "no JS"}`;
    const context = await browser.newContext({
      viewport: { width, height: 1000 },
      javaScriptEnabled,
      reducedMotion: "no-preference",
      locale: language === "da" ? "da-DK" : "en-GB",
    });
    context.setDefaultTimeout(15000);
    context.setDefaultNavigationTimeout(30000);
    const graphicsRequests = [];
    const routingErrors = [];
    let closing = false;
    await context.addInitScript(() => {
      localStorage.setItem("kestro-consent", "denied");
      localStorage.setItem("kestro-lang-hint", "1");
      window.__repairWebGLRequests = [];
      const getContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (kind, ...args) {
        if (/webgl/i.test(String(kind))) window.__repairWebGLRequests.push(String(kind));
        return getContext.call(this, kind, ...args);
      };
    });
    await context.route("**/*", async (route) => {
      const request = route.request();
      try {
        const url = new URL(request.url());
        if (url.origin !== origin.origin) return await route.abort();
        if (/\/models\/|\.(?:glb|gltf|ktx2?|hdr|exr)(?:$|\?)/i.test(url.href))
          graphicsRequests.push(url.href);
        if (!["GET", "HEAD"].includes(request.method())) {
          if (url.pathname === "/api/track") return await route.fulfill({ status: 204 });
          routingErrors.push(`Unexpected write: ${request.method()} ${url.pathname}`);
          return await route.abort();
        }
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
        routingErrors.push(`${request.url()}: ${error.message}`);
        await route.abort().catch(() => {});
      }
    });
    const page = await context.newPage();
    page.on("pageerror", (error) => fail(`repair sequence ${name}`, error.message));

    try {
      const response = await page.goto(base + path, { waitUntil: "networkidle" });
      assert.equal(response?.status(), 200, "the repair route responds successfully");
      assert.equal(
        await page.locator("html").getAttribute("lang"),
        language === "da" ? "da-DK" : "en",
      );
      const sequence = page.locator("[data-repair-sequence]");
      assert.equal(await sequence.count(), 1, "one repair sequence is rendered");
      await sequence.scrollIntoViewIfNeeded();
      const radios = sequence.locator("input[type='radio']");
      assert.equal(await radios.count(), 4, "all four native stages exist on every viewport");
      assert.equal(
        await sequence.locator("fieldset").count(),
        1,
        "the controls form a native fieldset",
      );
      assert.ok(
        (await sequence.locator("legend").innerText()).trim(),
        "the radio group has a legend",
      );
      assert.equal(
        await sequence.locator("button, input[type='range'], canvas, [role='tab']").count(),
        0,
        "the sequence has no activation, orbit, slider or simulated tab controls",
      );
      assert.equal(await page.locator("main canvas").count(), 0, "repair has no canvas renderer");
      const native = await radios.evaluateAll((inputs) =>
        inputs.map((input) => ({
          id: input.id,
          name: input.name,
          value: input.value,
          disabled: input.disabled,
          tabIndex: input.tabIndex,
        })),
      );
      assert.deepEqual(
        native.map((input) => input.value),
        STAGES.map(([stage]) => stage),
      );
      assert.equal(
        new Set(native.map((input) => input.name)).size,
        1,
        "native radios share one group",
      );
      assert.ok(
        native.every((input) => input.name && input.id && !input.disabled && input.tabIndex >= 0),
        "every stage has an enabled, keyboard-focusable native input",
      );
      assert.equal(new Set(native.map((input) => input.id)).size, 4, "stage IDs are unique");
      const text = [];
      for (const { id, value } of native) {
        const label = sequence.locator(`label[for='${id}']`);
        const radio = sequence.locator(`input[value='${value}']`);
        const panel = sequence.locator(`[data-repair-panel='${value}']`);
        const caption = sequence.locator(`[data-repair-caption='${value}']`);
        assert.equal(await label.count(), 1, `${value} has one associated label`);
        assert.equal(await panel.count(), 1, `${value} has one photo panel`);
        assert.equal(await caption.count(), 1, `${value} has one caption`);
        assert.equal(
          await radio.getAttribute("aria-controls"),
          await panel.getAttribute("id"),
          `${value} identifies the photo it controls`,
        );
        assert.equal(
          await radio.getAttribute("aria-describedby"),
          await caption.getAttribute("id"),
          `${value} identifies its matching caption`,
        );
        const labelText = (await label.innerText()).trim();
        assert.ok(labelText, `${value} has an accessible label`);
        const box = await label.boundingBox();
        assert.ok(box && box.width >= 44 && box.height >= 44, `${value} has a 44px tap target`);
        text.push({
          label: labelText,
          alt: await sequence.locator(`[data-repair-panel='${value}'] img`).getAttribute("alt"),
          caption: (
            await sequence.locator(`[data-repair-caption='${value}']`).textContent()
          ).trim(),
        });
      }
      for (const key of ["label", "alt", "caption"]) {
        assert.ok(
          text.every((stage) => stage[key]?.trim()),
          `each stage has its own ${key}`,
        );
        assert.equal(
          new Set(text.map((stage) => stage[key])).size,
          4,
          `stage ${key}s are distinct`,
        );
      }
      assert.ok(
        text.every((stage) => stage.caption.length <= 200),
        "captions stay short",
      );
      if (!localizedText.has(language)) localizedText.set(language, text);
      else
        assert.deepEqual(
          text,
          localizedText.get(language),
          "language content is consistent across devices and JS settings",
        );
      const disclosure = sequence.locator("[data-repair-disclosure]");
      assert.equal(await disclosure.count(), 1, "one AI illustration disclosure is present");
      assert.ok(await disclosure.isVisible(), "the AI illustration disclosure is visible");
      assert.match(await disclosure.innerText(), /AI/i, "generated illustrations are disclosed");
      assert.match(
        await disclosure.innerText(),
        /illustration/i,
        "the disclosure identifies illustrations",
      );

      const frame = sequence.locator("[data-repair-frame]");
      assert.equal(await frame.count(), 1, "one fixed photo frame is present");
      const initialFrame = await frame.boundingBox();
      const initialPosition = await frame.evaluate((frame) => {
        const box = frame.getBoundingClientRect();
        return { left: box.left + scrollX, top: box.top + scrollY };
      });
      assert.ok(
        initialFrame && initialFrame.width > 0 && initialFrame.height > 0,
        "the photo frame is visible",
      );
      assert.ok(
        Math.abs(initialFrame.width / initialFrame.height - 4 / 3) < 0.01,
        "the frame has a 4:3 ratio",
      );

      async function assertStage(stage) {
        const active = await sequence.evaluate((root) => {
          const visible = (node) => {
            for (let ancestor = node; ancestor; ancestor = ancestor.parentElement) {
              const style = getComputedStyle(ancestor);
              if (
                style.display === "none" ||
                style.visibility === "hidden" ||
                Number(style.opacity) === 0
              )
                return false;
            }
            const box = node.getBoundingClientRect();
            return box.width > 0 && box.height > 0;
          };
          return {
            checked: [...root.querySelectorAll("input[type='radio']:checked")].map(
              (radio) => radio.value,
            ),
            panels: [...root.querySelectorAll("[data-repair-panel]")]
              .filter(visible)
              .map((panel) => panel.dataset.repairPanel),
            captions: [...root.querySelectorAll("[data-repair-caption]")]
              .filter(visible)
              .map((caption) => caption.dataset.repairCaption),
            images: [...root.querySelectorAll("[data-repair-panel] img")].filter(visible).length,
          };
        });
        assert.deepEqual(
          active,
          { checked: [stage], panels: [stage], captions: [stage], images: 1 },
          `${stage} checked state, single photo and caption agree`,
        );
        const image = sequence.locator(`[data-repair-panel='${stage}'] img`);
        await image.scrollIntoViewIfNeeded();
        // Hydration can replace a lazy image or clear currentSrc after decode()
        // resolves for its previous resource. Re-find the live node on every
        // poll, then capture the source and dimensions in the same stable decode.
        // waitForFunction polls a predicate's immediate truthiness: an async
        // predicate's Promise stops the poll even when it later resolves false.
        // Keep readiness synchronous and retry decoding within one deadline.
        const selector = `[data-repair-sequence] [data-repair-panel='${stage}'] img`;
        const deadline = Date.now() + 15000;
        let rendered;
        while (!rendered) {
          const remaining = deadline - Date.now();
          assert.ok(remaining > 0, `${stage} image did not retain a stable decoded resource`);
          const ready = await page.waitForFunction(
            (selector) => {
              const image = document.querySelector(selector);
              if (!image?.currentSrc?.trim() || !image.complete || !image.naturalWidth)
                return false;
              try {
                new URL(image.currentSrc, location.href);
              } catch {
                return false;
              }
              return image;
            },
            selector,
            { polling: 100, timeout: remaining },
          );
          try {
            rendered = await ready.evaluate(async (image, selector) => {
              const currentSrc = image.currentSrc;
              if (!currentSrc?.trim() || !image.complete || !image.naturalWidth) return null;
              let url;
              try {
                url = new URL(currentSrc, location.href);
                await image.decode();
              } catch {
                return null;
              }
              if (
                !image.isConnected ||
                image !== document.querySelector(selector) ||
                image.currentSrc !== currentSrc ||
                !image.complete ||
                !image.naturalWidth
              )
                return null;
              const box = image.getBoundingClientRect();
              return {
                source: url.searchParams.get("url") || url.pathname,
                width: Number(image.getAttribute("width")),
                height: Number(image.getAttribute("height")),
                ratio: image.naturalWidth / image.naturalHeight,
                box: { width: box.width, height: box.height },
              };
            }, selector);
          } finally {
            await ready.dispose();
          }
        }
        assert.equal(
          rendered.source,
          STAGES.find(([value]) => value === stage)[1],
          `${stage} displays its intended image`,
        );
        assert.equal(rendered.width, 1200, `${stage} declares the real image width`);
        assert.equal(rendered.height, 900, `${stage} declares the real image height`);
        assert.ok(
          Math.abs(rendered.ratio - 4 / 3) < 0.01,
          `${stage} decodes without an aspect-ratio change`,
        );
        const box = await frame.boundingBox();
        const position = await frame.evaluate((frame) => {
          const box = frame.getBoundingClientRect();
          return { left: box.left + scrollX, top: box.top + scrollY };
        });
        assert.ok(
          box &&
            Math.abs(box.width - initialFrame.width) <= 1 &&
            Math.abs(box.height - initialFrame.height) <= 1,
          `${stage} does not resize the photo frame`,
        );
        assert.ok(
          Math.abs(position.left - initialPosition.left) <= 1 &&
            Math.abs(position.top - initialPosition.top) <= 1,
          `${stage} keeps the frame in the same page position`,
        );
        assert.ok(
          Math.abs(rendered.box.width - box.width) <= 2 &&
            Math.abs(rendered.box.height - box.height) <= 2,
          `${stage} fills the same fixed frame`,
        );
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - innerWidth,
        );
        assert.ok(
          overflow <= 1,
          `${stage} does not cause page overflow at ${width}px (${overflow}px)`,
        );
      }

      await assertStage("open");
      for (const { id, value } of native) {
        const label = sequence.locator(`label[for='${id}']`);
        await label.scrollIntoViewIfNeeded();
        assert.ok(
          await label.evaluate((label) => {
            const box = label.getBoundingClientRect();
            const hit = document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2);
            return hit && (label === hit || label.contains(hit));
          }),
          `${value} label can be tapped without an overlay`,
        );
        await label.click();
        await assertStage(value);
      }

      // Arrow keys are sent to the native radio itself. This must work in the
      // script-disabled context too; there is no click() or JS checked mutation.
      await sequence.locator(`label[for='${native[1].id}']`).click();
      await radios.nth(1).focus();
      for (const stage of ["removed", "installed", "cover", "open"]) {
        await page.keyboard.press("ArrowRight");
        await assertStage(stage);
        const focus = await sequence.locator(`input[value='${stage}']`).evaluate((radio) => {
          const label = radio.labels[0];
          const style = getComputedStyle(label);
          return {
            visible: radio.matches(":focus-visible"),
            outlined:
              parseFloat(style.outlineWidth) >= 2 &&
              style.outlineStyle !== "none" &&
              style.outlineColor !== "rgba(0, 0, 0, 0)",
          };
        });
        assert.deepEqual(
          focus,
          { visible: true, outlined: true },
          `${stage} has a visible keyboard focus outline`,
        );
      }
      for (const stage of ["cover", "installed", "removed", "open"]) {
        await page.keyboard.press("ArrowLeft");
        await assertStage(stage);
      }

      await page.emulateMedia({ reducedMotion: "reduce" });
      await sequence.locator(`label[for='${native[2].id}']`).click();
      await assertStage("removed");
      const motion = await sequence.evaluate((root) => {
        const positiveTime = (value) => value.split(",").some((part) => parseFloat(part) > 0);
        return {
          running: root
            .getAnimations({ subtree: true })
            .filter((animation) => animation.playState === "running").length,
          animated: [root, ...root.querySelectorAll("*")].filter((element) => {
            const style = getComputedStyle(element);
            return (
              (style.animationName !== "none" && positiveTime(style.animationDuration)) ||
              (style.transitionProperty !== "none" && positiveTime(style.transitionDuration))
            );
          }).length,
        };
      });
      assert.deepEqual(
        motion,
        { running: 0, animated: 0 },
        "reduced motion has no gallery animation or transition",
      );
      assert.deepEqual(
        await page.evaluate(() => window.__repairWebGLRequests || []),
        [],
        "repair never starts a WebGL context",
      );
      assert.deepEqual(graphicsRequests, [], "repair never fetches 3D models or textures");

      const enquiry = page.locator("#reparation-formular");
      assert.equal(await enquiry.count(), 1, "the repair enquiry destination is preserved");
      const action = page.locator(`main a[href='${path}#reparation-formular']`).first();
      assert.ok(await action.count(), "repair still links to its own enquiry form");
      await action.click();
      await page.waitForURL((url) => url.pathname === path && url.hash === "#reparation-formular");
      await enquiry.waitFor({ state: "visible" });
      assert.equal(
        await page.locator("form[action='/api/kontakt']").count(),
        1,
        "the enquiry form remains on the page",
      );
      assert.equal(
        await page.locator("input[name='virksomhed']").evaluate((input) => input.required),
        false,
        "private repair customers do not need a company",
      );
      assert.deepEqual(routingErrors, [], "local requests completed without unexpected writes");
      console.log(`verify: repair sequence passed: ${name}`);
    } catch (error) {
      fail(`repair sequence ${name}`, error.stack ?? error.message);
    } finally {
      closing = true;
      await context.unrouteAll({ behavior: "ignoreErrors" });
      await context.close();
    }
  }

  try {
    for (const [language, path] of [
      ["da", "/reparation"],
      ["en", "/en/repairs"],
    ]) {
      for (const width of WIDTHS) {
        for (const javaScriptEnabled of [true, false])
          await scenario(language, path, width, javaScriptEnabled);
      }
    }
    const danish = localizedText.get("da");
    const english = localizedText.get("en");
    assert.ok(danish && english, "both repair language variants were read");
    for (const key of ["label", "alt", "caption"])
      assert.ok(
        danish.every((stage, index) => stage[key] !== english[index][key]),
        `all four ${key}s are localized`,
      );
  } finally {
    await Promise.allSettled([...pendingImages]);
    await images.close();
  }
}
