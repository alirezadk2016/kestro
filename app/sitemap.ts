import type { MetadataRoute } from "next";
import { categories } from "@/lib/categories";
import { models } from "@/lib/models";
import { guides } from "@/lib/guides";
import { localePath } from "@/lib/i18n";

const BASE_URL = "https://www.kestro.dk";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/flaadeloesninger", priority: 0.9 },
    { path: "/produkter", priority: 0.9 },
    { path: "/modeller", priority: 0.9 },
    { path: "/maskinen", priority: 0.8 },
    { path: "/kvalitet", priority: 0.8 },
    { path: "/vejledninger", priority: 0.8 },
    { path: "/saelg-til-os", priority: 0.8 },
    { path: "/reparation", priority: 0.8 },
    { path: "/ydelser", priority: 0.7 },
    { path: "/om-os", priority: 0.7 },
    { path: "/kontakt", priority: 0.7 },
    { path: "/privatlivspolitik", priority: 0.3 },
  ];

  const categoryRoutes = categories.map((category) => ({
    path: `/produkter/${category.slug}`,
    priority: 0.8,
  }));

  const modelRoutes = models.map((model) => ({
    path: `/modeller/${model.slug}`,
    priority: 0.7,
  }));

  const guideRoutes = guides.map((guide) => ({
    path: `/vejledninger/${guide.slug}`,
    priority: 0.7,
  }));

  const routes = [...staticRoutes, ...categoryRoutes, ...modelRoutes, ...guideRoutes];

  /*
   * Each page is listed once per language, and every entry carries the
   * alternates for both, so Google pairs the Danish and English versions
   * instead of treating them as duplicates.
   */
  return routes.flatMap(({ path, priority }) => {
    const da = `${BASE_URL}${localePath(path, "da")}`;
    const en = `${BASE_URL}${localePath(path, "en")}`;
    const languages = { "da-DK": da, en, "x-default": da };

    return [
      {
        url: da,
        lastModified,
        changeFrequency: "monthly" as const,
        priority,
        alternates: { languages },
      },
      {
        url: en,
        lastModified,
        changeFrequency: "monthly" as const,
        priority: priority * 0.9,
        alternates: { languages },
      },
    ];
  });
}
