import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Shield, Users, FileText, Activity, ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Admin check
  const adminEmails = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
  if (!adminEmails.includes(user.email?.toLowerCase() ?? "")) redirect("/dashboard");

  // Fetch stats
  const [
    { count: userCount },
    { count: appealCount },
    { count: generationCount },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("appeals").select("*", { count: "exact", head: true }),
    supabase.from("ai_generations").select("*", { count: "exact", head: true }),
  ]);

  const { data: recentAppeals } = await supabase
    .from("appeals")
    .select("id, title, status, created_at, profile_id, profiles(email, full_name)")
    .order("created_at", { ascending: false })
    .limit(10);

  const { data: recentGenerations } = await supabase
    .from("ai_generations")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);

  const stats = [
    { label: "Active Platform Accounts", value: userCount ?? 0, icon: Users, badge: "Total Users" },
    { label: "Total Ingested Appeals", value: appealCount ?? 0, icon: FileText, badge: "Cases Logged" },
    { label: "Claude AI Generations", value: generationCount ?? 0, icon: Activity, badge: "Synthesized" },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100">
      {/* Header */}
      <div className="border-b border-white/[0.08] bg-zinc-950/80 backdrop-blur-md">
        <div className="container mx-auto max-w-6xl flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Shield className="h-4.5 w-4.5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold tracking-tight text-zinc-100">ClaimAppeal AI</span>
              <span className="badge-cobalt text-[10px]">Operations Control</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="btn-secondary text-xs px-3 py-1.5 inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to App</span>
            </Link>
            <span className="text-xs font-mono text-zinc-500 border-l border-white/[0.08] pl-4">
              {user.email}
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-6 py-8 space-y-8 animate-fade-in pb-16">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
            Platform Telemetry & System Status
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time tracking of ingested health claim denials, Claude API generations, and user volumes.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="cinematic-card p-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-500">{s.badge}</span>
                <s.icon className="h-4 w-4 text-blue-400" />
              </div>
              <p className="mt-3 text-3xl font-mono font-bold text-zinc-100">{s.value}</p>
              <p className="text-xs text-zinc-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Recent appeals */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-200">Recent Claims Ingested</h2>
            <span className="text-xs font-mono text-zinc-500">Showing last 10 records</span>
          </div>
          <div className="cinematic-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-white/[0.02] text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                    <th className="px-5 py-3.5">Appeal Case</th>
                    <th className="px-5 py-3.5">Account</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5">Ingested</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {recentAppeals?.map((a) => (
                    <tr key={a.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3.5 font-medium text-zinc-200">
                        {a.title || "Untitled Record"}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-zinc-400">
                        {(Array.isArray(a.profiles)
                          ? (a.profiles[0] as { email?: string } | undefined)?.email
                          : (a.profiles as { email?: string } | null)?.email) ??
                          a.profile_id.substring(0, 8)}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="badge-neutral font-mono text-[10px]">{a.status}</span>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-zinc-500">
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
            <h2 className="text-sm font-semibold text-zinc-200">AI Synthesis Activity</h2>
            <span className="text-xs font-mono text-zinc-500">Anthropic Claude API</span>
          </div>
          <div className="cinematic-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-white/[0.02] text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                    <th className="px-5 py-3.5">Engine / Provider</th>
                    <th className="px-5 py-3.5">Model</th>
                    <th className="px-5 py-3.5">Duration</th>
                    <th className="px-5 py-3.5">Outcome</th>
                    <th className="px-5 py-3.5">Est. Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {recentGenerations?.map((g) => (
                    <tr key={g.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3.5 font-mono text-zinc-300 capitalize">{g.provider}</td>
                      <td className="px-5 py-3.5 font-mono text-zinc-400">{g.model}</td>
                      <td className="px-5 py-3.5 font-mono text-zinc-400">
                        {g.duration_ms ? `${(g.duration_ms / 1000).toFixed(1)}s` : "—"}
                      </td>
                      <td className="px-5 py-3.5">
                        {g.success ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400 font-mono text-[11px]">
                            <CheckCircle2 className="h-3 w-3" /> SUCCESS
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-red-400 font-mono text-[11px]">
                            <XCircle className="h-3 w-3" /> {g.error_code || "FAILED"}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-zinc-400">
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
