"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Zap,
  User,
  Building2,
  FileText,
  AlertTriangle,
  HelpCircle,
  CheckCircle2,
} from "lucide-react";

const STEPS = [
  { label: "Basic Info", icon: User },
  { label: "Insurance", icon: Building2 },
  { label: "Claim", icon: FileText },
  { label: "Denial", icon: AlertTriangle },
  { label: "Supporting", icon: HelpCircle },
  { label: "Review", icon: CheckCircle2 },
  { label: "Generate", icon: Zap },
];

export default function NewAppealPage() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [appealId, setAppealId] = useState<string | null>(null);

  // Form state (all steps)
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
      }
    }
    createAppeal();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Autosave on step change
  const autoSave = useCallback(async () => {
    if (!appealId) return;
    setSaving(true);
    try {
      // Save step-specific data
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
      }
    } catch {
      // Silent save failure — don't interrupt the user
    } finally {
      setSaving(false);
    }
  }, [appealId, step, formData]);

  const goNext = async () => {
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
        toast.success("Appeal letter generated!");
        router.push(`/appeals/${appealId}/review`);
      } else {
        toast.error(result.error || "Failed to generate. Please try again.");
      }
    } catch {
      toast.error("We couldn't generate your appeal right now. Your information has been saved. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20";
  const labelClass = "mb-1.5 block text-sm font-medium";
  const requiredStar = <span className="text-destructive">*</span>;

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">New Appeal</h1>
        <p className="text-muted-foreground">
          Step {step + 1} of {STEPS.length}: {STEPS[step].label}
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-8 flex items-center gap-1">
        {STEPS.map((s, i) => (
          <div key={s.label} className="flex-1">
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i <= step ? "gradient-primary" : "bg-muted"
              }`}
            />
          </div>
        ))}
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        {/* Step 1: Basic Info */}
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Basic Information</h2>
            <div>
              <label className={labelClass}>Appeal Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => updateField("title", e.target.value)}
                className={inputClass}
                placeholder="e.g., MRI Denial Appeal - Jan 2025"
              />
            </div>
          </div>
        )}

        {/* Step 2: Insurance Info */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Insurance Information</h2>
            <div>
              <label className={labelClass}>Insurance Company {requiredStar}</label>
              <input type="text" value={formData.insurance_company}
                onChange={(e) => updateField("insurance_company", e.target.value)}
                className={inputClass} placeholder="e.g., Blue Cross Blue Shield" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Plan Type</label>
                <input type="text" value={formData.plan_type}
                  onChange={(e) => updateField("plan_type", e.target.value)}
                  className={inputClass} placeholder="e.g., PPO, HMO" />
              </div>
              <div>
                <label className={labelClass}>Member ID</label>
                <input type="text" value={formData.member_id}
                  onChange={(e) => updateField("member_id", e.target.value)}
                  className={inputClass} placeholder="Your member ID" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Group Number</label>
              <input type="text" value={formData.group_number}
                onChange={(e) => updateField("group_number", e.target.value)}
                className={inputClass} placeholder="Group number (if applicable)" />
            </div>
          </div>
        )}

        {/* Step 3: Claim Info */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Claim Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Claim Number</label>
                <input type="text" value={formData.claim_number}
                  onChange={(e) => updateField("claim_number", e.target.value)}
                  className={inputClass} placeholder="Claim #" />
              </div>
              <div>
                <label className={labelClass}>Date of Service</label>
                <input type="date" value={formData.date_of_service}
                  onChange={(e) => updateField("date_of_service", e.target.value)}
                  className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Provider Name</label>
              <input type="text" value={formData.provider_name}
                onChange={(e) => updateField("provider_name", e.target.value)}
                className={inputClass} placeholder="Doctor / facility name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>CPT Codes</label>
                <input type="text" value={formData.cpt_codes}
                  onChange={(e) => updateField("cpt_codes", e.target.value)}
                  className={inputClass} placeholder="e.g., 70553, 99213 (comma-separated)" />
              </div>
              <div>
                <label className={labelClass}>Diagnosis Codes (ICD-10)</label>
                <input type="text" value={formData.diagnosis_codes}
                  onChange={(e) => updateField("diagnosis_codes", e.target.value)}
                  className={inputClass} placeholder="e.g., M54.5, G89.4 (comma-separated)" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Amount Billed ($)</label>
                <input type="number" step="0.01" value={formData.amount_billed}
                  onChange={(e) => updateField("amount_billed", e.target.value)}
                  className={inputClass} placeholder="0.00" />
              </div>
              <div>
                <label className={labelClass}>Amount Denied ($)</label>
                <input type="number" step="0.01" value={formData.amount_denied}
                  onChange={(e) => updateField("amount_denied", e.target.value)}
                  className={inputClass} placeholder="0.00" />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Denial Info */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Denial Information</h2>
            <div>
              <label className={labelClass}>Denial Reason {requiredStar}</label>
              <textarea rows={3} value={formData.denial_reason}
                onChange={(e) => updateField("denial_reason", e.target.value)}
                className={inputClass} placeholder="Why was your claim denied? Copy from the denial letter if possible." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Denial Code</label>
                <input type="text" value={formData.denial_code}
                  onChange={(e) => updateField("denial_code", e.target.value)}
                  className={inputClass} placeholder="e.g., CO-50, PR-96" />
              </div>
              <div>
                <label className={labelClass}>Denial Date</label>
                <input type="date" value={formData.denial_date}
                  onChange={(e) => updateField("denial_date", e.target.value)}
                  className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Denial Description</label>
              <textarea rows={3} value={formData.denial_description}
                onChange={(e) => updateField("denial_description", e.target.value)}
                className={inputClass} placeholder="Any additional details from the denial letter..." />
            </div>
          </div>
        )}

        {/* Step 5: Supporting Info */}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Supporting Information</h2>
            <div>
              <label className={labelClass}>Medical Necessity Explanation</label>
              <textarea rows={4} value={formData.medical_necessity_explanation}
                onChange={(e) => updateField("medical_necessity_explanation", e.target.value)}
                className={inputClass} placeholder="Why is this treatment medically necessary? Include any relevant medical details." />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="prior_attempts"
                checked={formData.prior_appeal_attempts}
                onChange={(e) => updateField("prior_appeal_attempts", e.target.checked)}
                className="h-4 w-4 rounded border-input" />
              <label htmlFor="prior_attempts" className="text-sm font-medium">
                I have previously appealed this denial
              </label>
            </div>
            {formData.prior_appeal_attempts && (
              <div>
                <label className={labelClass}>Prior Appeal Details</label>
                <textarea rows={3} value={formData.prior_appeal_details}
                  onChange={(e) => updateField("prior_appeal_details", e.target.value)}
                  className={inputClass} placeholder="What happened with the previous appeal?" />
              </div>
            )}
            <div>
              <label className={labelClass}>Additional Notes</label>
              <textarea rows={3} value={formData.additional_notes}
                onChange={(e) => updateField("additional_notes", e.target.value)}
                className={inputClass} placeholder="Anything else relevant to your appeal..." />
            </div>
          </div>
        )}

        {/* Step 6: Review */}
        {step === 5 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Review Your Information</h2>
            <p className="text-sm text-muted-foreground">
              Review all details below before generating. You can go back to edit any section.
            </p>
            {[
              { label: "Insurance Company", value: formData.insurance_company },
              { label: "Plan Type", value: formData.plan_type },
              { label: "Member ID", value: formData.member_id },
              { label: "Claim Number", value: formData.claim_number },
              { label: "Date of Service", value: formData.date_of_service },
              { label: "Provider", value: formData.provider_name },
              { label: "Denial Reason", value: formData.denial_reason },
              { label: "Denial Code", value: formData.denial_code },
              { label: "Amount Denied", value: formData.amount_denied ? `$${formData.amount_denied}` : "" },
            ].map(
              (item) =>
                item.value && (
                  <div key={item.label} className="flex justify-between rounded-lg border bg-muted/30 px-4 py-3">
                    <span className="text-sm font-medium text-muted-foreground">{item.label}</span>
                    <span className="text-sm font-medium">{item.value}</span>
                  </div>
                )
            )}
          </div>
        )}

        {/* Step 7: Generate */}
        {step === 6 && (
          <div className="py-8 text-center">
            <Zap className="mx-auto mb-4 h-12 w-12 text-primary" />
            <h2 className="mb-2 text-xl font-bold">Ready to Generate</h2>
            <p className="mb-8 text-muted-foreground">
              ClaimAppeal AI will create a professional appeal letter based on your information.
            </p>
            <div className="mx-auto mb-6 max-w-sm rounded-lg border border-amber-200 bg-amber-50 p-4 text-left text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
              <p className="font-medium">⚠️ Important</p>
              <p>AI-generated draft — review all information and supporting documentation before submitting to your insurer.</p>
            </div>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="gradient-primary inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:brightness-110 disabled:opacity-50"
            >
              {generating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5" />
                  Generate Appeal Letter
                </>
              )}
            </button>
          </div>
        )}

        {/* Navigation buttons */}
        {step < 6 && (
          <div className="mt-6 flex items-center justify-between border-t pt-4">
            <button
              onClick={goBack}
              disabled={step === 0}
              className="flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
            <div className="flex items-center gap-3">
              {saving && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" /> Saving...
                </span>
              )}
              <button
                onClick={goNext}
                className="flex items-center gap-1 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:brightness-110"
              >
                {step === 5 ? "Continue to Generate" : "Next"} <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
