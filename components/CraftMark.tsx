/*
 * The small marks, drawn rather than picked.
 *
 * The five facts under the hero used to be lucide glyphs, then a set drawn
 * here on a 24-unit grid with 2-unit strokes, square caps and mitred joins —
 * crisp at 1x and, placed in a row on a dark bar, a technical drawing: every
 * line the same weight, every corner a right angle, an accent that fell on
 * whichever part of each glyph happened to be easiest to colour. It read as
 * a system icon font, which is what "not designed" looks like on a page that
 * is otherwise trying to feel like a product brochure.
 *
 * ## The language
 *
 * - **1.5-unit strokes, round caps, round joins.** Lighter and softer; on the
 *   screens this site is read on (retina phones, most laptops) a 1.5px line is
 *   three device pixels and lands clean. Round terminals are what separate a
 *   drawn mark from a diagram.
 * - **A body, not a wash.** The one surface that is the subject — the seal,
 *   the keycap, the briefcase, the cube's side — is filled with `km-body`, a
 *   brand gradient from 34% at the top left to 6% at the bottom right. That is
 *   the light the tiles are lit from, so the mark sits in the same light as
 *   its plate.
 * - **One accent, always on the meaning.** The tick on the seal, the Nordic
 *   cross on the keycap, the leaf inside the loop, the arriving box on the
 *   shelf. Brand-300 as a stroke, or `km-accent` as a fill. If a reader sees
 *   only the blue part, they should still get the fact.
 * - **Metaphors a buyer already reads.** A seal for "tested", a briefcase for
 *   "business grade", a circular loop with a leaf for "sustainable". The
 *   previous set tried to be original — three squares for Nordic, two
 *   arrows for sustainable — and original at 24px means ambiguous.
 *
 * Every mark lives in a 3–21 live area and is drawn to read in a MarkTile,
 * the one container every mark on the site sits in. `km-body` and `km-accent`
 * are defined once, in <CraftMarkDefs/> in the language layout; each fill
 * names a flat colour after the url() as SVG's own fallback, so a mark drawn
 * somewhere the defs are not still has a body.
 *
 * `node scripts/design/marks-sheet.mjs` renders the set at the sizes the site
 * uses. Look at 24px, not the blow-up.
 *
 * Every mark is aria-hidden: the fact is written in words immediately beside
 * it, and a screen reader gaining "drawing of a van" would be noise.
 */

export type CraftMarkName =
  | "tested"
  | "nordic"
  | "business"
  | "sustainable"
  | "delivery"
  | "adjust"
  | "batch"
  | "written"
  | "network"
  | "no-stock"
  | "who"
  | "screen"
  | "repair"
  | "parts"
  | "cooling"
  | "install"
  | "assembly"
  | "schedule"
  | "memory"
  | "battery"
  | "keyboard";

const BODY = "url(#km-body) rgb(102 144 249 / 0.16)";
const ACCENT = "url(#km-accent) #93AEFB";

/** A twelve-lobed seal: the shape a certificate carries. */
function seal(cx: number, cy: number, r: number, amp: number) {
  const pts: string[] = [];
  for (let i = 0; i < 96; i++) {
    const t = (2 * Math.PI * i) / 96;
    const rr = r + amp * Math.cos(12 * t);
    pts.push(`${(cx + rr * Math.sin(t)).toFixed(2)} ${(cy - rr * Math.cos(t)).toFixed(2)}`);
  }
  return `M${pts.join("L")}Z`;
}

const SEAL_24 = seal(12, 12, 8.4, 0.72);
const SEAL_20 = seal(10, 10, 6.9, 0.6);

/** One fan blade, rotated three times about the hub. */
const BLADE = "M12 10.1c.4-2.7 2.1-4.4 4.7-4.6-.3 2.5-2 4.1-4.7 4.6z";

const marks: Record<CraftMarkName, React.ReactNode> = {
  /* A seal with the tick on it. The magnifier it replaces said "inspect";
     a seal says "passed", which is the claim. */
  tested: (
    <>
      <path d={SEAL_24} fill={BODY} />
      <path d={SEAL_24} />
      <path d="M8.6 12.3l2.3 2.3 4.6-5" className="stroke-brand-300" strokeWidth="1.75" />
    </>
  ),

  /* A keycap — the lip below the top face is what makes it a key and not a
     tile — carrying a Nordic flag. Keyboard and region in one shape. The
     first attempt put the cross straight on the key's face and it read as a
     window; the flag needs its own field to be a flag. No letter on it: an Ø
     on a key was read as a prohibition sign. */
  nordic: (
    <>
      <rect x="3" y="3.5" width="18" height="17" rx="3.5" fill={BODY} />
      <rect x="3" y="3.5" width="18" height="17" rx="3.5" />
      <path d="M3.6 16.2h16.8" />
      <rect x="6.5" y="6.5" width="11" height="7" rx=".9" fill={ACCENT} stroke="none" />
      <path d="M10.3 6.5v7M6.5 10h11" stroke="#0B1426" strokeWidth="1.5" strokeLinecap="butt" />
    </>
  ),

  /* The briefcase: "business" in every visual language there is. The clasp
     is the accent, because the clasp is the part that says "closed, carried,
     for work". */
  business: (
    <>
      <rect x="3" y="7.5" width="18" height="12.5" rx="2.5" fill={BODY} />
      <rect x="3" y="7.5" width="18" height="12.5" rx="2.5" />
      <path d="M9 7.5V6a1.5 1.5 0 011.5-1.5h3A1.5 1.5 0 0115 6v1.5" />
      <path d="M3 12.5h7.5M13.5 12.5H21" />
      <rect x="10.5" y="11" width="3" height="3.2" rx=".8" fill={ACCENT} className="stroke-brand-300" />
    </>
  ),

  /* The loop that returns, and what it keeps growing. */
  sustainable: (
    <>
      <path d="M19.4 9.2A8 8 0 005.3 7.6" />
      <path d="M5 3.8v4h4" />
      <path d="M4.6 14.8a8 8 0 0014.1 1.6" />
      <path d="M19 20.2v-4h-4" />
      <path d="M8.3 15.7c0-4.2 3-7.4 7.4-7.4 0 4.2-3 7.4-7.4 7.4z" fill={ACCENT} className="stroke-brand-300" />
      <path d="M8.3 15.7l3.4-3.4" stroke="#0B1426" strokeWidth="1.2" />
    </>
  ),

  /* A van, drawn as one outline with its wheels cut out of the sill. The
     accent is the load: the part that is the customer's. */
  delivery: (
    <>
      <path
        d="M2.5 16V8A1.5 1.5 0 014 6.5h8A1.5 1.5 0 0113.5 8v1.5h3.3a1.5 1.5 0 011.2.6l2.2 2.9a1.5 1.5 0 01.3.9V16"
        fill={BODY}
      />
      <path d="M2.5 16V8A1.5 1.5 0 014 6.5h8A1.5 1.5 0 0113.5 8v1.5h3.3a1.5 1.5 0 011.2.6l2.2 2.9a1.5 1.5 0 01.3.9V16h-1.4M15.1 16H8.9M5.1 16H2.5" />
      <path d="M13.5 9.5V16" />
      <circle cx="7" cy="16.5" r="1.9" />
      <circle cx="17" cy="16.5" r="1.9" />
      <rect x="5.5" y="9" width="5" height="3.5" rx=".8" fill={ACCENT} className="stroke-brand-300" />
    </>
  ),

  /* Two sliders, one set. */
  adjust: (
    <>
      <path d="M3.5 8h9.5M17.5 8h3M3.5 16h3M11 16h9.5" />
      <circle cx="15.2" cy="8" r="2.3" fill={ACCENT} className="stroke-brand-300" />
      <circle cx="8.8" cy="16" r="2.3" fill={BODY} />
    </>
  ),

  /* Layers: the lot, with the one on top picked out. */
  batch: (
    <>
      <path d="M12 3.5l8.5 4.3-8.5 4.3-8.5-4.3z" fill={ACCENT} className="stroke-brand-300" />
      <path d="M3.5 12.1l8.5 4.3 8.5-4.3" />
      <path d="M3.5 16.2l8.5 4.3 8.5-4.3" />
    </>
  ),

  /* The page, its fold, and the tick that makes it an answer. */
  written: (
    <>
      <path d="M6.5 3h7L19 8.5v11a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 015 19.5v-15A1.5 1.5 0 016.5 3z" fill={BODY} />
      <path d="M6.5 3h7L19 8.5v11a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 015 19.5v-15A1.5 1.5 0 016.5 3z" />
      <path d="M13.5 3v4a1.5 1.5 0 001.5 1.5h4" />
      <path d="M8.5 12h7M8.5 15h4" />
      <path d="M11.8 18.1l1.4 1.3 2.8-3" className="stroke-brand-300" />
    </>
  ),

  /* Suppliers: one node reaching two. The reached one is the accent. */
  network: (
    <>
      <path d="M8.2 10.9l7.6-3.8M8.2 13.1l7.6 3.8" />
      <circle cx="6" cy="12" r="2.6" fill={BODY} />
      <circle cx="6" cy="12" r="2.6" />
      <circle cx="18" cy="6" r="2.6" fill={ACCENT} className="stroke-brand-300" />
      <circle cx="18" cy="18" r="2.6" />
    </>
  ),

  /* No stock: an empty shelf with the one box that was sourced for you. */
  "no-stock": (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="2.2" />
      <path d="M3.5 12.5h17" />
      <rect x="6.5" y="6.5" width="5.5" height="6" rx="1" fill={ACCENT} className="stroke-brand-300" />
      <path d="M15 17h2.5" />
    </>
  ),

  /* A small office building and its door. */
  who: (
    <>
      <path d="M5 21V5.5A1.5 1.5 0 016.5 4h7A1.5 1.5 0 0115 5.5V21" fill={BODY} />
      <path d="M5 21V5.5A1.5 1.5 0 016.5 4h7A1.5 1.5 0 0115 5.5V21M15 10h3.5a1.5 1.5 0 011.5 1.5V21M3 21h18" />
      <path d="M8 8h1M11 8h1M8 11.5h1M11 11.5h1" />
      <path d="M9 21v-4.5h2V21" className="stroke-brand-300" />
    </>
  ),

  screen: (
    <>
      <rect x="3" y="4" width="18" height="12" rx="1.8" fill={BODY} />
      <rect x="3" y="4" width="18" height="12" rx="1.8" />
      <path d="M12 16v3.5" />
      <path d="M8.5 20h7" className="stroke-brand-300" />
    </>
  ),

  repair: (
    <>
      <path
        d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.1-3.1a5.6 5.6 0 01-7.4 7.4l-6.3 6.3a2 2 0 01-2.8-2.8l6.3-6.3a5.6 5.6 0 017.4-7.4z"
        fill={BODY}
      />
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.1-3.1a5.6 5.6 0 01-7.4 7.4l-6.3 6.3a2 2 0 01-2.8-2.8l6.3-6.3a5.6 5.6 0 017.4-7.4z" />
      <circle cx="5.9" cy="18.1" r=".6" className="fill-brand-300 stroke-brand-300" />
    </>
  ),

  /* A processor: the component every machine is built around. */
  parts: (
    <>
      <rect x="6" y="6" width="12" height="12" rx="2" fill={BODY} />
      <rect x="6" y="6" width="12" height="12" rx="2" />
      <rect x="9.5" y="9.5" width="5" height="5" rx="1" fill={ACCENT} className="stroke-brand-300" />
      <path d="M9.5 3v3M14.5 3v3M9.5 18v3M14.5 18v3M3 9.5h3M3 14.5h3M18 9.5h3M18 14.5h3" />
    </>
  ),

  /* A fan in its frame. */
  cooling: (
    <>
      <circle cx="12" cy="12" r="8.5" fill={BODY} />
      <circle cx="12" cy="12" r="8.5" />
      <path d={BLADE} fill={ACCENT} className="stroke-brand-300" />
      <path d={BLADE} fill={ACCENT} className="stroke-brand-300" transform="rotate(120 12 12)" />
      <path d={BLADE} fill={ACCENT} className="stroke-brand-300" transform="rotate(240 12 12)" />
      <circle cx="12" cy="12" r="1.6" />
    </>
  ),

  install: (
    <>
      <path d="M4 14.5v3.5A2 2 0 006 20h12a2 2 0 002-2v-3.5" fill={BODY} />
      <path d="M4 14.5v3.5A2 2 0 006 20h12a2 2 0 002-2v-3.5" />
      <path d="M12 3.5v10M8 9.5l4 4 4-4" className="stroke-brand-300" />
    </>
  ),

  /* A cube: the machine, put together. */
  assembly: (
    <>
      <path d="M4.5 7.7L12 12v8.5l-7.5-4.2z" fill={BODY} />
      <path d="M12 3.5l7.5 4.2L12 12 4.5 7.7z" fill={ACCENT} className="stroke-brand-300" />
      <path d="M4.5 7.7v8.6l7.5 4.2 7.5-4.2V7.7M12 12v8.5" />
    </>
  ),

  schedule: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" fill={BODY} />
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
      <rect x="7" y="12.5" width="3.5" height="3.5" rx=".8" fill={ACCENT} className="stroke-brand-300" />
    </>
  ),

  memory: (
    <>
      <rect x="2.5" y="7" width="19" height="9" rx="1.2" fill={BODY} />
      <rect x="2.5" y="7" width="19" height="9" rx="1.2" />
      <path d="M5.5 16v2.5M8.5 16v2.5M15.5 16v2.5M18.5 16v2.5" />
      <rect x="10.25" y="9.5" width="3.5" height="4" rx=".6" fill={ACCENT} className="stroke-brand-300" />
      <path d="M5.5 11.5h2M16.5 11.5h2" />
    </>
  ),

  battery: (
    <>
      <rect x="2.5" y="7.5" width="16.5" height="9" rx="2" />
      <path d="M21.5 10.5v3" />
      <rect x="5" y="10" width="7" height="4" rx=".8" fill={ACCENT} className="stroke-brand-300" />
    </>
  ),

  keyboard: (
    <>
      <rect x="2.5" y="6" width="19" height="12" rx="2" fill={BODY} />
      <rect x="2.5" y="6" width="19" height="12" rx="2" />
      <path d="M6 9.5h.5M9.5 9.5h.5M13.5 9.5h.5M17.5 9.5h.5M6 12.5h.5M9.5 12.5h.5M13.5 12.5h.5M17.5 12.5h.5" strokeWidth="2" />
      <path d="M8 15.3h8" className="stroke-brand-300" />
    </>
  ),
};

export type SpecMarkName = "ram" | "ssd" | "keyboard" | "battery" | "tested" | "warranty";

/* The same language on a 20-unit grid, for the spec rows beside the hero. */
const specMarks: Record<SpecMarkName, React.ReactNode> = {
  ram: (
    <>
      <rect x="2" y="5.5" width="16" height="8" rx="1" fill={BODY} />
      <rect x="2" y="5.5" width="16" height="8" rx="1" />
      <path d="M4.5 13.5v2M7.5 13.5v2M12.5 13.5v2M15.5 13.5v2" />
      <rect x="8.2" y="7.7" width="3.6" height="3.6" rx=".6" fill={ACCENT} className="stroke-brand-300" />
    </>
  ),
  /* A drive: long, thin, with its connector end. */
  ssd: (
    <>
      <rect x="2" y="6.5" width="16" height="7" rx="1.4" fill={BODY} />
      <rect x="2" y="6.5" width="16" height="7" rx="1.4" />
      <path d="M5 8.8v2.4" />
      <rect x="8" y="8.3" width="6" height="3.4" rx=".6" fill={ACCENT} className="stroke-brand-300" />
    </>
  ),
  keyboard: (
    <>
      <rect x="2" y="5" width="16" height="10" rx="1.8" fill={BODY} />
      <rect x="2" y="5" width="16" height="10" rx="1.8" />
      <path d="M5 8h.5M8 8h.5M11.5 8h.5M14.5 8h.5" strokeWidth="1.8" />
      <path d="M6.5 11.8h7" className="stroke-brand-300" />
    </>
  ),
  battery: (
    <>
      <rect x="2" y="6" width="14" height="8" rx="1.8" />
      <path d="M18 8.5v3" />
      <rect x="4.2" y="8.2" width="6" height="3.6" rx=".7" fill={ACCENT} className="stroke-brand-300" />
    </>
  ),
  tested: (
    <>
      <path d={SEAL_20} fill={BODY} />
      <path d={SEAL_20} />
      <path d="M7.2 10.2l1.9 1.9 3.8-4.1" className="stroke-brand-300" strokeWidth="1.7" />
    </>
  ),
  /* The page and the seal that makes it binding. */
  warranty: (
    <>
      <path d="M4.5 2.5h6.5L15 6.5v10a1.3 1.3 0 01-1.3 1.3H4.5a1.3 1.3 0 01-1.3-1.3v-12.7a1.3 1.3 0 011.3-1.3z" fill={BODY} />
      <path d="M4.5 2.5h6.5L15 6.5v10a1.3 1.3 0 01-1.3 1.3H4.5a1.3 1.3 0 01-1.3-1.3v-12.7a1.3 1.3 0 011.3-1.3z" />
      <path d="M6 8.5h5M6 11.3h3" />
      <circle cx="12.6" cy="14.6" r="2.3" fill={ACCENT} className="stroke-brand-300" />
    </>
  ),
};

const svgProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
};

export function SpecMark({ name, className = "" }: { name: SpecMarkName; className?: string }) {
  return (
    <svg viewBox="0 0 20 20" {...svgProps} className={className}>
      {specMarks[name]}
    </svg>
  );
}

/**
 * The two gradients every mark fills from. Rendered once, in the language
 * layout, as a zero-size SVG — url(#km-body) resolves document-wide.
 */
export function CraftMarkDefs() {
  return (
    <svg
      width="0"
      height="0"
      aria-hidden="true"
      focusable="false"
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
    >
      <defs>
        <linearGradient id="km-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#93AEFB" stopOpacity="0.36" />
          <stop offset="1" stopColor="#1E40FF" stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id="km-accent" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#BECFFD" stopOpacity="0.85" />
          <stop offset="1" stopColor="#6690F9" stopOpacity="0.55" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function CraftMark({
  name,
  className = "",
}: {
  name: CraftMarkName;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" {...svgProps} className={className}>
      {marks[name]}
    </svg>
  );
}
