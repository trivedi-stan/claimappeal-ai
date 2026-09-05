import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { BillingService } from "@/services/billing.service";
import { generateRequestId } from "@/lib/utils";

/**
 * POST /api/billing/portal — Create a Stripe Customer Portal session
 */
export async function POST() {
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

    const url = await BillingService.createPortalSession(user.id);
    return NextResponse.json({ success: true, data: { url }, requestId });
  } catch (err) {
    console.error("[API] POST /api/billing/portal error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to create portal session", requestId },
      { status: 500 }
    );
  }
}
