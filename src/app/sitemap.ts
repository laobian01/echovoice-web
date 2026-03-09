import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://echovoiceai.net";
  const now = new Date();

  const paths = [
    "",
    "/zh",
    "/zh/try",
    "/zh/pricing",
    "/zh/support",
    "/zh/privacy",
    "/zh/terms",
    "/en",
    "/en/try",
    "/en/pricing",
    "/en/support",
    "/en/privacy",
    "/en/terms",
  ];

  return paths.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "" || path === "/zh" || path === "/en" ? 1 : 0.7,
  }));
}
