import { LAND, CITY, GRATICULE } from "@/lib/globe-data";

/*
 * The globe behind the hero.
 *
 * What replaced: a flat dotted world map, 48 kB, lying on the background like
 * a printed pattern. It said "somewhere on Earth". This says where.
 *
 * The land is the same data — public/world-dots.svg was 1363 circles on a
 * 1000x500 equirectangular grid, which is longitude and latitude in disguise —
 * re-projected orthographically by scripts/build/globe.mjs onto a sphere
 * centred at 46E 30N. That centre is not arbitrary and it is not the obvious
 * one: it turns the planet so Denmark, Norway and Sweden face LEFT of the
 * disc, which is the only part of it this layout leaves open. Centred on the
 * Nordics instead, the three beacons landed behind the spec panel — the whole
 * point of the thing, hidden by the furniture in front of it.
 *
 * Every depth cue is the projection doing its own work. Dots crowd and shrink
 * toward the limb because that is what a sphere does to an even field; the
 * graticule bows for the same reason. Nothing here is faked with a drop shadow.
 *
 * No "use client", no canvas, no WebGL. It is server-rendered SVG and CSS
 * keyframes: on screen in the first paint, nothing to hydrate, and the beacon
 * sequence costs no JavaScript at all. The WebGL alternative measured ~800 kB
 * elsewhere in this codebase and would buy a rotation nobody asked for.
 *
 * The three beacons pulse in turn — Denmark, then Norway, then Sweden — which
 * is the company's market in the order it was built. Green against the navy
 * on purpose: it is the one colour on the page that is not the brand's, so it
 * reads as a signal rather than as decoration.
 */

const R = 360;
const CX = 500;
const CY = 500;

/** Projection space (-1..1) to the viewBox. SVG y runs down; the globe's is up. */
const px = (x: number) => +(CX + x * R).toFixed(1);
const py = (y: number) => +(CY - y * R).toFixed(1);

/*
 * Dots bucketed by depth rather than carrying their own r and opacity.
 *
 * Per-dot attributes on 1189 circles cost about 20 kB of markup that gzip then
 * has to work at. Five groups means every dot is `<circle cx cy/>` and the two
 * varying attributes are stated five times in total.
 */
const BUCKETS = [
  { max: 0.3, r: 1.7, o: 0.34 },
  { max: 0.5, r: 2.1, o: 0.5 },
  { max: 0.7, r: 2.5, o: 0.68 },
  { max: 0.87, r: 2.9, o: 0.84 },
  { max: 1.01, r: 3.3, o: 1 },
];

const bucketed = BUCKETS.map((b, i) => ({
  ...b,
  dots: LAND.filter(
    ([, , d]) => d < b.max && d >= (i === 0 ? 0 : BUCKETS[i - 1].max),
  ),
}));

/** The three markets, in the order they light. */
const BEACONS = [
  { id: "dk", at: CITY.dk, delay: "0s" },
  { id: "no", at: CITY.no, delay: "2.6s" },
  { id: "se", at: CITY.se, delay: "5.2s" },
] as const;

/** A great-circle-ish arc between two points on the near hemisphere. */
function arc(a: readonly [number, number], b: readonly [number, number]) {
  const [x1, y1] = [px(a[0]), py(a[1])];
  const [x2, y2] = [px(b[0]), py(b[1])];
  /* Bowed away from the globe's centre, so it lifts off the surface rather
     than cutting through it. */
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = mx - CX;
  const dy = my - CY;
  const len = Math.hypot(dx, dy) || 1;
  const lift = 26;
  return `M${x1} ${y1} Q${(mx + (dx / len) * lift).toFixed(1)} ${(my + (dy / len) * lift).toFixed(1)} ${x2} ${y2}`;
}

const CSS = `
.kg-spin { animation: kg-spin 140s linear infinite; transform-origin: ${CX}px ${CY}px; }
.kg-beacon { animation: kg-beacon 7.8s ease-in-out infinite; opacity: 0; }
.kg-ring { animation: kg-ring 7.8s ease-out infinite; opacity: 0; transform-box: fill-box; transform-origin: center; }
.kg-link { stroke-dasharray: 7 320; animation: kg-link 7.8s ease-in-out infinite; opacity: 0; }
.kg-drift { animation: kg-drift 26s ease-in-out infinite; }

@keyframes kg-spin { to { transform: rotate(360deg); } }
/* A third of the cycle lit, the rest dark: three markets sharing one loop. */
@keyframes kg-beacon {
  0%, 2% { opacity: 0; }
  6% { opacity: 1; }
  22% { opacity: 0.85; }
  30%, 100% { opacity: 0; }
}
@keyframes kg-ring {
  0%, 2% { opacity: 0; transform: scale(0.25); }
  8% { opacity: 0.75; }
  30%, 100% { opacity: 0; transform: scale(3.4); }
}
@keyframes kg-link {
  0%, 4% { opacity: 0; stroke-dashoffset: 320; }
  10% { opacity: 0.9; }
  26% { opacity: 0; }
  30%, 100% { opacity: 0; stroke-dashoffset: 0; }
}
@keyframes kg-drift { 50% { opacity: 0.85; } }

@media (prefers-reduced-motion: reduce) {
  .kg-spin, .kg-ring, .kg-link, .kg-drift { animation: none; }
  .kg-ring, .kg-link { opacity: 0; }
  /* The beacons still mark the three markets, they just stop blinking. */
  .kg-beacon { animation: none; opacity: 0.9; }
}
`;

export default function HeroGlobe({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 1000 1000"
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <defs>
        {/* The body, lit from the upper right like everything else on the
            page, falling to almost nothing at the lower left. */}
        <radialGradient id="kg-body" cx="0.66" cy="0.28" r="0.92">
          <stop offset="0%" stopColor="#1B3E8F" stopOpacity="0.62" />
          <stop offset="38%" stopColor="#12275C" stopOpacity="0.5" />
          <stop offset="72%" stopColor="#08122E" stopOpacity="0.62" />
          <stop offset="100%" stopColor="#03060F" stopOpacity="0.8" />
        </radialGradient>

        {/* Air, not a stroke: it has to be thickest just off the edge and
            gone a little further out, or it reads as a drawn outline. */}
        <radialGradient id="kg-air" cx="0.5" cy="0.5" r="0.5">
          <stop offset="70%" stopColor="#2E79FF" stopOpacity="0" />
          <stop offset="86%" stopColor="#3D82FF" stopOpacity="0.3" />
          <stop offset="93%" stopColor="#2E79FF" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#2E79FF" stopOpacity="0" />
        </radialGradient>

        {/* Limb darkening — the edge of a sphere is turning away from you. */}
        <radialGradient id="kg-limb" cx="0.5" cy="0.5" r="0.5">
          <stop offset="72%" stopColor="#03060F" stopOpacity="0" />
          <stop offset="100%" stopColor="#03060F" stopOpacity="0.55" />
        </radialGradient>

        <linearGradient id="kg-orbit" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2E79FF" stopOpacity="0" />
          <stop offset="45%" stopColor="#7FA8FF" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#2E79FF" stopOpacity="0" />
        </linearGradient>

        <clipPath id="kg-disc">
          <circle cx={CX} cy={CY} r={R} />
        </clipPath>

        <filter id="kg-glow" x="-300%" y="-300%" width="700%" height="700%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      {/* Atmosphere first, behind everything, so the planet sits inside it. */}
      <circle cx={CX} cy={CY} r={R * 1.28} fill="url(#kg-air)" className="kg-drift" />

      <circle cx={CX} cy={CY} r={R} fill="url(#kg-body)" />

      <g clipPath="url(#kg-disc)">
        {/* The sphere's own lines. Faint: they are structure, not subject. */}
        <g
          fill="none"
          stroke="#6C93E8"
          strokeOpacity="0.13"
          strokeWidth="1"
          transform={`translate(${CX} ${CY}) scale(${R} ${-R})`}
          vectorEffect="non-scaling-stroke"
        >
          {GRATICULE.map((d, i) => (
            <path key={i} d={d} strokeWidth={1 / R} />
          ))}
        </g>

        {/* Land. Crowding and shrinking toward the limb is the projection, not
            a decision — an even field on a sphere does exactly this. */}
        {bucketed.map((b, i) => (
          <g key={i} fill="#9DBCFF" fillOpacity={b.o}>
            {b.dots.map(([x, y], j) => (
              <circle key={j} cx={px(x)} cy={py(y)} r={b.r} />
            ))}
          </g>
        ))}

        <circle cx={CX} cy={CY} r={R} fill="url(#kg-limb)" />
      </g>

      {/* The lit rim, on the side the light comes from. */}
      <circle
        cx={CX}
        cy={CY}
        r={R}
        fill="none"
        stroke="#9DC0FF"
        strokeOpacity="0.34"
        strokeWidth="1.2"
        strokeDasharray="700 1600"
        strokeDashoffset="1180"
        transform={`rotate(-52 ${CX} ${CY})`}
      />

      {/* One orbit, tilted, turning once every two and a bit minutes — slow
          enough to be motion you notice only if you stay. */}
      <g className="kg-spin">
        <ellipse
          cx={CX}
          cy={CY}
          rx={R * 1.2}
          ry={R * 0.4}
          fill="none"
          stroke="url(#kg-orbit)"
          strokeWidth="1.1"
          transform={`rotate(-18 ${CX} ${CY})`}
        />
      </g>

      {/* Denmark to Norway, Denmark to Sweden: the routes, drawn when the
          market at the far end takes its turn. */}
      <g fill="none" stroke="#5CF0AE" strokeWidth="1.6" strokeLinecap="round">
        <path d={arc(CITY.dk, CITY.no)} className="kg-link" style={{ animationDelay: "2.6s" }} />
        <path d={arc(CITY.dk, CITY.se)} className="kg-link" style={{ animationDelay: "5.2s" }} />
      </g>

      {BEACONS.map((b) => (
        <g key={b.id}>
          <circle
            cx={px(b.at[0])}
            cy={py(b.at[1])}
            r="7"
            fill="none"
            stroke="#5CF0AE"
            strokeWidth="1.6"
            className="kg-ring"
            style={{ animationDelay: b.delay }}
          />
          <g className="kg-beacon" style={{ animationDelay: b.delay }}>
            <circle cx={px(b.at[0])} cy={py(b.at[1])} r="9" fill="#5CF0AE" filter="url(#kg-glow)" />
            <circle cx={px(b.at[0])} cy={py(b.at[1])} r="3.6" fill="#B9FFE0" />
          </g>
        </g>
      ))}
    </svg>
  );
}
