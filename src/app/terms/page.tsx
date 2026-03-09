import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "服务条款 - EchoVoice",
  description: "EchoVoice 服务条款与 EULA 说明。",
};

export default function TermsPage() {
  return (
    <div className="page-wrap">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 pb-16">
        <article className="surface rounded-3xl p-6 leading-8 text-slate-700">
          <h1 className="text-3xl font-bold text-slate-900">服务条款 / EULA</h1>
          <p className="mt-4">使用 EchoVoice 即表示你同意本条款。你不得利用本服务进行违法或侵权活动。</p>
          <p className="mt-3">Apple 平台用户同时受 Apple 标准 EULA 约束：</p>
          <p><a className="underline" target="_blank" rel="noreferrer" href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/">https://www.apple.com/legal/internet-services/itunes/dev/stdeula/</a></p>
          <div className="mt-6 text-sm text-slate-600"><Link className="underline" href="/">返回首页</Link></div>
        </article>
      </main>
    </div>
  );
}
