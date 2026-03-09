import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PricingActions } from "@/components/pricing-actions";
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
    title: l === "en" ? "Pricing - EchoVoice" : "会员订阅与加量包 - EchoVoice",
    description: l === "en" ? "Buy EchoVoice Pro monthly subscription or credit pack." : "在网页端购买 EchoVoice Pro 月订阅或加量包。",
  };
}

export default async function PricingPage({ params }: Props) {
  const { locale } = await params;
  const l = ensureLocale(locale);
  const isEn = l === "en";

  return (
    <div className="page-wrap">
      <SiteHeader locale={l} />
      <main className="mx-auto max-w-4xl px-4 pb-16">
        <div className="mb-5 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900">{isEn ? "Pricing" : "会员订阅与加量包"}</h1>
          <Link className="text-sm text-slate-500 underline" href={`/${l}`}>{isEn ? "Back Home" : "返回首页"}</Link>
        </div>

        <section className="surface rounded-3xl p-5">
          <p className="mb-4 text-sm text-slate-600">
            {isEn ? "Checkout integration is ready. Connect your payment provider account to go live." : "支付结构已准备好，接入支付商账户后即可上线。"}
          </p>
          <PricingActions locale={l} />
        </section>
      </main>
    </div>
  );
}
