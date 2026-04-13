import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { Locale, normalizeLocale } from "@/lib/i18n";
import { getAllPosts } from "@/lib/blog";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const l = normalizeLocale(locale);
  const isEn = l === "en";
  return {
    title: isEn ? "Blog - EchoVoice" : "博客 - 灵动之声 EchoVoice",
    description: isEn
      ? "Tips, tutorials and news about AI voice generation."
      : "AI 配音技巧、教程与最新动态。",
    alternates: { canonical: `https://echovoiceai.net/${l}/blog` },
  };
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  if (locale !== "zh" && locale !== "en") notFound();
  const isEn = locale === "en";
  const posts = getAllPosts(locale);

  return (
    <div className="page-wrap">
      <SiteHeader locale={locale} />
      <main className="mx-auto max-w-4xl px-4 pb-16">
        <section className="py-8">
          <h1 className="bg-gradient-to-br from-indigo-950 to-slate-700 bg-clip-text text-4xl font-black text-transparent tracking-tight">
            {isEn ? "Blog" : "博客"}
          </h1>
          <p className="mt-3 text-slate-600">
            {isEn
              ? "Tips, tutorials and insights about AI voice generation."
              : "AI 配音技巧、使用教程与行业洞察。"}
          </p>
        </section>

        {posts.length === 0 ? (
          <p className="text-slate-500 py-12 text-center">
            {isEn ? "No posts yet. Stay tuned!" : "暂无文章，敬请期待！"}
          </p>
        ) : (
          <div className="grid gap-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/${locale}/blog/${post.slug}`}
                className="group block rounded-2xl border border-white/60 bg-white/40 backdrop-blur-md p-6 shadow-sm transition hover:bg-white/70 hover:shadow-md"
              >
                <div className="flex items-center gap-3 text-xs text-slate-400 mb-2">
                  <time>{post.date}</time>
                  {post.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-indigo-50 px-2 py-0.5 text-indigo-600">
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition">
                  {post.title}
                </h2>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  {post.description}
                </p>
                <span className="mt-3 inline-block text-sm font-semibold text-indigo-600">
                  {isEn ? "Read more →" : "阅读全文 →"}
                </span>
              </Link>
            ))}
          </div>
        )}

        <footer className="mt-12 border-t border-slate-300 pt-4 text-sm text-slate-600">
          <div className="flex flex-wrap gap-4">
            <Link href={`/${locale}`}>{isEn ? "Home" : "首页"}</Link>
            <Link href={`/${locale}/try`}>{isEn ? "Try" : "在线试用"}</Link>
            <Link href={`/${locale}/pricing`}>{isEn ? "Pricing" : "会员订阅"}</Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
