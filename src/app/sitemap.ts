import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://echovoiceai.net";
  const now = new Date();

  const paths = [
    { path: "", priority: 1.0 },
    { path: "/zh", priority: 1.0 },
    { path: "/zh/try", priority: 0.9 },
    { path: "/zh/pricing", priority: 0.8 },
    { path: "/zh/support", priority: 0.5 },
    { path: "/zh/privacy", priority: 0.3 },
    { path: "/zh/terms", priority: 0.3 },
    { path: "/zh/refund", priority: 0.3 },
    { path: "/en", priority: 1.0 },
    { path: "/en/try", priority: 0.9 },
    { path: "/en/pricing", priority: 0.8 },
    { path: "/en/support", priority: 0.5 },
    { path: "/en/privacy", priority: 0.3 },
    { path: "/en/terms", priority: 0.3 },
    { path: "/en/refund", priority: 0.3 },
  ];

  return paths.map(({ path, priority }) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority,
  }));
}
