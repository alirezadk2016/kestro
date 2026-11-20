import assert from "node:assert/strict";

/** Real browser regressions against a local build. Every contact POST is
 * intercepted, other writes are blocked, and no external origin is reachable. */
export async function verifySiteForms(browser, base, fail) {
  console.log("verify: public contact forms, quote limits and responsive article contents");
  const origin = new URL(base);
  assert.ok(
    ["localhost", "127.0.0.1", "[::1]"].includes(origin.hostname),
    "public form regressions may run only against a loopback server",
  );
  // Keep local image optimization requests alive across scenario teardown.
  const images = await browser.newContext();

  async function scenario(name, run) {
    console.log(`verify: site forms ${name}`);
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      reducedMotion: "reduce",
      locale: "da-DK",
    });
    context.setDefaultTimeout(15000);
    context.setDefaultNavigationTimeout(30000);
    const submissions = [];
    const routingErrors = [];
    let reply = { status: 200, body: { ok: true } };
    let contextClosing = false;
    // Consent itself has separate integration coverage. Keep this suite focused
    // on forms and prevent analytics from obscuring a control or making a call.
    await context.addInitScript(() => {
      localStorage.setItem("kestro-consent", "denied");
      localStorage.setItem("kestro-lang-hint", "1");
    });
    await context.route("**/*", async (route) => {
      const request = route.request();
      try {
        const url = new URL(request.url());
        if (url.origin !== origin.origin) return await route.abort();
        if (request.method() === "POST" && url.pathname === "/api/kontakt") {
          submissions.push(request.postDataJSON());
          return await route.fulfill({
            status: reply.status,
            contentType: "application/json",
            body: JSON.stringify(reply.body),
          });
        }
        if (!["GET", "HEAD"].includes(request.method())) {
          // The site's own visit tracker is harmless to the UI, but this test
          // writes no local traffic rows or enquiries either.
          if (url.pathname === "/api/track") return await route.fulfill({ status: 204 });
          routingErrors.push(`Unexpected write blocked: ${request.method()} ${url.pathname}`);
          return await route.abort();
        }
        if (request.method() === "GET" && url.pathname === "/_next/image") {
          const response = await images.request.get(request.url(), {
            maxRedirects: 0,
            headers: await request.allHeaders(),
          });
          return await route.fulfill({ response });
        }
        if (
          request.method() === "GET" &&
          (request.isNavigationRequest() || request.headers().rsc === "1")
        ) {
          // Preserve the actual local response, buffering Flight streams just
          // like the admin harness. HTTP loopback has no production TLS target.
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
        if (contextClosing || request.failure()?.errorText === "net::ERR_ABORTED") return;
        routingErrors.push(`${request.method()} ${request.url()}: ${error.message}`);
        await route.abort().catch(() => {});
      }
    });
    try {
      await run(context, submissions, (next) => {
        reply = next;
      });
      assert.deepEqual(routingErrors, [], "local routing completed without unexpected writes");
      console.log(`verify: site forms passed: ${name}`);
    } catch (error) {
      fail(`site forms ${name}`, error.stack ?? error.message);
    } finally {
      contextClosing = true;
      await context.close();
    }
  }

  async function visit(context, path, form = true) {
    const page = await context.newPage();
    page.on("pageerror", (error) => fail(`site forms ${path}`, error.message));
    const response = await page.goto(base + path, { waitUntil: "domcontentloaded" });
    assert.equal(response?.status(), 200, `${path} responds successfully`);
    if (form) {
      await page.waitForFunction(() => {
        const fields = document.querySelector("form[action='/api/kontakt'] > fieldset");
        return fields && !fields.disabled;
      });
    }
    return page;
  }

  async function identity(page, company = "") {
    await page.locator("#navn").fill("Synthetic form visitor");
    await page.locator("#virksomhed").fill(company);
    await page.locator("#email").fill("synthetic@example.invalid");
  }

  const submit = (page) => page.locator("form[action='/api/kontakt'] button[type='submit']");
  const completed = (page) => page.locator("[aria-labelledby='kontakt-udfald']");

  try {
    for (const path of ["/kontakt", "/en/contact"]) {
      await scenario(`${path} permits private contact without a company`, async (context, sent) => {
        const page = await visit(context, path);
        assert.equal(await page.locator("#virksomhed").getAttribute("required"), null);
        for (const [id, limit] of [
          ["navn", 120],
          ["virksomhed", 160],
          ["email", 200],
          ["telefon", 60],
          ["besked", 5000],
        ]) {
          assert.equal(
            await page.locator(`#${id}`).getAttribute("maxlength"),
            String(limit),
            `${id} has the shared limit`,
          );
        }
        await identity(page);
        const draft = "Synthetic private repair enquiry. Intercepted locally; never delivered.";
        await page.locator("#besked").fill(draft);
        await submit(page).click();
        await completed(page).waitFor({ state: "visible" });
        assert.equal(sent.length, 1, "one intercepted enquiry was submitted");
        assert.equal(sent[0].company, "", "no invented company is required");
        assert.equal(sent[0].kind, "contact");
        assert.equal(sent[0].message, draft, "the full enquiry reached the request");
        assert.equal(
          new URL(page.url()).pathname,
          path,
          "submitting keeps personal details out of a URL",
        );
      });
    }

    await scenario(
      "English quotes preserve their kind and the full composed budget",
      async (context, sent) => {
        const page = await visit(
          context,
          "/en/get-a-quote?model=Synthetic%20model&hvornaar=Synthetic%20date",
        );
        await identity(page, "Synthetic company");
        await page.waitForFunction(
          () => document.querySelector("#hvornaar")?.value === "Synthetic date",
        );
        assert.equal(await page.locator("#virksomhed").getAttribute("required"), "");
        const details = page.locator("form[action='/api/kontakt'] details");
        const summary = details.locator("summary");
        assert.equal(await details.getAttribute("open"), "", "prefilled quote details start open");
        await summary.click();
        assert.equal(await details.getAttribute("open"), null, "filled details can be collapsed");
        await summary.click();
        await page.locator("#ram").selectOption("16 GB");
        await page.locator("#disk").selectOption("512 GB SSD");
        await page.locator("#tastatur").selectOption("Engelsk (UK/US)");
        assert.equal(await page.locator("#udstyr").getAttribute("maxlength"), "120");
        assert.equal(await page.locator("#hvornaar").getAttribute("maxlength"), "120");
        const budget = Number(await page.locator("#besked").getAttribute("maxlength"));
        assert.ok(budget > 0 && budget < 5000, "quote prose leaves room for specification lines");
        const draft = "x".repeat(budget - 3) + "END";
        await page.locator("#besked").fill(draft);
        assert.equal(await page.locator("#besked").inputValue(), draft);
        assert.match(
          await page.locator("#contact-message-count").innerText(),
          /5,000\s*\/\s*5,000/,
        );
        await submit(page).click();
        await completed(page).waitFor({ state: "visible" });
        assert.equal(sent.length, 1);
        assert.equal(sent[0].kind, "quote", "English quotes explicitly identify their form kind");
        assert.equal(sent[0].subject, "Quote request");
        assert.equal(sent[0].page, "/en/get-a-quote");
        assert.equal(
          sent[0].message.length,
          5000,
          "specifications and prose share one complete budget",
        );
        assert.ok(sent[0].message.includes("Synthetic model"));
        assert.ok(sent[0].message.includes("16 GB"));
        assert.ok(sent[0].message.endsWith(draft), "the ending is never silently shortened");
      },
    );

    await scenario(
      "server validation keeps the draft editable and announces the field",
      async (context, sent, setReply) => {
        setReply({ status: 422, body: { ok: false, error: "invalid", fields: ["email"] } });
        const page = await visit(context, "/en/contact");
        await identity(page);
        await page.locator("#telefon").fill("+45 12345678");
        const draft = "Synthetic draft retained after server validation. Do not deliver.";
        await page.locator("#besked").fill(draft);
        await submit(page).click();
        const error = page.locator("#contact-validation[role='alert']");
        await error.waitFor({ state: "visible" });
        assert.match(await error.innerText(), /valid email address/i);
        assert.equal(sent.length, 1);
        assert.equal(
          await completed(page).count(),
          0,
          "validation does not replace the form with an outage panel",
        );
        assert.equal(await page.locator("#navn").inputValue(), "Synthetic form visitor");
        assert.equal(await page.locator("#telefon").inputValue(), "+45 12345678");
        assert.equal(await page.locator("#besked").inputValue(), draft);
        assert.equal(await page.locator("#email").getAttribute("aria-invalid"), "true");
        await page.waitForFunction(() => document.activeElement?.id === "email");
        assert.equal(await submit(page).isEnabled(), true, "the form is available for correction");
        setReply({ status: 200, body: { ok: true } });
        await page.locator("#email").fill("corrected@example.invalid");
        await submit(page).click();
        await completed(page).waitFor({ state: "visible" });
        assert.equal(sent.length, 2);
        assert.equal(sent[1].email, "corrected@example.invalid");
        assert.equal(sent[1].message, draft, "correcting a field preserves the original message");
      },
    );

    await scenario("a closed mobile article contents list reopens on desktop", async (context) => {
      const page = await visit(context, "/vejledninger/tjek-brugt-baerbar-foer-koeb", false);
      const toc = page.getByRole("navigation", { name: "På denne side", exact: true });
      const details = toc.locator("details");
      const summary = details.locator("summary");
      assert.equal(await summary.isVisible(), true, "mobile contents have a visible control");
      await summary.click();
      assert.equal(await details.getAttribute("open"), null, "mobile contents close natively");
      await page.setViewportSize({ width: 1440, height: 900 });
      assert.equal(
        await summary.isVisible(),
        true,
        "resizing keeps a visible way to reopen the list",
      );
      await summary.click();
      assert.equal(await details.getAttribute("open"), "");
      const first = toc.locator("a[href^='#']").first();
      assert.equal(await first.isVisible(), true, "contents links return after reopening");
      const target = await first.getAttribute("href");
      assert.ok(
        await page.evaluate((href) => !!document.getElementById(href.slice(1)), target),
        "the contents link targets a real section",
      );
    });
  } finally {
    await images.close();
  }
}
