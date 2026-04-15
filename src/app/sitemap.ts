import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/blog";
import { voicesData, solutionsData } from "@/lib/seo-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.echovoiceai.net";
  const now = new Date();
  const locales = ["zh", "en"];

  const staticPaths = [
    { path: "", priority: 1.0 },
    { path: "/zh", priority: 1.0 },
    { path: "/zh/try", priority: 0.9 },
    { path: "/zh/pricing", priority: 0.8 },
    { path: "/zh/blog", priority: 0.8 },
    { path: "/zh/support", priority: 0.5 },
    { path: "/zh/privacy", priority: 0.3 },
    { path: "/zh/terms", priority: 0.3 },
    { path: "/zh/refund", priority: 0.3 },
    { path: "/en", priority: 1.0 },
    { path: "/en/try", priority: 0.9 },
    { path: "/en/pricing", priority: 0.8 },
    { path: "/en/blog", priority: 0.8 },
    { path: "/en/support", priority: 0.5 },
    { path: "/en/privacy", priority: 0.3 },
    { path: "/en/terms", priority: 0.3 },
    { path: "/en/refund", priority: 0.3 },
  ];

  const staticEntries = staticPaths.map(({ path, priority }) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority,
  }));

  // Dynamic blog post entries
  const blogSlugs = getAllSlugs();
  const blogEntries = blogSlugs.map(({ slug, locale }) => ({
    url: `${base}/${locale}/blog/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // SEO Voices entries
  const voiceEntries = locales.flatMap((l) =>
    voicesData.map((v) => ({
      url: `${base}/${l}/voices/${v.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }))
  );

  // SEO Solutions entries
  const solutionEntries = locales.flatMap((l) =>
    solutionsData.map((s) => ({
      url: `${base}/${l}/solutions/${s.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }))
  );

  return [...staticEntries, ...blogEntries, ...voiceEntries, ...solutionEntries];
}
