import { PLANS } from "@/config/plans";

describe("plans configuration", () => {
  it("contains all 3 required tiers: free, pro, and business", () => {
    expect(PLANS).toHaveProperty("free");
    expect(PLANS).toHaveProperty("pro");
    expect(PLANS).toHaveProperty("business");
  });

  it("has correct quota limits for each tier", () => {
    expect(PLANS.free.generationsPerMonth).toBe(3);
    expect(PLANS.pro.generationsPerMonth).toBe(25);
    expect(PLANS.business.generationsPerMonth).toBe(100);
  });

  it("has valid pricing in cents", () => {
    expect(PLANS.free.priceMonthly).toBe(0);
    expect(PLANS.pro.priceMonthly).toBe(2900);
    expect(PLANS.business.priceMonthly).toBe(9900);
  });
});
