/*
 * Renders public/cards/*.webp from the hero photograph and the drawings in
 * subjects.mjs.
 *
 *   node scripts/build/cards/render.mjs
 *
 * Each ground is cut from public/hero/scene.webp, the drawing is laid over
 * it in a headless browser at the delivery size, and the result is written
 * as webp. Run scripts/build/check-cards.mjs afterwards: it measures the
 * output against design/art-direction/cards-brief.md.
 */
import { mkdtemp, writeFile, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import sharp from "sharp";
import { chromium } from "/opt/node22/lib/node_modules/playwright/index.mjs";
import { BOARDS, artboardHtml } from "./boards.mjs";
import { SUBJECTS } from "./subjects.mjs";

const PLATE = "public/hero/scene.webp";
const OUT = "public/cards";

const work = await mkdtemp(join(tmpdir(), "kestro-cards-"));
const { width: PW, height: PH } = await sharp(PLATE).metadata();
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

try {
  for (const [name, b] of Object.entries(BOARDS)) {
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

    const page = join(work, `${name}.html`);
    await writeFile(page, artboardHtml(name, b, groundPath, SUBJECTS[name]()));

    /* Shot at 2x and resampled down, so the strokes land on the delivered
       pixel grid rather than being rasterised straight onto it. */
    const tab = await browser.newPage({
      viewport: { width: b.w, height: b.h },
      deviceScaleFactor: 2,
    });
    await tab.goto(`file://${page}`);
    await tab.waitForFunction(() => document.documentElement.dataset.ready === "1");
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
