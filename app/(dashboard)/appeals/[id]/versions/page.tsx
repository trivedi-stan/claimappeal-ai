import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, FileText, Clock, ChevronRight, History } from "lucide-react";

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
      <div className="border-b border-white/[0.06] pb-5">
        <div className="flex items-center gap-2 text-xs font-medium text-zinc-400 mb-1">
          <Link href="/dashboard" className="hover:text-zinc-200 transition-colors">
            Appeals
          </Link>
          <span className="text-zinc-600">/</span>
          <Link href={`/appeals/${id}`} className="hover:text-zinc-200 transition-colors">
            {appeal.title || "Appeal"}
          </Link>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-200">Version History</span>
        </div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
            Synthesis Revision Log
          </h1>
          <span className="badge-neutral">
            {versions?.length ?? 0} {versions?.length === 1 ? "iteration" : "iterations"}
          </span>
        </div>
        <p className="text-xs text-zinc-400 mt-1">
          Every generated letter iteration is cryptographically timestamped and preserved for legal auditability.
        </p>
      </div>

      {!versions || versions.length === 0 ? (
        <div className="cinematic-card p-12 text-center space-y-3">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800/80 text-zinc-500">
            <Clock className="h-5 w-5" />
          </div>
          <h2 className="text-sm font-medium text-zinc-200">No Revisions Synthesized</h2>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            This appeal has not had an AI rebuttal generated yet.
          </p>
          <div className="pt-2">
            <Link href={`/appeals/new`} className="btn-primary text-xs px-4 py-2 inline-flex items-center gap-1.5">
              Launch Intake Protocol
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {versions.map((v, index) => (
            <div
              key={v.id}
              className="cinematic-card p-4 flex items-center justify-between transition-all duration-200 hover:border-white/[0.15]"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-xs font-mono font-bold text-blue-400 border border-blue-500/20">
                  v{v.version_number}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-zinc-200">
                      Iteration {v.version_number}.0
                    </span>
                    {index === 0 && (
                      <span className="badge-cobalt text-[10px] py-0 px-1.5">Latest</span>
                    )}
                  </div>
                  <span className="text-xs font-mono text-zinc-500 mt-0.5 block">
                    Generated on {formatDate(v.created_at)}
                  </span>
                </div>
              </div>

              <Link
                href={`/appeals/${id}/review`}
                className="btn-secondary text-xs px-3 py-1.5 inline-flex items-center gap-1.5"
              >
                <FileText className="h-3 w-3 text-zinc-400" />
                <span>Open in Studio</span>
                <ChevronRight className="h-3 w-3 text-zinc-500 ml-0.5" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
