"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  Loader2,
  CreditCard,
  ExternalLink,
  Check,
  Zap,
  Sparkles,
  Building2,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { PLANS, type PlanId } from "@/config/plans";

interface UsageData {
  used: number;
  limit: number;
  remaining: number;
  plan: string;
}

export default function BillingSettingsPage() {
  const searchParams = useSearchParams();
  const requestedPlan = searchParams.get("plan") as PlanId | null;
  const checkoutStatus = searchParams.get("checkout");

  const [loadingPlan, setLoadingPlan] = useState<PlanId | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<string>("free");
  const [usage, setUsage] = useState<UsageData>({ used: 0, limit: 3, remaining: 3, plan: "free" });
  const [hasActiveStripe, setHasActiveStripe] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (checkoutStatus === "success") {
      toast.success("Subscription upgraded successfully! Your quota has been refreshed.");
    } else if (checkoutStatus === "canceled") {
      toast.info("Checkout was canceled. No charges were made.");
    }
  }, [checkoutStatus]);

  useEffect(() => {
    async function loadBillingData() {
      try {
        const res = await fetch("/api/appeals", { method: "GET" });
        // The dashboard page loads usage, let's also fetch profile usage from user session
        if (res.ok) {
          // Check if user has subscription info
          // We can fetch portal endpoint safely to detect active customer
        }
      } catch (err) {
        console.error("Failed to load billing state:", err);
      } finally {
        setPageLoading(false);
      }
    }
    loadBillingData();
  }, []);

  async function handleUpgrade(planId: PlanId) {
    if (planId === "free") return;
    setLoadingPlan(planId);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      });

      const result = await res.json();
      if (result.success && result.data?.url) {
        toast.loading("Redirecting to secure Stripe checkout...");
        window.location.href = result.data.url;
      } else {
        toast.error(result.error || "Failed to initiate checkout.");
        setLoadingPlan(null);
      }
    } catch {
      toast.error("Failed to connect to checkout service.");
      setLoadingPlan(null);
    }
  }

  async function handleManageBilling() {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const result = await res.json();
      if (result.success && result.data?.url) {
        window.location.href = result.data.url;
      } else {
        toast.info("No active paid Stripe subscription found. Choose a plan below to upgrade.");
      }
    } catch {
      toast.error("Failed to open billing portal.");
    } finally {
      setPortalLoading(false);
    }
  }

  const planList = Object.values(PLANS);

  return (
    <div className="animate-fade-in max-w-5xl space-y-8 pb-12">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Billing & Subscriptions</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your subscription tier, billing cycle, and generation limits.
        </p>
      </div>

      {/* Current Plan Overview Card */}
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-b from-card/80 to-card p-6 shadow-sm backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="rounded-xl border border-primary/20 bg-primary/10 p-3 text-primary">
              <CreditCard className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold capitalize text-foreground">{currentPlan} Plan</h2>
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Active
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                {currentPlan === "free"
                  ? "Standard quota of 3 appeals per month with AI review and PDF export."
                  : "Premium tier with expanded generation quota and priority AI synthesis."}
              </p>
            </div>
          </div>

          <button
            onClick={handleManageBilling}
            disabled={portalLoading}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border/80 bg-background px-4 py-2 text-xs font-medium text-foreground transition-all hover:bg-muted/80 disabled:opacity-50"
          >
            {portalLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ExternalLink className="h-3.5 w-3.5" />}
            Stripe Customer Portal
          </button>
        </div>
      </div>

      {/* Available Plans Grid */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-foreground">Choose a Plan</h2>
          <p className="text-xs text-muted-foreground">Select the tier that matches your appeal volume</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {planList.map((plan) => {
            const isCurrent = currentPlan === plan.id;
            const isPro = plan.id === "pro";
            const isBusiness = plan.id === "business";
            const isHighlighted = requestedPlan === plan.id || (isPro && currentPlan === "free");
            const isProcessing = loadingPlan === plan.id;

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col justify-between rounded-2xl border p-6 transition-all duration-200 ${
                  isPro
                    ? "border-primary/50 bg-gradient-to-b from-primary/5 via-card to-card shadow-lg shadow-primary/5 ring-1 ring-primary/30"
                    : "border-border/70 bg-card/60 hover:border-border hover:bg-card/90"
                } ${isHighlighted && !isCurrent ? "scale-[1.02]" : ""}`}
              >
                {/* Highlight Badge */}
                {isPro && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 rounded-full gradient-primary px-3 py-0.5 text-[11px] font-semibold text-white shadow-md">
                      <Sparkles className="h-3 w-3" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div>
                  {/* Plan Name & Icon */}
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                    {plan.id === "free" && <ShieldCheck className="h-5 w-5 text-muted-foreground" />}
                    {isPro && <Zap className="h-5 w-5 text-primary" />}
                    {isBusiness && <Building2 className="h-5 w-5 text-indigo-400" />}
                  </div>

                  <p className="text-xs text-muted-foreground min-h-[32px] mb-4">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="mb-6 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold tracking-tight text-foreground">
                      {plan.priceMonthly === 0 ? "Free" : `$${plan.priceMonthly / 100}`}
                    </span>
                    {plan.priceMonthly > 0 && (
                      <span className="text-xs text-muted-foreground">/month</span>
                    )}
                  </div>

                  {/* Features Divider */}
                  <div className="h-px w-full bg-border/60 mb-5" />

                  {/* Features List */}
                  <ul className="space-y-2.5 text-xs text-muted-foreground mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                        <span className="leading-snug text-foreground/90">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Plan Action Button */}
                <div>
                  {isCurrent ? (
                    <button
                      disabled
                      className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-border/80 bg-muted/50 py-2.5 text-xs font-semibold text-muted-foreground cursor-default"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      Current Plan
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpgrade(plan.id)}
                      disabled={isProcessing || plan.id === "free"}
                      className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold shadow-sm transition-all duration-200 disabled:opacity-50 ${
                        isPro
                          ? "gradient-primary text-white shadow-primary/20 hover:brightness-110 hover:shadow-md"
                          : "border border-border/80 bg-background hover:bg-muted/80 text-foreground"
                      }`}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span>Connecting to Stripe...</span>
                        </>
                      ) : (
                        <>
                          <span>Upgrade to {plan.name}</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Security & Guarantee Note */}
      <div className="rounded-xl border border-border/60 bg-muted/30 p-4 text-xs text-muted-foreground flex items-center gap-3">
        <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
        <div>
          <span className="font-semibold text-foreground">Secure Billing:</span> All transactions are encrypted and processed by Stripe. Subscriptions can be canceled or changed at any time with immediate effect.
        </div>
      </div>
    </div>
  );
}
