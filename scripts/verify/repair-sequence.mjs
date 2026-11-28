import assert from "node:assert/strict";

/*
 * The repair hub without its picture sequence (28 November 2026).
 *
 * /reparation carried a four-step sequence of a RAM swap in AI-generated
 * pictures, with its own controls and a disclosure. The pictures went, on the
 * owner's rule that a laptop on this site is a real one, and with them the
 * sequence. This keeps them gone and keeps the route light: no sequence, no
 * picture from the old set, no canvas renderer.
 */
export async function verifyRepairSequence(browser, base, fail) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  try {
    for (const path of ["/reparation", "/en/repairs"]) {
      const response = await page.goto(base + path, { waitUntil: "networkidle" });
      assert.equal(response?.status(), 200, `${path} responds`);
      assert.equal(await page.locator("main h1").count(), 1, `${path} has its heading`);
      assert.equal(await page.locator("[data-repair-sequence]").count(), 0, `${path} sequence`);
      assert.equal(await page.locator("main canvas").count(), 0, `${path} has no renderer`);
      const old = await page
        .locator("main img")
        .evaluateAll(
          (images) =>
            images.filter((img) =>
              decodeURIComponent(img.currentSrc || img.src).includes("/images/repairs/"),
            ).length,
        );
      assert.equal(old, 0, `${path} shows no picture from the AI sequence`);
      assert.ok(
        await page.locator("a[href='#reparation-formular']").isVisible(),
        `${path} keeps its way to the form`,
      );
    }
  } catch (error) {
    fail("repair hub", error.message);
  } finally {
    await context.close();
  }
}
