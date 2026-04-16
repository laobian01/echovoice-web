"use client";

import React, { useState, useEffect } from "react";

export function FloatingPromo({ locale }: { locale: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const isEn = locale === "en";

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 animate-in fade-in slide-in-from-left-10 duration-700">
      <div className="relative group">
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 opacity-30 blur group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative flex items-center gap-4 rounded-2xl border border-amber-100 bg-white/90 p-4 shadow-2xl backdrop-blur-md">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-2xl animate-bounce">
            🎁
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900">
              {isEn ? "Special Gift!" : "新手限时礼包"}
            </div>
            <div className="mt-0.5 text-xs text-slate-600">
              {isEn ? "Use code: " : "输入兑换码: "}
              <span className="font-mono font-bold text-indigo-600">JUEJIN2026</span>
            </div>
            <div className="mt-1 text-[10px] font-semibold text-emerald-600">
              {isEn ? "+100 Credits Awarded" : "立得 100 次配音额度"}
            </div>
          </div>
          <button 
            onClick={() => setIsVisible(false)}
            className="ml-2 text-slate-400 hover:text-slate-600"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
