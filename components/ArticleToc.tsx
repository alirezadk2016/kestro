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

export default function ArticleToc({ items, lang }: { items: TocItem[]; lang: Lang }) {
  if (items.length < 3) return null;

  const list = (
    <ol className="mt-4 space-y-2.5">
      {items.map((item, i) => (
        <li key={item.id} className="flex gap-3 text-sm leading-6">
          <span aria-hidden="true" className="tabular-nums text-paper/35">
            {String(i + 1).padStart(2, "0")}
          </span>
          <a
            href={`#${item.id}`}
            className="text-paper/70 underline decoration-white/15 underline-offset-4 transition hover:text-paper hover:decoration-brand-300"
          >
            {item.label[lang]}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <nav aria-label={copy[lang].title} className="mt-10 border-l border-white/15 pl-5">
      {/* Open on a wide screen, foldable on a narrow one — same markup, so the
          links are in the DOM for a crawler in both cases. */}
      <details open className="group [&[open]>summary_svg]:rotate-180 sm:[&>summary]:hidden">
        <summary className="flex min-h-[44px] cursor-pointer list-none items-center gap-2 text-sm font-semibold text-paper [&::-webkit-details-marker]:hidden">
          {copy[lang].title}
          <svg
            viewBox="0 0 20 20"
            className="h-4 w-4 text-paper/45 transition-transform"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M5 8l5 5 5-5" />
          </svg>
        </summary>
        <p className="hidden text-sm font-semibold text-paper sm:block">{copy[lang].title}</p>
        {list}
      </details>
    </nav>
  );
}
