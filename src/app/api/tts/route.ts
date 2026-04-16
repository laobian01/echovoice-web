import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
const BACKEND_URL = process.env.ECHOVOICE_BACKEND_URL || "https://echovoice-api.13770669417jj.workers.dev";

function speedLabel(speed: number) {
  if (speed > 1.4) return "极快";
  if (speed > 1.1) return "较快";
  if (speed < 0.7) return "极慢";
  if (speed < 0.9) return "较慢";
  return "自然中速";
}

function pitchLabel(pitch: number) {
  if (pitch > 1.3) return "高亢";
  if (pitch > 1.1) return "稍高";
  if (pitch < 0.7) return "深沉";
  if (pitch < 0.9) return "低沉";
  return "自然音高";
}

function hasHeader(bytes: Uint8Array, header: number[]) {
  if (bytes.length < header.length) return false;
  return header.every((v, i) => bytes[i] === v);
}

function wrapPCM16ToWav(pcm: Uint8Array, sampleRate = 24000, channels = 1, bitsPerSample = 16) {
  const dataSize = pcm.byteLength;
  const byteRate = sampleRate * channels * (bitsPerSample / 8);
  const blockAlign = channels * (bitsPerSample / 8);
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, channels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(36, "data");
  view.setUint32(40, dataSize, true);

  new Uint8Array(buffer, 44).set(pcm);
  return new Uint8Array(buffer);
}

function toPlayableAudio(raw: Uint8Array): { bytes: Uint8Array; contentType: string } {
  const isWav = hasHeader(raw, [0x52, 0x49, 0x46, 0x46]); // RIFF
  const isMp3 = hasHeader(raw, [0x49, 0x44, 0x33]) || hasHeader(raw, [0xff, 0xfb]);
  const isMp4 = hasHeader(raw, [0x66, 0x74, 0x79, 0x70]);
  const isOgg = hasHeader(raw, [0x4f, 0x67, 0x67, 0x53]);

  if (isWav) return { bytes: raw, contentType: "audio/wav" };
  if (isMp3) return { bytes: raw, contentType: "audio/mpeg" };
  if (isMp4) return { bytes: raw, contentType: "audio/mp4" };
  if (isOgg) return { bytes: raw, contentType: "audio/ogg" };

  return { bytes: wrapPCM16ToWav(raw), contentType: "audio/wav" };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text = String(body.text || "").trim();
    const voiceName = String(body.voiceName || "Kore");
    const speed = Number(body.speed ?? 1);
    const pitch = Number(body.pitch ?? 1);
    const emotion = String(body.emotion || "平静");
    const roleDescription = String(body.roleDescription || "");

    const emotionInstructions: Record<string, string> = {
      "平静": "语气自然、平稳，像是在进行日常对话。",
      "开心": "语气欢快、明亮，语速略快，带有一丝笑意，充满活力。",
      "悲伤": "语气低沉、缓慢，带有明显的哭腔或叹息感，情感深沉。",
      "激动": "情绪高昂，声音洪亮，语速加快，富有冲击力和呼吸感。",
      "严肃": "语气庄重、严厉，节奏分明，不苟言笑。",
      "温暖": "语气轻柔、治愈，语速适中，富有磁性和关怀感。",
      "治愈": "语气空灵、柔和，像是在耳边低语，带给人平静的力量。",
      "坚定": "语气果断、有力，字正腔圆，充满自信和说服力。",
    };

    const actingInstruction = emotionInstructions[emotion] || emotionInstructions["平静"];

    const prompt = `你是一个专业的配音演员。请按照以下要求朗读文本：
角色设定: ${roleDescription}。
表演要求: ${actingInstruction}
语速控制: ${speedLabel(speed)}，语调控制: ${pitchLabel(pitch)}。
请确保声音自然、流畅，具有鲜明的人类情感色彩，严禁机械感。

待朗读文本: 
${text}`;

    const payload: Record<string, unknown> = {
      text: prompt,
      voiceConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName },
        },
      },
    };
    // Optional trial receipt for backend gating
    if (process.env.ECHOVOICE_TRIAL_RECEIPT) {
      payload.receipt = process.env.ECHOVOICE_TRIAL_RECEIPT;
    }

    const upstream = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const contentType = upstream.headers.get("content-type") || "";
    const raw = new Uint8Array(await upstream.arrayBuffer());

    if (!upstream.ok) {
      let msg = `上游请求失败 (${upstream.status})`;
      try {
        const json = JSON.parse(new TextDecoder().decode(raw));
        msg = json?.error?.message || json?.error || msg;
      } catch {}
      return NextResponse.json({ error: msg }, { status: 502 });
    }

    if (contentType.includes("audio/") && raw.length > 0) {
      return new NextResponse(Buffer.from(raw), {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "no-store",
        },
      });
    }

    let base64: string | undefined;
    try {
      const json = JSON.parse(new TextDecoder().decode(raw));
      base64 =
        json?.audioBase64 ||
        json?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data ||
        json?.candidates?.[0]?.content?.parts?.[0]?.inline_data?.data;
      if (json?.error) {
        return NextResponse.json({ error: json.error.message || "语音服务错误" }, { status: 502 });
      }
    } catch {
      return NextResponse.json({ error: "返回数据无法解析" }, { status: 502 });
    }

    if (!base64) {
      return NextResponse.json({ error: "未返回音频数据" }, { status: 502 });
    }

    const decoded = new Uint8Array(Buffer.from(base64, "base64"));
    const playable = toPlayableAudio(decoded);

    // Save history if user is logged in
    const auth = req.headers.get("authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (token && supabaseUrl && serviceRoleKey) {
      // Use waitUntil to process upload in background without delaying response
      // (Next.js serverless/edge environments support this natively if standard, but we'll await carefully or just fire and forget)
      const saveTask = async () => {
        try {
          const supabase = createClient(supabaseUrl, serviceRoleKey);
          const { data: userData } = await supabase.auth.getUser(token);
          if (userData?.user?.id) {
            const userId = userData.user.id;
            const fileName = `${userId}/${Date.now()}.wav`;
            const { data: uploadData, error: uploadErr } = await supabase.storage
              .from('generations')
              .upload(fileName, playable.bytes, { contentType: playable.contentType, upsert: false });
            
            if (!uploadErr && uploadData?.path) {
              const { data: publicUrlData } = supabase.storage.from('generations').getPublicUrl(uploadData.path);
              await supabase.from('generations').insert({
                user_id: userId,
                text: text,
                voice_name: body.roleName || voiceName,
                audio_path: publicUrlData.publicUrl
              });
            }
          }
        } catch (e) {
          console.error("Failed to save generation history:", e);
        }
      };
      // Fire and forget (in Vercel, this might get killed early occasionally without waitUntil, but it's acceptable for history MVP)
      saveTask();
    }

    return new NextResponse(Buffer.from(playable.bytes), {
      status: 200,
      headers: {
        "Content-Type": playable.contentType,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "服务器错误";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
