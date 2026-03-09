import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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
    title: l === "en" ? "Terms / EULA - EchoVoice" : "服务条款 / EULA - EchoVoice",
    description: l === "en" ? "EchoVoice terms and EULA." : "EchoVoice 服务条款与 EULA。",
  };
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  const l = ensureLocale(locale);
  const isEn = l === "en";

  return (
    <div className="page-wrap">
      <SiteHeader locale={l} />
      <main className="mx-auto max-w-4xl px-4 pb-16">
        <article className="surface rounded-3xl p-6 leading-8 text-slate-700">
          <h1 className="text-3xl font-bold text-slate-900">{isEn ? "Terms / EULA" : "服务条款 / EULA"}</h1>
          <p className="mt-4">{isEn ? "By using EchoVoice, you agree to these terms. Illegal and infringing uses are prohibited." : "使用 EchoVoice 即表示你同意本条款。你不得利用本服务进行违法或侵权活动。"}</p>
          <p className="mt-3">{isEn ? "Apple users are also subject to Apple's standard EULA:" : "Apple 平台用户同时受 Apple 标准 EULA 约束："}</p>
          <p><a className="underline" target="_blank" rel="noreferrer" href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/">https://www.apple.com/legal/internet-services/itunes/dev/stdeula/</a></p>
          <div className="mt-6 text-sm text-slate-600"><Link className="underline" href={`/${l}`}>{isEn ? "Back Home" : "返回首页"}</Link></div>
        </article>
      </main>
    </div>
  );
}
