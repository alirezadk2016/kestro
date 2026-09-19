/*
 * The small marks, drawn rather than picked.
 *
 * The five facts under the hero used to be lucide glyphs: a shield, a
 * briefcase, a leaf, a lorry. They are competent icons and they are on several
 * hundred thousand other sites, which is the problem — the row a buyer sees
 * first said "this is a website" rather than "this is Kestro". That reasoning
 * still holds and these are still drawn here.
 *
 * ## The grid, which is why the set looked soft
 *
 * These were composed on a 32-unit grid with a 1.9 stroke and rendered at
 * 24px, which puts the stroke at **1.425 device pixels**. A 1.425px line
 * cannot sit on a pixel: every edge in the set was drawn as two grey
 * half-pixels, so twenty marks that are individually fine read as blurred and
 * tentative on any screen that is not retina. No amount of redrawing fixes
 * that, and it is the first thing to get right.
 *
 * So: a **24-unit grid with a 2-unit stroke, rendered at 24px**. One unit is
 * one pixel, the stroke is exactly two, and geometry sits on integers so both
 * edges of every line land on a pixel boundary. The instances that render at
 * 20 and 28 scale proportionally, which is what an icon set is supposed to do;
 * the 24px ones — the process strip, the feature row, the service tiles — are
 * exact.
 *
 * `strokeLinecap` is `butt`, not `square`. Square caps extend a line by half
 * its width PAST the endpoint, so with a 2-unit stroke every terminal
 * overshot by a full unit: the magnifier's handle ran a pixel long, the
 * network's connectors ran into their boxes, and the set picked up a blunt,
 * approximate quality that is exactly what "amateur" looks like. The machined
 * character comes from the joins and the geometry, which are still miter and
 * still square.
 *
 * ## The rules a mark has to pass
 *
 * Each is built silhouette-first: identifiable from its outline alone, no more
 * than four interior strokes, and no two marks in the set sharing a dominant
 * shape. A circle (tested), a keycap (nordic), a trapezoid (business), a loop
 * (sustainable), a van (delivery), a stack (batch) — tell them apart squinting.
 *
 *   - **One optical weight.** Every mark works inside a live area of 2–22 and
 *     its dominant shape spans at least 14 of those units. `nordic` used to be
 *     a filled tile running the full 32 units edge to edge, which in a row of
 *     line drawings was a solid block — not a heavier icon, a different
 *     species. Nothing bleeds to the edge now.
 *   - **One accent, and it is small.** `sustainable` was drawn entirely in
 *     brand-300: every stroke an accent is the same as no accent, and in a
 *     four-mark row it was the one that glowed. The accent marks the part that
 *     carries the meaning — the tick, the Ø, the returning arrow, the top unit
 *     of the lot — and everything else is the same weight.
 *   - **One wash**, brand-400 at 8–12%, on the single surface that is the
 *     subject, so a mark has a body without needing a shadow.
 *
 * The registration ticks are gone. They were the family resemblance and they
 * were designed for a size nothing on this site uses: a 3-unit tick at 25%
 * opacity is a sub-pixel grey speck that costs a fifth of the box and reads as
 * dirt. The silhouette does that job now, at the size the marks are read at.
 *
 * `node scripts/design/marks-sheet.mjs` renders the whole set at 20, 24 and
 * 28px beside a 6x blow-up of each. Look at the 24px row, not the blow-up:
 * every failure this set has had was invisible at 6x and obvious at 1x.
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
  /* The service marks. Added when the repair, fleet and services pages were
     brought into this language — see the note above the set below. */
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

const marks: Record<CraftMarkName, React.ReactNode> = {
  /*
   * Function-tested: a lens over the work, and the result of looking.
   *
   * The only circle-dominant mark in the set, which is what makes it findable
   * in a row. The handle used to run from the rim to the far corner of the
   * box — a diagonal half again as long as the lens is wide, which unbalanced
   * the whole mark and, with the old square caps, ended in a blunt stub. It is
   * proportionate now and stops short of the corner.
   */
  tested: (
    <>
      <circle cx="10" cy="10" r="6.5" className="fill-brand-400/10" />
      <circle cx="10" cy="10" r="6.5" />
      <path d="M15 15l5.5 5.5" />
      <path d="M7 10.5l2.5 2.5L14 7.5" className="stroke-brand-300" />
    </>
  ),

  /*
   * Nordic ready: the keys, drawn as keys.
   *
   * This was the letter Ø, and before that a ringed Ø, and the comments those
   * two passes left behind are a record of the same mistake being refined
   * rather than fixed. A letterform is not a pictogram. In a row whose other
   * four marks are a lens, a machine, two arrows and a van, one glyph in a
   * tinted box is the only thing a reader has to *read* instead of recognise —
   * and at 24px a stroked bowl with a stroke through it is the drawing of a
   * prohibition sign whatever the slash overshoot does. Two passes were spent
   * trying to stop it saying "no". The answer was that it should not have been
   * a letter.
   *
   * The claim is a Danish/Norwegian keyboard. So: three caps on a deck, the
   * last one carrying the accent, because the difference between a Nordic
   * layout and a southern-European one is the keys on the end of the row. It
   * is a picture of the thing, it cannot be misread as a symbol, and it is the
   * only mark in the set with repeated elements — which makes it findable in
   * the strip without being loud.
   */
  nordic: (
    <>
      <rect x="2" y="7" width="6" height="6" rx="1.4" className="fill-brand-400/10" />
      <rect x="2" y="7" width="6" height="6" rx="1.4" />
      <rect x="9" y="7" width="6" height="6" rx="1.4" className="fill-brand-400/10" />
      <rect x="9" y="7" width="6" height="6" rx="1.4" />
      <rect x="16" y="7" width="6" height="6" rx="1.4" className="fill-brand-400/28" />
      <rect x="16" y="7" width="6" height="6" rx="1.4" className="stroke-brand-300" />
      {/* The deck the caps stand on. Without it three squares in a row are
          three squares in a row. */}
      <path d="M2 17.5h20" />
    </>
  ),

  /*
   * Business grade, not consumer models: the machine itself, in the posture
   * it is bought in. The trapezoid deck is the silhouette — nothing else in
   * the set has a sloped edge.
   */
  business: (
    <>
      <rect x="5" y="3" width="14" height="10" className="fill-brand-400/10" />
      <rect x="5" y="3" width="14" height="10" />
      <path d="M8 6h6" className="stroke-brand-300" />
      <path d="M5 13h14l3 5H2z" />
    </>
  ),

  /*
   * Sustainable choice: a machine that goes back round into service.
   *
   * Two runs and two heads. It used to be drawn entirely in the accent colour,
   * which in a row of four made it the one that glowed — every stroke an
   * accent is the same as no accent. The returning head carries it now and the
   * rest is the set's own weight.
   */
  sustainable: (
    <>
      <path d="M4 9h13" />
      <path d="M14 6l3 3-3 3" />
      <path d="M20 15H7" />
      <path d="M10 12l-3 3 3 3" className="stroke-brand-300" />
    </>
  ),

  /* Delivery across the Nordics: the thing that actually arrives. One wheel
     used to be filled and the other outlined, for no reason a reader could
     recover; the accent is on the load now, which is the part that is theirs. */
  delivery: (
    <>
      <rect x="3" y="7" width="10" height="8" className="fill-brand-400/10" />
      <rect x="3" y="7" width="10" height="8" />
      <path d="M13 9h4l4 4v2h-8z" />
      <path d="M6 10.5h4" className="stroke-brand-300" />
      <circle cx="7" cy="17.5" r="2" />
      <circle cx="17" cy="17.5" r="2" />
    </>
  ),

  /*
   * What we set: one value, placed on a scale.
   *
   * Two rails with a stop on each was the idea and it did not survive the
   * size: four elements in a 20-unit box, and at 24px the handles sat on the
   * rails as an indistinct smear. One rail, one stop and a scale under it says
   * the same thing — a value chosen and fixed, which is what memory, disk,
   * keyboard and language are on a sourced machine — and it is the only mark
   * in the set with a scale, so it is findable in a row.
   */
  adjust: (
    <>
      <path d="M3 9h18" />
      <rect x="13" y="6" width="5" height="6" className="fill-brand-300/25 stroke-brand-300" />
      <path d="M4 16v3M8 16v3M12 16v3M16 16v3M20 16v3" />
    </>
  ),

  /*
   * What the batch decides: a lot, stacked. Three units of decreasing width
   * so the shape reads as a pile from across the room, with the top one — the
   * one being decided — carrying the accent.
   */
  batch: (
    <>
      <rect x="3" y="16" width="18" height="5" />
      <rect x="5" y="10.5" width="14" height="5" />
      <rect x="7" y="5" width="10" height="5" className="fill-brand-300/25 stroke-brand-300" />
    </>
  ),

  /*
   * In writing before you order: a sheet with a folded corner, and the line
   * that makes it binding. The fold is the silhouette — it is the only
   * non-rectangular corner in the set.
   */
  written: (
    <>
      <path d="M5 3h9l5 5v13H5z" className="fill-brand-400/8" />
      <path d="M5 3h9l5 5v13H5z" />
      <path d="M14 3v5h5" />
      <path d="M8 12h8M8 16h8" />
      <path d="M8 19h5" className="stroke-brand-300" />
    </>
  ),

  /*
   * A sourcing partner, not a web shop: one buyer reaching several suppliers.
   *
   * Three suppliers used to hang off the node, at 4.5 units each — under five
   * pixels, which is a grey speck, and the mark was the least legible in the
   * set. Two at six units read; the claim is "a network", and two nodes and a
   * branch is a network.
   */
  network: (
    <>
      <rect x="2" y="9" width="6" height="6" className="fill-brand-400/12" />
      <rect x="2" y="9" width="6" height="6" />
      <path d="M8 12h4M12 6v12M12 6h3M12 18h3" />
      <rect x="15" y="3" width="6" height="6" className="stroke-brand-300" />
      <rect x="15" y="15" width="6" height="6" className="stroke-brand-300" />
    </>
  ),

  /*
   * The advantage of holding no stock: the shelf is drawn and it is empty,
   * with the one unit that exists standing outside it — sourced for the order
   * rather than waiting to be sold.
   *
   * The shelves were dashed at 55% opacity, which at 24px is nothing at all —
   * the mark was a vertical bar and a square. Solid and short: the emptiness
   * is carried by the gap between the shelf and the unit, not by a faint line.
   */
  "no-stock": (
    <>
      <path d="M3 3v18" />
      <path d="M3 6.5h6M3 12h6M3 17.5h6" />
      <rect x="14.5" y="8.5" width="7" height="7" className="fill-brand-300/25 stroke-brand-300" />
    </>
  ),

  /*
   * Who we help: one company, drawn as a building.
   *
   * It was three buildings at three heights on a baseline, which is a bar
   * chart — and every attempt to argue it out of being one failed, because a
   * door at 24px is two pixels and a chart column with a two-pixel notch is
   * still a chart column. Worse, the accent used to sit on the tallest, which
   * is exactly how a chart highlights a value.
   *
   * The range the copy claims — ten machines to a whole fleet — is a sentence,
   * and it is written immediately beside this mark. The mark's job is to say
   * "a company", and the only thing that reads as a building at this size is
   * a grid of windows with a door under it. It is also the only tall rectangle
   * in the set with a grid inside, so it survives a row.
   */
  who: (
    <>
      <rect x="5" y="3" width="14" height="18" className="fill-brand-400/10" />
      <rect x="5" y="3" width="14" height="18" />
      <path d="M8 7h3M13 7h3M8 11h3M13 11h3" />
      <path d="M10 21v-5h4v5" className="stroke-brand-300" />
    </>
  ),

  /*
   * The service marks.
   *
   * /reparation, /ydelser, /flaadeloesninger and /saelg-til-os listed their
   * services with lucide glyphs in the same plates these marks sit in — so
   * the site ran two icon languages at once, one with round caps and one with
   * square, and a visitor moving from the front page to Repairs crossed from
   * one product into another. The split that remains is the one worth having:
   * lucide for interface affordances (the arrow on a link, the chevron on a
   * menu, the tick in a list), these for anything that names a subject.
   *
   * Same rules as above — silhouette first, four interior strokes, one accent.
   * The gear is the only circle with teeth, the spanner the only diagonal, the
   * heatsink the only run of fins, so they survive a row of twelve.
   */

  /* A screen on a pedestal. The laptop mark is the trapezoid; this is the one
     with a foot, which is what tells the two apart at 24px. */
  screen: (
    <>
      <rect x="3" y="4" width="18" height="12" className="fill-brand-400/10" />
      <rect x="3" y="4" width="18" height="12" />
      <path d="M12 16v4" />
      <path d="M8 20h8" className="stroke-brand-300" />
    </>
  ),

  /* A spanner. The only diagonal silhouette in the set. */
  repair: (
    <>
      <path
        d="M15.4 3.4a4.9 4.9 0 00-6.3 6.3L3 15.8l2.6 2.6 6.1-6.1a4.9 4.9 0 006.3-6.3l-2.7 2.7-2.3-2.3z"
        className="fill-brand-400/10"
      />
      <path d="M15.4 3.4a4.9 4.9 0 00-6.3 6.3L3 15.8l2.6 2.6 6.1-6.1a4.9 4.9 0 006.3-6.3l-2.7 2.7-2.3-2.3z" />
      <path d="M5 16.2l1.5 1.5" className="stroke-brand-300" />
    </>
  ),

  /* A gear: the only toothed circle. */
  parts: (
    <>
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2.1 2.1M16.9 16.9L19 19M19 5l-2.1 2.1M7.1 16.9L5 19" />
      <circle cx="12" cy="12" r="6" className="fill-brand-400/10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2.2" className="stroke-brand-300" />
    </>
  ),

  /* A heatsink with the air moving over it: a run of fins under two passes.
     The only comb shape in the set. The air is the accent, because cooling is
     the air rather than the metal. */
  cooling: (
    <>
      <path d="M3 5c2.2 2.2 4.5-2.2 6.8 0s4.5-2.2 6.8 0" className="stroke-brand-300" />
      <path
        d="M3 9.5c2.2 2.2 4.5-2.2 6.8 0s4.5-2.2 6.8 0"
        className="stroke-brand-300 opacity-55"
      />
      <rect x="3" y="14" width="18" height="7" className="fill-brand-400/10" />
      <path d="M7 14v7M11 14v7M15 14v7M19 14v7" />
    </>
  ),

  /* A system being written onto the machine: the arrow down into a drive. */
  install: (
    <>
      <path d="M12 3v9M8 9l4 4 4-4" className="stroke-brand-300" />
      <rect x="3" y="16" width="18" height="5" className="fill-brand-400/10" />
      <rect x="3" y="16" width="18" height="5" />
      <path d="M6 18.5h2.5" />
    </>
  ),

  /* A processor: the only square with legs on all four sides. */
  assembly: (
    <>
      <rect x="6" y="6" width="12" height="12" className="fill-brand-400/10" />
      <rect x="6" y="6" width="12" height="12" />
      <rect x="10" y="10" width="4" height="4" className="stroke-brand-300" />
      <path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" />
    </>
  ),

  /* A calendar: the lead time, which is the thing a fleet buyer asks for. */
  schedule: (
    <>
      <rect x="3" y="5" width="18" height="16" className="fill-brand-400/8" />
      <rect x="3" y="5" width="18" height="16" />
      <path d="M3 10h18" />
      <path d="M8 2v4M16 2v4" />
      <rect x="7" y="13" width="4" height="4" className="fill-brand-300/30 stroke-brand-300" />
    </>
  ),

  /* A memory module, at the 24-grid size. The spec panel has its own. */
  memory: (
    <>
      <rect x="3" y="7" width="18" height="9" className="fill-brand-400/12" />
      <rect x="3" y="7" width="18" height="9" />
      <path d="M6 16v3M10 16v3M14 16v3M18 16v3" />
      <rect x="6" y="9.5" width="7" height="4" className="fill-brand-300/30 stroke-brand-300" />
    </>
  ),

  /* A cell with a measured level. */
  battery: (
    <>
      <rect x="3" y="8" width="16" height="9" rx="1.5" />
      <path d="M21 11v3" className="stroke-[3]" />
      <rect x="5.5" y="10.5" width="7" height="4" className="fill-brand-300/35 stroke-brand-300" />
    </>
  ),

  /* A keyboard in plan, with the Nordic key picked out. The single keycap is
     the "nordic" mark; this is the whole board, for a row that is about the
     hardware rather than about the layout. */
  keyboard: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="1.5" className="fill-brand-400/8" />
      <rect x="3" y="6" width="18" height="12" rx="1.5" />
      <path d="M6 10h2M11 10h2M16 10h2M6 14h7" />
      <rect x="15" y="12.5" width="4" height="3" className="fill-brand-300/30 stroke-brand-300" />
    </>
  ),
};

/*
 * The same hand, at the size a list row allows.
 *
 * The hero's spec panel indexes six lines with a mark each, at 20px. They
 * cannot be the marks above shrunk — those are composed on a 24-unit grid for
 * 24px, and scaling that to 20 puts the stroke at 1.67 device pixels, which is
 * the same off-grid blur the whole set was redrawn to escape. So this is a
 * second, coarser set on a **20-unit grid with a 2-unit stroke**, drawn to the
 * same conventions: square joins, butt caps, one accent, a wash on the subject.
 *
 * The two collisions this set used to have are the reason it was redrawn. The
 * SSD and the battery were both a rounded body with a filled block inside, and
 * the keyboard was a third; in a vertical list of six, three rows carried what
 * looked like the same picture. The SSD leads with its key notch, the battery
 * with a terminal nub and a level, and the keyboard with a grid of caps.
 */
export type SpecMarkName = "ram" | "ssd" | "keyboard" | "battery" | "tested" | "warranty";

const specMarks: Record<SpecMarkName, React.ReactNode> = {
  /* A memory module: body, contact teeth, one package on it. */
  ram: (
    <>
      <rect x="2" y="5" width="16" height="8" className="fill-brand-400/12" />
      <rect x="2" y="5" width="16" height="8" />
      <path d="M5 13v2M8 13v2M11 13v2M14 13v2" />
      <rect x="4" y="7" width="6" height="4" className="fill-brand-300/30 stroke-brand-300" />
    </>
  ),
  /* An M.2 stick: the key notch at the contact end, the mounting hole at the
     other. Long and thin, so it cannot be mistaken for the cell below it. */
  ssd: (
    <>
      <rect x="2" y="7" width="14" height="6" className="fill-brand-400/12" />
      <rect x="2" y="7" width="14" height="6" />
      <path d="M5 7v6" />
      <rect x="7.5" y="8.5" width="5" height="3" className="fill-brand-300/30 stroke-brand-300" />
      <circle cx="18" cy="10" r="1.2" />
    </>
  ),
  /* A keyboard in plan: a grid of caps, not two lines. The Nordic key is the
     one picked out, which is the only thing this row claims. */
  keyboard: (
    <>
      <rect x="2" y="5" width="16" height="10" rx="1.5" className="fill-brand-400/8" />
      <rect x="2" y="5" width="16" height="10" rx="1.5" />
      <path d="M5 8h2M9 8h2M13 8h2M5 12h5" />
      <rect
        x="12.5"
        y="10.5"
        width="3.5"
        height="2.5"
        className="fill-brand-300/30 stroke-brand-300"
      />
    </>
  ),
  /* A cell with its terminal and a measured level — the panel states a
     measured percentage, so the mark shows a level rather than a full cell. */
  battery: (
    <>
      <rect x="2" y="6" width="14" height="8" rx="1.5" />
      <path d="M17.5 8.5v3" className="stroke-[3]" />
      <rect x="4" y="8" width="6" height="4" className="fill-brand-300/35 stroke-brand-300" />
    </>
  ),
  /* The lens and the result, matching the mark of the same name above. */
  tested: (
    <>
      <circle cx="8.5" cy="8.5" r="5.5" className="fill-brand-400/12" />
      <circle cx="8.5" cy="8.5" r="5.5" />
      <path d="M12.5 12.5l4 4" />
      <path d="M6 9l2 2 3.5-4" className="stroke-brand-300" />
    </>
  ),
  /* The sheet and the seal that makes it binding. The circle is what tells it
     apart from the keyboard and the module in the same column. */
  warranty: (
    <>
      <path d="M3 2h8l4 4v12H3z" className="fill-brand-400/8" />
      <path d="M3 2h8l4 4v12H3z" />
      <path d="M11 2v4h4" />
      <path d="M6 10h6M6 13h4" />
      <circle cx="12" cy="14.5" r="2.4" className="fill-brand-300/35 stroke-brand-300" />
    </>
  ),
};

export function SpecMark({ name, className = "" }: { name: SpecMarkName; className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="butt"
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
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="butt"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {marks[name]}
    </svg>
  );
}
