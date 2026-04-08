import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const token_hash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as any;
  const next = url.searchParams.get("next") || "/zh";

  if (!token_hash || !type) {
    return NextResponse.redirect(new URL("/zh", req.url));
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const { error } = await supabase.auth.verifyOtp({ token_hash, type });

  if (error) {
    console.error("[Auth Confirm] OTP verification failed:", error.message);
    return NextResponse.redirect(new URL("/zh?error=invalid_token", req.url));
  }

  // Redirect to the intended destination (e.g. /zh/reset-password)
  return NextResponse.redirect(new URL(next, req.url));
}
