"use client";

import { useState, useEffect } from "react";
import { getSupabaseClient } from "@/lib/supabase";
import { SiteHeader } from "@/components/site-header";
import { useParams } from "next/navigation";
import type { Locale } from "@/lib/i18n";

export default function ResetPasswordPage() {
  const params = useParams();
  const locale = (params?.locale as Locale) || "zh";
  const isEn = locale === "en";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [checking, setChecking] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const client = getSupabaseClient();
    if (!client) { setChecking(false); return; }

    // Handle ?code= parameter (PKCE flow)
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");

    const init = async () => {
      if (code) {
        const { error } = await client.auth.exchangeCodeForSession(code);
        if (error) {
          setMessage({ type: "error", text: isEn ? "Invalid or expired reset link." : "重置链接无效或已过期。" });
          setChecking(false);
          return;
        }
        url.searchParams.delete("code");
        window.history.replaceState({}, document.title, url.pathname);
      }

      // Check for existing session (from /auth/confirm route or code exchange)
      const { data: { session } } = await client.auth.getSession();
      if (session) {
        setReady(true);
      } else {
        setMessage({ type: "error", text: isEn ? "No active session. Please click the reset link from your email again." : "无有效会话，请重新点击邮件中的重置链接。" });
      }
      setChecking(false);
    };

    init();

    // Also listen for PASSWORD_RECOVERY event
    const { data: sub } = client.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
        setChecking(false);
      }
    });

    return () => { sub.subscription.unsubscribe(); };
  }, [isEn]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (password.length < 6) {
      setMessage({ type: "error", text: isEn ? "Password must be at least 6 characters." : "密码至少需要 6 个字符。" });
      return;
    }
    if (password !== confirmPassword) {
      setMessage({ type: "error", text: isEn ? "Passwords do not match." : "两次输入的密码不一致。" });
      return;
    }

    const client = getSupabaseClient();
    if (!client) return;

    setLoading(true);
    try {
      const { error } = await client.auth.updateUser({ password });
      if (error) throw error;
      setMessage({ type: "success", text: isEn ? "Password updated! You can now sign in with your new password." : "密码已更新成功！您现在可以使用新密码登录了。" });
      setPassword("");
      setConfirmPassword("");
      setReady(false);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || (isEn ? "Failed to update password." : "密码更新失败。") });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/80 via-white to-sky-50/80">
      <SiteHeader locale={locale} />
      <main className="mx-auto max-w-md px-4 py-16">
        <div className="overflow-hidden rounded-3xl border border-white/40 bg-white/80 p-8 shadow-2xl backdrop-blur-2xl">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
              <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              {isEn ? "Set New Password" : "设置新密码"}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              {isEn ? "Enter your new password below." : "请在下方输入您的新密码。"}
            </p>
          </div>

          {checking && (
            <p className="text-center text-sm text-slate-500">{isEn ? "Verifying reset link..." : "正在验证重置链接..."}</p>
          )}

          {ready && !checking && (
            <form onSubmit={handleReset} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">{isEn ? "New Password" : "新密码"}</label>
                <input type="password" required minLength={6}
                  className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">{isEn ? "Confirm Password" : "确认密码"}</label>
                <input type="password" required minLength={6}
                  className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
              <button type="submit" disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-blue-500 py-3 font-semibold text-white shadow-lg transition active:scale-95 disabled:opacity-50">
                {loading ? (isEn ? "Updating..." : "正在更新...") : (isEn ? "Update Password" : "更新密码")}
              </button>
            </form>
          )}

          {message && (
            <div className={`mt-4 rounded-xl px-4 py-3 text-sm ${message.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
              {message.text}
            </div>
          )}

          {message?.type === "success" && (
            <a href={`/${locale}`} className="mt-4 block w-full rounded-xl border border-slate-200 py-3 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
              {isEn ? "Back to Home" : "返回首页"}
            </a>
          )}
        </div>
      </main>
    </div>
  );
}
