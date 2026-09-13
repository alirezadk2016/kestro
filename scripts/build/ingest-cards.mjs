import sharp from "sharp";
import { readdirSync, existsSync, mkdirSync } from "node:fs";
import { join, extname } from "node:path";

/*
 * Turns the renders into the site's card assets.
 *
 *   node scripts/build/ingest-cards.mjs <folder-of-downloaded-pngs>
 *
 * The generator's CDN is refused by this environment's egress proxy, so the
 * files arrive by hand — downloaded from the widget and dropped in a folder.
 * Everything after that is deterministic and belongs in a script rather than
 * in a sequence of one-off commands: the six assets have three different
 * target ratios, and getting one of them wrong is exactly the defect this set
 * was made to fix.
 *
 * Match by the index the batch was submitted with, which is also the order
 * they appear in the widget. Rename the downloads 1.png … 6.png, or leave the
 * generator's filenames and pass them in that order.
 */
const TARGETS = [
  { n: 1, out: "cat-laptops.webp", w: 1200, h: 675 },
  { n: 2, out: "cat-desktops.webp", w: 1200, h: 675 },
  { n: 3, out: "cat-monitors.webp", w: 1200, h: 675 },
  { n: 4, out: "cat-fleet.webp", w: 1200, h: 675 },
  /* The exploded view is drawn at 164x219 beside the step list. 3:4. */
  { n: 5, out: "exploded.webp", w: 900, h: 1200 },
  /* Portrait, because the slot is 290x521 and the old landscape asset was
     having its sides thrown away. */
  { n: 6, out: "fleet-scene.webp", w: 900, h: 1350 },
];

const dir = process.argv[2];
if (!dir || !existsSync(dir)) {
  console.error("usage: node scripts/build/ingest-cards.mjs <folder-of-pngs>");
  process.exit(1);
}

const files = readdirSync(dir)
  .filter((f) => [".png", ".jpg", ".jpeg", ".webp"].includes(extname(f).toLowerCase()))
  .sort();

if (files.length !== TARGETS.length) {
  console.error(`expected ${TARGETS.length} images in ${dir}, found ${files.length}:`);
  files.forEach((f) => console.error("  " + f));
  process.exit(1);
}

mkdirSync("public/cards", { recursive: true });

for (const [i, target] of TARGETS.entries()) {
  const src = join(dir, files[i]);
  const meta = await sharp(src).metadata();
  await sharp(src)
    /* cover, not contain: the renders are already framed to the right ratio,
       so this only trims the rounding difference. A letterbox here would put
       black bars inside a card that is itself nearly black. */
    .resize(target.w, target.h, { fit: "cover", position: "centre" })
    .webp({ quality: 82, effort: 6 })
    .toFile(join("public/cards", target.out));
  const out = await sharp(join("public/cards", target.out)).metadata();
  console.log(
    `${files[i]}  ${meta.width}x${meta.height}  ->  ${target.out}  ${out.width}x${out.height}`,
  );
}
console.log("\nnow run: node scripts/build/check-cards.mjs");
