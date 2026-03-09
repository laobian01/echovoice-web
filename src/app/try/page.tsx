import type { Metadata } from "next";
import Link from "next/link";
import { TrialPanel } from "@/components/trial-panel";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "在线试用 - EchoVoice",
  description: "在线体验 EchoVoice AI 配音：选择角色、语调和情绪，输入文案后一键试听。",
};

export default function TryPage() {
  return (
    <div className="page-wrap">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 pb-16">
        <div className="mb-5 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900">在线试用</h1>
          <Link className="text-sm text-slate-500 underline" href="/">返回首页</Link>
        </div>
        <TrialPanel />
      </main>
    </div>
  );
}
