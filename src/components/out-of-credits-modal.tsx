"use client";

import { PricingActions } from "./pricing-actions";

export function OutOfCreditsModal({
  isOpen,
  onClose,
  locale,
}: {
  isOpen: boolean;
  onClose: () => void;
  locale: "zh" | "en";
}) {
  if (!isOpen) return null;
  const isEn = locale === "en";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8 pb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-rose-500">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            {isEn ? "Out of Energy ⚡️" : "试用电量已耗尽 ⚡️"}
          </h2>
          <p className="mt-2 text-slate-500 text-sm">
            {isEn 
              ? "You've used all your free generation limits. Upgrade to unlock more power."
              : "您已用完所有免费的配音生成额度。请补充电量以继续使用，或者开启包月不限量服务。"}
          </p>
        </div>

        <div className="bg-slate-50 p-6 pt-4">
          <PricingActions locale={locale} />
          <p className="mt-4 text-center text-xs text-slate-400">
            {isEn ? "Secure payment processed by Creem" : "支付由 Creem 提供安全保障"}
          </p>
        </div>
      </div>
    </div>
  );
}
