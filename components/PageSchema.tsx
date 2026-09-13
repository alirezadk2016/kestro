import pageDates from "@/lib/page-dates.json";
import { citationSchema, type SourceId } from "@/lib/sources";
import { localePath, htmlLang, type Lang } from "@/lib/i18n";
import { SITE_ORIGIN } from "@/lib/site";

/*
 * The WebPage node, on every page.
 *
 * The site already published Organization and WebSite from the layout, and
 * typed nodes — Product, Article, Service, FAQPage — on the pages that have
 * something to type. What none of them carried was provenance: who published
 * this, in what language, as part of what, and when it last changed. An answer
 * engine deciding whether to quote a page weighs exactly that, and 96 of the
 * 112 pages here answered none of it.
 *
 * dateModified is the part that has to be earned rather than asserted. It
 * comes from lib/page-dates.json, which scripts/build/page-dates.mjs writes
 * from git: the newest commit touching the page's own file or its own data,
 * with the site-wide chrome subtracted so that editing the navigation does not
 * claim every page was revised. A date that is sometimes wrong is worse than
 * no date — Google stops trusting lastmod entirely once it stops matching, and
 * the same logic applies to anything reading this.
 *
 * The author is the Organization, not a person. Eight guides name a real
 * author because a person wrote them; a product category page was not written
 * by anyone in a way worth claiming, and inventing a byline to satisfy a
 * checklist is exactly the kind of signal these fields exist to detect.
 */
export type Route = keyof typeof pageDates;

export default function PageSchema({
  lang,
  route,
  /*
   * The specific WebPage subtype, where there is one that fits.
   *
   * AboutPage, ContactPage and CollectionPage are not decoration: they are the
   * difference between "a page on a website" and "the page where this company
   * says who it is", and an answer engine asked who Kestro are has no other
   * way to tell which of 112 pages to read. Only set where it is true —
   * ContactPage on a page that is not how you reach anyone is the same kind of
   * mislabelling as FAQ markup for questions the page never asks.
   */
  type = "WebPage",
  name,
  description,
  sources,
  /** Set on pages whose main content is a typed node published separately
      (Article, Product), so the WebPage points at it instead of repeating it. */
  primaryEntityId,
}: {
  lang: Lang;
  route: Route;
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage" | "ItemPage";
  name?: string;
  description?: string;
  sources?: readonly SourceId[];
  primaryEntityId?: string;
}) {
  const dates = pageDates[route];
  const url = `${SITE_ORIGIN}${localePath(route.replace(/\/\[slug\]$/, ""), lang)}`;

  const json = {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${url}#webpage`,
    url,
    ...(name ? { name } : {}),
    ...(description ? { description } : {}),
    inLanguage: htmlLang[lang],
    isPartOf: { "@id": `${SITE_ORIGIN}/#website` },
    publisher: { "@id": `${SITE_ORIGIN}/#organization` },
    author: { "@id": `${SITE_ORIGIN}/#organization` },
    ...(dates ? { datePublished: dates.published, dateModified: dates.modified } : {}),
    ...(primaryEntityId ? { mainEntity: { "@id": primaryEntityId } } : {}),
    ...(sources?.length ? { citation: citationSchema(sources, lang) } : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json).replace(/</g, "\\u003c") }}
    />
  );
}

/** The route's content dates, for the visible "last updated" line. */
export function pageUpdated(route: Route): string {
  return pageDates[route].modified;
}
