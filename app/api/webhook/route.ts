import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Adjust path to your prisma setup

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
    if (!secret) {
      return NextResponse.json({ message: "Webhook secret not set" }, { status: 500 });
    }

    const rawBody = await request.text();
    const signature = request.headers.get("x-signature") ?? "";

    const hmac = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    if (!crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(signature))) {
      return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload.meta.event_name;
    const customData = payload.meta.custom_data;
    const userId = customData?.user_id;

    if (!userId) {
      return NextResponse.json({ message: "No user_id found in custom data" }, { status: 400 });
    }

    if (eventName === "order_created" || eventName === "subscription_created") {
      await prisma.user.update({
        where: { id: userId },
        data: { isPro: true },
      });
    }

    if (eventName === "subscription_cancelled" || eventName === "subscription_expired") {
      await prisma.user.update({
        where: { id: userId },
        data: { isPro: false },
      });
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ message: "Webhook handler failed" }, { status: 500 });
  }
}