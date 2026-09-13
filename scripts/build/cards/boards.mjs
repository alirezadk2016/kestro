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

export function artboardHtml(name, b, groundPath, art) {
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
  svg{position:absolute;inset:0;width:100%;height:100%}
  svg *{vector-effect:non-scaling-stroke;stroke-linejoin:round}
  .grain{position:absolute;inset:0;opacity:.5;background-image:
    radial-gradient(120% 120% at 50% 45%, transparent 54%, rgba(1,3,8,0.62) 100%), ${GRAIN};
    background-size:100% 100%, ${(140 * b.w) / 1200}px ${(140 * b.w) / 1200}px}
  </style>
  <div class="board">
    <img class="ground" src="file://${groundPath}">
    <div class="scrim"></div>
    <div class="floor"></div>
    <svg id="art">
      <defs>
        <!-- Graphite, not grey. The sheen at 13% is the light sweeping across
             the lit face; everything after it falls away into the body. -->
        <linearGradient id="lit" x1="0.04" y1="0" x2="0.96" y2="1">
          <stop offset="0" stop-color="#434a58"/>
          <stop offset="0.13" stop-color="#767e91"/>
          <stop offset="0.32" stop-color="#333a47"/>
          <stop offset="1" stop-color="#191e27"/>
        </linearGradient>
        <linearGradient id="keyf" x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0" stop-color="#2e3541"/>
          <stop offset="0.5" stop-color="#20262f"/>
          <stop offset="1" stop-color="#12171f"/>
        </linearGradient>
        <linearGradient id="fillf" x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0" stop-color="#0e1523"/>
          <stop offset="1" stop-color="#060a12"/>
        </linearGradient>
        <!-- A screen that is lit from inside, not a blue rectangle. -->
        <linearGradient id="screen" x1="0.04" y1="0" x2="0.66" y2="1">
          <stop offset="0" stop-color="#a8c2ff"/>
          <stop offset="0.16" stop-color="#6489ff"/>
          <stop offset="0.29" stop-color="#3a63e8"/>
          <stop offset="0.54" stop-color="#1f43b6"/>
          <stop offset="1" stop-color="#0c1a4c"/>
        </linearGradient>
        <filter id="bloom" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="3.4"/>
        </filter>
        <radialGradient id="contact">
          <stop offset="0" stop-color="#02040a" stop-opacity="0.88"/>
          <stop offset="0.5" stop-color="#02040a" stop-opacity="0.42"/>
          <stop offset="1" stop-color="#02040a" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="fadegrad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#fff" stop-opacity="0.85"/>
          <stop offset="1" stop-color="#fff" stop-opacity="0"/>
        </linearGradient>
        <mask id="fade" maskUnits="userSpaceOnUse">
          <rect id="faderect" fill="url(#fadegrad)"/>
        </mask>
      </defs>
      <g id="g">${art}</g>
    </svg>
    ${b.ramp ? '<div class="ramp"></div>' : ""}
    <div class="grain"></div>
  </div>
  <script>
    var g = document.getElementById('g'), svg = document.getElementById('art');
    var bb = g.getBBox(), W = ${b.w}, H = ${b.h};
    var s = Math.min((W * ${b.fit}) / bb.width, (H * ${b.fit}) / bb.height);
    var vw = W / s, vh = H / s;
    svg.setAttribute('viewBox', [
      bb.x + bb.width / 2 - vw * ${b.cx},
      bb.y + bb.height / 2 - vh * ${b.cy},
      vw, vh,
    ].join(' '));
    g.querySelectorAll('*').forEach(function (el) {
      var w = el.getAttribute('stroke-width');
      if (w) el.setAttribute('stroke-width', (parseFloat(w) * ${K}).toFixed(2));
    });

    /* The floor reflection. Mirrored about the foot of the drawing and faded
       out, it is what puts the object on a surface instead of in a void —
       and it is the single cheapest thing that separates a product shot from
       a diagram. */
    var axis = bb.y + bb.height;
    var rect = document.getElementById('faderect');
    rect.setAttribute('x', bb.x - bb.width);
    rect.setAttribute('y', axis);
    rect.setAttribute('width', bb.width * 3);
    rect.setAttribute('height', bb.height);
    var grad = document.getElementById('fadegrad');
    grad.setAttribute('y1', axis);
    grad.setAttribute('y2', axis + bb.height * 0.5);
    var refl = g.cloneNode(true);
    refl.removeAttribute('id');
    refl.querySelectorAll('[data-flat]').forEach(function (el) { el.remove(); });
    refl.setAttribute('transform', 'matrix(1,0,0,-1,0,' + 2 * axis + ')');
    refl.setAttribute('mask', 'url(#fade)');
    refl.setAttribute('opacity', '0.6');
    svg.insertBefore(refl, g);

    document.documentElement.dataset.ready = '1';
  </script>`;
}
