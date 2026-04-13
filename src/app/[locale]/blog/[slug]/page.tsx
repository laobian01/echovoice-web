import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { normalizeLocale } from "@/lib/i18n";
import { getPostBySlug, getAllSlugs } from "@/lib/blog";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map(({ slug, locale }) => ({ locale, slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const l = normalizeLocale(locale);
  const post = await getPostBySlug(slug, l as "zh" | "en");
  if (!post) return { title: "Not Found" };
  return {
    title: `${post.title} - EchoVoice`,
    description: post.description,
    alternates: { canonical: `https://echovoiceai.net/${l}/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  if (locale !== "zh" && locale !== "en") notFound();
  const post = await getPostBySlug(slug, locale);
  if (!post) notFound();
  const isEn = locale === "en";

  return (
    <div className="page-wrap">
      <SiteHeader locale={locale} />
      <main className="mx-auto max-w-3xl px-4 pb-16">
        <article>
          <header className="py-8">
            <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
              <Link href={`/${locale}/blog`} className="hover:text-indigo-600 transition">
                ← {isEn ? "Back to Blog" : "返回博客"}
              </Link>
              <span>·</span>
              <time>{post.date}</time>
            </div>
            <h1 className="bg-gradient-to-br from-indigo-950 to-slate-700 bg-clip-text text-3xl font-black text-transparent md:text-4xl tracking-tight leading-tight">
              {post.title}
            </h1>
            <p className="mt-3 text-slate-600">{post.description}</p>
            <div className="mt-3 flex gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-indigo-50 px-3 py-1 text-xs text-indigo-600">
                  {tag}
                </span>
              ))}
            </div>
          </header>

          <div
            className="prose prose-slate prose-lg max-w-none
              prose-headings:font-bold prose-headings:text-slate-900
              prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-xl prose-img:shadow-md
              prose-blockquote:border-indigo-300 prose-blockquote:bg-indigo-50/50 prose-blockquote:rounded-r-xl prose-blockquote:py-1
              prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
              prose-pre:bg-slate-900 prose-pre:rounded-xl"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        <div className="mt-12 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-blue-50 p-6 text-center">
          <h3 className="text-lg font-bold text-slate-900">
            {isEn ? "Ready to try EchoVoice?" : "准备体验灵动之声了吗？"}
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            {isEn
              ? "Generate high-quality AI voice-overs in 30 seconds. Free trial included."
              : "30 秒生成高质量 AI 配音，注册即送 5 次免费试用。"}
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <Link
              href={`/${locale}/try`}
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-blue-500 px-6 py-2.5 font-semibold text-white shadow-sm transition hover:shadow-md"
            >
              {isEn ? "Try Free" : "免费试用"}
            </Link>
            <Link
              href={`/${locale}/pricing`}
              className="rounded-xl border border-white/60 bg-white/60 px-6 py-2.5 font-semibold text-slate-700 shadow-sm transition hover:bg-white"
            >
              {isEn ? "View Pricing" : "查看定价"}
            </Link>
          </div>
        </div>

        <footer className="mt-8 border-t border-slate-300 pt-4 text-sm text-slate-600">
          <div className="flex flex-wrap gap-4">
            <Link href={`/${locale}`}>{isEn ? "Home" : "首页"}</Link>
            <Link href={`/${locale}/blog`}>{isEn ? "Blog" : "博客"}</Link>
            <Link href={`/${locale}/pricing`}>{isEn ? "Pricing" : "定价"}</Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
