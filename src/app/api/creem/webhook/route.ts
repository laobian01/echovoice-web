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
    
    // Log the full body for debugging (Visible in Vercel)
    console.log("[Creem Webhook] Full Body Received:", JSON.stringify(body, null, 2));

    const eventType = body?.eventType || body?.event; 
    const object = body?.object || body?.data; 

    // We accept both 'payment.succeeded' (Live) and 'checkout.completed' (Typical)
    const isSuccess = eventType === "checkout.completed" || 
                      eventType === "payment.succeeded" || 
                      eventType === "order.paid";

    if (isSuccess && object) {
      // 1. Try to find User ID in metadata (any variant)
      const userId = object?.metadata?.user_id || 
                     object?.metadata?.userId || 
                     object?.custom_id || 
                     object?.requestId;

      // 2. Backup: Try to find User Email
      // Creem usually puts customer info in object.customer or object.user
      const customerEmail = object?.customer?.email || object?.email || object?.user_email;

      console.log(`[Creem Webhook] Payload - UserId: ${userId}, Email: ${customerEmail}`);

      const supabase = createClient(supabaseUrl, serviceRoleKey);
      let targetUserId = userId;

      // 3. Fallback: If no ID found, search Supabase by Email
      if (!targetUserId && customerEmail) {
        console.log(`[Creem Webhook] No userId in metadata, attempting fallback to email: ${customerEmail}`);
        const { data: users, error: findErr } = await supabase.auth.admin.listUsers();
        if (!findErr && users) {
          const user = users.find((u: any) => u.email?.toLowerCase() === customerEmail.toLowerCase());
          if (user) {
            targetUserId = user.id;
            console.log(`[Creem Webhook] Fallback Success! Found User ID ${targetUserId} for email ${customerEmail}`);
          }
        }
      }

      if (!targetUserId) {
        console.error("[Creem Webhook] CRITICAL: Could not find any user identification (ID or Email) in payload.");
        return NextResponse.json({ ok: true, warning: "User not found" }); // Return 200 to Creem so they stop retrying
      }

      // 4. Determine Credits
      const productId = object?.product_id || object?.productId;
      let creditsToAdd = 0;
      if (productId === process.env.CREEM_PRODUCT_MONTHLY) {
        creditsToAdd = MONTHLY_CREDITS;
      } else if (productId === process.env.CREEM_PRODUCT_PACK100) {
        creditsToAdd = PACK100_CREDITS;
      }

      if (creditsToAdd === 0) {
        console.warn("[Creem Webhook] Product ID not recognized or mapped:", productId);
        return NextResponse.json({ ok: true, message: "Product not mapped" });
      }

      // 5. Update Balance
      const { data: current, error: getErr } = await supabase
        .from("user_credits")
        .select("balance")
        .eq("user_id", targetUserId)
        .maybeSingle();

      if (getErr) throw getErr;

      const newBalance = (current?.balance ?? 0) + creditsToAdd;

      const { error: upErr } = await supabase
        .from("user_credits")
        .upsert({ user_id: targetUserId, balance: newBalance }, { onConflict: "user_id" });

      if (upErr) throw upErr;

      console.log(`[Creem Webhook] SUCCESS: Credited ${creditsToAdd} to user ${targetUserId}. New balance: ${newBalance}`);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[Creem Webhook] GLOBAL ERROR:", error);
    return NextResponse.json({ error: "Internal processing error" }, { status: 500 });
  }
}
