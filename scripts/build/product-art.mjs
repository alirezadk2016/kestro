/*
 * Writes public/products/<slug>.svg: one studio illustration per model.
 *
 *   node scripts/build/product-art.mjs
 *
 * Sixteen of the eighteen model pages had no picture at all, and a catalogue
 * of text cards is what made the product section read as unfinished. Licensed
 * photographs exist for two models; everything else gets a drawing in the
 * language of the pricing illustrations (public/pricing/*.svg): a pale studio
 * field, a soft floor shadow, graphite hardware, no logos, no screens with
 * content, and the word "Illustration" on every frame that shows one.
 *
 * A drawing may only show what lib/models.ts says. So the variables are the
 * documented ones — SFF and one-litre cases, the monitors' height-adjustable
 * stand, and the USB-C dock — and colour is not one of them: the data does not record it, so
 * every machine is the same neutral graphite.
 *
 * No laptops. On 11 November 2026 the owner asked that every laptop shown be
 * a real photograph of that model, never an artificial picture, so the seven
 * laptop drawings this script made were removed with their files. A laptop
 * without a licensed or owner-supplied photograph shows no picture.
 *
 * A model that gets a licensed photograph loses its drawing here, with its
 * file: on 12 November 2026 the ThinkPad Ultra Dock and the Dell WD19 did
 * (docs/media-licenses.md).
 *
 * Output is deterministic; re-running it changes nothing unless the
 * definitions below change.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT = join(process.cwd(), "public", "products");
const W = 1200;
const H = 900;

/* ------------------------------------------------------------ shared parts */

const f = (n) => Math.round(n * 10) / 10;
const pts = (list) => list.map(([x, y]) => `${f(x)},${f(y)}`).join(" ");

const defs = (extra = "") => `
  <defs>
    <linearGradient id="field" x1="600" y1="0" x2="600" y2="900" gradientUnits="userSpaceOnUse">
      <stop stop-color="#F4F5F7"/>
      <stop offset="1" stop-color="#E3E7EC"/>
    </linearGradient>
    <radialGradient id="shadow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(600 780) scale(430 46)">
      <stop stop-color="#5B6573" stop-opacity=".42"/>
      <stop offset=".6" stop-color="#7D8794" stop-opacity=".16"/>
      <stop offset="1" stop-color="#9AA3AE" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="body" x1="0" y1="0" x2="0" y2="1">
      <stop stop-color="#3A424C"/>
      <stop offset="1" stop-color="#1E252E"/>
    </linearGradient>
    <linearGradient id="deck" x1="0" y1="0" x2="0" y2="1">
      <stop stop-color="#2E363F"/>
      <stop offset="1" stop-color="#3B444E"/>
    </linearGradient>
    <linearGradient id="panel" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#27313D"/>
      <stop offset=".55" stop-color="#0D141D"/>
      <stop offset="1" stop-color="#18212C"/>
    </linearGradient>
    <linearGradient id="glare" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#FFFFFF" stop-opacity=".09"/>
      <stop offset=".5" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="side" x1="0" y1="0" x2="1" y2="0">
      <stop stop-color="#323A44"/>
      <stop offset="1" stop-color="#1A2028"/>
    </linearGradient>
    <linearGradient id="top" x1="0" y1="0" x2="1" y2="0">
      <stop stop-color="#4C555F"/>
      <stop offset="1" stop-color="#343C46"/>
    </linearGradient>
    <linearGradient id="silver" x1="0" y1="0" x2="1" y2="0">
      <stop stop-color="#C9CFD6"/>
      <stop offset=".5" stop-color="#E9ECEF"/>
      <stop offset="1" stop-color="#AEB6BF"/>
    </linearGradient>
    ${extra}
  </defs>`;

const frame = (inner, shadow = { cx: 600, cy: 780, rx: 430, ry: 46 }) => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none">
${defs()}
  <rect width="${W}" height="${H}" fill="url(#field)"/>
  <ellipse cx="${shadow.cx}" cy="${shadow.cy}" rx="${shadow.rx}" ry="${shadow.ry}" fill="url(#shadow)"/>
${inner}
</svg>
`;

/* -------------------------------------------------------------- desktops */

function sff({ label = "sff" }) {
  const x = 370;
  const y = 210;
  const w = 170; // front width
  const h = 500;
  const d = 300; // depth shown on the side
  const rise = 110;
  const front = [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
  const top = [[x, y], [x + d, y - rise], [x + d + w, y - rise], [x + w, y]];
  const side = [[x + w, y], [x + w + d, y - rise], [x + w + d, y + h - rise], [x + w, y + h]];
  let vents = "";
  for (let r = 0; r < 15; r++) for (let c = 0; c < 7; c++) {
    vents += `<rect x="${x + 22 + c * 19}" y="${y + 225 + r * 17}" width="11" height="9" rx="2" fill="#070C12"/>`;
  }
  const front_parts = `
    <circle cx="${x + 40}" cy="${y + 70}" r="15" stroke="#8F99A4" stroke-width="2.5"/>
    <path d="M${x + 40} ${y + 61}v9" stroke="#8F99A4" stroke-width="2.5" stroke-linecap="round"/>
    <rect x="${x + 80}" y="${y + 62}" width="34" height="13" rx="2.5" stroke="#8F99A4" stroke-width="2"/>
    <rect x="${x + 80}" y="${y + 92}" width="34" height="13" rx="2.5" stroke="#8F99A4" stroke-width="2"/>
    <circle cx="${x + 132}" cy="${y + 69}" r="6" stroke="#8F99A4" stroke-width="2"/>
    <line x1="${x + 20}" y1="${y + 200}" x2="${x + w - 20}" y2="${y + 200}" stroke="#56606B" stroke-width="1.5"/>
    ${label === "sff" ? vents : ""}`;
  return frame(`
    <polygon points="${pts(side)}" fill="url(#side)"/>
    <polygon points="${pts(top)}" fill="url(#top)"/>
    <polygon points="${pts(front)}" fill="url(#body)"/>
    <polygon points="${pts(front)}" stroke="#6B7580" stroke-opacity=".4" stroke-width="1.5"/>
    <polygon points="${pts(side)}" stroke="#56606B" stroke-opacity=".35" stroke-width="1.5"/>
    ${front_parts}`, { cx: x + (w + d) / 2, cy: y + h - 20, rx: 300, ry: 38 });
}

/* A one-litre "tiny" PC lying flat, three-quarter view. */
function tiny() {
  const x = 330;
  const y = 470;
  const w = 380; // front width
  const h = 78;
  const d = 300;
  const rise = 150;
  const front = [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
  const top = [[x, y], [x + d * 0.55, y - rise], [x + d * 0.55 + w, y - rise], [x + w, y]];
  const side = [[x + w, y], [x + w + d * 0.55, y - rise], [x + w + d * 0.55, y + h - rise], [x + w, y + h]];
  let grille = "";
  for (let c = 0; c < 26; c++) {
    grille += `<line x1="${x + 30 + c * 9}" y1="${y + 20}" x2="${x + 30 + c * 9}" y2="${y + 58}" stroke="#070C12" stroke-width="4" stroke-linecap="round"/>`;
  }
  return frame(`
    <polygon points="${pts(side)}" fill="url(#side)"/>
    <polygon points="${pts(top)}" fill="url(#top)"/>
    <polygon points="${pts(front)}" fill="url(#body)"/>
    <polygon points="${pts(front)}" stroke="#6B7580" stroke-opacity=".4" stroke-width="1.5"/>
    ${grille}
    <circle cx="${x + w - 40}" cy="${y + 39}" r="12" stroke="#8F99A4" stroke-width="2.5"/>
    <path d="M${x + w - 40} ${y + 32}v7" stroke="#8F99A4" stroke-width="2.5" stroke-linecap="round"/>
    <rect x="${x + w - 112}" y="${y + 32}" width="30" height="12" rx="2.5" stroke="#8F99A4" stroke-width="2"/>
    <rect x="${x + w - 150}" y="${y + 32}" width="16" height="12" rx="6" stroke="#8F99A4" stroke-width="2"/>`, { cx: 610, cy: y + h + 16, rx: 330, ry: 34 });
}

/* ----------------------------------------------------------------- monitor */

/* A 16:9 office monitor on a height-adjustable column, front view. */
function monitor({ stand = "column" } = {}) {
  const w = 760;
  const h = w * 9 / 16 + 34;
  const x = 600 - w / 2;
  const y = 120;
  const panelPad = 12;
  const colTop = y + h - 6;
  const baseY = 700;
  return frame(`
    <rect x="${f(x)}" y="${y}" width="${w}" height="${f(h)}" rx="10" fill="url(#body)"/>
    <rect x="${f(x + 1.5)}" y="${y + 1.5}" width="${w - 3}" height="${f(h - 3)}" rx="9" stroke="#6B7580" stroke-opacity=".35" stroke-width="1.5"/>
    <rect x="${f(x + panelPad)}" y="${y + panelPad}" width="${w - 2 * panelPad}" height="${f(h - 2 * panelPad - 22)}" rx="2" fill="url(#panel)"/>
    <rect x="${f(x + panelPad)}" y="${y + panelPad}" width="${w - 2 * panelPad}" height="${f(h - 2 * panelPad - 22)}" rx="2" fill="url(#glare)"/>
    <circle cx="${f(x + w - 40)}" cy="${f(y + h - 17)}" r="3" fill="#C9D1DA"/>
    <rect x="${f(x + w - 88)}" y="${f(y + h - 18)}" width="12" height="2" rx="1" fill="#6B7580"/>
    <rect x="${f(x + w - 110)}" y="${f(y + h - 18)}" width="12" height="2" rx="1" fill="#6B7580"/>
    <rect x="${f(x + w - 132)}" y="${f(y + h - 18)}" width="12" height="2" rx="1" fill="#6B7580"/>
    ${stand === "column" ? `
    <rect x="560" y="${f(colTop)}" width="80" height="${f(baseY - colTop)}" fill="url(#body)"/>
    <rect x="578" y="${f(colTop + 30)}" width="44" height="${f(baseY - colTop - 60)}" rx="10" fill="#0E141B" opacity=".55"/>
    <polygon points="${pts([[470, baseY], [730, baseY], [770, baseY + 44], [430, baseY + 44]])}" fill="url(#top)"/>
    <rect x="430" y="${baseY + 44}" width="340" height="8" rx="3" fill="#1A2028"/>` : ""}`, { cx: 600, cy: baseY + 58, rx: 360, ry: 36 });
}

/* ------------------------------------------------------------------- docks */

/* A USB-C dock: a low block with its host cable. */
function usbcDock({ shape = "long" } = {}) {
  const w = shape === "long" ? 470 : 340;
  const d = shape === "long" ? 190 : 250;
  const h = 70;
  const x = 600 - w / 2 - d * 0.25;
  const y = 470;
  const rise = d * 0.5;
  const front = [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
  const top = [[x, y], [x + d * 0.5, y - rise], [x + d * 0.5 + w, y - rise], [x + w, y]];
  const side = [[x + w, y], [x + w + d * 0.5, y - rise], [x + w + d * 0.5, y + h - rise], [x + w, y + h]];
  const cableStart = [x + 70, y + h / 2];
  return frame(`
    <path d="M${f(cableStart[0])} ${f(cableStart[1])} C ${f(x - 60)} ${f(y + 40)}, ${f(x - 140)} ${f(y + 170)}, ${f(x - 20)} ${f(y + 230)} S ${f(x + 150)} ${f(y + 260)}, ${f(x + 230)} ${f(y + 245)}" stroke="#1A2028" stroke-width="13" stroke-linecap="round"/>
    <rect x="${f(x + 222)}" y="${f(y + 236)}" width="46" height="18" rx="6" fill="#262D36"/>
    <polygon points="${pts(side)}" fill="url(#side)"/>
    <polygon points="${pts(top)}" fill="url(#top)"/>
    <polygon points="${pts(front)}" fill="url(#body)"/>
    <polygon points="${pts(front)}" stroke="#6B7580" stroke-opacity=".4" stroke-width="1.5"/>
    <rect x="${f(x + w - 150)}" y="${f(y + 28)}" width="30" height="13" rx="2.5" stroke="#8F99A4" stroke-width="2"/>
    <rect x="${f(x + w - 108)}" y="${f(y + 28)}" width="16" height="12" rx="6" stroke="#8F99A4" stroke-width="2"/>
    <circle cx="${f(x + w - 52)}" cy="${f(y + 34)}" r="10" stroke="#8F99A4" stroke-width="2.5"/>
    <path d="M${f(x + w - 52)} ${f(y + 28)}v6" stroke="#8F99A4" stroke-width="2.5" stroke-linecap="round"/>`, { cx: 610, cy: y + h + 30, rx: 360, ry: 40 });
}

/* ------------------------------------------------------------------ models */

/*
 * Only facts lib/models.ts records: SFF and one-litre cases,
 * height-adjustable monitor stands, and the dock types.
 */
const art = {
  "hp-elitedesk-800": sff({ label: "sff" }),
  "lenovo-thinkcentre-m720q": tiny(),
  "hp-elitedisplay-e243": monitor(),
  "lenovo-thinkvision-t24i": monitor(),
  "hp-usb-c-dock-g5": usbcDock({ shape: "square" }),
};

mkdirSync(OUT, { recursive: true });
for (const [slug, svg] of Object.entries(art)) {
  writeFileSync(join(OUT, `${slug}.svg`), svg);
}
console.log(`wrote ${Object.keys(art).length} illustrations to public/products/`);
