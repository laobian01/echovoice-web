import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { TrialPanel } from "@/components/trial-panel";
import { normalizeLocale } from "@/lib/i18n";
import { voicesData } from "@/lib/seo-data";
import Link from "next/link";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  const locales = ["zh", "en"];
  return locales.flatMap((l) => 
    voicesData.map((v) => ({ locale: l, slug: v.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const l = normalizeLocale(locale);
  const data = voicesData.find((v) => v.slug === slug);
  if (!data) return { title: "Not Found" };

  return {
    title: data.title[l],
    description: data.description[l],
    keywords: data.keywords[l],
    alternates: { canonical: `https://echovoiceai.net/${l}/voices/${slug}` },
  };
}

export default async function VoiceLandingPage({ params }: Props) {
  const { locale, slug } = await params;
  const l = normalizeLocale(locale) as "zh" | "en";
  const data = voicesData.find((v) => v.slug === slug);
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
            <span className="text-slate-900 font-medium">{isEn ? "Voices" : "音色专题"}</span>
          </nav>

          <h1 className="bg-gradient-to-br from-indigo-950 to-slate-700 bg-clip-text text-4xl font-black text-transparent md:text-5xl tracking-tight">
            {data.h1[l]}
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-600 leading-relaxed">
            {data.content[l]}
          </p>
        </section>

        <section className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="rounded-3xl border border-indigo-100 bg-white/50 p-1 shadow-sm">
              <TrialPanel locale={l} />
            </div>
            
            <div className="mt-12 prose prose-slate max-w-none">
              <h2 className="text-2xl font-bold text-slate-900 border-l-4 border-indigo-500 pl-4">
                {isEn ? "Why use this voice?" : "为什么选择这个音色？"}
              </h2>
              <p className="mt-4 text-slate-600">
                {isEn 
                  ? "Every voice at EchoVoice is crafted for natural flow. This specific role is optimized for clarity and emotional resonance, making it stand out from typical robotic TTS engines."
                  : "EchoVoice 的每一个音色都经过深度优化，旨在追求最自然的语流。这个特定角色特别强化了情感表达的细腻度，让你的配音作品彻底告别机械感。"}
              </p>
              <ul className="mt-6 grid gap-4 md:grid-cols-2 list-none p-0">
                {[
                  isEn ? "High emotional range" : "极高的情感表达力",
                  isEn ? "Native-level pronunciation" : "母语级发音精准度",
                  isEn ? "Perfect for content creation" : "专为内容创作优化",
                  isEn ? "Instant web preview" : "网页端即时预览试听"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 rounded-xl bg-white p-3 shadow-sm border border-slate-50">
                    <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm font-medium text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="lg:col-span-4 space-y-6">
            <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-600 to-blue-500 p-6 text-white shadow-xl">
              <h3 className="text-xl font-bold">{isEn ? "Ready to Start?" : "立即开始创作"}</h3>
              <p className="mt-2 text-indigo-100 text-sm">
                {isEn ? "Get 5 free credits on signup. No credit card required." : "注册即送 5 次免费试用额度，无需绑定信用卡。"}
              </p>
              <Link href={`/${l}/try`} className="mt-4 block w-full rounded-xl bg-white py-2.5 text-center font-bold text-indigo-600 shadow-sm transition hover:bg-indigo-50 active:scale-95">
                {isEn ? "Try Now" : "立即试用"}
              </Link>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4">{isEn ? "Explore Other Voices" : "探索更多音色"}</h3>
              <div className="flex flex-wrap gap-2">
                {voicesData.filter(v => v.slug !== slug).map(v => (
                  <Link key={v.slug} href={`/${l}/voices/${v.slug}`} className="rounded-full bg-slate-50 px-3 py-1 text-xs text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition border border-slate-100">
                    {v.title[l].split(" - ")[0]}
                  </Link>
                ))}
              </div>
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
