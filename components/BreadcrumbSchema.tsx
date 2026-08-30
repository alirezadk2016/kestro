import { localePath, type Lang } from "@/lib/i18n";
import { SITE_ORIGIN } from "@/lib/site";

/*
 * The breadcrumb trail, marked up.
 *
 * Four page types already drew a trail — services, models, products, guides —
 * and none of it was machine-readable. That is a real cost rather than a
 * pedantic one: Google replaces the bare URL under a result with the trail
 * when it can read one, so a search listing says
 * "kestro.dk › Ydelser › Levering" instead of a naked address. On a site whose
 * whole structure is the argument — 106 pages that each answer one question —
 * losing that is losing the shape of the site in the one place a buyer sees it
 * before they arrive.
 *
 * Rendered next to the visible trail, from the same labels, so the two cannot
 * say different things. Marking up a trail the page does not show is exactly
 * what the guidelines call structured data that does not represent the page.
 */
export type Crumb = { name: string; href: string };

export default function BreadcrumbSchema({ lang, trail }: { lang: Lang; trail: Crumb[] }) {
  const site = SITE_ORIGIN;

  const json = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: lang === "da" ? "Forside" : "Home", href: "/" }, ...trail].map(
      (crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        item: `${site}${localePath(crumb.href, lang)}`,
      }),
    ),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json).replace(/</g, "\\u003c") }}
    />
  );
}
