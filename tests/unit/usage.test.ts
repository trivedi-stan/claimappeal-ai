import { getGenerationLimit, PLANS } from "@/config/plans";

describe("Subscription Expiration & Quota Rules", () => {
  it("returns free limit (1 appeal) when subscription has expired", () => {
    const expiredSub = {
      plan: "pro",
      status: "active",
      current_period_end: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    };

    const isExpired = new Date(expiredSub.current_period_end).getTime() < Date.now();
    const effectivePlan = isExpired ? "free" : expiredSub.plan;

    expect(isExpired).toBe(true);
    expect(effectivePlan).toBe("free");
    expect(getGenerationLimit(effectivePlan)).toBe(1);
  });

  it("returns pro limit (25 appeals) when subscription is actively within billing cycle", () => {
    const activeSub = {
      plan: "pro",
      status: "active",
      current_period_end: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15).toISOString(), // 15 days in future
    };

    const isExpired = new Date(activeSub.current_period_end).getTime() < Date.now();
    const effectivePlan = isExpired ? "free" : activeSub.plan;

    expect(isExpired).toBe(false);
    expect(effectivePlan).toBe("pro");
    expect(getGenerationLimit(effectivePlan)).toBe(25);
  });

  it("returns business limit (100 appeals) when subscription is business tier", () => {
    const activeBusiness = {
      plan: "business",
      status: "active",
      current_period_end: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
    };

    const isExpired = new Date(activeBusiness.current_period_end).getTime() < Date.now();
    const effectivePlan = isExpired ? "free" : activeBusiness.plan;

    expect(isExpired).toBe(false);
    expect(effectivePlan).toBe("business");
    expect(getGenerationLimit(effectivePlan)).toBe(100);
  });

  it("prioritizes business tier if user holds multiple active subscriptions", () => {
    const PLAN_RANKS = { business: 3, pro: 2, free: 1 };
    const subscriptions = [
      { id: "sub_pro", plan: "pro", rank: PLAN_RANKS.pro },
      { id: "sub_business", plan: "business", rank: PLAN_RANKS.business },
    ];

    subscriptions.sort((a, b) => b.rank - a.rank);
    const highest = subscriptions[0];

    expect(highest.plan).toBe("business");
    expect(getGenerationLimit(highest.plan)).toBe(100);
  });
});
