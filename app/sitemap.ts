import type { MetadataRoute } from "next";

const BASE_URL = "https://www.kestro.dk";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/ydelser", "/om-os", "/kontakt"];

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
