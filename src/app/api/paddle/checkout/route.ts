import { NextRequest, NextResponse } from "next/server";

const paddleApiKey = process.env.PADDLE_API_KEY;

type Plan = "monthly" | "pack100";

export async function POST(req: NextRequest) {
  if (!paddleApiKey) {
    return NextResponse.json({ error: "Paddle 未配置，请先设置 PADDLE_API_KEY" }, { status: 500 });
  }

  try {
    const body = await req.json();
    const plan = body?.plan as Plan;

    const monthlyPriceId = process.env.PADDLE_PRICE_MONTHLY;
    const packPriceId = process.env.PADDLE_PRICE_PACK100;

    const priceId = plan === "monthly" ? monthlyPriceId : plan === "pack100" ? packPriceId : undefined;

    if (!priceId) {
      return NextResponse.json({ error: "对应的价格ID未配置" }, { status: 400 });
    }

    const origin = req.headers.get("origin") || "http://localhost:3000";

    const res = await fetch("https://api.paddle.com/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${paddleApiKey}`,
      },
      body: JSON.stringify({
        items: [{ price_id: priceId, quantity: 1 }],
        collection_mode: "automatic",
        checkout: {
          url: `${origin}/checkout`,
        },
        custom_data: {
          plan,
        },
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      const message = data?.error?.detail || data?.error?.message || "创建支付会话失败";
      return NextResponse.json({ error: message }, { status: res.status });
    }

    const checkoutUrl = data?.data?.checkout?.url;
    if (!checkoutUrl) {
      return NextResponse.json({ error: "未返回 checkout URL" }, { status: 500 });
    }

    return NextResponse.json({ url: checkoutUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : "创建支付会话失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
