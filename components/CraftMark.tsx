/*
 * The small marks, drawn rather than picked.
 *
 * The five facts under the hero used to be lucide glyphs: a shield, a
 * briefcase, a leaf, a lorry. They are competent icons and they are on
 * several hundred thousand other sites, which is the problem — the row a
 * buyer sees first said "this is a website" rather than "this is Kestro".
 *
 * The site already has a drawing language and it is a good one:
 * ClusterMark, HeroMark and SpecFigure are orthographic, thin-stroked, one
 * implied light, depth from layering rather than shadow — an engineering
 * document rather than an illustration. That language stopped at the large
 * marks. These carry it down to 28px, which is the size the argument is
 * actually read at.
 *
 * What makes them read as one family, and as drawings rather than icons:
 *
 *   - square caps and joins, never round. Round caps are what almost every
 *     icon set uses and they read friendly; a square cut reads machined, and
 *     it is the single cheapest signal that these were drawn for this site;
 *   - registration ticks in two opposite corners of every mark, the way a
 *     drawing is aligned on a sheet. They are the family resemblance: whatever
 *     the subject is, the frame around it is identical;
 *   - one accent per mark and never more — the tested contact, the Ø key, the
 *     top plate, the return arc, the destination. Everything else is the same
 *     weight, so the eye is told exactly which part carries the meaning;
 *   - a wash at 5-10% on the one surface that is the subject, so the mark has
 *     a body without needing a shadow.
 *
 * Sized for 28px. The geometry sits on a 32-unit grid at stroke 1.5, which is
 * 1.31px rendered — a touch heavier than the hairline the big marks use,
 * because a 0.5px line at this size disappears on a non-retina screen.
 *
 * Every mark is aria-hidden: the fact is written in words immediately beside
 * it, and a screen reader gaining "drawing of a crate" would be noise.
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

/* The corner ticks, on every mark. Drawn once here rather than in each.
   Short and faint on purpose: at 28px a heavier tick stops being a frame and
   starts being a sixth stroke competing with the subject. */
const REGISTRATION = (
  <g className="stroke-current opacity-25">
    <path d="M2 5V2h3" />
    <path d="M30 27v3h-3" />
  </g>
);

const marks: Record<CraftMarkName, React.ReactNode> = {
  /*
   * Function-tested: a probe brought down onto a board, and the contact it
   * makes. Not a shield — a shield is a promise, and this is the act that
   * earns it.
   */
  tested: (
    <>
      <rect x="4" y="16" width="16" height="10" className="fill-brand-400/10" />
      <rect x="4" y="16" width="16" height="10" />
      <path d="M8 26v2M12 26v2M16 26v2" />
      {/* The probe, and the point it touches. One clean diagonal: the cross
          tick that was on it read as a broken pin rather than a tool. */}
      <path d="M28 6l-8 9" className="stroke-brand-300" />
      <circle cx="19.5" cy="16" r="1.8" className="fill-brand-300 stroke-brand-300" />
    </>
  ),

  /*
   * Nordic ready: a keyboard in plan, with the key that is the whole point of
   * the claim picked out. A Danish layout is not a flag, it is one extra
   * column on the right of the home row.
   */
  nordic: (
    <>
      <rect x="3" y="10" width="26" height="14" className="fill-brand-400/5" />
      <rect x="3" y="10" width="26" height="14" />
      <path d="M6 14h20M6 18h13" />
      {/* The key the sentence is about. */}
      <rect x="22" y="16.5" width="4" height="3.5" className="fill-brand-300 stroke-brand-300" />
    </>
  ),

  /*
   * Business grade: a chassis in section. Three plates, a dimension line
   * beside them — the difference between a business machine and a consumer
   * one is what is under the shell, so the mark is a cut through it.
   */
  business: (
    <>
      {/* Aligned, not offset. A one-unit stagger read as a wobble rather than
          as three plates of one assembly. */}
      <rect x="9" y="20" width="18" height="4" />
      <rect x="9" y="14" width="18" height="4" />
      <rect x="9" y="8" width="18" height="4" className="fill-brand-400/12 stroke-brand-300" />
      {/* The dimension the section is taken across. */}
      <path d="M5 8v16" className="opacity-45" />
      <path d="M3.5 8h3M3.5 24h3" className="opacity-45" />
    </>
  ),

  /*
   * Sustainable choice: a machine that goes back round into service.
   *
   * Drawn square rather than as a ring. The first version used two arcs with
   * arrowheads and at 28px the heads read as stray ticks and the arcs as
   * noise — four curves is more than this size can hold. Two straight runs
   * with a cut head at each end say the same thing in half the strokes, and
   * they sit in the orthographic language the rest of the marks are in.
   */
  sustainable: (
    <>
      <path d="M6 8h20" className="stroke-brand-300" />
      <path d="M23 5l3 3-3 3" className="stroke-brand-300" />
      <rect x="11" y="13" width="10" height="7" className="fill-brand-400/12" />
      <rect x="11" y="13" width="10" height="7" />
      <path d="M26 25H6" className="stroke-brand-300" />
      <path d="M9 22l-3 3 3 3" className="stroke-brand-300" />
    </>
  ),

  /*
   * Delivery across the Nordics: a crate, the route it travels, and where it
   * lands. The route is dashed because it is the part that is in progress;
   * the two ends are solid because they are facts.
   */
  delivery: (
    <>
      <rect x="4" y="16" width="12" height="10" className="fill-brand-400/10" />
      <rect x="4" y="16" width="12" height="10" />
      <path d="M4 19.5h12" />
      {/* The baseline that used to run under this collided with both the
          crate and a registration tick, so the route carries the ground on
          its own. */}
      <path d="M17 18c5-4 6-6 10-8" strokeDasharray="2.5 2.5" className="opacity-60" />
      <rect x="24" y="5" width="5" height="5" className="fill-brand-300 stroke-brand-300" />
    </>
  ),

  /*
   * What we set: two runs with a stop placed on each. A value chosen and
   * fixed, which is exactly what memory, disk, keyboard and language are on
   * a sourced machine.
   */
  adjust: (
    <>
      <path d="M4 12h24M4 21h24" />
      <rect x="17" y="9" width="4" height="6" className="fill-brand-300 stroke-brand-300" />
      <rect x="8" y="18" width="4" height="6" className="fill-brand-300 stroke-brand-300" />
    </>
  ),

  /*
   * What the batch decides: a lot with three units in it, and one of them
   * not yet known. The dashed unit is the whole point — it is the honest
   * part of the sentence, so it is the part the accent is spent on.
   */
  batch: (
    <>
      <rect x="4" y="9" width="24" height="16" />
      <rect x="7" y="14" width="6" height="8" className="fill-brand-400/12" />
      <rect x="7" y="14" width="6" height="8" />
      <rect x="14.5" y="14" width="6" height="8" className="fill-brand-400/12" />
      <rect x="14.5" y="14" width="6" height="8" />
      {/* A longer dash than the drawing's default: at 28px a 2/2 dash on a
          6-unit box closes up and reads solid, which loses the one
          distinction the mark exists to make. */}
      <rect x="22" y="14" width="6" height="8" strokeDasharray="3 2.5" className="stroke-brand-300" />
    </>
  ),

  /*
   * In writing before you order: a sheet, and the mark that makes it binding.
   * A plain document is every document; the stamp is the claim.
   */
  written: (
    <>
      <rect x="6" y="4" width="20" height="24" className="fill-brand-400/8" />
      <rect x="6" y="4" width="20" height="24" />
      <path d="M10 10h12M10 14h12M10 18h8" />
      <rect x="18" y="20" width="6" height="5" className="fill-brand-300 stroke-brand-300" />
    </>
  ),

  /*
   * A sourcing partner, not a web shop: one node reaching several suppliers.
   * The shape of the business, drawn as the shape of the network.
   */
  network: (
    <>
      <rect x="4" y="13" width="7" height="6" className="fill-brand-400/12" />
      <rect x="4" y="13" width="7" height="6" />
      <path d="M11 16h5M16 16V7h6M16 16v9h6M16 16h6" className="opacity-70" />
      <rect x="22" y="4" width="6" height="6" className="stroke-brand-300" />
      <rect x="22" y="13" width="6" height="6" className="stroke-brand-300" />
      <rect x="22" y="22" width="6" height="6" className="stroke-brand-300" />
    </>
  ),

  /*
   * The advantage of holding no stock: the shelf is drawn and it is empty,
   * with the one unit that exists standing outside it — sourced for the
   * order rather than waiting to be sold.
   */
  "no-stock": (
    <>
      <path d="M4 8h14M4 16h14M4 24h14" strokeDasharray="2 2" className="opacity-50" />
      <path d="M4 6v20" className="opacity-50" />
      <rect x="21" y="13" width="8" height="9" className="fill-brand-400/12 stroke-brand-300" />
      <path d="M21 16.5h8" className="stroke-brand-300" />
    </>
  ),

  /*
   * Who we help: three companies on one baseline, at three sizes. The claim
   * is the range, so the range is the drawing.
   */
  who: (
    <>
      <path d="M3 26h26" />
      <rect x="5" y="19" width="6" height="7" className="fill-brand-400/10" />
      <rect x="5" y="19" width="6" height="7" />
      <rect x="13" y="13" width="6" height="13" className="fill-brand-400/12" />
      <rect x="13" y="13" width="6" height="13" />
      <rect x="21" y="6" width="6" height="20" className="fill-brand-400/10 stroke-brand-300" />
    </>
  ),
};

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
      strokeWidth="1.5"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {REGISTRATION}
      {marks[name]}
    </svg>
  );
}
