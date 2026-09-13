import { DodoPayments } from "dodopayments";

/**
 * Lazily instantiate DodoPayments client with environment variable or fallback test key.
 */
export function getDodoClient(): DodoPayments {
  const apiKey =
    process.env.DODO_PAYMENTS_API_KEY ||
    "xUCy-0JDoUyno9Kv.UF27UBexTGTiHQfaTNKyL875yrHAVvbanwMwP29VHEcKrfQB";

  return new DodoPayments({
    bearerToken: apiKey,
    environment:
      process.env.DODO_PAYMENTS_ENVIRONMENT === "live_mode"
        ? "live_mode"
        : "test_mode",
    webhookKey: process.env.DODO_PAYMENTS_WEBHOOK_KEY || undefined,
  });
}

/**
 * Transparent proxy to lazy-load DodoPayments on demand.
 */
export const dodo = new Proxy({} as DodoPayments, {
  get(_target, prop) {
    const client = getDodoClient();
    const value = (client as unknown as Record<string | symbol, unknown>)[prop];
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
});
