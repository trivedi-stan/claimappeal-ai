/**
 * Core application types for ClaimAppeal AI.
 * These are the shared domain types used across client and server.
 */

import type { PlanId } from "@/config/plans";

// ============================================================
// Appeal Status
// ============================================================

export type AppealStatus =
  | "draft"
  | "in_progress"
  | "generated"
  | "submitted"
  | "approved"
  | "denied";

// ============================================================
// Database row types (mirroring Supabase schema)
// ============================================================

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Appeal {
  id: string;
  profile_id: string;
  status: AppealStatus;
  title: string | null;
  created_at: string;
  updated_at: string;
  // Joined relations (optional — present when fetched with joins)
  insurance_information?: InsuranceInformation | null;
  claim_information?: ClaimInformation | null;
  denial_information?: DenialInformation | null;
  appeal_versions?: AppealVersion[];
}

export interface InsuranceInformation {
  id: string;
  appeal_id: string;
  company: string;
  plan_type: string | null;
  member_id: string | null;
  group_number: string | null;
  created_at: string;
  updated_at: string;
}

export interface ClaimInformation {
  id: string;
  appeal_id: string;
  claim_number: string | null;
  date_of_service: string | null;
  provider_name: string | null;
  provider_npi: string | null;
  cpt_codes: string[] | null;
  diagnosis_codes: string[] | null;
  amount_billed: number | null;
  amount_denied: number | null;
  created_at: string;
  updated_at: string;
}

export interface DenialInformation {
  id: string;
  appeal_id: string;
  denial_reason: string;
  denial_code: string | null;
  denial_description: string | null;
  denial_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface AppealVersion {
  id: string;
  appeal_id: string;
  version_number: number;
  structured_output: StructuredAppealOutput | null;
  edited_content: string | null;
  created_at: string;
}

export interface GeneratedDocument {
  id: string;
  appeal_version_id: string;
  storage_path: string;
  file_name: string;
  file_size: number | null;
  created_at: string;
}

export interface Subscription {
  id: string;
  profile_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  plan: PlanId;
  status: "active" | "canceled" | "past_due" | "trialing" | "incomplete";
  current_period_start: string | null;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

export interface UsageRecord {
  id: string;
  profile_id: string;
  period_start: string;
  period_end: string;
  generation_count: number;
  created_at: string;
  updated_at: string;
}

export interface AiGeneration {
  id: string;
  appeal_version_id: string;
  provider: string;
  model: string;
  duration_ms: number | null;
  success: boolean;
  error_code: string | null;
  estimated_cost_usd: number | null;
  created_at: string;
}

export interface ReferenceDocument {
  id: string;
  title: string;
  content: string;
  category: string;
  active: boolean;
  created_at: string;
}

// ============================================================
// AI Pipeline types
// ============================================================

/**
 * Normalized input fed to the AI pipeline.
 * Derived from the wizard form data.
 */
export interface NormalizedAppealInput {
  // Patient info
  patientName: string;
  // Insurance
  insuranceCompany: string;
  planType: string | null;
  memberId: string | null;
  groupNumber: string | null;
  // Claim
  claimNumber: string | null;
  dateOfService: string | null;
  providerName: string | null;
  cptCodes: string[];
  diagnosisCodes: string[];
  amountBilled: number | null;
  amountDenied: number | null;
  // Denial
  denialReason: string;
  denialCode: string | null;
  denialDescription: string | null;
  denialDate: string | null;
  // Supporting info
  medicalNecessityExplanation: string | null;
  additionalNotes: string | null;
  priorAppealAttempts: boolean;
  priorAppealDetails: string | null;
  // Reference context
  referenceDocuments: Array<{ title: string; content: string }>;
}

/**
 * Structured JSON output from the AI provider.
 * Rendered into PDF — never raw text.
 */
export interface StructuredAppealOutput {
  letter: {
    recipient: string;
    subject: string;
    body: string;
  };
  appeal_strategy: string;
  key_arguments: string[];
  supporting_information_needed: string[];
  warnings: string[];
  references: string[];
}

// ============================================================
// API response types
// ============================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T | null;
  error: string | null;
  requestId: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// ============================================================
// Usage/quota types
// ============================================================

export interface UsageStatus {
  used: number;
  limit: number;
  remaining: number;
  plan: PlanId;
  periodStart: string | null;
  periodEnd: string | null;
}
