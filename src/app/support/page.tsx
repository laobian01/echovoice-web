import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "技术支持 - EchoVoice",
  description: "EchoVoice 联系方式、订阅说明与退款路径。",
};

export default function SupportPage() {
  return (
    <div className="page-wrap">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 pb-16">
        <div className="surface rounded-3xl p-6">
          <h1 className="text-3xl font-bold text-slate-900">技术支持</h1>
          <p className="mt-3 text-slate-700">客服邮箱：<a className="underline" href="mailto:13770669417jj@gmail.com">13770669417jj@gmail.com</a></p>
          <p className="mt-1 text-sm text-slate-500">通常 1-3 个工作日回复。</p>

          <h2 className="mt-6 text-xl font-semibold text-slate-900">常见问题</h2>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-slate-700">
            <li>取消订阅：Apple 用户在 Apple ID 订阅管理中操作。</li>
            <li>恢复购买：在 App 内点击“恢复购买”。</li>
            <li>退款：通过 <a className="underline" href="https://reportaproblem.apple.com/" target="_blank" rel="noreferrer">Apple 退款页面</a> 申请。</li>
          </ul>

          <div className="mt-6 flex gap-4 text-sm text-slate-600">
            <Link className="underline" href="/privacy">隐私政策</Link>
            <Link className="underline" href="/terms">服务条款</Link>
            <Link className="underline" href="/">返回首页</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
