import { ReactNode } from "react";
import Breadcrumbs from "./Breadcrumbs";
import type { Lang } from "@/lib/i18n";
import { pageUpdated, type Route } from "./PageSchema";

/*
 * The top of a top-level page.
 *
 * It carries the breadcrumb because these are exactly the pages that had
 * none: the hubs and section fronts were the parents of every page that did
 * have one. Passing `lang` and `href` turns it on; the trail is always
 * "Forside › denne side", because a top-level page has no deeper parent.
 */
export default function PageHeader({
  title,
  description,
  lang,
  href,
  crumb,
  updated,
}: {
  title: string;
  description: ReactNode;
  /** Both of these, or neither: the breadcrumb needs a language and a target. */
  lang?: Lang;
  href?: string;
  /** A shorter label for the trail, when the heading is a sentence. */
  crumb?: string;
  /**
   * The page's own route key, which turns on the visible "last updated" line.
   *
   * Machine-readable and human-readable from the same value: the <time> here
   * and the dateModified in the page's schema both come from
   * lib/page-dates.json, which is written from git rather than from a build
   * timestamp. Left off where a date means nothing to a reader — a contact
   * form does not have an edition.
   */
  updated?: Route;
}) {
  return (
    <div className="max-w-3xl">
      {lang && href && (
        <Breadcrumbs lang={lang} trail={[{ name: crumb ?? title, href }]} className="mb-5" />
      )}
      <h1 className="text-balance font-display t-h1 font-extrabold tracking-display text-paper">
        {title}
      </h1>
      <p className="mt-6 max-w-2xl text-base leading-[1.65] text-paper/65 sm:text-lg sm:leading-[1.65]">
        {description}
      </p>
      {updated && (
        <p className="mt-5 text-xs text-paper/45 leading-[1.45]">
          {lang === "en" ? "Updated" : "Opdateret"}{" "}
          <time dateTime={pageUpdated(updated)} className="tabular-nums">
            {pageUpdated(updated)}
          </time>
        </p>
      )}
    </div>
  );
}
