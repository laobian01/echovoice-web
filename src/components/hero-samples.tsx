"use client";

import React, { useState, useRef } from "react";

const SAMPLES = [
  {
    id: "loli",
    name_zh: "活泼萝莉",
    name_en: "Leda (Loli)",
    tag_zh: "可爱 · 活泼",
    tag_en: "Cute & Energetic",
    text_zh: "欢迎来到灵动之声！今天也要元气满满哦！",
    text_en: "Welcome back! It is so good to see you again!",
    url: "/samples/loli.mp3",
  },
  {
    id: "warmman",
    name_zh: "深情声线",
    name_en: "Emotional (Sad)",
    tag_zh: "治愈 · 情感",
    tag_en: "Healing & Deep",
    text_zh: "在这个世界上，总有一些遗憾无法弥补。",
    text_en: "There are always some regrets in this world.",
    url: "/samples/warmman.mp3",
  },
  {
    id: "movie",
    name_zh: "新闻播报",
    name_en: "News Anchor",
    tag_zh: "专业 · 稳重",
    tag_en: "Steady & Pro",
    text_zh: "欢迎收看今日要闻，为您带来全球最新的资讯。",
    text_en: "Welcome to the evening news, bringing you the latest global updates.",
    url: "/samples/movie.mp3",
  },
];

export function HeroSamples({ locale = "zh" }: { locale?: string }) {
  const isEn = locale === "en";
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = (id: string, url: string) => {
    if (playingId === id) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play();
        setPlayingId(id);
      }
    }
  };

  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-3">
      <audio 
        ref={audioRef} 
        onEnded={() => setPlayingId(null)} 
        onPause={() => setPlayingId(null)}
      />
      {SAMPLES.map((s) => (
        <div 
          key={s.id}
          className="group relative flex items-center gap-3 rounded-2xl border border-white/60 bg-white/40 p-3 backdrop-blur-md transition-all hover:bg-white/80 hover:shadow-lg hover:shadow-indigo-500/10"
        >
          <button
            onClick={() => togglePlay(s.id, s.url)}
            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full transition-all ${
              playingId === s.id 
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" 
              : "bg-white text-indigo-600 shadow-sm border border-indigo-100 group-hover:bg-indigo-50"
            }`}
          >
            {playingId === s.id ? (
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            ) : (
              <svg className="h-4 w-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            )}
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800 truncate">
                {isEn ? s.name_en : s.name_zh}
              </span>
              <span className="rounded-md bg-indigo-100/50 px-1.5 py-0.5 text-[10px] font-medium text-indigo-600">
                {isEn ? s.tag_en : s.tag_zh}
              </span>
            </div>
            <p className="mt-0.5 text-[10px] text-slate-500 truncate italic">
              "{isEn ? s.text_en : s.text_zh}"
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
