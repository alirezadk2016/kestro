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
 * Deliberately separated from the page's own argument by a heading that says
 * what it is. These are not Kestro's numbers and are not presented as if they
 * were; the site's own claims stay in the site's own voice, above.
 */
const copy = {
  da: { eyebrow: "Baggrund", title: "Hvad kilderne siger" },
  en: { eyebrow: "Background", title: "What the sources say" },
} satisfies Record<Lang, Record<string, string>>;

export default function FactNote({ lang, ids }: { lang: Lang; ids: readonly SourceId[] }) {
  if (!ids.length) return null;
  const c = copy[lang];

  return (
    <section className="border-t border-white/10 bg-brand-950 py-10 sm:py-20" data-reveal>
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <span className="eyebrow text-brand-300">{c.eyebrow}</span>
            <h2 className="mt-4 font-display text-2xl font-extrabold leading-tight tracking-display text-paper sm:text-3xl">
              {c.title}
            </h2>
            <ul className="mt-6 space-y-5">
              {sourceList(ids).map((source) => (
                <li key={source.id} className="border-l-2 border-brand-500/40 pl-4">
                  <p className="text-sm leading-[1.6] text-paper/75">{source.claim[lang]}</p>
                  <p className="mt-1 text-xs text-paper/55 leading-[1.45]">
                    {source.publisher}
                    {source.published ? `, ${source.published}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5">
            <SourceList lang={lang} ids={ids} />
          </div>
        </div>
      </Container>
    </section>
  );
}
