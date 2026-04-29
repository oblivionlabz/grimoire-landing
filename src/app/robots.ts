import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://grimoire.oblivionlabz.net/sitemap.xml",
    host: "https://grimoire.oblivionlabz.net",
  };
}
