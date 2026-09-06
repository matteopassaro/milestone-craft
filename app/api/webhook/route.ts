import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
    if (!secret) {
      console.error("Webhook Error: LEMONSQUEEZY_WEBHOOK_SECRET not set");
      return NextResponse.json({ message: "Webhook secret not set" }, { status: 500 });
    }

    const rawBody = await request.text();
    const signature = request.headers.get("x-signature") ?? "";

    if (!signature) {
      console.error("Webhook Error: No signature header");
      return NextResponse.json({ message: "No signature" }, { status: 401 });
    }

    const hmac = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    const hmacBuffer = Buffer.from(hmac);
    const signatureBuffer = Buffer.from(signature);

    if (hmacBuffer.length !== signatureBuffer.length || !crypto.timingSafeEqual(hmacBuffer, signatureBuffer)) {
      console.error("Webhook Error: Invalid signature. Expected:", hmac, "Got:", signature);
      return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload.meta.event_name;
    const customData = payload.meta.custom_data;
    const userId = customData?.user_id;

    console.log("Webhook received:", { eventName, customData, userId });

    if (!userId) {
      console.error("Webhook Error: No user_id in custom_data. Full payload:", JSON.stringify(payload, null, 2));
      return NextResponse.json({ message: "No user_id found in custom data" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      console.error(`Webhook Error: User not found for id: ${userId}`);
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (eventName === "order_created" || eventName === "subscription_created") {
      console.log(`Updating user ${userId} to isPro: true`);
      await prisma.user.update({
        where: { id: userId },
        data: { isPro: true },
      });
      console.log(`User ${userId} is now PRO`);
    }

    if (eventName === "subscription_cancelled" || eventName === "subscription_expired") {
      console.log(`Updating user ${userId} to isPro: false`);
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