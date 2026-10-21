import assert from "node:assert/strict";
import crypto from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { assertAdminContrast } from "./admin-contrast.mjs";

const base = process.env.VERIFY_BASE;
const secret = process.env.VERIFY_ADMIN_SECRET;
const origin = new URL(base || "http://invalid.invalid");
assert.ok(["127.0.0.1", "localhost", "[::1]"].includes(origin.hostname), "fixtures are local only");
assert.ok(
  secret && process.env.VERIFY_ADMIN_FIXTURE === "local-only",
  "a local fixture server is required",
);
const home = process.env.USERPROFILE || process.env.HOME || "";
let playwright;
try {
  playwright = await import("playwright");
} catch {
  const candidate = [
    process.env.PLAYWRIGHT_MODULE,
    "/opt/node22/lib/node_modules/playwright/index.mjs",
    join(
      home,
      ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs",
    ),
  ].find((path) => path && existsSync(path));
  assert.ok(candidate, "Playwright is available");
  playwright = await import(pathToFileURL(candidate).href);
}
const executablePath = [
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
  "/opt/pw-browsers/chromium",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
].find((path) => path && existsSync(path));
const browser = await playwright.chromium.launch({
  ...(executablePath ? { executablePath } : {}),
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
const expiry = String(Date.now() + 10 * 60_000);
const cookie = `__Host-kestro_admin=${expiry}.${crypto.createHmac("sha256", secret).update(expiry).digest("base64url")}`;
const id = (number) => `00000000-0000-4000-8000-${String(number).padStart(12, "0")}`;
const failures = [];

async function scenario(name, run) {
  console.log(`verify: admin fixture scenario: ${name}`);
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  context.setDefaultTimeout(15000);
  context.setDefaultNavigationTimeout(30000);
  let contextClosing = false;
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
        // Buffer document and Flight GETs through the same loopback transport.
        // Mixing fulfilled documents with native streamed Flight requests made
        // Chromium abort valid responses before their navigation committed here.
        // Exact UI assertions still apply; no application route or data changes.
        const response = await route.fetch({
          maxRedirects: 0,
          headers: await request.allHeaders(),
        });
        const headers = response.headers();
        // This test server is HTTP. Remove only the document's transport upgrade
        // so relative 303 redirects do not target TLS on a non-TLS port. Flight
        // headers and all production auth/CSRF/CSP assertions stay unchanged.
        if (request.isNavigationRequest() && headers["content-security-policy"])
          headers["content-security-policy"] = headers["content-security-policy"].replace(
            /(^|;)\s*upgrade-insecure-requests\s*(?=;|$)/g,
            "$1",
          );
        return await route.fulfill({ response, headers });
      }
      return await route.continue();
    } catch (error) {
      // Navigation supersedes buffered Flight responses. Ignore only that
      // confirmed browser cancellation or our own completed-scenario teardown;
      // every other transport failure still fails verification.
      if (contextClosing || request.failure()?.errorText === "net::ERR_ABORTED") return;
      throw error;
    }
  });
  const page = await context.newPage();
  const pendingRequests = new Map();
  const recentRequests = [];
  function recordRequest(entry) {
    recentRequests.push(entry);
    if (recentRequests.length > 40) recentRequests.shift();
  }
  page.on("request", (request) => {
    const url = new URL(request.url());
    const entry = {
      method: request.method(),
      path: `${url.pathname}${url.search}`,
      type: request.resourceType(),
    };
    pendingRequests.set(request, entry);
    recordRequest({ phase: "request", ...entry });
  });
  page.on("requestfinished", (request) => pendingRequests.delete(request));
  page.on("requestfailed", (request) => {
    recordRequest({
      phase: "failed",
      ...pendingRequests.get(request),
      error: request.failure()?.errorText,
    });
    pendingRequests.delete(request);
  });
  page.on("pageerror", (error) =>
    failures.push(`${name} at ${page.url()}: ${error.stack || error.message}`),
  );
  page.on("response", (response) => {
    const url = new URL(response.url());
    recordRequest({
      phase: "response",
      path: `${url.pathname}${url.search}`,
      status: response.status(),
    });
    if (new URL(response.url()).pathname.startsWith("/_next/") && response.status() >= 400)
      failures.push(`${name}: asset ${response.status()} ${new URL(response.url()).pathname}`);
  });
  try {
    await run(page, context);
    console.log(`verify: admin fixture passed: ${name}`);
  } catch (error) {
    failures.push(`${name}: ${error.stack || error.message}`);
    // The top-level local-only guards and synthetic preload apply to every
    // scenario. Capture no headers, cookies or form bodies, and bound the DOM
    // and request history so failures are useful without dumping a full page.
    try {
      const debug = {
        scenario: name,
        url: page.url(),
        pendingRequests: [...pendingRequests.values()].slice(-20),
        recentRequests,
        headings: await page.locator("h1").allTextContents(),
        mainText: (await page.locator("main").innerText({ timeout: 2000 })).slice(0, 6000),
        pagination: await page.locator('nav[aria-label$="sider"]').evaluateAll((nodes) =>
          nodes.map((node) => ({
            label: node.getAttribute("aria-label"),
            text: node.textContent?.slice(0, 500),
            links: [...node.querySelectorAll("a")].map((link) => ({
              text: link.textContent,
              href: link.getAttribute("href"),
            })),
          })),
        ),
      };
      console.error(`admin fixture diagnostic: ${JSON.stringify(debug)}`);
      if (process.env.VERIFY_ARTIFACT_DIR) {
        const directory = process.env.VERIFY_ARTIFACT_DIR;
        const tag = `failure-${name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .slice(0, 90)}`;
        await mkdir(directory, { recursive: true });
        await writeFile(join(directory, `${tag}.json`), JSON.stringify(debug, null, 2), "utf8");
        await screenshot(page, `${tag}.png`);
      }
    } catch (diagnosticError) {
      console.error(`admin fixture diagnostic unavailable: ${diagnosticError.message}`);
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
  assert.equal(response.status(), 200, path);
}
const list = (page) => page.getByRole("list", { name: "Henvendelser", exact: true });
async function screenshot(page, filename) {
  const directory = process.env.VERIFY_ARTIFACT_DIR;
  if (!directory) return;
  await mkdir(directory, { recursive: true });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: join(directory, filename.replace(/\.png$/, "-preview.png")),
    fullPage: false,
  });
  await page.screenshot({ path: join(directory, filename), fullPage: true });
}

const dayParts = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Copenhagen",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).formatToParts(new Date());
const dayPart = (type) => dayParts.find((part) => part.type === type)?.value;
const today = `${dayPart("year")}-${dayPart("month")}-${dayPart("day")}`;
const relativeDay = (offset) =>
  new Date(new Date(`${today}T12:00:00Z`).getTime() + offset * 86_400_000)
    .toISOString()
    .slice(0, 10);

async function openDetails(summary) {
  if ((await summary.locator("..").getAttribute("open")) === null) await summary.click();
}

const namedEnquiry = (page, container, number) =>
  container.getByRole("link").filter({
    has: page.getByText(`Testkunde ${String(number).padStart(2, "0")}`, { exact: true }),
  });

/** URL changes can precede the streamed RSC commit. Require the exact rendered
 * result rather than treating a transient empty/loading tree as final data. */
async function waitForCount(locator, expected, message = "the expected rendered count appears") {
  const deadline = Date.now() + 15000;
  let actual;
  do {
    actual = await locator.count();
    if (actual === expected) return;
    await new Promise((resolve) => setTimeout(resolve, 50));
  } while (Date.now() < deadline);
  assert.equal(actual, expected, message);
}

async function screenshotsAtBothSizes(page, name) {
  for (const [width, height, size] of [
    [1440, 1000, "desktop"],
    [390, 844, "mobile"],
  ]) {
    await page.setViewportSize({ width, height });
    await page.evaluate(() => document.fonts.ready);
    await assertAdminContrast(page);
    if (name === "growth-traffic" && width === 390) {
      await page.evaluate(() => scrollTo(0, 0));
      const firstSource = await page
        .getByRole("table", {
          name: "Trafikkilder med antal besøg og andel af det valgte udvalg",
          exact: true,
        })
        .getByRole("link", { name: "Google", exact: true })
        .boundingBox();
      assert.ok(
        firstSource && firstSource.y + firstSource.height <= height,
        "a real source is visible in the initial phone viewport",
      );
    }
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1),
      false,
      `${name} fits ${width}px`,
    );
    await screenshot(page, `kestro-admin-${name}-${size}.png`);
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
}

try {
  await scenario("actionable dashboard uses actual fixture counts", async (page) => {
    await visit(page, "/admin");
    const work = page.getByRole("region", { name: "Arbejdsstatus", exact: true });
    const cells = work.locator("dl > div");
    assert.match(await cells.nth(0).innerText(), /Nye beskeder\s+20/);
    assert.match(await cells.nth(1).innerText(), /Aktive beskeder\s+60/);
    assert.match(await cells.nth(2).innerText(), /Til opfølgning\s+24/);
    await screenshotsAtBothSizes(page, "dashboard");
  });

  await scenario("80-row queue, pagination, literal search and sort", async (page) => {
    await visit(page, "/admin/beskeder?status=all");
    // Let production prefetch finish, then read again: merely seeing an inbox
    // row must not mark that enquiry as read in the background.
    await page.reload({ waitUntil: "networkidle" });
    assert.equal(await list(page).locator(":scope > li").count(), 25);
    const statuses = page.getByRole("navigation", { name: "Beskedstatus", exact: true });
    assert.match(await statuses.getByRole("link", { name: /^Alle / }).innerText(), /80/);
    assert.match(await statuses.getByRole("link", { name: /^Aktive / }).innerText(), /60/);
    assert.match(await statuses.getByRole("link", { name: /^Nye / }).innerText(), /20/);
    async function rowsFillList() {
      const outer = await list(page).boundingBox();
      const row = await list(page).locator(":scope > li").first().boundingBox();
      assert.ok(
        outer && row && row.width >= outer.width - 3,
        "inbox rows fill their list instead of inheriting public prose width",
      );
    }
    await rowsFillList();
    await screenshot(page, "kestro-admin-inbox-desktop.png");
    await page.setViewportSize({ width: 390, height: 844 });
    await rowsFillList();
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1),
      false,
    );
    await screenshot(page, "kestro-admin-inbox-mobile.png");
    await page
      .getByRole("navigation", { name: "Beskedsider" })
      .getByRole("link", { name: "Næste", exact: true })
      .click();
    await page.waitForURL((url) => url.searchParams.get("page") === "2");
    assert.equal(await list(page).locator(":scope > li").count(), 25);
    await visit(page, "/admin/beskeder?status=all&page=999999");
    assert.equal(await list(page).locator(":scope > li").count(), 5);
    assert.match(
      await page.getByRole("navigation", { name: "Beskedsider" }).innerText(),
      /Side 4 af 4/,
    );
    await visit(page, "/admin/beskeder?status=all&q=%25_");
    assert.equal(
      await list(page).locator(":scope > li").count(),
      1,
      "literal %_ does not match the entire inbox",
    );
    assert.match(await list(page).innerText(), /50%_test/);
    await visit(page, "/admin/beskeder?status=all&source=quote&sort=oldest&q=Testkunde");
    assert.match(await list(page).locator(":scope > li").first().innerText(), /Testkunde 80/);
    await page
      .getByRole("navigation", { name: "Beskedsider" })
      .getByRole("link", { name: "Næste", exact: true })
      .click();
    await page.waitForURL((url) => url.searchParams.get("page") === "2");
    assert.equal(await list(page).locator(":scope > li").count(), 2);
    const query = new URL(page.url()).searchParams;
    assert.equal(query.get("q"), "Testkunde");
    assert.equal(query.get("source"), "quote");
    assert.equal(query.get("sort"), "oldest");

    await visit(page, "/admin/beskeder?status=all");
    const search = page.getByRole("search", { name: "Søg i beskeder", exact: true });
    assert.equal(
      await search.getByLabel("Søg", { exact: true }).isVisible(),
      true,
      "search remains visible without expanding filters",
    );
    assert.equal(
      await search.getByLabel("Type", { exact: true }).isVisible(),
      false,
      "secondary filters begin collapsed",
    );
    await openDetails(search.locator("summary").filter({ hasText: "Type og sortering" }));
    await search.getByLabel("Søg", { exact: true }).fill("Testkunde");
    await search.getByLabel("Type", { exact: true }).selectOption("quote");
    await search.getByLabel("Sortering", { exact: true }).selectOption("oldest");
    await search.getByRole("button", { name: "Søg og filtrér", exact: true }).click();
    await page.waitForURL(
      (url) =>
        url.searchParams.get("source") === "quote" && url.searchParams.get("sort") === "oldest",
    );
    assert.match(await list(page).locator(":scope > li").first().innerText(), /Testkunde 80/);
  });

  await scenario(
    "contact dossiers group normalized addresses without marking messages read",
    async (page) => {
      await visit(page, "/admin/kontakter");
      assert.match(await page.getByRole("main").innerText(), /49 kontakter/);
      const contacts = page.getByRole("list", { name: "Kontakter", exact: true });
      assert.equal(await contacts.locator(":scope > li").count(), 25);
      await screenshotsAtBothSizes(page, "contacts");
      await page.getByLabel("Søg efter kontakt", { exact: true }).fill("fixture1@example.invalid");
      await page.getByRole("button", { name: "Søg kontakter", exact: true }).click();
      await page.waitForURL((url) => url.searchParams.get("q") === "fixture1@example.invalid");
      await contacts.waitFor({ state: "visible" });
      await waitForCount(contacts.locator(":scope > li"), 1);
      assert.equal(
        await contacts.locator(":scope > li").count(),
        1,
        "case and surrounding whitespace do not create duplicate contacts",
      );
      const grouped = contacts.getByRole("link").first();
      assert.equal(
        await grouped.getAttribute("href"),
        `/admin/kontakter/${id(9)}`,
        "the earliest enquiry supplies an opaque, stable anchor",
      );
      await grouped.click();
      await page.waitForURL((url) => url.pathname === `/admin/kontakter/${id(9)}`);
      const messages = page.getByRole("list", { name: "Kontaktens henvendelser", exact: true });
      await waitForCount(messages.locator(":scope > li"), 3);
      assert.equal(await messages.locator(":scope > li").count(), 3);
      const rows = await messages.locator(":scope > li").allTextContents();
      for (const number of ["01", "05", "09"])
        assert.ok(rows.some((row) => row.includes(`Testkunde ${number}`)));
      assert.equal(
        await namedEnquiry(page, messages, 2).count(),
        0,
        "another email address is not merged",
      );
      const navigation = page.getByRole("navigation", { name: "Panel", exact: true });
      assert.equal(
        await navigation.locator('[aria-label="20 nye beskeder"]').count(),
        1,
        "viewing a contact profile does not mark its messages read",
      );
      await page.reload({ waitUntil: "networkidle" });
      assert.equal(await navigation.locator('[aria-label="20 nye beskeder"]').count(), 1);

      await visit(page, `/admin/kontakter/${id(70)}`);
      assert.equal(await messages.locator(":scope > li").count(), 25);
      const links = await messages
        .getByRole("link")
        .evaluateAll((elements) => elements.map((element) => element.getAttribute("href")));
      assert.ok(
        links.every(
          (href) => Number(href.split("-").at(-1)) >= 41 && Number(href.split("-").at(-1)) <= 70,
        ),
        "the dossier contains only the selected normalized email group",
      );
      const nextContactPage = page
        .getByRole("navigation", { name: "Kontaktens beskedsider" })
        .getByRole("link", { name: "Næste", exact: true });
      assert.equal(await nextContactPage.getAttribute("href"), `/admin/kontakter/${id(70)}?page=2`);
      await nextContactPage.click();
      await page.waitForURL((url) => url.searchParams.get("page") === "2");
      await waitForCount(messages.locator(":scope > li"), 5);
      assert.equal(await messages.locator(":scope > li").count(), 5);
      assert.match(await messages.innerText(), /Testkunde 70/);
      assert.equal(
        await messages.getByText("Arkiveret", { exact: true }).count(),
        1,
        "archived history remains reachable in the contact dossier",
      );
    },
  );

  await scenario(
    "follow-up scopes, saved priority and dates, clearing and activity",
    async (page) => {
      await visit(page, "/admin/opfoelgning");
      const scopes = page.getByRole("navigation", { name: "Opfølgningsperiode", exact: true });
      assert.match(await scopes.getByRole("link", { name: /^Til og med i dag/ }).innerText(), /24/);
      assert.match(await scopes.getByRole("link", { name: /^Overskredet/ }).innerText(), /12/);
      assert.match(await scopes.getByRole("link", { name: /^Planlagt/ }).innerText(), /12/);
      const tasks = page.getByRole("list", { name: "Opfølgninger", exact: true });
      assert.equal(await tasks.locator(":scope > li").count(), 24);
      assert.equal(
        await tasks.getByText("Arkiveret", { exact: true }).count(),
        0,
        "archived enquiries are excluded even when their dates are due",
      );
      assert.equal(
        await namedEnquiry(page, tasks, 12).count(),
        0,
        "an archived overdue fixture cannot enter the queue",
      );
      await screenshotsAtBothSizes(page, "followups");
      await scopes.getByRole("link", { name: /^Overskredet/ }).click();
      await page.waitForURL((url) => url.searchParams.get("scope") === "overdue");
      await waitForCount(tasks.locator(":scope > li"), 12);
      assert.equal(await tasks.locator(":scope > li").count(), 12);
      assert.equal(await namedEnquiry(page, tasks, 1).count(), 0, "today is due but not overdue");
      await visit(page, "/admin/opfoelgning?scope=all&priority=high");
      assert.equal(await tasks.locator(":scope > li").count(), 9);
      assert.equal(await tasks.getByText("Høj prioritet", { exact: true }).count(), 9);

      await visit(page, "/admin/beskeder?status=read");
      await namedEnquiry(page, list(page), 10).click();
      await page.waitForURL((url) => url.pathname === `/admin/beskeder/${id(10)}`);
      const priority = page.getByLabel("Prioritet", { exact: true });
      const date = page.getByLabel("Følg op den", { exact: true });
      await priority.selectOption("high");
      await date.fill(relativeDay(3));
      await page.getByRole("button", { name: "Gem opfølgning", exact: true }).click();
      await page.getByRole("status").filter({ hasText: "Opfølgningen er gemt." }).waitFor();
      await page.goBack({ waitUntil: "networkidle" });
      await page.waitForURL((url) => url.pathname === "/admin/beskeder");
      const updated = namedEnquiry(page, list(page), 10);
      await updated.getByText("Høj prioritet", { exact: true }).waitFor();
      assert.match(
        await updated.innerText(),
        /Høj prioritet/,
        "Back navigation reflects the saved metadata",
      );
      assert.match(await updated.innerText(), /Opfølgning/);
      await updated.click();
      assert.equal(await priority.inputValue(), "high");
      assert.equal(await date.inputValue(), relativeDay(3), "saved dates persist on reopening");
      await page.reload({ waitUntil: "networkidle" });
      assert.equal(await priority.inputValue(), "high");
      assert.equal(await date.inputValue(), relativeDay(3));
      const history = page.getByRole("region", { name: "Historik", exact: true });
      await openDetails(history.locator("summary"));
      assert.equal(
        await history.getByRole("heading", { level: 3, name: "Opfølgning", exact: true }).count(),
        1,
      );
      assert.match(await history.innerText(), /Prioritet: høj/);
      await visit(page, "/admin/opfoelgning?scope=upcoming&q=Testkunde%2010&priority=high");
      assert.equal(
        await tasks.locator(":scope > li").count(),
        1,
        "the saved date and priority participate in filtering",
      );
      await tasks.getByRole("link").first().click();
      await page.getByRole("button", { name: "Ryd dato", exact: true }).click();
      await page.getByRole("button", { name: "Gem opfølgning", exact: true }).click();
      await page.getByRole("status").filter({ hasText: "Opfølgningen er gemt." }).waitFor();
      await page.reload({ waitUntil: "networkidle" });
      assert.equal(await date.inputValue(), "", "the follow-up date can be explicitly cleared");
      await openDetails(history.locator("summary"));
      assert.equal(
        await history.getByRole("heading", { level: 3, name: "Opfølgning", exact: true }).count(),
        2,
        "both real changes append metadata events",
      );
    },
  );

  await scenario("internal notes, unread, archive and restore", async (page) => {
    await visit(page, "/admin/beskeder?status=new");
    const navigation = page.getByRole("navigation", { name: "Panel", exact: true });
    assert.equal(await navigation.locator('[aria-label="20 nye beskeder"]').count(), 1);
    await list(page).getByRole("link").filter({ hasText: "Testkunde 01" }).click();
    let badgeFailure;
    try {
      await navigation.locator('[aria-label="19 nye beskeder"]').waitFor();
    } catch (error) {
      const labels = await navigation
        .locator('[aria-label$="nye beskeder"]')
        .evaluateAll((elements) => elements.map((element) => element.getAttribute("aria-label")));
      badgeFailure = new Error(
        `Unread badge did not update after opening a message: ${labels.join(", ")}. ${error.message}`,
      );
    }
    assert.equal(await page.getByRole("heading", { name: "Testkunde 01", exact: true }).count(), 1);
    const note = page.getByLabel("Intern note", { exact: true });
    const text = "Lokal testnote <ikke html> 50%_\nNæste skridt er bevaret.";
    await note.fill(text);
    await page.getByRole("button", { name: "Gem note", exact: true }).click();
    await page.getByRole("status").filter({ hasText: "Noten er gemt." }).waitFor();
    await page.reload({ waitUntil: "networkidle" });
    assert.equal(await note.inputValue(), text, "the note persists after a reload");
    assert.equal(
      await navigation.locator('[aria-label="19 nye beskeder"]').count(),
      1,
      "opening an already-read message does not decrease the badge again",
    );
    assert.equal(await page.locator("ikke").count(), 0, "the note is escaped text");
    await screenshot(page, "kestro-admin-message-desktop.png");
    await page.setViewportSize({ width: 390, height: 844 });
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1),
      false,
    );
    await screenshot(page, "kestro-admin-message-mobile.png");
    await note.fill("");
    await page.getByRole("button", { name: "Gem note", exact: true }).click();
    await page.getByRole("status").filter({ hasText: "Noten er gemt." }).waitFor();
    await page.reload({ waitUntil: "networkidle" });
    assert.equal(await note.inputValue(), "", "a note can be explicitly cleared");
    await page.getByRole("button", { name: "Markér som ulæst", exact: true }).click();
    await page.waitForURL(
      (url) => url.pathname === "/admin/beskeder" && url.searchParams.get("result") === "unread",
    );
    const row = list(page).getByRole("link").filter({ hasText: "Testkunde 01" });
    assert.match(await row.innerText(), /\bNy\b/, "redirecting to the queue keeps it unread");
    await row.click();
    await page.getByRole("button", { name: "Arkivér besked", exact: true }).click();
    await page.waitForURL(
      (url) => url.pathname === "/admin/beskeder" && url.searchParams.get("result") === "archived",
    );
    await visit(page, `/admin/beskeder/${id(1)}`);
    await page.getByRole("button", { name: "Flyt til aktive", exact: true }).click();
    await page.waitForURL((url) => url.searchParams.get("result") === "restored");
    const archive = page.getByRole("button", { name: "Arkivér besked", exact: true });
    await archive.waitFor({ state: "visible" });
    assert.equal(await archive.count(), 1);
    await page.reload({ waitUntil: "networkidle" });
    await archive.waitFor({ state: "visible" });
    assert.equal(await archive.count(), 1, "the restored state persists after a reload");
    if (badgeFailure) throw badgeFailure;
  });

  await scenario("Back navigation does not restore a stale unread queue", async (page) => {
    await visit(page, "/admin/beskeder?status=new");
    const row = namedEnquiry(page, list(page), 13);
    await row.waitFor({ state: "visible" });
    assert.equal(await row.count(), 1);
    await row.click();
    await page.getByRole("heading", { name: "Testkunde 13", exact: true }).waitFor();
    await page.goBack({ waitUntil: "networkidle" });
    await page.waitForURL(
      (url) => url.pathname === "/admin/beskeder" && url.searchParams.get("status") === "new",
    );
    await list(page).waitFor({ state: "visible" });
    await waitForCount(row, 0, "a read message leaves the rendered new-only queue after Back");
    assert.equal(
      await row.count(),
      0,
      "a message that was read is absent after returning to the new-only list",
    );
    await page.goForward({ waitUntil: "networkidle" });
    await page.getByRole("heading", { name: "Testkunde 13", exact: true }).waitFor();
    await page.reload({ waitUntil: "networkidle" });
    assert.equal(
      await page.getByRole("button", { name: "Markér som ulæst", exact: true }).count(),
      1,
    );
  });

  await scenario("reply survives provider failure and clears after mock success", async (page) => {
    // A transient archive failure must not masquerade as a missing enquiry or
    // send a mail whose conversation could not be read. The next mock send is
    // still the provider-failure case below, so this cannot consume a send.
    const unavailable = await page.request.post(base + "/api/admin/reply", {
      headers: {
        cookie,
        "content-type": "application/x-www-form-urlencoded",
        "sec-fetch-site": "same-origin",
      },
      data: new URLSearchParams({
        id: id(80),
        body: "Synthetic reply for an unavailable lookup",
      }).toString(),
    });
    assert.equal(
      unavailable.status(),
      503,
      "a failed enquiry lookup returns unavailable before sending",
    );
    await visit(page, `/admin/beskeder/${id(2)}`);
    const reply = page.getByLabel("Svar til Testkunde 02", { exact: true });
    await page.getByRole("button", { name: "Bekræft modtagelse", exact: true }).click();
    assert.match(await reply.inputValue(), /^Hej Testkunde,/);
    assert.equal(
      await page.getByRole("button", { name: "Bekræft modtagelse", exact: true }).isDisabled(),
      true,
      "templates cannot overwrite a draft",
    );
    const draft = "Hej,\nDette svar sendes kun til den lokale mailfixture.";
    await reply.fill(draft);
    await page.getByRole("button", { name: "Send svar", exact: true }).click();
    await page.waitForURL((url) => url.searchParams.get("fejl") === "send");
    assert.equal(await reply.inputValue(), draft, "a provider failure preserves the draft");
    assert.match(await page.getByRole("alert").first().innerText(), /Svaret blev ikke sendt/);
    assert.equal(
      await page.getByRole("heading", { name: "Seneste sendte svar", exact: true }).count(),
      0,
      "a failed mail is not recorded as sent",
    );
    await page.getByRole("button", { name: "Send svar", exact: true }).click();
    await page.waitForURL((url) => url.searchParams.get("sendt") === "1");
    assert.equal(await reply.inputValue(), "", "only confirmed success clears the composer");
    const sent = page
      .getByRole("heading", { name: "Seneste sendte svar", exact: true })
      .locator("..");
    assert.match(await sent.innerText(), /Dette svar sendes kun til den lokale mailfixture/);
    await page.reload({ waitUntil: "networkidle" });
    assert.match(
      await sent.innerText(),
      /Dette svar sendes kun til den lokale mailfixture/,
      "the successful reply is recorded",
    );
    const uncertain = "Et andet syntetisk svar med ukendt leveringsstatus.";
    await reply.fill(uncertain);
    await page.getByRole("button", { name: "Send svar", exact: true }).click();
    await page.waitForURL((url) => url.searchParams.get("fejl") === "ukendt");
    assert.equal(
      await reply.inputValue(),
      uncertain,
      "an uncertain provider outcome preserves the draft",
    );
    await page
      .getByRole("alert")
      .filter({ hasText: /Afsendelsen kunne ikke bekræftes/ })
      .first()
      .waitFor();
    assert.match(
      await sent.innerText(),
      /Dette svar sendes kun til den lokale mailfixture/,
      "an uncertain delivery does not replace the last confirmed reply",
    );
  });

  await scenario("live refresh, pause, unavailable data and expired session", async (page) => {
    let mode = "ready";
    let requests = 0;
    await page.route("**/api/admin/live", (route) => {
      requests++;
      return mode === "expired"
        ? route.fulfill({ status: 403, body: "forbidden" })
        : route.fulfill({
            json: {
              available: mode === "ready",
              online: 2,
              reading: [],
              visitsToday: 2,
              visits30: 2,
              avgSeconds: 0,
              avgBasis: 0,
              bouncePct: 100,
              sources: [],
              countries: [],
              devices: [],
            },
          });
    });
    await visit(page, "/admin/trafik");
    await openDetails(
      page
        .locator("details")
        .filter({ has: page.locator("summary", { hasText: "På sitet lige nu" }) })
        .locator(":scope > summary"),
    );
    const live = page.getByRole("region", { name: "Besøgende på sitet", exact: true });
    await page.waitForFunction(() =>
      document
        .querySelector('section[aria-label="Besøgende på sitet"] [role="status"]')
        ?.textContent?.trim()
        .startsWith("2"),
    );
    await live.getByRole("button", { name: "Pause live", exact: true }).click();
    assert.equal(await live.getByRole("button", { name: "Genoptag live", exact: true }).count(), 1);
    const previous = requests;
    mode = "unavailable";
    await live.getByRole("button", { name: "Opdater besøgstal", exact: true }).click();
    await live.getByText(/Besøgstal er midlertidigt utilgængelige/).waitFor();
    assert.ok(requests > previous, "manual refresh also works while automatic updates are paused");
    assert.match(
      await live.getByRole("status").first().innerText(),
      /^2/,
      "last confirmed data is retained after a failed update",
    );
    mode = "expired";
    await live.getByRole("button", { name: "Opdater besøgstal", exact: true }).click();
    await live.getByRole("button", { name: "Log ind igen", exact: true }).waitFor();
    assert.equal(
      await live.getByRole("button", { name: "Opdater besøgstal", exact: true }).isDisabled(),
      true,
    );
    assert.equal(
      await live.getByRole("button", { name: "Genoptag live", exact: true }).isDisabled(),
      true,
    );
  });

  await scenario(
    "bulk selection is bounded to this page, preserves filters and can be recovered",
    async (page) => {
      let replyRequests = 0;
      page.on("request", (request) => {
        if (new URL(request.url()).pathname === "/api/admin/reply") replyRequests++;
      });
      await visit(page, "/admin/beskeder?status=all&source=quote&sort=oldest&q=Testkunde");
      const bulk = page.getByRole("form", { name: "Håndtér valgte beskeder", exact: true });
      const before = await list(page)
        .getByRole("link")
        .evaluateAll((elements) =>
          elements.map((element) => element.getAttribute("href").split("/").at(-1)),
        );
      assert.equal(before.length, 25);
      await openDetails(bulk.locator("summary"));
      await bulk.getByRole("button", { name: "Vælg / ryd denne side", exact: true }).click();
      assert.equal(await bulk.getByRole("checkbox", { checked: true }).count(), 25);
      assert.match(await bulk.locator("summary").innerText(), /25 valgt/);
      await bulk.getByLabel("Handling", { exact: true }).selectOption("archived");
      const posted = page.waitForRequest(
        (request) =>
          new URL(request.url()).pathname === "/api/admin/bulk-status" &&
          request.method() === "POST",
      );
      await bulk.getByRole("button", { name: "Anvend på valgte", exact: true }).click();
      const payload = new URLSearchParams((await posted).postData());
      assert.equal(payload.getAll("ids").length, 25);
      assert.deepEqual(
        [...payload.getAll("ids")].sort(),
        [...before].sort(),
        "no off-page or hidden record is submitted",
      );
      await page.waitForURL(
        (url) =>
          url.searchParams.get("result") === "bulk" && url.searchParams.get("changed") === "18",
      );
      let query = new URL(page.url()).searchParams;
      assert.equal(query.get("q"), "Testkunde");
      assert.equal(query.get("source"), "quote");
      assert.equal(query.get("sort"), "oldest");
      assert.equal(query.get("status"), "all");
      await waitForCount(list(page).getByText("Arkiveret", { exact: true }), 25);
      assert.equal(
        await list(page).getByText("Arkiveret", { exact: true }).count(),
        25,
        "selected records are archived while already archived records are not counted as changed",
      );
      assert.match(
        await page.getByRole("status").filter({ hasText: "beskeder er opdateret" }).innerText(),
        /18/,
      );

      await openDetails(bulk.locator("summary"));
      await bulk.getByRole("button", { name: "Vælg / ryd denne side", exact: true }).click();
      await bulk.getByLabel("Handling", { exact: true }).selectOption("read");
      await bulk.getByRole("button", { name: "Anvend på valgte", exact: true }).click();
      await page.waitForURL(
        (url) =>
          url.searchParams.get("result") === "bulk" && url.searchParams.get("changed") === "25",
      );
      await waitForCount(list(page).getByText("Læst", { exact: true }), 25);
      assert.equal(
        await list(page).getByText("Læst", { exact: true }).count(),
        25,
        "archived selected records can be restored to active/read state",
      );
      await page
        .getByRole("navigation", { name: "Beskedsider", exact: true })
        .getByRole("link", { name: "Næste", exact: true })
        .click();
      await page.waitForURL((url) => url.searchParams.get("page") === "2");
      await waitForCount(list(page).locator(":scope > li"), 2);
      assert.equal(await list(page).locator(":scope > li").count(), 2);
      assert.match(
        await namedEnquiry(page, list(page), 5).innerText(),
        /\bNy\b/,
        "an unselected record on another page remains unread",
      );
      assert.match(
        await namedEnquiry(page, list(page), 2).innerText(),
        /Besvaret/,
        "an unselected confirmed reply keeps its status",
      );
      query = new URL(page.url()).searchParams;
      assert.equal(query.get("source"), "quote");
      assert.equal(query.get("sort"), "oldest");
      assert.equal(replyRequests, 0, "bulk metadata actions never invoke the reply flow");
    },
  );

  await scenario(
    "growth sources, filters and export use the same measured visit denominator",
    async (page) => {
      await visit(page, "/admin/trafik?days=30");
      const sources = page.getByRole("table", {
        name: "Trafikkilder med antal besøg og andel af det valgte udvalg",
        exact: true,
      });
      const total = page.locator("main dl").first().locator(":scope > div").first().locator("dd");
      assert.equal((await total.innerText()).trim(), "240");
      const sourceRow = (name) =>
        sources.getByRole("row").filter({ has: page.getByRole("link", { name, exact: true }) });
      assert.equal((await sourceRow("Google").getByRole("cell").nth(1).innerText()).trim(), "96");
      assert.equal((await sourceRow("Google").getByRole("cell").nth(2).innerText()).trim(), "40 %");
      assert.equal(
        (await sourceRow("Instagram").getByRole("cell").nth(1).innerText()).trim(),
        "48",
      );
      assert.equal(
        (await sourceRow("Instagram").getByRole("cell").nth(2).innerText()).trim(),
        "20 %",
      );
      assert.match(await page.locator("main").innerText(), /Instagram alene beviser ikke Explore/);
      await screenshotsAtBothSizes(page, "growth-traffic");

      await sourceRow("Google").getByRole("link", { name: "Google", exact: true }).click();
      await page.waitForURL((url) => url.searchParams.get("source") === "Google");
      await waitForCount(sources.locator("tbody > tr"), 1);
      assert.equal((await total.innerText()).trim(), "96");
      assert.match(await page.locator("main").innerText(), /96 af 240 registrerede besøg/);
      assert.equal(
        (await sourceRow("Google").getByRole("cell").nth(2).innerText()).trim(),
        "100 %",
      );
      assert.equal(
        await page.getByLabel("Kilde", { exact: true }).inputValue(),
        "Google",
        "drill-down also updates the visible source filter",
      );
      const filteredExport = await page
        .getByRole("link", { name: "Eksportér CSV", exact: true })
        .getAttribute("href");
      assert.equal(new URL(filteredExport, base).searchParams.get("source"), "Google");
      const exported = await page.request.get(base + filteredExport, { headers: { cookie } });
      assert.equal(exported.status(), 200);
      assert.match(exported.headers()["content-type"], /^text\/csv/);
      assert.match(
        await exported.text(),
        /"Besøg i det valgte udsnit","96","Besøg i hele perioden","240"/,
      );
      await page.getByRole("link", { name: "Nulstil filtre", exact: true }).click();
      await page.waitForURL((url) => !url.searchParams.has("source"));
      await waitForCount(sources.locator("tbody > tr"), 4);
      assert.equal((await total.innerText()).trim(), "240");

      const form = page.locator('form[action="/admin/trafik"]');
      await openDetails(form.locator("summary"));
      assert.equal(
        await form.getByLabel("Kilde", { exact: true }).inputValue(),
        "",
        "reset clears the visible selector too",
      );
      await form.getByLabel("Kanal", { exact: true }).selectOption("social");
      await form.getByLabel("Kampagne", { exact: true }).selectOption("fixture-guide");
      await form.getByRole("button", { name: "Vis periode", exact: true }).click();
      await page.waitForURL(
        (url) =>
          url.searchParams.get("channel") === "social" &&
          url.searchParams.get("campaign") === "fixture-guide",
      );
      await waitForCount(sources.locator("tbody > tr"), 1);
      assert.equal((await total.innerText()).trim(), "48");
      assert.equal(
        (await sourceRow("Instagram").getByRole("cell").nth(2).innerText()).trim(),
        "100 %",
      );
      assert.match(await page.locator("main").innerText(), /48 af 240 registrerede besøg/);
      assert.match(
        await page
          .getByRole("table", { name: "Registrerede kampagner og placeringer", exact: true })
          .innerText(),
        /fixture-guide/,
      );
    },
  );

  await scenario(
    "campaign presets create real links and clipboard denial keeps a selectable copy",
    async (page, context) => {
      await context.addInitScript(() => {
        Object.defineProperty(navigator, "clipboard", {
          configurable: true,
          value: {
            writeText: async () => {
              throw new DOMException("fixture denied", "NotAllowedError");
            },
          },
        });
      });
      await visit(page, "/admin/kampagner");
      await page.getByLabel("Kampagnenavn", { exact: true }).fill("fixture-guide");
      await page.getByRole("button", { name: "Instagram · story", exact: true }).click();
      const output = page.getByLabel("Færdigt kampagnelink", { exact: true });
      const link = new URL(await output.inputValue());
      assert.equal(link.origin, "https://www.kestro.dk");
      assert.equal(link.searchParams.get("utm_source"), "instagram");
      assert.equal(link.searchParams.get("utm_medium"), "social");
      assert.equal(link.searchParams.get("utm_campaign"), "fixture-guide");
      assert.equal(link.searchParams.get("utm_content"), "story");
      await page.getByRole("button", { name: "Kopiér link", exact: true }).click();
      await page
        .getByRole("status")
        .filter({ hasText: "Automatisk kopiering er blokeret" })
        .waitFor();
      assert.equal(
        await output.inputValue(),
        link.href,
        "denied clipboard access never discards the generated URL",
      );
      assert.equal(
        await output.evaluate(
          (node) =>
            document.activeElement === node &&
            node.selectionEnd - node.selectionStart === node.value.length,
        ),
        true,
        "the full manual copy is selected",
      );
      await screenshotsAtBothSizes(page, "growth-campaigns");
      await page.getByLabel("Destinationsside", { exact: true }).fill("https://example.com/steal");
      assert.equal(await output.inputValue(), "");
      assert.equal(
        await page.getByRole("button", { name: "Kopiér link", exact: true }).isDisabled(),
        true,
      );
      assert.match(await page.locator("#campaign-validation").innerText(), /Linket skal gå til/);
      await page.getByLabel("Destinationsside", { exact: true }).fill("/admin");
      assert.equal(await output.inputValue(), "");
      assert.match(
        await page.locator("#campaign-validation").innerText(),
        /Admin, filer og ukendte adresser/,
      );
      await page
        .getByLabel("Destinationsside", { exact: true })
        .fill("https://www.kestro.dk/vejledninger?old=remove");
      await page.getByRole("button", { name: "Nyhedsbrev", exact: true }).click();
      const newsletter = new URL(await output.inputValue());
      assert.equal(newsletter.searchParams.get("old"), null);
      assert.equal(newsletter.searchParams.get("utm_source"), "newsletter");
      assert.equal(newsletter.searchParams.get("utm_medium"), "email");
      assert.equal(
        newsletter.searchParams.get("utm_content"),
        null,
        "changing placement clears stale story tagging",
      );
      assert.match(
        await page.locator("main").innerText(),
        /beviser ikke, at besøget kom fra Instagram Explore/,
      );
    },
  );

  await scenario(
    "Search Console validates before saving and supports query paging, backup and safe reimport",
    async (page) => {
      const synthetic = {
        schemaVersion: 1,
        property: "sc-domain:kestro.dk",
        dateFrom: relativeDay(-30),
        dateTo: relativeDay(-3),
        timezone: "America/Los_Angeles",
        searchType: "web",
        generatedAt: new Date().toISOString(),
        source: "google_search_console",
        partial: true,
        totals: { clicks: 200, impressions: 4000, position: 7.3 },
        daily: [
          { date: relativeDay(-5), clicks: 120, impressions: 2400, position: 7.3 },
          { date: relativeDay(-4), clicks: 80, impressions: 1600, position: 7.3 },
        ],
        queries: Array.from({ length: 45 }, (_, index) => ({
          query: `fixture query ${String(index + 1).padStart(2, "0")}`,
          clicks: index % 3,
          impressions: 20 + index,
          position: 5 + index / 10,
        })),
        pages: [
          {
            page: "https://www.kestro.dk/vejledninger",
            clicks: 130,
            impressions: 2500,
            position: 6.5,
          },
          {
            page: "https://www.kestro.dk/reparation",
            clicks: 70,
            impressions: 1500,
            position: 8.5,
          },
        ],
      };
      let importPosts = 0;
      page.on("request", (request) => {
        if (
          new URL(request.url()).pathname === "/api/admin/search-console-import" &&
          request.method() === "POST"
        )
          importPosts++;
      });
      async function savePreview() {
        const persisted = page.waitForResponse(
          (response) =>
            new URL(response.url()).pathname === "/api/admin/search-console-import" &&
            response.request().method() === "POST",
        );
        await page.getByRole("button", { name: "Gem denne rapport", exact: true }).click();
        const response = await persisted;
        assert.equal(
          response.status(),
          200,
          "the validated report is accepted by the independently gated endpoint",
        );
        assert.deepEqual(await response.json(), { saved: true });
      }
      await visit(page, "/admin/seo");
      await page.getByRole("heading", { name: "Google & SEO", exact: true }).waitFor();
      const importDetails = page.locator("#search-console-import");
      await openDetails(importDetails.locator("summary"));
      await page.getByRole("button", { name: "Indsæt rapport", exact: true }).click();
      const input = page.getByLabel("Indsæt JSON- eller CSV-rapport · højst 2 MB", { exact: true });
      await input.fill('{"invalid":');
      await page.getByRole("button", { name: "Forhåndsvis fil", exact: true }).click();
      await page.getByRole("alert").filter({ hasText: "JSON-filen kan ikke læses" }).waitFor();
      assert.equal(importPosts, 0, "invalid local input is not submitted");
      assert.equal(
        await page.getByRole("button", { name: "Gem denne rapport", exact: true }).count(),
        0,
      );
      await input.fill(JSON.stringify(synthetic));
      await page.getByRole("button", { name: "Forhåndsvis fil", exact: true }).click();
      await page.getByRole("heading", { name: "Valideret forhåndsvisning", exact: true }).waitFor();
      assert.equal(importPosts, 0, "preview itself writes no data");
      await savePreview();
      await page.getByRole("table", { name: /^Søgefraser ·/ }).waitFor();
      const table = page.getByRole("table", { name: /^Søgefraser ·/ });
      await waitForCount(table.locator("tbody > tr"), 20);
      const totals = page.getByRole("region", {
        name: "Rapportens samlede søgesynlighed",
        exact: true,
      });
      assert.equal(
        (await totals.locator("dl > div").first().locator("dd").innerText()).trim(),
        "200",
      );
      assert.match(
        await page.locator("main").innerText(),
        /De kan ikke knyttes til en bestemt besøgende/,
      );
      await screenshotsAtBothSizes(page, "growth-seo");
      const pages = page.getByRole("navigation", { name: "Søgerapportens sider", exact: true });
      await pages.getByRole("link", { name: "Næste →", exact: true }).click();
      await page.waitForURL((url) => url.searchParams.get("page") === "2");
      await pages.getByText("Side 2 af 3", { exact: false }).waitFor();
      await waitForCount(table.locator("tbody > tr"), 20);
      await page.getByLabel("Find i rapporten", { exact: true }).fill("fixture query 01");
      await page.getByRole("button", { name: "Vis rapport", exact: true }).click();
      await page.waitForURL((url) => url.searchParams.get("q") === "fixture query 01");
      await waitForCount(table.locator("tbody > tr"), 1);
      assert.match(await table.innerText(), /fixture query 01/);
      assert.equal(
        (await totals.locator("dl > div").first().locator("dd").innerText()).trim(),
        "200",
        "table filtering does not change property totals",
      );
      await page.getByRole("link", { name: "Nulstil", exact: true }).click();
      await page.waitForURL((url) => !url.searchParams.has("q"));
      await waitForCount(table.locator("tbody > tr"), 20);
      await openDetails(totals.locator("details > summary"));
      const backupPath = await page
        .getByRole("link", { name: "Hent rapport ↓", exact: true })
        .getAttribute("href");
      const backupResponse = await page.request.get(base + backupPath, { headers: { cookie } });
      assert.equal(backupResponse.status(), 200);
      assert.match(backupResponse.headers()["content-disposition"], /attachment/);
      const backup = await backupResponse.json();
      assert.deepEqual(
        backup,
        synthetic,
        "the downloadable backup contains the validated report, not a summed derivative",
      );

      await openDetails(importDetails.locator("summary"));
      await page.getByRole("button", { name: "Indsæt rapport", exact: true }).click();
      await input.fill(JSON.stringify(backup));
      await page.getByRole("button", { name: "Forhåndsvis fil", exact: true }).click();
      await savePreview();
      await page.reload({ waitUntil: "networkidle" });
      assert.equal(
        (await totals.locator("dl > div").first().locator("dd").innerText()).trim(),
        "200",
        "reimport replaces the same report rather than doubling totals",
      );

      await openDetails(importDetails.locator("summary"));
      await page.getByRole("button", { name: "Indsæt rapport", exact: true }).click();
      await input.fill(
        'Top queries,Clicks,Impressions,CTR,Position\n"fixture csv query",3,90,3.33%,6.5',
      );
      await page.getByRole("button", { name: "Forhåndsvis fil", exact: true }).click();
      await savePreview();
      await table.getByText("fixture csv query", { exact: true }).waitFor();
      assert.equal(
        (await totals.locator("dl > div").first().locator("dd").innerText()).trim(),
        "—",
        "a query-only CSV does not manufacture a whole-property total",
      );
      assert.match(await totals.innerText(), /Ingen samlet ejendomsmåling/);
    },
  );
} finally {
  await browser.close();
}
for (const failure of failures) console.error(`admin fixture: ${failure}`);
if (failures.length) process.exitCode = 1;
else
  console.log("verify: all admin fixture interactions passed (synthetic data, no mail delivered)");
