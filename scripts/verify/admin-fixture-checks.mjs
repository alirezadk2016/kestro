import assert from "node:assert/strict";
import crypto from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

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
    if (new URL(request.url()).origin !== origin.origin) return route.abort();
    if (request.isNavigationRequest() && request.method() === "GET") {
      // This server is deliberately loopback HTTP. Chromium otherwise upgrades
      // a fetch's relative 303 redirect to HTTPS on the same non-TLS port.
      // Adjust transport only in the fixture browser; production headers and
      // every auth/CSRF gate are still checked unchanged by attack.mjs.
      const response = await route.fetch({ maxRedirects: 0, headers: await request.allHeaders() });
      const headers = response.headers();
      if (headers["content-security-policy"])
        headers["content-security-policy"] = headers["content-security-policy"].replace(
          /(^|;)\s*upgrade-insecure-requests\s*(?=;|$)/g,
          "$1",
        );
      return route.fulfill({ response, headers });
    }
    return route.continue();
  });
  const page = await context.newPage();
  page.on("pageerror", (error) =>
    failures.push(`${name} at ${page.url()}: ${error.stack || error.message}`),
  );
  page.on("response", (response) => {
    if (new URL(response.url()).pathname.startsWith("/_next/") && response.status() >= 400)
      failures.push(`${name}: asset ${response.status()} ${new URL(response.url()).pathname}`);
  });
  try {
    await run(page, context);
    console.log(`verify: admin fixture passed: ${name}`);
  } catch (error) {
    failures.push(`${name}: ${error.stack || error.message}`);
  } finally {
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

try {
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
  });

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
} finally {
  await browser.close();
}
for (const failure of failures) console.error(`admin fixture: ${failure}`);
if (failures.length) process.exitCode = 1;
else
  console.log("verify: all admin fixture interactions passed (synthetic data, no mail delivered)");
