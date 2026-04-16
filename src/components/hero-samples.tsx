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
    text_en: "Welcome to EchoVoice! Let's have a great day!",
    url: "https://openai-api-samples.s3.amazonaws.com/tts/shimmer.mp3",
  },
  {
    id: "warmman",
    name_zh: "治愈暖男",
    name_en: "Puck (Warm)",
    tag_zh: "磁性 · 温暖",
    tag_en: "Deep & Warm",
    text_zh: "不管走得多远，记得在这里，总有一盏灯为你而留。",
    text_en: "No matter how far you go, there is always a light left for you here.",
    url: "https://openai-api-samples.s3.amazonaws.com/tts/alloy.mp3",
  },
  {
    id: "movie",
    name_zh: "解说旗舰",
    name_en: "Charon (Narrator)",
    tag_zh: "专业 · 沉稳",
    tag_en: "Steady & Pro",
    text_zh: "注意看，这个男人叫小帅，他正在使用一款神奇的配音工具。",
    text_en: "Look at this man, his name is Xiaoshuai, and he's using a magical dubbing tool.",
    url: "https://openai-api-samples.s3.amazonaws.com/tts/onyx.mp3",
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
