import assert from "node:assert/strict";
import crypto from "node:crypto";

/** Exercise the real admin build with a local, signed test session.
 * Never runs against a public host, never sends a reply or changes an enquiry.
 * The browser receives the production-shaped cookie on its trusted loopback
 * host. Fixture contexts block requests to every other origin.
 */
export async function verifyAdmin(browser, base, fail) {
  console.log("verify: admin navigation, inbox filters and access states");
  const origin = new URL(base);
  assert.ok(
    ["127.0.0.1", "localhost", "[::1]"].includes(origin.hostname),
    "admin fixtures are local only",
  );
  const secret = process.env.VERIFY_ADMIN_SECRET;
  assert.ok(secret, "VERIFY_ADMIN_SECRET must match the local verification server");
  const expires = String(Date.now() + 10 * 60_000);
  const signature = crypto.createHmac("sha256", secret).update(expires).digest("base64url");
  const cookie = `__Host-kestro_admin=${expires}.${signature}`;

  async function scenario(name, run, authenticated = true) {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      reducedMotion: "reduce",
    });
    context.setDefaultTimeout(15000);
    context.setDefaultNavigationTimeout(30000);
    if (authenticated) {
      const cookieUrl = new URL(base);
      cookieUrl.protocol = "https:";
      await context.addCookies([
        {
          name: "__Host-kestro_admin",
          value: cookie.slice(cookie.indexOf("=") + 1),
          url: cookieUrl.href,
          secure: true,
          httpOnly: true,
          sameSite: "Lax",
        },
      ]);
      await context.route("**/*", (route) => {
        const request = route.request();
        if (new URL(request.url()).origin !== origin.origin) return route.abort();
        return route.continue();
      });
    }
    const page = await context.newPage();
    page.on("pageerror", (error) => fail(`admin ${name}`, error.message));
    try {
      await run(page);
      console.log(`verify: admin passed: ${name}`);
    } catch (error) {
      fail(`admin ${name}`, error.stack ?? error.message);
    } finally {
      await context.close();
    }
  }

  async function visit(page, path) {
    const response = await page.goto(base + path, { waitUntil: "networkidle" });
    assert.equal(response?.status(), 200, `${path} responds successfully`);
    assert.match(
      response.headers()["x-robots-tag"] ?? "",
      /noindex/,
      "admin stays out of search indexes",
    );
    return response;
  }

  async function target(control, label) {
    const box = await control.boundingBox();
    assert.ok(box && box.height >= 44 && box.width >= 44, `${label} target is at least 44px`);
  }

  async function structure(page, path) {
    assert.equal(await page.locator("h1").count(), 1, `${path} has one h1`);
    assert.equal(await page.getByRole("main").count(), 1, `${path} has one main landmark`);
    const skipped = await page.locator("h1,h2,h3,h4,h5,h6").evaluateAll((headings) => {
      let previous = 0;
      return headings.some((heading) => {
        const level = Number(heading.tagName.slice(1));
        const skip = previous > 0 && level > previous + 1;
        previous = level;
        return skip;
      });
    });
    assert.equal(skipped, false, `${path} does not skip heading levels`);
    for (const width of [390, 1920]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 1080 });
      await page.evaluate(() => document.fonts.ready);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth + 1,
      );
      assert.equal(overflow, false, `${path} fits ${width}px`);
      const nav = page.getByRole("navigation", { name: "Panel", exact: true });
      const links = nav.locator("a,button");
      for (let index = 0; index < (await links.count()); index++) {
        if (await links.nth(index).isVisible())
          await target(links.nth(index), `navigation ${index} at ${width}px`);
      }
    }
    const current = page
      .getByRole("navigation", { name: "Panel", exact: true })
      .locator('a[aria-current="page"]');
    assert.equal(await current.count(), 1, "one navigation destination is current");
    await page.keyboard.press("Tab");
    await current.focus();
    assert.ok(
      await current.evaluate((element) => {
        const style = getComputedStyle(element);
        return (
          document.activeElement === element &&
          element.matches(":focus-visible") &&
          ((parseFloat(style.outlineWidth) > 0 && style.outlineStyle !== "none") ||
            style.boxShadow !== "none")
        );
      }),
      "navigation has visible keyboard focus",
    );
  }

  await scenario(
    "login remains separate from private data",
    async (page) => {
      await visit(page, "/admin");
      assert.equal(await page.getByRole("heading", { name: "Log ind", exact: true }).count(), 1);
      const password = page.getByLabel("Adgangskode", { exact: true });
      assert.equal(await password.getAttribute("type"), "password");
      assert.equal(await password.getAttribute("autocomplete"), "current-password");
      await target(password, "password input");
      await target(page.getByRole("button", { name: "Log ind", exact: true }), "login button");
      assert.equal(
        await page.getByRole("navigation", { name: "Panel", exact: true }).count(),
        0,
        "private navigation is not exposed on login",
      );
      const denied = await page.goto(base + "/admin/system", { waitUntil: "domcontentloaded" });
      assert.equal(denied.status(), 404, "a protected page refuses a browser without a session");
    },
    false,
  );

  await scenario("workspaces and responsive navigation", async (page) => {
    for (const [path, heading] of [
      ["/admin", "Oversigt"],
      ["/admin/beskeder", "Beskeder"],
      ["/admin/trafik", "Trafik"],
      ["/admin/system", "Systemstatus"],
    ]) {
      await visit(page, path);
      assert.equal(
        await page.getByRole("heading", { level: 1, name: heading, exact: true }).count(),
        1,
      );
      await structure(page, path);
      const skip = page.locator('a[href="#admin-main"]');
      assert.equal(await skip.count(), 1, "the workspace has a skip link");
      await skip.focus();
      await skip.press("Enter");
      assert.equal(await page.getByRole("main").getAttribute("id"), "admin-main");
      assert.ok(
        await page.getByRole("main").evaluate((element) => document.activeElement === element),
        "skip link moves keyboard focus into the workspace",
      );
    }
  });

  await scenario("inbox search keeps filters across navigation", async (page) => {
    await visit(page, "/admin/beskeder");
    const search = page.getByRole("search", { name: "Søg i beskeder", exact: true });
    await search.getByLabel("Søg", { exact: true }).fill("ThinkPad test");
    await search.getByLabel("Type", { exact: true }).selectOption("quote");
    await search.getByLabel("Sortering", { exact: true }).selectOption("oldest");
    await search.getByRole("button", { name: "Søg og filtrér", exact: true }).click();
    await page.waitForURL((url) => url.searchParams.get("q") === "ThinkPad test");
    let query = new URL(page.url()).searchParams;
    assert.equal(query.get("source"), "quote");
    assert.equal(query.get("sort"), "oldest");
    const archived = page
      .getByRole("navigation", { name: "Beskedstatus", exact: true })
      .getByRole("link", { name: /^Arkiverede/ });
    await archived.click();
    await page.waitForURL((url) => url.searchParams.get("status") === "archived");
    query = new URL(page.url()).searchParams;
    assert.equal(query.get("q"), "ThinkPad test");
    assert.equal(query.get("source"), "quote");
    assert.equal(query.get("sort"), "oldest");
    assert.equal(await page.getByLabel("Søg", { exact: true }).inputValue(), "ThinkPad test");
    assert.equal(
      await page
        .getByRole("navigation", { name: "Beskedstatus", exact: true })
        .locator('[aria-current="page"]')
        .count(),
      1,
    );
    // Unsupported URL values are normalized rather than causing a server error.
    await visit(
      page,
      "/admin/beskeder?status=owner&source=unknown&sort=sideways&page=-9&q=%3Cscript%3Efixture%3C%2Fscript%3E",
    );
    assert.equal(
      await page
        .locator("script")
        .filter({ hasText: /^fixture$/ })
        .count(),
      0,
      "search text is never executable markup",
    );
    assert.equal(await page.getByLabel("Type", { exact: true }).inputValue(), "");
    assert.equal(await page.getByLabel("Sortering", { exact: true }).inputValue(), "newest");
    await visit(
      page,
      "/admin/beskeder?q=a&q=b&source=contact&source=quote&sort=newest&sort=oldest",
    );
  });

  await scenario("traffic period is a shareable native form", async (page) => {
    await visit(page, "/admin/trafik?days=7");
    const select = page.locator('select[name="days"]');
    assert.equal(await select.inputValue(), "7");
    await select.selectOption("90");
    await select.locator("xpath=ancestor::form").getByRole("button").click();
    await page.waitForURL((url) => url.searchParams.get("days") === "90");
    assert.equal(await select.inputValue(), "90");
    await visit(page, "/admin/trafik?days=all");
    assert.equal(
      await select.inputValue(),
      "30",
      "unsupported periods fall back to the documented default",
    );
  });
}
