"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    Paddle?: {
      Environment: { set: (env: "production" | "sandbox") => void };
      Initialize: (options: { token: string }) => void;
    };
  }
}

export default function CheckoutPage() {
  const [ready, setReady] = useState(false);
  const clientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
  const env = (process.env.NEXT_PUBLIC_PADDLE_ENV || "production") as "production" | "sandbox";

  useEffect(() => {
    if (!clientToken) return;
    if (!window.Paddle) return;
    try {
      window.Paddle.Environment.set(env);
      window.Paddle.Initialize({ token: clientToken });
      setReady(true);
    } catch {
      // Paddle.js will handle checkout; no-op on init error
    }
  }, [clientToken, env]);

  return (
    <main className="min-h-screen bg-slate-50">
      <Script src="https://cdn.paddle.com/paddle/v2/paddle.js" strategy="afterInteractive" />
      <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-6 text-center">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">正在打开支付…</h1>
          <p className="mt-2 text-sm text-slate-600">
            如果没有自动弹出支付窗口，请稍等或刷新页面。
          </p>
          <p className="mt-3 text-xs text-slate-500">
            {clientToken ? (ready ? "Paddle 已初始化" : "正在初始化 Paddle…") : "缺少 Paddle Client Token"}
          </p>
        </div>
      </div>
    </main>
  );
}
