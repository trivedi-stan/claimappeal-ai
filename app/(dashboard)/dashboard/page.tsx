import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { UsageService } from "@/services/usage.service";
import type { UsageStatus } from "@/types";
import { getStatusLabel, getStatusColor, formatDate } from "@/lib/utils";
import {
  FilePlus,
  FileText,
  ArrowRight,
  BarChart3,
  Inbox,
} from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Load appeals
  const { data: appeals } = await supabase
    .from("appeals")
    .select("id, title, status, created_at, updated_at")
    .eq("profile_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(10);

  // Load usage
  let usage: UsageStatus = { used: 0, limit: 3, remaining: 3, plan: "free", periodStart: null, periodEnd: null };
  try {
    usage = await UsageService.getUsageStatus(user.id);
  } catch {
    // Silently fail — will show defaults
  }

  const usagePercent = usage.limit > 0 ? Math.round((usage.used / usage.limit) * 100) : 0;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your insurance appeal letters
          </p>
        </div>
        <Link
          href="/appeals/new"
          className="gradient-primary inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:brightness-110"
        >
          <FilePlus className="h-4 w-4" />
          New Appeal
        </Link>
      </div>

      {/* Usage card */}
      <div className="mb-8 rounded-xl border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Usage This Period</h2>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary capitalize">
            {usage.plan} Plan
          </span>
        </div>
        <div className="flex items-end gap-2 mb-2">
          <span className="text-3xl font-bold">{usage.used}</span>
          <span className="mb-1 text-muted-foreground">/ {usage.limit} generations</span>
        </div>
        <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full gradient-primary transition-all duration-500"
            style={{ width: `${Math.min(usagePercent, 100)}%` }}
          />
        </div>
        {usage.remaining <= 0 && (
          <p className="mt-2 text-sm text-destructive font-medium">
            You&apos;ve used all your generations this period.{" "}
            <Link href="/settings/billing" className="underline">
              Upgrade your plan
            </Link>
          </p>
        )}
      </div>

      {/* Recent appeals */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Recent Appeals</h2>
        {!appeals || appeals.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 py-16 text-center">
            <Inbox className="mb-4 h-12 w-12 text-muted-foreground/40" />
            <h3 className="mb-1 text-lg font-semibold">No appeals yet</h3>
            <p className="mb-6 text-sm text-muted-foreground">
              Create your first appeal to get started
            </p>
            <Link
              href="/appeals/new"
              className="gradient-primary inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg"
            >
              <FilePlus className="h-4 w-4" />
              Create First Appeal
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {appeals.map((appeal) => (
              <Link
                key={appeal.id}
                href={`/appeals/${appeal.id}`}
                className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm transition-all hover:shadow-md hover:border-primary/30"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{appeal.title || "Untitled Appeal"}</p>
                    <p className="text-xs text-muted-foreground">
                      Updated {formatDate(appeal.updated_at)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(appeal.status)}`}>
                    {getStatusLabel(appeal.status)}
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
