import Link from "next/link";
import TeamAvatar from "./TeamAvatar";
import { teamMember } from "@/lib/company";
import { formatDate, localePath, type Lang } from "@/lib/i18n";

/*
 * Who wrote it, and why they would know.
 *
 * Article schema carried author: Organization, which says nothing a reader or
 * a search engine can weigh. The company has a named technical director whose
 * stated job is checking that specifications are correct before a machine is
 * presented — which is exactly the claim these articles make. Putting a name,
 * a face and a role on the page is the cheapest credibility this site can buy,
 * and none of it is invented: every field comes from lib/company.ts.
 *
 * The name links to that person's real card on /om-os rather than to an author
 * archive that would be a thin page with one entry.
 */
const copy = {
  da: { by: "Skrevet af", updated: "Opdateret", reading: "min. læsning" },
  en: { by: "Written by", updated: "Updated", reading: "min read" },
} satisfies Record<Lang, Record<string, string>>;

export default function AuthorByline({
  authorId,
  updated,
  readingMinutes,
  lang,
}: {
  authorId: string;
  updated: string;
  readingMinutes: number;
  lang: Lang;
}) {
  const author = teamMember(authorId);
  const c = copy[lang];

  return (
    <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-ink-200 pt-6">
      <TeamAvatar member={author} lang={lang} size={40} className="h-10 w-10 flex-shrink-0" />
      <p className="text-sm leading-[1.6] text-ink-700">
        <span className="sr-only">{c.by} </span>
        <Link
          href={`${localePath("/om-os", lang)}#${author.id}`}
          className="font-semibold text-ink-900 underline decoration-ink-300 underline-offset-4 transition hover:decoration-brand-600"
        >
          {author.name}
        </Link>
        <span className="text-ink-600"> · {author.role[lang]}</span>
      </p>
      <p className="label ml-auto text-ink-600">
        <time dateTime={updated}>
          {c.updated} {formatDate(updated, lang)}
        </time>
        <span aria-hidden="true"> · </span>
        {readingMinutes} {c.reading}
      </p>
    </div>
  );
}
