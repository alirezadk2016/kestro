import { ReactNode } from "react";
import Breadcrumbs from "./Breadcrumbs";
import type { Lang } from "@/lib/i18n";
import { formatDate } from "@/lib/i18n";
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
  wide = false,
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
  /**
   * The heading on the left and the lead on the right, from lg, as on /priser
   * and /produkter. For a header that is the whole width of its section: a
   * 768px column there left the right half of a 1440 or 1920 screen empty,
   * page after page. Off where the header shares its row with a picture.
   */
  wide?: boolean;
}) {
  const heading = (
    <h1 className="text-balance font-display t-h1 font-extrabold tracking-display text-paper">
      {title}
    </h1>
  );
  const lead = (
    <>
      <p
        className={`mt-6 max-w-2xl text-base leading-[1.65] text-paper/85 sm:text-lg sm:leading-[1.65] ${wide ? "lg:mt-1.5" : ""}`}
      >
        {description}
      </p>
      {updated && (
        /* The meta line: one weight up on the value. It printed the raw ISO
           date at 12px roman, which is the data rather than a date. Then it
           was set in the tracked capitals of .label and read "OPDATERET 16.
           NOV. 2026", the month shouted in abbreviation, while the products
           and prices hubs said it in sentence case. Now every date line does. */
        <p className="mt-6 text-xs leading-5 text-paper/65">
          {lang === "en" ? "Updated" : "Opdateret"}{" "}
          <time dateTime={pageUpdated(updated)} className="tabular-nums text-paper/85">
            {formatDate(pageUpdated(updated), lang ?? "da")}
          </time>
        </p>
      )}
    </>
  );
  return (
    <div className={wide ? undefined : "max-w-3xl"}>
      {lang && href && (
        <Breadcrumbs lang={lang} trail={[{ name: crumb ?? title, href }]} className="mb-5" />
      )}
      {wide ? (
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-12">
          {heading}
          <div>{lead}</div>
        </div>
      ) : (
        <>
          {heading}
          {lead}
        </>
      )}
    </div>
  );
}
