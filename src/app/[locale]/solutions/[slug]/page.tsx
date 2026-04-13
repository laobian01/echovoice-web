import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { TrialPanel } from "@/components/trial-panel";
import { normalizeLocale } from "@/lib/i18n";
import { solutionsData } from "@/lib/seo-data";
import Link from "next/link";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  const locales = ["zh", "en"];
  return locales.flatMap((l) => 
    solutionsData.map((v) => ({ locale: l, slug: v.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const l = normalizeLocale(locale);
  const data = solutionsData.find((v) => v.slug === slug);
  if (!data) return { title: "Not Found" };

  return {
    title: data.title[l],
    description: data.description[l],
    keywords: data.keywords[l],
    alternates: { canonical: `https://echovoiceai.net/${l}/solutions/${slug}` },
  };
}

export default async function SolutionLandingPage({ params }: Props) {
  const { locale, slug } = await params;
  const l = normalizeLocale(locale) as "zh" | "en";
  const data = solutionsData.find((v) => v.slug === slug);
  if (!data) notFound();

  const isEn = l === "en";

  return (
    <div className="page-wrap">
      <SiteHeader locale={l} />
      
      <main className="mx-auto max-w-6xl px-4 py-12">
        <section className="mb-12">
          <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
            <Link href={`/${l}`} className="hover:text-indigo-600 transition">{isEn ? "Home" : "首页"}</Link>
            <span>/</span>
            <span className="text-slate-900 font-medium">{isEn ? "Solutions" : "行业方案"}</span>
          </nav>

          <h1 className="bg-gradient-to-br from-indigo-950 to-slate-700 bg-clip-text text-4xl font-black text-transparent md:text-5xl tracking-tight leading-tight">
            {data.h1[l]}
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-600 leading-relaxed text-balance">
            {data.content[l]}
          </p>
        </section>

        <section className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="rounded-3xl border border-indigo-100 bg-white/50 p-1 shadow-sm">
              <TrialPanel locale={l} />
            </div>
            
            <div className="mt-12 space-y-8">
              <div className="prose prose-slate max-w-none">
                <h2 className="text-2xl font-bold text-slate-900 border-l-4 border-indigo-500 pl-4">
                  {isEn ? "How it helps you" : "EchoVoice 如何助力您的创作？"}
                </h2>
                <div className="mt-6 grid gap-6 md:grid-cols-2">
                   <div className="rounded-2xl border border-slate-100 bg-white p-6">
                      <h4 className="font-bold text-slate-900 mb-2">{isEn ? "Unbeatable Speed" : "极速生成"}</h4>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {isEn ? "From script to audio in under 30 seconds. No more waiting for freelancers." : "输入文案，30 秒即可生成高质量音频。告别漫长的人工配音等待期。"}
                      </p>
                   </div>
                   <div className="rounded-2xl border border-slate-100 bg-white p-6">
                      <h4 className="font-bold text-slate-900 mb-2">{isEn ? "Emotional Depth" : "情感深度"}</h4>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {isEn ? "Our AI captures the nuances of tone and emotion, making your content more engaging." : "我们的 AI 模型能捕捉语调和情绪的微妙变化，让你的视频内容更动人。"}
                      </p>
                   </div>
                   <div className="rounded-2xl border border-slate-100 bg-white p-6">
                      <h4 className="font-bold text-slate-900 mb-2">{isEn ? "Consistent Quality" : "稳定的品质"}</h4>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {isEn ? "Maintain the same high-quality voice across your entire series or project." : "确保你的整个系列视频或长篇项目中，配音品质始终保持专业。"}
                      </p>
                   </div>
                   <div className="rounded-2xl border border-slate-100 bg-white p-6">
                      <h4 className="font-bold text-slate-900 mb-2">{isEn ? "Zero Setup Cost" : "零初始成本"}</h4>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {isEn ? "Try it for free on your browser. Pay only when you are satisfied." : "在浏览器中直接免费试听效果，满意后再付费，没有前期硬件投入。"}
                      </p>
                   </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-4 space-y-6">
            <div className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4">{isEn ? "Success Cases" : "成功案例"}</h3>
              <ul className="space-y-4">
                 {[
                   isEn ? "Educational Channel with 1M+ subs" : "拥有百万粉丝的学术科普账号",
                   isEn ? "Daily Tech News Podcast" : "日更模式的科技新闻播客",
                   isEn ? "Cross-border Ad Agency" : "专注出海市场的广告代理机构"
                 ].map((item, i) => (
                   <li key={i} className="flex items-start gap-3">
                      <div className="mt-1 h-5 w-5 flex-shrink-0 text-indigo-500">
                        <svg fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path></svg>
                      </div>
                      <span className="text-sm text-slate-600">{item}</span>
                   </li>
                 ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-600 to-blue-500 p-6 text-white shadow-xl">
              <h3 className="text-xl font-bold">{isEn ? "Start Free Trial" : "开启免费试用"}</h3>
              <p className="mt-2 text-indigo-100 text-sm">
                {isEn ? "Join thousands of creators using EchoVoice today." : "加入成千上万名使用灵动之声的内容创作者。"}
              </p>
              <Link href={`/${l}/try`} className="mt-4 block w-full rounded-xl bg-white py-2.5 text-center font-bold text-indigo-600 shadow-sm transition hover:bg-indigo-50 active:scale-95">
                {isEn ? "Get Started" : "立即进入"}
              </Link>
            </div>
          </aside>
        </section>
      </main>

      <footer className="mt-12 border-t border-slate-200 py-12 bg-white/30">
        <div className="mx-auto max-w-6xl px-4 flex flex-wrap gap-x-8 gap-y-4 text-sm text-slate-500">
           <Link href={`/${l}`} className="hover:text-indigo-600">{isEn ? "Home" : "首页"}</Link>
           <Link href={`/${l}/blog`} className="hover:text-indigo-600">{isEn ? "Blog" : "博客"}</Link>
           <Link href={`/${l}/pricing`} className="hover:text-indigo-600">{isEn ? "Pricing" : "定价"}</Link>
           <Link href={`/${l}/support`} className="hover:text-indigo-600">{isEn ? "Support" : "支持"}</Link>
        </div>
      </footer>
    </div>
  );
}
