import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TrialPanel } from "@/components/trial-panel";
import { SiteHeader } from "@/components/site-header";
import { Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

function ensureLocale(locale: string): Locale {
  if (locale !== "zh" && locale !== "en") notFound();
  return locale;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const l = ensureLocale(locale);
  return {
    title: l === "en" ? "Web Trial - EchoVoice" : "在线试用 - EchoVoice",
    description: l === "en" ? "Try EchoVoice AI voice generation in browser." : "在线体验 EchoVoice AI 配音。",
  };
}

export default async function TryPage({ params }: Props) {
  const { locale } = await params;
  const l = ensureLocale(locale);
  const isEn = l === "en";

  return (
    <div className="page-wrap">
      <SiteHeader locale={l} />
      <main className="mx-auto max-w-4xl px-4 pb-16">
        <div className="mb-5 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900">{isEn ? "Web Trial" : "在线试用"}</h1>
          <Link className="text-sm text-slate-500 underline" href={`/${l}`}>{isEn ? "Back Home" : "返回首页"}</Link>
        </div>
        <TrialPanel locale={l} />
      </main>
    </div>
  );
}
