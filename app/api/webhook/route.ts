import { NextResponse } from "next/server"
import crypto from "crypto"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  const rawBody = await req.text()
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET || ""

  const hmac = crypto.createHmac("sha256", secret)
  const digest = Buffer.from(hmac.update(rawBody).digest("hex"), "utf8")
  const signature = Buffer.from(req.headers.get("x-signature") || "", "utf8")

  if (digest.length !== signature.length || !crypto.timingSafeEqual(digest, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  const payload = JSON.parse(rawBody)
  const eventName = payload.meta.event_name
  const userId = payload.meta.custom_data?.user_id

  if (eventName === "order_created" && userId) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        isPro: true,
        lemonSqueezyCustomerId: String(payload.data.attributes.customer_id),
      },
    })
  }

  return NextResponse.json({ received: true })
}