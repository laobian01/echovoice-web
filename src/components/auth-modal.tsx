"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { getSupabaseClient } from "@/lib/supabase";
import { Locale } from "@/lib/i18n";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale?: Locale;
  initialMode?: "login" | "register" | "forgot";
}

export function AuthModal({ isOpen, onClose, locale = "zh", initialMode = "login" }: AuthModalProps) {
  const isEn = locale === "en";
  const [mode, setMode] = useState<"login" | "register" | "forgot" | "magic">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!isOpen || !mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const supabase = getSupabaseClient();
    if (!supabase) {
      setMessage({ type: "error", text: isEn ? "Auth not configured" : "认证未配置" });
      setLoading(false);
      return;
    }

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onClose();
      } else if (mode === "register") {
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: { emailRedirectTo: `${window.location.origin}/${locale}` }
        });
        if (error) throw error;
        setMessage({ type: "success", text: isEn ? "Registration successful! Check your email for verification." : "注册成功！请查看邮件以验证您的账号。" });
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/${locale}/reset-password`,
        });
        if (error) throw error;
        setMessage({ type: "success", text: isEn ? "Password reset link sent to your email." : "重置密码链接已发送至您的邮箱。" });
      } else if (mode === "magic") {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: { emailRedirectTo: `${window.location.origin}/${locale}` },
        });
        if (error) throw error;
        setMessage({ type: "success", text: isEn ? "Magic link sent! Check your email." : "登录链接已发送！请查收邮件。" });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || (isEn ? "Action failed" : "操作失败") });
    } finally {
      setLoading(false);
    }
  };

  const modal = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-black/40 px-4 py-8 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/40 bg-white p-8 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">
            {mode === "login" && (isEn ? "Sign In" : "会员登录")}
            {mode === "register" && (isEn ? "Create Account" : "立即注册")}
            {mode === "forgot" && (isEn ? "Reset Password" : "重置密码")}
            {mode === "magic" && (isEn ? "Magic Link" : "免密登录")}
          </h2>
          <button onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">{isEn ? "Email Address" : "电子邮箱"}</label>
            <input
              type="email"
              required
              className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              placeholder="example@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {(mode === "login" || mode === "register") && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">{isEn ? "Password" : "密码"}</label>
                {mode === "login" && (
                  <button type="button" onClick={() => setMode("forgot")} className="text-xs text-indigo-600 hover:underline">
                    {isEn ? "Forgot password?" : "忘记密码？"}
                  </button>
                )}
              </div>
              <input
                type="password"
                required
                minLength={6}
                className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}

          {message && (
            <div className={`rounded-xl px-4 py-3 text-sm ${message.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-blue-500 py-3 font-semibold text-white shadow-lg transition active:scale-95 disabled:opacity-50"
          >
            {loading ? (isEn ? "Processing..." : "请稍候...") : (
              mode === "login" ? (isEn ? "Sign In" : "立即登录") :
              mode === "register" ? (isEn ? "Sign Up" : "立即注册") :
              (isEn ? "Send Instructions" : "发送指令")
            )}
          </button>
        </form>

        <div className="mt-6 space-y-3 border-t border-slate-100 pt-5">
          {mode !== "login" && (
            <button onClick={() => { setMode("login"); setMessage(null); }} className="block w-full text-center text-sm text-slate-600 hover:text-indigo-600">
              {isEn ? "Already have an account? Sign In" : "已有账号？立即登录"}
            </button>
          )}
          {mode !== "register" && (
            <button onClick={() => { setMode("register"); setMessage(null); }} className="block w-full text-center text-sm text-slate-600 hover:text-indigo-600">
              {isEn ? "New here? Create an account" : "没有账号？立即注册"}
            </button>
          )}
          {mode !== "magic" && (
            <button onClick={() => { setMode("magic"); setMessage(null); }} className="block w-full text-center text-sm text-slate-600 hover:text-indigo-600">
              {isEn ? "Login with Magic Link instead" : "或者使用免密链接登录"}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
