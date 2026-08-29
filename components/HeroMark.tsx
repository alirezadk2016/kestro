/**
 * The K mark, huge and faint, bleeding off the left edge of the hero.
 *
 * Same three paths as components/Logo.tsx — the stem, the upper arm, the
 * lower arm — just traced as an oversized wireframe instead of drawn small
 * and solid. One edge of the stem carries the bright line the small mark
 * only hints at with its gradient, because at this size a hint is not
 * enough to read as light.
 */
const STEM = "M0 0 H34 V44 L22 100 H0 Z";
const ARM_UP = "M36 52 L60 0 H114 L67 52 Z";
const ARM_DOWN = "M67 52 L114 100 H56 L36 52 Z";

export default function HeroMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 114 100"
      preserveAspectRatio="xMidYMid meet"
      className={className}
    >
      <defs>
        <filter id="hero-mark-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* The facets. Each piece gets a slightly different value, the way
          three planes of one solid catch a single light differently —
          flat-filling all three makes it a silhouette, not a fold. */}
      <path d={STEM} fill="rgba(58,96,214,0.09)" />
      <path d={ARM_UP} fill="rgba(58,96,214,0.05)" />
      <path d={ARM_DOWN} fill="rgba(24,48,128,0.10)" />

      {/* Edges, so the planes read as cut rather than airbrushed. */}
      <g fill="none" stroke="rgba(147,169,239,0.20)" strokeWidth="0.3">
        <path d={STEM} />
        <path d={ARM_UP} />
        <path d={ARM_DOWN} />
      </g>

      {/* The lit edge — the stem's leading side and the underside of the
          upper arm, which is where the reference's neon line runs. */}
      <g fill="none" strokeLinecap="round" filter="url(#hero-mark-glow)">
        <path d="M0 0 L0 100" stroke="rgba(150,180,255,0.7)" strokeWidth="0.6" />
        <path d="M36 52 L60 0" stroke="rgba(120,155,255,0.4)" strokeWidth="0.45" />
      </g>
    </svg>
  );
}
