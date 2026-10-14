import type { Localized, Lang } from "@/lib/i18n";

/*
 * The contents, as real links.
 *
 * Server-rendered anchors to ids that exist in the markup — not a script that
 * scans headings after hydration. A crawler follows them, a reader with
 * JavaScript off gets the same list, and Google can pick them up as sitelinks
 * for the article. That is the whole reason it exists; the convenience is a
 * side effect.
 *
 * On mobile it collapses into <details>. The links stay in the DOM either way,
 * because <details> hides its content without removing it.
 */
export type TocItem = { id: string; label: Localized };

const copy = {
  da: { title: "På denne side" },
  en: { title: "On this page" },
} satisfies Record<Lang, { title: string }>;

export default function ArticleToc({
  items,
  lang,
  className = "mt-10",
}: {
  items: TocItem[];
  lang: Lang;
  className?: string;
}) {
  if (items.length < 3) return null;

  const list = (
    <ol className="mt-3">
      {items.map((item, i) => (
        <li key={item.id} className="flex items-center gap-3 text-sm leading-5">
          <span aria-hidden="true" className="tabular-nums text-ink-500">
            {String(i + 1).padStart(2, "0")}
          </span>
          <a
            href={`#${item.id}`}
            className="inline-flex min-h-[44px] items-center py-1 text-ink-700 underline decoration-ink-300 underline-offset-4 transition hover:text-ink-900 hover:decoration-brand-600"
          >
            {item.label[lang]}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <nav aria-label={copy[lang].title} className={`border-l border-ink-300 pl-5 ${className}`}>
      {/* Open on a wide screen, foldable on a narrow one — same markup, so the
          links are in the DOM for a crawler in both cases. */}
      <details open className="group [&[open]>summary_svg]:rotate-180 sm:[&>summary]:hidden">
        <summary className="flex min-h-[44px] cursor-pointer list-none items-center gap-2 text-sm font-semibold text-ink-900 [&::-webkit-details-marker]:hidden">
          {copy[lang].title}
          <svg
            viewBox="0 0 20 20"
            className="h-4 w-4 text-ink-600 transition-transform"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M5 8l5 5 5-5" />
          </svg>
        </summary>
        <p className="hidden text-sm font-semibold text-ink-900 sm:block leading-[1.6]">
          {copy[lang].title}
        </p>
        {list}
      </details>
    </nav>
  );
}
