import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "退款政策 - EchoVoice",
  description: "EchoVoice 退款与取消政策。",
};

export default function RefundPage() {
  return (
    <div className="page-wrap">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 pb-16">
        <article className="surface rounded-3xl p-6 leading-8 text-slate-700">
          <h1 className="text-3xl font-bold text-slate-900">退款政策</h1>
          <p className="mt-2 text-sm text-slate-500">最后更新：2026-03-12</p>

          <h2 className="mt-6 text-xl font-semibold text-slate-900">1. 订阅退款</h2>
          <p>订阅为数字服务，一经开通即开始提供服务。一般情况下不提供已扣费周期的退款。</p>

          <h2 className="mt-6 text-xl font-semibold text-slate-900">2. 加量包退款</h2>
          <p>加量包为一次性数字商品，购买后立即生效，通常不予退款。</p>

          <h2 className="mt-6 text-xl font-semibold text-slate-900">3. 例外情况</h2>
          <p>若出现重复扣费、系统错误或无法使用的情况，请联系我们处理。我们将根据具体情况协助退款或补偿。</p>

          <h2 className="mt-6 text-xl font-semibold text-slate-900">4. 联系方式</h2>
          <p>邮箱：<a className="underline" href="mailto:13770669417jj@gmail.com">13770669417jj@gmail.com</a></p>

          <div className="mt-6 text-sm text-slate-600">
            <Link className="underline" href="/">返回首页</Link>
          </div>
        </article>
      </main>
    </div>
  );
}
