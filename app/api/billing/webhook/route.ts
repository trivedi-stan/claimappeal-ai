import { NextRequest, NextResponse } from "next/server";
import { verifyDodoWebhook, handleDodoWebhookEvent } from "@/lib/dodo/webhooks";
import { verifyWebhookSignature as verifyStripeWebhook, handleWebhookEvent as handleStripeWebhook } from "@/lib/stripe/webhooks";
import { generateRequestId } from "@/lib/utils";

/**
 * POST /api/billing/webhook — Payment processor webhook receiver (Dodo Payments + Stripe fallback)
 * Uses raw body for signature verification.
 */
export async function POST(request: NextRequest) {
  const requestId = generateRequestId();

  try {
    const rawBody = await request.text();
    const stripeSignature = request.headers.get("stripe-signature");
    const dodoSignature = request.headers.get("webhook-signature");

    // 1. If Stripe signature is explicitly present, route to Stripe handler
    if (stripeSignature && !dodoSignature) {
      const event = await verifyStripeWebhook(rawBody, stripeSignature);
      if (!event) {
        return NextResponse.json(
          { success: false, error: "Invalid Stripe signature", requestId },
          { status: 400 }
        );
      }
      await handleStripeWebhook(event);
      return NextResponse.json({ success: true, provider: "stripe", received: true, requestId });
    }

    // 2. Otherwise process as Dodo Payments webhook
    const headersObj: Record<string, string> = {};
    request.headers.forEach((val, key) => {
      headersObj[key.toLowerCase()] = val;
    });

    const dodoEvent = await verifyDodoWebhook(rawBody, headersObj);
    if (!dodoEvent) {
      return NextResponse.json(
        { success: false, error: "Invalid Dodo Payments signature", requestId },
        { status: 400 }
      );
    }

    await handleDodoWebhookEvent(dodoEvent);

    return NextResponse.json({ success: true, provider: "dodopayments", received: true, requestId });
  } catch (err) {
    console.error("[Webhook] Error:", err);
    return NextResponse.json(
      { success: false, error: "Webhook processing failed", requestId },
      { status: 500 }
    );
  }
}
