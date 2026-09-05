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
} from "lucide-react";
import type { StructuredAppealOutput } from "@/types";

export default function ReviewPage() {
  const params = useParams();
  const router = useRouter();
  const appealId = params.id as string;
  const [output, setOutput] = useState<StructuredAppealOutput | null>(null);
  const [editedBody, setEditedBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    async function loadLatestVersion() {
      const supabase = createClient();
      const { data: versions } = await supabase
        .from("appeal_versions")
        .select("structured_output, edited_content")
        .eq("appeal_id", appealId)
        .order("version_number", { ascending: false })
        .limit(1);

      if (versions?.[0]?.structured_output) {
        const parsed = versions[0].structured_output as StructuredAppealOutput;
        setOutput(parsed);
        setEditedBody(versions[0].edited_content || parsed.letter.body);
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
        toast.success("New version generated!");
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
      toast.success("PDF downloaded!");
    } catch {
      toast.error("Failed to download PDF.");
    } finally {
      setDownloading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!output) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">No generated letter found.</p>
        <Link href={`/appeals/${appealId}`} className="mt-4 inline-block text-primary hover:underline">
          Back to appeal
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <Link href={`/appeals/${appealId}`}
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Appeal
      </Link>

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Review & Edit</h1>
        <div className="flex items-center gap-2">
          <button onClick={handleRegenerate} disabled={regenerating}
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent disabled:opacity-50">
            {regenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Regenerate
          </button>
          <button onClick={handleDownloadPdf} disabled={downloading}
            className="gradient-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-110 disabled:opacity-50">
            {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Download PDF
          </button>
        </div>
      </div>

      {/* AI disclaimer */}
      <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
        <p className="font-medium">⚠️ AI-generated draft — review all information and supporting documentation before submitting.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main letter editor */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="mb-4 space-y-1">
              <p className="text-sm text-muted-foreground">To: <span className="font-medium text-foreground">{output.letter.recipient}</span></p>
              <p className="text-sm text-muted-foreground">Re: <span className="font-medium text-foreground">{output.letter.subject}</span></p>
            </div>
            <textarea
              value={editedBody}
              onChange={(e) => setEditedBody(e.target.value)}
              rows={20}
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm leading-relaxed focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20 font-mono"
            />
          </div>
        </div>

        {/* Sidebar: strategy, arguments, warnings */}
        <div className="space-y-4">
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h3 className="mb-2 flex items-center gap-2 font-semibold">
              <Lightbulb className="h-4 w-4 text-primary" /> Strategy
            </h3>
            <p className="text-sm text-muted-foreground">{output.appeal_strategy}</p>
          </div>

          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h3 className="mb-2 flex items-center gap-2 font-semibold">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Key Arguments
            </h3>
            <ul className="space-y-1.5">
              {output.key_arguments.map((arg, i) => (
                <li key={i} className="text-sm text-muted-foreground">• {arg}</li>
              ))}
            </ul>
          </div>

          {output.supporting_information_needed.length > 0 && (
            <div className="rounded-xl border bg-card p-5 shadow-sm">
              <h3 className="mb-2 flex items-center gap-2 font-semibold">
                <FileWarning className="h-4 w-4 text-amber-500" /> Gather These Documents
              </h3>
              <ul className="space-y-1.5">
                {output.supporting_information_needed.map((item, i) => (
                  <li key={i} className="text-sm text-muted-foreground">• {item}</li>
                ))}
              </ul>
            </div>
          )}

          {output.warnings.length > 0 && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 shadow-sm">
              <h3 className="mb-2 flex items-center gap-2 font-semibold text-destructive">
                <AlertTriangle className="h-4 w-4" /> Warnings
              </h3>
              <ul className="space-y-1.5">
                {output.warnings.map((w, i) => (
                  <li key={i} className="text-sm text-destructive/80">• {w}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
