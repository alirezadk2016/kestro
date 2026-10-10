/*
 * The laptop card: a crop of the hero photograph.
 *
 *   node scripts/build/cards/render.mjs
 *
 * The other five artworks are path-traced in the same room by
 * scripts/build/cards-cycles/render.mjs. This one needs no renderer at all:
 * the hero plate already contains the exact subject — the laptop standing on
 * the stone desk in the blue-hour room — photographed under the light every
 * other card is lit to match. No procedural chassis competes with that, and
 * it is the card the other four are measured against.
 *
 * The crop is pulled in from the right so the book with "CIRCULAR IT /
 * STRONGER BUSINESSES" on its cover falls outside the frame: a card is not the
 * place for two cut-off words, and the brief's rule is no text baked into the
 * pixels.
 */
import { stat } from "node:fs/promises";
import sharp from "sharp";

const PLATE = "public/hero/scene.webp";
const OUT = "public/cards/cat-laptops.webp";
/* Fractions of the plate, so a re-exported hero at another size still lands. */
const CROP = { fx: 0.485, fy: 0.33, fw: 0.295, fh: 0.404 };

const { width: PW, height: PH } = await sharp(PLATE).metadata();
await sharp(PLATE)
  .extract({
    left: Math.round(CROP.fx * PW),
    top: Math.round(CROP.fy * PH),
    width: Math.round(CROP.fw * PW),
    height: Math.round(CROP.fh * PH),
  })
  .resize(1200, 675, { fit: "cover", position: "centre" })
  .webp({ quality: 90 })
  .toFile(OUT);
const { size } = await stat(OUT);
console.log(`cat-laptops    1200x675  ${(size / 1024).toFixed(0)} kB  (hero crop)`);
