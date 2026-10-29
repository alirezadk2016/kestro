#!/usr/bin/env node
/*
 * mak links — rule 9: the internal links of every page in the sitemap.
 *
 *   node .claude/skills/mak/scripts/links.mjs [base] [--out file.json] [--csv docs/seo-internal-links.csv]
 *
 * base defaults to http://127.0.0.1:4411 (a `next start` of the current build).
 *
 * Every internal <a href> is sorted by where it sits:
 *   header      inside <header>: the menu, on every page
 *   footer      inside <footer>: on every page
 *   breadcrumb  inside the breadcrumb <nav>
 *   content     everything else inside <main>; split into
 *               in-text  an anchor inside running text (a <p>, <li>, <td>, <dd>
 *                        whose text is longer than the anchor's own)
 *               block    a card, a button, a list of children
 *
 * Reported per page: content links out (distinct targets), in-text links out,
 * content links in (distinct source pages), and the anchors other pages use
 * for it. Flags, from the lesson:
 *   many    more than 12 distinct in-text targets on one page (the course
 *           keeps it to about 7–8, never much past 10)
 *   orphan  no content link in from any other page; reachable only by the menu
 *   same    three or more pages link in, all with the same anchor
 *   vague   an anchor that does not name its target ("læs mere", "her")
 * Header and footer links are listed once, site-wide: they count on every page.
 */
import { writeFileSync } from "node:fs";

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
const out = flag("--out", "mak-links.json");
const csvPath = flag("--csv", null);

const xml = await (await fetch(`${base}/sitemap.xml`)).text();
const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
if (!paths.length) throw new Error(`no <loc> in ${base}/sitemap.xml`);
const known = new Set(paths);

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium",
});
const page = await browser.newPage();
const pages = [];
for (const path of paths) {
  await page.goto(base + path, { waitUntil: "domcontentloaded" });
  const links = await page.evaluate((origin) => {
    const region = (a) => {
      if (a.closest("header")) return "header";
      if (a.closest("footer")) return "footer";
      if (a.closest('nav[aria-label="Brødkrumme"], nav[aria-label="Breadcrumb"]')) return "breadcrumb";
      if (a.closest("main")) return "content";
      return "other";
    };
    const anchorText = (a) =>
      (a.innerText.trim() || a.getAttribute("aria-label") || a.querySelector("img")?.alt || "")
        .replace(/\s+/g, " ")
        .trim();
    const inText = (a) => {
      const block = a.parentElement?.closest("p, li, td, dd, figcaption");
      if (!block || a.querySelector("h1,h2,h3,h4,h5,h6,img,picture")) return false;
      return block.textContent.replace(/\s+/g, " ").trim().length > a.textContent.replace(/\s+/g, " ").trim().length + 10;
    };
    return [...document.querySelectorAll("a[href]")]
      .map((a) => {
        let u;
        try { u = new URL(a.getAttribute("href"), location.href); } catch { return null; }
        if (u.origin !== origin && !/(^|\.)kestro\.dk$/.test(u.hostname)) return null;
        const to = u.pathname.replace(/(.)\/$/, "$1");
        return { to, region: region(a), text: anchorText(a), inText: inText(a) };
      })
      .filter(Boolean);
  }, new URL(base).origin);
  pages.push({ path, links: links.filter((l) => l.to !== path) });
}
await browser.close();

/* ---- per page and per target ------------------------------------------- */
const VAGUE = /^(læs mere|se mere|læs her|her|klik her|mere|read more|see more|here|click here|more)$/i;
const inbound = new Map(paths.map((p) => [p, { from: new Set(), anchors: new Map() }]));
const rows = [];
for (const p of pages) {
  const content = p.links.filter((l) => l.region === "content");
  const outTargets = new Set(content.map((l) => l.to));
  const inTextTargets = new Set(content.filter((l) => l.inText).map((l) => l.to));
  for (const l of content) {
    const t = inbound.get(l.to);
    if (!t) continue;
    t.from.add(p.path);
    const key = l.text.toLowerCase();
    t.anchors.set(key, (t.anchors.get(key) ?? 0) + 1);
  }
  rows.push({
    path: p.path,
    contentOut: outTargets.size,
    inTextOut: inTextTargets.size,
    vague: [...new Set(content.filter((l) => VAGUE.test(l.text)).map((l) => `${l.text} → ${l.to}`))],
    broken: [...new Set(content.filter((l) => !known.has(l.to) && !/^\/(api|_next)\//.test(l.to)).map((l) => l.to))],
  });
}
for (const r of rows) {
  const t = inbound.get(r.path);
  r.contentIn = t.from.size;
  r.anchors = [...t.anchors.entries()].sort((a, b) => b[1] - a[1]).map(([text, n]) => ({ text, n }));
  const flags = [];
  if (r.inTextOut > 12) flags.push(`many: ${r.inTextOut} in-text targets`);
  if (r.path !== "/" && r.path !== "/en" && r.contentIn === 0) flags.push("orphan: no content link in");
  if (r.contentIn >= 3 && r.anchors.length === 1) flags.push(`same: every link in says "${r.anchors[0].text.slice(0, 60)}${r.anchors[0].text.length > 60 ? "…" : ""}"`);
  if (r.vague.length) flags.push(`vague: ${r.vague.join(", ")}`);
  if (r.broken.length) flags.push(`not in sitemap: ${r.broken.join(", ")}`);
  r.flags = flags;
}

/* ---- header and footer, once ------------------------------------------- */
const chrome = (lang, region) => {
  const home = pages.find((p) => p.path === (lang === "en" ? "/en" : "/"));
  return [...new Set((home?.links ?? []).filter((l) => l.region === region).map((l) => l.to))];
};
const site = {
  header: { da: chrome("da", "header"), en: chrome("en", "header") },
  footer: { da: chrome("da", "footer"), en: chrome("en", "footer") },
};

/* ---- blog ↔ commercial (pillar ↔ cluster) ------------------------------ */
const isBlog = (p) => /^\/(en\/)?(vejledninger|guides)(\/|$)/.test(p);
let blogToCommercial = 0, commercialToBlog = 0;
for (const p of pages)
  for (const l of p.links.filter((l) => l.region === "content")) {
    if (isBlog(p.path) && !isBlog(l.to)) blogToCommercial++;
    if (!isBlog(p.path) && isBlog(l.to)) commercialToBlog++;
  }

writeFileSync(out, JSON.stringify({ site, rows }, null, 1));
if (csvPath) {
  const q = (v) => `"${String(v).replace(/"/g, '""')}"`;
  const lines = [["URL", "Links ind (sider)", "Ankertekster ind", "Mest brugte anker", "Links ud (indhold)", "Links ud (i tekst)", "Menu", "Footer", "Note"].join(",")];
  for (const r of rows) {
    const lang = r.path.startsWith("/en") ? "en" : "da";
    lines.push([
      r.path, r.contentIn, r.anchors.length, r.anchors[0]?.text ?? "", r.contentOut, r.inTextOut,
      site.header[lang].includes(r.path) ? "ja" : "", site.footer[lang].includes(r.path) ? "ja" : "", r.flags.join("; "),
    ].map(q).join(","));
  }
  writeFileSync(csvPath, "﻿" + lines.join("\n") + "\n");
}

const tally = (pred) => rows.filter(pred).length;
const median = (xs) => xs.sort((a, b) => a - b)[xs.length >> 1];
console.log(`mak links: ${rows.length} pages from ${base}/sitemap.xml → ${out}`);
console.log(`  menu     header ${site.header.da.length} da / ${site.header.en.length} en · footer ${site.footer.da.length} da / ${site.footer.en.length} en`);
console.log(`  out      median ${median(rows.map((r) => r.contentOut))} content targets, ${median(rows.map((r) => r.inTextOut))} in text · over 12 in text: ${tally((r) => r.inTextOut > 12)}`);
console.log(`  in       median ${median(rows.map((r) => r.contentIn))} pages · orphans ${tally((r) => r.flags.some((f) => f.startsWith("orphan")))} · one anchor from 3+ pages ${tally((r) => r.flags.some((f) => f.startsWith("same")))}`);
console.log(`  anchors  vague on ${tally((r) => r.vague.length)} pages · links to pages outside the sitemap on ${tally((r) => r.broken.length)}`);
console.log(`  trees    blog → commercial ${blogToCommercial} · commercial → blog ${commercialToBlog}`);
if (args.includes("--flags")) for (const r of rows.filter((r) => r.flags.length)) console.log(`  ${r.path}: ${r.flags.join("; ")}`);
