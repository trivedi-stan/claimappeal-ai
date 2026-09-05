import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature, handleWebhookEvent } from "@/lib/stripe/webhooks";
import { generateRequestId } from "@/lib/utils";

/**
 * POST /api/billing/webhook — Stripe webhook receiver
 * Must use raw body (not JSON-parsed) for signature verification.
 */
export async function POST(request: NextRequest) {
  const requestId = generateRequestId();

  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { success: false, error: "Missing signature", requestId },
        { status: 400 }
      );
    }

    const event = await verifyWebhookSignature(body, signature);
    if (!event) {
      return NextResponse.json(
        { success: false, error: "Invalid signature", requestId },
        { status: 400 }
      );
    }

    await handleWebhookEvent(event);

    return NextResponse.json({ success: true, received: true, requestId });
  } catch (err) {
    console.error("[Webhook] Error:", err);
    return NextResponse.json(
      { success: false, error: "Webhook processing failed", requestId },
      { status: 500 }
    );
  }
}
