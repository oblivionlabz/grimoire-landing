import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: "https://grimoire.oblivionlabz.net/",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];
}
