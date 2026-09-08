"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Sparkles,
  User,
  Building2,
  FileText,
  AlertTriangle,
  HelpCircle,
  CheckCircle2,
  Check,
  ShieldAlert,
  Scale,
  Clock,
  ArrowUpRight,
} from "lucide-react";

const STEPS = [
  { id: "basic", label: "Basic Info", icon: User, caption: "Appeal identifier" },
  { id: "insurance", label: "Insurance", icon: Building2, caption: "Policy & coverage" },
  { id: "claim", label: "Claim Details", icon: FileText, caption: "Codes & billed charges" },
  { id: "denial", label: "Denial Reason", icon: AlertTriangle, caption: "Carrier rationale" },
  { id: "supporting", label: "Clinical Context", icon: HelpCircle, caption: "Medical necessity" },
  { id: "review", label: "Intake Review", icon: CheckCircle2, caption: "Verify parameters" },
  { id: "generate", label: "Synthesize", icon: Sparkles, caption: "Legal generation" },
];

export default function NewAppealPage() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [appealId, setAppealId] = useState<string | null>(null);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  // Form state (all steps preserved 100%)
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    title: "",
    // Step 2: Insurance
    insurance_company: "",
    plan_type: "",
    member_id: "",
    group_number: "",
    // Step 3: Claim
    claim_number: "",
    date_of_service: "",
    provider_name: "",
    provider_npi: "",
    cpt_codes: "",
    diagnosis_codes: "",
    amount_billed: "",
    amount_denied: "",
    // Step 4: Denial
    denial_reason: "",
    denial_code: "",
    denial_description: "",
    denial_date: "",
    // Step 5: Supporting
    medical_necessity_explanation: "",
    additional_notes: "",
    prior_appeal_attempts: false,
    prior_appeal_details: "",
  });

  const updateField = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Create appeal on first load
  useEffect(() => {
    async function createAppeal() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const res = await fetch("/api/appeals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "New Appeal" }),
      });
      const result = await res.json();
      if (result.success) {
        setAppealId(result.data.id);
        setLastSavedTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      }
    }
    createAppeal();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Autosave on step change
  const autoSave = useCallback(async () => {
    if (!appealId) return;
    setSaving(true);
    try {
      if (step >= 1) {
        await fetch(`/api/appeals/${appealId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formData.title || "Untitled Appeal",
            insurance: {
              company: formData.insurance_company,
              plan_type: formData.plan_type || null,
              member_id: formData.member_id || null,
              group_number: formData.group_number || null,
            },
            claim: {
              claim_number: formData.claim_number || null,
              date_of_service: formData.date_of_service || null,
              provider_name: formData.provider_name || null,
              cpt_codes: formData.cpt_codes ? formData.cpt_codes.split(",").map((s) => s.trim()) : [],
              diagnosis_codes: formData.diagnosis_codes ? formData.diagnosis_codes.split(",").map((s) => s.trim()) : [],
              amount_billed: formData.amount_billed ? parseFloat(formData.amount_billed) : null,
              amount_denied: formData.amount_denied ? parseFloat(formData.amount_denied) : null,
            },
            denial: {
              denial_reason: formData.denial_reason,
              denial_code: formData.denial_code || null,
              denial_description: formData.denial_description || null,
              denial_date: formData.denial_date || null,
            },
            supporting: {
              medical_necessity_explanation: formData.medical_necessity_explanation || null,
              additional_notes: formData.additional_notes || null,
              prior_appeal_attempts: formData.prior_appeal_attempts,
              prior_appeal_details: formData.prior_appeal_details || null,
            },
          }),
        });
        setLastSavedTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      }
    } catch {
      // Silent save failure — don't interrupt the user
    } finally {
      setSaving(false);
    }
  }, [appealId, step, formData]);

  const goNext = async () => {
    // Validate required fields per step
    if (step === 1 && !formData.insurance_company.trim()) {
      toast.error("Please enter the insurance company name to continue.");
      return;
    }
    if (step === 3 && !formData.denial_reason.trim()) {
      toast.error("Please specify the primary denial reason from your denial letter.");
      return;
    }

    await autoSave();
    if (step < STEPS.length - 1) setStep(step + 1);
  };

  const goBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleGenerate = async () => {
    if (!appealId) return;
    setGenerating(true);
    try {
      await autoSave();
      const res = await fetch(`/api/appeals/${appealId}/generate`, {
        method: "POST",
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Appeal letter generated successfully.");
        router.push(`/appeals/${appealId}/review`);
      } else {
        toast.error(result.error || "Failed to generate. Please check your inputs.");
      }
    } catch {
      toast.error("Unable to generate appeal letter. Your draft has been preserved. Please retry.");
    } finally {
      setGenerating(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-white/[0.08] bg-zinc-900/60 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 transition-colors focus:border-blue-500/80 focus:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-blue-500/40";
  const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-400";
  const helperClass = "mt-1.5 text-xs text-zinc-500";
  const requiredStar = <span className="text-red-400 ml-0.5">*</span>;

  return (
    <div className="mx-auto max-w-4xl space-y-8 animate-fade-in pb-16">
      {/* Header bar */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-white/[0.06] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
            <Link href="/dashboard" className="hover:text-zinc-200 transition-colors">
              Appeals
            </Link>
            <span className="text-zinc-600">/</span>
            <span className="text-zinc-200">Intake Protocol</span>
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-100">
            {formData.title ? formData.title : "New Denial Appeal"}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {saving ? (
            <span className="flex items-center gap-1.5 text-xs font-mono text-zinc-400">
              <Loader2 className="h-3 w-3 animate-spin text-blue-400" /> Syncing...
            </span>
          ) : lastSavedTime ? (
            <span className="flex items-center gap-1.5 text-xs font-mono text-zinc-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Draft saved {lastSavedTime}
            </span>
          ) : null}
        </div>
      </div>

      {/* Stepper Navigation (Linear / Raycast aesthetic) */}
      <div className="relative">
        {/* Desktop Step Matrix */}
        <div className="hidden lg:grid grid-cols-7 gap-2">
          {STEPS.map((s, idx) => {
            const isCompleted = idx < step;
            const isCurrent = idx === step;
            const Icon = s.icon;

            return (
              <button
                key={s.id}
                onClick={() => {
                  if (idx <= step) setStep(idx);
                }}
                disabled={idx > step}
                className={`group flex flex-col items-start rounded-lg border p-2.5 text-left transition-all duration-200 ${
                  isCurrent
                    ? "border-blue-500/40 bg-blue-500/[0.07] text-zinc-100 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                    : isCompleted
                    ? "border-white/[0.08] bg-zinc-900/40 text-zinc-300 hover:border-white/[0.15] hover:bg-zinc-900"
                    : "border-transparent bg-transparent text-zinc-600 opacity-60 cursor-not-allowed"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded text-[10px] font-mono font-bold ${
                      isCompleted
                        ? "bg-emerald-500/20 text-emerald-400"
                        : isCurrent
                        ? "bg-blue-500 text-white"
                        : "bg-zinc-800 text-zinc-500"
                    }`}
                  >
                    {isCompleted ? <Check className="h-3 w-3 stroke-[3]" /> : idx + 1}
                  </span>
                  <Icon
                    className={`h-3.5 w-3.5 ${
                      isCurrent ? "text-blue-400" : isCompleted ? "text-zinc-400" : "text-zinc-600"
                    }`}
                  />
                </div>
                <span className="text-xs font-medium leading-tight truncate w-full">
                  {s.label}
                </span>
                <span className="text-[10px] text-zinc-500 truncate w-full font-mono mt-0.5">
                  {s.caption}
                </span>
              </button>
            );
          })}
        </div>

        {/* Mobile / Tablet Progress Bar */}
        <div className="lg:hidden space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-zinc-300">
              Step {step + 1} of {STEPS.length}: {STEPS[step].label}
            </span>
            <span className="font-mono text-zinc-500 text-[11px]">{STEPS[step].caption}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Form Surface */}
      <div className="cinematic-card p-6 md:p-8 space-y-6">
        {/* Step 1: Basic Info */}
        {step === 0 && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-white/[0.06] pb-4">
              <span className="badge-cobalt mb-2 inline-flex">Step 01 / 07</span>
              <h2 className="text-lg font-semibold text-zinc-100">Appeal Reference</h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Assign an internal descriptive reference for tracking this appeal case file.
              </p>
            </div>

            <div>
              <label className={labelClass}>Appeal Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => updateField("title", e.target.value)}
                className={inputClass}
                placeholder="e.g., Lumbar MRI Denial Appeal — Aetna Plan #4902"
              />
              <p className={helperClass}>
                A clear title helps distinguish between multiple member claims or procedure rounds.
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Insurance Info */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-white/[0.06] pb-4">
              <span className="badge-cobalt mb-2 inline-flex">Step 02 / 07</span>
              <h2 className="text-lg font-semibold text-zinc-100">Insurance & Plan Specifics</h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Enter the target insurer details exactly as they appear on your member benefits card.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>Insurance Carrier {requiredStar}</label>
                <input
                  type="text"
                  value={formData.insurance_company}
                  onChange={(e) => updateField("insurance_company", e.target.value)}
                  className={inputClass}
                  placeholder="e.g., UnitedHealthcare, Blue Cross Blue Shield, Cigna, Aetna"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Plan Type</label>
                  <input
                    type="text"
                    value={formData.plan_type}
                    onChange={(e) => updateField("plan_type", e.target.value)}
                    className={inputClass}
                    placeholder="e.g., Commercial PPO, ERISA Self-Funded, HMO"
                  />
                  <p className={helperClass}>Helps cite ERISA § 503 vs state insurance mandates.</p>
                </div>

                <div>
                  <label className={labelClass}>Member / Subscriber ID</label>
                  <input
                    type="text"
                    value={formData.member_id}
                    onChange={(e) => updateField("member_id", e.target.value)}
                    className={inputClass}
                    placeholder="e.g., UHC-982341901"
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Group / Policy Number</label>
                <input
                  type="text"
                  value={formData.group_number}
                  onChange={(e) => updateField("group_number", e.target.value)}
                  className={inputClass}
                  placeholder="e.g., GRP-88029"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Claim Info */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-white/[0.06] pb-4">
              <span className="badge-cobalt mb-2 inline-flex">Step 03 / 07</span>
              <h2 className="text-lg font-semibold text-zinc-100">Claim Details & Codes</h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Billing figures, diagnostic ICD-10 identifiers, and procedural CPT codes.
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Claim Identifier</label>
                  <input
                    type="text"
                    value={formData.claim_number}
                    onChange={(e) => updateField("claim_number", e.target.value)}
                    className={inputClass}
                    placeholder="e.g., CLM-2025-08912"
                  />
                </div>

                <div>
                  <label className={labelClass}>Date of Service</label>
                  <input
                    type="date"
                    value={formData.date_of_service}
                    onChange={(e) => updateField("date_of_service", e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Treating Provider / Medical Facility</label>
                <input
                  type="text"
                  value={formData.provider_name}
                  onChange={(e) => updateField("provider_name", e.target.value)}
                  className={inputClass}
                  placeholder="e.g., Dr. Robert Vance, MD / Columbia Orthopedic Institute"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>CPT / HCPCS Procedure Codes</label>
                  <input
                    type="text"
                    value={formData.cpt_codes}
                    onChange={(e) => updateField("cpt_codes", e.target.value)}
                    className={inputClass}
                    placeholder="e.g., 70553, 99214, 29881 (comma-separated)"
                  />
                  <p className={helperClass}>Identifies the exact surgical or diagnostic code.</p>
                </div>

                <div>
                  <label className={labelClass}>Diagnosis Codes (ICD-10-CM)</label>
                  <input
                    type="text"
                    value={formData.diagnosis_codes}
                    onChange={(e) => updateField("diagnosis_codes", e.target.value)}
                    className={inputClass}
                    placeholder="e.g., M54.5, G89.4, M23.22 (comma-separated)"
                  />
                  <p className={helperClass}>Clinical rationale code proving medical condition.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Total Amount Billed ($)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-sm text-zinc-500 font-mono">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.amount_billed}
                      onChange={(e) => updateField("amount_billed", e.target.value)}
                      className={`${inputClass} pl-7 font-mono`}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Disputed Amount Denied ($)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-sm text-zinc-500 font-mono">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.amount_denied}
                      onChange={(e) => updateField("amount_denied", e.target.value)}
                      className={`${inputClass} pl-7 font-mono text-red-400`}
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Denial Info */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-white/[0.06] pb-4">
              <span className="badge-cobalt mb-2 inline-flex">Step 04 / 07</span>
              <h2 className="text-lg font-semibold text-zinc-100">Insurer Denial Details</h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Transcribe the denial reason directly from your Explanation of Benefits (EOB) or letter.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>Primary Denial Reason {requiredStar}</label>
                <textarea
                  rows={3}
                  value={formData.denial_reason}
                  onChange={(e) => updateField("denial_reason", e.target.value)}
                  className={inputClass}
                  placeholder="e.g., 'Service determined not medically necessary under Milliman Care Guidelines' or 'Pre-authorization was not secured prior to service'."
                />
                <p className={helperClass}>
                  This is the core argument the appeal rebuttal letter will methodically dismantle.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>EOB / CARC Denial Code</label>
                  <input
                    type="text"
                    value={formData.denial_code}
                    onChange={(e) => updateField("denial_code", e.target.value)}
                    className={inputClass}
                    placeholder="e.g., CO-50, PR-96, CO-197"
                  />
                </div>

                <div>
                  <label className={labelClass}>Date of Denial Notice</label>
                  <input
                    type="date"
                    value={formData.denial_date}
                    onChange={(e) => updateField("denial_date", e.target.value)}
                    className={inputClass}
                  />
                  <p className={helperClass}>Used to calculate your 180-day ERISA statutory appeal window.</p>
                </div>
              </div>

              <div>
                <label className={labelClass}>Carrier Explanatory Notes / Quoted Language</label>
                <textarea
                  rows={3}
                  value={formData.denial_description}
                  onChange={(e) => updateField("denial_description", e.target.value)}
                  className={inputClass}
                  placeholder="Paste any additional clinical bullet points or criteria cited in the denial letter..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Supporting Context */}
        {step === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-white/[0.06] pb-4">
              <span className="badge-cobalt mb-2 inline-flex">Step 05 / 07</span>
              <h2 className="text-lg font-semibold text-zinc-100">Clinical Justification & Evidence</h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Provide clinical history, conservative therapies failed, and treating physician rationale.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>Medical Necessity Explanation</label>
                <textarea
                  rows={4}
                  value={formData.medical_necessity_explanation}
                  onChange={(e) => updateField("medical_necessity_explanation", e.target.value)}
                  className={inputClass}
                  placeholder="Detail conservative treatments attempted (e.g., 6 weeks of physical therapy, NSAIDs, epidural injections), clinical deterioration, or peer-reviewed literature supporting this procedure."
                />
              </div>

              <div className="rounded-lg border border-white/[0.08] bg-zinc-900/40 p-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="prior_attempts"
                    checked={formData.prior_appeal_attempts}
                    onChange={(e) => updateField("prior_appeal_attempts", e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-blue-600 focus:ring-blue-500/30"
                  />
                  <div>
                    <label htmlFor="prior_attempts" className="text-sm font-medium text-zinc-200 cursor-pointer">
                      This is an escalated appeal (prior appeal was previously submitted)
                    </label>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Enable if this is a Level 2 internal appeal or an External Independent Review Request.
                    </p>
                  </div>
                </div>

                {formData.prior_appeal_attempts && (
                  <div className="mt-4 pt-3 border-t border-white/[0.06]">
                    <label className={labelClass}>Prior Appeal History & Outcome</label>
                    <textarea
                      rows={3}
                      value={formData.prior_appeal_details}
                      onChange={(e) => updateField("prior_appeal_details", e.target.value)}
                      className={inputClass}
                      placeholder="Detail date of previous appeal submission, reference number, and carrier's Level 1 response..."
                    />
                  </div>
                )}
              </div>

              <div>
                <label className={labelClass}>Additional Directives or Relevant Context</label>
                <textarea
                  rows={2}
                  value={formData.additional_notes}
                  onChange={(e) => updateField("additional_notes", e.target.value)}
                  className={inputClass}
                  placeholder="Any particular urgency, upcoming surgeries, or specific policy clauses to highlight..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Review Summary */}
        {step === 5 && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-white/[0.06] pb-4">
              <span className="badge-cobalt mb-2 inline-flex">Step 06 / 07</span>
              <h2 className="text-lg font-semibold text-zinc-100">Review Case Parameters</h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Verify that all captured parameters are accurate before handing over to the legal drafting engine.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: "Appeal Title", value: formData.title || "Untitled Appeal" },
                { label: "Target Carrier", value: formData.insurance_company },
                { label: "Plan Class", value: formData.plan_type || "Unspecified" },
                { label: "Member ID", value: formData.member_id || "Unspecified" },
                { label: "Claim Reference", value: formData.claim_number || "Unspecified" },
                { label: "Date of Service", value: formData.date_of_service || "Unspecified" },
                { label: "Treating Provider", value: formData.provider_name || "Unspecified" },
                { label: "CPT / Procedure Codes", value: formData.cpt_codes || "Unspecified" },
                { label: "Diagnosis (ICD-10)", value: formData.diagnosis_codes || "Unspecified" },
                { label: "Denial Code", value: formData.denial_code || "Unspecified" },
                {
                  label: "Disputed Amount",
                  value: formData.amount_denied ? `$${formData.amount_denied}` : "Unspecified",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col justify-center rounded-lg border border-white/[0.06] bg-zinc-900/30 px-3.5 py-2.5"
                >
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                    {item.label}
                  </span>
                  <span className="text-xs font-medium text-zinc-200 truncate mt-0.5">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="rounded-lg border border-white/[0.06] bg-zinc-900/30 p-4 space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                Primary Denial Reason to Rebut
              </span>
              <p className="text-xs text-zinc-200 leading-relaxed">
                {formData.denial_reason || "No denial reason provided."}
              </p>
            </div>
          </div>
        )}

        {/* Step 7: Ready to Generate */}
        {step === 6 && (
          <div className="space-y-6 animate-fade-in py-2">
            <div className="text-center max-w-lg mx-auto space-y-2">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.15)] mb-2">
                <Sparkles className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-semibold text-zinc-100 tracking-tight">
                Synthesize Formal Appeal Letter
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                ClaimAppeal AI will structure a statutory rebuttal tailored to{" "}
                <span className="text-zinc-200 font-medium">{formData.insurance_company || "your insurer"}</span>{" "}
                using standard clinical necessity frameworks.
              </p>
            </div>

            {/* Statutory Framework Checklist */}
            <div className="rounded-xl border border-white/[0.08] bg-zinc-900/50 p-5 space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold block">
                Verification Pipeline Ready
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="flex items-center gap-2 text-xs text-zinc-300">
                  <Scale className="h-4 w-4 text-blue-400 shrink-0" />
                  <span>ERISA § 503 & ACA § 2719</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-300">
                  <ShieldAlert className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Zero-Hallucination Guard</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-300">
                  <Clock className="h-4 w-4 text-purple-400 shrink-0" />
                  <span>180-Day Timeliness Citation</span>
                </div>
              </div>
            </div>

            {/* Disclaimer Callout */}
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/[0.05] p-4 text-left">
              <div className="flex items-start gap-2.5">
                <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-200/90 leading-relaxed">
                  <span className="font-semibold text-amber-300">Statutory Notice: </span>
                  This draft is synthesized from your inputs. Review the clinical narrative, attach your medical records, and verify citations before signing and submitting to your carrier.
                </div>
              </div>
            </div>

            {/* Generation CTA */}
            <div className="pt-2 flex flex-col items-center">
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="btn-primary w-full sm:w-auto px-8 py-3 text-sm font-semibold tracking-wide flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(59,130,246,0.3)] disabled:opacity-50"
              >
                {generating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    Synthesizing Letterhead Rebuttal...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Appeal Letter
                    <ArrowUpRight className="h-4 w-4 ml-1 opacity-70" />
                  </>
                )}
              </button>
              <p className="text-[11px] text-zinc-500 font-mono mt-3">
                Powered by Anthropic Claude 3.5 Sonnet · Average synthesis time ~8s
              </p>
            </div>
          </div>
        )}

        {/* Bottom Step Actions */}
        {step < 6 && (
          <div className="flex items-center justify-between border-t border-white/[0.06] pt-5 mt-6">
            <button
              onClick={goBack}
              disabled={step === 0}
              className="btn-secondary text-xs px-4 py-2 flex items-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Back
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={goNext}
                className="btn-primary text-xs px-5 py-2 flex items-center gap-1.5 font-medium"
              >
                {step === 5 ? "Proceed to Generation" : "Save & Continue"}
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
