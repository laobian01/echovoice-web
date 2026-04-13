import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TrialPanel } from "@/components/trial-panel";
import { SiteHeader } from "@/components/site-header";
import { Locale, normalizeLocale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const l = normalizeLocale(locale);
  const isEn = l === "en";
  return {
    title: isEn ? "EchoVoice - AI Voice Studio" : "灵动之声 EchoVoice - AI 语音工作室",
    description: isEn
      ? "Generate high-quality AI voice in 30 seconds with role, tone and emotion controls."
      : "30 秒生成高质量 AI 配音，支持角色、语调、情绪控制。",
    alternates: { canonical: `https://echovoiceai.net/${l}` },
  };
}

function ensureLocale(locale: string): Locale {
  if (locale !== "zh" && locale !== "en") notFound();
  return locale;
}

export default async function LocaleHome({ params }: Props) {
  const { locale } = await params;
  const l = ensureLocale(locale);
  const isEn = l === "en";

  return (
    <div className="page-wrap">
      <SiteHeader locale={l} />

      <main className="mx-auto max-w-6xl px-4 pb-16">
        <section className="py-8 pt-4">
          <h1 className="bg-gradient-to-br from-indigo-950 to-slate-700 bg-clip-text text-4xl font-black text-transparent md:text-5xl tracking-tight leading-tight">
            {isEn ? "AI Voice Studio & Text to Speech" : "灵动之声：专业级 AI 配音与文字转语音工具"}
          </h1>
          <p className="mt-3 max-w-3xl text-slate-600">
            {isEn
              ? "High-quality AI voice generator for creators. Role, tone and emotion control for TikTok, podcasts and e-learning."
              : "角色、语调、情绪自由组合，专为短视频垂直优化的文字转语音(TTS)工具。支持抖音配音、有声书朗读与广告口播。"}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              className="rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 px-5 py-2.5 font-semibold !text-white shadow-sm shadow-indigo-200 transition hover:from-indigo-600 hover:to-blue-600"
              href="https://apps.apple.com/app/id6758727921"
              target="_blank"
              rel="noreferrer"
            >
              {isEn ? "Download Mac App" : "下载 Mac 版"}
            </a>
            <Link className="rounded-xl border border-white/60 bg-white/40 backdrop-blur-md px-6 py-2.5 font-semibold text-slate-700 shadow-sm transition hover:bg-white/60 hover:shadow" href={`/${l}/try`}>
              {isEn ? "Try on Web" : "在线试用"}
            </Link>
          </div>
        </section>

        <section className="mt-10 mb-12 grid gap-8 md:grid-cols-3">
          {[
            [isEn ? "Professional Roles" : "专业级音色", isEn ? "Loli, warm male, broadcast and 10+ specific roles." : "提供萝莉音、暖男、播音腔、老教授等 10+ 垂直细分音色角色。"],
            [isEn ? "Emotion Controls" : "带情感的配音", isEn ? "Adjust happy, sad, or serious emotions for natural narration." : "支持情绪调节，让文字转语音听起来更自然，不再有呆板的机械感。"],
            [isEn ? "Fast Production" : "高效短视频协作", isEn ? "Quick preview and batch export for TikTok and YouTube shorts." : "极速预览试听，配合 Mac 客户端批量生成，完美适配短视频日更节奏。"],
          ].map(([title, desc]) => (
            <article key={String(title)} className="border-l-2 border-indigo-200/40 pl-5">
              <h2 className="text-lg font-bold text-slate-900/80">{title}</h2>
              <p className="mt-2 text-sm text-slate-600/90 leading-relaxed">{desc}</p>
            </article>
          ))}
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-bold text-slate-900 mb-4">{isEn ? "Explore Featured Voices" : "热门音色专题"}</h2>
          <div className="flex flex-wrap gap-3">
            {[
              { slug: "loli", name_zh: "萝莉音", name_en: "Loli" },
              { slug: "warm-male", name_zh: "治愈暖男", name_en: "Warm Male" },
              { slug: "broadcast", name_zh: "专业播音", name_en: "Broadcast" }
            ].map((v) => (
              <Link
                key={v.slug}
                href={`/${l}/voices/${v.slug}`}
                className="group relative rounded-2xl border border-white/60 bg-white/40 p-4 transition hover:bg-white hover:shadow-md"
              >
                <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-600">{isEn ? v.name_en : v.name_zh}</div>
                <div className="mt-1 text-xs text-slate-500">{isEn ? "Listen now →" : "跳转试听 →"}</div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-5">
          <TrialPanel locale={l} />
        </section>

        <footer className="mt-8 border-t border-slate-300 pt-4 text-sm text-slate-600">
          <div className="flex flex-wrap gap-4">
            <Link href={`/${l}/privacy`}>{isEn ? "Privacy Policy" : "隐私政策"}</Link>
            <Link href={`/${l}/terms`}>{isEn ? "Terms / EULA" : "服务条款 / EULA"}</Link>
            <Link href={`/${l}/support`}>{isEn ? "Support" : "技术支持"}</Link>
            <a href="mailto:support@echovoiceai.net">support@echovoiceai.net</a>
          </div>
        </footer>
      </main>
    </div>
  );
}
