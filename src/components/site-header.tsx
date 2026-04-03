"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Locale } from "@/lib/i18n";
import { getSupabaseClient } from "@/lib/supabase";
import { AuthModal } from "./auth-modal";

export function SiteHeader({ locale = "zh" }: { locale?: Locale }) {
  const isEn = locale === "en";
  const p = `/${locale}`;

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    const client = getSupabaseClient();
    if (!client) return;

    client.auth.getSession().then(({ data }) => {
      setUserEmail(data.session?.user?.email || null);
    });

    const { data: sub } = client.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email || null);
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    const client = getSupabaseClient();
    if (client) await client.auth.signOut();
  };

  return (
    <header className="sticky top-0 z-20 mb-6 border-b border-white/40 bg-white/40 backdrop-blur-2xl shadow-[0_2px_10px_0_rgba(31,38,135,0.02)]">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href={p} className="flex items-center gap-3">
          <div className="relative h-9 w-9">
            <Image src="/logo.png" alt="EchoVoice Logo" fill className="rounded-xl shadow-sm object-cover" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-900">灵动之声 EchoVoice</p>
            <p className="text-xs text-slate-500">{isEn ? "AI Voice Studio" : "AI 语音工作室"}</p>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-2 text-sm">
            <Link className="rounded-full border border-white/60 bg-white/20 px-3 py-1.5 text-slate-700 transition hover:bg-white/60 hover:shadow-sm" href={`${p}/try`}>
              {isEn ? "Try" : "在线试用"}
            </Link>
            <Link className="rounded-full border border-white/60 bg-white/20 px-3 py-1.5 text-slate-700 transition hover:bg-white/60 hover:shadow-sm" href={`${p}/pricing`}>
              {isEn ? "Pricing" : "会员订阅"}
            </Link>
            <Link className="rounded-full border border-white/60 bg-white/20 px-3 py-1.5 text-slate-700 transition hover:bg-white/60 hover:shadow-sm" href={`${p}/support`}>
              {isEn ? "Support" : "支持"}
            </Link>
          </nav>

          <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
            {userEmail ? (
              <div className="flex items-center gap-3">
                <div className="hidden lg:block text-right">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">{isEn ? "Signed in as" : "已登录账号"}</p>
                  <p className="text-xs font-medium text-slate-600 truncate max-w-[120px]">{userEmail}</p>
                </div>
                <button 
                  onClick={logout}
                  className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition"
                >
                  {isEn ? "Log out" : "登出账号"}
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setAuthOpen(true)}
                className="rounded-full bg-indigo-600 px-4 py-1.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 transition active:scale-95"
              >
                {isEn ? "Sign In" : "会员登录"}
              </button>
            )}

            <Link
              className="ml-1 flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-[10px] font-bold text-slate-600 hover:bg-slate-50"
              href={isEn ? "/zh" : "/en"}
            >
              {isEn ? "中" : "EN"}
            </Link>
          </div>
        </div>
      </div>

      <AuthModal 
        isOpen={authOpen} 
        onClose={() => setAuthOpen(false)} 
        locale={locale} 
      />
    </header>
  );
}
