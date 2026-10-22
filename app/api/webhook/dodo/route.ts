import { NextRequest, NextResponse } from "next/server";
import { membershipStore } from "@/lib/membershipStore";
import crypto from "crypto";

export const dynamic = "force-dynamic";

/**
 * Verifies standard webhook signature (Svix / Standard Webhooks spec used by Dodo Payments).
 * Signed content format: `${webhook_id}.${webhook_timestamp}.${rawBody}`
 */
function verifyDodoSignature(
  rawBody: string,
  webhookId: string,
  webhookTimestamp: string,
  webhookSignature: string,
  secret: string
): boolean {
  try {
    // 1. Clean secret (strip 'whsec_' prefix if present)
    let secretKey = secret.trim();
    if (secretKey.startsWith("whsec_")) {
      secretKey = secretKey.substring(6);
    }

    // Try base64 decoding the secret as per Standard Webhooks spec; fallback to utf8
    let secretBuffer: Buffer;
    try {
      secretBuffer = Buffer.from(secretKey, "base64");
      if (secretBuffer.length === 0) {
        secretBuffer = Buffer.from(secretKey, "utf8");
      }
    } catch {
      secretBuffer = Buffer.from(secretKey, "utf8");
    }

    // 2. Reconstruct signed content
    const signedContent = `${webhookId}.${webhookTimestamp}.${rawBody}`;

    // 3. Compute expected raw HMAC-SHA256 buffer
    const computedHmacBuffer = crypto
      .createHmac("sha256", secretBuffer)
      .update(signedContent, "utf8")
      .digest();

    // 4. Parse incoming signatures (space-delimited, format: "v1,<base64>")
    const signatures = webhookSignature.split(" ");

    for (const sig of signatures) {
      const [version, encodedSig] = sig.split(",");
      if (version === "v1" && encodedSig) {
        const receivedBuffer = Buffer.from(encodedSig, "base64");
        if (
          computedHmacBuffer.length === receivedBuffer.length &&
          crypto.timingSafeEqual(computedHmacBuffer, receivedBuffer)
        ) {
          return true;
        }
      }
    }

    return false;
  } catch (err) {
    console.error("[Dodo Webhook] Signature verification exception:", err);
    return false;
  }
}

/**
 * POST /api/webhook/dodo
 * Fast-acknowledging Dodo Payments webhook handler designed for Cloudflare Workers & Node.js.
 */
export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    const rawBody = await req.text();
    const webhookId = req.headers.get("webhook-id");
    const webhookTimestamp = req.headers.get("webhook-timestamp");
    const webhookSignature = req.headers.get("webhook-signature");

    const webhookSecret = process.env.DODO_PAYMENTS_WEBHOOK_KEY || process.env.WEBHOOK_SECRET;

    // 1. Signature Verification (if secret configured)
    if (webhookSecret) {
      if (!webhookId || !webhookTimestamp || !webhookSignature) {
        return NextResponse.json(
          { error: "Missing required Dodo webhook signature headers (webhook-id, webhook-signature, webhook-timestamp)" },
          { status: 400 }
        );
      }

      // Check timestamp freshness (replay attack prevention - 5 minute tolerance)
      const nowSeconds = Math.floor(Date.now() / 1000);
      const eventSeconds = parseInt(webhookTimestamp, 10);
      if (!isNaN(eventSeconds) && Math.abs(nowSeconds - eventSeconds) > 300) {
        return NextResponse.json(
          { error: "Webhook timestamp too old or clock desynchronized" },
          { status: 400 }
        );
      }

      const isValid = verifyDodoSignature(rawBody, webhookId, webhookTimestamp, webhookSignature, webhookSecret);
      if (!isValid) {
        return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
      }
    }

    // 2. Parse event payload
    let event: any = null;
    try {
      event = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Malformed JSON payload" }, { status: 400 });
    }

    // 3. Define background fulfillment task (executes asynchronously)
    const backgroundFulfillment = async () => {
      try {
        const eventType = event.type || event.event_type || event.action;
        const data = event.data || event;
        const customerId = data.customer_id || data.customer?.customer_id || data.user_id || data.id;

        if (customerId) {
          // Handle payment / license grants
          if (
            eventType === "payment.succeeded" ||
            eventType === "subscription.active" ||
            eventType === "license_key.created" ||
            eventType === "membership.went_valid"
          ) {
            await membershipStore.markActive(customerId);
          }
          // Handle cancellations / revocations
          else if (
            eventType === "subscription.cancelled" ||
            eventType === "payment.failed" ||
            eventType === "subscription.expired" ||
            eventType === "membership.went_invalid"
          ) {
            await membershipStore.markRevoked(customerId, Math.floor(Date.now() / 1000));
          }
        }
      } catch (fulfillErr) {
        console.error("[Dodo Webhook] Background fulfillment error:", fulfillErr);
      }
    };

    // 4. Safe Cloudflare / Next.js background execution
    // Use ctx.waitUntil if running inside Cloudflare Workers or Edge Runtime
    const executionCtx = (req as any).context || (globalThis as any).context;
    if (executionCtx && typeof executionCtx.waitUntil === "function") {
      executionCtx.waitUntil(backgroundFulfillment());
    } else {
      // Fallback: Non-blocking asynchronous task execution
      Promise.resolve().then(backgroundFulfillment);
    }

    // 5. Immediate response in <200ms to prevent delivery timeouts
    const elapsedMs = Date.now() - startTime;
    return NextResponse.json(
      { received: true, latencyMs: elapsedMs },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("[Dodo Webhook] Handler error:", err);
    return NextResponse.json({ error: err.message || "Webhook processing error" }, { status: 500 });
  }
}
