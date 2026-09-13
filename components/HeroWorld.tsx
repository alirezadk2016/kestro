import { LAND, CITY, MAP } from "@/lib/globe-data";

/*
 * The world map behind the hero — flat, as it always was.
 *
 * The map itself is unchanged: the same 1363 dots on the same 1000x500 grid
 * that public/world-dots.svg has always held. What it never had was any idea
 * where the business is. So the one thing added here is three beacons, on
 * Copenhagen, Oslo and Stockholm, lighting in turn.
 *
 * Their positions are not placed by eye. The dot grid is equirectangular,
 * which makes it longitude and latitude in disguise, so scripts/build/globe.mjs
 * converts each capital's real coordinates into the same pixel space as the
 * land. Denmark is where Denmark is.
 *
 * It is inline rather than a file so the beacons can live in the same
 * coordinate space as the land, and it is server-rendered SVG with CSS
 * keyframes: on screen in the first paint, no JavaScript, nothing to hydrate.
 *
 * Green because it is the only colour here that is not the brand's. On a navy
 * page made of blues, a blue pulse is decoration; a green one is a signal.
 */

const CITIES = [
  { id: "dk", at: CITY.dk, delay: "0s" },
  { id: "no", at: CITY.no, delay: "2.6s" },
  { id: "se", at: CITY.se, delay: "5.2s" },
] as const;

/** A shallow arc between two capitals, bowed upward so it lifts off the map. */
function arc([x1, y1]: readonly [number, number], [x2, y2]: readonly [number, number]) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 - 14;
  return `M${x1} ${y1} Q${mx.toFixed(1)} ${my.toFixed(1)} ${x2} ${y2}`;
}

const CSS = `
.kw-beacon { animation: kw-beacon 7.8s ease-in-out infinite; opacity: 0; }
.kw-ring { animation: kw-ring 7.8s ease-out infinite; opacity: 0; transform-box: fill-box; transform-origin: center; }
.kw-link { stroke-dasharray: 5 220; animation: kw-link 7.8s ease-in-out infinite; opacity: 0; }

@keyframes kw-beacon {
  0%, 2% { opacity: 0; }
  6% { opacity: 1; }
  24% { opacity: 0.9; }
  31%, 100% { opacity: 0; }
}
@keyframes kw-ring {
  0%, 2% { opacity: 0; transform: scale(0.3); }
  8% { opacity: 0.8; }
  31%, 100% { opacity: 0; transform: scale(3.2); }
}
@keyframes kw-link {
  0%, 4% { opacity: 0; stroke-dashoffset: 220; }
  11% { opacity: 0.85; }
  27% { opacity: 0; }
  31%, 100% { opacity: 0; stroke-dashoffset: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .kw-ring, .kw-link { animation: none; opacity: 0; }
  /* Where the markets are is information. It stays lit; it stops blinking. */
  .kw-beacon { animation: none; opacity: 0.95; }
}
`;

export default function HeroWorld({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox={`0 0 ${MAP.w} ${MAP.h}`}
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <defs>
        {/*
         * One light across the whole field, in user space so every dot reads
         * it from the same source rather than each one from its own little
         * box. Brightest over Northern Europe and falling away from there:
         * the map is lit where the company works, which is the only reason a
         * decorative field gets to be brighter in one place than another.
         */}
        <radialGradient
          id="kw-light"
          gradientUnits="userSpaceOnUse"
          cx={CITY.dk[0]}
          cy={CITY.dk[1] + 40}
          r="520"
        >
          <stop offset="0%" stopColor="#D6E4FF" stopOpacity="0.85" />
          <stop offset="34%" stopColor="#A8C4FF" stopOpacity="0.55" />
          <stop offset="70%" stopColor="#7C9EEC" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#5C7ED0" stopOpacity="0.16" />
        </radialGradient>

        <filter id="kw-glow" x="-400%" y="-400%" width="900%" height="900%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      {/* The land, exactly as it was drawn. */}
      <g fill="url(#kw-light)">
        {LAND.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="1.7" />
        ))}
      </g>

      {/* Copenhagen to Oslo, Copenhagen to Stockholm — drawn as each one
          takes its turn. */}
      <g fill="none" stroke="#5CF0AE" strokeWidth="1" strokeLinecap="round">
        <path d={arc(CITY.dk, CITY.no)} className="kw-link" style={{ animationDelay: "2.6s" }} />
        <path d={arc(CITY.dk, CITY.se)} className="kw-link" style={{ animationDelay: "5.2s" }} />
      </g>

      {CITIES.map((c) => (
        <g key={c.id}>
          <circle
            cx={c.at[0]}
            cy={c.at[1]}
            r="5"
            fill="none"
            stroke="#5CF0AE"
            strokeWidth="1"
            className="kw-ring"
            style={{ animationDelay: c.delay }}
          />
          <g className="kw-beacon" style={{ animationDelay: c.delay }}>
            <circle cx={c.at[0]} cy={c.at[1]} r="6" fill="#5CF0AE" filter="url(#kw-glow)" />
            <circle cx={c.at[0]} cy={c.at[1]} r="2.4" fill="#D8FFEE" />
          </g>
        </g>
      ))}
    </svg>
  );
}
