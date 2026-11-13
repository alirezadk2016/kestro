import sharp from "sharp";

export async function verifyVisualPolish(browser, base, fail) {
  console.log("verify: visual interactions and lightweight fallbacks");
  async function visit(context, path, consent = true) {
    const page = await context.newPage();
    page.on("pageerror", (error) => fail(path, error.message));
    const response = await page.goto(base + path, { waitUntil: "networkidle" });
    if (response.status() !== 200) throw new Error(`${path}: HTTP ${response.status()}`);
    if (consent) {
      const refuse = page.getByRole("button", { name: /^(Kun nødvendige|Necessary only)$/ });
      if (await refuse.isVisible()) await refuse.click();
    }
    return page;
  }
  function overflow(page) {
    return page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
  }

  for (const path of ["/", "/en"]) {
    for (const width of [320, 390, 430]) {
      const context = await browser.newContext({
        viewport: { width, height: 844 },
        locale: "en-GB",
      });
      const page = await visit(context, path, false);
      const equipmentHref = path === "/" ? "/produkter" : "/en/products";
      const hero = page.locator("main section").first();
      const action = await hero.locator(`a[href="${equipmentHref}"]`).boundingBox();
      const modal = await page.locator('[role="dialog"]').first().boundingBox();
      if (!action || action.y < 0 || action.y + action.height > (modal?.y ?? 844))
        fail(`${path} ${width}`, "equipment selection link obscured on first visit");
      if (await overflow(page)) fail(`${path} ${width}`, "mobile hero overflows");
      await context.close();
    }
  }

  // Longer budget labels must not merge with the brand or wrap the quote.
  for (const path of ["/produkter", "/en/products"]) {
    const context = await browser.newContext({
      viewport: { width: 1024, height: 800 },
      reducedMotion: "reduce",
    });
    const page = await visit(context, path);
    const header = page.locator("header");
    const brand = await header
      .locator("a")
      .filter({ hasText: /^Kestro$/ })
      .boundingBox();
    const navigation = await header.locator("nav").first().boundingBox();
    if (!brand || !navigation || navigation.x - (brand.x + brand.width) < 12)
      fail(`${path} 1024`, "desktop navigation touches the brand");
    const quoteHref = path.startsWith("/en") ? "/en/get-a-quote" : "/tilbud";
    const quoteLines = await header
      .locator(`a[href="${quoteHref}"]`)
      .first()
      .evaluate((link) => {
        const walker = document.createTreeWalker(link, NodeFilter.SHOW_TEXT);
        let node;
        let lines = 0;
        while ((node = walker.nextNode())) {
          if (!node.textContent.trim()) continue;
          const range = document.createRange();
          range.selectNodeContents(node);
          lines = Math.max(lines, range.getClientRects().length);
        }
        return lines;
      });
    if (quoteLines !== 1) fail(`${path} 1024`, "desktop quote action wraps onto multiple lines");
    if (await overflow(page)) fail(`${path} 1024`, "desktop navigation page overflows");
    await context.close();
  }

  // The natural-height hero leads to equipment, then three static evidence
  // links. Keep both the normal and enlarged-text layouts inside their bands.
  for (const path of ["/", "/en"]) {
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      reducedMotion: "reduce",
    });
    const page = await visit(context, path);
    const proofHrefs =
      path === "/"
        ? ["/kvalitet", "/ydelser/nordisk-tilpasning", "/tilbud-eksempel"]
        : ["/en/condition-and-quality", "/en/services/nordic-preparation", "/en/sample-quote"];
    async function homepageClipping() {
      return page.evaluate((hrefs) => {
        const main = document.querySelector("main");
        const hero = main.querySelector("section");
        const gateway = hero.nextElementSibling;
        const strip = [...main.children].find(
          (element) =>
            element.tagName === "DIV" &&
            hrefs.every((href) => element.querySelector(`a[href="${href}"]`)),
        );
        if (!strip || !gateway || gateway.tagName !== "SECTION")
          return ["equipment gateway or evidence links missing"];
        const issues = [];
        const stripBounds = strip.getBoundingClientRect();
        const items = [...strip.querySelectorAll("li")];
        if (hero.contains(strip) || strip.previousElementSibling !== gateway || items.length !== 3)
          issues.push("evidence links must follow the equipment gateway once");
        if (strip.querySelector('[aria-hidden="true"][inert]'))
          issues.push("evidence links must not be a duplicated ticker");
        if (
          gateway.getBoundingClientRect().top < hero.getBoundingClientRect().bottom - 1 ||
          stripBounds.top < gateway.getBoundingClientRect().bottom - 1 ||
          strip.nextElementSibling.getBoundingClientRect().top < stripBounds.bottom - 1 ||
          items.some((item) => item.getBoundingClientRect().bottom > stripBounds.bottom + 1)
        )
          issues.push("homepage bands overlap or clip their content");
        for (const band of [hero, strip]) {
          const bandBounds = band.getBoundingClientRect();
          const walker = document.createTreeWalker(band, NodeFilter.SHOW_TEXT);
          let node;
          while ((node = walker.nextNode())) {
            if (!node.textContent.trim() || !node.parentElement.getClientRects().length) continue;
            const parentBounds = node.parentElement.getBoundingClientRect();
            const range = document.createRange();
            range.selectNodeContents(node);
            if (
              [...range.getClientRects()].some(
                (rect) =>
                  rect.left < parentBounds.left - 1 ||
                  rect.right > parentBounds.right + 1 ||
                  rect.top < bandBounds.top - 1 ||
                  rect.bottom > bandBounds.bottom + 1,
              )
            )
              issues.push(`text escapes its frame: ${node.textContent.trim().slice(0, 60)}`);
          }
        }
        return issues;
      }, proofHrefs);
    }
    for (const width of [1920, 1785, 1536, 1460, 1440]) {
      await page.setViewportSize({ width, height: 1080 });
      await page.evaluate(() => document.fonts.ready);
      const clipped = await homepageClipping();
      if (clipped.length) fail(`${path} ${width}`, clipped.join("; "));
    }
    await page.evaluate(() => {
      document.documentElement.style.fontSize = "200%";
    });
    const enlargedClipped = await homepageClipping();
    if (enlargedClipped.length) fail(path, `enlarged text: ${enlargedClipped.join("; ")}`);
    await context.close();
  }

  for (const path of ["/kvalitet", "/en/condition-and-quality"]) {
    console.log(`verify: grade comparison ${path}`);
    for (const [width, height] of [
      [320, 667],
      [844, 430],
      [1440, 900],
    ]) {
      const context = await browser.newContext({ viewport: { width, height } });
      const page = await visit(context, path);
      for (let index = 0; index < 3; index++) {
        await page.locator(".grade-choice").nth(index).click();
        if (!(await page.locator(`.grade-panel[data-grade="${index}"]`).isVisible()))
          fail(path, `grade ${index} selection failed`);
      }
      await page.locator(".grade-choice input").last().focus();
      await page.keyboard.press("ArrowLeft");
      if (!(await page.locator('.grade-panel[data-grade="1"]').isVisible()))
        fail(path, "native grade keyboard navigation failed");
      const button = page.locator('.grade-panel[data-grade="1"] .grade-zoom');
      await button.click();
      await page.locator(".grade-lightbox[open]").waitFor();
      if (!(await page.locator(".grade-lightbox img").getAttribute("src")).includes("grade-b"))
        fail(path, "zoom image does not match selected grade");
      await page.keyboard.press("Escape");
      await page.waitForFunction(() => !document.querySelector(".grade-lightbox").open);
      if (
        !(await button.evaluate((el) => el === document.activeElement)) ||
        (await page.evaluate(() => document.body.style.overflow === "hidden"))
      )
        fail(path, "grade dialog did not restore focus and scrolling");
      await button.click();
      await page.locator(".grade-lightbox-close").click();
      if (await overflow(page)) fail(path, `grade comparison overflows at ${width}`);
      await context.close();
    }
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 390, height: 844 },
    });
    const page = await visit(context, path, false);
    await page.locator(".grade-choice").last().click();
    if (!(await page.locator('.grade-panel[data-grade="2"]').isVisible()))
      fail(path, "grade comparison requires JavaScript");
    await context.close();
  }

  for (const path of ["/produkter/smartphones", "/en/products/smartphones"]) {
    console.log(`verify: smartphone enquiries ${path}`);
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await visit(context, path);
    const first = page.locator(".phone-brand-links a").first();
    const brand = await first.locator("span").innerText();
    await first.click();
    await page.locator("#udstyr").waitFor();
    if ((await page.locator("#udstyr").inputValue()) !== brand)
      fail(path, "phone enquiry did not preserve selected brand");
    const response = await page.request.get(page.url());
    if (!(response.headers()["x-robots-tag"] ?? "").includes("noindex"))
      fail(path, "query enquiry should not be indexed");
    if ((await page.locator('link[rel="canonical"]').getAttribute("href")).includes("?"))
      fail(path, "enquiry canonical includes prefill query");
    await context.close();
  }

  for (const path of ["/saelg-til-os", "/en/sell-to-us"]) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await visit(context, path);
    await page.locator('.buyback-hero a[href="#saelg-formular"]').click();
    if (!(await page.locator("#saelg-formular").isVisible()))
      fail(path, "buyback form target missing");
    if (await overflow(page)) fail(path, "buyback page overflows");
    await context.close();
  }

  for (const mode of ["mobile", "reduced", "save-data", "no-js"]) {
    console.log(`verify: fleet fallback ${mode}`);
    const context = await browser.newContext({
      viewport: { width: mode === "mobile" ? 390 : 1440, height: 900 },
      reducedMotion: mode === "reduced" ? "reduce" : "no-preference",
      javaScriptEnabled: mode !== "no-js",
    });
    if (mode === "save-data")
      await context.addInitScript(() =>
        Object.defineProperty(navigator, "connection", {
          value: { saveData: true },
          configurable: true,
        }),
      );
    const page = await context.newPage();
    const textures = [];
    page.on("request", (request) => {
      if (/thinkpad-.*texture|laptop-wallpaper/.test(request.url())) textures.push(request.url());
    });
    await page.goto(base + "/flaadeloesninger", { waitUntil: "networkidle" });
    await page.locator(".fleet-journey-visual").scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    if (
      textures.length ||
      (await page.locator(".fleet-journey-visual").getAttribute("data-scene-state")) !== "poster"
    )
      fail(mode, "fleet fallback loaded desktop 3D");
    if ((await page.locator("[data-journey-step]").count()) !== 5)
      fail(mode, "fleet stages missing");
    if (await overflow(page)) fail(mode, "fleet fallback overflows");
    await context.close();
  }

  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  console.log("verify: fleet desktop scroll stages");
  const page = await visit(context, "/flaadeloesninger");
  for (const stage of [0, 1, 2, 3, 4, 1]) {
    await page
      .locator("[data-journey-step]")
      .nth(stage)
      .evaluate((el) => el.scrollIntoView({ block: "center", behavior: "instant" }));
    await page.waitForFunction(
      (index) => {
        const figure = document.querySelector(".fleet-journey-visual");
        return (
          figure.dataset.sceneState === "ready" &&
          Math.abs(Number(figure.dataset.sceneProgress) - index) < 0.02
        );
      },
      stage,
      { timeout: 60000 },
    );
  }
  const pixels = await sharp(await page.locator(".fleet-journey-canvas").screenshot()).stats();
  if (pixels.channels.slice(0, 3).every((channel) => channel.stdev < 3))
    fail("fleet desktop", "3D canvas is blank");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.evaluate(
    () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
  );
  await page.waitForFunction(
    () =>
      matchMedia("(prefers-reduced-motion: reduce)").matches &&
      document.querySelector(".fleet-journey-visual").dataset.sceneState === "poster",
    null,
    { polling: 100 },
  );
  if (
    await page
      .locator(".fleet-journey-canvas")
      .evaluate((el) => getComputedStyle(el).opacity !== "0")
  )
    fail("fleet reduced", "canvas remains visible after changing motion preference");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.evaluate(
    () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
  );
  await page.waitForFunction(
    () =>
      !matchMedia("(prefers-reduced-motion: reduce)").matches &&
      document.querySelector(".fleet-journey-visual").dataset.sceneState === "ready",
    null,
    { timeout: 60000, polling: 100 },
  );
  await page
    .locator(".fleet-journey-canvas")
    .evaluate((canvas) =>
      canvas.getContext("webgl2").getExtension("WEBGL_lose_context").loseContext(),
    );
  await page.waitForFunction(
    () => document.querySelector(".fleet-journey-visual").dataset.sceneState === "fallback",
  );
  if (
    await page
      .locator(".fleet-journey-poster")
      .evaluate((el) => getComputedStyle(el).opacity !== "1")
  )
    fail("fleet fallback", "context loss did not restore the poster");
  await context.close();
}
