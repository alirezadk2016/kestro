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

type Route = { path: string; priority: number; lastModified?: string };

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: Route[] = [
    { path: "/", priority: 1 },
    { path: "/flaadeloesninger", priority: 0.9 },
    { path: "/produkter", priority: 0.9 },
    { path: "/modeller", priority: 0.9 },
    { path: "/maskinen", priority: 0.8 },
    { path: "/kvalitet", priority: 0.8 },
    { path: "/priser", priority: 0.8 },
    { path: "/tilbud-eksempel", priority: 0.8 },
    { path: "/vejledninger", priority: 0.8 },
    { path: "/saelg-til-os", priority: 0.8 },
    { path: "/reparation", priority: 0.8 },
    { path: "/ydelser", priority: 0.8 },
    { path: "/flaadeloesninger/forespoergsel", priority: 0.7 },
    { path: "/om-os", priority: 0.7 },
    { path: "/kontakt", priority: 0.7 },
    { path: "/privatlivspolitik", priority: 0.3 },
  ];

  const categoryRoutes: Route[] = categories.map((category) => ({
    path: `/produkter/${category.slug}`,
    priority: 0.8,
  }));

  const modelRoutes: Route[] = models.map((model) => ({
    path: `/modeller/${model.slug}`,
    priority: 0.7,
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
    priority: 0.7,
    lastModified: guide.updated,
  }));

  const serviceRoutes: Route[] = services.map((service) => ({
    path: `/ydelser/${service.slug}`,
    priority: 0.8,
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
   * hreflang is "da", not "da-DK": the region subtag would target Danish
   * speakers in Denmark only, and the same pages serve Norway.
   */
  return routes.flatMap(({ path, priority, lastModified }) => {
    const da = absolute(path, "da");
    const en = absolute(path, "en");
    const languages = { da, en, "x-default": da };

    return [
      {
        url: da,
        ...(lastModified ? { lastModified } : {}),
        changeFrequency: "monthly" as const,
        priority,
        alternates: { languages },
      },
      {
        url: en,
        ...(lastModified ? { lastModified } : {}),
        changeFrequency: "monthly" as const,
        priority: Math.round(priority * 0.9 * 100) / 100,
        alternates: { languages },
      },
    ];
  });
}
