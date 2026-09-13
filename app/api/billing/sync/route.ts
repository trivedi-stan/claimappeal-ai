import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { BillingService } from "@/services/billing.service";
import { generateRequestId } from "@/lib/utils";

export const dynamic = "force-dynamic";

/**
 * POST /api/billing/sync — Synchronize user subscription with Dodo Payments
 */
export async function POST() {
  const requestId = generateRequestId();
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized", requestId }, { status: 401 });
    }

    const subscription = await BillingService.syncUserSubscription(user.id, user.email);
    return NextResponse.json({ success: true, data: { subscription }, requestId });
  } catch (err: unknown) {
    console.error("[API] POST /api/billing/sync error:", err);
    return NextResponse.json({ success: false, error: "Sync failed", requestId }, { status: 500 });
  }
}
