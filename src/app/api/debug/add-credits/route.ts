import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const SECRET_KEY = "900209"; // Hardcoded for your convenience as requested

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const amount = parseInt(searchParams.get("amount") || "0");
  const key = searchParams.get("key");

  if (key !== SECRET_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!email || amount <= 0) {
    return NextResponse.json({ error: "Missing email or valid amount" }, { status: 400 });
  }

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  try {
    // Find User ID by email
    const { data: user, error: findErr } = await supabase
      .from("auth.users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    // Since we can't directly read auth.users table with the service role client in some setups
    // We will use the admin API
    const { data: { users }, error: authErr } = await supabase.auth.admin.listUsers();
    if (authErr) throw authErr;

    const targetUser = users.find(u => u.email === email);
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = targetUser.id;

    // Get current balance
    const { data: current, error: getErr } = await supabase
      .from("user_credits")
      .select("balance")
      .eq("user_id", userId)
      .maybeSingle();

    if (getErr) throw getErr;

    const newBalance = (current?.balance ?? 0) + amount;

    // Update balance
    const { error: upErr } = await supabase
      .from("user_credits")
      .upsert({ user_id: userId, balance: newBalance }, { onConflict: "user_id" });

    if (upErr) throw upErr;

    return NextResponse.json({ 
      ok: true, 
      email, 
      added: amount, 
      total_balance: newBalance 
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Debug error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
