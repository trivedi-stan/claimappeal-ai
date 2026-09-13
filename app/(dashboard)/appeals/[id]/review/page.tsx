"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import {
  ArrowLeft,
  Download,
  RefreshCw,
  Loader2,
  CheckCircle2,
  Lightbulb,
  FileWarning,
  Copy,
  Check,
  ShieldCheck,
  ExternalLink,
  History,
} from "lucide-react";
import PuppyLoader from "@/components/PuppyLoader";
import { AppealStrengthCard } from "@/components/appeals/AppealStrengthCard";
import type { StructuredAppealOutput, Appeal } from "@/types";

export default function ReviewPage() {
  const params = useParams();
  const router = useRouter();
  const appealId = params.id as string;
  const [output, setOutput] = useState<StructuredAppealOutput | null>(null);
  const [editedBody, setEditedBody] = useState("");
  const [versionNumber, setVersionNumber] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [appealData, setAppealData] = useState<Appeal | null>(null);

  useEffect(() => {
    async function loadLatestVersion() {
      const supabase = createClient();
      const { data: versions } = await supabase
        .from("appeal_versions")
        .select("version_number, structured_output, edited_content")
        .eq("appeal_id", appealId)
        .order("version_number", { ascending: false })
        .limit(1);

      if (versions?.[0]?.structured_output) {
        const parsed = versions[0].structured_output as StructuredAppealOutput;
        setOutput(parsed);
        setEditedBody(versions[0].edited_content || parsed.letter.body);
        setVersionNumber(versions[0].version_number || 1);
      }

      // Load appeal case parameters for strength analysis card
      try {
        const res = await fetch(`/api/appeals/${appealId}`);
        const result = await res.json();
        if (result.success && result.data) {
          setAppealData(result.data);
        }
      } catch {
        // Silent fallback
      }

      setLoading(false);
    }
    loadLatestVersion();
  }, [appealId]);

  async function handleRegenerate() {
    setRegenerating(true);
    try {
      const res = await fetch(`/api/appeals/${appealId}/generate`, { method: "POST" });
      const result = await res.json();
      if (result.success) {
        setOutput(result.data.output);
        setEditedBody(result.data.output.letter.body);
        setVersionNumber((prev) => prev + 1);
        toast.success(`Generated version ${versionNumber + 1}.0`);
      } else {
        toast.error(result.error || "Regeneration failed.");
      }
    } catch {
      toast.error("Network error during regeneration.");
    } finally {
      setRegenerating(false);
    }
  }

  async function handleSaveEdits() {
    try {
      await fetch(`/api/appeals/${appealId}/save-edits`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ edited_content: editedBody }),
      });
    } catch {
      // Background save error handled silently
    }
  }

  async function handleDownloadPdf() {
    setDownloading(true);
    try {
      await handleSaveEdits();
      const res = await fetch("/api/documents/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appealId, editedBody }),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || "Failed to generate PDF.");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Appeal_Letter_${appealId.substring(0, 8)}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Official Letterhead PDF exported.");
    } catch {
      toast.error("Download failed. Please try again.");
    } finally {
      setDownloading(false);
    }
  }

  function handleCopy() {
    if (!editedBody) return;
    navigator.clipboard.writeText(editedBody);
    setCopied(true);
    toast.success("Appeal letter copied to clipboard.");
    setTimeout(() => setCopied(false), 2000);
  }

  const wordCount = editedBody ? editedBody.trim().split(/\s+/).length : 0;
  const estReadTime = Math.ceil(wordCount / 200);

  if (loading) {
    return (
      <PuppyLoader
        title="Loading Appeal Dossier"
        subtitle="Retrieving letterhead draft and clinical citations..."
        size="fullscreen"
      />
    );
  }

  if (!output) {
    return (
      <div className="mx-auto max-w-md py-20 text-center cinematic-card p-8">
        <FileWarning className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
        <h2 className="text-base font-semibold text-foreground">No Draft Synthesized</h2>
        <p className="text-xs text-muted-foreground mt-1 mb-5">
          No generated appeal letter found for this record. Return to the intake protocol to synthesize a draft.
        </p>
        <Link
          href={`/appeals/${appealId}`}
          className="btn-primary text-xs px-4 py-2 inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Return to Appeal Record
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Top Navigation & Action Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-1">
            <Link href="/dashboard" className="hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <span className="text-muted-foreground/60">/</span>
            <Link href={`/appeals/${appealId}`} className="hover:text-foreground transition-colors">
              Appeal #{appealId.substring(0, 8)}
            </Link>
            <span className="text-muted-foreground/60">/</span>
            <span className="text-foreground">Letterhead Review</span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Review & Legal Rebuttal
            </h1>
            <span className="badge-cobalt">v{versionNumber}.0 Draft</span>
          </div>
        </div>

        {/* Global actions */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full lg:w-auto">
          <Link
            href={`/appeals/${appealId}/versions`}
            className="btn-secondary text-xs px-3 py-2.5 inline-flex items-center justify-center gap-1.5 min-h-[40px]"
          >
            <History className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Versions</span>
          </Link>

          <button
            onClick={handleCopy}
            className="btn-secondary text-xs px-3 py-2.5 inline-flex items-center justify-center gap-1.5 min-h-[40px]"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Copy Text</span>
              </>
            )}
          </button>

          <button
            onClick={handleRegenerate}
            disabled={regenerating}
            className="btn-secondary text-xs px-3 py-2.5 inline-flex items-center justify-center gap-1.5 min-h-[40px] disabled:opacity-40"
          >
            {regenerating ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                <span>Synthesizing...</span>
              </>
            ) : (
              <>
                <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Regenerate</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="btn-primary text-xs px-4 py-2.5 inline-flex items-center justify-center gap-1.5 font-medium min-h-[40px] shadow-[0_0_20px_rgba(59,130,246,0.25)] disabled:opacity-40"
          >
            {downloading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary-foreground" />
                <span>Building PDF...</span>
              </>
            ) : (
              <>
                <Download className="h-3.5 w-3.5" />
                <span>Export PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Advisory Callout */}
      <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3.5">
        <ShieldCheck className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 dark:text-amber-200/90 leading-relaxed">
          <span className="font-semibold text-amber-950 dark:text-amber-300">Clinical Verification: </span>
          Review the drafted statutory arguments and ensure dates, diagnosis codes, and treating provider names match your medical records. You may edit the letter directly below before generating the final PDF.
        </div>
      </div>

      {/* Main Dual-Pane Studio */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Document Editor / Letterhead Preview (7 cols on lg) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="cinematic-card p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6">
            {/* Letterhead Header Block */}
            <div className="border-b border-border pb-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                <span>Formal Insurance Rebuttal</span>
                <span>ERISA § 503 Compliant</span>
              </div>

              <div className="rounded-lg bg-muted/40 border border-border p-3 sm:p-4 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 text-xs">
                  <span className="font-mono text-muted-foreground w-16 shrink-0 uppercase text-[10px]">To:</span>
                  <span className="font-semibold text-foreground break-words">{output.letter.recipient}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 text-xs">
                  <span className="font-mono text-muted-foreground w-16 shrink-0 uppercase text-[10px]">Re:</span>
                  <span className="font-medium text-foreground/90 leading-relaxed break-words">{output.letter.subject}</span>
                </div>
              </div>
            </div>

            {/* Editable Letter Body */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Appeal Letter Body
                </label>
                <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] font-mono text-muted-foreground">
                  <span>{wordCount} words</span>
                  <span>·</span>
                  <span>~{estReadTime} min read</span>
                </div>
              </div>

              <textarea
                value={editedBody}
                onChange={(e) => setEditedBody(e.target.value)}
                rows={14}
                className="w-full min-h-[300px] sm:min-h-[440px] rounded-lg border border-border bg-card p-3.5 sm:p-4 font-mono text-xs leading-relaxed text-foreground transition-colors focus:border-primary focus:bg-background focus:outline-none focus:ring-1 focus:ring-primary/40"
                placeholder="Appeal letter content..."
              />
            </div>

            {/* Editor Footer / Autosave note */}
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
              <span className="flex items-center gap-1.5 font-mono text-[11px]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Edits automatically included in PDF export
              </span>
              <button
                onClick={handleDownloadPdf}
                disabled={downloading}
                className="text-xs text-primary hover:underline transition-colors inline-flex items-center gap-1 font-medium"
              >
                Download PDF
                <ExternalLink className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Strategy & Clinical Dossier (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Denial Matrix & Appeal Strength Analysis */}
          <AppealStrengthCard
            denialReason={appealData?.denial_information?.denial_reason}
            denialCode={appealData?.denial_information?.denial_code}
            denialDescription={appealData?.denial_information?.denial_description}
            medicalNecessityExplanation={
              (appealData as unknown as { supporting_info?: { medical_necessity_explanation?: string } })
                ?.supporting_info?.medical_necessity_explanation
            }
            cptCodes={appealData?.claim_information?.cpt_codes ?? []}
            diagnosisCodes={appealData?.claim_information?.diagnosis_codes ?? []}
            additionalNotes={
              (appealData as unknown as { supporting_info?: { additional_notes?: string } })
                ?.supporting_info?.additional_notes
            }
          />

          {/* Legal Strategy */}
          <div className="cinematic-card p-5 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Lightbulb className="h-3.5 w-3.5" />
              </div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Appeal Strategy
              </h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {output.appeal_strategy}
            </p>
          </div>

          {/* Key Arguments */}
          <div className="cinematic-card p-5 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-500">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Key Legal Arguments
              </h3>
            </div>
            <ul className="space-y-2">
              {output.key_arguments.map((arg, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-foreground/90">
                  <span className="font-mono text-emerald-500 text-[10px] mt-0.5 shrink-0">0{i + 1}.</span>
                  <span className="leading-relaxed">{arg}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Documents to Gather */}
          {output.supporting_information_needed.length > 0 && (
            <div className="cinematic-card p-5 space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500/10 text-amber-500">
                  <FileWarning className="h-3.5 w-3.5" />
                </div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                  Required Exhibits
                </h3>
              </div>
              <ul className="space-y-2">
                {output.supporting_information_needed.map((doc, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-foreground/90">
                    <span className="text-amber-500 shrink-0">·</span>
                    <span className="leading-relaxed">{doc}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Regeneration Modal */}
      {regenerating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="cinematic-card p-6 max-w-sm w-full border border-emerald-500/20 bg-card shadow-2xl rounded-2xl">
            <PuppyLoader
              title="Synthesizing Appeal Letter"
              subtitle="Integrating updated guidelines and statutory citations..."
              size="md"
            />
          </div>
        </div>
      )}
    </div>
  );
}
