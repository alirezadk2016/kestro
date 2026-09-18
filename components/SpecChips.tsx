import type { Lang } from "@/lib/i18n";
import { cardSpecs, type Model } from "@/lib/models";

/**
 * The two or three figures a buyer compares, on the card.
 *
 * A catalogue card that carries only a name and a sentence makes the reader
 * open every model to find out which one has the disk they need. These are the
 * same specifications the model page lists, cut to the figure — see CARD_CHIPS
 * in lib/models.ts for where each one comes from and what it leaves out.
 *
 * Spans rather than a list: the card is a single <a>, and the two places that
 * render one build it out of inline elements.
 *
 * .plate-sm is the control-size plate. Not a hand-rolled border and tint — a
 * chip is a small panel and gets the same lit lip as every other panel here,
 * which is the difference between a row of chips and a row of rectangles.
 */
export default function SpecChips({ model, lang }: { model: Model; lang: Lang }) {
  const chips = cardSpecs(model, lang);
  if (chips.length === 0) return null;

  return (
    <span className="mt-3 flex flex-wrap gap-1.5">
      {chips.map((chip) => (
        <span
          key={chip}
          className="plate-sm px-2 py-1 text-[11px] font-medium leading-none text-paper/70"
        >
          {chip}
        </span>
      ))}
    </span>
  );
}
