"use client";

import { useMemo, useState } from "react";
import { emotions, roles, tones } from "@/lib/presets";
import { emotionLabel, Locale, roleLabel, toneLabel } from "@/lib/i18n";

export function TrialPanel({ locale = "zh" }: { locale?: Locale }) {
  const isEn = locale === "en";
  const [roleId, setRoleId] = useState(roles[0].id);
  const [toneId, setToneId] = useState(tones[0].id);
  const [emotionId, setEmotionId] = useState(emotions[0].id);
  const [text, setText] = useState(
    isEn
      ? "Welcome to EchoVoice. This is a sample script for web voice preview."
      : "欢迎使用灵动之声，这是一段网页端试听示例。"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const role = useMemo(() => roles.find((x) => x.id === roleId) || roles[0], [roleId]);
  const tone = useMemo(() => tones.find((x) => x.id === toneId) || tones[0], [toneId]);
  const emotion = useMemo(() => emotions.find((x) => x.id === emotionId) || emotions[0], [emotionId]);

  const play = async () => {
    setError(null);
    setLoading(true);
    setAudioUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });

    try {
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
          <select className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900" value={roleId} onChange={(e) => setRoleId(e.target.value)}>
            {roles.map((r) => <option key={r.id} value={r.id}>{roleLabel(locale, r.id)}</option>)}
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-sm text-slate-600">{isEn ? "Tone" : "语调"}</span>
          <select className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900" value={toneId} onChange={(e) => setToneId(e.target.value)}>
            {tones.map((r) => <option key={r.id} value={r.id}>{toneLabel(locale, r.id)}</option>)}
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-sm text-slate-600">{isEn ? "Emotion" : "情绪"}</span>
          <select className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900" value={emotionId} onChange={(e) => setEmotionId(e.target.value)}>
            {emotions.map((r) => <option key={r.id} value={r.id}>{emotionLabel(locale, r.id)}</option>)}
          </select>
        </label>
      </div>

      <div className="mt-3 space-y-1">
        <span className="text-sm text-slate-600">{isEn ? "Script" : "文案"}</span>
        <textarea
          className="h-28 w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={isEn ? "Type your script to preview" : "输入文案后试听"}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          onClick={play}
          disabled={loading || !text.trim()}
          className="rounded-xl bg-gradient-to-r from-indigo-600 to-blue-500 px-5 py-2.5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (isEn ? "Generating..." : "生成中...") : (isEn ? "Generate & Play" : "生成并播放")}
        </button>
        {audioUrl ? <audio controls src={audioUrl} className="h-9" /> : null}
      </div>

      {error ? <p className="mt-3 text-sm text-rose-600">{isEn ? "Error: " : "错误："}{error}</p> : null}
    </section>
  );
}
