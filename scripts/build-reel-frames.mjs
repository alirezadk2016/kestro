/*
 * Cuts the hero carousel's frames out of the source images in assets/.
 *
 *   node scripts/build-reel-frames.mjs
 *
 * The sources are square frames from a customer-journey set, each with a
 * numbered badge and a caption bar burnt into the bottom of the picture. This
 * script's whole job is to remove them.
 *
 * That is not tidying. Text inside an image cannot be translated, selected,
 * read aloud by a screen reader, or indexed — and this site is Danish and
 * English from one source. The captions the carousel shows live in
 * lib/reel-frames.ts, in both languages, each linking to the page that
 * documents what it claims. A caption baked into the pixels can do none of
 * that, and would sit in the picture contradicting the real one beside it.
 *
 * The bar is not at the same height in every frame — a two-line caption starts
 * higher than a one-line one, and the badge sits on top of the bar rather than
 * beside it. So the cut is measured rather than assumed: find the first row
 * that is almost entirely brand blue, then step back above the badge.
 */
import sharp from "sharp";
import { mkdir, readdir, rm } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const SOURCE_DIR = join(root, "assets/renders/journey");
const OUT_DIR = join(root, "public/reel");

/** 960×720 — about twice the widest a pane is drawn at, so it stays sharp on a
    retina screen without paying for pixels nobody sees. */
const WIDTH = 960;
const HEIGHT = 720;

/** How tall the numbered badge is, above the bar it sits on. */
const BADGE = 52;

/** The frames, in the order the journey runs. */
const FRAMES = [
  { source: "1.png", id: "1-spoergsmaal" },
  { source: "2.png", id: "2-raadgivning" },
  { source: "3.png", id: "3-klargoering" },
  { source: "4.png", id: "4-pakning" },
  { source: "5.png", id: "5-levering" },
  { source: "6.png", id: "6-paa-plads" },
];

/**
 * Where the burnt-in furniture starts, in pixels from the top.
 *
 * A row counts as part of the caption bar when nearly all of it is the brand
 * blue. Looking only below 60% of the height keeps a blue shirt or a blue
 * backdrop in the upper part of the picture from being mistaken for it.
 */
async function findCaptionTop(file) {
  const { data, info } = await sharp(file).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  for (let y = Math.floor(height * 0.6); y < height; y++) {
    let blue = 0;
    for (let x = 0; x < width; x++) {
      const p = (y * width + x) * channels;
      const [r, g, b] = [data[p], data[p + 1], data[p + 2]];
      if (b > 90 && b - r > 55 && g < b) blue++;
    }
    if (blue / width > 0.9) return { top: y, width, height };
  }

  return { top: height, width, height };
}

/** The white border some of the frames are matted onto. */
async function findBorder(file) {
  const { data, info } = await sharp(file).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  for (let y = 0; y < Math.floor(height * 0.1); y++) {
    let white = 0;
    for (let x = 0; x < width; x++) {
      const p = (y * width + x) * channels;
      if (data[p] > 240 && data[p + 1] > 240 && data[p + 2] > 240) white++;
    }
    if (white / width < 0.9) return y;
  }

  return 0;
}

await mkdir(OUT_DIR, { recursive: true });

/* Frames from a previous set would still be served and still be fetched by a
   stale lib/reel-view.json, so anything not in FRAMES goes — except the poster,
   which scripts/render-reel-still.mjs writes here afterwards. */
const keep = new Set([...FRAMES.map((frame) => `${frame.id}.webp`), "reel-still.webp"]);
for (const file of await readdir(OUT_DIR)) {
  if (file.endsWith(".webp") && !keep.has(file)) {
    await rm(join(OUT_DIR, file));
    console.log(`removed ${file}`);
  }
}

for (const frame of FRAMES) {
  const file = join(SOURCE_DIR, frame.source);
  const { top, width, height } = await findCaptionTop(file);
  const border = await findBorder(file);

  const tall = Math.max(1, Math.min(top - BADGE, height) - border);
  const box = { left: border, top: border, width: width - border * 2, height: tall };

  const out = join(OUT_DIR, `${frame.id}.webp`);
  const info = await sharp(file)
    .extract(box)
    .resize(WIDTH, HEIGHT, { fit: "cover", position: "centre" })
    .webp({ quality: 82 })
    .toFile(out);

  console.log(
    `${frame.id}  caption at y=${top}, keeping ${box.width}×${box.height}` +
      `  →  ${WIDTH}×${HEIGHT}  ${(info.size / 1024).toFixed(1)} kB`,
  );
}
