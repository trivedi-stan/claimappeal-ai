"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, CreditCard, ExternalLink } from "lucide-react";

export default function BillingSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleManageBilling() {
    setLoading(true);
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const result = await res.json();
      if (result.success && result.data?.url) {
        window.location.href = result.data.url;
      } else {
        toast.error("No active subscription found. Subscribe first on the Pricing page.");
        router.push("/pricing");
      }
    } catch {
      toast.error("Failed to open billing portal.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="animate-fade-in">
      <h1 className="mb-1 text-2xl font-bold">Billing</h1>
      <p className="mb-6 text-muted-foreground">Manage your subscription and payment methods</p>

      <div className="max-w-lg rounded-xl border bg-card p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <CreditCard className="h-6 w-6 text-primary" />
          <h2 className="font-semibold">Subscription Management</h2>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">
          Manage your subscription, update payment methods, download invoices, and cancel or change your plan through the Stripe Customer Portal.
        </p>
        <button onClick={handleManageBilling} disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:brightness-110 disabled:opacity-50">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ExternalLink className="h-4 w-4" />}
          Manage Billing
        </button>
      </div>
    </div>
  );
}
