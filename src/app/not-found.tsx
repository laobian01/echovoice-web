import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SeoFooter } from "@/components/seo-footer";

export default function NotFound() {
  return (
    <div className="page-wrap min-h-screen flex flex-col">
      <SiteHeader locale="en" />
      
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center surface rounded-3xl p-10 mt-10 shadow-xl border border-white/50">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">404</h1>
          <h2 className="mt-2 text-xl font-bold text-slate-800">Page Not Found</h2>
          <p className="mt-4 text-slate-500 mb-8 whitespace-pre-line">
            Oops! The page you are looking for doesn't exist or has been moved.{"\n"}
            糟糕！您访问的页面不存在或已被移动。
          </p>
          
          <div className="grid gap-3 sm:grid-cols-2">
            <Link 
              href="/zh" 
              className="rounded-xl bg-slate-50 px-4 py-3 font-semibold text-slate-700 shadow-sm border border-slate-200 transition hover:bg-slate-100 active:scale-95"
            >
              中 文 首 页
            </Link>
            <Link 
              href="/en" 
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-blue-500 px-4 py-3 font-semibold text-white shadow-md shadow-indigo-200 transition hover:from-indigo-700 hover:to-blue-600 active:scale-95"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>

      <SeoFooter />
    </div>
  );
}
