import { dodo } from "./client";
import { createAdminClient } from "@/lib/supabase/server";
import { PLANS, type PlanId } from "@/config/plans";
import { EmailService } from "@/services/email.service";
import type { Webhooks } from "dodopayments/resources/webhooks/webhooks";

/**
 * Verify Dodo webhook signature and unwrap the event.
 */
export async function verifyDodoWebhook(
  rawBody: string,
  headers: Record<string, string>
): Promise<Webhooks.UnwrapWebhookEvent | null> {
  try {
    const webhookKey = process.env.DODO_PAYMENTS_WEBHOOK_KEY;
    if (webhookKey) {
      return dodo.webhooks.unwrap(rawBody, { headers, key: webhookKey });
    }
    // If no webhook secret is set yet in development, safely unwrap
    return dodo.webhooks.unsafeUnwrap(rawBody) as Webhooks.UnwrapWebhookEvent;
  } catch (err) {
    console.error("[Dodo Webhook] Signature verification failed:", err);
    return null;
  }
}

/**
 * Resolve PlanId from webhook payload metadata or product ID
 */
function resolvePlanId(metadata?: Record<string, unknown> | null, productId?: string | null): PlanId {
  if (metadata?.plan && (metadata.plan === "pro" || metadata.plan === "business")) {
    return metadata.plan as PlanId;
  }
  if (productId) {
    if (productId === (process.env.DODO_PRO_PRODUCT_ID ?? "pdt_0NnV5W0MuhTRF7ZpO87J8")) {
      return "pro";
    }
    if (productId === (process.env.DODO_BUSINESS_PRODUCT_ID ?? "pdt_0NnV5WnTTzfRjvjwtoWpN")) {
      return "business";
    }
  }
  return "pro";
}

/**
 * Handle verified Dodo webhook events.
 */
export async function handleDodoWebhookEvent(event: Webhooks.UnwrapWebhookEvent): Promise<void> {
  const supabase = createAdminClient();

  switch (event.type) {
    case "subscription.active": {
      const sub = event.data;
      const profileId = (sub.metadata?.profile_id as string) || undefined;
      const plan = resolvePlanId(sub.metadata, sub.product_id);

      if (!profileId) {
        console.warn("[Dodo Webhook] Subscription active event missing profile_id metadata:", sub.subscription_id);
        // Fallback search by email if available
        if (sub.customer?.email) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("id")
            .eq("email", sub.customer.email)
            .single();
          if (profile?.id) {
            await upsertSubscription(supabase, profile.id, sub, plan);
          }
        }
      } else {
        await upsertSubscription(supabase, profileId, sub, plan);
      }

      // Send activation receipt email
      if (sub.customer?.email) {
        await EmailService.sendSubscriptionActivatedEmail({
          to: sub.customer.email,
          userName: sub.customer.name || undefined,
          plan,
          subscriptionId: sub.subscription_id,
          nextBillingDate: sub.next_billing_date || undefined,
        });
      }
      break;
    }

    case "subscription.renewed":
    case "subscription.plan_changed":
    case "subscription.updated": {
      const sub = event.data;
      const plan = resolvePlanId(sub.metadata, sub.product_id);

      const { error } = await supabase
        .from("subscriptions")
        .update({
          plan,
          status: sub.status ?? "active",
          current_period_start: sub.previous_billing_date || new Date().toISOString(),
          current_period_end: sub.next_billing_date || null,
          updated_at: new Date().toISOString(),
        })
        .eq("stripe_subscription_id", sub.subscription_id);

      if (error) {
        console.error("[Dodo Webhook] Failed to update subscription renewal:", error);
      }
      break;
    }

    case "subscription.cancelled":
    case "subscription.expired": {
      const sub = event.data;
      const plan = resolvePlanId(sub.metadata, sub.product_id);

      const { error } = await supabase
        .from("subscriptions")
        .update({
          status: "canceled",
          updated_at: new Date().toISOString(),
        })
        .eq("stripe_subscription_id", sub.subscription_id);

      if (error) {
        console.error("[Dodo Webhook] Failed to cancel subscription:", error);
      }

      if (sub.customer?.email) {
        await EmailService.sendSubscriptionCancelledEmail({
          to: sub.customer.email,
          userName: sub.customer.name || undefined,
          plan,
          endDate: sub.next_billing_date || undefined,
        });
      }
      break;
    }

    case "payment.succeeded": {
      const payment = event.data;
      console.log(`[Dodo Webhook] Payment succeeded: ${payment.payment_id} for customer ${payment.customer?.customer_id}`);
      break;
    }

    default:
      console.log(`[Dodo Webhook] Unhandled event type: ${event.type}`);
      break;
  }
}

async function upsertSubscription(
  supabase: ReturnType<typeof createAdminClient>,
  profileId: string,
  sub: {
    subscription_id: string;
    customer?: { customer_id: string } | null;
    status?: string | null;
    previous_billing_date?: string | null;
    next_billing_date?: string | null;
  },
  plan: PlanId
) {
  const { error } = await supabase.from("subscriptions").upsert(
    {
      profile_id: profileId,
      stripe_customer_id: sub.customer?.customer_id ?? null,
      stripe_subscription_id: sub.subscription_id,
      plan,
      status: sub.status ?? "active",
      current_period_start: sub.previous_billing_date || new Date().toISOString(),
      current_period_end: sub.next_billing_date || null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "profile_id" }
  );

  if (error) {
    console.error("[Dodo Webhook] Failed to upsert subscription:", error);
  }
}
