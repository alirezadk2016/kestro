/*
 * The drafting sheet the Viden hub is laid on.
 *
 * What used to be here was a set of line drawings standing in for photography.
 * The section now shows real renders of the machine the site already models —
 * see scripts/render-viden-stills.mjs — so the drawing's job is smaller and
 * more honest: a faint measured grid behind the render, with the dimension line
 * and register marks that make a page read as a technical document rather than
 * as a blog.
 *
 * Inline SVG: about a kilobyte, no request, sharp at any size, inherits
 * currentColor, and on screen before JavaScript is. aria-hidden throughout —
 * it carries no information the text does not.
 */
export function VidenHeroPlate({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 460"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      aria-hidden="true"
      focusable="false"
      className={className}
      preserveAspectRatio="xMidYMid slice"
    >
      <g className="opacity-[0.55]">
        {Array.from({ length: 15 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 32} x2="1200" y2={i * 32} />
        ))}
        {Array.from({ length: 25 }, (_, i) => (
          <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="460" />
        ))}
      </g>

      {/* Dimension line with end ticks, and register marks in two corners. */}
      <g className="opacity-90">
        <line x1="80" y1="70" x2="80" y2="390" />
        <line x1="72" y1="70" x2="88" y2="70" />
        <line x1="72" y1="390" x2="88" y2="390" />
        <path d="M40 40h34M40 40v34" />
        <path d="M1160 420h-34M1160 420v-34" />
      </g>
    </svg>
  );
}
