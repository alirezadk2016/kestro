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
 * documented ones — 14 or 15.6 inches, the X1's thin profile, the ThinkPad
 * TrackPoint, the ProBook's numeric keypad, the workstation's depth, SFF and
 * one-litre cases, the monitors' height-adjustable stand, and the three dock
 * types — and colour is not one of them: the data does not record it, so
 * every machine is the same neutral graphite.
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

/* ------------------------------------------------------------------ laptop */

/*
 * An open laptop seen from the front and a little above: the lid upright,
 * the deck as a trapezoid that widens toward the viewer.
 */
function laptop({ inch = 14, thin = false, workstation = false, trackpoint = false, numpad = false }) {
  const scale = inch >= 15 ? 1.08 : thin ? 0.97 : 1;
  const lidW = 600 * scale;
  const lidH = lidW * 0.62;
  const cx = 600;
  const lidTop = 118 + (1 - scale) * 160;
  const lidX = cx - lidW / 2;
  const hingeY = lidTop + lidH;
  const deckTopW = lidW * 1.0;
  const deckBotW = lidW * 1.32;
  const deckH = 250 * scale;
  const deckBot = hingeY + deckH;
  const edge = workstation ? 22 : thin ? 9 : 15; // front edge thickness
  const bezel = thin ? 14 : 18;

  // deck corners
  const tl = [cx - deckTopW / 2, hingeY];
  const tr = [cx + deckTopW / 2, hingeY];
  const br = [cx + deckBotW / 2, deckBot];
  const bl = [cx - deckBotW / 2, deckBot];
  // bilinear point on deck: u across (0..1), v down (0..1)
  const at = (u, v) => {
    const xT = tl[0] + (tr[0] - tl[0]) * u;
    const xB = bl[0] + (br[0] - bl[0]) * u;
    return [xT + (xB - xT) * v, hingeY + deckH * v];
  };

  // keyboard field
  const kbU0 = numpad ? 0.07 : 0.11;
  const kbU1 = numpad ? 0.93 : 0.89;
  const kbV0 = 0.08;
  const kbV1 = 0.56;
  const rows = 6;
  const mainCols = 14;
  const padCols = numpad ? 4 : 0;
  const totalCols = mainCols + padCols + (numpad ? 0.6 : 0);
  let keys = "";
  for (let r = 0; r < rows; r++) {
    const v0 = kbV0 + ((kbV1 - kbV0) * r) / rows;
    const v1 = kbV0 + ((kbV1 - kbV0) * (r + 1)) / rows;
    const gapV = (v1 - v0) * 0.16;
    const colUnits = [];
    // main block; the space bar on the last row spans six keys
    for (let c = 0; c < mainCols; c++) colUnits.push([c, c + 1]);
    if (r === rows - 1) {
      colUnits.splice(4, 6, [4, 10]);
    }
    if (numpad) for (let c = 0; c < padCols; c++) colUnits.push([mainCols + 0.6 + c, mainCols + 0.6 + c + 1]);
    for (const [a, b] of colUnits) {
      const u0 = kbU0 + ((kbU1 - kbU0) * a) / totalCols;
      const u1 = kbU0 + ((kbU1 - kbU0) * b) / totalCols;
      const gapU = ((kbU1 - kbU0) / totalCols) * 0.14;
      const q = [at(u0 + gapU, v0 + gapV), at(u1 - gapU, v0 + gapV), at(u1 - gapU, v1 - gapV), at(u0 + gapU, v1 - gapV)];
      keys += `    <polygon points="${pts(q)}" fill="#151B23" stroke="#4B5560" stroke-opacity=".35" stroke-width="1"/>\n`;
    }
  }

  // touchpad
  const tpU0 = numpad ? 0.33 : 0.36;
  const tpU1 = numpad ? 0.59 : 0.64;
  const tp = [at(tpU0, 0.64), at(tpU1, 0.64), at(tpU1 + 0.005, 0.93), at(tpU0 - 0.005, 0.93)];
  let extras = `    <polygon points="${pts(tp)}" fill="#323A44" stroke="#59636E" stroke-opacity=".5" stroke-width="1.2"/>\n`;
  if (trackpoint) {
    // the red stick sits between G, H and B; its buttons above the touchpad
    const mainSpan = (kbU1 - kbU0) * (mainCols / totalCols);
    const u = kbU0 + mainSpan * (6.05 / mainCols);
    const v = kbV0 + ((kbV1 - kbV0) * 4.0) / rows;
    const [x, y] = at(u, v);
    extras += `    <ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(5.5 * scale)}" ry="${f(4.4 * scale)}" fill="#D7262E"/>\n`;
    const b = [at(tpU0, 0.585), at(tpU1, 0.585), at(tpU1, 0.625), at(tpU0, 0.625)];
    extras += `    <polygon points="${pts(b)}" fill="#1C232C" stroke="#59636E" stroke-opacity=".45" stroke-width="1"/>\n`;
    const mid = [at((tpU0 + tpU1) / 2, 0.585), at((tpU0 + tpU1) / 2, 0.625)];
    extras += `    <line x1="${f(mid[0][0])}" y1="${f(mid[0][1])}" x2="${f(mid[1][0])}" y2="${f(mid[1][1])}" stroke="#59636E" stroke-opacity=".6"/>\n`;
  }

  const lid = `
    <rect x="${f(lidX)}" y="${f(lidTop)}" width="${f(lidW)}" height="${f(lidH)}" rx="14" fill="url(#body)"/>
    <rect x="${f(lidX + 1.5)}" y="${f(lidTop + 1.5)}" width="${f(lidW - 3)}" height="${f(lidH - 3)}" rx="13" stroke="#6B7580" stroke-opacity=".35" stroke-width="1.5"/>
    <rect x="${f(lidX + bezel)}" y="${f(lidTop + bezel)}" width="${f(lidW - 2 * bezel)}" height="${f(lidH - 2 * bezel - 10)}" rx="3" fill="url(#panel)"/>
    <rect x="${f(lidX + bezel)}" y="${f(lidTop + bezel)}" width="${f(lidW - 2 * bezel)}" height="${f(lidH - 2 * bezel - 10)}" rx="3" fill="url(#glare)"/>
    <circle cx="${cx}" cy="${f(lidTop + bezel / 2)}" r="2.6" fill="#0B1118"/>`;

  const hinge = `
    <rect x="${f(cx - lidW * 0.42)}" y="${f(hingeY - 6)}" width="${f(lidW * 0.84)}" height="12" rx="6" fill="#151B23"/>`;

  const deck = `
    <polygon points="${pts([tl, tr, br, bl])}" fill="url(#deck)"/>
    <polygon points="${pts([tl, tr, br, bl])}" stroke="#6E7883" stroke-opacity=".35" stroke-width="1.5"/>
    <polygon points="${pts([bl, br, [br[0] - 6, deckBot + edge], [bl[0] + 6, deckBot + edge]])}" fill="#141A21"/>
    <line x1="${f(bl[0] + 4)}" y1="${f(deckBot + 1)}" x2="${f(br[0] - 4)}" y2="${f(deckBot + 1)}" stroke="#7C8692" stroke-opacity=".5" stroke-width="1.5"/>`;

  return frame(`${lid}${deck}${hinge}\n${keys}${extras}`, {
    cx,
    cy: deckBot + edge + 10,
    rx: deckBotW * 0.6,
    ry: 40,
  });
}

/* ----------------------------------------------------------------- desktop */

/* A small-form-factor case standing on its side, three-quarter view. */
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

/* A mechanical dock the laptop clicks down onto: a flat plate seen from the
   front and above, its docking connector and two guides on top. */
function mechanicalDock() {
  const topFace = [[360, 470], [840, 470], [930, 610], [270, 610]];
  const frontFace = [[270, 610], [930, 610], [930, 660], [270, 660]];
  return frame(`
    <polygon points="${pts(topFace)}" fill="url(#top)"/>
    <polygon points="${pts(topFace)}" stroke="#6B7580" stroke-opacity=".4" stroke-width="1.5"/>
    <polygon points="${pts(frontFace)}" fill="url(#body)"/>
    <line x1="272" y1="611" x2="928" y2="611" stroke="#7C8692" stroke-opacity=".5" stroke-width="1.5"/>
    <polygon points="${pts([[560, 520], [640, 520], [646, 548], [554, 548]])}" fill="#141A21" stroke="#56606B" stroke-width="1.5"/>
    <rect x="574" y="528" width="52" height="10" rx="3" fill="#0A0F15"/>
    <polygon points="${pts([[392, 500], [432, 500], [428, 530], [384, 530]])}" fill="#262D36" stroke="#56606B" stroke-opacity=".7"/>
    <polygon points="${pts([[768, 500], [808, 500], [816, 530], [772, 530]])}" fill="#262D36" stroke="#56606B" stroke-opacity=".7"/>
    <polygon points="${pts([[300, 590], [900, 590], [912, 606], [288, 606]])}" fill="#2A323C"/>
    <circle cx="880" cy="635" r="11" stroke="#8F99A4" stroke-width="2.5"/>
    <path d="M880 628v7" stroke="#8F99A4" stroke-width="2.5" stroke-linecap="round"/>
    <rect x="300" y="628" width="30" height="13" rx="2.5" stroke="#8F99A4" stroke-width="2"/>
    <rect x="342" y="628" width="30" height="13" rx="2.5" stroke="#8F99A4" stroke-width="2"/>`, { cx: 600, cy: 678, rx: 420, ry: 36 });
}

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
 * Only facts lib/models.ts records: the TrackPoint on the ThinkPads (their
 * notes discuss it), the numeric keypad on the ProBook 450, 15.6 inches on
 * the ProBook and ZBook, the X1's ultralight profile, SFF and one-litre
 * cases, height-adjustable monitor stands, and the dock types.
 */
const art = {
  "lenovo-thinkpad-x1-carbon": laptop({ inch: 14, thin: true, trackpoint: true }),
  "lenovo-thinkpad-l14": laptop({ inch: 14, trackpoint: true }),
  "hp-elitebook-840": laptop({ inch: 14 }),
  "hp-probook-450": laptop({ inch: 15.6, numpad: true }),
  "dell-latitude-5410": laptop({ inch: 14 }),
  "dell-latitude-7490": laptop({ inch: 14 }),
  "hp-zbook-15": laptop({ inch: 15.6, workstation: true }),
  "hp-elitedesk-800": sff({ label: "sff" }),
  "lenovo-thinkcentre-m720q": tiny(),
  "hp-elitedisplay-e243": monitor(),
  "lenovo-thinkvision-t24i": monitor(),
  "lenovo-thinkpad-ultra-dock": mechanicalDock(),
  "dell-wd19": usbcDock({ shape: "long" }),
  "hp-usb-c-dock-g5": usbcDock({ shape: "square" }),
};

mkdirSync(OUT, { recursive: true });
for (const [slug, svg] of Object.entries(art)) {
  writeFileSync(join(OUT, `${slug}.svg`), svg);
}
console.log(`wrote ${Object.keys(art).length} illustrations to public/products/`);
