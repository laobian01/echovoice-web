import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  return NextResponse.json({
    ok: true,
    hasUrl: Boolean(url),
    hasAnon: Boolean(anon),
    hasServiceRole: Boolean(service),
    urlPreview: url ? `${url.slice(0, 8)}...${url.slice(-6)}` : "",
  });
}
