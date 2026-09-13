/**
 * The K mark, huge and faint, bleeding off the left edge of the hero.
 *
 * Same three paths as components/Logo.tsx — the stem, the upper arm, the lower
 * arm — so the identity is the identity at any size. What changed is the
 * material. It was three flat washes and a hairline: at this scale that reads
 * as a shape someone forgot to finish, not as a solid the light is falling on.
 *
 * Now each facet is a gradient running across its own plane, lit from the
 * upper right like everything else on this page, so the three planes catch
 * one light differently and the fold between them is legible without a single
 * extra path. A bevel runs down the inside of each cut, the leading edge of
 * the stem carries the bright line, and a slow sweep travels the mark every
 * eighteen seconds — long enough that it reads as the light moving rather than
 * as something blinking at the reader.
 *
 * Still one inline SVG, no request, no JavaScript, and nothing to hydrate.
 */
const STEM = "M0 0 H34 V44 L22 100 H0 Z";
const ARM_UP = "M36 52 L60 0 H114 L67 52 Z";
const ARM_DOWN = "M67 52 L114 100 H56 L36 52 Z";

const CSS = `
.km-sweep { animation: km-sweep 18s ease-in-out infinite; }
@keyframes km-sweep {
  0%, 100% { transform: translateX(-140px); }
  50% { transform: translateX(140px); }
}
@media (prefers-reduced-motion: reduce) { .km-sweep { animation: none; opacity: 0.5; } }
`;

export default function HeroMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 114 100"
      preserveAspectRatio="xMidYMid meet"
      className={className}
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <defs>
        <filter id="hero-mark-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* One light, three planes. The stem faces the reader, the upper arm
            turns toward the light, the lower arm turns away — so they take the
            same source at three different strengths. */}
        <linearGradient id="km-stem" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4C7BE8" stopOpacity="0.22" />
          <stop offset="55%" stopColor="#2A4FAE" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#0E1E4C" stopOpacity="0.16" />
        </linearGradient>
        <linearGradient id="km-up" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#2A4FAE" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#7FA8FF" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="km-down" x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="#1B356F" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#050B1E" stopOpacity="0.26" />
        </linearGradient>

        {/* The sweep: a narrow band of light that crosses the mark and is
            clipped to it, so it lights the solid rather than the background. */}
        <linearGradient id="km-sweep-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#AFC9FF" stopOpacity="0" />
          <stop offset="50%" stopColor="#AFC9FF" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#AFC9FF" stopOpacity="0" />
        </linearGradient>

        <clipPath id="km-solid">
          <path d={STEM} />
          <path d={ARM_UP} />
          <path d={ARM_DOWN} />
        </clipPath>
      </defs>

      {/* The facets. */}
      <path d={STEM} fill="url(#km-stem)" />
      <path d={ARM_UP} fill="url(#km-up)" />
      <path d={ARM_DOWN} fill="url(#km-down)" />

      {/* The sweep, inside the mark only. */}
      <g clipPath="url(#km-solid)">
        <rect x="-60" y="-20" width="60" height="140" fill="url(#km-sweep-grad)" className="km-sweep" />
      </g>

      {/* Edges, so the planes read as cut rather than airbrushed. */}
      <g fill="none" stroke="rgba(147,169,239,0.22)" strokeWidth="0.3">
        <path d={STEM} />
        <path d={ARM_UP} />
        <path d={ARM_DOWN} />
      </g>

      {/* The lit edge — the stem's leading side and the underside of the upper
          arm, which is where the light lands first. */}
      <g fill="none" strokeLinecap="round" filter="url(#hero-mark-glow)">
        <path d="M0 0 L0 100" stroke="rgba(150,180,255,0.72)" strokeWidth="0.6" />
        <path d="M36 52 L60 0" stroke="rgba(120,155,255,0.42)" strokeWidth="0.45" />
        {/* The inner corner where all three planes meet: the one point on the
            mark that would catch a specular in any real material. */}
        <path d="M36 52 L67 52" stroke="rgba(175,201,255,0.35)" strokeWidth="0.4" />
      </g>
    </svg>
  );
}
