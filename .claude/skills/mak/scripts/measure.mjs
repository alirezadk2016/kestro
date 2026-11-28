#!/usr/bin/env node
/*
 * mak measure — check draft titles and descriptions before they go into the code.
 *
 *   node .claude/skills/mak/scripts/measure.mjs drafts.json [--all]
 *
 * drafts.json: { "/url": { "t": "title or null", "d": "description or null" }, ... }
 * Prints pixel width and character count; flags a title over 580 px and a
 * description outside 145–160 characters or over 920 px. --all prints every row.
 */
import { readFileSync } from "node:fs";

let playwright;
try {
  playwright = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
} catch {
  playwright = await import("playwright");
}
const drafts = JSON.parse(readFileSync(process.argv[2], "utf8"));
const browser = await playwright.chromium.launch({
  executablePath: process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium",
});
const page = await browser.newPage();
const rows = await page.evaluate((drafts) => {
  const c = document.createElement("canvas").getContext("2d");
  const w = (t, f) => { c.font = f; return Math.round(c.measureText(t).width); };
  return Object.entries(drafts).map(([url, { t, d }]) => ({
    url, t, tpx: t ? w(t, "20px 'Liberation Sans'") : 0, d, dpx: d ? w(d, "14px 'Liberation Sans'") : 0,
  }));
}, drafts);
await browser.close();

let bad = 0;
for (const r of rows) {
  const tf = r.t && r.tpx > 580 ? "  << title over 580px" : "";
  const df = r.d && (r.dpx > 920 || r.d.length < 145 || r.d.length > 160) ? "  << description off target" : "";
  if (tf || df || process.argv.includes("--all"))
    console.log(`${r.url}\n  T ${r.tpx}px ${r.t?.length ?? 0}ch${tf}  ${r.t ?? ""}\n  D ${r.dpx}px ${r.d?.length ?? 0}ch${df}  ${r.d ?? ""}`);
  if (tf || df) bad++;
}
console.log(`${rows.length} drafts, ${bad} off target`);
process.exitCode = bad ? 1 : 0;
