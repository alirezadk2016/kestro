/*
 * Cuts the hero reel's frames out of the contact sheet in assets/.
 *
 *   node scripts/build-reel-frames.mjs
 *
 * The source is one 1536×1024 sheet holding thirteen numbered tiles: eight
 * components across two rows, then five views of the assembled machine along
 * the bottom. Cutting them here rather than by hand means the crop is a
 * reviewable diff — a rectangle in this file, not a decision someone made in
 * an image editor and cannot explain a year later.
 *
 * Two things the geometry has to get right:
 *
 *   - The component tiles carry their caption inside the frame ("5  Memory
 *     (RAM)"). The reel writes its own captions in two languages, so the crop
 *     starts below the baked-in one. LABEL_BAND is that offset.
 *   - The two bands have different proportions. Everything is normalised to
 *     3:2 with a centre crop, because a wall of panels that are almost but not
 *     quite the same shape reads as a mistake rather than as a composition.
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const SOURCE = join(root, "assets/renders/exploded-frames.png");
const OUT_DIR = join(root, "public/reel");

/* Panel geometry, measured off the sheet by scanning for the border strokes
   rather than eyeballed: the columns and rows below are where the mean
   brightness of a line of pixels spikes against its neighbours. */
const GRID_COLS = [20, 388, 767, 1142, 1514];
const GRID_ROWS = [101, 373, 649];
const STRIP_COLS = [20, 306, 591, 890, 1183, 1514];
const STRIP_TOP = 690;
const STRIP_BOTTOM = 925;
const LABEL_BAND = 48;
const INSET = 3; // clear of the border stroke itself

/* 960×640 — roughly twice the widest a panel is drawn at, so it stays sharp
   on a retina screen without paying for pixels nobody sees. Nine of these load
   as textures, so the total matters more than any single one. */
const WIDTH = 960;
const HEIGHT = 640;

function componentTile(row, col) {
  return {
    left: GRID_COLS[col] + INSET,
    top: GRID_ROWS[row] + LABEL_BAND,
    width: GRID_COLS[col + 1] - GRID_COLS[col] - INSET * 2,
    height: GRID_ROWS[row + 1] - GRID_ROWS[row] - LABEL_BAND - INSET,
  };
}

/*
 * Narrows a tile to part of itself, in fractions of its own box.
 *
 * Two of the renders carry invented product markings — a battery labelled
 * "Li-ion 00", an SSD reading "hiVMe SSD" — the kind of almost-text an image
 * model produces. Nobody reads it at panel size, but this is a company whose
 * argument is that it writes things down accurately, and a visitor who leans
 * in and finds a made-up part number has been given a reason to doubt the rest
 * of the page. So the crop simply excludes it: both parts are photographed
 * lengthways, and the half without the lettering is the better composition
 * anyway.
 */
function zoom(box, x, w) {
  return {
    left: Math.round(box.left + box.width * x),
    top: box.top,
    width: Math.round(box.width * w),
    height: box.height,
  };
}

function stripTile(col) {
  return {
    left: STRIP_COLS[col] + INSET,
    top: STRIP_TOP + INSET,
    width: STRIP_COLS[col + 1] - STRIP_COLS[col] - INSET * 2,
    height: STRIP_BOTTOM - STRIP_TOP - INSET * 2,
  };
}

/*
 * The reel in order. This is a sequence, not a gallery: the machine arrives
 * closed, gets opened, the parts we actually touch come out, and it goes back
 * together set up for a Danish desk. Every frame maps to something the site
 * already says happens, which is the only reason for a picture of it to be on
 * the front page.
 */
const FRAMES = [
  { id: "01-arrival", box: stripTile(4) },
  { id: "02-chassis", box: componentTile(1, 3) },
  { id: "03-cooling", box: componentTile(0, 2) },
  { id: "04-board", box: componentTile(0, 3) },
  { id: "05-memory", box: componentTile(1, 0) },
  { id: "06-storage", box: zoom(componentTile(1, 1), 0.4, 0.6) },
  { id: "07-battery", box: zoom(componentTile(1, 2), 0.0, 0.6) },
  { id: "08-open", box: stripTile(1) },
  { id: "09-ready", box: stripTile(0) },
];

await mkdir(OUT_DIR, { recursive: true });

for (const frame of FRAMES) {
  const file = join(OUT_DIR, `${frame.id}.webp`);
  const info = await sharp(SOURCE)
    .extract(frame.box)
    .resize(WIDTH, HEIGHT, { fit: "cover", position: "centre" })
    .webp({ quality: 82 })
    .toFile(file);
  console.log(
    `${frame.id}  ${frame.box.width}×${frame.box.height} → ${WIDTH}×${HEIGHT}  ${(info.size / 1024).toFixed(1)} kB`,
  );
}
