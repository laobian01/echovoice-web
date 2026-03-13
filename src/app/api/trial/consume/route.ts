import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const MAX_TRIALS = 5;

export async function POST(req: NextRequest) {
  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: "Supabase 未配置" }, { status: 500 });
  }

  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const { data: userData, error: userErr } = await supabase.auth.getUser(token);
  if (userErr || !userData?.user?.id) {
    return NextResponse.json({ error: "登录无效" }, { status: 401 });
  }

  const userId = userData.user.id;

  // Get current count
  const { data: row, error: selErr } = await supabase
    .from("trial_credits")
    .select("count")
    .eq("user_id", userId)
    .maybeSingle();

  if (selErr) {
    return NextResponse.json({ error: "读取试用次数失败" }, { status: 500 });
  }

  const current = row?.count ?? 0;
  if (current >= MAX_TRIALS) {
    return NextResponse.json({ error: "试用次数已用完" }, { status: 403, });
  }

  const next = current + 1;
  const { error: upErr } = await supabase
    .from("trial_credits")
    .upsert({ user_id: userId, count: next }, { onConflict: "user_id" });

  if (upErr) {
    return NextResponse.json({ error: "更新试用次数失败" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, used: next, remaining: MAX_TRIALS - next });
}
