import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Shield, Users, FileText, BarChart3, Activity, ArrowLeft } from "lucide-react";

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
    { label: "Total Users", value: userCount ?? 0, icon: Users, color: "text-blue-500" },
    { label: "Total Appeals", value: appealCount ?? 0, icon: FileText, color: "text-emerald-500" },
    { label: "AI Generations", value: generationCount ?? 0, icon: Activity, color: "text-purple-500" },
  ];

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto flex h-16 items-center gap-3 px-6">
          <Shield className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">Admin Panel</span>
          <div className="ml-auto flex items-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
            <span className="border-l pl-4 text-sm text-muted-foreground">{user.email}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-6 py-8">
        {/* Stats */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <s.icon className={`h-6 w-6 ${s.color}`} />
                <span className="text-sm font-medium text-muted-foreground">{s.label}</span>
              </div>
              <p className="mt-2 text-3xl font-bold">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Recent appeals */}
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold">Recent Appeals</h2>
          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/30">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Title</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">User</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {recentAppeals?.map((a) => (
                  <tr key={a.id} className="hover:bg-muted/20">
                    <td className="px-4 py-3 font-medium">{a.title || "Untitled"}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {(Array.isArray(a.profiles)
                        ? (a.profiles[0] as { email?: string } | undefined)?.email
                        : (a.profiles as { email?: string } | null)?.email) ??
                        a.profile_id.substring(0, 8)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">{a.status}</span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(a.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent AI generations */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">Recent AI Generations</h2>
          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/30">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Provider</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Model</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Duration</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Success</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {recentGenerations?.map((g) => (
                  <tr key={g.id} className="hover:bg-muted/20">
                    <td className="px-4 py-3 font-medium">{g.provider}</td>
                    <td className="px-4 py-3 text-muted-foreground">{g.model}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {g.duration_ms ? `${(g.duration_ms / 1000).toFixed(1)}s` : "—"}
                    </td>
                    <td className="px-4 py-3">
                      {g.success ? (
                        <span className="text-emerald-500">✓</span>
                      ) : (
                        <span className="text-destructive">✗ {g.error_code}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
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
  );
}
