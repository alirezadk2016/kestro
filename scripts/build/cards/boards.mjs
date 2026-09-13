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
    fit: 0.7,
    cx: 0.5,
    cy: 0.52,
    ground: { fx: 0.3, fy: 0.0, fw: 0.19, fh: 1.0 },
  },
  "cat-desktops": {
    w: 1200,
    h: 675,
    fit: 0.74,
    cx: 0.5,
    cy: 0.54,
    ground: { fx: 0.415, fy: 0.04, fw: 0.175, fh: 0.92, flip: true },
  },
  "cat-monitors": {
    w: 1200,
    h: 675,
    fit: 0.7,
    cx: 0.5,
    cy: 0.52,
    ground: { fx: 0.38, fy: 0.08, fw: 0.21, fh: 0.92 },
  },
  "cat-fleet": {
    w: 1200,
    h: 675,
    fit: 0.68,
    cx: 0.5,
    cy: 0.54,
    ground: { fx: 0.33, fy: 0.05, fw: 0.165, fh: 0.95, flip: true },
  },
  exploded: {
    w: 900,
    h: 1200,
    fit: 0.76,
    cx: 0.5,
    cy: 0.5,
    ground: { fx: 0.32, fy: 0.0, fw: 0.17, fh: 1.0 },
  },
  /* The fleet card is a backdrop for a heading and a paragraph, so its
     drawing sits high and it keeps a ramp down to near-black underneath. */
  "fleet-scene": {
    w: 900,
    h: 1350,
    fit: 0.84,
    cx: 0.5,
    cy: 0.33,
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
  .board{position:relative;width:${b.w}px;height:${b.h}px;overflow:hidden;background:#070c18}
  .ground{position:absolute;inset:-7%;width:114%;height:114%;object-fit:cover;
          filter:blur(${(11 * b.w) / 1200}px) saturate(.80) brightness(.84)}
  .scrim{position:absolute;inset:0;background:
    radial-gradient(112% 96% at 23% 36%, rgba(120,102,72,0.36) 0%, rgba(11,20,38,0.54) 42%, rgba(5,10,20,0.92) 100%)}
  .ramp{position:absolute;inset:0;background:
    linear-gradient(180deg, rgba(4,8,17,0) 38%, rgba(4,8,17,0.62) 66%, rgba(4,8,17,0.93) 100%)}
  svg{position:absolute;inset:0;width:100%;height:100%}
  svg *{vector-effect:non-scaling-stroke;stroke-linejoin:round}
  .grain{position:absolute;inset:0;opacity:.55;background-image:
    radial-gradient(120% 120% at 50% 45%, transparent 56%, rgba(2,5,12,0.58) 100%), ${GRAIN};
    background-size:100% 100%, ${(140 * b.w) / 1200}px ${(140 * b.w) / 1200}px}
  </style>
  <div class="board">
    <img class="ground" src="file://${groundPath}">
    <div class="scrim"></div>
    <svg id="art">
      <defs>
        <linearGradient id="lit" x1="0.12" y1="0" x2="0.88" y2="1">
          <stop offset="0" stop-color="#a79e8b" stop-opacity="0.95"/>
          <stop offset="0.62" stop-color="#7c7a72" stop-opacity="0.94"/>
          <stop offset="1" stop-color="#575a5e" stop-opacity="0.93"/>
        </linearGradient>
        <linearGradient id="keyf" x1="0" y1="0" x2="0.55" y2="1">
          <stop offset="0" stop-color="#787670" stop-opacity="0.93"/>
          <stop offset="1" stop-color="#3f4550" stop-opacity="0.94"/>
        </linearGradient>
        <linearGradient id="fillf" x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0" stop-color="#27344c" stop-opacity="0.95"/>
          <stop offset="1" stop-color="#131c2e" stop-opacity="0.96"/>
        </linearGradient>
        <linearGradient id="screen" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0" stop-color="#4f78ff" stop-opacity="0.40"/>
          <stop offset="0.55" stop-color="#23418f" stop-opacity="0.30"/>
          <stop offset="1" stop-color="#0d1a3c" stop-opacity="0.40"/>
        </linearGradient>
        <radialGradient id="contact">
          <stop offset="0" stop-color="#02040a" stop-opacity="0.70"/>
          <stop offset="0.55" stop-color="#02040a" stop-opacity="0.34"/>
          <stop offset="1" stop-color="#02040a" stop-opacity="0"/>
        </radialGradient>
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
    document.documentElement.dataset.ready = '1';
  </script>`;
}
