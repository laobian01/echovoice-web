import { NextRequest, NextResponse } from "next/server";

const creemApiKey = process.env.CREEM_API_KEY;

type Plan = "monthly" | "pack100";

export async function POST(req: NextRequest) {
  if (!creemApiKey) {
    return NextResponse.json({ error: "Creem 未配置，请先设置 CREEM_API_KEY" }, { status: 500 });
  }

  try {
    const body = await req.json();
    const plan = body?.plan as Plan;
    const userId = body?.userId;

    const monthlyProductId = process.env.CREEM_PRODUCT_MONTHLY;
    const packProductId = process.env.CREEM_PRODUCT_PACK100;

    const productId = plan === "monthly" ? monthlyProductId : plan === "pack100" ? packProductId : undefined;

    if (!productId) {
      return NextResponse.json({ error: "对应的产品ID未配置" }, { status: 400 });
    }

    const origin = req.headers.get("origin") || "http://localhost:3000";
    const isTestKey = creemApiKey.includes("_test_");
    const baseUrl = isTestKey ? "https://test-api.creem.io/v1" : "https://api.creem.io/v1";

    const res = await fetch(`${baseUrl}/checkouts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": creemApiKey,
      },
      body: JSON.stringify({
        product_id: productId,
        success_url: `${origin}/`,
        metadata: {
          user_id: userId,
        },
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      const message = data?.message || data?.error || "创建支付会话失败";
      return NextResponse.json({ error: message }, { status: res.status });
    }

    const checkoutUrl = data?.checkout_url;
    if (!checkoutUrl) {
      return NextResponse.json({ error: "未返回 checkout URL" }, { status: 500 });
    }

    return NextResponse.json({ url: checkoutUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : "创建支付会话失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
