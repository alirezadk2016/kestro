import { ArrowRight } from "lucide-react";
import { type CraftMarkName } from "@/components/CraftMark";
import ForgedPanel from "@/components/ForgedPanel";
import MarkWell from "@/components/MarkWell";

/*
 * A card that goes somewhere, and looks like it.
 *
 * The grids on this site were <div>s: flat, inert, and with the explanation
 * they were summarising nowhere on the page. A visitor reading "Batteriskift —
 * batteriet er en af de billigste dele at skifte" has an obvious next
 * question, and the tile is where it gets asked, so the tile is where the
 * answer has to be one click away.
 *
 * The material is ForgedPanel and the mark is MarkWell; both carry their own
 * reasoning. What matters here is that the whole card is one link — not a card
 * with a link in the corner, which is forty pixels of target on a phone where
 * there could be two hundred.
 *
 * `headingLevel` is not styling. On /reparation these sit under "Hvad vi
 * laver", so the card titles are h3; on /ydelser the grid is the first thing
 * under the h1, so they are h2. Hard-coding h3 made that page skip a level and
 * the content gate failed the build for it, which is the gate working — a
 * heading level is part of the page's outline, and the outline is what an
 * audit and a screen reader both read.
 */
export default function ServiceTile({
  href,
  mark,
  title,
  summary,
  prompt,
  headingLevel = 3,
}: {
  href: string;
  mark: CraftMarkName;
  title: string;
  summary: string;
  /** "Læs mere". Hidden until the card is pointed at or focused. */
  prompt: string;
  /** Whatever keeps the page's outline unbroken where the grid sits. */
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <ForgedPanel href={href}>
      <MarkWell mark={mark} className="tile-z tile-z-near" />

      <Heading className="tile-z tile-z-far mt-4 text-sm font-semibold text-paper group-hover:text-brand-200 sm:text-base">
        {title}
      </Heading>
      <p className="tile-z tile-z-far mt-2 flex-1 text-xs leading-[1.6] text-paper/65 sm:text-sm">
        {summary}
      </p>

      <span className="tile-prompt mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-300">
        {prompt}
        <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
      </span>
    </ForgedPanel>
  );
}
