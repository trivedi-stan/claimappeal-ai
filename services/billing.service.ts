import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe/client";
import { getPlan, type PlanId } from "@/config/plans";

/**
 * Billing service — Stripe checkout, customer portal, plan management.
 */
export class BillingService {
  /**
   * Create a Stripe Checkout Session for plan upgrade.
   */
  static async createCheckoutSession(
    profileId: string,
    email: string,
    plan: PlanId
  ): Promise<string> {
    const planConfig = getPlan(plan);
    if (planConfig.priceMonthly <= 0) {
      throw new Error(`Cannot checkout for free plan`);
    }

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3001");

    const lineItem = planConfig.stripePriceId
      ? { price: planConfig.stripePriceId, quantity: 1 }
      : {
          price_data: {
            currency: "usd",
            product_data: {
              name: `ClaimAppeal AI ${planConfig.name} Plan`,
              description: planConfig.description,
            },
            unit_amount: planConfig.priceMonthly,
            recurring: {
              interval: "month" as const,
            },
          },
          quantity: 1,
        };

    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      mode: "subscription",
      line_items: [lineItem],
      metadata: {
        profile_id: profileId,
        plan,
      },
      success_url: `${appUrl}/dashboard?checkout=success`,
      cancel_url: `${appUrl}/settings/billing?checkout=canceled`,
      allow_promotion_codes: true,
    });

    return session.url!;
  }

  /**
   * Create a Stripe Customer Portal session for self-service management.
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

    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${appUrl}/settings/billing`,
    });

    return session.url;
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
