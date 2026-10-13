#!/usr/bin/env node
/*
 * mak audit — every page in the sitemap, read the way a search engine reads it.
 *
 *   node .claude/skills/mak/scripts/audit.mjs [base] [--out file.json] [--map docs/seo-keyword-map.csv]
 *
 * base defaults to http://127.0.0.1:4411 (a `next start` of the current build).
 *
 * Per page: <title>, meta description, every <h1>, canonical. Title and
 * description are measured in pixels the way Google truncates them — title at
 * 20px Arial (580 px), description at 14px Arial (920 px). Liberation Sans is
 * metric-compatible with Arial, so the numbers match what a SERP shows.
 *
 * Checks (rule numbers are the ones in references/method.md):
 *   FAIL  title over 580 px, description over 920 px, duplicate title or
 *         description, not exactly one <h1>, no title/description/canonical,
 *         the page's primary keyword (from the keyword map) missing from the title
 *   WARN  title over 60 or under 30 characters, description under 145 or over
 *         160 characters, primary keyword missing from the <h1>
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";

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
const out = flag("--out", "mak-audit.json");
const mapPath = flag("--map", "docs/seo-keyword-map.csv");

/* ---- keyword map: primary keyword per URL ------------------------------- */
function parseCsv(text) {
  const rows = [];
  let row = [], cell = "", q = false;
  text = text.replace(/^﻿/, "");
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') q = false;
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === ",") { row.push(cell); cell = ""; }
    else if (c === "\n") { row.push(cell); rows.push(row); row = []; cell = ""; }
    else if (c !== "\r") cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const [head, ...body] = rows;
  return body.filter((r) => r.length > 1).map((r) => Object.fromEntries(head.map((h, i) => [h, r[i] ?? ""])));
}
const primary = new Map();
if (existsSync(mapPath)) {
  for (const r of parseCsv(readFileSync(mapPath, "utf8")))
    if (r["Primary/Secondary"] === "Primary" && r["Primary URL"]?.startsWith("/"))
      primary.set(r["Primary URL"], r["Keyword"]);
}
const STOP = new Set(["til", "i", "af", "på", "for", "og", "en", "et", "med", "hvad", "man", "skal", "a", "the", "and", "of", "to", "in", "for", "on"]);
const words = (s) => s.toLowerCase().replace(/[^\p{L}\p{N} ]/gu, " ").split(/\s+/).filter(Boolean);
/* Four-letter stems: Danish inflects (brugt/brugte, computer/computere), and a
   keyword is "in" a title when every meaningful word's stem is there. */
const covers = (text, keyword) => {
  const have = new Set(words(text).map((w) => w.slice(0, 4)));
  const need = words(keyword).filter((w) => !STOP.has(w));
  const hit = need.filter((w) => have.has(w.slice(0, 4))).length;
  return hit === need.length ? "full" : hit ? "partial" : "none";
};

/* ---- sitemap ------------------------------------------------------------- */
const xml = await (await fetch(`${base}/sitemap.xml`)).text();
const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
if (!paths.length) throw new Error(`no <loc> in ${base}/sitemap.xml`);

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium",
});
const page = await browser.newPage();
const rows = [];
for (const path of paths) {
  await page.goto(base + path, { waitUntil: "domcontentloaded" });
  const r = await page.evaluate(() => {
    const c = document.createElement("canvas").getContext("2d");
    const w = (t, f) => { c.font = f; return Math.round(c.measureText(t).width); };
    const title = document.title;
    const desc = document.querySelector('meta[name="description"]')?.content ?? "";
    return {
      title, titlePx: w(title, "20px 'Liberation Sans'"),
      desc, descPx: w(desc, "14px 'Liberation Sans'"),
      h1: [...document.querySelectorAll("h1")].map((h) => h.textContent.trim().replace(/\s+/g, " ")),
      canonical: document.querySelector('link[rel="canonical"]')?.href ?? "",
    };
  });
  rows.push({ path, ...r });
}
await browser.close();

/* ---- checks -------------------------------------------------------------- */
const count = (key) => rows.reduce((m, r) => m.set(r[key], (m.get(r[key]) ?? 0) + 1), new Map());
const titles = count("title"), descs = count("desc");
for (const r of rows) {
  const fail = [], warn = [];
  if (!r.title) fail.push("no title");
  if (!r.desc) fail.push("no description");
  if (!r.canonical) fail.push("no canonical");
  if (r.titlePx > 580) fail.push(`title ${r.titlePx}px > 580`);
  if (r.descPx > 920) fail.push(`description ${r.descPx}px > 920`);
  if (titles.get(r.title) > 1) fail.push("duplicate title");
  if (descs.get(r.desc) > 1) fail.push("duplicate description");
  if (r.h1.length !== 1) fail.push(`${r.h1.length} h1`);
  if (r.title.length > 60) warn.push(`title ${r.title.length} chars > 60`);
  if (r.title.length < 30) warn.push(`title ${r.title.length} chars < 30`);
  if (r.desc.length < 145) warn.push(`description ${r.desc.length} chars < 145`);
  if (r.desc.length > 160) warn.push(`description ${r.desc.length} chars > 160`);
  const kw = primary.get(r.path);
  r.primary = kw ?? "";
  if (kw) {
    r.kwInTitle = covers(r.title, kw);
    r.kwInH1 = covers(r.h1.join(" "), kw);
    if (r.kwInTitle === "none") fail.push(`primary "${kw}" not in title`);
    else if (r.kwInTitle === "partial") warn.push(`primary "${kw}" only partly in title`);
    if (r.kwInH1 !== "full") warn.push(`primary "${kw}" ${r.kwInH1 === "none" ? "not" : "only partly"} in h1`);
  }
  r.fail = fail;
  r.warn = warn;
}

writeFileSync(out, JSON.stringify(rows, null, 1));
const failing = rows.filter((r) => r.fail.length), warning = rows.filter((r) => r.warn.length);
const tally = (pred) => rows.filter(pred).length;
console.log(`mak audit: ${rows.length} pages from ${base}/sitemap.xml → ${out}`);
console.log(`  titles   ≤580px ${tally((r) => r.titlePx <= 580)}/${rows.length} · 50–60 chars ${tally((r) => r.title.length >= 50 && r.title.length <= 60)} · unique ${titles.size}`);
console.log(`  descs    ≤920px ${tally((r) => r.descPx <= 920)}/${rows.length} · 145–160 chars ${tally((r) => r.desc.length >= 145 && r.desc.length <= 160)} · unique ${descs.size}`);
console.log(`  h1       exactly one ${tally((r) => r.h1.length === 1)}/${rows.length}`);
const withKw = rows.filter((r) => r.primary);
console.log(`  primary  ${withKw.length} pages have one · in title ${tally((r) => r.kwInTitle === "full")} · in h1 ${tally((r) => r.kwInH1 === "full")}`);
console.log(`  FAIL ${failing.length} pages · WARN ${warning.length} pages`);
for (const r of failing) console.log(`  FAIL ${r.path}: ${r.fail.join("; ")}`);
if (args.includes("--warn")) for (const r of warning) console.log(`  warn ${r.path}: ${r.warn.join("; ")}`);
process.exitCode = failing.length ? 1 : 0;
