/*
 * Renders every mark in its MarkTile at the sizes the site uses, plus a
 * blow-up row, on the site's own ground.
 *
 *   node scripts/design/marks-sheet.mjs [out.png]
 *
 * Look at the 44px row. Every failure this set has had was invisible in the
 * blow-up and obvious at 1:1 — the Nordic key that read as a window, the fan
 * that read as a globe.
 *
 * It compiles components/CraftMark.tsx itself (sucrase, already in the tree
 * through Tailwind) and renders it with react-dom/server, so it needs no
 * build and cannot drift from the file it is checking. The tile's CSS is read
 * out of app/globals.css for the same reason.
 */
import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { chromium } from "/opt/node22/lib/node_modules/playwright/index.mjs";

const require = createRequire(import.meta.url);
const { transform } = require("sucrase");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");

const out = process.argv[2] ?? "design/art-direction/marks.png";
const src = await readFile("components/CraftMark.tsx", "utf8");
const code = transform(src, {
  transforms: ["typescript", "jsx", "imports"],
  jsxRuntime: "automatic",
  production: true,
}).code;
/* Inside the tree, so `react/jsx-runtime` resolves from node_modules. */
const work = resolve("node_modules/.cache", `marks-${process.pid}.cjs`);
await mkdir(dirname(work), { recursive: true });
await writeFile(work, code);
const M = require(work);
await rm(work);

const css = await readFile("app/globals.css", "utf8");
const tile = css.slice(css.indexOf(".mark-tile {"), css.indexOf("}", css.indexOf(".mark-tile {")) + 1);

const names = [...src.matchAll(/^  (?:"([a-z-]+)"|([a-z]+)): \($/gm)].map((m) => m[1] ?? m[2]);
const craft = names.slice(0, names.indexOf("ram") === -1 ? names.length : names.indexOf("ram"));
const specs = ["ram", "ssd", "keyboard", "battery", "tested", "warranty"];
const h = React.createElement;
const cell = (el, px, label) =>
  `<div class="c"><span class="mark-tile" style="width:${px}px;height:${px}px">${renderToStaticMarkup(el)}</span>${label ?? ""}</div>`;

const page = `<!doctype html><html><head><style>
body{margin:0;padding:28px;background:#0b1426;color:#9ca3af;font:12px system-ui}
.row{display:flex;flex-wrap:wrap;gap:20px;margin-bottom:28px}
.c{display:flex;flex-direction:column;align-items:center;gap:8px;min-width:84px}
.s20{width:20px;height:20px}.s24{width:24px;height:24px}.s28{width:28px;height:28px}.s84{width:84px;height:84px}
.stroke-brand-300{stroke:#93AEFB}.fill-brand-300{fill:#93AEFB}
${tile}
</style></head><body>${renderToStaticMarkup(h(M.CraftMarkDefs))}
<div class="row">${craft.map((n) => cell(h(M.default, { name: n, className: "s24" }), 44, n)).join("")}</div>
<div class="row">${craft.map((n) => cell(h(M.default, { name: n, className: "s20" }), 36)).join("")}</div>
<div class="row">${specs.map((n) => cell(h(M.SpecMark, { name: n, className: "s20" }), 36, n)).join("")}</div>
<div class="row">${craft.map((n) => cell(h(M.default, { name: n, className: "s84" }), 120)).join("")}</div>
</body></html>`;

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const tab = await browser.newPage({ viewport: { width: 1400, height: 800 } });
await tab.setContent(page);
await mkdir(dirname(out), { recursive: true });
await tab.screenshot({ path: out, fullPage: true });
await browser.close();
console.log(`wrote ${out} — ${craft.length} marks, ${specs.length} spec marks`);
