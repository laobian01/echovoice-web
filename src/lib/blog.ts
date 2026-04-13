import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  locale: "zh" | "en";
  tags: string[];
  content: string;
}

const postsDirectory = path.join(process.cwd(), "src/content/blog");

export function getAllPosts(locale: "zh" | "en"): Omit<BlogPost, "content">[] {
  if (!fs.existsSync(postsDirectory)) return [];
  
  const files = fs.readdirSync(postsDirectory).filter((f) => f.endsWith(".md"));
  const posts = files
    .map((filename) => {
      const filePath = path.join(postsDirectory, filename);
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data } = matter(fileContents);

      if (data.locale !== locale) return null;

      return {
        slug: data.slug || filename.replace(/\.md$/, ""),
        title: data.title || "",
        description: data.description || "",
        date: data.date || "",
        locale: data.locale || "zh",
        tags: data.tags || [],
      };
    })
    .filter(Boolean) as Omit<BlogPost, "content">[];

  return posts.sort((a, b) => (a.date > b.date ? -1 : 1));
}

export async function getPostBySlug(slug: string, locale: "zh" | "en"): Promise<BlogPost | null> {
  if (!fs.existsSync(postsDirectory)) return null;

  const files = fs.readdirSync(postsDirectory).filter((f) => f.endsWith(".md"));

  for (const filename of files) {
    const filePath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);

    const fileSlug = data.slug || filename.replace(/\.md$/, "");
    if (fileSlug === slug && data.locale === locale) {
      const processedContent = await remark().use(html).process(content);
      return {
        slug: fileSlug,
        title: data.title || "",
        description: data.description || "",
        date: data.date || "",
        locale: data.locale || "zh",
        tags: data.tags || [],
        content: processedContent.toString(),
      };
    }
  }
  return null;
}

export function getAllSlugs(): { slug: string; locale: string }[] {
  if (!fs.existsSync(postsDirectory)) return [];
  
  const files = fs.readdirSync(postsDirectory).filter((f) => f.endsWith(".md"));
  return files.map((filename) => {
    const filePath = path.join(postsDirectory, filename);
    const { data } = matter(fs.readFileSync(filePath, "utf8"));
    return {
      slug: data.slug || filename.replace(/\.md$/, ""),
      locale: data.locale || "zh",
    };
  });
}
