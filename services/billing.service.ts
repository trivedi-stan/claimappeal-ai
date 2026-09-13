import { createClient } from "@/lib/supabase/server";
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
}
