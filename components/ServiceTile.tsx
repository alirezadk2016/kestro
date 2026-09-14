import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { type CraftMarkName } from "@/components/CraftMark";
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
          {/*
            The mark as a rendered object, not a drawing of one.

            scripts/build/marks3d renders every CraftMark through the cards'
            own studio — extruded, given side walls, lit by the same warm key
            and cool kicker. Measured against a size ladder it is mush at 28px,
            starts to read at 44 and is good at 56, which is the whole reason
            this well is 64px rather than the 48 it was: a 3D icon in a small
            plate is strictly worse than a flat one, and shipping it anyway
            because it is "more 3D" would be the same mistake the flat set made
            when it was composed at 96 and deployed at 24.

            Decorative: the repair is named in the heading directly below it.
          */}
          <span className="tile-z tile-z-near well flex h-16 w-16 items-center justify-center rounded-xl sm:h-[72px] sm:w-[72px]">
            <img
              src={`/marks3d/${mark}.webp`}
              alt=""
              width={52}
              height={52}
              loading="lazy"
              decoding="async"
              className="h-11 w-11 sm:h-[52px] sm:w-[52px]"
            />
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
