import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { UsageService } from "@/services/usage.service";
import { BillingService } from "@/services/billing.service";
import type { UsageStatus } from "@/types";
import { getStatusLabel, formatDate } from "@/lib/utils";
import {
  FilePlus,
  FileText,
  ArrowRight,
  Inbox,
  ShieldCheck,
} from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Proactively sync subscription from payment processor if returning from checkout
  try {
    await BillingService.syncUserSubscription(user.id, user.email);
  } catch {
    // Silently continue
  }

  // Load appeals
  const { data: appeals } = await supabase
    .from("appeals")
    .select("id, title, status, created_at, updated_at")
    .eq("profile_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(15);

  // Load usage
  let usage: UsageStatus = { used: 0, limit: 1, remaining: 1, plan: "free", periodStart: null, periodEnd: null };
  try {
    usage = await UsageService.getUsageStatus(user.id);
  } catch {
    // Silently fallback to defaults
  }

  const usagePercent = usage.limit > 0 ? Math.round((usage.used / usage.limit) * 100) : 0;
  const totalAppeals = appeals?.length ?? 0;
  const completedAppeals = appeals?.filter(a => a.status === "generated" || a.status === "submitted").length ?? 0;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Appeals Overview</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage your medical denial challenges, AI appeal drafts, and submission records.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            href="/appeals/new"
            className="btn-primary w-full sm:w-auto justify-center"
          >
            <FilePlus className="h-3.5 w-3.5" />
            <span>New Appeal</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid gap-3 sm:grid-cols-3">
        {/* Metric 1: Monthly Usage */}
        <div className="cinematic-card p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground">Monthly Quota</span>
            <span className="badge-neutral capitalize">{usage.plan} tier</span>
          </div>
          <div className="flex items-baseline gap-1.5 mb-3">
            <span className="text-2xl font-bold tracking-tight text-foreground">{usage.used}</span>
            <span className="text-xs text-muted-foreground">/ {usage.limit} generated</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${Math.min(usagePercent, 100)}%` }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground">{usage.remaining} remaining this cycle</span>
            {usage.plan === "free" && (
              <Link href="/settings/billing" className="text-primary hover:underline font-medium">
                Upgrade
              </Link>
            )}
          </div>
        </div>

        {/* Metric 2: Total Active Cases */}
        <div className="cinematic-card p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground">Active Records</span>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex items-baseline gap-1.5 mb-1">
            <span className="text-2xl font-bold tracking-tight text-foreground">{totalAppeals}</span>
            <span className="text-xs text-muted-foreground">cases tracked</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-2">
            {completedAppeals} finalized and ready for submission
          </p>
        </div>

        {/* Metric 3: AI Legal & Clinical Guardrails */}
        <div className="cinematic-card p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground">Verification Engine</span>
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-1.5 mb-1">
            <span className="text-sm font-semibold tracking-tight text-emerald-600 dark:text-emerald-400">ERISA § 503 & ACA Aligned</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-2">
            Anti-hallucination guardrails active with verified statutory citations.
          </p>
        </div>
      </div>

      {/* Recent Appeals Data Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-tight text-foreground">Recent Appeals</h2>
          <span className="text-[11px] text-muted-foreground">{totalAppeals} total</span>
        </div>

        {!appeals || appeals.length === 0 ? (
          /* Editorial Empty State */
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 py-16 px-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted border border-border mb-4 text-muted-foreground">
              <Inbox className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">No appeals drafted yet</h3>
            <p className="max-w-sm text-xs text-muted-foreground mt-1 mb-6 leading-relaxed">
              Start your first denial challenge. Our guided intake wizard will extract the denial reason, match statutory rights, and draft a formal appeal.
            </p>
            <Link
              href="/appeals/new"
              className="btn-primary"
            >
              <FilePlus className="h-3.5 w-3.5" />
              <span>Create First Appeal</span>
            </Link>
          </div>
        ) : (
          <>
            {/* Mobile View: Native Stacked Cards (<sm) */}
            <div className="space-y-2.5 sm:hidden">
              {appeals.map((appeal) => {
                const isCompleted = appeal.status === "generated" || appeal.status === "submitted";
                const isDraft = appeal.status === "draft";

                return (
                  <Link
                    key={appeal.id}
                    href={`/appeals/${appeal.id}`}
                    className="block cinematic-card p-4 hover:border-primary/40 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="font-medium text-xs text-foreground truncate">
                          {appeal.title || "Untitled Appeal Case"}
                        </span>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                      <div>
                        {isCompleted ? (
                          <span className="badge-success">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            {getStatusLabel(appeal.status)}
                          </span>
                        ) : isDraft ? (
                          <span className="badge-neutral">
                            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                            Draft In Progress
                          </span>
                        ) : (
                          <span className="badge-cobalt">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                            {getStatusLabel(appeal.status)}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {formatDate(appeal.updated_at)}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Tablet & Desktop View: Table (sm+) */}
            <div className="hidden sm:block overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                      <th className="py-3 px-4">Case Title</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Last Updated</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {appeals.map((appeal) => {
                      const isCompleted = appeal.status === "generated" || appeal.status === "submitted";
                      const isDraft = appeal.status === "draft";

                      return (
                        <tr
                          key={appeal.id}
                          className="group hover:bg-muted/30 transition-colors"
                        >
                          <td className="py-3.5 px-4 font-medium text-foreground">
                            <Link
                              href={`/appeals/${appeal.id}`}
                              className="flex items-center gap-2.5 hover:text-primary transition-colors"
                            >
                              <FileText className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
                              <span className="truncate max-w-xs md:max-w-md">
                                {appeal.title || "Untitled Appeal Case"}
                              </span>
                            </Link>
                          </td>
                          <td className="py-3.5 px-4">
                            {isCompleted ? (
                              <span className="badge-success">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                {getStatusLabel(appeal.status)}
                              </span>
                            ) : isDraft ? (
                              <span className="badge-neutral">
                                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                                Draft In Progress
                              </span>
                            ) : (
                              <span className="badge-cobalt">
                                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                                {getStatusLabel(appeal.status)}
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-muted-foreground text-[11px]">
                            {formatDate(appeal.updated_at)}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <Link
                              href={`/appeals/${appeal.id}`}
                              className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <span>Review</span>
                              <ArrowRight className="h-3 w-3" />
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
