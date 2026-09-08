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
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  FileWarning,
  Copy,
  Check,
  ShieldCheck,
  FileText,
  Clock,
  Sparkles,
  ExternalLink,
  History,
} from "lucide-react";
import type { StructuredAppealOutput } from "@/types";

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
        toast.success("New version generated successfully.");
      } else {
        toast.error(result.error || "Failed to regenerate.");
      }
    } catch {
      toast.error("Failed to regenerate. Please try again.");
    } finally {
      setRegenerating(false);
    }
  }

  async function handleDownloadPdf() {
    setDownloading(true);
    try {
      const res = await fetch("/api/documents/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appealId,
          editedBody,
        }),
      });
      if (!res.ok) throw new Error("PDF generation failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `appeal-letter-${appealId.substring(0, 8)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Official PDF downloaded successfully.");
    } catch {
      toast.error("Failed to download PDF.");
    } finally {
      setDownloading(false);
    }
  }

  const handleCopy = () => {
    if (!editedBody) return;
    const fullText = `TO: ${output?.letter.recipient ?? ""}\nRE: ${output?.letter.subject ?? ""}\n\n${editedBody}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    toast.success("Letter copied to clipboard.");
    setTimeout(() => setCopied(false), 2000);
  };

  const wordCount = editedBody ? editedBody.trim().split(/\s+/).length : 0;
  const estReadTime = Math.ceil(wordCount / 200);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-28 space-y-4">
        <Loader2 className="h-7 w-7 animate-spin text-blue-500" />
        <p className="text-xs font-mono text-zinc-400">Loading appeal dossier & letterhead draft...</p>
      </div>
    );
  }

  if (!output) {
    return (
      <div className="mx-auto max-w-md py-20 text-center cinematic-card p-8">
        <FileWarning className="mx-auto h-10 w-10 text-zinc-500 mb-3" />
        <h2 className="text-base font-semibold text-zinc-200">No Draft Synthesized</h2>
        <p className="text-xs text-zinc-400 mt-1 mb-5">
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
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-white/[0.06] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-400 mb-1">
            <Link href="/dashboard" className="hover:text-zinc-200 transition-colors">
              Dashboard
            </Link>
            <span className="text-zinc-600">/</span>
            <Link href={`/appeals/${appealId}`} className="hover:text-zinc-200 transition-colors">
              Appeal #{appealId.substring(0, 8)}
            </Link>
            <span className="text-zinc-600">/</span>
            <span className="text-zinc-200">Letterhead Review</span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
              Review & Legal Rebuttal
            </h1>
            <span className="badge-cobalt">v{versionNumber}.0 Draft</span>
          </div>
        </div>

        {/* Global actions */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/appeals/${appealId}/versions`}
            className="btn-secondary text-xs px-3 py-2 inline-flex items-center gap-1.5"
          >
            <History className="h-3.5 w-3.5 text-zinc-400" />
            <span>Versions</span>
          </Link>

          <button
            onClick={handleCopy}
            className="btn-secondary text-xs px-3 py-2 inline-flex items-center gap-1.5"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-300">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-zinc-400" />
                <span>Copy Text</span>
              </>
            )}
          </button>

          <button
            onClick={handleRegenerate}
            disabled={regenerating}
            className="btn-secondary text-xs px-3 py-2 inline-flex items-center gap-1.5 disabled:opacity-40"
          >
            {regenerating ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-400" />
                <span>Synthesizing...</span>
              </>
            ) : (
              <>
                <RefreshCw className="h-3.5 w-3.5 text-zinc-400" />
                <span>Regenerate</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="btn-primary text-xs px-4 py-2 inline-flex items-center gap-1.5 font-medium shadow-[0_0_20px_rgba(59,130,246,0.25)] disabled:opacity-40"
          >
            {downloading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
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
      <div className="flex items-start gap-3 rounded-lg border border-amber-500/20 bg-amber-500/[0.04] p-3.5">
        <ShieldCheck className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-200/90 leading-relaxed">
          <span className="font-semibold text-amber-300">Clinical Verification: </span>
          Review the drafted statutory arguments and ensure dates, diagnosis codes, and treating provider names match your medical records. You may edit the letter directly below before generating the final PDF.
        </div>
      </div>

      {/* Main Dual-Pane Studio */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Document Editor / Letterhead Preview (7 cols on lg) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="cinematic-card p-6 md:p-8 space-y-6">
            {/* Letterhead Header Block */}
            <div className="border-b border-white/[0.08] pb-5 space-y-3">
              <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-zinc-500">
                <span>Formal Insurance Rebuttal</span>
                <span>ERISA § 503 Compliant</span>
              </div>

              <div className="rounded-lg bg-zinc-900/40 border border-white/[0.06] p-4 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 text-xs">
                  <span className="font-mono text-zinc-500 w-16 shrink-0 uppercase text-[10px]">To:</span>
                  <span className="font-semibold text-zinc-200">{output.letter.recipient}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 text-xs">
                  <span className="font-mono text-zinc-500 w-16 shrink-0 uppercase text-[10px]">Re:</span>
                  <span className="font-medium text-zinc-300 leading-relaxed">{output.letter.subject}</span>
                </div>
              </div>
            </div>

            {/* Editable Letter Body */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Appeal Letter Body
                </label>
                <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-500">
                  <span>{wordCount} words</span>
                  <span>·</span>
                  <span>~{estReadTime} min read</span>
                </div>
              </div>

              <textarea
                value={editedBody}
                onChange={(e) => setEditedBody(e.target.value)}
                rows={22}
                className="w-full rounded-lg border border-white/[0.08] bg-zinc-950/60 p-4 font-mono text-xs leading-relaxed text-zinc-200 transition-colors focus:border-blue-500/80 focus:bg-zinc-950 focus:outline-none focus:ring-1 focus:ring-blue-500/40"
                placeholder="Appeal letter content..."
              />
            </div>

            {/* Editor Footer / Autosave note */}
            <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 border-t border-white/[0.06]">
              <span className="flex items-center gap-1.5 font-mono text-[11px]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Edits automatically included in PDF export
              </span>
              <button
                onClick={handleDownloadPdf}
                disabled={downloading}
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1 font-medium"
              >
                Download PDF
                <ExternalLink className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Strategy & Clinical Dossier (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Legal Strategy */}
          <div className="cinematic-card p-5 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-500/10 text-blue-400">
                <Lightbulb className="h-3.5 w-3.5" />
              </div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
                Appeal Strategy
              </h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {output.appeal_strategy}
            </p>
          </div>

          {/* Key Arguments */}
          <div className="cinematic-card p-5 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
                Key Legal Arguments
              </h3>
            </div>
            <ul className="space-y-2">
              {output.key_arguments.map((arg, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-zinc-300">
                  <span className="font-mono text-emerald-400 text-[10px] mt-0.5 shrink-0">0{i + 1}.</span>
                  <span className="leading-relaxed">{arg}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Documents to Gather */}
          {output.supporting_information_needed.length > 0 && (
            <div className="cinematic-card p-5 space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500/10 text-amber-400">
                  <FileWarning className="h-3.5 w-3.5" />
                </div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
                  Required Exhibits
                </h3>
              </div>
              <p className="text-[11px] text-zinc-500">
                Attach these documents behind the signed letter before mailing or uploading:
              </p>
              <ul className="space-y-2">
                {output.supporting_information_needed.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-zinc-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400/80 mt-1.5 shrink-0" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Warnings */}
          {output.warnings.length > 0 && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/[0.04] p-5 space-y-3">
              <div className="flex items-center gap-2 text-red-400">
                <AlertTriangle className="h-4 w-4" />
                <h3 className="text-xs font-semibold uppercase tracking-wider">
                  Carrier Deadlines & Warnings
                </h3>
              </div>
              <ul className="space-y-2">
                {output.warnings.map((w, i) => (
                  <li key={i} className="text-xs text-red-200/90 leading-relaxed">
                    • {w}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
