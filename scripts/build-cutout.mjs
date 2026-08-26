/*
 * Cuts the white studio background out of the front page's product photo.
 *
 *   node scripts/build-cutout.mjs
 *
 * The photograph is a black laptop shot on white. On a white card that is a
 * catalogue thumbnail — the one image on the page with no depth, on a page
 * whose whole visual argument is lit hardware against dark. Standing it in the
 * same light as the hero needs the white gone, not covered.
 *
 * The key is a flood fill from the border rather than a plain threshold. A
 * threshold treats every near-white pixel as background, including the ones
 * inside the subject: the specular line along the lid edge, the light parts of
 * the screen. Filling inwards from the edge only removes white that is
 * connected to the outside, so anything enclosed by the laptop survives
 * whatever its brightness.
 *
 * The mask is then blurred by a pixel before it is applied, because a hard
 * binary alpha leaves a white fringe of half-covered pixels around the whole
 * silhouette — the giveaway that something has been cut out.
 */
import sharp from "sharp";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const SOURCE = join(root, "public/thinkpad-t480-6.jpg");
const OUT = join(root, "public/thinkpad-t480-6-cutout.webp");

/* A pixel counts as background when it is bright and almost colourless.
   Both tests matter: the screen is bright too, but it is blue. */
const BRIGHT = 232;
const NEUTRAL = 14;

const { data, info } = await sharp(SOURCE)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;

const isBackground = (i) => {
  const p = i * channels;
  const r = data[p];
  const g = data[p + 1];
  const b = data[p + 2];
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  return min >= BRIGHT && max - min <= NEUTRAL;
};

/* Flood fill inwards from every edge pixel. */
const outside = new Uint8Array(width * height);
const queue = [];

for (let x = 0; x < width; x++) {
  queue.push(x, (height - 1) * width + x);
}
for (let y = 0; y < height; y++) {
  queue.push(y * width, y * width + width - 1);
}

while (queue.length) {
  const i = queue.pop();
  if (outside[i] || !isBackground(i)) continue;
  outside[i] = 1;

  const x = i % width;
  const y = (i - x) / width;
  if (x > 0) queue.push(i - 1);
  if (x < width - 1) queue.push(i + 1);
  if (y > 0) queue.push(i - width);
  if (y < height - 1) queue.push(i + width);
}

const mask = Buffer.alloc(width * height);
let cut = 0;
for (let i = 0; i < width * height; i++) {
  mask[i] = outside[i] ? 0 : 255;
  if (outside[i]) cut++;
}

/* Read the blurred mask back with resolveWithObject rather than assuming its
   shape: sharp hands a one-channel raw buffer back as three, and indexing it
   as one samples the mask at a third of its width — which looks exactly like
   horizontal striping across the cut-out. */
const softened = await sharp(mask, { raw: { width, height, channels: 1 } })
  .blur(1.1)
  .raw()
  .toBuffer({ resolveWithObject: true });

const step = softened.info.channels;

const out = Buffer.alloc(width * height * 4);
for (let i = 0; i < width * height; i++) {
  out[i * 4] = data[i * channels];
  out[i * 4 + 1] = data[i * channels + 1];
  out[i * 4 + 2] = data[i * channels + 2];
  out[i * 4 + 3] = softened.data[i * step];
}

const info2 = await sharp(out, { raw: { width, height, channels: 4 } })
  .webp({ quality: 88, alphaQuality: 90 })
  .toFile(OUT);

console.log(
  `${OUT}\n  ${width}×${height}, ${((cut / (width * height)) * 100).toFixed(1)}% keyed out` +
    `  →  ${(info2.size / 1024).toFixed(1)} kB`,
);
