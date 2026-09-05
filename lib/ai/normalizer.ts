import type {
  Appeal,
  NormalizedAppealInput,
  InsuranceInformation,
  ClaimInformation,
  DenialInformation,
} from "@/types";

/**
 * Normalizes raw appeal data from the database into the input
 * format expected by the AI pipeline.
 */
export function normalizeAppealInput(
  appeal: Appeal,
  patientName: string,
  supportingInfo: {
    medical_necessity_explanation?: string | null;
    additional_notes?: string | null;
    prior_appeal_attempts?: boolean;
    prior_appeal_details?: string | null;
  },
  referenceDocuments: Array<{ title: string; content: string }>
): NormalizedAppealInput {
  const insurance = appeal.insurance_information;
  const claim = appeal.claim_information;
  const denial = appeal.denial_information;

  return {
    patientName,
    insuranceCompany: insurance?.company ?? "Information not provided",
    planType: insurance?.plan_type ?? null,
    memberId: insurance?.member_id ?? null,
    groupNumber: insurance?.group_number ?? null,
    claimNumber: claim?.claim_number ?? null,
    dateOfService: claim?.date_of_service ?? null,
    providerName: claim?.provider_name ?? null,
    cptCodes: claim?.cpt_codes ?? [],
    diagnosisCodes: claim?.diagnosis_codes ?? [],
    amountBilled: claim?.amount_billed ?? null,
    amountDenied: claim?.amount_denied ?? null,
    denialReason: denial?.denial_reason ?? "Information not provided",
    denialCode: denial?.denial_code ?? null,
    denialDescription: denial?.denial_description ?? null,
    denialDate: denial?.denial_date ?? null,
    medicalNecessityExplanation:
      supportingInfo.medical_necessity_explanation ?? null,
    additionalNotes: supportingInfo.additional_notes ?? null,
    priorAppealAttempts: supportingInfo.prior_appeal_attempts ?? false,
    priorAppealDetails: supportingInfo.prior_appeal_details ?? null,
    referenceDocuments,
  };
}
