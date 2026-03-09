import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "隐私政策 - EchoVoice",
  description: "EchoVoice 隐私政策。",
};

export default function PrivacyPage() {
  return (
    <div className="page-wrap">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 pb-16">
        <article className="surface rounded-3xl p-6 leading-8 text-slate-700">
          <h1 className="text-3xl font-bold text-slate-900">隐私政策</h1>
          <p className="mt-2 text-sm text-slate-500">最后更新：2026-03-03</p>

          <h2 className="mt-6 text-xl font-semibold text-slate-900">1. 收集的信息</h2>
          <p>我们可能处理订阅状态、基础诊断信息以及你主动输入的文案内容，仅用于提供语音生成功能和提升稳定性。</p>

          <h2 className="mt-6 text-xl font-semibold text-slate-900">2. 使用目的</h2>
          <p>用于功能提供、订阅校验、故障排查与反滥用防护。我们不会出售你的个人信息。</p>

          <h2 className="mt-6 text-xl font-semibold text-slate-900">3. 联系方式</h2>
          <p>邮箱：<a className="underline" href="mailto:13770669417jj@gmail.com">13770669417jj@gmail.com</a></p>

          <div className="mt-6 text-sm text-slate-600"><Link className="underline" href="/">返回首页</Link></div>
        </article>
      </main>
    </div>
  );
}
