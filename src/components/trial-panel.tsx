"use client";

import { useEffect, useMemo, useState } from "react";
import { emotions, roles, tones } from "@/lib/presets";
import { emotionLabel, Locale, roleLabel, toneLabel } from "@/lib/i18n";
import { getSupabaseClient } from "@/lib/supabase";
import { AuthModal } from "./auth-modal";
import { GenerationsList } from "./generations-list";
import { OutOfCreditsModal } from "./out-of-credits-modal";
export function TrialPanel({ locale = "zh" }: { locale?: Locale }) {
  const isEn = locale === "en";
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [trialRemaining, setTrialRemaining] = useState<number | null>(null);
  const [isMember, setIsMember] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [outOfCreditsOpen, setOutOfCreditsOpen] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [roleId, setRoleId] = useState(roles[0].id);
  const [toneId, setToneId] = useState(tones[0].id);
  const [emotionId, setEmotionId] = useState(emotions[0].id);
  const EN_DEFAULT = "Welcome to EchoVoice. This is a sample script for web voice preview.";
  const ZH_DEFAULT = "欢迎使用灵动之声，这是一段网页端试听示例。";
  const [text, setText] = useState(isEn ? EN_DEFAULT : ZH_DEFAULT);
  const isDefaultText = text.trim() === EN_DEFAULT || text.trim() === ZH_DEFAULT;
  const MAX_CHARS = 500;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [refreshHistory, setRefreshHistory] = useState(0);

  useEffect(() => {
    const client = getSupabaseClient();
    if (!client) return;

    // Handle magic link code exchange (PKCE)
    // Skip on reset-password page — that page handles its own code exchange
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    const isResetPage = url.pathname.includes("reset-password");
    if (code && !isResetPage) {
      client.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (!error) {
          // Remove code from URL after exchange
          url.searchParams.delete("code");
          window.history.replaceState({}, document.title, url.pathname + url.search);
        }
      });
    }

    // Capture referral code if present
    const refCode = url.searchParams.get("ref");
    if (refCode) {
      localStorage.setItem("echovoice_ref", refCode);
    }

    client.auth.getSession().then(({ data }) => {
      setSessionToken(data.session?.access_token || null);
      setUserEmail(data.session?.user?.email || null);
      setUserId(data.session?.user?.id || null);
    });
    const { data: sub } = client.auth.onAuthStateChange((_event, session) => {
      setSessionToken(session?.access_token || null);
      setUserEmail(session?.user?.email || null);
      setUserId(session?.user?.id || null);
    });
    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (sessionToken) {
      // 1. Fetch credits info
      fetch("/api/trial/consume", {
        method: "POST",
        headers: { Authorization: `Bearer ${sessionToken}` },
        body: JSON.stringify({ checkOnly: true })
      }).then(res => res.json()).then(data => {
        if (typeof data.remaining === 'number') {
          setTrialRemaining(data.remaining);
          setIsMember(!!data.isMember);
        }
      }).catch(() => {});

      // 2. Process referral if any
      const savedRef = localStorage.getItem("echovoice_ref");
      if (savedRef) {
        fetch("/api/referral/redeem", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json", 
            "Authorization": `Bearer ${sessionToken}` 
          },
          body: JSON.stringify({ ref: savedRef })
        }).then(() => {
          localStorage.removeItem("echovoice_ref");
        }).catch(() => {});
      }
    }
  }, [sessionToken]);

  const role = useMemo(() => roles.find((x) => x.id === roleId) || roles[0], [roleId]);
  const tone = useMemo(() => tones.find((x) => x.id === toneId) || tones[0], [toneId]);
  const emotion = useMemo(() => emotions.find((x) => x.id === emotionId) || emotions[0], [emotionId]);

  const requestLogin = () => {
    if (!getSupabaseClient()) {
      setError(isEn ? "Trial login not configured" : "试用登录未配置");
      return;
    }
    setLoginOpen(true);
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
          const errMessage = j?.error || (isEn ? "Trial check failed" : "试用校验失败");
          if (trialRes.status === 403 || errMessage.includes("已用完")) {
            setOutOfCreditsOpen(true);
            setLoading(false);
            return;
          }
          throw new Error(errMessage);
        }
        const trialJson = await trialRes.json().catch(() => null);
        if (typeof trialJson?.remaining === "number") {
          setTrialRemaining(trialJson.remaining);
          setIsMember(!!trialJson.isMember);
        }
      }

      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(sessionToken ? { "Authorization": `Bearer ${sessionToken}` } : {})
        },
        body: JSON.stringify({
          text,
          voiceName: role.voiceName,
          roleName: role.name,
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
      
      // Trigger history list refresh if logged in
      if (sessionToken && !freeMode) {
        setRefreshHistory(v => v + 1);
      }
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
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">{isEn ? "Script" : "文案"}</span>
          <div className="flex gap-2">
            <button 
              onClick={() => setText(text.replace(/,/g, "，").replace(/\./g, "。").replace(/\?/g, "？").replace(/!/g, "！"))}
              className="text-xs text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded transition"
              title={isEn ? "Format English punctuation to Chinese for better AI pauses" : "将英文标点转为中文全角标点，有助于获得更好的停顿效果"}
            >
              {isEn ? "Format Punctuation" : "修正标点"}
            </button>
            <button 
              onClick={() => setText("")}
              className="text-xs text-slate-500 hover:bg-slate-100 px-2 py-1 rounded transition"
            >
              {isEn ? "Clear" : "清空"}
            </button>
          </div>
        </div>
        <div className="relative">
          <textarea
            className={`h-32 w-full resize-none rounded-xl border bg-white/50 backdrop-blur-sm px-3 py-2 text-slate-900 shadow-sm transition hover:bg-white/70 focus:bg-white/80 focus:outline-none focus:ring-2 placeholder:text-slate-500 ${text.length > MAX_CHARS ? 'border-rose-500 focus:ring-rose-500/30' : 'border-white/60 focus:ring-indigo-500/30'}`}
            value={text}
            onChange={(e) => setText(e.target.value.substring(0, MAX_CHARS))}
            placeholder={isEn ? "Type your script to preview" : "输入文案后试听"}
            maxLength={MAX_CHARS}
          />
          <span className={`absolute bottom-2 right-2 text-xs font-mono ${text.length >= MAX_CHARS ? 'text-rose-500' : 'text-slate-400'}`}>
            {text.length} / {MAX_CHARS}
          </span>
        </div>
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
        <span className={`flex items-center gap-1 rounded-full border px-3 py-1 text-xs ${sessionToken ? (isMember ? "border-amber-200 bg-amber-50 text-amber-700" : "border-emerald-200 bg-emerald-50 text-emerald-700") : "border-slate-200 bg-slate-50 text-slate-600"}`}>
          {sessionToken ? (isMember ? (isEn ? "Pro Member" : "专业版会员") : (isEn ? "Logged in" : "已登录")) : (isEn ? "Not logged in" : "未登录")}
          {sessionToken && userEmail ? ` · ${userEmail}` : ""}
          {sessionToken ? ` · ${isMember ? (isEn ? "Credits" : "剩余额度") : (isEn ? "Trials left" : "剩余试用")}: ${trialRemaining ?? "?"}` : ""}
          {sessionToken && (
            <>
              <span className="mx-1">|</span>
              <button onClick={() => setShowInviteModal(true)} className="flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-800 transition">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                {isEn ? "Invite & Get Credits" : "邀请送额度"}
              </button>
              <span className="mx-1">|</span>
              <button onClick={logout} className="font-semibold underline hover:opacity-70 transition">
                {isEn ? "Log out" : "退出"}
              </button>
            </>
          )}
        </span>
      </div>

      {error ? <p className="mt-3 text-sm text-rose-600">{isEn ? "Error: " : "错误："}{error}</p> : null}

      {loginOpen && (
        <AuthModal 
          isOpen={loginOpen} 
          onClose={() => setLoginOpen(false)} 
          locale={locale} 
        />
      )}

      <OutOfCreditsModal 
        isOpen={outOfCreditsOpen} 
        onClose={() => setOutOfCreditsOpen(false)} 
        locale={locale} 
      />

      {showInviteModal && userId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl p-6 w-full max-w-md relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setShowInviteModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <h3 className="text-xl font-bold text-slate-900 mb-2">🎁 {isEn ? "Invite & Earn" : "邀请送额度"}</h3>
            <p className="text-sm text-slate-600 mb-4">
              {isEn 
                ? "Share your custom link. When a friend signs up, they get +10 credits instantly, and you get +10 credits!" 
                : "复制专属链接发送给好友。好友注册即可获得额外 10 次额度，你也将同时获得 10 次额度！无上限。"}
            </p>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-3">
              <input 
                readOnly 
                className="bg-transparent border-none outline-none w-full text-sm text-slate-700" 
                value={`https://echovoiceai.net/${locale}?ref=${userId}`}
              />
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(`https://echovoiceai.net/${locale}?ref=${userId}`);
                  alert(isEn ? "Copied!" : "链接已复制！");
                }}
                className="shrink-0 bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
              >
                {isEn ? "Copy" : "复制"}
              </button>
            </div>
          </div>
        </div>
      )}

      {sessionToken && (
        <GenerationsList locale={locale} refreshTrigger={refreshHistory} />
      )}
    </section>
  );
}
