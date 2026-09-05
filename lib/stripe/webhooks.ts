import Stripe from "stripe";
import { stripe } from "./client";
import { createAdminClient } from "@/lib/supabase/server";
import type { PlanId } from "@/config/plans";

/**
 * Verify Stripe webhook signature and parse the event.
 * Returns null if verification fails.
 */
export async function verifyWebhookSignature(
  body: string,
  signature: string
): Promise<Stripe.Event | null> {
  try {
    return stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("[Stripe Webhook] Signature verification failed:", err);
    return null;
  }
}

/**
 * Handle verified Stripe webhook events.
 * Idempotent — safe to receive the same event multiple times.
 */
export async function handleWebhookEvent(event: Stripe.Event): Promise<void> {
  const supabase = createAdminClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutCompleted(supabase, session);
      break;
    }
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionUpdated(supabase, subscription);
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionDeleted(supabase, subscription);
      break;
    }
    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      console.warn(
        `[Stripe] Payment failed for customer ${invoice.customer}`,
      );
      break;
    }
    default:
      // Unhandled event type — safe to ignore
      break;
  }
}

async function handleCheckoutCompleted(
  supabase: ReturnType<typeof createAdminClient>,
  session: Stripe.Checkout.Session
) {
  const profileId = session.metadata?.profile_id;
  const plan = (session.metadata?.plan as PlanId) ?? "pro";

  if (!profileId) {
    console.error("[Stripe] Checkout session missing profile_id metadata");
    return;
  }

  // Upsert subscription record
  const { error } = await supabase.from("subscriptions").upsert(
    {
      profile_id: profileId,
      stripe_customer_id: session.customer as string,
      stripe_subscription_id: session.subscription as string,
      plan,
      status: "active",
      current_period_start: new Date().toISOString(),
      current_period_end: null, // Updated by subscription.updated event
      updated_at: new Date().toISOString(),
    },
    { onConflict: "profile_id" }
  );

  if (error) {
    console.error("[Stripe] Failed to upsert subscription:", error);
  }
}

async function handleSubscriptionUpdated(
  supabase: ReturnType<typeof createAdminClient>,
  subscription: Stripe.Subscription
) {
  const { error } = await supabase
    .from("subscriptions")
    .update({
      status: subscription.status as string,
      current_period_start: new Date(
        subscription.current_period_start * 1000
      ).toISOString(),
      current_period_end: new Date(
        subscription.current_period_end * 1000
      ).toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", subscription.id);

  if (error) {
    console.error("[Stripe] Failed to update subscription:", error);
  }
}

async function handleSubscriptionDeleted(
  supabase: ReturnType<typeof createAdminClient>,
  subscription: Stripe.Subscription
) {
  const { error } = await supabase
    .from("subscriptions")
    .update({
      status: "canceled",
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", subscription.id);

  if (error) {
    console.error("[Stripe] Failed to cancel subscription:", error);
  }
}
