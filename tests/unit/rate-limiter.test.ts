import { checkRateLimit } from "@/lib/security/rate-limiter";

describe("checkRateLimit", () => {
  it("allows requests under the limit", () => {
    const id = "test-user-allow-" + Date.now();
    const opts = { limit: 3, windowSeconds: 60 };

    const res1 = checkRateLimit(id, opts);
    expect(res1.success).toBe(true);
    expect(res1.remaining).toBe(2);

    const res2 = checkRateLimit(id, opts);
    expect(res2.success).toBe(true);
    expect(res2.remaining).toBe(1);

    const res3 = checkRateLimit(id, opts);
    expect(res3.success).toBe(true);
    expect(res3.remaining).toBe(0);
  });

  it("blocks requests that exceed the limit", () => {
    const id = "test-user-block-" + Date.now();
    const opts = { limit: 2, windowSeconds: 60 };

    checkRateLimit(id, opts);
    checkRateLimit(id, opts);

    const blocked = checkRateLimit(id, opts);
    expect(blocked.success).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.reset).toBeGreaterThan(Math.floor(Date.now() / 1000));
  });
});
