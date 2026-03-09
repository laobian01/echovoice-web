import type { Metadata } from "next";
import Link from "next/link";
import { PricingActions } from "@/components/pricing-actions";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "会员订阅与加量包 - EchoVoice",
  description: "在网页端购买 EchoVoice Pro 月订阅或加量包。",
};

export default function PricingPage() {
  return (
    <div className="page-wrap">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 pb-16">
        <div className="mb-5 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900">会员订阅与加量包</h1>
          <Link className="text-sm text-slate-500 underline" href="/">返回首页</Link>
        </div>

        <section className="surface rounded-3xl p-5">
          <p className="mb-4 text-sm text-slate-600">
            支付流程接入后可直接在网页完成购买。当前页面先展示订阅结构与价格位。
          </p>
          <PricingActions />
        </section>
      </main>
    </div>
  );
}
