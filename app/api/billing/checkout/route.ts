import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { BillingService } from "@/services/billing.service";
import { generateRequestId } from "@/lib/utils";
import type { PlanId } from "@/config/plans";

/**
 * POST /api/billing/checkout — Create a Stripe Checkout Session
 */
export async function POST(request: Request) {
  const requestId = generateRequestId();
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized", requestId },
        { status: 401 }
      );
    }

    const { plan } = (await request.json()) as { plan: PlanId };
    const url = await BillingService.createCheckoutSession(
      user.id,
      user.email!,
      plan
    );

    return NextResponse.json({ success: true, data: { url }, requestId });
  } catch (err) {
    console.error("[API] POST /api/billing/checkout error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to create checkout session", requestId },
      { status: 500 }
    );
  }
}

/**
 * GET /api/billing/checkout?plan=pro — Direct redirect to Stripe Checkout Session
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const plan = (searchParams.get("plan") ?? "pro") as PlanId;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", `/api/billing/checkout?plan=${plan}`);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const url = await BillingService.createCheckoutSession(
      user.id,
      user.email!,
      plan
    );
    return NextResponse.redirect(url);
  } catch (err) {
    console.error("[API] GET /api/billing/checkout error:", err);
    return NextResponse.redirect(new URL("/settings/billing?error=checkout_failed", request.url));
  }
}
