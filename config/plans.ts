/**
 * Plan configuration — central source of truth for all subscription limits.
 * Never scatter plan limits through the codebase — import from here.
 */

export type PlanId = "free" | "pro" | "business";

export interface Plan {
  id: PlanId;
  name: string;
  description: string;
  generationsPerMonth: number;
  /** Price in cents (USD) */
  priceMonthly: number;
  /** Dodo Payments Product ID */
  dodoProductId: string | null;
  /** Stripe Price ID — legacy fallback */
  stripePriceId?: string | null;
  features: string[];
  highlighted?: boolean;
}

export const PLANS: Record<PlanId, Plan> = {
  free: {
    id: "free",
    name: "Free",
    description: "Get started with appeal drafting",
    generationsPerMonth: 1,
    priceMonthly: 0,
    dodoProductId: null,
    stripePriceId: null,
    features: [
      "1 free appeal generation",
      "PDF download",
      "Version history",
      "AI-generated draft review",
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    description: "For patients and power users",
    generationsPerMonth: 25,
    priceMonthly: 1900, // $19/month
    dodoProductId: process.env.DODO_PRO_PRODUCT_ID ?? "pdt_0NnV5W0MuhTRF7ZpO87J8",
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID ?? null,
    highlighted: true,
    features: [
      "25 appeal generations per month",
      "PDF download",
      "Version history",
      "Priority support",
      "Insurance preset saving",
    ],
  },
  business: {
    id: "business",
    name: "Business",
    description: "For medical billing offices",
    generationsPerMonth: 100,
    priceMonthly: 9900, // $99/month
    dodoProductId: process.env.DODO_BUSINESS_PRODUCT_ID ?? "pdt_0NnV5WnTTzfRjvjwtoWpN",
    stripePriceId: process.env.STRIPE_BUSINESS_PRICE_ID ?? null,
    features: [
      "100 appeal generations per month",
      "PDF download",
      "Version history",
      "Priority support",
      "Insurance preset saving",
      "Usage analytics",
      "Email export",
    ],
  },
};

export function getPlan(planId: PlanId | string): Plan {
  const plan = PLANS[planId as PlanId];
  if (!plan) return PLANS.free;
  return plan;
}

export function getGenerationLimit(planId: PlanId | string): number {
  return getPlan(planId).generationsPerMonth;
}
