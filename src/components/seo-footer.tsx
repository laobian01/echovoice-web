"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { voicesData, solutionsData } from "@/lib/seo-data";

export function SeoFooter() {
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] || "zh";
  const l = (locale === "zh" || locale === "en") ? locale : "zh";
  const isEn = l === "en";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 border-t border-slate-100 mt-12">
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <h4 className="text-sm font-bold text-slate-900 mb-4">{isEn ? "Voices" : "音色专题"}</h4>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {voicesData.map((v) => (
              <Link
                key={v.slug}
                href={`/${l}/voices/${v.slug}`}
                className="text-xs text-slate-500 hover:text-indigo-600 transition"
              >
                {v.title[l].split(" - ")[0]}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900 mb-4">{isEn ? "Solutions" : "行业方案"}</h4>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {solutionsData.map((v) => (
              <Link
                key={v.slug}
                href={`/${l}/solutions/${v.slug}`}
                className="text-xs text-slate-500 hover:text-indigo-600 transition"
              >
                {v.title[l].split(" - ")[0]}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900 mb-4">{isEn ? "More" : "更多"}</h4>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">
            <Link href={`/${l}/blog`} className="hover:text-indigo-600">{isEn ? "Blog" : "博客"}</Link>
            <Link href={`/${l}/try`} className="hover:text-indigo-600">{isEn ? "Web Trial" : "网页端试用"}</Link>
            <Link href={`/${l}/pricing`} className="hover:text-indigo-600">{isEn ? "Pricing" : "定价"}</Link>
            <a href="https://apps.apple.com/app/id6758727921" target="_blank" className="hover:text-indigo-600">Mac App</a>
          </div>
        </div>
      </div>
      <p className="mt-8 text-center text-[10px] text-slate-400 uppercase tracking-widest">
        © 2026 EchoVoice Studio. {isEn ? "AI powered voice generation." : "AI 驱动的专业配音工具。"}
      </p>
    </div>
  );
}
