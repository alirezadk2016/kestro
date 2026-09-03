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

/**
 * The two visible side faces of that plane extruded downwards by `h`.
 *
 * The plates used to be flat polygons with a 7% wash, and that is most of why
 * they read as sketches: a parallelogram with nothing under it is a shape, not
 * an object. Giving the near two faces a value each — the left catching more
 * light than the right, one implied source — is what turns the same outline
 * into something with a thickness you could pick up.
 *
 * Only the two near faces, because the far two are behind the top and drawing
 * them would only show through the wash.
 */
function slabSide(cx: number, cy: number, a: number, b: number, h: number) {
  const right = [cx + 2 * a, cy + a];
  const front = [cx + 2 * a - 2 * b, cy + a + b];
  const left = [cx - 2 * b, cy + b];

  return {
    left: `${left[0]},${left[1]} ${front[0]},${front[1]} ${front[0]},${front[1] + h} ${left[0]},${left[1] + h}`,
    right: `${front[0]},${front[1]} ${right[0]},${right[1]} ${right[0]},${right[1] + h} ${front[0]},${front[1] + h}`,
  };
}

/**
 * One solid object: an isometric top with two lit sides, drawn so that what is
 * in front hides what is behind it.
 *
 * The occlusion is the whole point of the component. Every face is laid down
 * twice — once filled with the page's own background, then again with the
 * wash on top. Without that first pass the washes are translucent, nothing
 * ever covers anything, and four machines standing in a row turn into a single
 * lattice of overlapping outlines. That is exactly what the fleet plate looked
 * like, and no amount of extra detail would have fixed it, because the fault
 * was that the drawing had no depth order at all.
 *
 * #0b1426 is the site background and the panel behind both places these are
 * used, so the base pass reads as opaque in each of them.
 *
 * The left face is lighter than the right: one implied source, up and to the
 * left, the same as every other drawing on the site.
 */
function Slab({
  x,
  y,
  a,
  b,
  h,
  top = 0.09,
  fade = 1,
}: {
  x: number;
  y: number;
  a: number;
  b: number;
  h: number;
  /** How lit the top face is. Nearer objects take a higher value. */
  top?: number;
  /**
   * How far back this object sits, 1 being nearest.
   *
   * It has to be a property rather than an `opacity` class on a wrapper, and
   * the reason is the whole point of the component. A group opacity applies to
   * everything inside it — including the base pass whose only job is to be
   * opaque — so wrapping a faded slab in `<g className="opacity-70">` makes it
   * stop occluding at exactly the moment it is meant to. The fleet plate did
   * that to four machines in a row and you could see straight through three of
   * them. Here the fade is applied to the appearance and never to the pass
   * underneath it.
   */
  fade?: number;
}) {
  const face = slabSide(x, y, a, b, h);
  const points = plane(x, y, a, b);

  return (
    <>
      {/* The base pass: solid, so this object covers whatever it stands in
          front of. Never faded. */}
      <polygon points={points} className="fill-brand-950" stroke="none" />
      <polygon points={face.left} className="fill-brand-950" stroke="none" />
      <polygon points={face.right} className="fill-brand-950" stroke="none" />

      {/* The lit pass, and the outline. This is what distance dims. */}
      <g opacity={fade}>
        <polygon points={points} fill={`rgb(102 144 249 / ${top})`} stroke="none" />
        <polygon points={face.left} fill={`rgb(102 144 249 / ${top * 1.9})`} stroke="none" />
        <polygon points={face.right} fill={`rgb(102 144 249 / ${top * 0.55})`} stroke="none" />

        <polygon points={points} />
        <polygon points={face.left} />
        <polygon points={face.right} />
      </g>
    </>
  );
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
  /*
   * Memory and storage: a SO-DIMM with its contact comb, and an M.2 stick set
   * back behind it. The two objects the cluster is actually about — the old
   * version was two blank parallelograms that could have been any flat things.
   */
  "memory-storage": (
    <>
      <g className="opacity-40">
        <Slab x={124} y={28} a={28} b={9} h={4} top={0.06} />
        <polygon points={plane(146, 39, 8, 5)} className="fill-brand-400/[0.18]" />
      </g>

      <Slab x={62} y={56} a={48} b={17} h={7} top={0.1} />

      {/* Three DRAM packages, stepped down the board's long axis. */}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <polygon
            points={plane(76 + i * 25, 71 + i * 12.5, 10, 6)}
            className="fill-brand-400/[0.22]"
          />
          <polygon points={plane(76 + i * 25, 71 + i * 12.5, 10, 6)} />
        </g>
      ))}

      {/* The contact fingers along the near edge. The accent is spent here
          because this is the part the cluster is named after. */}
      <g className="stroke-brand-300 opacity-90">
        {Array.from({ length: 13 }, (_, i) => (
          <line key={i} x1={32 + i * 7.4} y1={75 + i * 3.7} x2={35 + i * 7.4} y2={82 + i * 3.7} />
        ))}
      </g>
      <path d="M75 96.5l5 2.5 4-2 -5-2.5z" className="fill-brand-950 stroke-brand-300" />
    </>
  ),

  /*
   * Lifecycle: a fleet along a run of time. Four machines standing, the fifth
   * dashed because it is the one due, and the span measured underneath with
   * the cut-off standing on it.
   */
  lifecycle: (
    <>
      {/* Furthest first, so each machine covers the one behind it — and the
          distance fade goes through the slab rather than around it, or the
          covering stops working. */}
      {[3, 2, 1, 0].map((i) => (
        <Slab
          key={i}
          x={30 + i * 34}
          y={40 + i * 8}
          a={15}
          b={9}
          h={12}
          top={0.11}
          fade={[1, 0.85, 0.7, 0.55][i]}
        />
      ))}

      {/* The one that is due. Dashed, and the only thing in accent.
          Clear of the last machine rather than overlapping it: a ghost drawn
          through a solid reads as a mistake, not as a plan. */}
      <g className="stroke-brand-300 opacity-90">
        <polygon points={plane(180, 76, 15, 9)} strokeDasharray="4 3" />
        <polygon points={slabSide(180, 76, 15, 9, 12).left} strokeDasharray="4 3" />
      </g>

      <g className="opacity-55">
        <line x1="16" y1="132" x2="208" y2="132" />
        <line x1="16" y1="126" x2="16" y2="138" />
        <line x1="208" y1="126" x2="208" y2="138" />
      </g>
      <g className="stroke-brand-300">
        <line x1="174" y1="110" x2="174" y2="132" />
        <circle cx="174" cy="132" r="3.5" className="fill-brand-300" />
      </g>
    </>
  ),

  /*
   * Workplace hardware: the three things on a desk — a screen standing
   * behind, an open machine in front of it, a dock beside — wired together.
   * The screen is drawn flat-on so the plate is not a fourth isometric slab.
   */
  "workplace-hardware": (
    <>
      <rect x="108" y="22" width="88" height="54" className="fill-brand-950" stroke="none" />
      <rect x="108" y="22" width="88" height="54" className="fill-brand-400/[0.10]" />
      <rect x="108" y="22" width="88" height="54" />
      <line x1="108" y1="68" x2="196" y2="68" className="opacity-45" />
      <line x1="152" y1="76" x2="152" y2="88" className="opacity-70" />
      <line x1="134" y1="88" x2="170" y2="88" className="opacity-70" />

      <Slab x={34} y={82} a={30} b={14} h={5} top={0.1} />
      {/* Keys, as a block of hatching rather than drawn one at a time. */}
      <g className="opacity-35">
        {Array.from({ length: 5 }, (_, i) => (
          <line key={i} x1={24 + i * 9} y1={93 + i * 4.5} x2={46 + i * 9} y2={104 + i * 4.5} />
        ))}
      </g>

      <Slab x={100} y={104} a={16} b={7} h={6} top={0.15} />
      <g className="stroke-brand-300 opacity-85">
        <path d="M90 103h4a6 6 0 006-6" />
        <path d="M132 112h12a8 8 0 008-8V88" />
      </g>
    </>
  ),

  /*
   * Buying and condition: the object, and the detail somebody inspects. A
   * leader runs from the mark on the lid to an enlarged view of the same mark,
   * and the grade it comes out as sits underneath with one step filled.
   */
  "buying-condition": (
    <>
      <Slab x={30} y={44} a={40} b={17} h={6} top={0.1} />
      {/* The mark on the lid the callout is about. */}
      <g className="opacity-45">
        <line x1="56" y1="58" x2="70" y2="65" />
        <line x1="61" y1="54" x2="72" y2="60" />
      </g>

      <line x1="74" y1="62" x2="124" y2="46" className="opacity-40" strokeDasharray="3 3" />

      <g className="text-brand-300">
        <circle cx="158" cy="54" r="30" className="fill-brand-950" stroke="none" />
        <circle cx="158" cy="54" r="30" className="fill-brand-400/[0.08]" />
        <circle cx="158" cy="54" r="30" />
        {/* The same mark, enlarged — which is what the circle is for.
            Uneven lengths and slightly different angles: three parallel
            strokes of one length read as a menu glyph, not as wear on a
            surface. Scuffing is irregular, so the drawing has to be. */}
        <g className="opacity-85">
          <line x1="139" y1="60" x2="177" y2="47" />
          <line x1="145" y1="67" x2="166" y2="60" />
          <line x1="141" y1="51" x2="172" y2="40" />
          <line x1="152" y1="43" x2="163" y2="39" className="opacity-70" />
        </g>
      </g>

      {/* The grade it comes out as. Three steps, one of them the answer. */}
      <g className="opacity-75">
        <rect x="30" y="114" width="22" height="11" />
        <rect x="56" y="114" width="22" height="11" className="fill-brand-300 stroke-brand-300" />
        <rect x="82" y="114" width="22" height="11" />
      </g>
    </>
  ),

  /*
   * Outside the clusters: a sheet with one part drawn on it, filed and not
   * built on. It stays the quietest plate of the five — that is what it
   * means — but four elements was an empty card rather than a quiet one.
   */
  "uden-klynge": (
    <>
      <g className="opacity-40">
        <path d="M40 34h104l16 16v76H40z" strokeDasharray="5 4" />
        <path d="M144 34v16h16" strokeDasharray="5 4" />
      </g>
      {/* The part: drawn, but left flat and dashed where the other three
          clusters got solids — the cluster is the one nothing is built on, and
          the drawing says so by not being built either.
          The wash needs stroke="none" or it lays a solid outline over the same
          path and the dashes never show: the plate looked finished, which is
          the one thing this one must not look. */}
      <g className="opacity-75">
        <polygon points={plane(78, 60, 26, 12)} className="fill-brand-950" stroke="none" />
        <polygon points={plane(78, 60, 26, 12)} className="fill-brand-400/[0.08]" stroke="none" />
        <polygon points={plane(78, 60, 26, 12)} strokeDasharray="4 3" />
      </g>
      {/* Ruled lines where a description would go, left blank. Clear of the
          part above them, which the first version ran straight through. */}
      <g className="opacity-25">
        <line x1="54" y1="100" x2="146" y2="100" />
        <line x1="54" y1="110" x2="120" y2="110" />
      </g>
      {/* Set aside. */}
      <g className="opacity-45">
        <line x1="174" y1="80" x2="196" y2="80" strokeDasharray="4 3" />
        <circle cx="199" cy="80" r="3.5" />
      </g>
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
