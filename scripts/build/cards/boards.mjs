/*
 * What each artboard is: where its ground is cut from the hero plate, how
 * large it is delivered, and how the drawing is fitted inside it.
 *
 * The grounds are all cut from the same photograph the hero uses, between
 * roughly 30% and 60% across the plate. That band is the lit concrete — the
 * only part of the scene whose highlights are warm, which is the property
 * the cards were failing. Each card gets a different slice and two are
 * mirrored, so six cards do not read as one background used six times.
 */
export const BOARDS = {
  "cat-laptops": {
    w: 1200,
    h: 675,
    fit: 0.82,
    cx: 0.5,
    cy: 0.44,
    ground: { fx: 0.3, fy: 0.0, fw: 0.19, fh: 1.0 },
  },
  "cat-desktops": {
    w: 1200,
    h: 675,
    fit: 0.88,
    cx: 0.5,
    cy: 0.44,
    ground: { fx: 0.415, fy: 0.04, fw: 0.175, fh: 0.92, flip: true },
  },
  "cat-monitors": {
    w: 1200,
    h: 675,
    fit: 0.82,
    cx: 0.5,
    cy: 0.44,
    ground: { fx: 0.38, fy: 0.08, fw: 0.21, fh: 0.92 },
  },
  "cat-fleet": {
    w: 1200,
    h: 675,
    fit: 0.78,
    cx: 0.5,
    cy: 0.44,
    ground: { fx: 0.33, fy: 0.05, fw: 0.165, fh: 0.95, flip: true },
  },
  exploded: {
    w: 900,
    h: 1200,
    fit: 0.84,
    cx: 0.5,
    cy: 0.45,
    ground: { fx: 0.32, fy: 0.0, fw: 0.17, fh: 1.0 },
  },
  /* The fleet card is a backdrop for a heading and a paragraph, so its
     drawing sits high and it keeps a ramp down to near-black underneath. */
  "fleet-scene": {
    w: 900,
    h: 1350,
    fit: 0.96,
    cx: 0.5,
    cy: 0.36,
    ramp: true,
    ground: { fx: 0.415, fy: 0.0, fw: 0.15, fh: 1.0 },
  },
};

/* The site's own grain, lifted verbatim from .grain in app/globals.css, so
   the cards carry the same texture as the sections they sit in. */
const GRAIN =
  "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.055'/%3E%3C/svg%3E\")";

export function artboardHtml(name, b, groundPath, objectPath) {
  /* Strokes are non-scaling, so their widths are output pixels. The drawing
     is written at a nominal 1200px board and scaled from there. */
  const K = (1.9 * b.w) / 1200;
  return `<!doctype html><meta charset="utf-8"><style>
  html,body{margin:0;background:#04070f}
  .board{position:relative;width:${b.w}px;height:${b.h}px;overflow:hidden;background:#03060d}
  /* The photograph stays, but only as texture. Read at full strength it was
     blurry mush competing with the object; at this opacity it is the grain of
     a room rather than a picture of one. */
  .ground{position:absolute;inset:-8%;width:116%;height:116%;object-fit:cover;
          filter:blur(${(40 * b.w) / 1200}px) saturate(.5) brightness(.44);opacity:.34}
  /* Something to stand on. Without a floor the object is in a void, and a
     reflection with nothing to reflect in reads as a smudge. */
  .floor{position:absolute;left:0;right:0;bottom:0;height:62%;background:
    radial-gradient(72% 96% at 48% 18%, rgba(190,164,120,0.15) 0%, rgba(74,76,88,0.06) 38%, rgba(3,6,13,0) 74%),
    linear-gradient(180deg, rgba(170,148,112,0) 0%, rgba(170,148,112,0.075) 26%, rgba(3,6,13,0) 82%)}
  /* A studio stage: one warm pool behind the object, everything else falling
     to black. This is the light the object is lit by, so it has to be visible
     in the room as well as on the edges. */
  .scrim{position:absolute;inset:0;background:
    radial-gradient(46% 34% at 46% 38%, rgba(214,176,116,0.46) 0%, rgba(120,108,104,0.22) 38%, rgba(3,6,13,0) 72%),
    linear-gradient(180deg, rgba(3,6,13,0) 52%, rgba(196,166,120,0.09) 70%, rgba(3,6,13,0) 100%),
    radial-gradient(132% 106% at 50% 44%, rgba(3,6,13,0) 24%, rgba(3,6,13,0.88) 100%)}
  .ramp{position:absolute;inset:0;background:
    linear-gradient(180deg, rgba(3,6,13,0) 38%, rgba(3,6,13,0.66) 66%, rgba(3,6,13,0.95) 100%)}
  /* The subject, rendered rather than drawn. scripts/build/cards3d writes it
     on a transparent ground with its own cast shadow, so everything behind it
     here is still the artboard's: the hero crop, the warm pool and the grain. */
  .subject{position:absolute;inset:0;width:100%;height:100%;object-fit:contain}
  .grain{position:absolute;inset:0;opacity:.5;background-image:
    radial-gradient(120% 120% at 50% 45%, transparent 54%, rgba(1,3,8,0.62) 100%), ${GRAIN};
    background-size:100% 100%, ${(140 * b.w) / 1200}px ${(140 * b.w) / 1200}px}
  </style>
  <div class="board">
    <img class="ground" src="file://${groundPath}">
    <div class="scrim"></div>
    <div class="floor"></div>
    <img class="subject" src="file://${objectPath}">
    ${b.ramp ? '<div class="ramp"></div>' : ""}
    <div class="grain"></div>
  </div>
  `;
}
