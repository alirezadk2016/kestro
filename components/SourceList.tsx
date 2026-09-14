import { sourceList, type SourceId } from "@/lib/sources";
import type { Lang } from "@/lib/i18n";

/*
 * The references under a page that states a fact it did not establish itself.
 *
 * Every entry names the publisher, the document and the date it was read, and
 * links to the primary source rather than to something quoting it. That is the
 * ordinary standard for a claim a buyer is being asked to act on, and it is
 * also the one signal a language model can check: a page that says "e-waste is
 * rising" is an opinion, and a page that says it, gives the figure, and points
 * at the report the figure came from is evidence.
 *
 * The wording of each claim lives in lib/sources.ts beside the URL it came
 * from, so a page cannot drift away from what its source actually says.
 */
export default function SourceList({
  lang,
  ids,
  className = "",
}: {
  lang: Lang;
  ids: readonly SourceId[];
  className?: string;
}) {
  if (!ids.length) return null;
  const items = sourceList(ids);
  const heading = lang === "da" ? "Kilder" : "Sources";
  const read = lang === "da" ? "Læst" : "Read";

  return (
    <div className={className}>
      <h2 className="label text-brand-300">{heading}</h2>
      <ol className="mt-4 space-y-4">
        {items.map((source, index) => (
          <li key={source.id} className="flex gap-3 text-sm leading-6">
            <span className="font-mono text-xs leading-6 text-paper/55 tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <a
                href={source.url}
                rel="noopener nofollow"
                target="_blank"
                className="font-semibold text-brand-300 underline decoration-brand-400/50 decoration-1 underline-offset-4 transition hover:text-paper"
              >
                <cite className="not-italic">{source.title[lang]}</cite>
              </a>
              <p className="mt-0.5 text-paper/55">
                {source.publisher}
                {source.published ? `, ${source.published}` : ""} · {read}{" "}
                <time dateTime={source.accessed}>{source.accessed}</time>
              </p>
              <p className="mt-1.5 text-paper/70">{source.claim[lang]}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
