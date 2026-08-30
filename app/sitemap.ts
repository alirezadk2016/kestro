import type { MetadataRoute } from "next";
import { categories } from "@/lib/categories";
import { models } from "@/lib/models";
import { guides } from "@/lib/guides";
import { services } from "@/lib/services";
import { localePath } from "@/lib/i18n";
import { SITE_ORIGIN } from "@/lib/site";

/* The host every <loc> sits on. Defined once in lib/site.ts — a sitemap on a
   different host than the Search Console property is rejected outright. */
const BASE_URL = SITE_ORIGIN;

/** Absolute URL for a site path, matching the canonical's no-trailing-slash form. */
function absolute(path: string, lang: "da" | "en"): string {
  const p = localePath(path, lang);
  return p === "/" ? BASE_URL : `${BASE_URL}${p}`;
}

type Route = { path: string; lastModified?: string };

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: Route[] = [
    { path: "/" },
    { path: "/flaadeloesninger" },
    { path: "/produkter" },
    { path: "/modeller" },
    { path: "/maskinen" },
    { path: "/kvalitet" },
    { path: "/priser" },
    { path: "/tilbud-eksempel" },
    { path: "/vejledninger" },
    { path: "/saelg-til-os" },
    { path: "/reparation" },
    { path: "/ydelser" },
    { path: "/tilbud" },
    { path: "/om-os" },
    { path: "/kontakt" },
    { path: "/privatlivspolitik" },
  ];

  const categoryRoutes: Route[] = categories.map((category) => ({
    path: `/produkter/${category.slug}`,
  }));

  const modelRoutes: Route[] = models.map((model) => ({
    path: `/modeller/${model.slug}`,
  }));

  /*
   * Guides are the only content carrying a real edit date, so they are the only
   * pages that get a <lastmod>.
   *
   * Everything else deliberately has none. It used to be `new Date()`, which
   * stamped all 110 URLs with the moment of the last build — so a deploy that
   * changed one component told Google that every page on the site had just been
   * rewritten. Google only uses lastmod when it is consistently accurate and
   * ignores it otherwise, and an omitted date is treated better than a wrong
   * one. Give a page a real date here when there is one to give.
   */
  const guideRoutes: Route[] = guides.map((guide) => ({
    path: `/vejledninger/${guide.slug}`,
    lastModified: guide.updated,
  }));

  const serviceRoutes: Route[] = services.map((service) => ({
    path: `/ydelser/${service.slug}`,
  }));

  const routes: Route[] = [
    ...staticRoutes,
    ...categoryRoutes,
    ...modelRoutes,
    ...guideRoutes,
    ...serviceRoutes,
  ];

  /*
   * Each page is listed once per language, and every entry carries the
   * alternates for both, so Google pairs the Danish and English versions
   * instead of treating them as duplicates.
   *
   * No <priority> and no <changefreq>: Google has stated it ignores both, and
   * a field that is read by nothing is a field that can only be wrong. The one
   * hint it does use is <lastmod>, which is why only the pages with a real
   * edit date carry one.
   *
   * hreflang is "da", not "da-DK": the region subtag would target Danish
   * speakers in Denmark only, and the same pages serve Norway.
   */
  return routes.flatMap(({ path, lastModified }) => {
    const da = absolute(path, "da");
    const en = absolute(path, "en");
    const languages = { da, en, "x-default": da };

    return [
      {
        url: da,
        ...(lastModified ? { lastModified } : {}),
        alternates: { languages },
      },
      {
        url: en,
        ...(lastModified ? { lastModified } : {}),
        alternates: { languages },
      },
    ];
  });
}
