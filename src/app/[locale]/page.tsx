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
        <section className="surface rounded-3xl p-6">
          <h1 className="text-3xl font-black text-slate-900 md:text-4xl">
            {isEn ? "AI Voice Studio for Creators" : "面向创作者的 AI 配音工作台"}
          </h1>
          <p className="mt-3 max-w-3xl text-slate-600">
            {isEn
              ? "Role, tone and emotion control for short videos, courses, podcasts and voice-over production."
              : "角色、语调、情绪自由组合，适用于短视频配音、课程旁白、播客片段与广告口播。"}
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
            <Link className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 font-semibold text-slate-700" href={`/${l}/try`}>
              {isEn ? "Try on Web" : "在线试用"}
            </Link>
          </div>
        </section>

        <section className="mt-5 grid gap-3 md:grid-cols-3">
          {[
            [isEn ? "Role Presets" : "角色与风格", isEn ? "Male, female, youthful, warm, senior and more." : "支持男声、女声、萝莉、暖男、知性女性、老年与童声等角色。"],
            [isEn ? "Tone & Emotion" : "语调与情绪", isEn ? "Natural, soft, deep, bright and broadcast tones with emotion controls." : "自然/柔和/低沉/明亮/播音，结合平静/开心/悲伤等情绪。"],
            [isEn ? "Fast Preview" : "在线生成试听", isEn ? "Type your script and preview instantly before full production." : "输入文案即可一键生成并播放，验证效果后再进入深度制作。"],
          ].map(([title, desc]) => (
            <article key={String(title)} className="surface rounded-2xl p-5">
              <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
              <p className="mt-2 text-sm text-slate-600">{desc}</p>
            </article>
          ))}
        </section>

        <section className="mt-5">
          <TrialPanel locale={l} />
        </section>

        <footer className="mt-8 border-t border-slate-300 pt-4 text-sm text-slate-600">
          <div className="flex flex-wrap gap-4">
            <Link href={`/${l}/privacy`}>{isEn ? "Privacy Policy" : "隐私政策"}</Link>
            <Link href={`/${l}/terms`}>{isEn ? "Terms / EULA" : "服务条款 / EULA"}</Link>
            <Link href={`/${l}/support`}>{isEn ? "Support" : "技术支持"}</Link>
            <a href="mailto:13770669417jj@gmail.com">13770669417jj@gmail.com</a>
          </div>
        </footer>
      </main>
    </div>
  );
}
