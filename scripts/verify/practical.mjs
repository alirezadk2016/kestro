import assert from "node:assert/strict";

/** Production integration checks, using the browser owned by the main gate. */
export async function verifyPracticalGuides(browser, base, fail) {
  console.log("verify: practical guides, local calculators and browser check");
  const consentHandled = new WeakSet();
  const paths = {
    da: [
      "/vejledninger/tjek-batterikapacitet",
      "/vejledninger/tjek-ram-forbrug",
      "/vejledninger/hdd-eller-ssd",
      "/vejledninger/langsom-computer",
    ],
    en: [
      "/en/knowledge/check-battery-capacity",
      "/en/knowledge/check-memory-usage",
      "/en/knowledge/hdd-or-ssd",
      "/en/knowledge/slow-computer",
    ],
  };

  async function scenario(name, run) {
    console.log(`verify: practical scenario ${name}`);
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      reducedMotion: "reduce",
    });
    try {
      await run(context);
      console.log(`verify: practical scenario passed: ${name}`);
    } catch (error) {
      fail(`practical ${name}`, error.stack ?? error.message);
    } finally {
      await context.close();
    }
  }

  async function visit(context, path) {
    console.log(`verify: practical visit ${path}`);
    const page = await context.newPage();
    page.on("pageerror", (error) => fail(`practical ${path}`, error.message));
    const response = await page.goto(base + path, { waitUntil: "domcontentloaded" });
    assert.equal(response?.status(), 200, `${path} responds successfully`);
    const consent = page.getByRole("button", { name: /^(Kun nødvendige|Necessary only)$/ });
    if (!consentHandled.has(context)) {
      // Every scenario has a fresh context. The banner appears after hydration.
      console.log(`verify: practical awaiting consent hydration ${path}`);
      await consent.waitFor({ state: "visible" });
      await consent.click();
      consentHandled.add(context);
    }
    return page;
  }

  async function readyTool(page) {
    console.log(`verify: practical awaiting tool hydration ${new URL(page.url()).pathname}`);
    const button = page.locator("#vaerktoej button").first();
    await button.waitFor({ state: "visible" });
    await page.waitForFunction(() => !document.querySelector("#vaerktoej button")?.disabled);
    return page.locator("#vaerktoej");
  }

  async function noOverflow(page, label) {
    for (const width of [390, 1920]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 1080 });
      await page.evaluate(() => document.fonts.ready);
      const size = await page.evaluate(() => ({
        content: document.documentElement.scrollWidth,
        viewport: innerWidth,
      }));
      assert.ok(size.content <= size.viewport + 1, `${label} overflows at ${width}px`);
    }
  }

  async function focusVisible(page, control) {
    await page.keyboard.press("Tab");
    await control.focus();
    assert.ok(
      await control.evaluate((element) => {
        const style = getComputedStyle(element);
        return (
          document.activeElement === element &&
          element.matches(":focus-visible") &&
          ((parseFloat(style.outlineWidth) > 0 && style.outlineStyle !== "none") ||
            style.boxShadow !== "none")
        );
      }),
      "keyboard focus is visible on the control",
    );
    const bounds = await control.boundingBox();
    assert.ok(
      bounds && bounds.width >= 44 && bounds.height >= 44,
      "control target is at least 44px",
    );
  }

  for (const lang of ["da", "en"]) {
    await scenario(`${lang} directory and layouts`, async (context) => {
      const page = await visit(context, lang === "da" ? "/vejledninger" : "/en/knowledge");
      const links = page.locator("#praktiske-guides a[href]");
      assert.equal(await links.count(), 4, "the hub exposes four separate practical guides");
      const hrefs = await links.evaluateAll((items) =>
        items.map((item) => item.getAttribute("href")),
      );
      assert.deepEqual(
        [...hrefs].sort(),
        [...paths[lang]].sort(),
        "hub links target the correct language",
      );
      await focusVisible(page, links.first());
      await noOverflow(page, `${lang} practical hub`);
      await page.close();
      for (const path of paths[lang]) {
        const guide = await visit(context, path);
        await noOverflow(guide, path);
        await guide.close();
      }
    });

    await scenario(`${lang} battery calculator`, async (context) => {
      const page = await visit(context, paths[lang][0]);
      const tool = await readyTool(page);
      const first = tool.getByLabel("Design Capacity", { exact: true });
      const second = tool.getByLabel("Full Charge Capacity", { exact: true });
      const submit = tool.getByRole("button", {
        name: lang === "da" ? "Beregn kapacitet" : "Calculate capacity",
        exact: true,
      });
      const status = tool.getByRole("status");
      await focusVisible(page, first);
      await first.fill("50000");
      await second.fill("40000");
      await submit.click();
      assert.equal((await status.locator(".t-h1").innerText()).replace(/\s/g, ""), "80%");
      await first.fill("60000");
      assert.ok(
        !(await status.innerText()).match(/\b80\s*%/),
        "editing clears the old battery result",
      );
      await first.fill("invalid");
      await submit.click();
      assert.equal(await first.getAttribute("aria-invalid"), "true");
      assert.ok(
        await first.evaluate((element) => element === document.activeElement),
        "invalid battery field receives focus",
      );
      const described = await first.evaluate((element) =>
        element
          .getAttribute("aria-describedby")
          .split(/\s+/)
          .every((id) => !!document.getElementById(id)),
      );
      assert.ok(described, "battery error and hint references resolve");
      await first.fill("50,000");
      await submit.click();
      assert.equal(
        (await status.locator(".t-h1").innerText()).replace(/\s/g, ""),
        "80%",
        "grouped mWh input remains supported",
      );
      await noOverflow(page, `${lang} battery result`);
    });

    await scenario(`${lang} memory calculator`, async (context) => {
      const page = await visit(context, paths[lang][1]);
      const tool = await readyTool(page);
      const first = tool.getByLabel(lang === "da" ? "Samlet brugbar RAM" : "Total usable RAM", {
        exact: true,
      });
      const second = tool.getByLabel(lang === "da" ? "RAM i brug" : "RAM in use", { exact: true });
      const submit = tool.getByRole("button", {
        name: lang === "da" ? "Beregn forbruget" : "Calculate usage",
        exact: true,
      });
      const status = tool.getByRole("status");
      await first.fill("16");
      await second.fill("10.5");
      await submit.click();
      assert.equal(
        (await status.locator(".t-h1").innerText()).replace(/\s/g, ""),
        lang === "da" ? "65,6%" : "65.6%",
      );
      assert.match(
        await status.innerText(),
        lang === "da" ? /5,5 GB ledig RAM/ : /5\.5 GB of free RAM/,
      );
      await second.fill("17");
      assert.ok(
        !(await status.innerText()).match(/65[,.]6\s*%/),
        "editing clears the old memory result",
      );
      await submit.click();
      assert.equal(await second.getAttribute("aria-invalid"), "true");
      assert.ok(
        await second.evaluate((element) => element === document.activeElement),
        "out-of-range memory field receives focus",
      );
      await second.fill("0");
      await submit.click();
      assert.equal(
        (await status.locator(".t-h1").innerText()).replace(/\s/g, ""),
        "0%",
        "zero memory use is valid",
      );
      await focusVisible(page, submit);
      await noOverflow(page, `${lang} memory result`);
    });

    await scenario(`${lang} browser check`, async (context) => {
      const page = await visit(context, paths[lang][3]);
      const tool = await readyTool(page);
      const start = tool.getByRole("button").first();
      const stop = tool.getByRole("button", {
        name: lang === "da" ? "Stop testen" : "Stop check",
        exact: true,
      });
      assert.equal(await tool.locator("progress").count(), 0, "browser work is opt-in");
      await focusVisible(page, start);
      await start.click();
      await tool.locator("progress").waitFor({ state: "visible" });
      assert.ok(await start.isDisabled(), "a second run cannot start while active");
      await tool.locator("[data-checksum]").waitFor({ state: "visible", timeout: 10000 });
      assert.match(
        await tool.locator("[data-checksum]").innerText(),
        /\d/,
        "the completed check has a measured rate",
      );
      assert.ok(await start.isEnabled(), "completion enables another run");
      await start.click();
      await stop.click();
      await page.waitForFunction(() => !document.querySelector("#vaerktoej button")?.disabled);
      assert.equal(await tool.locator("progress").count(), 0, "stopping removes active progress");
      assert.equal(
        await tool.locator("[data-checksum]").count(),
        0,
        "stopping does not keep an old result",
      );
      await page.waitForFunction(
        () => document.activeElement === document.querySelector("#vaerktoej button"),
      );
      assert.ok(
        await start.evaluate((element) => element === document.activeElement),
        "stop returns focus to restart",
      );
      await noOverflow(page, `${lang} stopped browser check`);
    });
  }
}
