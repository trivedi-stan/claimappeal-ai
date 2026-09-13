import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { FileText, Clock, ChevronRight } from "lucide-react";

export default async function VersionHistoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Verify ownership
  const { data: appeal } = await supabase
    .from("appeals")
    .select("id, title, profile_id")
    .eq("id", id)
    .single();
  if (!appeal || appeal.profile_id !== user.id) notFound();

  // Get all versions
  const { data: versions } = await supabase
    .from("appeal_versions")
    .select("id, version_number, created_at")
    .eq("appeal_id", id)
    .order("version_number", { ascending: false });

  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-fade-in pb-16">
      <div className="border-b border-border pb-5">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-1">
          <Link href="/dashboard" className="hover:text-foreground transition-colors">
            Appeals
          </Link>
          <span className="text-muted-foreground/60">/</span>
          <Link href={`/appeals/${id}`} className="hover:text-foreground transition-colors">
            {appeal.title || "Appeal"}
          </Link>
          <span className="text-muted-foreground/60">/</span>
          <span className="text-foreground">Version History</span>
        </div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Synthesis Revision Log
          </h1>
          <span className="badge-neutral">
            {versions?.length ?? 0} {versions?.length === 1 ? "iteration" : "iterations"}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Every generated letter iteration is cryptographically timestamped and preserved for legal auditability.
        </p>
      </div>

      {!versions || versions.length === 0 ? (
        <div className="cinematic-card p-12 text-center space-y-3">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
            <Clock className="h-5 w-5" />
          </div>
          <h2 className="text-sm font-medium text-foreground">No Revisions Synthesized</h2>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            This appeal has not had an AI rebuttal generated yet.
          </p>
          <div className="pt-2">
            <Link href={`/appeals/new?id=${id}`} className="btn-primary text-xs px-4 py-2 inline-flex items-center gap-1.5">
              Launch Intake Protocol
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {versions.map((v, index) => (
            <div
              key={v.id}
              className="cinematic-card p-4 flex items-center justify-between transition-all duration-200 hover:border-primary/40"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-xs font-mono font-bold text-primary border border-primary/20">
                  v{v.version_number}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      Iteration {v.version_number}.0
                    </span>
                    {index === 0 && (
                      <span className="badge-cobalt text-[10px] py-0 px-1.5">Latest</span>
                    )}
                  </div>
                  <span className="text-xs font-mono text-muted-foreground mt-0.5 block">
                    Generated on {formatDate(v.created_at)}
                  </span>
                </div>
              </div>

              <Link
                href={`/appeals/${id}/review`}
                className="btn-secondary text-xs px-3 py-1.5 inline-flex items-center gap-1.5"
              >
                <FileText className="h-3 w-3 text-muted-foreground" />
                <span>Open in Studio</span>
                <ChevronRight className="h-3 w-3 text-muted-foreground ml-0.5" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
