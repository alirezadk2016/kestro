import type { MetadataRoute } from "next";
import { categories } from "@/lib/categories";

const BASE_URL = "https://www.kestro.dk";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes: { path: string; priority: number }[] = [
    { path: "", priority: 1 },
    { path: "/produkter", priority: 0.9 },
    { path: "/ydelser", priority: 0.8 },
    { path: "/saelg-til-os", priority: 0.8 },
    { path: "/reparation", priority: 0.8 },
    { path: "/om-os", priority: 0.7 },
    { path: "/kontakt", priority: 0.7 },
  ];

  const categoryRoutes = categories.map((category) => ({
    path: `/produkter/${category.slug}`,
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes].map(({ path, priority }) => ({
    url: `${BASE_URL}${path}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority,
  }));
}
