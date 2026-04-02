"use client";

import { useState } from "react";
import { Locale } from "@/lib/i18n";

async function goCheckout(plan: "monthly" | "pack100") {
  const res = await fetch("/api/creem/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ plan }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Payment session creation failed");
  if (!data?.url) throw new Error("Missing checkout URL");
  window.location.href = data.url;
}

export function PricingActions({ locale = "zh" }: { locale?: Locale }) {
  const isEn = locale === "en";
  const [loading, setLoading] = useState<"monthly" | "pack100" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const click = async (plan: "monthly" | "pack100") => {
    setError(null);
    setLoading(plan);
    try {
      await goCheckout(plan);
    } catch (e) {
      setLoading(null);
      setError(e instanceof Error ? e.message : isEn ? "Payment failed" : "支付失败");
    }
  };

  return (
    <div>
      <div className="grid gap-3 md:grid-cols-2">
        <button
          onClick={() => click("monthly")}
          disabled={loading !== null}
          className="surface rounded-2xl p-5 text-left transition hover:shadow-lg hover:-translate-y-1 hover:border-white/80 disabled:opacity-50"
        >
          <div className="text-lg font-semibold text-slate-900">{isEn ? "Pro Monthly" : "Pro 月订阅"}</div>
          <p className="mt-1 text-sm text-slate-600">{isEn ? "200 credits per month, renewable." : "每月 200 次额度，可持续更新。"}</p>
          <div className="mt-3 text-xl font-bold text-indigo-700">$5.99 / {isEn ? "month" : "月"}</div>
        </button>

        <button
          onClick={() => click("pack100")}
          disabled={loading !== null}
          className="surface rounded-2xl p-5 text-left transition hover:shadow-lg hover:-translate-y-1 hover:border-white/80 disabled:opacity-50"
        >
          <div className="text-lg font-semibold text-slate-900">{isEn ? "Pack 100" : "加量包 100 次"}</div>
          <p className="mt-1 text-sm text-slate-600">{isEn ? "One-time purchase for extra credits." : "一次性购买，按需补充额度。"}</p>
          <div className="mt-3 text-xl font-bold text-indigo-700">$2.99</div>
        </button>
      </div>

      {loading ? <p className="mt-3 text-sm text-slate-500">{isEn ? "Redirecting to checkout..." : "正在跳转支付..."}</p> : null}
      {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}
    </div>
  );
}
