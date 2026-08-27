/*
 * The carousel's panes must never overlap each other on screen.
 *
 * They did. At most rotations the ring looked right, but between stops the
 * pane behind poked out from under the one in front and the two read as a
 * single torn picture — which is what a visitor actually reported, and what
 * every screenshot taken at a convenient moment had missed.
 *
 * It is a geometry property, not a rendering one, so it is checked as
 * geometry: no browser, no canvas, no waiting. Each pane's two edges are
 * projected to the angle the camera sees them at, giving every visible pane a
 * span; the spans are sorted and any pair that runs into its neighbour is an
 * overlap. Swept over a full step of rotation and across the whole distance
 * the camera can drift and be pulled to by the pointer.
 *
 * The numbers come from lib/reel-view.json rather than from copies here, so
 * tuning the ring is checked against this rather than around it.
 */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../..", import.meta.url));
const view = JSON.parse(await readFile(join(root, "lib/reel-view.json"), "utf8"));

const TWO_PI = Math.PI * 2;
const smoothstep = (edge0, edge1, x) => {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

/** Below this a pane contributes nothing anyone can see. */
const INVISIBLE = 0.06;

/** How finely the rotation and the camera travel are sampled. */
const TURNS = 360;
const CAMERA_STEPS = 40;

const count = view.frames.length;
const step = TWO_PI / count;
const halfWidth = view.panel.width / 2;
const cameraZ = view.radius + view.distance;

/* The furthest the camera can be from centre: its own drift plus the most the
   pointer can pull it. */
const travel = view.camera.drift + view.camera.parallax;

function worstOverlap(cameraX) {
  let worst = 0;

  for (let s = 0; s < TURNS; s++) {
    const turn = (s / TURNS) * step;
    const spans = [];

    for (let index = 0; index < count; index++) {
      const angle = index * step - turn;
      if (smoothstep(view.fadeAt, view.fadeTo, Math.cos(angle)) <= INVISIBLE) continue;

      const wrapped = ((((angle + Math.PI) % TWO_PI) + TWO_PI) % TWO_PI) - Math.PI;
      const rotation = wrapped * view.faceIn;

      const centreX = Math.sin(angle) * view.radius;
      const centreZ = Math.cos(angle) * view.radius;
      const armX = Math.cos(rotation) * halfWidth;
      const armZ = -Math.sin(rotation) * halfWidth;

      const seen = [
        [centreX - armX, centreZ - armZ],
        [centreX + armX, centreZ + armZ],
      ].map(([x, z]) => Math.atan2(x - cameraX, cameraZ - z));

      spans.push({ from: Math.min(...seen), to: Math.max(...seen) });
    }

    spans.sort((a, b) => a.from - b.from);
    for (let i = 1; i < spans.length; i++) {
      const gap = spans[i].from - spans[i - 1].to;
      if (gap < 0) worst = Math.max(worst, -gap);
    }
  }

  return worst;
}

let worst = 0;
let worstAt = 0;
for (let i = 0; i <= CAMERA_STEPS; i++) {
  const cameraX = -travel + (2 * travel * i) / CAMERA_STEPS;
  const overlap = worstOverlap(cameraX);
  if (overlap > worst) {
    worst = overlap;
    worstAt = cameraX;
  }
}

if (worst > 0) {
  console.error(
    `ring: panes overlap by ${((worst * 180) / Math.PI).toFixed(2)}° ` +
      `with the camera at x=${worstAt.toFixed(2)}.\n` +
      `      Widen the fade window (fadeAt / fadeTo) so a pane is gone before ` +
      `it reaches its neighbour, or raise the radius.`,
  );
  process.exit(1);
}

/*
 * The poster has to be at least as wide, in proportion, as the widest shape
 * the canvas box takes.
 *
 * The canvas holds a fixed vertical field of view, so it shows the same height
 * at any width. object-cover on a poster wider than its box crops the sides
 * and leaves that height alone, which is what makes the swap from poster to
 * canvas invisible. A poster narrower than the box gets cropped top and bottom
 * and scaled up instead, and the picture jumps the moment WebGL takes over.
 *
 * The shapes are read out of the component's own classes rather than repeated
 * here, so changing one of them is caught instead of quietly breaking this.
 */
const component = await readFile(join(root, "components/HeroReel.tsx"), "utf8");
const boxLine = component.match(/className="relative aspect-[^"]*"/);

if (!boxLine) {
  console.error("ring: could not find the canvas box's classes in components/HeroReel.tsx");
  process.exit(1);
}

const shapes = [...boxLine[0].matchAll(/aspect-(?:\[(\d+)\/(\d+)\]|(square))/g)].map((m) =>
  m[3] ? 1 : Number(m[1]) / Number(m[2]),
);

if (shapes.length === 0) {
  console.error("ring: found no aspect classes on the canvas box");
  process.exit(1);
}

const widestBox = Math.max(...shapes);
const posterAspect = view.poster.width / view.poster.height;

if (posterAspect < widestBox - 0.001) {
  console.error(
    `ring: the poster is ${posterAspect.toFixed(3)}:1 but the box gets as wide as ` +
      `${widestBox.toFixed(3)}:1, so object-cover will crop its height and the swap ` +
      `to the canvas will jump.\n      Widen poster in lib/reel-view.json.`,
  );
  process.exit(1);
}

console.log(
  `ring: ${count} panes, no overlap over a full turn across ±${travel.toFixed(2)} of camera travel`,
);
console.log(
  `      poster ${posterAspect.toFixed(3)}:1 covers the widest box shape ${widestBox.toFixed(3)}:1`,
);
