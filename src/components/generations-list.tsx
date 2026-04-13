"use client";

import { useEffect, useState, useCallback } from "react";
import { getSupabaseClient } from "@/lib/supabase";

interface Generation {
  id: string;
  text: string;
  voice_name: string;
  audio_path: string;
  created_at: string;
}

export function GenerationsList({ locale, refreshTrigger }: { locale: "zh" | "en"; refreshTrigger: number }) {
  const isEn = locale === "en";
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGenerations = useCallback(async () => {
    const client = getSupabaseClient();
    if (!client) return;

    const { data: sessionData } = await client.auth.getSession();
    if (!sessionData?.session) {
      setLoading(false);
      return;
    }

    const { data, error } = await client
      .from("generations")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    if (!error && data) {
      setGenerations(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchGenerations();
  }, [fetchGenerations, refreshTrigger]);

  if (loading) return null;
  if (generations.length === 0) return null;

  return (
    <div className="mt-8 border-t border-slate-200 pt-6">
      <h3 className="text-lg font-bold text-slate-800 mb-4">{isEn ? "History Records" : "我的创作历史"}</h3>
      <div className="space-y-3">
        {generations.map((g) => (
          <div key={g.id} className="rounded-xl border border-white/60 bg-white/40 p-3 shadow-sm flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-slate-800 truncate" title={g.text}>
                {g.text}
              </div>
              <div className="text-xs text-slate-500 mt-1 flex gap-2">
                <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">{g.voice_name}</span>
                <span>{new Date(g.created_at).toLocaleString(isEn ? 'en-US' : 'zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
            <div className="flex-shrink-0 flex items-center gap-2">
              <audio src={g.audio_path} controls className="h-8 w-48 hidden md:block" />
              <button 
                onClick={() => {
                  const a = new Audio(g.audio_path);
                  a.play();
                }}
                className="md:hidden rounded-lg bg-indigo-50 p-2 text-indigo-600 hover:bg-indigo-100"
                title={isEn ? "Play" : "播放"}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" fillRule="evenodd"></path></svg>
              </button>
              <a 
                href={g.audio_path} 
                download={`echovoice-${g.id.substring(0,6)}.wav`}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg bg-slate-50 p-2 text-slate-600 hover:bg-slate-200 transition"
                title={isEn ? "Download" : "下载"}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
