import type { NormalizedAppealInput } from "@/types";
import { buildRebuttalMatrix } from "./rebuttal-matrix";

const SAFETY_AND_CONFIDENCE_INSTRUCTIONS = `
CRITICAL TRUST, ACCURACY & CONDITIONAL LANGUAGE RULES — you must follow these without exception:

1. ZERO PLACEHOLDERS & NO UNVERIFIED CITATIONS:
   - NEVER emit bracketed citation placeholders or internal reference tags (such as [REF-1], [REF-2], [DOC-1], [DATE], [X], [INSERT], etc.) anywhere in the output.
   - Never emit a legal or clinical citation that has not been explicitly verified. Default to plain, factual descriptions ("applicable plan terms and claims procedure standards generally require disclosure of clinical criteria relied on...") instead of citing unverified document numbers or fabricated case law.

2. ANCHOR MEDICAL DECISIONS TO THE TREATING PHYSICIAN (NO OVERCONFIDENT AI DECLARATIONS):
   - You are an drafting assistant, NOT an independent medical board or treating clinician.
   - ❌ NEVER declare clinical standards independently, such as: "lumbar MRI is the standard-of-care next step" or "this meets thresholds for advanced diagnostic evaluation."
   - ✅ ALWAYS anchor medical decisions to the treating physician: "the treating physician determined that lumbar MRI was clinically appropriate to evaluate for possible nerve-root compression" and "provides clinical support for diagnostic evaluation and directly addresses the denial notice's criteria."

3. CONDITIONAL LEGAL PHRASING (NO UNSUBSTANTIATED ERISA ASSUMPTIONS):
   - ❌ DO NOT assert: "I am entitled to a full and fair review under ERISA."
   - ✅ USE CONDITIONAL PHRASING: "I request a full and fair review consistent with applicable plan terms and, to the extent applicable, ERISA claims-procedure requirements (or applicable state insurance regulations if non-ERISA)."

4. SERVICE DISSECTION (DO NOT INFER BUNDLED DENIALS):
   - If multiple CPT codes are listed (e.g. diagnostic imaging alongside therapeutic services) but the insurer's denial specifically focuses on one service (e.g. lumbar MRI) for medical necessity, do NOT assert that all accompanying services were denied for that identical reason.
   - Use nuanced phrasing: "If those accompanying services were denied under the same medical-necessity rationale, the clinical information below supports reconsideration; otherwise, please clarify the specific adjudication status of those line items."

5. MEASURED REVIEWER QUALIFICATIONS REQUEST:
   - ❌ DO NOT demand aggressively: "credentials of the reviewer who made this determination."
   - ✅ USE INSTEAD: "I request the qualifications and clinical specialty of the reviewer, to the extent required by law or plan terms."

6. CONDITIONAL LANGUAGE CONFIDENCE FRAMEWORK:
   - User-provided facts (High Confidence): Use direct, factual statements ("The patient completed 6 weeks of supervised physical therapy...", "Dr. Sarah Mitchell documented persistent radicular symptoms...").
   - Clinical reasoning (Medium Confidence): Use objective evaluative phrasing ("...provides clinical support for...", "...to evaluate for possible structural nerve-root compromise...", "...suggests ongoing functional impairment...").
   - Medical standards (Needs plan data): Anchor strictly to provider judgment ("...the treating physician determined that...", "...consistent with the treating provider's clinical assessment...").
   - Legal rights (Conditional): Use conditional entitlement ("...consistent with applicable plan terms and, to the extent applicable, ERISA...").

7. COMPLETENESS & INTEGRITY:
   - Do NOT drop any supplied case facts: Patient Name, Member ID, Group Number, Claim Number, Date of Service, Provider Name, CPT codes, and Diagnosis codes must be accurately included in the header or body.
`.trim();

function getLetterFormatInstructions(currentDate: string, matrixText: string) {
  return `
FORMAT & SYSTEMATIC REBUTTAL ARCHITECTURE:
- Appeal Date: State the current appeal date: ${currentDate} at the very top of the letter. Do NOT output "[DATE]" or any bracketed date placeholder.
- Header Information: Recipient appeals department, Patient Name, Member ID, Group Number, Claim Reference Number, Date of Service, and Provider Name.
- Opening: Formal, polite notice of appeal referencing the adverse determination and date of notice.
- Service Dissection: Clearly distinguish the primary disputed service from any accompanying line items.
- Systematic Clinical Rebuttal Matrix:
  Organize the medical necessity argument explicitly by the denial criteria identified in the case analysis:
${matrixText}
  For each criterion:
  1. State the criterion required by coverage standards.
  2. Present the documented clinical evidence supplied by the patient/provider.
  3. Explain why this documented history provides clinical support for the requested procedure.
- Information & Reviewer Request: Request copies of the specific clinical coverage bulletin, guideline benchmarks (e.g., MCG or InterQual), and reviewer qualifications to the extent required by law or plan terms.
- Closing & Signature: Formal closing for the member or authorized healthcare provider.
- Clean Deliverable: Do NOT include any AI draft disclaimers, watermark notes, or internal tags inside the letter body. The letter must be clean, professional, and ready for insurer submission.
`.trim();
}

/**
 * Builds the system and user prompts for the AI generation pipeline.
 * Merges normalized user input + trusted reference documents + Denial Rebuttal Matrix.
 */
export function buildPrompt(
  input: NormalizedAppealInput,
  customDate?: string
): {
  systemPrompt: string;
  userPrompt: string;
} {
  const currentDate =
    customDate ||
    new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const matrixAnalysis = buildRebuttalMatrix(input);
  const matrixPromptText = matrixAnalysis.criteria
    .map(
      (c, i) =>
        `  ${i + 1}. ${c.criterion} (${c.status.toUpperCase()}): ${
          c.evidence ? `Documented evidence: "${c.evidence}"` : "Evidence: Not explicitly documented in intake; frame conditionally or cite provider chart notes."
        }`
    )
    .join("\n");

  const systemPrompt = `You are ClaimAppeal AI, a specialized assistant that generates professional insurance appeal letters.

${SAFETY_AND_CONFIDENCE_INSTRUCTIONS}

${getLetterFormatInstructions(currentDate, matrixPromptText)}

Your output must be structured, fully populated, and strictly adhere to the confidence framework.`;

  const referenceSection =
    input.referenceDocuments.length > 0
      ? `
TRUSTED REFERENCE DOCUMENTS (General Reference & Guidance):
${input.referenceDocuments
  .map(
    (doc) => `
• Title: ${doc.title}
  Content: ${doc.content}
`
  )
  .join("\n---\n")}`
      : `TRUSTED REFERENCE DOCUMENTS: None provided for this request.`;

  const userPrompt = `Generate a formal insurance appeal letter for the following adverse benefit determination:

=== APPEAL DATE ===
Current Date: ${currentDate}

=== PATIENT INFORMATION ===
Patient Name: ${input.patientName || "Information not provided"}

=== INSURANCE INFORMATION ===
Insurance Company: ${input.insuranceCompany || "Information not provided"}
Plan Type: ${input.planType || "Information not provided"}
Member ID: ${input.memberId || "Information not provided"}
Group Number: ${input.groupNumber || "Information not provided"}

=== CLAIM INFORMATION ===
Claim Number: ${input.claimNumber || "Information not provided"}
Date of Service: ${input.dateOfService || "Information not provided"}
Provider: ${input.providerName || "Information not provided"}
CPT Codes: ${input.cptCodes.length > 0 ? input.cptCodes.join(", ") : "Information not provided"}
Diagnosis Codes: ${input.diagnosisCodes.length > 0 ? input.diagnosisCodes.join(", ") : "Information not provided"}
Amount Billed: ${input.amountBilled != null ? `$${input.amountBilled.toFixed(2)}` : "Information not provided"}
Amount Denied: ${input.amountDenied != null ? `$${input.amountDenied.toFixed(2)}` : "Information not provided"}

=== DENIAL INFORMATION ===
Denial Reason: ${input.denialReason || "Information not provided"}
Denial Code: ${input.denialCode || "Information not provided"}
Denial Description: ${input.denialDescription || "Information not provided"}
Denial Date: ${input.denialDate || "Information not provided"}

=== CLINICAL EVIDENCE & SUPPORTING INFORMATION ===
Medical Necessity Explanation: ${input.medicalNecessityExplanation || "Information not provided"}
Prior Appeal Attempts: ${input.priorAppealAttempts ? "Yes" : "No"}
${input.priorAppealDetails ? `Prior Appeal Details: ${input.priorAppealDetails}` : ""}
Additional Notes: ${input.additionalNotes || "None"}

=== PRE-GENERATION DENIAL REBUTTAL MATRIX ===
Coverage Rating: ${matrixAnalysis.strengthRating} (${matrixAnalysis.coveragePercentage}% criteria coverage)
Criteria to explicitly address:
${matrixAnalysis.criteria
  .map(
    (c) =>
      `- ${c.criterion}: [${c.status}] ${c.evidence || "No specific evidence noted — address via treating physician chart notes."}`
  )
  .join("\n")}

${referenceSection}

Generate a complete, professional appeal letter using the generate_appeal_letter tool.`;

  return { systemPrompt, userPrompt };
}
