"use client";

import { useEffect, useMemo, useState } from "react";
import { emotions, roles, tones } from "@/lib/presets";
import { emotionLabel, Locale, roleLabel, toneLabel } from "@/lib/i18n";
import { getSupabaseClient } from "@/lib/supabase";

export function TrialPanel({ locale = "zh" }: { locale?: Locale }) {
  const isEn = locale === "en";
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [trialRemaining, setTrialRemaining] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginMsg, setLoginMsg] = useState<string | null>(null);
  const [roleId, setRoleId] = useState(roles[0].id);
  const [toneId, setToneId] = useState(tones[0].id);
  const [emotionId, setEmotionId] = useState(emotions[0].id);
  const EN_DEFAULT = "Welcome to EchoVoice. This is a sample script for web voice preview.";
  const ZH_DEFAULT = "欢迎使用灵动之声，这是一段网页端试听示例。";
  const [text, setText] = useState(isEn ? EN_DEFAULT : ZH_DEFAULT);
  const isDefaultText = text.trim() === EN_DEFAULT || text.trim() === ZH_DEFAULT;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    const client = getSupabaseClient();
    if (!client) return;

    // Handle magic link code exchange (PKCE)
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    if (code) {
      client.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (!error) {
          // Remove code from URL after exchange
          url.searchParams.delete("code");
          window.history.replaceState({}, document.title, url.pathname + url.search);
        }
      });
    }

    client.auth.getSession().then(({ data }) => {
      setSessionToken(data.session?.access_token || null);
      setUserEmail(data.session?.user?.email || null);
    });
    const { data: sub } = client.auth.onAuthStateChange((_event, session) => {
      setSessionToken(session?.access_token || null);
      setUserEmail(session?.user?.email || null);
    });
    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  const role = useMemo(() => roles.find((x) => x.id === roleId) || roles[0], [roleId]);
  const tone = useMemo(() => tones.find((x) => x.id === toneId) || tones[0], [toneId]);
  const emotion = useMemo(() => emotions.find((x) => x.id === emotionId) || emotions[0], [emotionId]);

  const requestLogin = () => {
    setLoginMsg(null);
    if (!getSupabaseClient()) {
      setError(isEn ? "Trial login not configured" : "试用登录未配置");
      return;
    }
    setLoginOpen(true);
  };

  const sendMagicLink = async () => {
    setLoginMsg(null);
    if (!email.trim()) {
      setLoginMsg(isEn ? "Please enter email" : "请输入邮箱");
      return;
    }
    const client = getSupabaseClient();
    if (!client) {
      setLoginMsg(isEn ? "Supabase not configured" : "Supabase 未配置");
      return;
    }
    const { error: err } = await client.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/${locale}` },
    });
    if (err) {
      setLoginMsg(err.message || (isEn ? "Login failed" : "登录失败"));
      return;
    }
    setLoginMsg(isEn ? "Magic link sent. Check your email." : "登录链接已发送，请查收邮箱");
  };

  const logout = async () => {
    const client = getSupabaseClient();
    if (client) {
      await client.auth.signOut();
    }
    setSessionToken(null);
    setUserEmail(null);
    setTrialRemaining(null);
  };

  const play = async (freeMode = false) => {
    setError(null);
    setLoading(true);
    setAudioUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });

    try {
      if (!sessionToken) {
        setLoading(false);
        requestLogin();
        return;
      }

      if (!freeMode) {
        const trialRes = await fetch("/api/trial/consume", {
          method: "POST",
          headers: { Authorization: `Bearer ${sessionToken}` },
        });
        if (!trialRes.ok) {
          const j = await trialRes.json().catch(() => null);
          throw new Error(j?.error || (isEn ? "Trial check failed" : "试用校验失败"));
        }
        const trialJson = await trialRes.json().catch(() => null);
        if (typeof trialJson?.remaining === "number") {
          setTrialRemaining(trialJson.remaining);
        }
      }

      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          voiceName: role.voiceName,
          speed: tone.speed,
          pitch: tone.pitch,
          emotion: emotionLabel(locale, emotion.id),
          roleDescription: role.roleDescription,
        }),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error || `Request failed (${res.status})`);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      const audio = new Audio(url);
      await audio.play();
    } catch (e) {
      setError(e instanceof Error ? e.message : isEn ? "Generation failed" : "生成失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="surface rounded-3xl p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold text-slate-900">{isEn ? "Web Trial" : "网页端试用"}</h2>
        <span className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs text-indigo-700">{isEn ? "Free Trial" : "免费体验"}</span>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <label className="space-y-1">
          <span className="text-sm text-slate-600">{isEn ? "Role" : "角色"}</span>
          <select className="w-full rounded-xl border border-white/60 bg-white/50 backdrop-blur-sm px-3 py-2 text-slate-900 shadow-sm transition hover:bg-white/70 focus:bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-500/30" value={roleId} onChange={(e) => setRoleId(e.target.value)}>
            {roles.map((r) => <option key={r.id} value={r.id}>{roleLabel(locale, r.id)}</option>)}
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-sm text-slate-600">{isEn ? "Tone" : "语调"}</span>
          <select className="w-full rounded-xl border border-white/60 bg-white/50 backdrop-blur-sm px-3 py-2 text-slate-900 shadow-sm transition hover:bg-white/70 focus:bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-500/30" value={toneId} onChange={(e) => setToneId(e.target.value)}>
            {tones.map((r) => <option key={r.id} value={r.id}>{toneLabel(locale, r.id)}</option>)}
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-sm text-slate-600">{isEn ? "Emotion" : "情绪"}</span>
          <select className="w-full rounded-xl border border-white/60 bg-white/50 backdrop-blur-sm px-3 py-2 text-slate-900 shadow-sm transition hover:bg-white/70 focus:bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-500/30" value={emotionId} onChange={(e) => setEmotionId(e.target.value)}>
            {emotions.map((r) => <option key={r.id} value={r.id}>{emotionLabel(locale, r.id)}</option>)}
          </select>
        </label>
      </div>

      <div className="mt-3 space-y-1">
        <span className="text-sm text-slate-600">{isEn ? "Script" : "文案"}</span>
        <textarea
          className="h-28 w-full resize-none rounded-xl border border-white/60 bg-white/50 backdrop-blur-sm px-3 py-2 text-slate-900 shadow-sm transition hover:bg-white/70 focus:bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 placeholder:text-slate-500"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={isEn ? "Type your script to preview" : "输入文案后试听"}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          onClick={() => play(false)}
          disabled={loading || !text.trim()}
          className="rounded-xl bg-gradient-to-r from-indigo-600 to-blue-500 px-5 py-2.5 font-semibold text-white shadow-sm transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading && !isDefaultText ? (isEn ? "Generating..." : "生成中...") : (isEn ? "Generate & Play" : "带字生成并播放")}
        </button>
        <button
          onClick={() => play(true)}
          disabled={loading || !isDefaultText}
          title={!isDefaultText ? (isEn ? "Modify text requires consuming credits" : "修改文字后需点击左侧按钮消耗额度进行生成") : ""}
          className="rounded-xl border border-white/60 bg-white/40 backdrop-blur-md px-5 py-2.5 font-semibold text-slate-700 shadow-sm transition hover:bg-white/60 hover:shadow disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isEn ? "Free Preview" : "免费试听"}
        </button>
        {audioUrl ? <audio controls src={audioUrl} className="h-9" /> : null}
        <span className={`flex items-center gap-1 rounded-full border px-3 py-1 text-xs ${sessionToken ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-slate-50 text-slate-600"}`}>
          {sessionToken ? (isEn ? "Logged in" : "已登录") : (isEn ? "Not logged in" : "未登录")}
          {sessionToken && userEmail ? ` · ${userEmail}` : ""}
          {sessionToken ? ` · ${isEn ? "Trials left" : "剩余试用"}: ${trialRemaining ?? "?"}` : ""}
          {sessionToken && (
            <>
              <span className="mx-1">|</span>
              <button onClick={logout} className="font-semibold underline hover:text-emerald-900 transition">
                {isEn ? "Log out" : "退出"}
              </button>
            </>
          )}
        </span>
      </div>

      {error ? <p className="mt-3 text-sm text-rose-600">{isEn ? "Error: " : "错误："}{error}</p> : null}

      {loginOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900">{isEn ? "Sign in to get 5 free trials" : "登录后可免费试用 5 次"}</h3>
            <p className="mt-2 text-sm text-slate-600">{isEn ? "We will send a magic link to your email." : "我们会发送登录链接到你的邮箱。"}</p>
            <input
              className="mt-4 w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900"
              placeholder={isEn ? "Email" : "邮箱"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {loginMsg ? <p className="mt-2 text-sm text-slate-600">{loginMsg}</p> : null}
            <div className="mt-4 flex items-center justify-end gap-2">
              <button className="rounded-lg px-4 py-2 text-sm text-slate-600" onClick={() => setLoginOpen(false)}>
                {isEn ? "Close" : "关闭"}
              </button>
              <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white" onClick={sendMagicLink}>
                {isEn ? "Send link" : "发送链接"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
