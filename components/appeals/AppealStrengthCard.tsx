"use client";

import React, { useMemo } from "react";
import {
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  FileText,
  ChevronRight,
} from "lucide-react";
import { buildRebuttalMatrix, type RebuttalMatrixAnalysis } from "@/lib/ai/rebuttal-matrix";

interface AppealStrengthCardProps {
  denialReason?: string | null;
  denialCode?: string | null;
  denialDescription?: string | null;
  medicalNecessityExplanation?: string | null;
  cptCodes?: string | string[] | null;
  diagnosisCodes?: string | string[] | null;
  additionalNotes?: string | null;
  onAddressMissing?: () => void;
  className?: string;
}

export function AppealStrengthCard({
  denialReason = "",
  denialCode = "",
  denialDescription = "",
  medicalNecessityExplanation = "",
  cptCodes = "",
  diagnosisCodes = "",
  additionalNotes = "",
  onAddressMissing,
  className = "",
}: AppealStrengthCardProps) {
  const analysis: RebuttalMatrixAnalysis = useMemo(() => {
    const safeDenialReason = denialReason || "";
    const safeDenialCode = denialCode || "";
    const safeDenialDesc = denialDescription || "";
    const safeMedEx = medicalNecessityExplanation || "";
    const safeNotes = additionalNotes || "";

    const parsedCpt = Array.isArray(cptCodes)
      ? cptCodes
      : (cptCodes || "").split(",").map((s) => s.trim()).filter(Boolean);
    const parsedDiagnosis = Array.isArray(diagnosisCodes)
      ? diagnosisCodes
      : (diagnosisCodes || "").split(",").map((s) => s.trim()).filter(Boolean);

    return buildRebuttalMatrix({
      denialReason: safeDenialReason,
      denialCode: safeDenialCode,
      denialDescription: safeDenialDesc,
      medicalNecessityExplanation: safeMedEx,
      cptCodes: parsedCpt,
      diagnosisCodes: parsedDiagnosis,
      additionalNotes: safeNotes,
    });
  }, [
    denialReason,
    denialCode,
    denialDescription,
    medicalNecessityExplanation,
    cptCodes,
    diagnosisCodes,
    additionalNotes,
  ]);

  const hasMissing = analysis.criteria.some((c) => c.status !== "covered");

  return (
    <div
      className={`rounded-xl border border-white/[0.08] bg-zinc-900/60 overflow-hidden shadow-lg ${className}`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.06] bg-zinc-900/90 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-100">
              Appeal Strength &amp; Denial Matrix
            </h3>
            <p className="text-[11px] text-zinc-400">
              Evidence coverage mapped against standard carrier medical review criteria
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-[11px] font-medium px-2.5 py-1 rounded-full border ${
              analysis.strengthRating === "High"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                : analysis.strengthRating === "Moderate"
                ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                : "border-rose-500/30 bg-rose-500/10 text-rose-400"
            }`}
          >
            {analysis.strengthRating} Strength ({analysis.coverageCount}/{analysis.totalCount} Criteria)
          </span>
        </div>
      </div>

      {/* Criterion-to-Evidence Matrix Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/[0.06] bg-zinc-950/40 text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              <th className="py-2.5 px-4 sm:px-5">Denial Criterion Required</th>
              <th className="py-2.5 px-4 sm:px-5">Clinical Evidence Detected</th>
              <th className="py-2.5 px-4 sm:px-5 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {analysis.criteria.map((c) => (
              <tr
                key={c.id}
                className="hover:bg-white/[0.02] transition-colors"
              >
                <td className="py-3 px-4 sm:px-5 font-medium text-zinc-200">
                  {c.criterion}
                </td>
                <td className="py-3 px-4 sm:px-5 text-zinc-400">
                  {c.evidence ? (
                    <span className="text-zinc-300 font-mono text-[11px] bg-zinc-800/60 px-2 py-0.5 rounded border border-white/[0.05] inline-block max-w-md truncate">
                      {c.evidence}
                    </span>
                  ) : (
                    <span className="text-zinc-500 italic text-[11px]">
                      Not yet provided in intake
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 sm:px-5 text-right">
                  {c.status === "covered" ? (
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Covered
                    </span>
                  ) : c.status === "partial" ? (
                    <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 font-medium">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      Partial
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] text-zinc-500 font-medium">
                      <AlertCircle className="h-3.5 w-3.5" />
                      Missing
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Synthesis Insight & Potential Improvements */}
      <div className="border-t border-white/[0.06] bg-zinc-950/40 p-4 sm:p-5 space-y-3.5">
        <div className="flex items-start gap-2.5 text-xs text-zinc-300 leading-relaxed">
          <Lightbulb className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
          <span>
            <strong className="text-zinc-100 font-semibold">Why this matters: </strong>
            {analysis.clinicalSummary}
          </span>
        </div>

        {analysis.potentialImprovements.length > 0 && (
          <div className="rounded-lg border border-white/[0.06] bg-zinc-900/40 p-3 sm:p-3.5 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-1.5">
              <FileText className="h-3 w-3 text-amber-400" />
              Recommended Exhibits &amp; High-Value Additions
            </span>
            <ul className="space-y-1.5">
              {analysis.potentialImprovements.map((imp, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-xs text-zinc-400"
                >
                  <span className="text-amber-400 font-bold">·</span>
                  <span>{imp}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {hasMissing && onAddressMissing && (
          <div className="pt-1 flex items-center justify-between">
            <span className="text-[11px] text-zinc-500">
              Have additional details from your medical records?
            </span>
            <button
              type="button"
              onClick={onAddressMissing}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1 transition-colors"
            >
              Add Clinical Details
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
