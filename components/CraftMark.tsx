/*
 * The small marks, drawn rather than picked.
 *
 * The five facts under the hero used to be lucide glyphs: a shield, a
 * briefcase, a leaf, a lorry. They are competent icons and they are on several
 * hundred thousand other sites, which is the problem — the row a buyer sees
 * first said "this is a website" rather than "this is Kestro". That reasoning
 * still holds and these are still drawn here.
 *
 * What changed is the size they are drawn FOR.
 *
 * The first set was composed at 96px and deployed at 24. Rendered side by side
 * at both sizes, the failure was obvious and it was the same failure eleven
 * times: a probe descending onto a circuit board is a lovely drawing and, at
 * 24px, an indistinct smudge. Worse, five of the marks resolved to the same
 * silhouette — a rounded rectangle with a smaller rectangle inside it — so the
 * strip under the hero read as five identical grey boxes. An icon that cannot
 * be told from its neighbour has failed before legibility is even the question.
 *
 * So each mark is now built silhouette-first: it must be identifiable from its
 * outline alone, with no more than four interior strokes, and no two marks in
 * the set may share a dominant shape. A circle (tested), a keycap (nordic), a
 * trapezoid (business), a loop (sustainable), a van (delivery), a stack
 * (batch) — you can tell them apart squinting.
 *
 * What still makes them one family, and drawings rather than icons:
 *
 *   - square caps and joins, never round. Round caps are what almost every
 *     icon set uses and they read friendly; a square cut reads machined, and
 *     it is the single cheapest signal that these were drawn for this site;
 *   - one accent per mark and never more — the tick, the Ø key, the return
 *     arrow, the top unit of the lot. Everything else is the same weight, so
 *     the eye is told exactly which part carries the meaning;
 *   - a wash at 8–12% on the one surface that is the subject, so the mark has
 *     a body without needing a shadow.
 *
 * The registration ticks are gone. They were the family resemblance and they
 * were designed for a size nothing on this site uses: every CraftMark in the
 * codebase renders between 20 and 28px, where a 3-unit tick at 25% opacity is
 * a sub-pixel grey speck that costs a fifth of the box and reads as dirt. The
 * silhouette does that job now, and does it at the size the marks are read at.
 *
 * Stroke 1.9 on a 32-unit grid is 1.43px at 24px — heavier than the hairline
 * the large drawings use, because a 1px line at this size is what made the old
 * set look tentative on a non-retina screen.
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
  | "who";

const marks: Record<CraftMarkName, React.ReactNode> = {
  /*
   * Function-tested: a lens over the work, and the result of looking.
   *
   * The only circle-dominant mark in the set, which is what makes it findable
   * in a row. It replaced a probe descending onto a board — a better idea and
   * an unreadable shape, because at 24px a probe is a diagonal line and a
   * board is a rectangle, and the set already had four rectangles.
   */
  tested: (
    <>
      <circle cx="14" cy="14" r="9" className="fill-brand-400/10" />
      <circle cx="14" cy="14" r="9" />
      <path d="M20.5 20.5L27 27" />
      <path d="M10 14.5l3 3 5.5-6" className="stroke-brand-300" />
    </>
  ),

  /*
   * Nordic ready: one keycap, and the key that is the whole claim.
   *
   * A Danish layout is not a flag, it is three keys a supplier in southern
   * Europe does not ship. Drawn as a single cap rather than a whole keyboard:
   * a keyboard at 24px is a rectangle with lines in it, which is also what a
   * document, a chassis and a memory module look like at 24px.
   */
  nordic: (
    <>
      <rect x="4" y="4" width="24" height="24" rx="5" className="fill-brand-400/10" />
      <rect x="4" y="4" width="24" height="24" rx="5" />
      {/* An ellipse rather than a circle, inset well clear of the cap edge.
          Drawn as a circle filling the key it read as a prohibition sign —
          the one misreading a mark on a trust strip cannot afford. Letter
          proportions and air around them are what say "this is a glyph". */}
      <ellipse cx="16" cy="16" rx="4" ry="5.2" className="stroke-brand-300" />
      <path d="M13 19.8l6-7.6" className="stroke-brand-300" />
    </>
  ),

  /*
   * Business grade, not consumer models: the machine itself, in the posture
   * it is bought in. The trapezoid deck is the silhouette — nothing else in
   * the set has a sloped edge.
   */
  business: (
    <>
      <rect x="7" y="4" width="18" height="14" className="fill-brand-400/10" />
      <rect x="7" y="4" width="18" height="14" />
      <path d="M10 8h8" className="stroke-brand-300" />
      <path d="M7 18h18l4 6H3z" />
    </>
  ),

  /*
   * Sustainable choice: a machine that goes back round into service.
   *
   * Two runs and two cut heads, and nothing else. An earlier version put the
   * unit being returned in the middle of the loop; at 24px the loop closed
   * around it and the three shapes merged into one grey mass.
   */
  sustainable: (
    <>
      <path d="M6 11h16" className="stroke-brand-300" />
      <path d="M18.5 7l4 4-4 4" className="stroke-brand-300" />
      <path d="M26 21H10" className="stroke-brand-300" />
      <path d="M13.5 25l-4-4 4-4" className="stroke-brand-300" />
    </>
  ),

  /* Delivery across the Nordics: the thing that actually arrives. */
  delivery: (
    <>
      <rect x="3" y="8" width="14" height="11" className="fill-brand-400/10" />
      <rect x="3" y="8" width="14" height="11" />
      <path d="M17 11h5l5 5v3H17z" />
      <path d="M3 19h24" />
      <circle cx="9" cy="22.5" r="2.6" className="fill-brand-300 stroke-brand-300" />
      <circle cx="22" cy="22.5" r="2.6" />
    </>
  ),

  /*
   * What we set: two runs with a stop placed on each. A value chosen and
   * fixed, which is exactly what memory, disk, keyboard and language are on a
   * sourced machine.
   */
  adjust: (
    <>
      <path d="M4 11h24M4 21h24" />
      <rect x="17" y="7.5" width="5" height="7" className="fill-brand-300 stroke-brand-300" />
      <rect x="8" y="17.5" width="5" height="7" />
    </>
  ),

  /*
   * What the batch decides: a lot, stacked. Three units of decreasing width
   * so the shape reads as a pile from across the room, with the top one — the
   * one being decided — carrying the accent.
   */
  batch: (
    <>
      <rect x="4" y="20" width="24" height="6" />
      <rect x="6.5" y="13.5" width="19" height="6" />
      <rect x="9" y="7" width="14" height="6" className="fill-brand-300/25 stroke-brand-300" />
    </>
  ),

  /*
   * In writing before you order: a sheet with a folded corner, and the line
   * that makes it binding. The fold is the silhouette — it is the only
   * non-rectangular corner in the set.
   */
  written: (
    <>
      <path d="M7 3h12l6 6v20H7z" className="fill-brand-400/8" />
      <path d="M7 3h12l6 6v20H7z" />
      <path d="M19 3v6h6" />
      <path d="M11 15h10M11 19h10" />
      <path d="M11 23h6" className="stroke-brand-300" />
    </>
  ),

  /*
   * A sourcing partner, not a web shop: one node reaching several suppliers.
   * The shape of the business, drawn as the shape of the network.
   */
  network: (
    <>
      <rect x="3" y="12.5" width="8" height="7" className="fill-brand-400/12" />
      <rect x="3" y="12.5" width="8" height="7" />
      <path d="M11 16h5M16 16V7h5M16 16v9h5M16 16h5" />
      <rect x="21" y="3.5" width="7" height="7" className="stroke-brand-300" />
      <rect x="21" y="12.5" width="7" height="7" className="stroke-brand-300" />
      <rect x="21" y="21.5" width="7" height="7" className="stroke-brand-300" />
    </>
  ),

  /*
   * The advantage of holding no stock: the shelf is drawn and it is empty,
   * with the one unit that exists standing outside it — sourced for the order
   * rather than waiting to be sold.
   */
  "no-stock": (
    <>
      <path d="M4 5v22" />
      <path d="M4 9h12M4 16h12M4 23h12" strokeDasharray="3 3" className="opacity-55" />
      <rect x="19" y="11" width="10" height="10" className="fill-brand-300/25 stroke-brand-300" />
    </>
  ),

  /*
   * Who we help: three companies on one baseline, at three sizes. The claim is
   * the range — ten machines to a whole fleet — so the range is the drawing.
   * The door on the tallest is what stops it reading as a bar chart.
   */
  who: (
    <>
      <path d="M2 27h28" />
      <rect x="4" y="19" width="7" height="8" className="fill-brand-400/10" />
      <rect x="4" y="19" width="7" height="8" />
      <rect x="12.5" y="13" width="7" height="14" className="fill-brand-400/12" />
      <rect x="12.5" y="13" width="7" height="14" />
      <rect x="21" y="6" width="7" height="21" className="fill-brand-400/10 stroke-brand-300" />
      <path d="M23.5 27v-4h2v4" className="stroke-brand-300" />
    </>
  ),
};

/*
 * The same hand, at the size a list row allows.
 *
 * The hero's spec panel indexes six lines with a mark each. They cannot simply
 * be the marks above shrunk: those are composed on a 32-unit grid for 24-28px,
 * and at 20px their interior closes up. So this is a second, coarser set on a
 * 24-unit grid, four or five strokes each, drawn to the same conventions —
 * square caps, one accent, a wash on the subject.
 *
 * The two collisions this set used to have are the reason it was redrawn. The
 * SSD and the battery were both a rounded body with a filled block inside, and
 * the keyboard was a third; in a vertical list of six, three rows carried what
 * looked like the same picture. The SSD now leads with contact teeth and a
 * mounting hole, the battery with a terminal nub and a level, and the keyboard
 * with a grid of caps — three different outlines.
 */
export type SpecMarkName = "ram" | "ssd" | "keyboard" | "battery" | "tested" | "warranty";

const specMarks: Record<SpecMarkName, React.ReactNode> = {
  /* A memory module: body, contact teeth, one package on it. */
  ram: (
    <>
      <rect x="2" y="6" width="20" height="10" className="fill-brand-400/12" />
      <rect x="2" y="6" width="20" height="10" />
      <path d="M5 16v2.5M9 16v2.5M13 16v2.5M17 16v2.5" />
      <rect x="5" y="8.5" width="7" height="5" className="fill-brand-300 stroke-brand-300" />
    </>
  ),
  /* An M.2 stick: the key notch at the contact end, the mounting hole at the
     other. Long and thin, so it cannot be mistaken for the cell below it. */
  ssd: (
    <>
      <rect x="2" y="9.5" width="17" height="6" className="fill-brand-400/12" />
      <rect x="2" y="9.5" width="17" height="6" />
      {/* The key notch, which is the one feature every M.2 stick has and no
          battery does. The contact teeth that were here read as a muzzle. */}
      <path d="M6 9.5v6" className="stroke-brand-300" />
      <rect x="8.5" y="11" width="6" height="3" className="fill-brand-300 stroke-brand-300" />
      <circle cx="21" cy="12.5" r="1.5" />
    </>
  ),
  /* A keyboard in plan: a grid of caps, not two lines. The Nordic key is the
     one picked out, which is the only thing this row claims. */
  keyboard: (
    <>
      <rect x="2" y="6" width="20" height="12" rx="1.5" className="fill-brand-400/8" />
      <rect x="2" y="6" width="20" height="12" rx="1.5" />
      <path d="M5 9.5h2M9 9.5h2M13 9.5h2M17 9.5h2M5 14h8" />
      <rect x="15.5" y="12.5" width="4" height="3" className="fill-brand-300 stroke-brand-300" />
    </>
  ),
  /* A cell with its terminal and a measured level — the panel states a
     measured percentage, so the mark shows a level rather than a full cell. */
  battery: (
    <>
      <rect x="2" y="7" width="17" height="10" rx="1.5" />
      <path d="M20.5 10.5v3" className="stroke-[2.6]" />
      <rect x="4.5" y="9.5" width="8" height="5" className="fill-brand-300 stroke-brand-300" />
    </>
  ),
  /* The lens and the result, matching the mark of the same name above. */
  tested: (
    <>
      <circle cx="10.5" cy="10.5" r="7" className="fill-brand-400/12" />
      <circle cx="10.5" cy="10.5" r="7" />
      <path d="M15.5 15.5L21 21" />
      <path d="M7.5 10.8l2.3 2.3 4-4.6" className="stroke-brand-300" />
    </>
  ),
  /* The sheet and the seal that makes it binding. The circle is what tells it
     apart from the keyboard and the module in the same column. */
  warranty: (
    <>
      <path d="M3 2h10l5 5v15H3z" className="fill-brand-400/8" />
      <path d="M3 2h10l5 5v15H3z" />
      <path d="M13 2v5h5" />
      <path d="M6 11h8M6 14.5h5" />
      {/* Inside the sheet, not straddling its edge. Half on and half off, it
          read as a pie chart rather than as a seal. */}
      <circle cx="13.5" cy="17" r="2.8" className="fill-brand-300 stroke-brand-300" />
    </>
  ),
};

export function SpecMark({ name, className = "" }: { name: SpecMarkName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {specMarks[name]}
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
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {marks[name]}
    </svg>
  );
}
