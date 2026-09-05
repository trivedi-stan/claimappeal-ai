import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getStatusLabel, getStatusColor, formatDate } from "@/lib/utils";
import { ArrowLeft, FileText, Zap, History, Download } from "lucide-react";

export default async function AppealDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: appeal } = await supabase
    .from("appeals")
    .select(`
      *,
      insurance_information(*),
      claim_information(*),
      denial_information(*),
      appeal_versions(id, version_number, created_at)
    `)
    .eq("id", id)
    .single();

  if (!appeal) notFound();

  const latestVersion = appeal.appeal_versions
    ?.sort((a: { version_number: number }, b: { version_number: number }) => b.version_number - a.version_number)[0];

  return (
    <div className="animate-fade-in">
      <Link href="/dashboard" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
      </Link>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{appeal.title || "Untitled Appeal"}</h1>
          <div className="mt-1 flex items-center gap-3">
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(appeal.status)}`}>
              {getStatusLabel(appeal.status)}
            </span>
            <span className="text-sm text-muted-foreground">Created {formatDate(appeal.created_at)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {latestVersion && (
            <Link
              href={`/appeals/${id}/review`}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:brightness-110"
            >
              <FileText className="h-4 w-4" /> View Letter
            </Link>
          )}
          <Link
            href={`/appeals/${id}/versions`}
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            <History className="h-4 w-4" /> Versions ({appeal.appeal_versions?.length ?? 0})
          </Link>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {appeal.insurance_information && (
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Insurance</h3>
            <p className="font-medium">{appeal.insurance_information.company}</p>
            {appeal.insurance_information.plan_type && <p className="text-sm text-muted-foreground">{appeal.insurance_information.plan_type}</p>}
            {appeal.insurance_information.member_id && <p className="text-sm text-muted-foreground">Member: {appeal.insurance_information.member_id}</p>}
          </div>
        )}
        {appeal.claim_information && (
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Claim</h3>
            {appeal.claim_information.claim_number && <p className="font-medium">Claim #{appeal.claim_information.claim_number}</p>}
            {appeal.claim_information.date_of_service && <p className="text-sm text-muted-foreground">Service: {formatDate(appeal.claim_information.date_of_service)}</p>}
            {appeal.claim_information.amount_denied && <p className="text-sm font-medium text-destructive">Denied: ${appeal.claim_information.amount_denied}</p>}
          </div>
        )}
        {appeal.denial_information && (
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Denial</h3>
            <p className="font-medium">{appeal.denial_information.denial_reason}</p>
            {appeal.denial_information.denial_code && <p className="text-sm text-muted-foreground">Code: {appeal.denial_information.denial_code}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
