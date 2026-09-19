/*
 * Renders public/cards/*.webp from the hero photograph and the 3D subjects.
 *
 *   node scripts/build/cards/render.mjs
 *
 * Each ground is cut from public/hero/scene.webp, the drawing is laid over
 * it in a headless browser at the delivery size, and the result is written
 * as webp. Run scripts/build/check-cards.mjs afterwards: it measures the
 * output against design/art-direction/cards-brief.md.
 */
import { mkdtemp, writeFile, readFile, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import sharp from "sharp";
import { chromium } from "/opt/node22/lib/node_modules/playwright/index.mjs";
import { BOARDS, artboardHtml } from "./boards.mjs";

const PLATE = "public/hero/scene.webp";
const OUT = "public/cards";
/* Written by scripts/build/cards3d/render3d.mjs. Absolute, because it goes
   into a file:// URL in a page that lives in a temp directory. */
const root3d = resolve("public/cards/3d");

const work = await mkdtemp(join(tmpdir(), "kestro-cards-"));
const { width: PW, height: PH } = await sharp(PLATE).metadata();
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

try {
  for (const [name, b] of Object.entries(BOARDS)) {
    /*
     * A board that names a photo is a crop of the hero plate and nothing else:
     * no 3D layer, no artboard, no reflection to flip. The scene is already
     * lit, already ground, already reflected in its own desk.
     */
    if (b.photo) {
      const p = b.photo;
      const file = join(OUT, `${name}.webp`);
      await sharp(PLATE)
        .extract({
          left: Math.round(p.fx * PW),
          top: Math.round(p.fy * PH),
          width: Math.round(p.fw * PW),
          height: Math.round(p.fh * PH),
        })
        .resize(b.w, b.h, { fit: "cover", position: "centre" })
        .webp({ quality: 90 })
        .toFile(file);
      const { size } = await stat(file);
      console.log(`${name.padEnd(14)} ${b.w}x${b.h}  ${(size / 1024).toFixed(0)} kB  (hero crop)`);
      continue;
    }

    const c = b.ground;
    let cut = sharp(PLATE).extract({
      left: Math.round(c.fx * PW),
      top: Math.round(c.fy * PH),
      width: Math.round(c.fw * PW),
      height: Math.round(c.fh * PH),
    });
    if (c.flip) cut = cut.flop();
    const groundPath = join(work, `ground-${name}.png`);
    await cut.resize(b.w, b.h, { fit: "cover", position: "centre" }).png().toFile(groundPath);

    const objectPath = join(root3d, `${name}.png`);
    /* Written alongside the render: the line where the subject meets the
       floor, which is what the reflection is flipped about. */
    const { baseline } = JSON.parse(await readFile(join(root3d, `${name}.json`), "utf8"));
    const page = join(work, `${name}.html`);
    await writeFile(page, artboardHtml(name, b, groundPath, objectPath, baseline));

    /* Shot at 2x and resampled down, so the strokes land on the delivered
       pixel grid rather than being rasterised straight onto it. */
    const tab = await browser.newPage({
      viewport: { width: b.w, height: b.h },
      deviceScaleFactor: 2,
    });
    await tab.goto(`file://${page}`);
    /* Both layers are files on disk and both are large. Screenshotting before
       they decode gives a 7 kB black rectangle, which is exactly what the
       first run of this produced. */
    await tab.waitForFunction(
      () => Array.from(document.images).every((i) => i.complete && i.naturalWidth > 0),
      null,
      { timeout: 30000 },
    );
    await tab.waitForTimeout(150);
    const shot = await tab.locator(".board").screenshot();
    await tab.close();

    const file = join(OUT, `${name}.webp`);
    await sharp(shot).resize(b.w, b.h).webp({ quality: 88 }).toFile(file);
    const { size } = await stat(file);
    console.log(`${name.padEnd(14)} ${b.w}x${b.h}  ${(size / 1024).toFixed(0)} kB`);
  }
} finally {
  await browser.close();
  await rm(work, { recursive: true, force: true });
}
