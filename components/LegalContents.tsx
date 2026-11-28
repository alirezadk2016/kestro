import type { Lang } from "@/lib/i18n";

/** A stable fragment for a legal heading, from its Danish text. */
export const legalAnchor = (text: string) =>
  text
    .toLowerCase()
    .replace(/æ/g, "ae")
    .replace(/ø/g, "oe")
    .replace(/å/g, "aa")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/*
 * The contents of a legal page, beside the document from lg (28 November 2026).
 *
 * The terms and the privacy policy were a 768px sheet on the left of a light
 * band and nothing on the right: at 1440 more than half the width was empty,
 * on the two pages a reader is most likely to look for one clause in. The
 * column now holds the clause list, in view while the document scrolls. On a
 * phone the document is the page; the list is not repeated above it.
 */
export default function LegalContents({
  lang,
  items,
}: {
  lang: Lang;
  items: { id: string; label: string }[];
}) {
  const label = lang === "da" ? "Indhold" : "Contents";
  return (
    <nav aria-label={label} className="hidden lg:sticky lg:top-28 lg:block">
      <p className="text-sm font-semibold text-ink-900">{label}</p>
      <ol className="mt-3 border-l border-ink-200">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="-ml-px flex min-h-[44px] items-center border-l-2 border-transparent py-1.5 pl-4 text-sm leading-5 text-ink-700 transition-colors hover:border-brand-600 hover:text-ink-900"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
