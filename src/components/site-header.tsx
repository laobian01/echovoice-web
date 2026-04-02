import Image from "next/image";
import Link from "next/link";
import { Locale } from "@/lib/i18n";

export function SiteHeader({ locale = "zh" }: { locale?: Locale }) {
  const isEn = locale === "en";
  const p = `/${locale}`;

  return (
    <header className="sticky top-0 z-20 mb-6 border-b border-white/40 bg-white/40 backdrop-blur-2xl shadow-[0_2px_10px_0_rgba(31,38,135,0.02)]">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href={p} className="flex items-center gap-3">
          <Image src="/logo.png" alt="EchoVoice Logo" width={36} height={36} className="rounded-xl shadow-sm" />
          <div>
            <p className="text-sm font-semibold text-slate-900">灵动之声 EchoVoice</p>
            <p className="text-xs text-slate-500">{isEn ? "AI Voice Studio" : "AI 语音工作室"}</p>
          </div>
        </Link>

        <nav className="flex items-center gap-2 text-sm">
          <Link className="rounded-full border border-white/60 bg-white/20 px-3 py-1.5 text-slate-700 transition hover:bg-white/60 hover:shadow-sm" href={`${p}/try`}>
            {isEn ? "Try" : "在线试用"}
          </Link>
          <Link className="rounded-full border border-white/60 bg-white/20 px-3 py-1.5 text-slate-700 transition hover:bg-white/60 hover:shadow-sm" href={`${p}/pricing`}>
            {isEn ? "Pricing" : "会员订阅"}
          </Link>
          <Link className="rounded-full border border-white/60 bg-white/20 px-3 py-1.5 text-slate-700 transition hover:bg-white/60 hover:shadow-sm" href={`${p}/support`}>
            {isEn ? "Support" : "支持"}
          </Link>
          <Link
            className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-indigo-700 hover:bg-indigo-100"
            href={isEn ? "/zh" : "/en"}
          >
            {isEn ? "中文" : "EN"}
          </Link>
        </nav>
      </div>
    </header>
  );
}
