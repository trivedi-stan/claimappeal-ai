import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import {
  Shield,
  ArrowLeft,
  Users,
  FileText,
  Activity,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (!adminEmails.includes(user.email?.toLowerCase() ?? "")) {
    redirect("/dashboard");
  }

  // Load telemetry metrics
  const [{ count: userCount }, { count: appealCount }, { count: generationCount }] =
    await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("appeals").select("*", { count: "exact", head: true }),
      supabase.from("generation_logs").select("*", { count: "exact", head: true }),
    ]);

  const { data: recentAppeals } = await supabase
    .from("appeals")
    .select("id, title, status, created_at, profile_id, profiles(email)")
    .order("created_at", { ascending: false })
    .limit(10);

  const { data: recentGenerations } = await supabase
    .from("generation_logs")
    .select("id, provider, model, duration_ms, estimated_cost_usd, success, error_code, created_at")
    .order("created_at", { ascending: false })
    .limit(10);

  const stats = [
    { label: "Active Platform Accounts", value: userCount ?? 0, icon: Users, badge: "Total Users" },
    { label: "Total Ingested Appeals", value: appealCount ?? 0, icon: FileText, badge: "Cases Logged" },
    { label: "Gemini AI Generations", value: generationCount ?? 0, icon: Activity, badge: "Synthesized" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto max-w-6xl flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary">
              <Shield className="h-4.5 w-4.5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold tracking-tight text-foreground">ClaimAppeal AI</span>
              <span className="badge-cobalt text-[10px]">Operations Control</span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <ThemeToggle />
            <Link
              href="/dashboard"
              className="btn-secondary text-xs px-3 py-1.5 inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to App</span>
            </Link>
            <span className="text-xs font-mono text-muted-foreground border-l border-border pl-4 hidden sm:inline">
              {user.email}
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-6 py-8 space-y-8 animate-fade-in pb-16">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Platform Telemetry & System Status
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Real-time tracking of ingested health claim denials, Claude API generations, and user volumes.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="cinematic-card p-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">{s.badge}</span>
                <s.icon className="h-4 w-4 text-primary" />
              </div>
              <p className="mt-3 text-3xl font-mono font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Recent appeals */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Recent Claims Ingested</h2>
            <span className="text-xs font-mono text-muted-foreground">Showing last 10 records</span>
          </div>
          <div className="cinematic-card overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                    <th className="px-5 py-3.5">Appeal Case</th>
                    <th className="px-5 py-3.5">Account</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5">Ingested</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentAppeals?.map((a) => (
                    <tr key={a.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-foreground">
                        {a.title || "Untitled Record"}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-muted-foreground">
                        {(Array.isArray(a.profiles)
                          ? (a.profiles[0] as { email?: string } | undefined)?.email
                          : (a.profiles as { email?: string } | null)?.email) ??
                          a.profile_id.substring(0, 8)}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="badge-neutral font-mono text-[10px]">{a.status}</span>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-muted-foreground">
                        {formatDate(a.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent AI generations */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">AI Synthesis Activity</h2>
            <span className="text-xs font-mono text-muted-foreground">Google Gemini API</span>
          </div>
          <div className="cinematic-card overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                    <th className="px-5 py-3.5">Engine / Provider</th>
                    <th className="px-5 py-3.5">Model</th>
                    <th className="px-5 py-3.5">Duration</th>
                    <th className="px-5 py-3.5">Outcome</th>
                    <th className="px-5 py-3.5">Est. Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentGenerations?.map((g) => (
                    <tr key={g.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-foreground capitalize">{g.provider}</td>
                      <td className="px-5 py-3.5 font-mono text-muted-foreground">{g.model}</td>
                      <td className="px-5 py-3.5 font-mono text-muted-foreground">
                        {g.duration_ms ? `${(g.duration_ms / 1000).toFixed(1)}s` : "—"}
                      </td>
                      <td className="px-5 py-3.5">
                        {g.success ? (
                          <span className="inline-flex items-center gap-1 text-emerald-500 font-mono text-[11px]">
                            <CheckCircle2 className="h-3 w-3" /> SUCCESS
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-red-500 font-mono text-[11px]">
                            <XCircle className="h-3 w-3" /> {g.error_code || "FAILED"}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-muted-foreground">
                        ${g.estimated_cost_usd?.toFixed(4) ?? "0.0000"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
