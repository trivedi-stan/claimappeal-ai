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
  features: string[];
  highlighted?: boolean;
}

export const PLANS: Record<PlanId, Plan> = {
  free: {
    id: "free",
    name: "Free",
    description: "For individual claim rejections",
    generationsPerMonth: 1,
    priceMonthly: 0,
    dodoProductId: null,
    features: [
      "1 free personalized appeal",
      "PDF download",
      "Version history",
      "AI draft review",
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    description: "For patients & ongoing care appeals",
    generationsPerMonth: 10,
    priceMonthly: 1900, // $19/month
    dodoProductId: process.env.DODO_PRO_PRODUCT_ID ?? "pdt_0NnaOzGhDhoRI1oQtLG5W",
    highlighted: true,
    features: [
      "10 personalized appeals/month",
      "PDF download",
      "Version history",
      "AI draft review",
      "Insurance presets",
      "Priority support",
    ],
  },
  business: {
    id: "business",
    name: "Business",
    description: "For medical billing offices & advocates",
    generationsPerMonth: 100,
    priceMonthly: 9900, // $99/month
    dodoProductId: process.env.DODO_BUSINESS_PRODUCT_ID ?? "pdt_0NnaPLN1T0rvsuXF2IwHW",
    features: [
      "100 personalized appeals/month",
      "PDF download",
      "Version history",
      "AI draft review",
      "Insurance presets",
      "Priority support",
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
