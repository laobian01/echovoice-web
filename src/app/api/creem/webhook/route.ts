import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const MONTHLY_CREDITS = 200;
const PACK100_CREDITS = 100;

export async function POST(req: NextRequest) {
  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  try {
    const body = await req.json();
    
    // Correct Creem structure: { eventType: "...", object: { ... } }
    const eventType = body?.eventType || body?.event; 
    const object = body?.object || body?.data; 

    console.log("[Creem Webhook] EventType received:", eventType);

    if (eventType === "checkout.completed" || eventType === "payment.succeeded") {
      const userId = object?.metadata?.user_id;
      const productId = object?.product_id || object?.productId;

      console.log("[Creem Webhook] UserId:", userId, "ProductId:", productId);

      if (!userId) {
        console.error("[Creem Webhook] No user_id in metadata");
        return NextResponse.json({ error: "No user_id in metadata" }, { status: 200 }); // Return 200 to avoid retries
      }

      // Determine how many credits to add
      let creditsToAdd = 0;
      if (productId === process.env.CREEM_PRODUCT_MONTHLY) {
        creditsToAdd = MONTHLY_CREDITS;
      } else if (productId === process.env.CREEM_PRODUCT_PACK100) {
        creditsToAdd = PACK100_CREDITS;
      }

      if (creditsToAdd === 0) {
        console.warn("[Creem Webhook] Product ID not recognized:", productId);
        return NextResponse.json({ ok: true, message: "Product not mapped to credits" });
      }

      const supabase = createClient(supabaseUrl, serviceRoleKey);
      
      // Get current balance
      const { data: current, error: getErr } = await supabase
        .from("user_credits")
        .select("balance")
        .eq("user_id", userId)
        .maybeSingle();

      if (getErr) {
         console.error("[Creem Webhook] Get balance error:", getErr);
         throw getErr;
      }

      const newBalance = (current?.balance ?? 0) + creditsToAdd;

      // Update balance
      const { error: upErr } = await supabase
        .from("user_credits")
        .upsert({ user_id: userId, balance: newBalance }, { onConflict: "user_id" });

      if (upErr) {
        console.error("[Creem Webhook] Upsert balance error:", upErr);
        throw upErr;
      }

      console.log(`[Creem Webhook] SUCCESSFULLY Credited ${creditsToAdd} to user ${userId}. New balance: ${newBalance}`);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[Creem Webhook] GLOBAL ERROR:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
