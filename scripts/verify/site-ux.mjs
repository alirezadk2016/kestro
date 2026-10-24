import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/** Public navigation and enquiry journeys against the local production build. */
export async function verifySiteUx(browser, base, fail) {
  console.log("verify: public navigation, mobile menu and enquiry journeys");
  const origin = new URL(base);
  assert.ok(
    ["127.0.0.1", "localhost", "[::1]"].includes(origin.hostname),
    "site UX verification is local only",
  );
  const directory = process.env.VERIFY_ARTIFACT_DIR && resolve(process.env.VERIFY_ARTIFACT_DIR);
  if (directory) {
    const repository = fileURLToPath(new URL("../../", import.meta.url));
    const fromRepository = relative(repository, directory);
    assert.ok(
      fromRepository.startsWith("..") || isAbsolute(fromRepository),
      "UX screenshots must stay outside the repository",
    );
    await mkdir(directory, { recursive: true });
  }

  // A page can finish a journey while Next is still optimizing its pictures.
  // Keep those sockets alive independently so navigation cannot poison its cache.
  const images = await browser.newContext();
  const pendingImages = new Set();

  async function scenario(name, options, run) {
    const { firstVisit = false, ...browserOptions } = options;
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      locale: "en-GB",
      reducedMotion: "reduce",
      ...browserOptions,
    });
    context.setDefaultTimeout(15000);
    context.setDefaultNavigationTimeout(30000);
    if (!firstVisit) {
      await context.addInitScript(() => {
        localStorage.setItem("kestro-consent", "denied");
        localStorage.setItem("kestro-lang-hint", "1");
      });
    }
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
          // Buffer Flight as well as documents: intercepted local streams can
          // abort despite a complete payload. Only remove the HTTP-incompatible
          // upgrade directive; production headers are checked by attack.mjs.
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
        throw error;
      }
    });
    const page = await context.newPage();
    page.on("pageerror", (error) => fail(`site UX ${name}`, error.stack || error.message));
    try {
      await run(page);
      console.log(`verify: site UX passed: ${name}`);
    } catch (error) {
      fail(`site UX ${name}`, error.stack || error.message);
      if (directory)
        await page
          .screenshot({
            path: join(directory, `site-ux-failure-${name.replace(/[^a-z0-9]+/gi, "-")}.png`),
            timeout: 3000,
          })
          .catch(() => {});
    } finally {
      closing = true;
      await context.unrouteAll({ behavior: "ignoreErrors" });
      await context.close();
    }
  }

  async function visit(page, path) {
    const response = await page.goto(base + path, { waitUntil: "networkidle" });
    assert.equal(response?.status(), 200, `${path} responds successfully`);
    await page.evaluate(() => document.fonts.ready);
  }

  async function target(control, label) {
    const box = await control.boundingBox();
    assert.ok(box && box.width >= 44 && box.height >= 44, `${label} has a 44px target`);
    return box;
  }

  async function focused(control, label) {
    assert.ok(await control.evaluate((element) => document.activeElement === element), label);
  }

  try {
    for (const language of ["da", "en"]) {
      await scenario(`drawer search return focus ${language}`, {}, async (page) => {
        await visit(page, language === "da" ? "/kontakt" : "/en/contact");
        const header = page.locator("body > header");
        const burger = header.locator("button[aria-controls='mobile-menu']");
        await burger.click();
        const menu = header.locator("#mobile-menu");
        await menu.waitFor({ state: "visible" });
        await menu.locator("button").first().focus();
        await page.keyboard.press("Enter");
        const search = header.locator("dialog");
        await search.waitFor({ state: "visible" });
        await menu.waitFor({ state: "hidden" });
        assert.ok(
          await page.evaluate(
            () => !document.querySelector("main").inert && !document.querySelector("footer").inert,
          ),
          "opening search releases the drawer's explicit background inert state",
        );
        await page.keyboard.press("Escape");
        await search.waitFor({ state: "hidden" });
        await focused(
          burger,
          "closing drawer-launched search restores the persistent menu control",
        );
        await page.waitForFunction(() => document.body.style.overflow !== "hidden");
        assert.ok(
          await page.evaluate(
            () =>
              !document.querySelector("main").inert && document.body.style.overflow !== "hidden",
          ),
          "closing search restores page access and scrolling",
        );
      });
    }

    for (const language of [
      {
        code: "da",
        category: "/produkter/baerbare-computere",
        hub: "/produkter",
        models: "/modeller",
      },
      {
        code: "en",
        category: "/en/products/business-laptops",
        hub: "/en/products",
        models: "/en/models",
      },
    ]) {
      await scenario(
        `desktop products ${language.code}`,
        { viewport: { width: 1440, height: 900 } },
        async (page) => {
          await visit(page, language.category);
          const header = page.locator("body > header");
          const hub = header.locator(`nav a[href='${language.hub}']`);
          assert.ok(
            await hub.getAttribute("aria-current"),
            "the product section marks the current location",
          );
          const trigger = header.locator("button[aria-controls='header-products']");
          await trigger.focus();
          await page.keyboard.press("Enter");
          const panel = header.locator("#header-products");
          await panel.waitFor({ state: "visible" });
          for (const link of await panel.locator("a").all())
            await target(link, "desktop product link");
          assert.equal(
            await panel.locator("a[aria-current='page']").getAttribute("href"),
            language.category,
            "the category is marked inside the dropdown",
          );
          await panel.locator(`a[href='${language.models}']`).click();
          await page.waitForURL((url) => url.pathname === language.models);
          await panel.waitFor({ state: "hidden" });
          assert.equal(
            await trigger.getAttribute("aria-expanded"),
            "false",
            "selection closes the dropdown",
          );
          assert.ok(
            await hub.getAttribute("aria-current"),
            "model pages retain product-section orientation",
          );
          await trigger.focus();
          await page.keyboard.press("Enter");
          await panel.waitFor({ state: "visible" });
          await page.keyboard.press("Escape");
          await panel.waitFor({ state: "hidden" });
          await focused(trigger, "Escape returns focus to the products control");
        },
      );
    }

    for (const width of [320, 390]) {
      for (const language of ["da", "en"]) {
        await scenario(
          `first visit menu ${language} ${width}`,
          {
            firstVisit: true,
            viewport: { width, height: 844 },
          },
          async (page) => {
            await visit(page, language === "da" ? "/kontakt" : "/en/contact");
            const banner = page.getByRole("dialog", {
              name: /^(Samtykke til statistik|Consent to statistics)$/,
            });
            await banner.waitFor({ state: "visible" });
            if (language === "da") await page.locator(".lang-hint").waitFor({ state: "visible" });
            const header = page.locator("body > header");
            const bar = header.locator(":scope > div").first();
            const controls = bar.locator("a:visible, button:visible");
            let previousRight = 0;
            for (const control of await controls.all()) {
              const bounds = await target(control, `mobile header control at ${width}px`);
              assert.ok(
                bounds.x >= -1 && bounds.x + bounds.width <= width + 1,
                "header controls fit the viewport",
              );
              assert.ok(bounds.x >= previousRight - 1, "header controls do not overlap");
              previousRight = bounds.x + bounds.width;
            }
            const burger = header.locator("button[aria-controls='mobile-menu']");
            await burger.click();
            const menu = header.locator("#mobile-menu");
            await menu.waitFor({ state: "visible" });
            const bottom = await menu.evaluate((element) => element.getBoundingClientRect().bottom);
            assert.ok(
              await page.evaluate(() => {
                const header = document.querySelector("body > header");
                return Array.from(header.parentElement.children)
                  .filter((element) => element instanceof HTMLElement && element !== header)
                  .every((element) => element.inert);
              }),
              "the page, consent banner and language hint are isolated while the drawer is open",
            );
            assert.equal(
              await page.evaluate(() => document.body.style.overflow),
              "hidden",
              "the page cannot scroll behind the drawer",
            );
            const first = header.locator('a[href]:not([tabindex="-1"])').first();
            const last = menu.locator("a").last();
            await last.focus();
            await page.keyboard.press("Tab");
            await focused(first, "Tab wraps to the first header control");
            await page.keyboard.press("Shift+Tab");
            await focused(last, "Shift+Tab wraps to the last drawer link");
            await banner
              .locator("button")
              .first()
              .evaluate((button) => button.focus());
            assert.ok(
              await header.evaluate((element) => element.contains(document.activeElement)),
              "a background consent control cannot take focus",
            );
            assert.ok(bottom <= 845, `the complete drawer fits the viewport (bottom ${bottom}px)`);
            await page.keyboard.press("Escape");
            await menu.waitFor({ state: "hidden" });
            await focused(burger, "Escape returns focus to the mobile menu control");
            assert.ok(
              await banner.evaluate((element) => !element.closest("[inert]")),
              "consent becomes available again after closing the menu",
            );
            assert.notEqual(
              await page.evaluate(() => document.body.style.overflow),
              "hidden",
              "page scrolling is restored",
            );
          },
        );
      }
    }

    for (const language of [
      {
        code: "da",
        repair: "/reparation",
        detail: "/reparation/ram-og-ssd-opgradering",
        sell: "/saelg-til-os",
        surplus: "/ydelser/overskudslager-og-returvarer",
      },
      {
        code: "en",
        repair: "/en/repairs",
        detail: "/en/repairs/memory-and-ssd-upgrade",
        sell: "/en/sell-to-us",
        surplus: "/en/services/overstock-and-returns",
      },
    ]) {
      await scenario(`task enquiries ${language.code}`, {}, async (page) => {
        for (const task of [
          {
            page: language.repair,
            target: language.repair,
            anchor: "reparation-formular",
            repair: true,
          },
          {
            page: language.detail,
            target: language.repair,
            anchor: "reparation-formular",
            repair: true,
          },
          { page: language.sell, target: language.sell, anchor: "saelg-formular", repair: false },
          {
            page: language.surplus,
            target: language.sell,
            anchor: "saelg-formular",
            repair: false,
          },
        ]) {
          await visit(page, task.page);
          const destination = `${task.target}#${task.anchor}`;
          const action = page.locator("main .stage .glass-band a").first();
          assert.equal(
            await action.getAttribute("href"),
            destination,
            `${task.page} closes on its own enquiry task`,
          );
          if (task.page === language.detail)
            assert.equal(
              await page.locator(`main > section:first-of-type a[href='${destination}']`).count(),
              1,
              "repair details offer a direct enquiry before the article",
            );
          if (task.page === language.surplus)
            assert.equal(
              await page.locator("main aside a").getAttribute("href"),
              destination,
              "surplus sidebar requests a valuation",
            );
          await action.click();
          await page.waitForURL(
            (url) => url.pathname === task.target && url.hash === `#${task.anchor}`,
          );
          const heading = page.locator(`#${task.anchor}`);
          await heading.waitFor({ state: "visible" });
          const position = await heading.evaluate((element) => ({
            top: element.getBoundingClientRect().top,
            header: document.querySelector("body > header").getBoundingClientRect().bottom,
          }));
          assert.ok(
            position.top >= position.header - 1 && position.top < 844,
            "the enquiry heading lands below the sticky header",
          );
          if (task.repair)
            assert.equal(
              await page.locator("input[name='virksomhed']").evaluate((input) => input.required),
              false,
              "private repair customers can use the destination form",
            );
        }
      });
    }

    for (const width of [390, 1440]) {
      await scenario(
        `locale selection ${width}`,
        { viewport: { width, height: 900 } },
        async (page) => {
          const selection = new URLSearchParams({
            model: "Lenovo ThinkPad T480",
            antal: "50+",
            hvornaar: "November",
            unrelated: "discard",
          });
          await visit(page, `/tilbud?${selection}#indhold`);
          async function languageLink(code) {
            if (width < 1024) {
              await page.locator("body > header button[aria-controls='mobile-menu']").click();
              await page.locator("#mobile-menu").waitFor({ state: "visible" });
            }
            const link = page.locator(`body > header a[hreflang='${code}']:visible`);
            await page.waitForFunction((code) => {
              const links = [...document.querySelectorAll(`body > header a[hreflang='${code}']`)];
              return links.some(
                (link) => new URL(link.href).searchParams.get("model") === "Lenovo ThinkPad T480",
              );
            }, code);
            return link;
          }
          const english = await languageLink("en");
          const destination = new URL(await english.getAttribute("href"), base);
          assert.equal(destination.pathname, "/en/get-a-quote");
          assert.equal(destination.searchParams.get("model"), "Lenovo ThinkPad T480");
          assert.equal(destination.searchParams.get("antal"), "50+");
          assert.equal(destination.searchParams.get("hvornaar"), "November");
          assert.equal(
            destination.searchParams.has("unrelated"),
            false,
            "unrecognized parameters are not copied",
          );
          assert.equal(destination.hash, "#indhold");
          await english.click();
          await page.waitForURL((url) => url.pathname === "/en/get-a-quote");
          await page.waitForFunction(
            () => document.querySelector("#udstyr")?.value === "Lenovo ThinkPad T480",
          );
          assert.equal(await page.locator("input[name='antal']:checked").inputValue(), "50+");
          assert.equal(await page.locator("#hvornaar").inputValue(), "November");
          await page.evaluate(() => {
            location.hash = "besked";
          });
          const danish = await languageLink("da");
          await page.waitForFunction(() =>
            [...document.querySelectorAll("body > header a[hreflang='da']")].some(
              (link) => new URL(link.href).hash === "#besked",
            ),
          );
          await danish.click();
          await page.waitForURL((url) => url.pathname === "/tilbud" && url.hash === "#besked");
          await page.waitForFunction(
            () => document.querySelector("#udstyr")?.value === "Lenovo ThinkPad T480",
          );
          assert.equal(new URL(page.url()).searchParams.get("antal"), "50+");
          await visit(page, "/?unrelated=discard#indhold");
          if (width < 1024)
            await page.locator("body > header button[aria-controls='mobile-menu']").click();
          const rootLink = page.locator("body > header a[hreflang='en']:visible");
          await page.waitForFunction(() =>
            [...document.querySelectorAll("body > header a[hreflang='en']")].some(
              (link) => link.getAttribute("href") === "/en#indhold",
            ),
          );
          assert.equal(
            await rootLink.getAttribute("href"),
            "/en#indhold",
            "the root locale keeps its fragment without a redirecting slash or unrelated query",
          );
        },
      );
    }
  } finally {
    await Promise.allSettled([...pendingImages]);
    await images.close();
  }
}
