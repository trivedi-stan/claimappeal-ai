import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getStatusLabel, getStatusColor, formatDate } from "@/lib/utils";
import {
  ArrowLeft,
  FileText,
  History,
  Building2,
  AlertTriangle,
} from "lucide-react";

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
    <div className="mx-auto max-w-5xl space-y-8 animate-fade-in pb-16">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-1">
            <Link href="/dashboard" className="hover:text-foreground transition-colors">
              Appeals
            </Link>
            <span className="text-muted-foreground/60">/</span>
            <span className="text-foreground">Dossier #{id.substring(0, 8)}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
              {appeal.title || "Untitled Appeal Record"}
            </h1>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-mono font-medium ${getStatusColor(appeal.status)}`}>
              {getStatusLabel(appeal.status)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground font-mono mt-1">
            Created on {formatDate(appeal.created_at)}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <Link
            href={`/appeals/${id}/versions`}
            className="btn-secondary text-xs px-3.5 py-2 inline-flex items-center justify-center gap-1.5"
          >
            <History className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Versions ({appeal.appeal_versions?.length ?? 0})</span>
          </Link>

          {latestVersion ? (
            <Link
              href={`/appeals/${id}/review`}
              className="btn-primary text-xs px-4 py-2 inline-flex items-center justify-center gap-1.5 font-medium shadow-[0_0_20px_rgba(59,130,246,0.25)]"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Open Letterhead Draft</span>
            </Link>
          ) : (
            <Link
              href={`/appeals/new?id=${id}`}
              className="btn-primary text-xs px-4 py-2 inline-flex items-center justify-center gap-1.5 font-medium"
            >
              <span>Continue Intake</span>
            </Link>
          )}
        </div>
      </div>

      {/* Metric Highlights Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        <div className="cinematic-card p-4">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
            Disputed Amount
          </span>
          <span className="text-lg font-mono font-semibold text-red-500 dark:text-red-400 mt-1 block">
            {appeal.claim_information?.amount_denied
              ? `$${Number(appeal.claim_information.amount_denied).toLocaleString()}`
              : "N/A"}
          </span>
        </div>

        <div className="cinematic-card p-4">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
            Claim Identifier
          </span>
          <span className="text-sm font-mono font-medium text-foreground mt-1 block truncate">
            {appeal.claim_information?.claim_number || "Unspecified"}
          </span>
        </div>

        <div className="cinematic-card p-4">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
            Target Carrier
          </span>
          <span className="text-sm font-medium text-foreground mt-1 block truncate">
            {appeal.insurance_information?.company || "Unspecified"}
          </span>
        </div>

        <div className="cinematic-card p-4">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
            Service Date
          </span>
          <span className="text-sm font-mono font-medium text-foreground mt-1 block">
            {appeal.claim_information?.date_of_service
              ? formatDate(appeal.claim_information.date_of_service)
              : "Unspecified"}
          </span>
        </div>
      </div>

      {/* Dossier Detail Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Insurance */}
        <div className="cinematic-card p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Building2 className="h-4 w-4 text-primary" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Insurance Policy
            </h2>
          </div>
          {appeal.insurance_information ? (
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] font-mono uppercase text-muted-foreground block">Insurer</span>
                <span className="font-medium text-foreground">{appeal.insurance_information.company}</span>
              </div>
              {appeal.insurance_information.plan_type && (
                <div>
                  <span className="text-[10px] font-mono uppercase text-muted-foreground block">Plan Class</span>
                  <span className="text-muted-foreground">{appeal.insurance_information.plan_type}</span>
                </div>
              )}
              {appeal.insurance_information.member_id && (
                <div>
                  <span className="text-[10px] font-mono uppercase text-muted-foreground block">Member ID</span>
                  <span className="font-mono text-foreground">{appeal.insurance_information.member_id}</span>
                </div>
              )}
              {appeal.insurance_information.group_number && (
                <div>
                  <span className="text-[10px] font-mono uppercase text-muted-foreground block">Group #</span>
                  <span className="font-mono text-foreground">{appeal.insurance_information.group_number}</span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">No insurance data provided.</p>
          )}
        </div>

        {/* Claim */}
        <div className="cinematic-card p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <FileText className="h-4 w-4 text-emerald-500" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Claim & Provider
            </h2>
          </div>
          {appeal.claim_information ? (
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] font-mono uppercase text-muted-foreground block">Provider / Facility</span>
                <span className="font-medium text-foreground">
                  {appeal.claim_information.provider_name || "Unspecified"}
                </span>
              </div>
              {appeal.claim_information.claim_number && (
                <div>
                  <span className="text-[10px] font-mono uppercase text-muted-foreground block">Claim ID</span>
                  <span className="font-mono text-foreground">{appeal.claim_information.claim_number}</span>
                </div>
              )}
              {appeal.claim_information.cpt_codes?.length > 0 && (
                <div>
                  <span className="text-[10px] font-mono uppercase text-muted-foreground block">CPT Codes</span>
                  <span className="font-mono text-foreground">
                    {appeal.claim_information.cpt_codes.join(", ")}
                  </span>
                </div>
              )}
              {appeal.claim_information.amount_billed && (
                <div>
                  <span className="text-[10px] font-mono uppercase text-muted-foreground block">Billed Total</span>
                  <span className="font-mono text-foreground">${appeal.claim_information.amount_billed}</span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">No claim data recorded.</p>
          )}
        </div>

        {/* Denial */}
        <div className="cinematic-card p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Denial Grounds
            </h2>
          </div>
          {appeal.denial_information ? (
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] font-mono uppercase text-muted-foreground block">Denial Reason</span>
                <p className="text-foreground leading-relaxed font-medium">
                  {appeal.denial_information.denial_reason}
                </p>
              </div>
              {appeal.denial_information.denial_code && (
                <div>
                  <span className="text-[10px] font-mono uppercase text-muted-foreground block">Denial Code</span>
                  <span className="font-mono text-amber-600 dark:text-amber-400 font-semibold">{appeal.denial_information.denial_code}</span>
                </div>
              )}
              {appeal.denial_information.denial_date && (
                <div>
                  <span className="text-[10px] font-mono uppercase text-muted-foreground block">Denial Date</span>
                  <span className="font-mono text-foreground">
                    {formatDate(appeal.denial_information.denial_date)}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">No denial reason recorded.</p>
          )}
        </div>
      </div>
    </div>
  );
}
