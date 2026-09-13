import { DodoPayments } from "dodopayments";

const apiKey = process.env.DODO_PAYMENTS_API_KEY;

export const dodo = new DodoPayments({
  bearerToken: apiKey,
  environment:
    process.env.DODO_PAYMENTS_ENVIRONMENT === "live_mode"
      ? "live_mode"
      : "test_mode",
  webhookKey: process.env.DODO_PAYMENTS_WEBHOOK_KEY,
});
