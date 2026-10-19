import assert from "node:assert/strict";
import crypto from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

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
    let contextClosing = false;
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
      await context.route("**/*", async (route) => {
        const request = route.request();
        try {
          if (new URL(request.url()).origin !== origin.origin) return await route.abort();
          if (
            request.method() === "GET" &&
            (request.isNavigationRequest() || request.headers().rsc === "1")
          ) {
            // Local verification is HTTP. Match the fixture browser's transport:
            // production CSP would upgrade later fetch redirects to nonexistent
            // loopback TLS. Buffer RSC too: intercepted loopback streams can abort
            // despite a complete, correct server payload. Bytes, auth headers and
            // status are retained; real production headers are checked in attack.mjs.
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
          // A newer navigation can cancel a buffered Flight request before
          // its response is fulfilled. Only a confirmed browser cancellation
          // or this scenario's own teardown may finish without a route result.
          if (contextClosing || request.failure()?.errorText === "net::ERR_ABORTED") return;
          throw error;
        }
      });
    }
    const page = await context.newPage();
    const active = new Map();
    const requestFailures = [];
    page.on("request", (request) =>
      active.set(request, {
        type: request.resourceType(),
        url: request.url(),
        started: Date.now(),
      }),
    );
    page.on("requestfinished", (request) => active.delete(request));
    page.on("requestfailed", (request) => {
      requestFailures.push({ url: request.url(), error: request.failure()?.errorText });
      active.delete(request);
    });
    page.on("pageerror", (error) =>
      fail(`admin ${name}`, `${page.url()}: ${error.stack || error.message}`),
    );
    try {
      await run(page);
      console.log(`verify: admin passed: ${name}`);
    } catch (error) {
      fail(`admin ${name}`, error.stack ?? error.message);
      console.error(
        "admin request diagnostics",
        JSON.stringify({
          name,
          url: page.url(),
          pending: [...active.values()].map(({ started, ...request }) => ({
            ...request,
            ageMs: Date.now() - started,
          })),
          failed: requestFailures.slice(-20),
        }),
      );
      if (
        process.env.VERIFY_ARTIFACT_DIR &&
        /^\/admin\/(indhold|medier)(\/|$)/.test(new URL(page.url()).pathname)
      ) {
        const directory = process.env.VERIFY_ARTIFACT_DIR;
        await mkdir(directory, { recursive: true });
        const filename = join(
          directory,
          `admin-check-failure-${name.replace(/[^a-z0-9]+/gi, "-")}`,
        );
        await page.screenshot({ path: filename + ".png", timeout: 2000 }).catch(() => {});
        let timer;
        try {
          await writeFile(
            filename + ".html",
            await Promise.race([
              page.content(),
              new Promise((_, reject) => {
                timer = setTimeout(() => reject(new Error("DOM capture timed out")), 2000);
              }),
            ]),
          );
        } catch {
        } finally {
          clearTimeout(timer);
        }
      }
    } finally {
      // Closing cancels pending buffered requests. Stop accepting routes first;
      // waiting for canceled Flight handlers can deadlock before context.close.
      contextClosing = true;
      await context.unrouteAll({ behavior: "ignoreErrors" });
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

  async function waitForCount(locator, expected) {
    const deadline = Date.now() + 15000;
    while ((await locator.count()) !== expected && Date.now() < deadline)
      await new Promise((resolve) => setTimeout(resolve, 50));
    assert.equal(await locator.count(), expected, "the rendered result count settles");
  }

  async function captureCatalogue(page, path) {
    const directory = process.env.VERIFY_ARTIFACT_DIR;
    if (!directory || !/^\/admin\/(indhold|medier)(\/|$)/.test(path)) return;
    await mkdir(directory, { recursive: true });
    const label =
      path === "/admin/medier" ? "media" : path === "/admin/indhold" ? "content" : "content-detail";
    for (const [name, width] of [
      ["desktop", 1440],
      ["mobile", 390],
    ]) {
      await page.setViewportSize({ width, height: name === "desktop" ? 1000 : 844 });
      await page.evaluate(() => {
        scrollTo(0, 0);
        return document.fonts.ready;
      });
      await page.waitForFunction(async () => {
        const visible = [...document.images].filter((image) => {
          const box = image.getBoundingClientRect();
          return box.width > 0 && box.height > 0 && box.bottom > 0 && box.top < innerHeight;
        });
        if (!visible.every((image) => image.complete && image.naturalWidth > 0)) return false;
        await Promise.all(visible.map((image) => image.decode()));
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        return true;
      });
      await page.screenshot({
        path: join(directory, `kestro-admin-${label}-${name}-preview.png`),
        fullPage: false,
      });
    }
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
    for (const width of [320, 390, 1440, 1920]) {
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
      ["/admin/opfoelgning", "Opfølgning"],
      ["/admin/kontakter", "Kontakter"],
      ["/admin/indhold", "Indhold"],
      ["/admin/indhold/tjek-batterikapacitet", "Tjek batterikapacitet i Windows"],
      ["/admin/medier", "Medier"],
      ["/admin/trafik", "Trafik"],
      ["/admin/system", "Systemstatus"],
    ]) {
      await visit(page, path);
      assert.equal(
        await page.getByRole("heading", { level: 1, name: heading, exact: true }).count(),
        1,
      );
      await structure(page, path);
      await captureCatalogue(page, path);
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
    await search.locator("summary").click();
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

  await scenario("mobile sections use keyboard-safe grouped navigation", async (page) => {
    await visit(page, "/admin/medier");
    const trigger = page.getByRole("button", { name: "Menu · Medier", exact: true });
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "Alle sektioner", exact: true });
    assert.ok(await dialog.isVisible(), "the grouped menu opens");
    const links = dialog
      .getByRole("navigation", { name: "Alle sektioner", exact: true })
      .getByRole("link");
    assert.equal(await links.count(), 8, "every workspace is reachable on a phone");
    for (const link of await links.all()) await target(link, "mobile menu link");
    await page.keyboard.press("Escape");
    assert.equal(await dialog.isVisible(), false, "Escape dismisses the menu");
    assert.ok(
      await trigger.evaluate((element) => element === document.activeElement),
      "focus returns to the menu trigger",
    );
    await trigger.click();
    await dialog.getByRole("link", { name: "Indhold", exact: true }).click();
    await page.waitForURL(base + "/admin/indhold");
    assert.equal(await dialog.isVisible(), false, "navigation closes the menu");
    await page.getByRole("heading", { level: 1, name: "Indhold", exact: true }).waitFor();
  });

  await scenario("content inventory filters, resets and opens actual metadata", async (page) => {
    await visit(page, "/admin/indhold");
    const form = page.getByRole("form", { name: "Find indhold", exact: true });
    await form.getByLabel("Søg i indhold", { exact: true }).fill("batterikapacitet");
    await form.locator("summary").click();
    await form.getByLabel("Indholdstype", { exact: true }).selectOption("practical");
    await form.getByRole("button", { name: "Find indhold", exact: true }).click();
    await page.waitForURL((url) => url.searchParams.get("q") === "batterikapacitet");
    const inventory = page.getByRole("list", { name: "Indhold", exact: true });
    // App Router updates the address before its streamed result has committed.
    await waitForCount(inventory.locator(":scope > li"), 1);
    assert.equal(
      await inventory.locator(":scope > li").count(),
      1,
      "search applies across the inventory",
    );
    await inventory.getByRole("link", { name: "Gennemse", exact: true }).click();
    await page.waitForURL(base + "/admin/indhold/tjek-batterikapacitet");
    await page.getByRole("heading", { name: "Sprog og metadata", exact: true }).waitFor();
    assert.equal(
      await page.getByRole("heading", { name: "Sprog og metadata", exact: true }).count(),
      1,
    );
    assert.equal(await page.getByRole("heading", { name: "Dansk", exact: true }).count(), 1);
    assert.equal(await page.getByRole("heading", { name: "English", exact: true }).count(), 1);
    assert.equal(
      await page.getByRole("link", { name: "Se engelsk side ↗", exact: true }).getAttribute("href"),
      "/en/knowledge/check-battery-capacity",
    );
    await visit(page, "/admin/indhold?q=batterikapacitet&kind=practical");
    await page.getByRole("link", { name: "Nulstil filtre", exact: true }).click();
    await page.waitForURL(base + "/admin/indhold");
    assert.equal(
      await page.getByLabel("Søg i indhold", { exact: true }).inputValue(),
      "",
      "reset clears the rendered search input",
    );
    assert.equal(
      await page.getByLabel("Indholdstype", { exact: true }).inputValue(),
      "",
      "reset clears the rendered type filter",
    );
    await visit(page, "/admin/indhold?q=fixture-no-such-content");
    assert.equal(
      await page.getByRole("heading", { name: "Intet indhold matcher", exact: true }).count(),
      1,
    );
  });

  await scenario("media search, pagination and denied clipboard fallback", async (page) => {
    await page.addInitScript(() =>
      Object.defineProperty(navigator, "clipboard", {
        value: {
          writeText: async () => {
            throw new Error("fixture clipboard denied");
          },
        },
        configurable: true,
      }),
    );
    await visit(page, "/admin/medier");
    assert.equal(
      await page
        .getByRole("list", { name: "Billedbibliotek", exact: true })
        .locator(":scope > li")
        .count(),
      18,
      "the media grid is paginated",
    );
    await page
      .getByRole("navigation", { name: "Billedsider", exact: true })
      .getByRole("link", { name: "Næste →", exact: true })
      .click();
    await page.waitForURL((url) => url.searchParams.get("page") === "2");
    await visit(page, "/admin/medier?q=battery.webp&group=practical");
    const asset = page.getByRole("list", { name: "Billedbibliotek", exact: true });
    assert.equal(await asset.locator(":scope > li").count(), 1);
    const image = asset.getByRole("img");
    await image.scrollIntoViewIfNeeded();
    await page.waitForFunction(() =>
      [...document.images]
        .filter((image) => image.getBoundingClientRect().width > 0)
        .every((image) => image.complete && image.naturalWidth > 0),
    );
    await asset.getByRole("button", { name: "Kopiér link til battery.webp", exact: true }).click();
    assert.equal(
      await asset.getByLabel("Markér og kopiér linket manuelt", { exact: true }).inputValue(),
      "https://www.kestro.dk/images/practical/battery.webp",
      "copy denial retains a usable original URL",
    );
    assert.equal(
      await asset.getByRole("link", { name: "Hent fil ↓", exact: true }).getAttribute("download"),
      "battery.webp",
    );
    await asset.locator("summary").click();
    assert.equal(
      await asset
        .getByRole("link", { name: "Tjek batterikapacitet i Windows →", exact: true })
        .count(),
      1,
    );
    await page.getByRole("link", { name: "Nulstil filtre", exact: true }).click();
    await page.waitForURL(base + "/admin/medier");
    assert.equal(await page.getByLabel("Søg efter billede", { exact: true }).inputValue(), "");
    assert.equal(await page.getByLabel("Billedgruppe", { exact: true }).inputValue(), "all");
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
