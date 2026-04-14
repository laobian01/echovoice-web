import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// Each referral gives -10 to usage count (meaning +10 free trials)
const REWARD_CREDITS = 10;

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

  const currentUserId = userData.user.id;
  const body = await req.json().catch(() => ({}));
  const refereeId = body.ref;

  if (!refereeId) {
    return NextResponse.json({ error: "Missing referral code" }, { status: 400 });
  }

  if (currentUserId === refereeId) {
    return NextResponse.json({ error: "Cannot refer yourself" }, { status: 400 });
  }

  // Check if current user has already been referred
  const { data: row, error: selErr } = await supabase
    .from("trial_credits")
    .select("count, referred")
    .eq("user_id", currentUserId)
    .maybeSingle();

  if (row?.referred) {
    return NextResponse.json({ error: "You have already claimed a referral reward" }, { status: 400 });
  }

  // Update new user: referred = true, and give reward (-10 usage)
  const currentCount = row?.count ?? 0;
  const { error: upErr1 } = await supabase
    .from("trial_credits")
    .upsert({ 
      user_id: currentUserId, 
      count: currentCount - REWARD_CREDITS,
      referred: true 
    }, { onConflict: "user_id" });

  if (upErr1) {
    console.error("Referral Error (Invitee):", upErr1);
    return NextResponse.json({ error: "Failed to claim reward" }, { status: 500 });
  }

  // Update inviter: give reward (-10 usage)
  // Get inviter's current count
  const { data: invRow } = await supabase
    .from("trial_credits")
    .select("count")
    .eq("user_id", refereeId)
    .maybeSingle();
    
  const inviterCount = invRow?.count ?? 0;
  
  const { error: upErr2 } = await supabase
    .from("trial_credits")
    .upsert({ 
      user_id: refereeId, 
      count: inviterCount - REWARD_CREDITS
    }, { onConflict: "user_id" });

  if (upErr2) {
    console.error("Referral Error (Inviter):", upErr2);
    // Even if giving rev is failed slightly, we let the invitee know it succeeded
  }

  return NextResponse.json({ ok: true, reward: REWARD_CREDITS });
}
