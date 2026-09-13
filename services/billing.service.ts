import { createClient, createAdminClient } from "@/lib/supabase/server";
import { dodo } from "@/lib/dodo/client";
import { getPlan, type PlanId } from "@/config/plans";

/**
 * Billing service — Dodo Payments checkout, customer portal, and plan management.
 */
export class BillingService {
  /**
   * Create a Dodo Payments Checkout Session for plan upgrade.
   */
  static async createCheckoutSession(
    profileId: string,
    email: string,
    plan: PlanId,
    userName?: string
  ): Promise<string> {
    const planConfig = getPlan(plan);
    if (planConfig.priceMonthly <= 0 || !planConfig.dodoProductId) {
      throw new Error(`Cannot checkout for free plan or unconfigured product`);
    }

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3001");

    const session = await dodo.checkoutSessions.create({
      product_cart: [{ product_id: planConfig.dodoProductId, quantity: 1 }],
      customer: {
        email,
        name: userName || email.split("@")[0],
      },
      metadata: {
        profile_id: profileId,
        plan,
      },
      return_url: `${appUrl}/dashboard?checkout=success`,
      cancel_url: `${appUrl}/settings/billing?checkout=canceled`,
    });

    if (!session.checkout_url) {
      throw new Error("Failed to generate checkout URL from Dodo Payments");
    }

    return session.checkout_url;
  }

  /**
   * Create a Dodo Payments Customer Portal session for self-service management.
   */
  static async createPortalSession(profileId: string): Promise<string> {
    const supabase = await createClient();
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("profile_id", profileId)
      .single();

    if (!subscription?.stripe_customer_id) {
      throw new Error("No active subscription found");
    }

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3001");

    const session = await dodo.customers.customerPortal.create(
      subscription.stripe_customer_id,
      {
        return_url: `${appUrl}/settings/billing`,
      }
    );

    return session.link;
  }

  /**
   * Get the user's current subscription.
   */
  static async getSubscription(profileId: string) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("profile_id", profileId)
      .single();
    return data;
  }

  /**
   * Sync user subscription directly from Dodo Payments if not present or outdated in DB.
   * Ensures instant upgrade on return from checkout even before webhook arrives.
   */
  static async syncUserSubscription(profileId: string, email?: string) {
    const supabase = createAdminClient();

    // Check DB first
    const { data: current } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("profile_id", profileId)
      .eq("status", "active")
      .single();

    if (current && current.plan !== "free") {
      return current;
    }

    // Query Dodo Payments for active subscription
    try {
      const subs = await dodo.subscriptions.list();
      const match = subs.items?.find((s) => {
        const matchesProfile = s.metadata?.profile_id === profileId;
        const matchesEmail = email && s.customer?.email?.toLowerCase() === email.toLowerCase();
        return (matchesProfile || matchesEmail) && s.status === "active";
      });

      if (match) {
        let plan: PlanId = "pro";
        if (
          match.metadata?.plan === "business" ||
          match.product_id === (process.env.DODO_BUSINESS_PRODUCT_ID ?? "pdt_0NnV5WnTTzfRjvjwtoWpN")
        ) {
          plan = "business";
        }

        await supabase.from("subscriptions").upsert(
          {
            profile_id: profileId,
            stripe_customer_id: match.customer?.customer_id ?? null,
            stripe_subscription_id: match.subscription_id,
            plan,
            status: "active",
            current_period_start: match.previous_billing_date || new Date().toISOString(),
            current_period_end:
              match.next_billing_date ||
              new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          },
          { onConflict: "profile_id" }
        );

        const { data: updated } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("profile_id", profileId)
          .single();

        return updated;
      }
    } catch (err) {
      console.error("[BillingService] syncUserSubscription error:", err);
    }

    return current;
  }
}
