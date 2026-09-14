/*
 * Renders every CraftMark at the sizes the site actually draws them, plus a
 * blow-up of each.
 *
 *   node scripts/design/marks-sheet.mjs [out.png]
 *
 * Look at the 24px row. Every failure this set has had was invisible in the
 * blow-up and obvious at 1:1 — a keycap that read as a prohibition sign, three
 * supplier boxes at four pixels each, a stroke of 1.425 device pixels that
 * could not land on the grid. An icon sheet drawn at 6x is a drawing exercise;
 * this is the acceptance test.
 *
 * It reads components/CraftMark.tsx directly rather than importing it, so it
 * needs no build and cannot drift from the file it is checking.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { chromium } from "/opt/node22/lib/node_modules/playwright/index.mjs";

const out = process.argv[2] ?? "design/art-direction/marks.png";
const src = await readFile("components/CraftMark.tsx", "utf8");

/* Each entry in the record is `name: ( <>…</> ),` — pull the JSX between the
   fragment markers and turn the handful of attributes JSX spells differently
   back into SVG's own. */
const body = src.slice(
  src.indexOf("const marks:"),
  src.indexOf("\n};", src.indexOf("const marks:")),
);
const entries = [
  ...body.matchAll(/(?:^|\n)\s{2}"?([a-z-]+)"?:\s*\(\s*<>([\s\S]*?)<\/>\s*\),/g),
].map(([, name, jsx]) => [
  name,
  jsx
    .replace(/className=/g, "class=")
    .replace(/strokeDasharray=/g, "stroke-dasharray=")
    .replace(/\{([^}]*)\}/g, "$1"),
]);
if (!entries.length) throw new Error("no marks parsed — has the record shape changed?");

/* The classes the marks use, resolved to the values Tailwind gives them on
   this site's palette. Kept here rather than read from a build so the sheet
   runs without one. */
const CSS = `
 body{margin:0;background:#0B1426;color:#e8ecf5;font:11px ui-sans-serif,system-ui;padding:20px}
 h1{font:600 12px ui-sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#93aefb;margin:0 0 14px}
 .grid{display:flex;flex-wrap:wrap;gap:18px}
 .cell{display:flex;flex-direction:column;align-items:center;gap:7px;width:132px}
 .sizes{display:flex;align-items:flex-end;gap:10px;height:52px}
 .plate{display:flex;align-items:center;justify-content:center;border-radius:10px;
   background:rgba(102,144,249,.12);border:1px solid rgba(255,255,255,.08)}
 .p20{width:36px;height:36px}.p24{width:44px;height:44px}.p28{width:50px;height:50px}
 .p20 svg{width:20px;height:20px}.p24 svg{width:24px;height:24px}.p28 svg{width:28px;height:28px}
 .zoom{width:132px;height:132px;display:flex;align-items:center;justify-content:center;
   background:#0e1930;border-radius:8px}
 .zoom svg{width:132px;height:132px}
 svg{color:rgba(232,236,245,.92)}
 .n{opacity:.55;letter-spacing:.04em}
 .fill-brand-400\\/8{fill:rgba(102,144,249,.08)}
 .fill-brand-400\\/10{fill:rgba(102,144,249,.10)}
 .fill-brand-400\\/12{fill:rgba(102,144,249,.12)}
 .fill-brand-300\\/25{fill:rgba(147,174,251,.25)}
 .fill-brand-300{fill:rgb(147,174,251)}
 .stroke-brand-300{stroke:rgb(147,174,251)}
 .opacity-55{opacity:.55}
 .stroke-none{stroke:none}
 .fill-brand-400\\/14{fill:rgba(102,144,249,.14)}
 .fill-brand-300\\/30{fill:rgba(147,174,251,.30)}
 .fill-brand-300\\/35{fill:rgba(147,174,251,.35)}
 .stroke-\\[3\\]{stroke-width:3}
`;

const svg = (inner, cls = "") =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
     stroke-linecap="butt" stroke-linejoin="miter" class="${cls}">${inner}</svg>`;

const html = `<style>${CSS}</style><h1>CraftMark — 20 / 24 / 28px, and 132px</h1>
<div class="grid">${entries
  .map(
    ([name, jsx]) => `<div class="cell">
      <div class="sizes">
        <div class="plate p20">${svg(jsx)}</div>
        <div class="plate p24">${svg(jsx)}</div>
        <div class="plate p28">${svg(jsx)}</div>
      </div>
      <div class="zoom">${svg(jsx)}</div>
      <div class="n">${name}</div>
    </div>`,
  )
  .join("")}</div>`;

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage({
  viewport: { width: 1320, height: 900 },
  deviceScaleFactor: 2,
});
await page.setContent(html);
await mkdir(dirname(out), { recursive: true });
await page.screenshot({ path: out, fullPage: true });
await browser.close();
console.log(`${entries.length} marks -> ${out}`);
