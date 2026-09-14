import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CraftMark, { type CraftMarkName } from "@/components/CraftMark";

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
    <div className="tilt h-full">
      <Link
        href={href}
        className="plate plate-lift tile tile-sheen group relative flex h-full flex-col p-4 sm:p-6"
      >
        <span className="tile-z tile-z-near plate-sm flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/[0.12] text-brand-300 sm:h-11 sm:w-11">
          <CraftMark name={mark} className="h-5 w-5 sm:h-6 sm:w-6" />
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
      </Link>
    </div>
  );
}
