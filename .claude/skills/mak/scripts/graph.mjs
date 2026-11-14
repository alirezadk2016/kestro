#!/usr/bin/env node
/*
 * mak graph — rule 12: does each page cover its knowledge graph?
 *
 *   node .claude/skills/mak/scripts/graph.mjs [base] [--graphs docs/seo-knowledge-graph.json] [--out file.json]
 *
 * For every page in the graph file: reads the rendered <main> text, and for
 * each node reports whether any of its terms appears. Also checks that the
 * main entity (or a synonym) is in the <title> and the meta description, as
 * the course puts the main entity and its synonym in both.
 *
 * A missing node is a question for the owner, never a sentence to invent.
 */
import { readFileSync, writeFileSync } from "node:fs";

let playwright;
try {
  playwright = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
} catch {
  playwright = await import("playwright");
}
const { chromium } = playwright;

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : fallback;
};
const base = (args.find((a) => /^https?:/.test(a)) ?? "http://127.0.0.1:4411").replace(/\/$/, "");
const { graphs } = JSON.parse(readFileSync(flag("--graphs", "docs/seo-knowledge-graph.json"), "utf8"));
const out = flag("--out", "mak-graph.json");

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium",
});
const page = await browser.newPage();
const rows = [];
for (const [path, graph] of Object.entries(graphs)) {
  const res = await page.goto(base + path, { waitUntil: "domcontentloaded" });
  if (!res || res.status() >= 400) {
    rows.push({ path, error: `HTTP ${res?.status()}` });
    continue;
  }
  const { text, title, desc } = await page.evaluate(() => ({
    /* textContent, not innerText: a closed <details> answer is not rendered,
       so innerText skips it, but a crawler reads the whole DOM. */
    text: (document.querySelector("main") ?? document.body).textContent.replace(/\s+/g, " ").toLowerCase(),
    title: document.title.toLowerCase(),
    desc: (document.querySelector('meta[name="description"]')?.content ?? "").toLowerCase(),
  }));
  const has = (terms, hay) => terms.some((t) => hay.includes(t.toLowerCase()));
  const missing = [], covered = [];
  for (const [group, nodes] of Object.entries(graph.nodes))
    for (const [node, terms] of Object.entries(nodes)) (has(terms, text) ? covered : missing).push(`${group}: ${node}`);
  rows.push({
    path,
    mainInTitle: has(graph.main, title),
    mainInDesc: has(graph.main, desc),
    covered: covered.length,
    total: covered.length + missing.length,
    missing,
  });
}
await browser.close();
writeFileSync(out, JSON.stringify(rows, null, 1));

console.log(`mak graph: ${rows.length} pages → ${out}`);
for (const r of rows) {
  if (r.error) { console.log(`  ${r.path}: ${r.error}`); continue; }
  const pct = Math.round((100 * r.covered) / r.total);
  console.log(`  ${String(pct).padStart(3)}%  ${r.path}${r.mainInTitle ? "" : " · main entity not in title"}${r.mainInDesc ? "" : " · not in description"}`);
  if (args.includes("--missing") && r.missing.length) console.log(`        missing: ${r.missing.join(" · ")}`);
}
