import sharp from "sharp";

/*
 * Measures the card artwork against design/art-direction/cards-brief.md.
 *
 * A set of images either belongs to the hero photograph or it does not, and
 * that is a measurable property rather than a matter of taste. The four cards
 * this replaced failed all three of the tests below: they were brighter than
 * the hero, they were lit blue from every direction where the hero's key is
 * warm, and at the size they actually render they carried almost no local
 * contrast — which is what "generic stock render" looks like in numbers.
 *
 * Run after ingest. Reports rather than exits non-zero on the soft checks:
 * these are judgements with a defensible band, not build errors.
 */
const HERO_MEAN = 39; // measured off public/hero/scene.webp

const ASSETS = [
  { file: "cat-laptops.webp", ratio: 16 / 9, renders: [290, 163] },
  { file: "cat-desktops.webp", ratio: 16 / 9, renders: [290, 163] },
  { file: "cat-monitors.webp", ratio: 16 / 9, renders: [290, 163] },
  { file: "cat-fleet.webp", ratio: 16 / 9, renders: [290, 163] },
  { file: "exploded.webp", ratio: 3 / 4, renders: [164, 219] },
  { file: "fleet-scene.webp", ratio: 2 / 3, renders: [290, 521] },
];

const problems = [];

for (const asset of ASSETS) {
  const path = `public/cards/${asset.file}`;
  const meta = await sharp(path).metadata();
  const ratio = meta.width / meta.height;

  /* 1. the frame the slot expects */
  if (Math.abs(ratio - asset.ratio) > 0.02) {
    problems.push(`${asset.file}: ratio ${ratio.toFixed(3)}, slot wants ${asset.ratio.toFixed(3)}`);
  }

  const { data } = await sharp(path).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  let sum = 0;
  let n = 0;
  const bright = [];
  for (let i = 0; i < data.length; i += 3) {
    const l = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
    sum += l;
    n++;
    /* A lit screen is supposed to be the brightest blue thing in the frame,
       so it is excluded from the sample. The test is about where the key
       light comes from — if a powered display counted, the only way to pass
       would be to stop drawing screens that are switched on. Anything whose
       blue runs well ahead of its red and green is emission, not key light. */
    const emissive = data[i + 2] > data[i] + 55 && data[i + 2] > data[i + 1] + 35;
    if (l > 150 && !emissive) bright.push([data[i], data[i + 1], data[i + 2]]);
  }
  const mean = sum / n;

  /* 2. does it live in the hero's exposure? */
  if (mean < HERO_MEAN - 18 || mean > HERO_MEAN + 25) {
    problems.push(
      `${asset.file}: mean luminance ${mean.toFixed(1)}, hero is ${HERO_MEAN} (band 21-64)`,
    );
  }

  /* 3. is the key light warm? the brief's whole point. A blue key is what made
        the previous set look pasted onto the page. Emissive pixels are already
        out of the sample above, so this measures the light in the room. */
  let warmth = null;
  if (bright.length > 200) {
    const avg = bright
      .reduce((a, c) => [a[0] + c[0], a[1] + c[1], a[2] + c[2]], [0, 0, 0])
      .map((v) => v / bright.length);
    warmth = avg[0] - avg[2]; // red minus blue in the highlights
    if (warmth < -12) {
      problems.push(
        `${asset.file}: highlights are blue (r-b ${warmth.toFixed(1)}), the key should be warm`,
      );
    }
  }

  /* 4. does it survive the size it is actually drawn at? */
  const small = await sharp(path)
    .resize(asset.renders[0], asset.renders[1], { fit: "fill" })
    .greyscale()
    .raw()
    .toBuffer();
  let s = 0;
  let s2 = 0;
  for (const v of small) {
    s += v;
    s2 += v * v;
  }
  const sd = Math.sqrt(s2 / small.length - (s / small.length) ** 2);
  if (sd < 18) {
    problems.push(
      `${asset.file}: contrast at ${asset.renders.join("x")} is ${sd.toFixed(1)} — mush, subject too small or too dark`,
    );
  }

  console.log(
    `${asset.file.padEnd(20)} ${String(meta.width).padStart(4)}x${String(meta.height).padEnd(4)} ` +
      `ratio ${ratio.toFixed(3)}  mean L ${mean.toFixed(1).padStart(5)}  ` +
      `highlight r-b ${warmth === null ? "  n/a" : warmth.toFixed(1).padStart(5)}  ` +
      `sd@render ${sd.toFixed(1)}`,
  );
}

console.log("");
if (problems.length) {
  console.log(`${problems.length} thing(s) to look at:`);
  problems.forEach((p) => console.log("  " + p));
} else {
  console.log("all six sit inside the brief.");
}
console.log("\nStill needs a human: no logo, no maker's badge, no red pointing-stick nub,");
console.log("no invented screen interface, no text baked into the pixels.");
