import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export async function POST(req: NextRequest) {
  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const { data: userData, error: userErr } = await supabase.auth.getUser(token);
  if (userErr || !userData?.user?.id) {
    return NextResponse.json({ error: "Invalid login" }, { status: 401 });
  }

  const userId = userData.user.id;
  const { code } = await req.json().catch(() => ({}));

  if (!code) {
    return NextResponse.json({ error: "Missing promo code" }, { status: 400 });
  }

  // 1. Check if the code exists and is active
  const { data: promo, error: promoErr } = await supabase
    .from("promo_codes")
    .select("*")
    .eq("code", code.toUpperCase())
    .eq("active", true)
    .single();

  if (promoErr || !promo) {
    return NextResponse.json({ error: "Invalid or expired code" }, { status: 404 });
  }

  // 2. Check if the user already redeemed this code
  const { data: existing } = await supabase
    .from("promo_redemptions")
    .select("id")
    .eq("user_id", userId)
    .eq("code", promo.code)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: "You have already used this code" }, { status: 400 });
  }

  // 3. Perform the redemption (Transaction-like)
  // Logic: subtract reward from trial_credits.count (e.g., -100 means +100 potential uses)
  const { data: trialRow } = await supabase
    .from("trial_credits")
    .select("count")
    .eq("user_id", userId)
    .maybeSingle();

  const currentCount = trialRow?.count ?? 0;
  const newCount = currentCount - promo.reward;

  const { error: upErr } = await supabase
    .from("trial_credits")
    .upsert({ 
      user_id: userId, 
      count: newCount 
    }, { onConflict: "user_id" });

  if (upErr) {
    return NextResponse.json({ error: "Failed to update credits" }, { status: 500 });
  }

  // 4. Log the redemption
  await supabase.from("promo_redemptions").insert({
    user_id: userId,
    code: promo.code
  });

  return NextResponse.json({ ok: true, reward: promo.reward, remaining: 5 - newCount });
}
