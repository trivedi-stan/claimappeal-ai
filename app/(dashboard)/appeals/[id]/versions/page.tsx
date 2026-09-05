import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, FileText, Clock } from "lucide-react";

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
    <div className="animate-fade-in">
      <Link href={`/appeals/${id}`}
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Appeal
      </Link>

      <h1 className="mb-1 text-2xl font-bold">Version History</h1>
      <p className="mb-6 text-muted-foreground">{appeal.title}</p>

      {!versions || versions.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-muted/20 py-12 text-center">
          <Clock className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
          <p className="text-muted-foreground">No versions generated yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {versions.map((v) => (
            <div
              key={v.id}
              className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                  v{v.version_number}
                </div>
                <div>
                  <p className="font-medium">Version {v.version_number}</p>
                  <p className="text-xs text-muted-foreground">
                    Generated {formatDate(v.created_at)}
                  </p>
                </div>
              </div>
              <Link
                href={`/appeals/${id}/review`}
                className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium hover:bg-accent"
              >
                <FileText className="h-3.5 w-3.5" /> View
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
