"use client";

import React, { useState, useRef, useEffect } from "react";

const SAMPLES = [
  {
    id: "loli",
    name_zh: "活泼萝莉",
    name_en: "Lively Loli",
    tag_zh: "可爱 · 活泼",
    tag_en: "Cute & Energetic",
    text_zh: "欢迎来到灵动之声！今天也要元气满满哦！",
    text_en: "Welcome to EchoVoice! Let's have a fantastic day full of energy!",
    voiceName: "Leda",
    speed: 1.06,
    pitch: 1.14,
    emotion: "开心",
    roleDescription: "少女感，活泼轻快",
  },
  {
    id: "warmman",
    name_zh: "治愈暖男",
    name_en: "Warm & Healing",
    tag_zh: "磁性 · 治愈",
    tag_en: "Magnetic & Warm",
    text_zh: "不管走得多远，记得在这里，总有一盏灯为你而留。",
    text_en: "No matter how far you go, there is always a light waiting here for you.",
    voiceName: "Puck",
    speed: 0.92,
    pitch: 1.0,
    emotion: "温暖",
    roleDescription: "温暖陪伴，亲和自然",
  },
  {
    id: "movie",
    name_zh: "影视解说",
    name_en: "Movie Narrator",
    tag_zh: "专业 · 节奏感",
    tag_en: "Rhythmic & Pro",
    text_zh: "注意看，这个男人叫小帅，他正在使用一款神奇的配音工具。",
    text_en: "Take notice: this man is using a magical AI dubbing tool that changes everything.",
    voiceName: "Charon",
    speed: 1.0,
    pitch: 0.95,
    emotion: "平静",
    roleDescription: "影视剧解说，小帅风格，娓娓道来",
  },
];

export function HeroSamples({ locale = "zh" }: { locale?: string }) {
  const isEn = locale === "en";
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [errorId, setErrorId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Cache: sampleId -> blob URL
  const cacheRef = useRef<Record<string, string>>({});

  useEffect(() => {
    // Pre-warm cache from localStorage on mount
    SAMPLES.forEach((s) => {
      try {
        const stored = localStorage.getItem(`echovoice_sample_${s.id}`);
        if (stored) {
          const bytes = Uint8Array.from(atob(stored), (c) => c.charCodeAt(0));
          const blob = new Blob([bytes], { type: "audio/wav" });
          cacheRef.current[s.id] = URL.createObjectURL(blob);
        }
      } catch {}
    });
  }, []);

  const handlePlay = async (s: typeof SAMPLES[0]) => {
    // If currently playing this one, pause it
    if (playingId === s.id) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }

    // Stop any existing playback
    audioRef.current?.pause();
    setPlayingId(null);
    setErrorId(null);

    // Use cached blob URL if available
    if (cacheRef.current[s.id]) {
      audioRef.current!.src = cacheRef.current[s.id];
      audioRef.current!.play();
      setPlayingId(s.id);
      return;
    }

    // Otherwise fetch from API
    setLoadingId(s.id);
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: isEn ? s.text_en : s.text_zh,
          voiceName: s.voiceName,
          speed: s.speed,
          pitch: s.pitch,
          emotion: s.emotion,
          roleDescription: s.roleDescription,
        }),
      });

      if (!res.ok) throw new Error("TTS failed");

      const arrayBuffer = await res.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);

      // Cache to localStorage as base64
      try {
        const base64 = btoa(String.fromCharCode(...bytes));
        localStorage.setItem(`echovoice_sample_${s.id}`, base64);
      } catch {}

      const blob = new Blob([bytes], { type: res.headers.get("content-type") || "audio/wav" });
      const blobUrl = URL.createObjectURL(blob);
      cacheRef.current[s.id] = blobUrl;

      audioRef.current!.src = blobUrl;
      audioRef.current!.play();
      setPlayingId(s.id);
    } catch (e) {
      setErrorId(s.id);
      setTimeout(() => setErrorId(null), 2000);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="mt-8 grid gap-3 sm:grid-cols-3">
      <audio
        ref={audioRef}
        onEnded={() => setPlayingId(null)}
        onPause={() => setPlayingId(null)}
      />
      {SAMPLES.map((s) => {
        const isPlaying = playingId === s.id;
        const isLoading = loadingId === s.id;
        const isError = errorId === s.id;

        return (
          <button
            key={s.id}
            onClick={() => handlePlay(s)}
            className="group relative flex items-center gap-3 rounded-2xl border border-white/60 bg-white/40 p-3 text-left backdrop-blur-md transition-all hover:bg-white/80 hover:shadow-lg hover:shadow-indigo-500/10 active:scale-[0.98]"
          >
            {/* Play / Pause / Loading icon */}
            <div
              className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full transition-all ${
                isPlaying
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                  : isError
                  ? "bg-red-100 text-red-500"
                  : "border border-indigo-100 bg-white text-indigo-600 shadow-sm group-hover:bg-indigo-50"
              }`}
            >
              {isLoading ? (
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : isError ? (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : isPlaying ? (
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg className="ml-0.5 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="truncate text-xs font-bold text-slate-800">
                  {isEn ? s.name_en : s.name_zh}
                </span>
                <span className="rounded-md bg-indigo-100/60 px-1.5 py-0.5 text-[10px] font-medium text-indigo-600">
                  {isEn ? s.tag_en : s.tag_zh}
                </span>
              </div>
              <p className="mt-0.5 truncate text-[10px] italic text-slate-500">
                {isLoading
                  ? isEn ? "Generating…" : "生成中，请稍候…"
                  : isError
                  ? isEn ? "Failed, please retry" : "生成失败，请重试"
                  : `"${isEn ? s.text_en : s.text_zh}"`}
              </p>
            </div>

            {/* "First time" hint badge */}
            {!cacheRef.current[s.id] && !isLoading && !isPlaying && (
              <span className="absolute -top-2 -right-2 rounded-full bg-amber-400 px-1.5 py-0.5 text-[9px] font-bold text-white shadow">
                {isEn ? "~5s" : "首次~5s"}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
