import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export async function POST(req: NextRequest) {
  if (!stripeSecretKey) {
    return NextResponse.json({ error: "Stripe 未配置，请先设置 STRIPE_SECRET_KEY" }, { status: 500 });
  }

  const stripe = new Stripe(stripeSecretKey);

  try {
    const body = await req.json();
    const plan = body?.plan as "monthly" | "pack100";

    const monthlyPriceId = process.env.STRIPE_PRICE_MONTHLY;
    const packPriceId = process.env.STRIPE_PRICE_PACK100;

    const priceId = plan === "monthly" ? monthlyPriceId : plan === "pack100" ? packPriceId : undefined;

    if (!priceId) {
      return NextResponse.json({ error: "对应的价格ID未配置" }, { status: 400 });
    }

    const origin = req.headers.get("origin") || "http://localhost:3000";

    const mode = plan === "monthly" ? "subscription" : "payment";
    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/pricing?success=1`,
      cancel_url: `${origin}/pricing?canceled=1`,
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "创建支付会话失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
