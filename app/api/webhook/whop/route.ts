import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { membershipStore } from "@/lib/membershipStore";

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.WHOP_WEBHOOK_SECRET;

  // Fail closed if webhook secret is not configured
  if (!webhookSecret) {
    console.error("[Whop Webhook] WHOP_WEBHOOK_SECRET is not configured on server.");
    return NextResponse.json(
      { error: "Webhook secret is not configured on server" },
      { status: 500 }
    );
  }

  const rawBody = await req.text();
  const signatureHeader = req.headers.get("whop-signature");

  if (!signatureHeader) {
    return NextResponse.json(
      { error: "Missing whop-signature header" },
      { status: 401 }
    );
  }

  const signature = signatureHeader.startsWith("sha256=")
    ? signatureHeader.slice(7)
    : signatureHeader;

  const computedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("hex");

  const sigBuffer = Buffer.from(signature);
  const computedBuffer = Buffer.from(computedSignature);

  // Length mismatch is treated as invalid signature without throwing
  if (
    sigBuffer.length !== computedBuffer.length ||
    !crypto.timingSafeEqual(sigBuffer, computedBuffer)
  ) {
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 401 }
    );
  }

  try {
    const event = JSON.parse(rawBody);
    const action = event.action || event.type;
    const userId = event.data?.user?.id || event.data?.user_id || event.data?.id;

    if (userId) {
      if (action === "membership.went_valid") {
        await membershipStore.markActive(userId);
      } else if (action === "membership.went_invalid") {
        await membershipStore.markRevoked(userId, Math.floor(Date.now() / 1000));
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Malformed webhook body";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
