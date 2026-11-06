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
      const action = await page.locator(".home-hero-actions > a").first().boundingBox();
      const modal = await page.locator('[role="dialog"]').first().boundingBox();
      if (action.y + action.height > (modal?.y ?? 844))
        fail(`${path} ${width}`, "mobile hero action obscured on first visit");
      if (await page.locator(".home-hero .glass-card").count())
        fail(path, "mobile hero has a decorative text card");
      if (await overflow(page)) fail(`${path} ${width}`, "mobile hero overflows");
      await context.close();
    }
  }

  // A wide fixed-ratio hero once clipped all five labels below its own box.
  for (const path of ["/", "/en"]) {
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      reducedMotion: "reduce",
    });
    const page = await visit(context, path);
    for (const width of [1920, 1785, 1536, 1460, 1440]) {
      await page.setViewportSize({ width, height: 1080 });
      await page.evaluate(() => document.fonts.ready);
      const clipped = await page.locator(".home-hero").evaluate((hero) => {
        const strip = hero.lastElementChild;
        const items = [...strip.querySelectorAll("ul:first-child > li")];
        const bottom = hero.getBoundingClientRect().bottom;
        return (
          items.length !== 5 ||
          strip.getBoundingClientRect().bottom > bottom + 1 ||
          items.some((item) => item.getBoundingClientRect().bottom > bottom + 1) ||
          hero.nextElementSibling.getBoundingClientRect().top <
            strip.getBoundingClientRect().bottom - 1
        );
      });
      if (clipped) fail(`${path} ${width}`, "homepage feature labels clipped or covered");
    }
    await page.evaluate(() => {
      document.documentElement.style.fontSize = "200%";
    });
    const enlargedClipped = await page
      .locator(".home-hero")
      .evaluate(
        (hero) =>
          hero.lastElementChild.getBoundingClientRect().bottom >
          hero.getBoundingClientRect().bottom + 1,
      );
    if (enlargedClipped) fail(path, "enlarged text clips homepage feature strip");
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
