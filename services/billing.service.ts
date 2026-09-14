import { createClient, createAdminClient } from "@/lib/supabase/server";
import { dodo } from "@/lib/dodo/client";
import { getPlan, PLANS, type PlanId } from "@/config/plans";

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
      minimal_address: true,
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
      .select("payment_customer_id")
      .eq("profile_id", profileId)
      .single();

    if (!subscription?.payment_customer_id) {
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
      subscription.payment_customer_id,
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
   * Sync user subscription directly from Dodo Payments.
   * - Always prioritizes the HIGHEST tier if user has multiple subscriptions (Business > Pro > Free).
   * - Automatically expires subscriptions if current_period_end has passed.
   */
  static async syncUserSubscription(profileId: string, email?: string) {
    const supabase = createAdminClient();

    const { data: current } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("profile_id", profileId)
      .single();

    // Check if existing subscription has expired past its date
    if (current?.current_period_end) {
      const isPast = new Date(current.current_period_end).getTime() < Date.now();
      if (isPast && current.status === "active") {
        await supabase
          .from("subscriptions")
          .update({ status: "expired", updated_at: new Date().toISOString() })
          .eq("id", current.id);
        current.status = "expired";
      }
    }

    // Query Dodo Payments for active subscriptions belonging to this user
    try {
      const subs = await dodo.subscriptions.list();
      const userSubs =
        subs.items?.filter((s) => {
          const matchesProfile = s.metadata?.profile_id === profileId;
          const matchesEmail =
            email && s.customer?.email?.toLowerCase() === email.toLowerCase();
          return (matchesProfile || matchesEmail) && s.status === "active";
        }) || [];

      // Debug: log what Dodo returned so we can diagnose plan mismatches
      if (userSubs.length > 0) {
        console.log("[BillingService] Dodo subscriptions for user:", userSubs.map(s => ({
          subscription_id: s.subscription_id,
          product_id: s.product_id,
          metadata_plan: s.metadata?.plan,
          status: s.status,
        })));
        console.log("[BillingService] Expected product IDs — Pro:", PLANS.pro.dodoProductId, "Business:", PLANS.business.dodoProductId);
      }

      if (userSubs.length > 0) {
        // Resolve plan from Dodo subscription using centralized PLANS config
        const getRank = (sub: typeof userSubs[0]): { plan: PlanId; rank: number } => {
          // 1. Trust explicit metadata first
          if (sub.metadata?.plan === "pro") return { plan: "pro", rank: 2 };
          if (sub.metadata?.plan === "business") return { plan: "business", rank: 3 };

          // 2. Match product_id against PLANS config (single source of truth)
          if (sub.product_id && sub.product_id === PLANS.pro.dodoProductId) {
            return { plan: "pro", rank: 2 };
          }
          if (sub.product_id && sub.product_id === PLANS.business.dodoProductId) {
            return { plan: "business", rank: 3 };
          }

          // 3. Unknown product — default to pro (paid but unrecognized)
          console.warn("[BillingService] Unknown product_id from Dodo:", sub.product_id, "— defaulting to pro");
          return { plan: "pro", rank: 2 };
        };

        // Sort descending by highest rank
        userSubs.sort((a, b) => getRank(b).rank - getRank(a).rank);
        const highestSub = userSubs[0];
        const { plan: highestPlan, rank: highestRank } = getRank(highestSub);

        const currentRank =
          current?.status === "active"
            ? current.plan === "business"
              ? 3
              : current.plan === "pro"
              ? 2
              : 1
            : 0;

        // If highest subscription in Dodo is greater, or current was expired/different, update to highest!
        if (highestRank >= currentRank || current?.status !== "active") {
          await supabase.from("subscriptions").upsert(
            {
              profile_id: profileId,
              payment_customer_id: highestSub.customer?.customer_id ?? null,
              payment_subscription_id: highestSub.subscription_id,
              plan: highestPlan,
              status: "active",
              current_period_start:
                highestSub.previous_billing_date || new Date().toISOString(),
              current_period_end:
                highestSub.next_billing_date ||
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
      }
    } catch (err) {
      console.error("[BillingService] syncUserSubscription error:", err);
    }

    return current;
  }
}
