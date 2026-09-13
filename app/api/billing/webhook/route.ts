import { NextRequest, NextResponse } from "next/server";
import { verifyDodoWebhook, handleDodoWebhookEvent } from "@/lib/dodo/webhooks";
import { generateRequestId } from "@/lib/utils";

export const dynamic = "force-dynamic";

/**
 * POST /api/billing/webhook — Dodo Payments webhook receiver
 * Uses raw body for signature verification.
 */
export async function POST(request: NextRequest) {
  const requestId = generateRequestId();

  try {
    const rawBody = await request.text();
    // Process Dodo Payments webhook event
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
