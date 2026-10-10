/*
 * The three rendered category cards, path-traced.
 *
 *   node scripts/build/cards-cycles/render.mjs [card ...] [--quick]
 *
 * Writes public/cards/cat-desktops.webp, cat-monitors.webp, cat-fleet.webp,
 * exploded.webp and fleet-scene.webp. The laptop card is a crop of the hero
 * photograph and is made by scripts/build/cards/render.mjs.
 *
 * Needs Blender as a Python module, in a venv outside the repository — the
 * wheel is 370 MB and ships Cycles with Open Image Denoise, which Ubuntu's own
 * Blender package leaves out:
 *
 *   uv venv -p python3.11 /opt/bpyenv/.venv
 *   uv pip install --python /opt/bpyenv/.venv/bin/python bpy
 *
 * Set KESTRO_BPY to use a different interpreter.
 *
 * ## Why these are rendered and not drawn any more
 *
 * The row sat under the hero with one photograph and three rasterised
 * renders. The renders lost, and not because of their models: the photograph
 * has a room — a stone desk, a window with a town in it, light that has
 * bounced off both — and the renders had a black studio with a darkened crop
 * of that room laid behind them as fog. Everything a reader recognises as
 * "photograph" is in what a rasteriser does not do: light that bounces, a
 * surface that reflects the window, a lens that throws the background out of
 * focus. A path tracer does all three by default. So the room is built once,
 * with the hero's own view in the window, and each subject stands on the same
 * desk under the same light. See scene.py for the room, the models and the
 * reasoning behind each number.
 */
import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import sharp from "sharp";

const PY = process.env.KESTRO_BPY ?? "/opt/bpyenv/.venv/bin/python";
const HERE = resolve("scripts/build/cards-cycles");
const PLATE = "public/hero/scene.webp";
/* KESTRO_CARDS_OUT writes somewhere else, so a test pass can be measured
   with check-cards.mjs before it replaces the published set. */
const OUT = process.env.KESTRO_CARDS_OUT ?? "public/cards";
/* Delivery sizes. The scene renders each at 4/3 of this and it is
   downsampled here, which is cheaper than the same sharpness in samples. */
const SIZES = {
  "cat-desktops": [1200, 675],
  "cat-monitors": [1200, 675],
  "cat-fleet": [1200, 675],
  exploded: [900, 1200],
  "fleet-scene": [900, 1350],
};
const ALL = Object.keys(SIZES);

const quick = process.argv.includes("--quick");
const wanted = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const cards = wanted.length ? wanted : ALL;

const work = mkdtempSync(join(tmpdir(), "kestro-cycles-"));
try {
  /*
   * The window.
   *
   * The right-hand 600 px of the hero plate is the only strip of its view the
   * laptop does not stand in front of: sky, a mullion, the lit town on the
   * water. Mirrored out to either side it becomes a window wide enough for any
   * of the three cameras. Cut above the book on the right, which carries two
   * words the cards must not.
   *
   * Blurred before it is rendered, not only by the lens. A path tracer
   * defocusing a sharp photograph needs thousands of samples before the
   * background stops being noise, and the denoiser's answer to not enough
   * samples is to paint it — flat blotches with hard contours. Softened here,
   * the lens only has to separate the desk from the subject.
   */
  const crop = await sharp(PLATE)
    .extract({ left: 2000, top: 30, width: 600, height: 620 })
    .png()
    .toBuffer();
  const flop = await sharp(crop).flop().png().toBuffer();
  const window = join(work, "window.png");
  await sharp({ create: { width: 1800, height: 620, channels: 3, background: "#000" } })
    .composite([
      { input: flop, left: 0, top: 0 },
      { input: crop, left: 600, top: 0 },
      { input: flop, left: 1200, top: 0 },
    ])
    .blur(2.5)
    .png()
    .toFile(window);

  const wallpaper = join(work, "wallpaper.png");
  run([join(HERE, "wallpaper.py"), wallpaper]);

  for (const card of cards) {
    const png = join(work, `${card}.png`);
    const t0 = Date.now();
    run([join(HERE, "scene.py"), card, png, ...(quick ? ["--quick"] : [])], {
      KESTRO_WINDOW_PLATE: window,
      KESTRO_WALLPAPER: wallpaper,
    });
    const file = join(OUT, `${card}.webp`);
    const [w, h] = SIZES[card];
    await sharp(png).resize(w, h).webp({ quality: 90 }).toFile(file);
    const kb = (statSync(file).size / 1024).toFixed(0);
    console.log(`${card.padEnd(14)} ${w}x${h}  ${kb} kB  ${((Date.now() - t0) / 1000).toFixed(0)} s`);
  }
} finally {
  rmSync(work, { recursive: true, force: true });
}

function run(args, env = {}) {
  const r = spawnSync(PY, args, {
    env: { ...process.env, ...env },
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  if (r.status !== 0) {
    process.stderr.write(r.stdout.slice(-4000) + r.stderr.slice(-4000));
    throw new Error(`${args[0]} exited ${r.status}`);
  }
}
