import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const WIDTHS = [320, 390, 768, 1024, 1440, 1920];
const MODELS = [
  ["lenovo-thinkpad-t480", "Lenovo ThinkPad T480", "Lenovo", "baerbare"],
  ["lenovo-thinkpad-t14", "Lenovo ThinkPad T14", "Lenovo", "baerbare"],
  ["lenovo-thinkpad-x1-carbon", "Lenovo ThinkPad X1 Carbon", "Lenovo", "baerbare"],
  ["lenovo-thinkpad-l14", "Lenovo ThinkPad L14", "Lenovo", "baerbare"],
  ["hp-elitebook-840", "HP EliteBook 840", "HP", "baerbare"],
  ["hp-probook-450", "HP ProBook 450", "HP", "baerbare"],
  ["dell-latitude-5410", "Dell Latitude 5410", "Dell", "baerbare"],
  ["dell-latitude-7490", "Dell Latitude 7490", "Dell", "baerbare"],
  ["hp-zbook-15", "HP ZBook 15", "HP", "workstations"],
  ["hp-elitedesk-800", "HP EliteDesk 800", "HP", "stationaere"],
  ["lenovo-thinkcentre-m720q", "Lenovo ThinkCentre M720q Tiny", "Lenovo", "stationaere"],
  ["dell-optiplex-5060", "Dell OptiPlex 5060", "Dell", "stationaere"],
  ["dell-ultrasharp-u2419h", "Dell UltraSharp U2419H", "Dell", "skaerme"],
  ["hp-elitedisplay-e243", "HP EliteDisplay E243", "HP", "skaerme"],
  ["lenovo-thinkvision-t24i", "Lenovo ThinkVision T24i", "Lenovo", "skaerme"],
  ["lenovo-thinkpad-ultra-dock", "Lenovo ThinkPad Ultra Dock", "Lenovo", "docking"],
  ["dell-wd19", "Dell Dock WD19", "Dell", "docking"],
  ["hp-usb-c-dock-g5", "HP USB-C Dock G5", "HP", "docking"],
].map(([id, name, brand, type]) => ({ id, name, brand, type }));

const BUDGET = [
  {
    ...MODELS[0],
    budget: 2700,
    configuration: {
      da: "i5-8250U · 16 GB · 256 GB SSD · nordisk tastatur",
      en: "i5-8250U · 16 GB · 256 GB SSD · Nordic keyboard",
    },
  },
  {
    ...MODELS[1],
    name: "Lenovo ThinkPad T14 G2",
    budget: 3000,
    configuration: {
      da: "i5-1145G7 · 16 GB · 256 GB SSD · nordisk tastatur · stand God",
      en: "i5-1145G7 · 16 GB · 256 GB SSD · Nordic keyboard · Good condition",
    },
  },
  { ...MODELS[11], name: "Dell OptiPlex 5060 SFF", budget: 2100 },
  {
    ...MODELS[12],
    budget: 1200,
    configuration: {
      da: "23,8″ · Full HD · fod medfølger · stand God",
      en: "23.8-inch · Full HD · stand included · Good condition",
    },
  },
];
const LAPTOPS = MODELS.filter((model) => ["baerbare", "workstations"].includes(model.type));
const escaped = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Real filters operate on model references; comparison never creates stock or an offer. */
export async function verifyCatalogueExplorer(
  browser,
  base,
  fail,
  { regressionsOnly = false } = {},
) {
  console.log("verify: catalogue facets, sorting, comparison and state restoration");
  const origin = new URL(base);
  assert.ok(
    ["localhost", "127.0.0.1", "[::1]"].includes(origin.hostname),
    "catalogue checks are local only",
  );
  const directory = process.env.VERIFY_ARTIFACT_DIR && resolve(process.env.VERIFY_ARTIFACT_DIR);
  if (directory) {
    const repository = fileURLToPath(new URL("../../", import.meta.url));
    const outside = relative(repository, directory);
    assert.ok(
      outside.startsWith("..") || isAbsolute(outside),
      "catalogue artifacts stay outside the repository",
    );
    await mkdir(directory, { recursive: true });
  }
  const images = await browser.newContext();
  const pendingImages = new Set();

  async function scenario(language, mode, width, javaScriptEnabled) {
    const budget = mode === "budget";
    const fragment = mode === "fragment";
    const mini = mode === "mini";
    const fixtures =
      fragment && javaScriptEnabled
        ? [MODELS[8]]
        : mini
          ? [MODELS[10]]
          : budget
            ? BUDGET
            : mode === "laptops"
              ? LAPTOPS
              : MODELS;
    const key = budget ? "budget" : "models";
    const comparisonIds = budget
      ? ["lenovo-thinkpad-t480", "lenovo-thinkpad-t14", "dell-ultrasharp-u2419h"]
      : ["lenovo-thinkpad-t480", "lenovo-thinkpad-t14", "dell-latitude-5410"];
    const path = budget
      ? language === "da"
        ? "/priser"
        : "/en/pricing"
      : mini
        ? language === "da"
          ? "/produkter/mini-pc"
          : "/en/products/mini-pc"
        : mode === "laptops"
          ? language === "da"
            ? "/produkter/baerbare-computere"
            : "/en/products/business-laptops"
          : language === "da"
            ? "/modeller"
            : "/en/models";
    const name = `${mode} ${language} ${width}px ${javaScriptEnabled ? "JS" : "no JS"}`;
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
    const routingErrors = [];
    const externalImages = [];
    const writes = [];
    const pageErrors = [];
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
          writes.push(`${request.method()} ${url.pathname}`);
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
          // Loopback has HTTP, not the deployed site's TLS. Preserve the real
          // policy apart from this test-only HTTP upgrade directive.
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
        routingErrors.push(`${request.method()} ${request.url()}: ${error.message}`);
        await route.abort().catch(() => {});
      }
    });
    const page = await context.newPage();
    page.on("pageerror", (error) => pageErrors.push(error.message));
    const root = () => page.locator(`[data-catalogue='${key}']`);
    const items = () => root().locator("li[data-catalogue-item]:visible");
    const ids = () =>
      items().evaluateAll((nodes) => nodes.map((node) => node.getAttribute("data-catalogue-item")));
    const selector = (attribute, value) => `[${attribute}='${value}']`;
    const queryValues = (parameter) =>
      (new URL(page.url()).searchParams.get(parameter) || "").split(",").filter(Boolean);
    const sameSet = (actual, expected, message) =>
      assert.deepEqual([...actual].sort(), [...expected].sort(), message);

    async function results(expected, message) {
      await page.waitForFunction(
        ({ key, expected }) => {
          const scope = document.querySelector(`[data-catalogue='${key}']`);
          const visible = (node) => {
            const box = node.getBoundingClientRect();
            const style = getComputedStyle(node);
            return (
              box.width > 0 &&
              box.height > 0 &&
              style.display !== "none" &&
              style.visibility !== "hidden"
            );
          };
          const nodes = [...(scope?.querySelectorAll("li[data-catalogue-item]") || [])].filter(
            visible,
          );
          const actual = nodes.map((node) => node.getAttribute("data-catalogue-item")).sort();
          return JSON.stringify(actual) === JSON.stringify([...expected].sort());
        },
        { key, expected },
      );
      sameSet(await ids(), expected, message);
      const count = root().locator("[data-catalogue-count]");
      assert.equal(await count.count(), 1, "one live result count describes this catalogue");
      assert.equal(
        Number((await count.innerText()).match(/\d+/)?.[0]),
        expected.length,
        "the live result count matches the rendered cards",
      );
    }

    async function ordered(expected, message) {
      await page.waitForFunction(
        ({ key, expected }) => {
          const nodes = [
            ...document.querySelectorAll(`[data-catalogue='${key}'] li[data-catalogue-item]`),
          ];
          const actual = nodes
            .filter((node) => {
              const box = node.getBoundingClientRect();
              return box.width > 0 && box.height > 0;
            })
            .map((node) => node.getAttribute("data-catalogue-item"));
          return JSON.stringify(actual) === JSON.stringify(expected);
        },
        { key, expected },
      );
      assert.deepEqual(await ids(), expected, message);
    }

    async function target(control, label) {
      assert.ok(await control.isVisible(), `${label} is visible`);
      const box = await control.boundingBox();
      assert.ok(box && box.width >= 44 && box.height >= 44, `${label} has a 44px target`);
    }

    async function filters() {
      const first = root().locator("input[data-catalogue-brand]").first();
      const toggle = root().locator("[data-catalogue-filter-toggle]");
      const hasToggle = budget || width < 1024;
      if (hasToggle) await target(toggle, "the compact filter toggle");
      else
        assert.equal(
          await toggle.isVisible(),
          false,
          "desktop models use their visible facet sidebar",
        );
      if (!(await first.isVisible())) {
        await toggle.click();
      }
      assert.ok(await first.isVisible(), "brand filters are accessible on this viewport");
      if (hasToggle)
        assert.equal(
          await toggle.getAttribute("aria-expanded"),
          "true",
          "the panel state is explicit",
        );
      const controls = await toggle.getAttribute("aria-controls");
      assert.ok(controls, "the filter toggle identifies its inline panel");
      const panel = page.locator(`[id=${JSON.stringify(controls)}]`);
      assert.ok(await panel.isVisible(), "the controlled filter panel is visible");
      const searchBox = await root().locator("[data-catalogue-search]").boundingBox();
      const panelBox = await panel.boundingBox();
      assert.ok(
        searchBox && panelBox && searchBox.y + searchBox.height <= panelBox.y + 1,
        "the filter panel follows the shared search toolbar",
      );
      if (hasToggle) {
        const toggleBox = await toggle.boundingBox();
        assert.ok(
          searchBox &&
            toggleBox &&
            Math.abs(searchBox.y - toggleBox.y) <= 1 &&
            searchBox.x + searchBox.width <= toggleBox.x + 1,
          "compact filters share the search row without covering the input",
        );
      } else if (width >= 1024) {
        const resultColumn = await root()
          .locator("ul")
          .evaluate((element) => element.parentElement.getBoundingClientRect().toJSON());
        assert.ok(
          resultColumn.width > 0 && panelBox && panelBox.x + panelBox.width <= resultColumn.x + 1,
          "the desktop model sidebar stays beside the result column beneath the shared toolbar",
        );
      }
      assert.notEqual(
        await page.evaluate(() => document.body.style.overflow),
        "hidden",
        "the inline filter panel does not lock the page",
      );
      assert.equal(
        await page.locator("main[inert]").count(),
        0,
        "inline filters leave the results accessible",
      );
    }

    async function check(attribute, value, checked = true) {
      await filters();
      const control = root().locator(selector(attribute, value));
      assert.equal(await control.count(), 1, "each facet value has one native control");
      assert.equal(
        await control.getAttribute("type"),
        "checkbox",
        "facets and comparison use native checkboxes",
      );
      const box = await control.evaluate((node) =>
        (node.closest("label") || node).getBoundingClientRect().toJSON(),
      );
      assert.ok(box.width >= 44 && box.height >= 44, "a native checkbox has a touch-sized label");
      await control.setChecked(checked);
      assert.equal(await control.isChecked(), checked, "the native checkbox state changes");
      assert.equal(
        new URL(page.url()).pathname,
        path,
        "checking a facet does not activate a model card",
      );
    }

    async function clear() {
      if (!(await root().locator("[data-catalogue-clear]:visible").count())) await filters();
      const reset = root().locator("[data-catalogue-clear]:visible").first();
      await target(reset, "clear filters");
      await reset.click();
      await results(
        fixtures.map((entry) => entry.id),
        "clear restores the complete scoped model set",
      );
      assert.equal(
        await root().locator("[data-catalogue-search]").inputValue(),
        "",
        "clear resets search",
      );
      assert.equal(
        await root().locator("[data-catalogue-sort]").inputValue(),
        "default",
        "clear resets sort",
      );
      assert.equal(
        queryValues("brand").length + queryValues("type").length,
        0,
        "clear removes facet URL state",
      );
      assert.equal(
        await root().locator("[data-catalogue-clear]:visible").count(),
        0,
        "reset disappears when no query, facet or non-default sort remains",
      );
    }

    async function noOverflow() {
      assert.ok(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
        "catalogue controls and results do not overflow the document",
      );
    }

    async function modelMedia({ grid = false } = {}) {
      if (budget) return;
      for (const card of await items().all()) {
        const media = card.locator("[data-catalogue-media]");
        assert.equal(await media.count(), 1, "each model has one deliberately sized media area");
        const frame = await media.boundingBox();
        const image = card.locator("img");
        if (await image.count()) {
          if (grid) assert.ok(frame && frame.height <= 208, "grid model media is capped at 208px");
          assert.equal(
            await image.evaluate((node) => getComputedStyle(node).objectFit),
            "contain",
            "model media keeps the full product visible",
          );
        } else {
          assert.equal(
            await card.locator("[data-catalogue-placeholder]").count(),
            1,
            "unavailable photography has an explicit compact fallback",
          );
          if (grid)
            assert.ok(
              frame && frame.height <= 80,
              "a missing photo does not create an empty grid image well",
            );
        }
      }
    }

    async function listGeometry() {
      if (budget || (await items().count()) < 2 || width < 640) return;
      const first = await items().nth(0).boundingBox();
      const second = await items().nth(1).boundingBox();
      assert.ok(
        first &&
          second &&
          Math.abs(first.x - second.x) <= 1 &&
          second.y >= first.y + first.height - 1,
        "the default model list uses actual full rows",
      );
    }

    async function gridGeometry() {
      if (width < 640 || (await items().count()) < 2) return;
      await page.waitForFunction(
        (key) => {
          const cards = document.querySelectorAll(
            `[data-catalogue='${key}'] li[data-catalogue-item]`,
          );
          const first = cards[0]?.getBoundingClientRect();
          const second = cards[1]?.getBoundingClientRect();
          return (
            first && second && Math.abs(first.y - second.y) <= 1 && first.right <= second.left + 1
          );
        },
        key,
        { timeout: 3000 },
      );
    }

    async function selectionFocus(remaining) {
      await page.waitForFunction(
        (remaining) => {
          const active = document.activeElement;
          return (
            active?.matches("[data-catalogue-search]") ||
            remaining.includes(active?.getAttribute("data-catalogue-remove"))
          );
        },
        remaining,
        { timeout: 3000 },
      );
      const active = page.locator(":focus");
      assert.ok(await active.isVisible(), "removing a selected model leaves visible logical focus");
      assert.ok(
        await active.evaluate((node) => {
          const box = node.getBoundingClientRect();
          const hit = document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2);
          return hit === node || node.contains(hit);
        }),
        "the restored selection focus is in the viewport and unobscured",
      );
    }

    async function comparisonKeyboard(comparison) {
      const links = comparison.locator("thead a");
      assert.equal(await links.count(), 3, "keyboard comparison has three real model headings");
      const visibleFocus = async (link) => {
        const observed = await link.evaluate(async (node) => {
          await new Promise((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(resolve)),
          );
          const box = node.getBoundingClientRect();
          const region = node.closest("[role='region']").getBoundingClientRect();
          const points = [box.left + 1, box.left + box.width / 2, box.right - 1];
          return {
            focused: node === document.activeElement,
            left: box.left,
            right: box.right,
            regionLeft: region.left,
            regionRight: region.right,
            unobscured: points.every((x) => {
              const hit = document.elementFromPoint(x, box.top + box.height / 2);
              return hit === node || node.contains(hit);
            }),
          };
        });
        assert.ok(
          observed.focused &&
            observed.unobscured &&
            observed.left >= observed.regionLeft - 1 &&
            observed.right <= observed.regionRight + 1,
          `the focused comparison heading stays fully readable when tabbing in either direction: ${JSON.stringify(observed)}`,
        );
      };
      await links.nth(2).focus();
      await visibleFocus(links.nth(2));
      for (const [key, index] of [
        ["Shift+Tab", 1],
        ["Shift+Tab", 0],
        ["Tab", 1],
        ["Tab", 2],
      ]) {
        await page.keyboard.press(key);
        await visibleFocus(links.nth(index));
      }
    }

    try {
      const response = await page.goto(base + path + (fragment ? "#workstations" : ""), {
        waitUntil: "networkidle",
      });
      assert.equal(response?.status(), 200, "the catalogue route is available");
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await root().count(), 1, "there is one explorer for the route's data set");
      await results(
        fixtures.map((entry) => entry.id),
        "the complete reference set is available initially",
      );
      const initialOrder = await ids();
      const canonical = await page.locator("link[rel='canonical']").getAttribute("href");
      assert.equal(
        new URL(canonical).origin,
        "https://www.kestro.dk",
        "catalogue UI state retains Kestro's production canonical host",
      );
      assert.equal(
        new URL(canonical).pathname,
        path,
        "the clean catalogue keeps its canonical route",
      );
      assert.equal(new URL(canonical).search, "", "the canonical has no UI state parameters");
      assert.equal(
        await page.locator("main h1").count(),
        1,
        "the catalogue retains one primary heading",
      );
      const count = root().locator("[data-catalogue-count]");
      assert.ok(
        (await count.getAttribute("aria-live")) === "polite" ||
          (await count.getAttribute("role")) === "status",
        "changed result counts are announced politely",
      );

      for (const entry of fixtures) {
        const card = root().locator(selector("data-catalogue-item", entry.id));
        assert.equal(await card.count(), 1, "each model appears exactly once");
        assert.equal(
          await card.getByRole("heading", { name: entry.name, exact: true }).count(),
          1,
          "every item identifies its real reference model",
        );
        const detail = card.locator("a[data-catalogue-detail]");
        const enquiry = card.locator("a[data-catalogue-enquiry]");
        for (const [control, label] of [
          [detail, "model details"],
          [enquiry, "model enquiry"],
        ]) {
          assert.equal(await control.count(), 1, "model actions are distinct");
          await target(control, label);
        }
        const detailUrl = new URL(await detail.getAttribute("href"), origin);
        assert.equal(detailUrl.origin, origin.origin, "model details stay on Kestro");
        assert.equal(
          detailUrl.pathname,
          `${language === "da" ? "/modeller" : "/en/models"}/${entry.id}`,
          "the model's canonical detail route is preserved",
        );
        if (!budget)
          assert.equal(
            await card
              .locator("a")
              .evaluateAll(
                (links, pathname) =>
                  links.filter((link) => new URL(link.href).pathname === pathname).length,
                detailUrl.pathname,
              ),
            1,
            "a model row has one clear detail link on its name",
          );
        const enquiryUrl = new URL(await enquiry.getAttribute("href"), origin);
        assert.equal(enquiryUrl.origin, origin.origin, "the enquiry stays on Kestro");
        assert.equal(
          enquiryUrl.pathname,
          language === "da" ? "/tilbud" : "/en/get-a-quote",
          "the enquiry uses the existing locale route",
        );
        assert.ok(
          enquiryUrl.searchParams.get("model")?.includes(entry.name),
          "the enquiry preserves the selected model",
        );
        const layout = await card.evaluate((node) => {
          const card = node.getBoundingClientRect();
          const clipped = [...node.querySelectorAll("h2,h3,p,a,label")]
            .filter((child) => {
              const box = child.getBoundingClientRect();
              const style = getComputedStyle(child);
              if (
                !box.width ||
                !box.height ||
                style.display === "none" ||
                style.visibility === "hidden" ||
                child.classList.contains("sr-only") ||
                child.closest("[aria-hidden='true']")
              )
                return false;
              return (
                Number.parseFloat(style.fontSize) < 12 ||
                child.scrollWidth > child.clientWidth + 2 ||
                box.left < card.left - 1 ||
                box.right > card.right + 1
              );
            })
            .map((child) => child.textContent.trim());
          return { left: card.left, right: card.right, height: card.height, clipped };
        });
        assert.ok(layout.left >= -1 && layout.right <= width + 1, "model cards fit the viewport");
        if (!budget && (width === 1440 || width === 390))
          assert.ok(
            layout.height > 0 && layout.height <= (width === 1440 ? 240 : 320),
            `default model rows stay compact at ${width}px without clipping content: ${layout.height}px`,
          );
        assert.deepEqual(
          layout.clipped,
          [],
          "model names, facts and controls are readable without clipping",
        );
      }
      await modelMedia();
      if (budget) await gridGeometry();
      else await listGeometry();
      if (!fragment)
        assert.equal(
          await root().locator("[data-catalogue-clear]:visible").count(),
          0,
          "the unfiltered catalogue has no no-op Reset control",
        );
      if (budget || width < 640)
        assert.equal(
          await root().locator("[data-catalogue-view]:visible").count(),
          0,
          budget
            ? "budget references have one grid presentation"
            : "phones have one compact presentation",
        );
      const offers = await page
        .locator("script[type='application/ld+json']")
        .evaluateAll((nodes) => {
          const found = [];
          const visit = (value) => {
            if (!value || typeof value !== "object") return;
            if (Array.isArray(value)) return value.forEach(visit);
            if ([value["@type"]].flat().some((type) => /^(Offer|AggregateOffer)$/.test(type || "")))
              found.push(value);
            Object.values(value).forEach(visit);
          };
          nodes.forEach((node) => visit(JSON.parse(node.textContent)));
          return found;
        });
      assert.deepEqual(offers, [], "reference sorting does not fabricate a sales offer");
      assert.equal(
        await root()
          .getByRole("button", { name: /add to cart|læg i kurv|buy now|køb nu/i })
          .count(),
        0,
        "comparison does not introduce a purchase control",
      );
      if (!budget) {
        assert.equal(
          await root().locator("[data-catalogue-sort] option[value^='budget-']").count(),
          0,
          "unpriced models cannot be sorted by invented prices",
        );
        assert.doesNotMatch(
          await root().innerText(),
          /\b\d[\d.,]*\s+DKK\b/i,
          "the reference model catalogue displays no fabricated prices",
        );
      }
      await noOverflow();

      if (mini) {
        assert.equal(
          await root()
            .locator(
              "input[data-catalogue-brand]:visible,input[data-catalogue-category]:visible,[data-catalogue-filter-toggle]:visible",
            )
            .count(),
          0,
          "a single-brand, single-type category has no redundant visible facets",
        );
        assert.equal(
          await root().locator("[data-catalogue-compare]").count(),
          0,
          "a category with one model offers no unusable comparison selection",
        );
      }

      if (fragment) {
        const card = root().locator("[data-catalogue-item='hp-zbook-15']");
        if (javaScriptEnabled)
          await page.waitForFunction(
            () => {
              const box = document
                .querySelector("[data-catalogue-item='hp-zbook-15']")
                ?.getBoundingClientRect();
              return box && box.top >= 80 && box.top <= 700;
            },
            undefined,
            { timeout: 3000, polling: 100 },
          );
        const box = await card.boundingBox();
        assert.ok(
          box && box.y >= 80 && box.y <= 700,
          `the legacy workstations target remains in view after filtering: ${JSON.stringify(box)}`,
        );
        if (javaScriptEnabled) {
          sameSet(queryValues("type"), ["workstations"], "the legacy hash selects its real group");
          const direct = await context.newPage();
          direct.on("pageerror", (error) => pageErrors.push(error.message));
          try {
            const generated = page.url();
            assert.equal(
              new URL(generated).hash,
              "#workstations",
              "the generated URL retains its group target",
            );
            await direct.goto(generated, { waitUntil: "networkidle" });
            await direct.waitForFunction(
              () => {
                const cards = document.querySelectorAll("[data-catalogue-item]");
                const box = document
                  .querySelector("[data-catalogue-item='hp-zbook-15']")
                  ?.getBoundingClientRect();
                return cards.length === 1 && box && box.top >= 80 && box.top <= 700;
              },
              undefined,
              { timeout: 3000, polling: 100 },
            );
            assert.equal(
              await direct.locator("[data-catalogue-item]").getAttribute("data-catalogue-item"),
              "hp-zbook-15",
              "a fresh open of the generated type-plus-hash URL selects and shows the actual ZBook",
            );
            if (directory)
              await direct.screenshot({
                path: join(directory, `catalogue-derived-hash-${language}.png`),
                animations: "disabled",
              });
            const expectIds = async (visitor, expected) => {
              await visitor.waitForFunction((expected) => {
                const actual = [...document.querySelectorAll("[data-catalogue-item]")]
                  .map((node) => node.getAttribute("data-catalogue-item"))
                  .sort();
                return JSON.stringify(actual) === JSON.stringify([...expected].sort());
              }, expected);
            };
            await direct.locator("[data-catalogue-category='baerbare']").check();
            await expectIds(
              direct,
              LAPTOPS.map((entry) => entry.id),
            );
            await direct.locator("[data-catalogue-category='workstations']").uncheck();
            const laptops = MODELS.filter((entry) => entry.type === "baerbare").map(
              (entry) => entry.id,
            );
            assert.equal(
              laptops.length,
              8,
              "the laptop group contains eight actual reference models",
            );
            await expectIds(direct, laptops);
            await direct.waitForFunction(
              () =>
                !location.hash && new URL(location.href).searchParams.get("type") === "baerbare",
              undefined,
              { timeout: 3000 },
            );
            const switched = direct.url();
            assert.equal(
              new URL(switched).hash,
              "",
              "deselecting the legacy group removes its stale target",
            );
            const fresh = await context.newPage();
            fresh.on("pageerror", (error) => pageErrors.push(error.message));
            try {
              assert.equal(
                (await fresh.goto(switched, { waitUntil: "networkidle" }))?.status(),
                200,
                "the switched filter URL opens normally",
              );
              await expectIds(fresh, laptops);
              assert.equal(
                new URL(fresh.url()).hash,
                "",
                "a fresh open retains the normalized filter URL",
              );
              assert.ok(
                await fresh.locator("[data-catalogue-category='baerbare']").isChecked(),
                "the fresh URL restores the selected laptop group",
              );
              assert.equal(
                await fresh.locator("[data-catalogue-category='workstations']").isChecked(),
                false,
                "the removed workstation group stays unselected",
              );
              if (directory)
                await fresh.screenshot({
                  path: join(directory, `catalogue-switched-group-${language}.png`),
                  animations: "disabled",
                });
            } finally {
              await fresh.close();
            }
            const conflicting = await context.newPage();
            conflicting.on("pageerror", (error) => pageErrors.push(error.message));
            try {
              await conflicting.goto(base + path + "?type=baerbare#workstations", {
                waitUntil: "networkidle",
              });
              await expectIds(conflicting, laptops);
              await conflicting.waitForFunction(
                () => {
                  const box = document
                    .querySelector("[data-catalogue='models']")
                    ?.getBoundingClientRect();
                  return !location.hash && box && box.top >= 80 && box.top <= 700;
                },
                undefined,
                { timeout: 3000, polling: 100 },
              );
              assert.equal(
                new URL(conflicting.url()).searchParams.get("type"),
                "baerbare",
                "an older conflicting hash never replaces the explicit laptop filter",
              );
              assert.ok(
                await conflicting.locator("[data-catalogue-category='baerbare']").isChecked(),
                "the conflicting URL still restores its explicit selected group",
              );
              assert.equal(
                await conflicting.locator("[data-catalogue-category='workstations']").isChecked(),
                false,
                "an obsolete target does not reselect its removed group",
              );
              if (directory)
                await conflicting.screenshot({
                  path: join(directory, `catalogue-conflicting-hash-${language}.png`),
                  animations: "disabled",
                });
            } finally {
              await conflicting.close();
            }
          } finally {
            await direct.close();
          }
        }
      } else if (!javaScriptEnabled) {
        assert.match(
          await root().innerText(),
          /JavaScript/i,
          "the non-script fallback explains interactive controls",
        );
        const controls = root().locator("input,select,button");
        for (const control of await controls.all())
          assert.ok(
            await control.isDisabled(),
            "non-script filters and comparison do not pretend to work",
          );
        await root().locator("a[data-catalogue-detail]").first().click();
        await page.waitForURL((url) =>
          url.pathname.startsWith(language === "da" ? "/modeller/" : "/en/models/"),
        );
        assert.equal(
          await page.locator("main h1").count(),
          1,
          "native model navigation works without scripts",
        );
        await page.goBack({ waitUntil: "networkidle" });
        await results(
          fixtures.map((entry) => entry.id),
          "Back restores the complete non-script catalogue",
        );
      } else {
        const search = root().locator("[data-catalogue-search]");
        const sort = root().locator("[data-catalogue-sort]");
        if (mini) {
          await root().locator("a[data-catalogue-detail]").click();
          await page.waitForURL((url) => url.pathname.endsWith("/lenovo-thinkcentre-m720q"));
          assert.equal(await page.locator("main h1").count(), 1, "the mini-PC detail link works");
          await page.goBack({ waitUntil: "networkidle" });
          await results([MODELS[10].id], "Back retains the single real mini-PC reference");
          await root().locator("a[data-catalogue-enquiry]").click();
          await page.waitForFunction(
            (expected) => document.querySelector("#udstyr")?.value === expected,
            MODELS[10].name,
          );
          assert.equal(
            await page.locator("#udstyr").inputValue(),
            MODELS[10].name,
            "the mini-PC enquiry preserves the actual model",
          );
          await page.goBack({ waitUntil: "networkidle" });
          await results(
            [MODELS[10].id],
            "the single model remains usable after enquiry navigation",
          );
        } else {
          await target(search, "catalogue search");
          await target(sort, "catalogue sort");
          assert.ok(await search.isEnabled(), "search becomes active after hydration");
          assert.ok(await sort.isEnabled(), "sorting becomes active after hydration");
        }

        if (!mini && width === 320) {
          for (const id of comparisonIds)
            await root().locator(selector("data-catalogue-compare", id)).check();
          const before = await page.evaluate(() => scrollY);
          const open = root().locator("[data-catalogue-compare-open]");
          await open.click();
          const comparison = root().locator("[data-catalogue-comparison]");
          await comparison.waitFor({ state: "visible" });
          await page.waitForFunction(() =>
            document.activeElement?.matches("[data-catalogue-comparison] h2"),
          );
          assert.equal(
            await root().locator("[data-catalogue-tray]:visible").count(),
            0,
            "an open comparison has no floating tray over its table",
          );
          assert.ok(
            await root().locator("[data-catalogue-selection]").isVisible(),
            "comparison selection controls are inline",
          );
          await comparisonKeyboard(comparison);
          await comparison.locator("[data-catalogue-compare-close]").click();
          await comparison.waitFor({ state: "hidden" });
          await page.waitForFunction((before) => Math.abs(scrollY - before) <= 2, before, {
            timeout: 3000,
          });
          assert.ok(
            await open.evaluate((node) => node === document.activeElement),
            "closing comparison returns focus to its opener",
          );
          await root().locator("[data-catalogue-compare-clear]").click();
          await root().locator("[data-catalogue-tray]").waitFor({ state: "hidden" });
        }

        if (!mini && [390, 1440].includes(width)) {
          if (width === 1440) {
            await sort.selectOption("name-desc");
            await root().locator("[data-catalogue-clear]:visible").waitFor();
            await clear();
            await ordered(initialOrder, "sort-only reset restores the original catalogue order");
          }
          await check("data-catalogue-brand", "Dell");
          const dell = fixtures.filter((entry) => entry.brand === "Dell");
          await results(
            dell.map((entry) => entry.id),
            "brand filtering returns the documented Dell models",
          );
          sameSet(queryValues("brand"), ["Dell"], "brand selection is reflected in the URL");
          if (mode !== "budget") {
            await check("data-catalogue-category", "baerbare");
            await results(
              ["dell-latitude-5410", "dell-latitude-7490"],
              "type and brand combine with AND",
            );
            await sort.selectOption("name-desc");
            await page.waitForFunction(
              ({ key }) =>
                document
                  .querySelector(`[data-catalogue='${key}'] li[data-catalogue-item]`)
                  ?.getAttribute("data-catalogue-item") === "dell-latitude-7490",
              { key },
            );
            await ordered(
              ["dell-latitude-7490", "dell-latitude-5410"],
              "descending sort orders the filtered Dell pair correctly",
            );
            await sort.selectOption("name-asc");
            await ordered(
              ["dell-latitude-5410", "dell-latitude-7490"],
              "ascending sort orders the same set correctly",
            );
          } else {
            await sort.selectOption("budget-asc");
            await ordered(
              ["dell-ultrasharp-u2419h", "dell-optiplex-5060"],
              "budget sorting uses only the four dated reference amounts",
            );
            await sort.selectOption("budget-desc");
            await ordered(
              ["dell-optiplex-5060", "dell-ultrasharp-u2419h"],
              "descending budgets retain the documented totals",
            );
          }
          await check("data-catalogue-brand", "Lenovo");
          const orResults = fixtures.filter(
            (entry) =>
              ["Dell", "Lenovo"].includes(entry.brand) &&
              (mode === "budget" || entry.type === "baerbare"),
          );
          await results(
            orResults.map((entry) => entry.id),
            "multiple brands combine with OR inside the selected type",
          );
          await clear();
          assert.deepEqual(await ids(), initialOrder, "clear restores the default display order");
          for (const query of ["Lenovo T480", "  Lenovo   ThinkPad T480  ", "T480 Lenovo"]) {
            await search.fill(query);
            await results(
              ["lenovo-thinkpad-t480"],
              "model search matches all words independently of order or repeated whitespace",
            );
          }
          if (budget) {
            await search.fill("T14 16 GB");
            await results(
              ["lenovo-thinkpad-t14"],
              "budget search combines a model token with its real RAM configuration",
            );
            await search.fill("Lenovo 16 GB");
            await results(
              ["lenovo-thinkpad-t480", "lenovo-thinkpad-t14"],
              "budget search requires every brand and specification token",
            );
          }
          await search.fill("Lenovo T480 nonexistent");
          await results(
            [],
            "multiword search uses AND rather than admitting partial token matches",
          );
          await search.fill("T14");
          await results(
            ["lenovo-thinkpad-t14"],
            "literal model search returns the existing T14 reference",
          );
          assert.equal(
            new URL(page.url()).searchParams.get("q"),
            "T14",
            "search is reflected in the URL",
          );
          await search.fill("<script>unmatched-reference</script>");
          await results([], "unmatched text produces a real empty state");
          assert.equal(
            await root().locator("script").count(),
            0,
            "search text is not inserted as executable markup",
          );
          await clear();

          const selected = comparisonIds;
          const compare = (id) => root().locator(selector("data-catalogue-compare", id));
          for (const [index, id] of selected.entries()) {
            const control = compare(id);
            assert.equal(
              await control.count(),
              1,
              "each item has an independent comparison checkbox",
            );
            const entry = fixtures.find((entry) => entry.id === id);
            assert.equal(
              await control
                .and(root().getByRole("checkbox", { name: new RegExp(escaped(entry.name), "i") }))
                .count(),
              1,
              "comparison names the selected model accessibly",
            );
            await control.check();
            assert.equal(
              new URL(page.url()).pathname,
              path,
              "comparing does not activate a detail or enquiry link",
            );
            sameSet(
              queryValues("compare"),
              selected.slice(0, index + 1),
              "comparison state retains model identities",
            );
            const open = root().locator("[data-catalogue-compare-open]");
            if (index === 0)
              assert.ok(await open.isDisabled(), "one selected model cannot open a comparison");
            else assert.ok(await open.isEnabled(), "two or more models can be compared");
          }
          for (const entry of fixtures.filter((entry) => !selected.includes(entry.id)))
            assert.ok(
              await compare(entry.id).isDisabled(),
              "comparison prevents selection beyond three",
            );
          if (width === 390 && mode === "models") {
            const cookies = page.locator("footer").getByRole("button", {
              name: language === "da" ? "Cookies og statistik" : "Cookies and statistics",
              exact: true,
            });
            await cookies.scrollIntoViewIfNeeded();
            await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
            const footer = await cookies.evaluate((node) => {
              const box = node.getBoundingClientRect();
              const tray = document.querySelector("[data-catalogue-tray]").getBoundingClientRect();
              const hit = document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2);
              return {
                bottom: box.bottom,
                trayTop: tray.top,
                unobscured: hit === node || node.contains(hit),
              };
            });
            assert.ok(
              footer.unobscured && footer.bottom <= footer.trayTop + 1,
              `the fixed comparison tray leaves the complete footer Cookies target usable: ${JSON.stringify(footer)}`,
            );
          }
          await sort.selectOption("name-desc");
          await search.fill("T14");
          await results(
            ["lenovo-thinkpad-t14"],
            "filtering can hide selected cards without losing selection",
          );
          sameSet(
            queryValues("compare"),
            selected,
            "selected models survive filtering and sorting",
          );
          const tray = root().locator("[data-catalogue-tray]");
          assert.ok(await tray.isVisible(), "hidden selected models remain accessible in the tray");
          for (const id of selected)
            await target(
              tray.locator(selector("data-catalogue-remove", id)),
              "remove a selected model",
            );
          const open = root().locator("[data-catalogue-compare-open]");
          await target(open, "open comparison");
          const browsingPosition = await page.evaluate(() => scrollY);
          await open.click();
          const comparison = root().locator("[data-catalogue-comparison]");
          await comparison.waitFor({ state: "visible" });
          await page.waitForFunction(() =>
            document.activeElement?.matches("[data-catalogue-comparison] h2"),
          );
          assert.equal(
            await root().locator("[data-catalogue-tray]:visible").count(),
            0,
            "the floating tray is removed while comparison is open",
          );
          const inlineSelection = root().locator("[data-catalogue-selection]");
          assert.ok(
            await inlineSelection.isVisible(),
            "selected models have inline comparison controls",
          );
          for (const id of selected)
            await target(
              inlineSelection.locator(selector("data-catalogue-remove", id)),
              "inline removal of a selected model",
            );
          await target(
            inlineSelection.locator("[data-catalogue-compare-clear]"),
            "inline clear comparison",
          );
          assert.equal(
            await comparison.locator("table").count(),
            1,
            "comparison uses a real data table",
          );
          for (const id of selected)
            assert.ok(
              await comparison
                .getByText(fixtures.find((entry) => entry.id === id).name, { exact: true })
                .first()
                .isVisible(),
              "the table compares selected identities, including cards hidden by filters",
            );
          assert.doesNotMatch(
            await comparison.innerText(),
            /\b(?:undefined|null|NaN)\b/,
            "unknown or inapplicable facts do not become broken values",
          );
          if (budget) {
            const amounts = comparison.getByRole("row").filter({
              has: page.getByRole("rowheader", {
                name: language === "da" ? "Historisk budget" : "Historical budget",
                exact: true,
              }),
            });
            assert.deepEqual(
              await amounts.getByRole("cell").allTextContents(),
              selected.map(
                (id) =>
                  `${new Intl.NumberFormat(language === "da" ? "da-DK" : "en-GB").format(fixtures.find((entry) => entry.id === id).budget)} DKK`,
              ),
              "comparison budgets retain the same dated amounts in selection order",
            );
            const configurations = comparison.getByRole("row").filter({
              has: page.getByRole("rowheader", {
                name: language === "da" ? "Konfiguration" : "Configuration",
                exact: true,
              }),
            });
            assert.deepEqual(
              await configurations.getByRole("cell").allTextContents(),
              selected.map(
                (id) => fixtures.find((entry) => entry.id === id).configuration[language],
              ),
              "comparison preserves the dated generation, RAM, keyboard and condition qualifiers",
            );
          } else {
            const memory = comparison.getByRole("row").filter({
              has: page.getByRole("rowheader", {
                name: language === "da" ? "Hukommelse" : "Memory",
                exact: true,
              }),
            });
            assert.equal(
              (await memory.getByRole("cell").allTextContents())[0],
              language === "da"
                ? "8 GB DDR4 – kan udvides til 32 GB"
                : "8 GB DDR4 — expandable to 32 GB",
              "comparison distinguishes supplied model-family RAM from its upgrade ceiling",
            );
            const ports = comparison.getByRole("row").filter({
              has: page.getByRole("rowheader", {
                name: language === "da" ? "Porte" : "Ports",
                exact: true,
              }),
            });
            assert.equal(await ports.count(), 1, "comparison includes its researched ports row");
            const portValues = await ports.getByRole("cell").allTextContents();
            for (const index of [0, 1]) {
              assert.match(
                portValues[index] || "",
                /\bUSB\b/,
                `${fixtures.find((entry) => entry.id === selected[index]).name} retains USB port information instead of an unknown marker`,
              );
              assert.match(
                portValues[index] || "",
                /\bHDMI\b/,
                "qualified model port information retains its display connection",
              );
            }
          }
          if (width === 390) await comparisonKeyboard(comparison);
          await noOverflow();
          const close = comparison.locator("[data-catalogue-compare-close]");
          await target(close, "close comparison");
          await close.click();
          await comparison.waitFor({ state: "hidden" });
          await page.waitForFunction(
            (position) => Math.abs(scrollY - position) <= 2,
            browsingPosition,
            { timeout: 3000 },
          );
          assert.ok(
            await open.evaluate((node) => node === document.activeElement),
            "closing comparison restores its opener focus",
          );
          sameSet(queryValues("compare"), selected, "closing the table retains selection");
          await clear();
          sameSet(
            queryValues("compare"),
            selected,
            "clear filters does not discard comparison selection",
          );
          await root().locator(selector("data-catalogue-remove", selected[0])).focus();
          await page.keyboard.press("Enter");
          await selectionFocus(selected.slice(1));
          sameSet(
            queryValues("compare"),
            selected.slice(1),
            "removing one selected model frees a slot",
          );
          assert.ok(
            await compare(selected[0]).isEnabled(),
            "unselected models are enabled below the comparison limit",
          );
          await root().locator("[data-catalogue-compare-open]").click();
          await comparison.waitFor({ state: "visible" });
          const inlineRemove = root()
            .locator("[data-catalogue-selection]")
            .locator(selector("data-catalogue-remove", selected[1]));
          await inlineRemove.focus();
          await page.keyboard.press("Enter");
          await comparison.waitFor({ state: "hidden" });
          await selectionFocus(selected.slice(2));
          sameSet(
            queryValues("compare"),
            selected.slice(2),
            "removing from an open two-model comparison closes it and keeps the remaining selection",
          );
          await root().locator("[data-catalogue-compare-clear]").click();
          assert.deepEqual(
            queryValues("compare"),
            [],
            "clear comparison removes all selected models",
          );
          await tray.waitFor({ state: "hidden" });

          const list = root().locator("[data-catalogue-view='list']");
          const optionalGrid = !budget && width >= 640;
          if (optionalGrid) {
            assert.equal(
              await list.getAttribute("aria-pressed"),
              "true",
              "models start in their compact list view",
            );
            const listWidth = (await items().first().boundingBox()).width;
            const grid = root().locator("[data-catalogue-view='grid']");
            await target(grid, "optional grid view");
            await grid.click();
            assert.equal(
              await grid.getAttribute("aria-pressed"),
              "true",
              "the active view is indicated statically",
            );
            assert.equal(
              new URL(page.url()).searchParams.get("view"),
              "grid",
              "the chosen view is reflected in the URL",
            );
            await gridGeometry();
            assert.ok(
              (await items().first().boundingBox()).width < listWidth - 1,
              "the optional grid changes the actual model layout",
            );
            await modelMedia({ grid: true });
          } else {
            assert.equal(
              await root().locator("[data-catalogue-view]:visible").count(),
              0,
              budget
                ? "budget references retain one grid presentation"
                : "phones keep one compact layout without redundant view toggles",
            );
          }
          await search.fill("T14");
          await results(["lenovo-thinkpad-t14"], "view changes do not change filter meaning");
          const filteredUrl = page.url();
          const filteredResponse = await page.reload({ waitUntil: "networkidle" });
          assert.ok(
            (filteredResponse?.headers()["x-robots-tag"] || "").includes("noindex"),
            "parameterized catalogue views are not indexed as new pages",
          );
          assert.equal(
            await page.locator("link[rel='canonical']").getAttribute("href"),
            canonical,
            "a filtered catalogue retains the clean canonical",
          );
          await results(["lenovo-thinkpad-t14"], "reload restores the URL's filtered state");
          if (optionalGrid)
            assert.equal(
              await root().locator("[data-catalogue-view='grid']").getAttribute("aria-pressed"),
              "true",
              "reload restores the optional model grid",
            );
          else
            assert.equal(
              new URL(page.url()).searchParams.get("view"),
              null,
              "the default mode does not invent a view parameter",
            );
          const detail = root().locator("li[data-catalogue-item] a[data-catalogue-detail]").first();
          await detail.focus();
          await page.keyboard.press("Enter");
          await page.waitForURL((url) => url.pathname.endsWith("/lenovo-thinkpad-t14"));
          assert.equal(
            await page.locator("main h1").count(),
            1,
            "keyboard activation opens the actual model page",
          );
          await page.goBack({ waitUntil: "networkidle" });
          await page.waitForURL(filteredUrl);
          await results(["lenovo-thinkpad-t14"], "Back restores catalogue filters and view");
          const enquiry = root()
            .locator("li[data-catalogue-item] a[data-catalogue-enquiry]")
            .first();
          const expectedEquipment = new URL(
            await enquiry.getAttribute("href"),
            origin,
          ).searchParams.get("model");
          await enquiry.click();
          await page.waitForURL(
            (url) => url.pathname === (language === "da" ? "/tilbud" : "/en/get-a-quote"),
          );
          await page.waitForFunction(
            (expected) => document.querySelector("#udstyr")?.value === expected,
            expectedEquipment,
          );
          assert.equal(
            await page.locator("#udstyr").inputValue(),
            expectedEquipment,
            "the enquiry retains the selected model or dated configuration",
          );
          await page.goBack({ waitUntil: "networkidle" });
          await results(["lenovo-thinkpad-t14"], "Back from enquiry restores catalogue state");
          await clear();
          if (optionalGrid) {
            assert.equal(
              await root().locator("[data-catalogue-view='grid']").getAttribute("aria-pressed"),
              "true",
              "clearing filters retains the chosen model grid",
            );
            await gridGeometry();
            await list.click();
            await page.waitForFunction(() => !new URL(location.href).searchParams.has("view"));
            await listGeometry();
          } else {
            assert.equal(
              new URL(page.url()).searchParams.get("view"),
              null,
              "clearing filters preserves the mode's default presentation",
            );
          }
          if (budget && width === 1440) {
            await page.goto(base + path + "?view=list", { waitUntil: "networkidle" });
            await results(
              fixtures.map((entry) => entry.id),
              "a stale list parameter does not change budget references",
            );
            await page.waitForFunction(() => !new URL(location.href).searchParams.has("view"));
            assert.equal(
              await root().locator("[data-catalogue-view]:visible").count(),
              0,
              "budget mode does not expose an unsupported view toggle",
            );
            await gridGeometry();
          }
          await noOverflow();
        }
      }
      if (directory && [390, 1440].includes(width)) {
        if (!fragment) await root().locator("[data-catalogue-count]").scrollIntoViewIfNeeded();
        await page.screenshot({
          path: join(
            directory,
            `catalogue-${mode}-${language}-${width}-${javaScriptEnabled ? "js" : "nojs"}.png`,
          ),
          animations: "disabled",
          fullPage: false,
        });
      }
      assert.deepEqual(externalImages, [], "catalogue browsing does not hotlink product pictures");
      assert.deepEqual(writes, [], "filtering and comparison send no purchase or enquiry");
      assert.deepEqual(routingErrors, [], "local routing completes without errors");
      assert.deepEqual(pageErrors, [], "the catalogue journey has no JavaScript errors");
      console.log(`verify: catalogue explorer passed: ${name}`);
    } catch (error) {
      fail(`catalogue explorer ${name}`, error.stack || error.message);
    } finally {
      closing = true;
      await context.unrouteAll({ behavior: "ignoreErrors" });
      await context.close();
    }
  }

  try {
    for (const language of ["da", "en"]) {
      for (const mode of ["models", "budget"]) {
        for (const width of regressionsOnly ? [320, 390, 1440] : WIDTHS)
          await scenario(language, mode, width, true);
        if (!regressionsOnly) await scenario(language, mode, 390, false);
      }
      for (const width of regressionsOnly ? [390] : [390, 1440])
        await scenario(language, "laptops", width, true);
      if (!regressionsOnly) await scenario(language, "laptops", 390, false);
    }
    for (const language of ["da", "en"]) await scenario(language, "fragment", 1440, true);
    await scenario("da", "fragment", 390, false);
    await scenario("da", "mini", 390, true);
    await scenario("en", "mini", 1440, true);
    await scenario("da", "mini", 390, false);
  } finally {
    await Promise.allSettled([...pendingImages]);
    await images.close();
  }
}
