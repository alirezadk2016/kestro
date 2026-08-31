import type { Cluster } from "@/lib/guides";

/*
 * The plates — the Viden hub's own graphic language.
 *
 * Kept out of ClusterMark on purpose: that component is the small mark used on
 * article pages, and these are large drawings used only on the hub. Changing
 * one to serve both would have altered eight article pages to redesign one hub.
 *
 * The drawing is an engineering plate, not an illustration: orthographic,
 * 1.25 stroke, one accent, no gradient and no shadow. Depth comes from stacked
 * planes and from opacity falling off with distance — the same way a technical
 * exploded view reads. Everything is inline SVG, so it is about a kilobyte, it
 * needs no request, it is sharp at any size and it is on screen before
 * JavaScript is. Nothing here is decorative enough to need WebGL, which would
 * cost ~800 kB measured.
 *
 * All of it is aria-hidden. Every plate sits beside text that says the same
 * thing; a screen reader gaining "three stacked parallelograms" would be noise.
 */

/** An isometric plane. 2:1 projection, the flattest one that still reads as depth. */
function plane(cx: number, cy: number, a: number, b: number) {
  return `${cx},${cy} ${cx + 2 * a},${cy + a} ${cx + 2 * a - 2 * b},${cy + a + b} ${cx - 2 * b},${cy + b}`;
}

/*
 * The hero: a machine taken apart and held in the air, the way a service
 * manual draws one. Three planes, separated vertically, with the dimension
 * lines and the leader dots that make a drawing read as measured rather than
 * sketched.
 */
export function VidenHeroPlate({ className = "" }: { className?: string }) {
  const layers = [
    { y: 40, opacity: "opacity-90", grid: true },
    { y: 130, opacity: "opacity-60", grid: false },
    { y: 220, opacity: "opacity-35", grid: false },
  ];

  return (
    <svg
      viewBox="0 0 1200 460"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      aria-hidden="true"
      focusable="false"
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Ground grid, fading out — the sheet the drawing sits on. */}
      <g className="opacity-[0.07]">
        {Array.from({ length: 15 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 32} x2="1200" y2={i * 32} />
        ))}
        {Array.from({ length: 25 }, (_, i) => (
          <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="460" />
        ))}
      </g>

      {layers.map((layer, i) => (
        <g key={layer.y} className={layer.opacity}>
          <polygon points={plane(600, layer.y, 150, 120)} />
          {/* Vertical ties between layers: what makes it exploded, not stacked. */}
          {i < layers.length - 1 && (
            <>
              <line
                x1="600"
                y1={layer.y}
                x2="600"
                y2={layers[i + 1].y}
                strokeDasharray="2 5"
                className="opacity-60"
              />
              <line
                x1="900"
                y1={layer.y + 150}
                x2="900"
                y2={layers[i + 1].y + 150}
                strokeDasharray="2 5"
                className="opacity-60"
              />
            </>
          )}
          {layer.grid && (
            <g className="opacity-45">
              {[0.25, 0.5, 0.75].map((t) => (
                <line
                  key={t}
                  x1={600 + 2 * 150 * t}
                  y1={layer.y + 150 * t}
                  x2={600 + 2 * 150 * t - 2 * 120}
                  y2={layer.y + 150 * t + 120}
                />
              ))}
            </g>
          )}
        </g>
      ))}

      {/* Dimension line down the left edge, with end ticks. */}
      <g className="opacity-40">
        <line x1="300" y1="60" x2="300" y2="360" />
        <line x1="292" y1="60" x2="308" y2="60" />
        <line x1="292" y1="360" x2="308" y2="360" />
      </g>

      {/* Leader dots: three points of interest, annotated the way a plate is. */}
      <g className="text-brand-300">
        {[
          { x: 600, y: 40 },
          { x: 780, y: 220 },
          { x: 480, y: 310 },
        ].map((p) => (
          <g key={`${p.x}-${p.y}`}>
            <circle cx={p.x} cy={p.y} r="4" className="fill-brand-300 stroke-brand-300" />
            <circle cx={p.x} cy={p.y} r="12" className="opacity-40" />
          </g>
        ))}
      </g>
    </svg>
  );
}

/*
 * One plate per cluster, framed.
 *
 * Larger and more deliberate than the inline ClusterMark: a corner frame, an
 * index number and the drawing itself, so the hub's four topics read as four
 * plates in a folder rather than four icons in a grid.
 */
const drawings: Record<Cluster, React.ReactNode> = {
  /* Memory: two boards, one behind the other, contacts and notch implied. */
  "memory-storage": (
    <>
      <polygon points={plane(96, 44, 46, 22)} className="fill-brand-400/[0.07]" />
      <polygon points={plane(96, 44, 46, 22)} />
      <g className="opacity-70">
        <line x1="112" y1="52" x2="128" y2="60" />
        <line x1="130" y1="61" x2="146" y2="69" />
        <line x1="148" y1="70" x2="164" y2="78" />
      </g>
      <polygon points={plane(80, 92, 46, 22)} className="fill-brand-400/[0.12]" />
      <polygon points={plane(80, 92, 46, 22)} />
      <g className="opacity-45">
        {Array.from({ length: 7 }, (_, i) => (
          <line key={i} x1={70 + i * 12} y1={106 + i * 6} x2={66 + i * 12} y2={116 + i * 6} />
        ))}
      </g>
    </>
  ),
  /* Lifecycle: a run of time, a hard stop, and the dashed part after it. */
  lifecycle: (
    <>
      <line x1="24" y1="120" x2="200" y2="120" className="opacity-50" />
      <line x1="24" y1="112" x2="24" y2="128" className="opacity-50" />
      <line x1="200" y1="112" x2="200" y2="128" className="opacity-50" />
      <polygon points={plane(40, 44, 40, 20)} className="fill-brand-400/[0.10]" />
      <polygon points={plane(40, 44, 40, 20)} />
      <polygon points={plane(140, 44, 40, 20)} strokeDasharray="4 4" className="opacity-60" />
      <g className="text-brand-300">
        <line x1="120" y1="26" x2="120" y2="120" />
        <path d="M113 36l7-11 7 11" />
        <circle cx="120" cy="120" r="4" className="fill-brand-300 stroke-brand-300" />
      </g>
    </>
  ),
  /* Workplace: one machine feeding two panels and a line onward. */
  "workplace-hardware": (
    <>
      <polygon points={plane(48, 96, 34, 18)} className="fill-brand-400/[0.07]" />
      <polygon points={plane(48, 96, 34, 18)} />
      <rect x="112" y="28" width="76" height="50" className="fill-brand-400/[0.12]" />
      <rect x="112" y="28" width="76" height="50" />
      <line x1="150" y1="78" x2="150" y2="94" className="opacity-60" />
      <line x1="126" y1="94" x2="174" y2="94" className="opacity-60" />
      <rect x="112" y="102" width="34" height="24" strokeDasharray="4 4" className="opacity-55" />
      <g className="text-brand-300">
        <path d="M96 88h16" />
        <path d="M104 66h8a6 6 0 016 6v16" />
      </g>
    </>
  ),
  /* Buying and condition: an object under inspection, one detail enlarged. */
  "buying-condition": (
    <>
      <polygon points={plane(40, 60, 40, 24)} className="fill-brand-400/[0.07]" />
      <polygon points={plane(40, 60, 40, 24)} />
      <g className="opacity-45">
        <line x1="60" y1="70" x2="76" y2="78" />
        <line x1="80" y1="80" x2="96" y2="88" />
      </g>
      <g className="text-brand-300">
        <circle cx="146" cy="70" r="30" className="fill-brand-400/[0.10]" />
        <circle cx="146" cy="70" r="30" />
        <line x1="168" y1="92" x2="190" y2="118" />
        <path d="M134 70l9 9 16-19" />
      </g>
    </>
  ),
  /* Outside the clusters: an object set aside, drawn but not built on. */
  "uden-klynge": (
    <>
      <polygon points={plane(52, 66, 38, 22)} strokeDasharray="4 4" className="opacity-55" />
      <line x1="150" y1="86" x2="196" y2="86" strokeDasharray="4 4" className="opacity-45" />
      <circle cx="196" cy="86" r="4" className="opacity-45" />
    </>
  ),
};

export function VidenClusterPlate({
  cluster,
  index,
  className = "",
}: {
  cluster: Cluster;
  /** Shown in the index grid only. Inside a cluster the numbers on the right
      count articles, and two different counts in the same glyph read as one. */
  index?: string;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      {/* Corner frame — a drawing in a folder, not an icon in a box. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border border-white/10"
        style={{
          clipPath:
            "polygon(0 0, 34% 0, 34% 1.5px, 1.5px 1.5px, 1.5px 34%, 0 34%, 0 66%, 1.5px 66%, 1.5px calc(100% - 1.5px), 34% calc(100% - 1.5px), 34% 100%, 0 100%)",
        }}
      />
      <svg
        viewBox="0 0 224 150"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="square"
        aria-hidden="true"
        focusable="false"
        className="w-full text-brand-300/75"
      >
        {index && (
          <text
            x="14"
            y="26"
            className="fill-paper/25 font-mono text-[13px]"
            stroke="none"
            style={{ letterSpacing: "0.14em" }}
          >
            {index}
          </text>
        )}
        {drawings[cluster]}
      </svg>
    </div>
  );
}
