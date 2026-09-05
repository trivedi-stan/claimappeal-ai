import Stripe from "stripe";

/**
 * Server-side Stripe client.
 * NEVER import this in client components.
 */
let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
      apiVersion: "2025-02-24.acacia",
      typescript: true,
    });
  }
  return stripeInstance;
}

export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    const instance = getStripe();
    const value = (instance as any)[prop];
    return typeof value === "function" ? value.bind(instance) : value;
  },
});

