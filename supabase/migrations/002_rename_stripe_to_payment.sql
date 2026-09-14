-- ============================================================
-- Migration: Rename stripe-specific columns to provider-agnostic names
-- This ensures we can switch payment providers (Dodo, Stripe, etc.)
-- without needing database schema changes.
-- ============================================================

-- Rename columns in subscriptions table
ALTER TABLE public.subscriptions
  RENAME COLUMN stripe_customer_id TO payment_customer_id;

ALTER TABLE public.subscriptions
  RENAME COLUMN stripe_subscription_id TO payment_subscription_id;

-- Drop the old stripe-named index and recreate with generic name
DROP INDEX IF EXISTS idx_subscriptions_stripe_sub;
CREATE INDEX idx_subscriptions_payment_sub ON public.subscriptions(payment_subscription_id);
