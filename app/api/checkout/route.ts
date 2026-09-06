// app/api/checkout/route.ts
import { auth } from "@/auth"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 })
  }

  try {
    const { billing } = await req.json() // "monthly" or "lifetime"

    const variantId = billing === "monthly" 
      ? process.env.LEMONSQUEEZY_VARIANT_ID_MONTHLY 
      : process.env.LEMONSQUEEZY_VARIANT_ID_LIFETIME

    if (!variantId) {
      return NextResponse.json({ error: "Pricing plan configuration missing" }, { status: 500 })
    }

    const res = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
        "Content-Type": "application/vnd.api+json",
        Accept: "application/vnd.api+json",
      },
      body: JSON.stringify({
        data: {
          type: "checkouts",
          attributes: {
            checkout_data: {
              custom: {
                user_id: session.user.id,
              },
            },
          },
          relationships: {
            store: {
              data: {
                type: "stores",
                id: process.env.LEMONSQUEEZY_STORE_ID,
              },
            },
            variant: {
              data: {
                type: "variants",
                id: variantId,
              },
            },
          },
        },
      }),
    })

    const data = await res.json()
    const checkoutUrl = data.data?.attributes?.url

    if (!checkoutUrl) {
      return NextResponse.json({ error: "Failed to create checkout URL" }, { status: 500 })
    }

    return NextResponse.json({ url: checkoutUrl })
  } catch (error) {
    return NextResponse.json({ error: "Checkout session failed" }, { status: 500 })
  }
}