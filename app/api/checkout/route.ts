import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { variantId, userId, userEmail } = await req.json();

    if (!variantId || !userId) {
      return NextResponse.json({ message: "Missing variantId or userId" }, { status: 400 });
    }

    const apiKey = process.env.LEMONSQUEEZY_API_KEY;
    const storeId = process.env.LEMONSQUEEZY_STORE_ID;

    if (!apiKey || !storeId) {
      return NextResponse.json({ message: "Lemon Squeezy credentials not configured" }, { status: 500 });
    }

    const response = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
      method: "POST",
      headers: {
        Accept: "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        data: {
          type: "checkouts",
          attributes: {
            checkout_data: {
              email: userEmail || undefined,
              custom: {
                user_id: userId,
              },
            },
          },
          relationships: {
            store: {
              data: {
                type: "stores",
                id: storeId.toString(),
              },
            },
            variant: {
              data: {
                type: "variants",
                id: variantId.toString(),
              },
            },
          },
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Lemon Squeezy API error:", data);
      return NextResponse.json({ message: "Failed to create checkout session" }, { status: 500 });
    }

    const checkoutUrl = data.data.attributes.url;

    return NextResponse.json({ checkoutUrl });
  } catch (error) {
    console.error("Error creating checkout:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}