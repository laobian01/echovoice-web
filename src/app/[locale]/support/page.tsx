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
    title: l === "en" ? "Support - EchoVoice" : "技术支持 - EchoVoice",
    description: l === "en" ? "Contact, subscription and refund info for EchoVoice." : "EchoVoice 联系方式、订阅说明与退款路径。",
  };
}

export default async function SupportPage({ params }: Props) {
  const { locale } = await params;
  const l = ensureLocale(locale);
  const isEn = l === "en";

  return (
    <div className="page-wrap">
      <SiteHeader locale={l} />
      <main className="mx-auto max-w-4xl px-4 pb-16">
        <div className="surface rounded-3xl p-6">
          <h1 className="text-3xl font-bold text-slate-900">{isEn ? "Support" : "技术支持"}</h1>
          <p className="mt-3 text-slate-700">
            {isEn ? "Support email:" : "客服邮箱："}
            <a className="underline" href="mailto:support@echovoiceai.net">support@echovoiceai.net</a>
          </p>
          <p className="mt-1 text-sm text-slate-500">{isEn ? "Usually replied in 1-3 business days." : "通常 1-3 个工作日回复。"}</p>

          <h2 className="mt-6 text-xl font-semibold text-slate-900">{isEn ? "FAQ" : "常见问题"}</h2>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-slate-700">
            <li>{isEn ? "Cancel subscription from your Apple ID subscription settings." : "取消订阅：Apple 用户在 Apple ID 订阅管理中操作。"}</li>
            <li>{isEn ? "Restore purchases from the app." : "恢复购买：在 App 内点击“恢复购买”。"}</li>
            <li>
              {isEn ? "Refunds:" : "退款："}
              <a className="underline" href="https://reportaproblem.apple.com/" target="_blank" rel="noreferrer">
                https://reportaproblem.apple.com/
              </a>
            </li>
          </ul>

          <div className="mt-6 flex gap-4 text-sm text-slate-600">
            <Link className="underline" href={`/${l}/privacy`}>{isEn ? "Privacy" : "隐私政策"}</Link>
            <Link className="underline" href={`/${l}/terms`}>{isEn ? "Terms" : "服务条款"}</Link>
            <Link className="underline" href={`/${l}`}>{isEn ? "Back Home" : "返回首页"}</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
