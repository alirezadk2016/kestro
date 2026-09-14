import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CraftMark, { type CraftMarkName } from "@/components/CraftMark";
import PointerLight from "@/components/PointerLight";

/*
 * A card that goes somewhere, and looks like it.
 *
 * The grids on this site were <div>s: flat, inert, and with the explanation
 * they were summarising nowhere on the page. A visitor reading "Batteriskift —
 * batteriet er en af de billigste dele at skifte" has an obvious next
 * question, and the tile is where it gets asked, so the tile is where the
 * answer has to be one click away.
 *
 * The depth belongs to the CSS in globals.css. What matters here is that the
 * whole card is one link — not a card with a link in the corner, which is
 * forty pixels of target on a phone where there could be two hundred.
 *
 * The material is .forge rather than .plate: a machined edge, a well the mark
 * is cut into rather than a chip it sits on, an accent line along the top and
 * a highlight that tracks the pointer. A card whose subject is an object wants
 * an edge you could run a thumbnail along; .plate is right for a panel that is
 * mostly type, and it stays the default everywhere else.
 */
export default function ServiceTile({
  href,
  mark,
  title,
  summary,
  prompt,
}: {
  href: string;
  mark: CraftMarkName;
  title: string;
  summary: string;
  /** "Læs mere". Hidden until the card is pointed at or focused. */
  prompt: string;
}) {
  return (
    <PointerLight>
      <Link
        href={href}
        className="forge forge-rim tile tile-sheen group relative flex h-full flex-col rounded-xl p-[5px] sm:p-[6px]"
      >
        {/* The frame holds a face, and the face holds the card. Two surfaces at
            two depths is the whole thing — see .forge-face in globals.css. */}
        <span className="forge-face flex h-full flex-col rounded-[8px] p-4 sm:p-5">
          <span className="tile-z tile-z-near well flex h-12 w-12 items-center justify-center rounded-lg text-brand-300 sm:h-14 sm:w-14">
            <CraftMark name={mark} className="mark-cut h-6 w-6 sm:h-7 sm:w-7" />
          </span>

          <h3 className="tile-z tile-z-far mt-4 text-sm font-semibold text-paper group-hover:text-brand-200 sm:text-base">
            {title}
          </h3>
          <p className="tile-z tile-z-far mt-2 flex-1 text-xs leading-[1.6] text-paper/65 sm:text-sm">
            {summary}
          </p>

          <span className="tile-prompt mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-300">
            {prompt}
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
          </span>
        </span>
      </Link>
    </PointerLight>
  );
}
