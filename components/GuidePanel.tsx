import Image from "next/image";
import type { Lang, Localized } from "@/lib/i18n";

/*
 * The guide panels — Kestro's illustration system for Viden.
 *
 * These replace GuidePlate, which was the same idea at a tenth of the size:
 * 124×84 line drawings beside a title. At that size a drawing can hold one
 * shape and nothing else — no label, no instrument, no light — so what was
 * meant as an illustration system arrived as eight small icons. This is the
 * same subject matter drawn at the size the work actually needs.
 *
 * One panel is 768×512. That is not an arbitrary box: it is the size the
 * reference sheets are drawn at, which means the type inside a panel is set at
 * the size it is read at, rather than at a size that halves on the way to the
 * screen.
 *
 * Every panel is built from the same kit — frame, blueprint ground, numbered
 * eyebrow, corner straplines, callout chips, leader nodes, one lamp above and
 * to the left — so eight subjects read as eight plates from one system rather
 * than eight drawings by one hand. That is the whole point of the exercise:
 * a visitor should recognise a Kestro panel without the logo on it.
 *
 * Still inline SVG and still CSS. No canvas, no WebGL, no image request, no
 * client bundle: the panels render in a server component, are on screen before
 * JavaScript is, and hold a fixed aspect so nothing shifts as they paint.
 * Animation is one idea per panel over 12–16 seconds, and all of it sits
 * inside prefers-reduced-motion: no-preference.
 */

/* The palette, from tailwind.config.ts. Written out because SVG gradients and
   filters cannot take a Tailwind class. */
const C = {
  ink: "#0B1426",
  panel: "#0E1830",
  line: "#93AEFB",
  accent: "#6690F9",
  bright: "#BECFFD",
  paper: "#DCE4FE",
  deep: "#3B82F6",
};

/* ------------------------------------------------------------------- chrome */

/**
 * The materials and the light. One <defs> per panel, ids namespaced, because
 * eight of these share a document and the second one would silently take the
 * first one's gradient.
 */
function Defs({ id }: { id: string }) {
  return (
    <defs>
      {/* Bloom. The single thing that separates a rendered panel from a
          wireframe: light that spills past the edge of the thing emitting it. */}
      <filter id={`${id}-bloom`} x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="7" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id={`${id}-soft`} x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="16" />
      </filter>

      {/* The air in the room, behind the subject. */}
      {/* The room. Lifted hard from a 0.22 hint to something the subject
          actually stands in: beside a rendered plate the earlier value read as
          an unlit wireframe rather than as a lit object. */}
      <radialGradient id={`${id}-air`} cx="0.5" cy="0.44" r="0.62">
        <stop offset="0%" stopColor="#2E6BF0" stopOpacity="0.42" />
        <stop offset="45%" stopColor="#1E40FF" stopOpacity="0.16" />
        <stop offset="100%" stopColor={C.ink} stopOpacity="0" />
      </radialGradient>

      {/* A lit surface seen at three angles to one lamp above and to the left. */}
      <linearGradient id={`${id}-top`} x1="0" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stopColor="#B9D0FF" stopOpacity="0.62" />
        <stop offset="55%" stopColor="#4B79E8" stopOpacity="0.34" />
        <stop offset="100%" stopColor="#26407F" stopOpacity="0.26" />
      </linearGradient>
      <linearGradient id={`${id}-side`} x1="0" y1="0" x2="0.2" y2="1">
        <stop offset="0%" stopColor="#4E7CE0" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#162C63" stopOpacity="0.55" />
      </linearGradient>
      <linearGradient id={`${id}-dark`} x1="0" y1="0" x2="0.3" y2="1">
        <stop offset="0%" stopColor="#1E3466" stopOpacity="0.55" />
        <stop offset="100%" stopColor="#0D1A38" stopOpacity="0.65" />
      </linearGradient>

      {/* What a screen does to the air in front of it. */}
      <linearGradient id={`${id}-screen`} x1="0" y1="0" x2="0.35" y2="1">
        <stop offset="0%" stopColor="#B7CEFF" stopOpacity="0.5" />
        <stop offset="55%" stopColor={C.deep} stopOpacity="0.30" />
        <stop offset="100%" stopColor="#14275A" stopOpacity="0.40" />
      </linearGradient>

      {/* The pool of light an object stands in, and the streak it throws down
          the ground plane. A mirrored copy of the subject would double the DOM
          for every panel on the page; this says the same thing for four nodes. */}
      <radialGradient id={`${id}-pool`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0%" stopColor="#6FA0FF" stopOpacity="0.6" />
        <stop offset="55%" stopColor="#4B79E8" stopOpacity="0.22" />
        <stop offset="100%" stopColor="#5B8CFF" stopOpacity="0" />
      </radialGradient>
      <linearGradient id={`${id}-streak`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#8FB6FF" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#8FB6FF" stopOpacity="0" />
      </linearGradient>

      {/* The chip's own surface: dark glass, lighter along its top edge. */}
      <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1B2C55" stopOpacity="0.96" />
        <stop offset="100%" stopColor="#0D1732" stopOpacity="0.94" />
      </linearGradient>

      {/* A signal running along a wire, brightest at its head. */}
      <linearGradient id={`${id}-sweep`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor={C.deep} stopOpacity="0" />
        <stop offset="65%" stopColor={C.accent} stopOpacity="0.55" />
        <stop offset="100%" stopColor="#E6EDFF" stopOpacity="0.95" />
      </linearGradient>
    </defs>
  );
}

/**
 * The sheet every subject is drawn on.
 *
 * Blueprint grid, a few circuit traces, the ground plane in perspective and
 * the frame. Identical on all eight panels — it is what makes them a set.
 */
function Sheet({ id }: { id: string }) {
  return (
    <>
      <rect x="0" y="0" width="768" height="512" fill={C.ink} />
      <rect x="0" y="0" width="768" height="512" fill={`url(#${id}-air)`} />

      {/* Blueprint grid. Faint enough to be a surface, not a pattern. */}
      <g stroke={C.line} strokeWidth="0.75" opacity="0.075">
        {Array.from({ length: 24 }, (_, i) => (
          <line key={`v${i}`} x1={i * 32} y1="0" x2={i * 32} y2="512" />
        ))}
        {Array.from({ length: 16 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 32} x2="768" y2={i * 32} />
        ))}
      </g>

      {/* Traces. A board under the drawing, not a decoration on top of it. */}
      <g stroke={C.line} strokeWidth="1" fill="none" opacity="0.13">
        <path d="M0 128h84l24 24v72h56" />
        <path d="M768 160h-96l-28 28v96" />
        <path d="M0 416h120l32-32h72" />
        <path d="M768 392h-140l-24 24H520" />
        <path d="M96 0v56l24 24v48" />
        <path d="M652 512v-64l-24-24v-40" />
      </g>
      <g fill={C.line} opacity="0.16">
        {[
          [164, 224],
          [644, 284],
          [224, 384],
          [520, 416],
          [120, 128],
        ].map(([x, y]) => (
          <rect key={`${x}-${y}`} x={x - 2.5} y={y - 2.5} width="5" height="5" />
        ))}
      </g>

      {/* The ground: a plane running away from the reader. The subject stands
          on it, which is what stops the drawing floating in nothing. */}
      <g opacity="0.5">
        <g stroke={C.line} strokeWidth="0.8" opacity="0.13">
          {Array.from({ length: 13 }, (_, i) => (
            <line key={`g${i}`} x1={-260 + i * 110} y1="512" x2={230 + i * 26} y2="360" />
          ))}
          {[364, 380, 400, 428, 464, 508].map((y, i) => (
            <line key={y} x1="0" y1={y} x2="768" y2={y} opacity={0.35 + i * 0.13} />
          ))}
        </g>
      </g>

      {/* The frame, with the corner ticks a drawing sheet carries. */}
      <rect
        x="16"
        y="16"
        width="736"
        height="480"
        fill="none"
        stroke={C.line}
        strokeOpacity="0.18"
        strokeWidth="1"
      />
      <g stroke={C.accent} strokeOpacity="0.75" strokeWidth="1.6">
        <path d="M16 44V16h28M724 16h28v28M752 468v28h-28M44 496H16v-28" fill="none" />
      </g>
    </>
  );
}

/** The numbered eyebrow and the two corner straplines. */
function Caption({
  num,
  category,
  left,
  right,
}: {
  num: string;
  category: string;
  left: string[];
  right: string[];
}) {
  return (
    <>
      <text x="42" y="66" fontSize="34" fontWeight="300" fill={C.accent} letterSpacing="1">
        {num}
      </text>
      {/* The category and the straplines go with the chip labels below sm:
          a 10px letterform in a panel rendered at 356px is 4.6 CSS pixels,
          which is texture, not type. The numeral survives — it is 34px, so it
          lands near 16 even there. */}
      <text
        x="43"
        y="88"
        fontSize="10.5"
        fontWeight="500"
        fill={C.line}
        fillOpacity="0.8"
        letterSpacing="5.4"
        className="gv-lbl"
      >
        {category}
      </text>

      <g className="gv-lbl"
         fontSize="10"
         fontWeight="500"
         fill={C.bright}
         fillOpacity="0.42"
         letterSpacing="3.1">
        {left.map((l, i) => (
          <text key={l} x="42" y={430 + i * 15}>
            {l}
          </text>
        ))}
        {right.map((l, i) => (
          <text key={l} x="726" y={445 + i * 15} textAnchor="end">
            {l}
          </text>
        ))}
      </g>
    </>
  );
}

/* ---------------------------------------------------------------------- kit */

/** The small line glyphs that sit in a chip's icon box. 20×20, drawn at 0,0. */
const glyphs = {
  screen: "M2 4h16v10H2zM7 17h6",
  keyboard: "M1 5h18v10H1zM4 8h1M7 8h1M10 8h1M13 8h1M16 8h1M6 12h8",
  ports: "M2 7h6v6H2zM12 6h6v8h-6zM14 6V4h2v2",
  battery: "M2 6h13v8H2zM15 8h2v4h-2M4 8h6v4H4z",
  chipIcon: "M5 5h10v10H5zM8 2v3M12 2v3M8 15v3M12 15v3M2 8h3M2 12h3M15 8h3M15 12h3",
  camera: "M10 6a4 4 0 100 8 4 4 0 000-8zM2 4h16v12H2zM5 2h4",
  drive: "M2 4h16v12H2zM5 13h4M14 13h1",
  cpu: "M6 6h8v8H6zM9 2v4M12 2v4M9 14v4M12 14v4M2 9h4M2 12h4M14 9h4M14 12h4",
  shield: "M10 2l7 3v5c0 5-3 7-7 8-4-1-7-3-7-8V5z",
  gauge: "M2 14a8 8 0 0116 0M10 14l5-5",
  box: "M10 2l8 4v8l-8 4-8-4V6zM2 6l8 4 8-4M10 10v8",
  arrows: "M3 7h11l-3-3M17 13H6l3 3",
} as const;

/**
 * A callout chip: icon, label, state note and a progress bar.
 *
 * The defining element of the system. A panel without them is a picture of a
 * machine; a panel with them is an instrument reading one.
 */
function Chip({
  id,
  x,
  y,
  label,
  note,
  glyph,
  cls = "",
  w = 176,
}: {
  id: string;
  x: number;
  y: number;
  label: string;
  note?: string;
  glyph: keyof typeof glyphs;
  /** Animation class for the bar and the mark. */
  cls?: string;
  w?: number;
}) {
  const h = note ? 52 : 38;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="6" fill={`url(#${id}-glass)`} />
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="6"
        fill="none"
        stroke={C.accent}
        strokeOpacity="0.6"
        strokeWidth="1.2"
      />
      {/* Lit along the top edge, like every other surface here. */}
      <path
        d={`M${x + 6} ${y + 0.5}H${x + w - 6}`}
        stroke="#FFFFFF"
        strokeOpacity="0.3"
        strokeWidth="1.2"
      />

      <rect
        x={x + 10}
        y={y + (h - 28) / 2}
        width="28"
        height="28"
        rx="4"
        fill={C.deep}
        fillOpacity="0.1"
        stroke={C.accent}
        strokeOpacity="0.55"
      />
      <g transform={`translate(${x + 14} ${y + (h - 28) / 2 + 4})`}>
        <path
          d={glyphs[glyph]}
          fill="none"
          stroke="#CFE0FF"
          strokeOpacity="0.95"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      <text
        x={x + 48}
        y={note ? y + 21 : y + 24}
        fontSize="11.5"
        fontWeight="600"
        fill={C.paper}
        letterSpacing="1.1"
        className="gv-lbl"
      >
        {label}
      </text>
      {note && (
        <>
          <text
            x={x + 48}
            y={y + 35}
            fontSize="9.5"
            fill={C.line}
            fillOpacity="0.7"
            letterSpacing="0.6"
            className="gv-lbl"
          >
            {note}
          </text>
          <rect x={x + 48} y={y + 41} width={w - 62} height="3" rx="1.5" fill={C.line} fillOpacity="0.22" />
          <rect
            x={x + 48}
            y={y + 41}
            width={w - 62}
            height="3"
            rx="1.5"
            fill={C.accent}
            className={`gv-bar ${cls}`}
            style={{ transformOrigin: `${x + 48}px ${y + 42.5}px` }}
          />
        </>
      )}
      {/* The mark that lands when the reading finishes. */}
      <g className={`gv-tick ${cls}`} style={{ transformOrigin: `${x + w - 18}px ${y + h / 2}px` }}>
        <path
          d={`M${x + w - 24} ${y + h / 2} l4 4 7-8`}
          fill="none"
          stroke="#9EC2FF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </g>
  );
}

/** A node on the subject, with the hairline that runs to its chip. */
function Leader({
  d,
  cx,
  cy,
  cls = "",
}: {
  d: string;
  cx: number;
  cy: number;
  cls?: string;
}) {
  return (
    <g className={cls}>
      <path d={d} fill="none" stroke={C.line} strokeOpacity="0.4" strokeWidth="1" />
      <circle cx={cx} cy={cy} r="4.5" fill={C.ink} stroke={C.accent} strokeWidth="1.4" />
      <circle cx={cx} cy={cy} r="2" fill="#CFE0FF" />
    </g>
  );
}

/** The pool of light and the streak beneath an object standing on the ground. */
function Contact({ id, cx, cy, rx = 150 }: { id: string; cx: number; cy: number; rx?: number }) {
  return (
    <>
      <ellipse cx={cx} cy={cy} rx={rx} ry={rx * 0.16} fill={`url(#${id}-pool)`} />
      <rect x={cx - rx * 0.34} y={cy} width={rx * 0.68} height="66" fill={`url(#${id}-streak)`} opacity="0.5" />
    </>
  );
}

/**
 * A business laptop, open, seen three-quarters on.
 *
 * The one object most of these panels need, so it is drawn once and placed.
 * Deck and lid share the hinge edge rather than nearly meeting at it.
 */
function Laptop({
  id,
  x = 0,
  y = 0,
  scale = 1,
  screen,
}: {
  id: string;
  x?: number;
  y?: number;
  scale?: number;
  /** Whatever is showing on the display. */
  screen?: React.ReactNode;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {/*
       * Lid and deck share the hinge edge and taper the same way.
       *
       * The first pass had the lid widening as it rose — ±86 at the hinge and
       * ±112 at the top — while the deck widened towards the reader. Two
       * opposite vanishing directions in one object, which read as a screen
       * mounted upside down. Everything now runs to one point behind the
       * machine: the deck is widest at the front edge, the lid narrowest at
       * the top.
       */}
      <polygon points="-118,58 118,58 102,-106 -102,-106" fill={C.ink} />
      <polygon points="-118,58 118,58 102,-106 -102,-106" fill={`url(#${id}-screen)`} />
      <polygon
        points="-118,58 118,58 102,-106 -102,-106"
        fill="none"
        stroke="#B9D0FF"
        strokeOpacity="0.8"
        strokeWidth="1.7"
      />
      <clipPath id={`${id}-lid`}>
        <polygon points="-110,52 110,52 96,-100 -96,-100" />
      </clipPath>
      <g clipPath={`url(#${id}-lid)`}>{screen}</g>

      {/* Deck. */}
      <polygon points="-118,58 118,58 168,112 -168,112" fill={C.ink} />
      <polygon points="-118,58 118,58 168,112 -168,112" fill={`url(#${id}-top)`} />
      <polygon points="-168,112 168,112 168,121 -168,121" fill={`url(#${id}-dark)`} />
      <polygon
        points="-118,58 118,58 168,112 -168,112"
        fill="none"
        stroke="#B9D0FF"
        strokeOpacity="0.75"
        strokeWidth="1.6"
      />
      <path d="M-168 112h336v9h-336z" fill="none" stroke={C.line} strokeOpacity="0.5" strokeWidth="1.1" />

      {/* Keys and trackpad, as hatching rather than one key at a time. */}
      <g stroke={C.line} strokeOpacity="0.4" strokeWidth="1">
        {Array.from({ length: 5 }, (_, i) => (
          <line key={i} x1={-106 - i * 12} y1={68 + i * 8.8} x2={106 + i * 12} y2={68 + i * 8.8} />
        ))}
      </g>
      <rect x="-32" y="96" width="64" height="11" rx="2" fill="none" stroke={C.line} strokeOpacity="0.28" />
      {/* The hinge, catching the lamp. */}
      <path d="M-118 58h236" stroke="#E7EFFF" strokeOpacity="0.85" strokeWidth="2.2" />
    </g>
  );
}


/**
 * The Kestro mark, lit, for a machine that is switched on.
 *
 * The geometry is the one in Logo.tsx — a tapering stem, an arm and a fold —
 * repeated here rather than imported because that component ships its own
 * gradients, tones and ids for a wordmark, and none of that belongs inside a
 * laptop screen. If the mark ever changes, it changes in both places.
 */
function KMark({ id, scale = 1 }: { id: string; scale?: number }) {
  return (
    <g transform={`translate(${-57 * scale} ${-50 * scale}) scale(${scale})`} filter={`url(#${id}-bloom)`}>
      <path d="M0 0 H34 V44 L22 100 H0 Z" fill="#9CC0FF" fillOpacity="0.92" />
      <path d="M36 52 L60 0 H114 L67 52 Z" fill="#6C9DFF" fillOpacity="0.95" />
      <path d="M67 52 L114 100 H56 L36 52 Z" fill="#4B7FF0" fillOpacity="0.85" />
    </g>
  );
}

/* ------------------------------------------------------------------ panels */

type T = (l: Localized) => string;

type PanelDef = {
  num: string;
  category: Localized;
  /** The two corner straplines. Short, and true. */
  left: Localized[];
  right: Localized[];
  draw: (id: string, t: T) => React.ReactNode;
};

const da = (d: string, e: string): Localized => ({ da: d, en: e });

/*
 * A note on the text inside these panels.
 *
 * Every label names a thing the guide beside it actually discusses, and no
 * panel states a number, a price, a duration or a result. A chip reads
 * "Tester …" and then carries a mark; it never reads "98 %". An illustration
 * that invents a figure is a claim the company has to stand behind, and this
 * is the one place on the site where nobody would think to check.
 */
const panels: Record<string, PanelDef> = {
  /* ---------------------------------------------------------------- 01 */
  "reparere-eller-koebe-ny": {
    num: "01",
    category: da("BESLUTNING", "DECISION"),
    left: [da("ANALYSÉR", "ANALYSE"), da("SAMMENLIGN", "COMPARE"), da("BESLUT", "DECIDE")],
    right: [da("REGN PÅ DET", "DO THE ARITHMETIC"), da("FØR DU SKIFTER", "BEFORE YOU REPLACE")],
    draw: (id, t) => (
      <>
        <Contact id={id} cx={384} cy={356} rx={130} />
        <Laptop id={id} x={384} y={276} scale={0.6} screen={
          <>
            <rect x="-120" y="-110" width="240" height="176" fill={`url(#${id}-pool)`} opacity="0.55" />
            <KMark id={id} scale={0.62} />
          </>
        } />

        {/* The two roads out of the machine. Dashed, and running — the
            "small animated data lines" the system is built on. */}
        <g fill="none" strokeWidth="1.6" strokeDasharray="6 7">
          <path
            className="gv-flow"
            d="M330 268C270 268 250 224 218 200"
            stroke={C.accent}
            strokeOpacity="0.55"
          />
          <path
            className="gv-flow gv-flow-b"
            d="M438 268C498 268 518 224 550 200"
            stroke={C.accent}
            strokeOpacity="0.55"
          />
        </g>
        {/* The signal, which goes one way and then the other, because the
            answer genuinely does. */}
        {/* Its own halo rather than the panel's bloom filter: a filter region
            is a percentage of the element's own box, and on a ten-pixel circle
            that crops the blur into a visible square. */}
        <g className="gv-sig">
          <circle r="15" fill={C.accent} opacity="0.3" />
          <circle r="8" fill={C.accent} opacity="0.4" />
          <circle r="4.5" fill="#EAF1FF" />
        </g>

        <Chip id={id} x={42} y={148} w={176} glyph="arrows"
              label={t(da("REPARÉR", "REPAIR"))} note={t(da("Delpris mod værdi", "Part cost vs value"))}
              cls="gv-c0" />
        <Chip id={id} x={550} y={148} w={176} glyph="box"
              label={t(da("UDSKIFT", "REPLACE"))} note={t(da("Brugt til samme opgave", "Used, same job"))}
              cls="gv-c1" />

        {/* What the decision is actually made on. */}
        {[
          { x: 196, g: "gauge" as const, l: da("ALDER", "AGE") },
          { x: 366, g: "cpu" as const, l: da("YDELSE", "PERFORMANCE") },
          { x: 536, g: "battery" as const, l: da("SLIDDELE", "WEAR PARTS") },
        ].map((c, i) => (
          <Chip key={c.x} id={id} x={c.x} y={356} w={148} glyph={c.g} label={t(c.l)} cls={`gv-c${i}`} />
        ))}
      </>
    ),
  },

  /* ---------------------------------------------------------------- 02 */
  "opgrader-ram-i-baerbar": {
    num: "02",
    category: da("YDELSE", "PERFORMANCE"),
    left: [da("SMÅ OPGRADERINGER", "SMALL UPGRADES"), da("STORE FORSKELLE", "BIG DIFFERENCES")],
    right: [da("HURTIGERE", "FASTER"), da("MERE PLADS", "MORE ROOM"), da("KLAR TIL MERE", "READY FOR MORE")],
    draw: (id, t) => (
      <>
        <Contact id={id} cx={410} cy={372} rx={170} />

        {/* The board, and the empty slot in it. */}
        <g>
          <polygon points="248,300 572,300 640,372 180,372" fill={C.ink} />
          <polygon points="248,300 572,300 640,372 180,372" fill={`url(#${id}-top)`} />
          <polygon points="180,372 640,372 640,382 180,382" fill={`url(#${id}-dark)`} />
          <polygon points="248,300 572,300 640,372 180,372" fill="none" stroke={C.line} strokeOpacity="0.45" strokeWidth="1.3" />
          {/* Components on the board, so it is a board. */}
          <g fill={C.deep} fillOpacity="0.14" stroke={C.line} strokeOpacity="0.3">
            <polygon points="286,312 350,312 358,326 292,326" />
            <polygon points="470,312 540,312 552,326 480,326" />
            <polygon points="232,346 300,346 310,360 240,360" />
          </g>
          {/* The slot: a recess with the board's own contacts in it. */}
          <polygon points="300,334 520,334 540,358 316,358" fill="#060B18" stroke={C.line} strokeOpacity="0.4" />
          <g stroke={C.accent} strokeOpacity="0.35" strokeWidth="1">
            {Array.from({ length: 22 }, (_, i) => (
              <line key={i} x1={310 + i * 10} y1={340} x2={313 + i * 10} y2={352} />
            ))}
          </g>
        </g>

        {/*
         * The module, going in.
         *
         * Drawn at its seated position and lifted by the animation, not the
         * other way round: the first pass drew it a hundred pixels above the
         * board and called translateY(0) "seated", so the module hovered over
         * an empty socket for the whole hold and never went in at all.
         */}
        <g className="gv-mod">
          <g filter={`url(#${id}-bloom)`}>
            <polygon points="302,316 522,316 542,340 318,340" fill={C.ink} />
            <polygon points="302,316 522,316 542,340 318,340" fill={`url(#${id}-top)`} />
            <polygon points="318,340 542,340 542,352 318,352" fill={`url(#${id}-side)`} />
            <polygon points="302,316 522,316 542,340 318,340" fill="none" stroke={C.bright} strokeOpacity="0.6" strokeWidth="1.3" />
            {/* DRAM packages. */}
            <g fill={C.deep} fillOpacity="0.3" stroke={C.line} strokeOpacity="0.5">
              {[0, 1, 2, 3, 4].map((i) => (
                <polygon key={i} points={`${320 + i * 42},320 ${354 + i * 42},320 ${360 + i * 42},334 ${326 + i * 42},334`} />
              ))}
            </g>
            {/* The contact comb along the near edge — visible on the way in,
                inside the socket once it is down. */}
            <g stroke="#CFE0FF" strokeOpacity="0.75" strokeWidth="1.2" className="gv-pins">
              {Array.from({ length: 24 }, (_, i) => (
                <line key={i} x1={322 + i * 9} y1={352} x2={322 + i * 9} y2={362} />
              ))}
            </g>
          </g>
        </g>

        {/* The pulse when it seats: light running out along the board from the
            slot, rather than sparks at it. */}
        <g className="gv-pulse-streaks" stroke="#9EC2FF" strokeWidth="1.4">
          {Array.from({ length: 13 }, (_, i) => (
            <line key={i} x1={296 + i * 20} y1={306} x2={302 + i * 20} y2={334} strokeOpacity={0.12 + (i % 3) * 0.22} />
          ))}
        </g>

        <Chip id={id} x={42} y={150} w={196} glyph="chipIcon"
              label={t(da("HUKOMMELSE", "MEMORY"))} note={t(da("Modul på vej i", "Module going in"))}
              cls="gv-c0" />
        <Chip id={id} x={42} y={222} w={196} glyph="ports"
              label={t(da("SOKKEL", "SLOT"))} note={t(da("Kontakt sluttet", "Contact made"))}
              cls="gv-c1" />
        <Chip id={id} x={42} y={294} w={196} glyph="gauge"
              label={t(da("LÅST", "SEATED"))} note={t(da("Klar til brug", "Ready to use"))}
              cls="gv-c2" />
      </>
    ),
  },

  /* ---------------------------------------------------------------- 03 */
  "tjek-brugt-baerbar-foer-koeb": {
    num: "03",
    category: da("INSPEKTION", "INSPECTION"),
    left: [da("KVALITET", "QUALITY"), da("KONTROL", "CONTROL"), da("I HVER DETALJE", "IN EVERY DETAIL")],
    right: [da("SÅDAN SER MAN", "THIS IS HOW YOU"), da("EN MASKINE EFTER", "CHECK A MACHINE")],
    draw: (id, t) => (
      <>
        <Contact id={id} cx={384} cy={362} rx={150} />
        <Laptop
          id={id}
          x={384}
          y={258}
          scale={0.82}
          screen={
            <>
              {/* Half diagnostic grid, half board view — the reference's own
                  device for saying "this is being read, not used". */}
              <g stroke={C.line} strokeOpacity="0.28" strokeWidth="1">
                {Array.from({ length: 9 }, (_, i) => (
                  <line key={`a${i}`} x1={-100 + i * 14} y1="-92" x2={-84 + i * 14} y2="50" />
                ))}
                {Array.from({ length: 8 }, (_, i) => (
                  <line key={`b${i}`} x1="-104" y1={-84 + i * 18} x2="8" y2={-84 + i * 18} />
                ))}
              </g>
              <g stroke={C.line} strokeOpacity="0.3" fill="none">
                <circle cx="56" cy="-30" r="22" />
                <circle cx="56" cy="-30" r="9" />
                <rect x="24" y="4" width="64" height="34" />
                <path d="M30 12h52M30 20h40M30 28h52" strokeOpacity="0.5" />
              </g>
              {/* The scanning line, crossing the display once per pass. */}
              <g className="gv-scan">
                <rect x="-110" y="-96" width="220" height="3" fill="#CFE4FF" opacity="0.85" />
                <rect x="-110" y="-93" width="220" height="30" fill={C.deep} opacity="0.10" />
              </g>
            </>
          }
        />

        {/* Six checkpoints. Three a side, each wired to a node on the machine. */}
        <Leader d="M218 158H268l40 42" cx={308} cy={200} cls="gv-n0" />
        <Leader d="M218 238h44l40 26" cx={306} cy={264} cls="gv-n1" />
        <Leader d="M218 318h48l30 18" cx={298} cy={336} cls="gv-n2" />
        <Leader d="M550 158H500l-38 40" cx={462} cy={198} cls="gv-n3" />
        <Leader d="M550 238h-46l-38 28" cx={466} cy={266} cls="gv-n4" />
        <Leader d="M550 318h-50l-28 18" cx={472} cy={336} cls="gv-n5" />

        {[
          { x: 42, y: 132, g: "screen" as const, l: da("SKÆRM", "SCREEN") },
          { x: 42, y: 212, g: "keyboard" as const, l: da("TASTATUR", "KEYBOARD") },
          { x: 42, y: 292, g: "ports" as const, l: da("PORTE", "PORTS") },
          { x: 550, y: 132, g: "battery" as const, l: da("BATTERI", "BATTERY") },
          { x: 550, y: 212, g: "drive" as const, l: da("LAGRING", "STORAGE") },
          { x: 550, y: 292, g: "box" as const, l: da("KABINET", "CHASSIS") },
        ].map((c, i) => (
          <Chip
            key={`${c.x}-${c.y}`}
            id={id}
            x={c.x}
            y={c.y}
            glyph={c.g}
            label={t(c.l)}
            note={t(da("Tester …", "Testing …"))}
            cls={`gv-c${i}`}
          />
        ))}
      </>
    ),
  },

  /* ---------------------------------------------------------------- 04 */
  "samle-din-egen-pc": {
    num: "04",
    category: da("MONTERING", "ASSEMBLY"),
    left: [da("RÆKKEFØLGEN", "THE ORDER"), da("GØR ARBEJDET", "MAKES THE JOB"), da("NEMT", "EASY")],
    right: [da("DELENE KAN KUN", "THE PARTS ONLY"), da("SIDDE ÉT STED", "FIT ONE WAY")],
    draw: (id, t) => (
      <>
        <Contact id={id} cx={430} cy={382} rx={165} />
        {/* The board everything lands on. */}
        <g>
          <polygon points="300,330 580,330 640,384 220,384" fill={C.ink} />
          <polygon points="300,330 580,330 640,384 220,384" fill={`url(#${id}-top)`} />
          <polygon points="220,384 640,384 640,394 220,394" fill={`url(#${id}-dark)`} />
          <polygon points="300,330 580,330 640,384 220,384" fill="none" stroke={C.line} strokeOpacity="0.45" strokeWidth="1.3" />
        </g>

        {/* Alignment guides: what makes it an exploded view and not four
            things drifting. */}
        <g className="gv-guides" stroke={C.accent} strokeOpacity="0.35" strokeDasharray="3 6" strokeWidth="1">
          <line x1="404" y1="150" x2="404" y2="358" />
          <line x1="500" y1="150" x2="500" y2="358" />
        </g>

        {/*
         * Four parts, coming down in the order they have to go in — the board
         * first and the smallest last. Each is a different footprint: the
         * first pass drew four plates of nearly one size, which is a stack,
         * and the whole point of the guide is that they are not alike.
         */}
        {[
          /* graphics: the long one, landing on the board first */
          { c: "gv-p3", pts: "352,290 560,290 596,320 316,320", bar: "372,296 540,296 548,304 380,304" },
          /* memory: a narrow stick */
          { c: "gv-p2", pts: "382,246 518,246 542,268 406,268", bar: "396,251 512,251 518,259 402,259" },
          /* processor: small and square */
          { c: "gv-p1", pts: "412,204 490,204 506,222 428,222" },
          /* storage: the last thing in */
          { c: "gv-p0", pts: "398,164 510,164 528,180 416,180" },
        ].map((p) => (
          <g key={p.c} className={p.c}>
            <polygon points={p.pts} fill={C.ink} />
            <polygon points={p.pts} fill={`url(#${id}-top)`} />
            <polygon points={p.pts} fill="none" stroke={C.line} strokeOpacity="0.55" strokeWidth="1.2" />
            {p.bar && (
              <polygon points={p.bar} fill={C.deep} fillOpacity="0.24" stroke={C.line}
                       strokeOpacity="0.35" strokeWidth="0.9" />
            )}
          </g>
        ))}

        {/* Wider than the labels need, because a mark landing on the last
            letter of "HUKOMMELSE" is a collision, not a reading. */}
        {[
          { y: 128, g: "drive" as const, l: da("LAGRING", "STORAGE") },
          { y: 194, g: "cpu" as const, l: da("PROCESSOR", "PROCESSOR") },
          { y: 260, g: "chipIcon" as const, l: da("HUKOMMELSE", "MEMORY") },
          { y: 326, g: "gauge" as const, l: da("GRAFIKKORT", "GRAPHICS") },
        ].map((c, i) => (
          <Chip key={c.y} id={id} x={42} y={c.y} w={214} glyph={c.g} label={t(c.l)} cls={`gv-c${3 - i}`} />
        ))}
      </>
    ),
  },

  /* ---------------------------------------------------------------- 05 */
  "windows-11-paa-aeldre-maskine": {
    num: "05",
    category: da("KOMPATIBILITET", "COMPATIBILITY"),
    left: [da("KAN MASKINEN", "CAN THIS MACHINE"), da("KØRE WINDOWS 11?", "RUN WINDOWS 11?")],
    right: [da("SVARET AFHÆNGER", "THE ANSWER DEPENDS"), da("AF MASKINEN", "ON THE MACHINE")],
    draw: (id, t) => (
      <>
        <Contact id={id} cx={196} cy={340} rx={112} />
        <Laptop id={id} x={196} y={266} scale={0.55} screen={
          <g opacity="0.45" stroke={C.line} strokeWidth="1.6" fill="none">
            <path d="M-56 -30h112M-56 -8h78M-56 14h96" strokeOpacity="0.45" />
          </g>
        } />

        {/* The interrogation itself: a wire from the machine to the list of
            requirements, with the question running along it. */}
        <g fill="none">
          <path d="M300 266h44v-92h44" stroke={C.line} strokeOpacity="0.35" strokeWidth="1.2" />
          <path d="M300 266h44v0h44" stroke={C.line} strokeOpacity="0.35" strokeWidth="1.2" />
          <path d="M300 266h44v70h44" stroke={C.line} strokeOpacity="0.35" strokeWidth="1.2" />
          <path d="M300 266h44v140h44" stroke={C.line} strokeOpacity="0.35" strokeWidth="1.2" />
          <path
            className="gv-flow"
            d="M300 266h50"
            stroke={C.accent}
            strokeOpacity="0.8"
            strokeWidth="2"
            strokeDasharray="5 7"
          />
        </g>

        {/* Three that a machine of this age normally clears, and one that is
            genuinely open. The panel must not answer a question the article
            spends a section refusing to answer for you. */}
        <Chip id={id} x={432} y={148} w={228} glyph="cpu"
              label={t(da("PROCESSOR", "PROCESSOR"))} note={t(da("Kontrolleres", "Being checked"))} cls="gv-c0" />
        <Chip id={id} x={432} y={222} w={228} glyph="shield"
              label={t(da("TPM 2.0", "TPM 2.0"))} note={t(da("Kontrolleres", "Being checked"))} cls="gv-c1" />
        <Chip id={id} x={432} y={296} w={228} glyph="chipIcon"
              label={t(da("SIKKER OPSTART", "SECURE BOOT"))} note={t(da("Kontrolleres", "Being checked"))} cls="gv-c2" />

        {/* The open one. Dashed, and it never resolves. */}
        <g>
          <rect x="432" y="370" width="228" height="38" rx="6" fill={`url(#${id}-glass)`} />
          <rect x="432" y="370" width="228" height="38" rx="6" fill="none"
                stroke={C.accent} strokeOpacity="0.4" strokeWidth="1" strokeDasharray="4 3" />
          <rect x="442" y="375" width="28" height="28" rx="4" fill={C.deep} fillOpacity="0.1"
                stroke={C.accent} strokeOpacity="0.3" />
          <g transform="translate(446 379)">
            <path d={glyphs.gauge} fill="none" stroke={C.line} strokeOpacity="0.8" strokeWidth="1.2"
                  strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <text x="480" y="394" fontSize="11.5" fontWeight="600" fill={C.paper} letterSpacing="1.1" className="gv-lbl">
            {t(da("AFHÆNGER AF MODEL", "DEPENDS ON MODEL"))}
          </text>
          {/* The open state, in the place the others carry a mark, so the row
              reads against them rather than over its own label. */}
          <g className="gv-open">
            <circle cx="639" cy="389" r="10" fill="none" stroke="#9EC2FF" strokeWidth="1.3" />
            <text x="639" y="394" fontSize="13" fontWeight="700" fill="#9EC2FF" textAnchor="middle">
              ?
            </text>
          </g>
        </g>

        {/* The pass, running down the list once. */}
        <g className="gv-scanline">
          <rect x="424" y="140" width="244" height="2.5" fill="#CFE4FF" opacity="0.9" />
          <rect x="424" y="142" width="244" height="24" fill={C.deep} opacity="0.1" />
        </g>
      </>
    ),
  },

  /* ---------------------------------------------------------------- 06 */
  "slet-data-foer-du-saelger": {
    num: "06",
    category: da("DATASIKKERHED", "DATA SECURITY"),
    left: [da("SLET", "ERASE"), da("KONTROLLÉR", "VERIFY"), da("DOKUMENTÉR", "DOCUMENT")],
    right: [da("FØR MASKINEN", "BEFORE THE MACHINE"), da("FORLADER HUSET", "LEAVES THE BUILDING")],
    draw: (id, t) => {
      /* The drive's top face in its own coordinates, so the block grid stays
         on the surface if the geometry is ever nudged. */
      /* Sized and placed to clear both columns: the first pass ran the
         drive's left corner under the chips and its right corner into the
         verification shield. */
      const o = { x: 344, y: 214 };
      const u = { x: 232, y: 54 };
      const v = { x: -82, y: 40 };
      const at = (a: number, b: number) => ({
        x: o.x + u.x * a + v.x * b,
        y: o.y + u.y * a + v.y * b,
      });
      const quad = (a: number, b: number, da_: number, db: number) =>
        [at(a, b), at(a + da_, b), at(a + da_, b + db), at(a, b + db)]
          .map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`)
          .join(" ");

      return (
        <>
          <Contact id={id} cx={412} cy={330} rx={128} />
          {/* The drive. */}
          <g>
            <polygon points={quad(0, 0, 1, 1)} fill={C.ink} />
            <polygon points={quad(0, 0, 1, 1)} fill={`url(#${id}-top)`} />
            <polygon
              points={`${at(0, 1).x},${at(0, 1).y} ${at(1, 1).x},${at(1, 1).y} ${at(1, 1).x},${at(1, 1).y + 14} ${at(0, 1).x},${at(0, 1).y + 14}`}
              fill={`url(#${id}-side)`}
            />
            <polygon points={quad(0, 0, 1, 1)} fill="none" stroke={C.line} strokeOpacity="0.5" strokeWidth="1.3" />
          </g>

          {/* Twelve blocks. The outlines never move; only what is in them goes. */}
          {[0, 1, 2, 3].map((i) => (
            <g key={i} className={`gv-blk gv-blk-${i}`}>
              {[0, 1, 2].map((j) => (
                <polygon
                  key={j}
                  points={quad(0.06 + i * 0.225, 0.08 + j * 0.29, 0.185, 0.235)}
                  fill={C.deep}
                  fillOpacity="0.42"
                />
              ))}
            </g>
          ))}
          <g stroke={C.line} strokeOpacity="0.35" strokeWidth="1" fill="none">
            {[0, 1, 2, 3].map((i) =>
              [0, 1, 2].map((j) => (
                <polygon key={`${i}-${j}`} points={quad(0.06 + i * 0.225, 0.08 + j * 0.29, 0.185, 0.235)} />
              )),
            )}
          </g>

          {/* The write head, crossing the surface once. */}
          <g className="gv-head" filter={`url(#${id}-bloom)`}>
            <line
              x1={at(0.02, 0.02).x}
              y1={at(0.02, 0.02).y}
              x2={at(0.02, 0.98).x}
              y2={at(0.02, 0.98).y}
              stroke="#DDEAFF"
              strokeWidth="2.4"
            />
          </g>

          <Chip id={id} x={42} y={150} w={196} glyph="drive"
                label={t(da("DATA FUNDET", "DATA FOUND"))} note={t(da("Hele lagringen", "The whole drive"))} cls="gv-c0" />
          <Chip id={id} x={42} y={222} w={196} glyph="arrows"
                label={t(da("OVERSKRIVES", "OVERWRITTEN"))} note={t(da("Blok for blok", "Block by block"))} cls="gv-c1" />
          <Chip id={id} x={42} y={294} w={196} glyph="shield"
                label={t(da("VERIFICERET", "VERIFIED"))} note={t(da("Rapport udstedt", "Report issued"))} cls="gv-c2" />

          {/* The verification mark, landing once the surface is clear. */}
          <g className="gv-shield" style={{ transformOrigin: "662px 320px" }}>
            <g filter={`url(#${id}-bloom)`}>
              <path
                d="M662 286l30 13v21c0 21-13 30-30 34-17-4-30-13-30-34v-21z"
                fill={C.deep}
                fillOpacity="0.14"
                stroke={C.accent}
                strokeWidth="1.6"
              />
              <path d="M650 322l9 9 16-18" fill="none" stroke="#CFE4FF" strokeWidth="2.6"
                    strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </g>
        </>
      );
    },
  },

  /* ---------------------------------------------------------------- 07 */
  "windows-10-support-slutter": {
    num: "07",
    category: da("LEVETID", "LIFECYCLE"),
    left: [da("PLANLÆG", "PLAN"), da("PRIORITÉR", "PRIORITISE"), da("SKIFT I TAKT", "REPLACE IN STAGES")],
    right: [da("SUPPORTEN STOPPER", "SUPPORT ENDS"), da("MASKINEN GØR IKKE", "THE MACHINE DOES NOT")],
    draw: (id, t) => (
      <>
        {/* The run of time the fleet stands on. */}
        <g stroke={C.line} strokeOpacity="0.4" strokeWidth="1.2">
          <line x1="60" y1="356" x2="708" y2="356" />
          <line x1="60" y1="348" x2="60" y2="364" />
          <line x1="708" y1="348" x2="708" y2="364" />
        </g>

        {/* Three machines still covered, one no longer. */}
        {[
          { x: 148, s: 0.3, o: 1 },
          { x: 268, s: 0.3, o: 0.82 },
          { x: 388, s: 0.3, o: 0.66 },
        ].map((m) => (
          <g key={m.x} opacity={m.o}>
            <Contact id={id} cx={m.x} cy={356} rx={58} />
            <Laptop id={id} x={m.x} y={318} scale={m.s} screen={<KMark id={id} scale={0.9} />} />
          </g>
        ))}
        <g opacity="0.55" className="gv-ghost">
          <Laptop id={id} x={606} y={318} scale={0.3} />
        </g>

        {/* The date. A wall across the run of time, not a label — the article
            states it in type. Given a face as well as an edge, so it reads as
            something the updates stop at rather than as a stray rule. */}
        <rect x="492" y="196" width="16" height="160" fill={C.deep} opacity="0.12" />
        <g filter={`url(#${id}-bloom)`}>
          <line x1="500" y1="188" x2="500" y2="356" stroke={C.accent} strokeWidth="1.8" />
          <path d="M492 188h16" stroke={C.bright} strokeWidth="2" strokeOpacity="0.8" />
          <circle cx="500" cy="356" r="6" fill={C.accent} />
          <circle cx="500" cy="356" r="15" fill="none" stroke={C.accent} strokeOpacity="0.5" className="gv-ring" />
        </g>

        {/* Updates arriving along the line — and then none. */}
        <g fill="none" stroke="#CFE4FF" strokeWidth="2" strokeLinecap="round">
          {[0, 1, 2].map((i) => (
            <path key={i} d="M96 250l14 9-14 9" className={`gv-up gv-up-${i}`} />
          ))}
        </g>

        <Chip id={id} x={42} y={128} w={214} glyph="shield"
              label={t(da("SIKKERHEDSOPDATERINGER", "SECURITY UPDATES"))}
              note={t(da("Stopper på datoen", "Stop on the date"))} cls="gv-c0" />
        <Chip id={id} x={512} y={128} w={214} glyph="gauge"
              label={t(da("MASKINEN KØRER VIDERE", "THE MACHINE RUNS ON"))}
              note={t(da("Uden nye rettelser", "Without new fixes"))} cls="gv-c1" />
      </>
    ),
  },

  /* ---------------------------------------------------------------- 08 */
  "refurbished-eller-brugt": {
    num: "08",
    category: da("STAND", "CONDITION"),
    left: [da("SAMME MASKINE", "THE SAME MACHINE"), da("FORSKELLIGT ARBEJDE", "DIFFERENT WORK")],
    right: [da("ORDET SIGER", "THE WORD DESCRIBES"), da("HVAD DER ER GJORT", "WHAT WAS DONE")],
    draw: (id, t) => (
      <>
        {/*
         * Two identical machines, low in the frame, with everything said
         * about them above. The first pass stacked four full-height chips
         * where the right-hand machine's lid is, so the process it was
         * describing was drawn on top of the thing it described.
         */}
        <g opacity="0.7">
          <Contact id={id} cx={176} cy={386} rx={104} />
          <Laptop id={id} x={176} y={336} scale={0.42} screen={<KMark id={id} scale={0.85} />} />
        </g>
        <Contact id={id} cx={556} cy={386} rx={104} />
        <Laptop id={id} x={556} y={336} scale={0.42} screen={<KMark id={id} scale={0.85} />} />

        {/* Over the left one: nothing stated. */}
        <g>
          <rect x="86" y="196" width="200" height="34" rx="6" fill={`url(#${id}-glass)`} />
          <rect x="86" y="196" width="200" height="34" rx="6" fill="none" stroke={C.accent}
                strokeOpacity="0.35" strokeWidth="1" strokeDasharray="4 3" className="gv-open" />
          <text x="186" y="218" fontSize="11.5" fontWeight="600" fill={C.paper} letterSpacing="1.1"
                textAnchor="middle" className="gv-lbl">
            {t(da("INGEN DOKUMENTATION", "NO DOCUMENTATION"))}
          </text>
          <line x1="186" y1="230" x2="186" y2="286" stroke={C.line} strokeOpacity="0.3"
                strokeDasharray="3 5" />
        </g>

        {/* Over the right one: four steps, landing one at a time. */}
        <line x1="556" y1="276" x2="556" y2="286" stroke={C.line} strokeOpacity="0.3" />
        {[
          { y: 100, g: "gauge" as const, l: da("TESTET", "TESTED") },
          { y: 146, g: "chipIcon" as const, l: da("SLIDDELE SKIFTET", "WEAR PARTS REPLACED") },
          { y: 192, g: "shield" as const, l: da("DATA SLETTET", "DATA ERASED") },
          { y: 238, g: "drive" as const, l: da("DOKUMENTERET", "DOCUMENTED") },
        ].map((c, i) => (
          <g key={c.y}>
            <rect x="432" y={c.y} width="250" height="34" rx="6" fill={`url(#${id}-glass)`} />
            <rect x="432" y={c.y} width="250" height="34" rx="6" fill="none" stroke={C.accent}
                  strokeOpacity="0.2" strokeWidth="1" />
            <g className={`gv-step gv-c${i}`}>
              <rect x="432" y={c.y} width="250" height="34" rx="6" fill={C.deep} fillOpacity="0.1" />
              <rect x="432" y={c.y} width="250" height="34" rx="6" fill="none" stroke={C.accent}
                    strokeOpacity="0.75" strokeWidth="1.2" />
            </g>
            <rect x="441" y={c.y + 4} width="26" height="26" rx="4" fill={C.deep} fillOpacity="0.1"
                  stroke={C.accent} strokeOpacity="0.3" />
            <g transform={`translate(444 ${c.y + 7})`}>
              <path d={glyphs[c.g]} fill="none" stroke={C.line} strokeOpacity="0.85" strokeWidth="1.2"
                    strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <text x="478" y={c.y + 22} fontSize="11.5" fontWeight="600" fill={C.paper}
                  letterSpacing="1.1" className="gv-lbl">
              {t(c.l)}
            </text>
            <g className={`gv-tick gv-c${i}`} style={{ transformOrigin: `664px ${c.y + 17}px` }}>
              <path d={`M658 ${c.y + 17} l4 4 7-8`} fill="none" stroke="#9EC2FF" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </g>
        ))}
      </>
    ),
  },
};

/* ---------------------------------------------------------------------- css */

/*
 * One stylesheet for all eight panels, emitted once per page.
 *
 * The panels do not share a clock — a balance that tips twice needs longer
 * than a module going into a socket — but they share a range, 12 to 16
 * seconds, which is what keeps eight animations on one page from reading as
 * eight different tempos.
 */
const CYCLE = { decide: 14, socket: 13, inspect: 16, build: 15, gates: 13, erase: 14, life: 14, cond: 13 };

/** Six chips resolving in order over one pass: bar fills, then the mark lands. */
function sequence(prefix: string, count: number, start: number, step: number, hold: number, cycle: number) {
  const at = (s: number) => `${((s / cycle) * 100).toFixed(2)}%`;
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    const t0 = start + i * step;
    out.push(`
@keyframes ${prefix}-bar-${i} {
  0%, ${at(t0)} { transform: scaleX(0); }
  ${at(t0 + step * 0.72)} { transform: scaleX(1); }
  ${at(hold)} { transform: scaleX(1); }
  ${at(hold + 1)}, 100% { transform: scaleX(0); }
}
@keyframes ${prefix}-tick-${i} {
  0%, ${at(t0 + step * 0.72)} { opacity: 0; transform: scale(0.5); }
  ${at(t0 + step * 0.72 + 0.3)} { opacity: 1; transform: scale(1.15); }
  ${at(t0 + step * 0.72 + 0.5)} { opacity: 1; transform: scale(1); }
  ${at(hold)} { opacity: 1; transform: scale(1); }
  ${at(hold + 1)}, 100% { opacity: 0; transform: scale(1); }
}`);
  }
  return out.join("\n");
}

const css = `
/* The chips' readings, one panel at a time. */
${sequence("gvd", 3, 1.2, 2.4, 11.4, CYCLE.decide)}
${sequence("gvs", 3, 1.6, 2.2, 10.6, CYCLE.socket)}
${sequence("gvi", 6, 1.4, 2.0, 13.6, CYCLE.inspect)}
${sequence("gvb", 4, 1.6, 2.4, 12.4, CYCLE.build)}
${sequence("gvg", 3, 1.6, 2.3, 10.8, CYCLE.gates)}
${sequence("gve", 3, 1.4, 2.6, 11.6, CYCLE.erase)}
${sequence("gvl", 2, 1.8, 3.0, 11.6, CYCLE.life)}
${sequence("gvc", 4, 1.4, 2.1, 10.8, CYCLE.cond)}

/* Data lines. The one thing that runs on every panel, and the cheapest way to
   say "this is live" without moving anything. */
@keyframes gv-flow { to { stroke-dashoffset: -260; } }

/* 01 — the signal goes one way, then the other, because the answer does. */
@keyframes gv-sig {
  0%, 4% { opacity: 0; transform: translate(384px, 268px); }
  8% { opacity: 1; }
  26% { opacity: 1; transform: translate(218px, 200px); }
  34% { opacity: 0; transform: translate(218px, 200px); }
  40% { opacity: 0; transform: translate(384px, 268px); }
  46% { opacity: 1; }
  66% { opacity: 1; transform: translate(550px, 200px); }
  74%, 100% { opacity: 0; transform: translate(550px, 200px); }
}

/* 02 — in, seated, held, and back out: a demonstration, not a teleport. */
@keyframes gv-mod {
  0%, 6% { transform: translateY(-118px); opacity: 0.55; }
  11% { opacity: 1; }
  27% { transform: translateY(4px); }
  31% { transform: translateY(0); }
  66% { transform: translateY(0); opacity: 1; }
  86%, 100% { transform: translateY(-118px); opacity: 0.55; }
}
@keyframes gv-pins {
  0%, 25% { opacity: 0.9; }
  31% { opacity: 1; }
  38%, 66% { opacity: 0.2; }
  80%, 100% { opacity: 0.9; }
}
@keyframes gv-streaks {
  0%, 30% { opacity: 0; }
  34% { opacity: 0.9; }
  46% { opacity: 0.25; }
  66% { opacity: 0.18; }
  76%, 100% { opacity: 0; }
}

/* 03 — the pass down the display, and the node that lights with its chip. */
@keyframes gv-scan {
  0%, 3% { opacity: 0; transform: translateY(0); }
  7% { opacity: 1; }
  82% { opacity: 1; transform: translateY(140px); }
  88%, 100% { opacity: 0; transform: translateY(140px); }
}
${[0, 1, 2, 3, 4, 5]
  .map((i) => {
    const t0 = 1.4 + i * 2.0;
    const p = (s: number) => `${((s / CYCLE.inspect) * 100).toFixed(2)}%`;
    return `
@keyframes gv-n${i} {
  0%, ${p(t0)} { opacity: 0.25; }
  ${p(t0 + 0.4)} { opacity: 1; }
  ${p(13.6)} { opacity: 1; }
  ${p(14.6)}, 100% { opacity: 0.25; }
}`;
  })
  .join("")}

/* 04 — the parts come down in the order they have to go in. */
${[0, 1, 2, 3]
  .map((i) => {
    const t0 = 1.6 + i * 2.4;
    const p = (s: number) => `${((s / CYCLE.build) * 100).toFixed(2)}%`;
    const lift = [46, 96, 146, 196][i];
    return `
@keyframes gv-p${3 - i} {
  0%, ${p(t0)} { transform: translateY(-${lift}px); opacity: 0.35; }
  ${p(t0 + 0.25)} { opacity: 1; }
  ${p(t0 + 1.5)} { transform: translateY(0); }
  ${p(12.4)} { transform: translateY(0); opacity: 1; }
  ${p(13.6)}, 100% { transform: translateY(-${lift}px); opacity: 0.35; }
}`;
  })
  .join("")}
@keyframes gv-guides {
  0%, 6% { opacity: 0; }
  16%, 84% { opacity: 1; }
  94%, 100% { opacity: 0; }
}

/* 05 — one pass down the requirements. The open one never resolves. */
@keyframes gv-scanline {
  0%, 3% { opacity: 0; transform: translateY(0); }
  8% { opacity: 1; }
  62% { opacity: 1; transform: translateY(230px); }
  68%, 100% { opacity: 0; transform: translateY(230px); }
}
@keyframes gv-open {
  0%, 100% { opacity: 0.35; }
  50% { opacity: 1; }
}

/* 06 — column by column, then the report is signed. */
${[0, 1, 2, 3]
  .map((i) => {
    const t0 = 1.1 + i * 1.15;
    const p = (s: number) => `${((s / CYCLE.erase) * 100).toFixed(2)}%`;
    return `
@keyframes gv-blk-${i} {
  0%, ${p(t0)} { opacity: 1; }
  ${p(t0 + 0.5)} { opacity: 0; }
  ${p(12.2)} { opacity: 0; }
  ${p(13.4)}, 100% { opacity: 1; }
}`;
  })
  .join("")}
@keyframes gv-head {
  0%, 2% { opacity: 0; transform: translate(0, 0); }
  8% { opacity: 1; }
  40% { opacity: 1; }
  45%, 100% { opacity: 0; transform: translate(227px, 53px); }
}
@keyframes gv-shield {
  0%, 45% { opacity: 0; transform: scale(0.7); }
  52% { opacity: 1; transform: scale(1.08); }
  57% { transform: scale(1); }
  88% { opacity: 1; transform: scale(1); }
  95%, 100% { opacity: 0; transform: scale(1); }
}

/* 07 — three updates arrive, and then the line runs on empty. */
${[0, 1, 2]
  .map((i) => {
    const t0 = 0.6 + i * 1.3;
    const p = (s: number) => `${((s / CYCLE.life) * 100).toFixed(2)}%`;
    return `
@keyframes gv-up-${i} {
  0%, ${p(t0)} { opacity: 0; transform: translateX(0); }
  ${p(t0 + 0.3)} { opacity: 0.95; }
  ${p(t0 + 2.1)} { opacity: 0.95; }
  ${p(t0 + 2.6)}, 100% { opacity: 0; transform: translateX(376px); }
}`;
  })
  .join("")}
@keyframes gv-ring {
  0%, 100% { opacity: 0.1; transform: scale(0.85); }
  50% { opacity: 0.55; transform: scale(1.25); }
}
@keyframes gv-ghost {
  0%, 100% { opacity: 0.35; }
  50% { opacity: 0.7; }
}

/* Step plates lighting one after another. */
${[0, 1, 2, 3]
  .map((i) => {
    const t0 = 1.4 + i * 2.1;
    const p = (s: number) => `${((s / CYCLE.cond) * 100).toFixed(2)}%`;
    return `
@keyframes gv-step-${i} {
  0%, ${p(t0)} { opacity: 0; }
  ${p(t0 + 0.35)} { opacity: 1; }
  ${p(10.8)} { opacity: 1; }
  ${p(11.8)}, 100% { opacity: 0; }
}`;
  })
  .join("")}

/*
 * Nothing moves unless motion is welcome.
 *
 * Without the query every panel resolves to the state that carries its
 * meaning: every reading taken, every part in place, the drive clear and the
 * report signed, three requirements met and the fourth still open. A still
 * panel is a finished drawing, never an empty one.
 */
.gv-bar, .gv-tick, .gv-step { opacity: 1; }
.gv-bar { transform: scaleX(1); }
.gv-sig, .gv-scan, .gv-scanline, .gv-head, .gv-up { opacity: 0; }
.gv-pulse-streaks { opacity: 0.18; }
.gv-pins { opacity: 0.2; }
.gv-blk { opacity: 0; }
.gv-open { opacity: 0.5; }
.gv-ring { opacity: 0.3; }
.gv-ghost { opacity: 0.5; }
.gv-bar, .gv-tick, .gv-step, .gv-shield { transform-box: view-box; }
.gv-sig, .gv-mod, .gv-scan, .gv-scanline, .gv-head, .gv-up, .gv-p0, .gv-p1, .gv-p2, .gv-p3 { transform-box: view-box; }

@media (prefers-reduced-motion: no-preference) {
  .gv-flow { stroke-dashoffset: 0; animation: gv-flow 3.4s linear infinite; }
  .gv-flow-b { animation-delay: -1.7s; }

  ${[
    ["gvd", "decide", 3],
    ["gvs", "socket", 3],
    ["gvi", "inspect", 6],
    ["gvb", "build", 4],
    ["gvg", "gates", 3],
    ["gve", "erase", 3],
    ["gvl", "life", 2],
    ["gvc", "cond", 4],
  ]
    .map(([p, key, n]) =>
      Array.from({ length: n as number }, (_, i) => {
        const c = CYCLE[key as keyof typeof CYCLE];
        return `.gv-${key}-panel .gv-bar.gv-c${i} { animation: ${p}-bar-${i} ${c}s cubic-bezier(0.4,0,0.2,1) infinite; }
  .gv-${key}-panel .gv-tick.gv-c${i} { animation: ${p}-tick-${i} ${c}s cubic-bezier(0.34,1.4,0.5,1) infinite; }`;
      }).join("\n  "),
    )
    .join("\n  ")}

  .gv-sig { animation: gv-sig ${CYCLE.decide}s cubic-bezier(0.45,0,0.35,1) infinite; }

  .gv-mod { animation: gv-mod ${CYCLE.socket}s cubic-bezier(0.4,0,0.25,1) infinite; }
  .gv-pins { animation: gv-pins ${CYCLE.socket}s ease-out infinite; }
  .gv-pulse-streaks { animation: gv-streaks ${CYCLE.socket}s ease-out infinite; }

  .gv-scan { animation: gv-scan ${CYCLE.inspect}s cubic-bezier(0.4,0,0.6,1) infinite; }
  ${[0, 1, 2, 3, 4, 5].map((i) => `.gv-n${i} { animation: gv-n${i} ${CYCLE.inspect}s ease-out infinite; }`).join("\n  ")}

  ${[0, 1, 2, 3].map((i) => `.gv-p${i} { animation: gv-p${i} ${CYCLE.build}s cubic-bezier(0.4,0,0.25,1) infinite; }`).join("\n  ")}
  .gv-guides { animation: gv-guides ${CYCLE.build}s ease-in-out infinite; }

  .gv-scanline { animation: gv-scanline ${CYCLE.gates}s cubic-bezier(0.4,0,0.6,1) infinite; }
  .gv-open { animation: gv-open 3.6s ease-in-out infinite; }

  ${[0, 1, 2, 3].map((i) => `.gv-blk-${i} { animation: gv-blk-${i} ${CYCLE.erase}s ease-out infinite; }`).join("\n  ")}
  .gv-head { animation: gv-head ${CYCLE.erase}s cubic-bezier(0.4,0,0.6,1) infinite; }
  .gv-shield { animation: gv-shield ${CYCLE.erase}s cubic-bezier(0.34,1.4,0.5,1) infinite; }

  ${[0, 1, 2].map((i) => `.gv-up-${i} { animation: gv-up-${i} ${CYCLE.life}s cubic-bezier(0.4,0,0.6,1) infinite; }`).join("\n  ")}
  .gv-ring { animation: gv-ring 3.8s ease-in-out infinite; }
  .gv-ghost { animation: gv-ghost 6.5s ease-in-out infinite; }

  ${[0, 1, 2, 3].map((i) => `.gv-cond-panel .gv-step.gv-c${i} { animation: gv-step-${i} ${CYCLE.cond}s ease-out infinite; }`).join("\n  ")}
}

/*
 * Type inside the panel is set for the size the panel is read at. Below sm the
 * panel is about half that width, which would put an 11.5px label at six — so
 * the labels come out and the instrument is read by its icons, its nodes and
 * its bars. The guide's own title is directly beneath it either way.
 */
.gv-lbl { display: none; }
@media (min-width: 640px) { .gv-lbl { display: block; } }
`;

/** The panels' stylesheet. Rendered once per page, never per panel. */
export function GuidePanelStyles() {
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}

/*
 * Supplied artwork.
 *
 * Three of these guides have a rendered plate that Kestro had made rather
 * than one drawn here, and where a real render exists it beats a drawing of
 * one: the light, the depth of field and the material on a photographed board
 * are not things inline SVG gets to for free.
 *
 * Danish only, and the reason is in the artwork. The labels inside these
 * images — SKÆRM, TASTATUR, BATTERI, RAM, HURTIGERE ARBEJDSGANG — are baked
 * into the pixels and cannot be swapped for a reader who chose English. The
 * English hub keeps the drawn panel, which is the same picture in the
 * language the reader asked for. That is a deliberate trade, not an oversight.
 *
 * Local WebP through next/image: 23-42 kB each, down from 400-480 kB as PNG,
 * with a fixed 3:2 box so nothing shifts as they decode.
 */
const artwork: Record<string, { src: string; alt: string }> = {
  "tjek-brugt-baerbar-foer-koeb": {
    src: "/viden/inspektion.webp",
    alt: "Bærbar under gennemgang med kontrolpunkter for skærm, tastatur, porte, batteri og hardware.",
  },
  "opgrader-ram-i-baerbar": {
    src: "/viden/ydelse.webp",
    alt: "Et RAM-modul og et NVMe SSD over hinanden, som de to opgraderinger der flytter mest.",
  },
  "windows-10-support-slutter": {
    src: "/viden/levetid.webp",
    alt: "En bærbar i midten af et livscyklusforløb: ny, udrullet, aktiv, opgraderet, udskiftet.",
  },
};

export const hasGuidePanel = (slug: string) => slug in panels;

/** Which clock a slug runs on, so its chips animate on its own cycle. */
const clockOf: Record<string, string> = {
  "reparere-eller-koebe-ny": "decide",
  "opgrader-ram-i-baerbar": "socket",
  "tjek-brugt-baerbar-foer-koeb": "inspect",
  "samle-din-egen-pc": "build",
  "windows-11-paa-aeldre-maskine": "gates",
  "slet-data-foer-du-saelger": "erase",
  "windows-10-support-slutter": "life",
  "refurbished-eller-brugt": "cond",
};

export default function GuidePanel({
  slug,
  lang,
  className = "",
  style,
  priority = false,
}: {
  slug: string;
  lang: Lang;
  className?: string;
  /** For a caller that needs to mask or place the panel itself. */
  style?: React.CSSProperties;
  /** The first panel on the page paints eagerly; the rest can wait. */
  priority?: boolean;
}) {
  const def = panels[slug];
  if (!def) return null;

  /* A rendered plate where one exists, in the language it is set in. */
  const art = lang === "da" ? artwork[slug] : undefined;
  if (art) {
    return (
      <div className={className} style={style}>
        <Image
          src={art.src}
          alt={art.alt}
          width={768}
          height={512}
          sizes="(min-width: 1024px) 768px, 100vw"
          priority={priority}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  /* One gradient and filter namespace per panel: eight of these share a
     document, and the second would silently take the first one's ids. */
  const id = `gv-${slug}`;
  const t: T = (l) => l[lang];

  return (
    <div className={className} style={style}>
      <svg
        viewBox="0 0 768 512"
        className={`h-full w-full gv-${clockOf[slug]}-panel`}
        role="img"
        aria-label={`${def.num} — ${t(def.category)}`}
        preserveAspectRatio="xMidYMid slice"
        /* Fixed aspect and no external request, so it cannot shift the page or
           delay the largest paint. Everything below the fold decodes lazily. */
        style={{ contentVisibility: priority ? "visible" : "auto", containIntrinsicSize: "768px 512px" }}
      >
        <Defs id={id} />
        <Sheet id={id} />
        {def.draw(id, t)}
        <Caption
          num={def.num}
          category={t(def.category)}
          left={def.left.map(t)}
          right={def.right.map(t)}
        />
      </svg>
    </div>
  );
}
