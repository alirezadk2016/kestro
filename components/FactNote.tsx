import { ChevronDown } from "lucide-react";
import Container from "./Container";
import SourceList from "./SourceList";
import { sourceList, type SourceId } from "@/lib/sources";
import type { Lang } from "@/lib/i18n";

/*
 * The outside facts a page leans on, stated and attributed.
 *
 * A page that says "Windows 10 is end of life" or "there are rules about
 * spare parts" is asking a buyer to act on something it has not shown. This
 * puts the underlying fact on the page in the words its source uses, names the
 * publisher, and links to the primary document — so a reader can check it and
 * a language model summarising the page has something checkable to quote
 * rather than an assertion to repeat.
 *
 * One line until it is opened. It was a full section with a display heading,
 * a plate per fact and a second list of the same sources — 400 to 1,550px at
 * the foot of fifteen pages, and the same Windows dates on seven of them. A
 * reader who wants the evidence taps "Kilder" and gets all of it; a reader who
 * does not, passes a single line with the publishers' names on it. The facts,
 * the links and the dates stay in the document either way, which is what a
 * crawler and an answer engine read. Pages cite only sources their own text
 * relies on (CLAUDE.md), so the line is short.
 */
const copy = {
  da: { label: "Kilder", title: "Hvad kilderne siger" },
  en: { label: "Sources", title: "What the sources say" },
} satisfies Record<Lang, Record<string, string>>;

export default function FactNote({ lang, ids }: { lang: Lang; ids: readonly SourceId[] }) {
  if (!ids.length) return null;
  const c = copy[lang];
  const items = sourceList(ids);
  const publishers = [...new Set(items.map((s) => s.publisher.replace(/\s*\(.*\)$/, "")))];

  return (
    <section className="border-t border-ink-200 bg-white">
      <Container>
        <details className="group">
          <summary className="flex min-h-[56px] cursor-pointer list-none items-center gap-3 py-3 [&::-webkit-details-marker]:hidden">
            <h2 className="label flex-none text-brand-700">
              <span className="sr-only">{c.title}: </span>
              {c.label}
            </h2>
            <span className="min-w-0 truncate text-sm text-ink-600">{publishers.join(" · ")}</span>
            <ChevronDown
              aria-hidden="true"
              className="ml-auto h-4 w-4 flex-none text-ink-600 transition-transform duration-200 group-open:rotate-180"
              strokeWidth={2}
            />
          </summary>
          <div className="grid grid-cols-1 gap-8 pb-10 pt-2 lg:grid-cols-12 lg:gap-12">
            <ul className="space-y-3 lg:col-span-7">
              {items.map((source) => (
                <li key={source.id} className="plate p-4 sm:p-5">
                  <p className="text-sm leading-[1.6] text-ink-700">{source.claim[lang]}</p>
                  <p className="mt-1 text-xs leading-[1.45] text-ink-600">
                    {source.publisher}
                    {source.published ? `, ${source.published}` : ""}
                  </p>
                </li>
              ))}
            </ul>
            <div className="lg:col-span-5">
              <SourceList lang={lang} ids={ids} compact quietHeading />
            </div>
          </div>
        </details>
      </Container>
    </section>
  );
}
