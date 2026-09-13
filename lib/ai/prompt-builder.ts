import type { NormalizedAppealInput } from "@/types";

const SAFETY_INSTRUCTIONS = `
CRITICAL SAFETY & CITATION RULES — you must follow these without exception:

1. NEVER use bracketed citation placeholders or internal reference tags (such as [REF-1], [REF-2], [DOC-1], [SOURCE-A], etc.) anywhere in the letter body. Write natural, authoritative prose.
2. NEVER fabricate medical facts, clinical findings, diagnostic test results, policy provisions, regulatory sections, claim specifics, or deadlines.
3. If information is missing or unclear, write "Information not provided" — do not guess or infer.
4. Only draw upon verified case facts and the TRUSTED REFERENCE DOCUMENTS section below. Do not invent unverified references.
5. When citing legal or regulatory authorities:
   - For employer-sponsored group health plans, cite ERISA § 503 (29 U.S.C. § 1133) and claims-procedure regulations (29 C.F.R. § 2560.503-1) regarding full-and-fair review rights.
   - For individual or ACA exchange plans, cite ACA § 2719 and 45 C.F.R. § 147.136.
   - If the plan type is unverified, private non-ERISA, or unknown, use clean, authoritative procedural language: "I request that the plan conduct a full and fair review of this appeal and provide the specific clinical criteria, guideline benchmarks, and medical rationale supporting the adverse determination."
   - Do NOT cite internal drafting guides, general strategy tips, or unverified external case citations as evidence.
6. You are a drafting assistant helping the patient or healthcare provider compose a formal appeal letter, NOT a lawyer or medical provider. Do not give legal or medical advice.
7. Do not guarantee appeal approval. Write in an authoritative, professional, respectful, and objective tone.
`.trim();

function getLetterFormatInstructions(currentDate: string) {
  return `
FORMAT & CLINICAL REBUTTAL ARCHITECTURE for the letter body:
- Date: State the current appeal date: ${currentDate} at the very top of the letter. Do NOT output "[DATE]" or any bracketed date placeholder.
- Header Information: Include recipient department, patient name, member ID, group number, claim number, and date of service.
- Service Dissection: Identify the specific service(s) or CPT code(s) targeted by the denial notice. If the insurer's denial specifically focuses on one procedure (e.g. lumbar MRI) for medical necessity, do NOT loosely lump accompanying therapeutic services into that same rationale. Address the denied service directly and clarify the status of any associated services.
- Systematic Clinical Rebuttal (Criterion → Documented Evidence → Why It Satisfies):
  Structure the medical necessity argument by explicitly mapping the documented clinical evidence directly against standard insurer coverage criteria:
  1. Duration of Symptoms & Functional Impairment: Chronicity of symptoms (e.g. persistent pain duration) and documented interference with activities of daily living (walking, sitting, sleeping, work duties).
  2. Completion & Failure of Conservative Therapy: Specific conservative modalities completed (e.g. supervised physical therapy, oral NSAIDs/pharmacotherapy, activity modification) and the documented failure to achieve clinical relief.
  3. Objective Neurological & Physical Examination Findings: Documented clinical signs from physical examination (e.g. positive provocative signs like straight-leg raise, dermatomal sensory deficits, focal motor weakness).
  4. Clinical Indication for the Requested Service: Explain why conservative care has been exhausted and advanced diagnostic imaging/intervention is the standard-of-care next step to rule out progressive nerve-root compression or structural pathology.
- Explicit Information Request: Formally request the specific clinical criteria (e.g., Milliman Care Guidelines, InterQual, or plan clinical coverage bulletin) and reviewer credentials relied upon in the denial.
- Closing: Professional closing and formal signature block for the member or provider.
- Clean Document: Do NOT include any AI draft disclaimers, watermark notes, or internal tags inside the letter body. The letter must be clean, professional, and ready for submission to the insurance carrier.
`.trim();
}

/**
 * Builds the system and user prompts for the AI generation pipeline.
 * Merges normalized user input + trusted reference documents.
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

  const systemPrompt = `You are ClaimAppeal AI, a specialized assistant that generates professional insurance appeal letters.

${SAFETY_INSTRUCTIONS}

${getLetterFormatInstructions(currentDate)}

Your output must be structured and complete.`;

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

  const userPrompt = `Generate an insurance appeal letter for the following denial:

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

=== SUPPORTING INFORMATION ===
Medical Necessity Explanation: ${input.medicalNecessityExplanation || "Information not provided"}
Prior Appeal Attempts: ${input.priorAppealAttempts ? "Yes" : "No"}
${input.priorAppealDetails ? `Prior Appeal Details: ${input.priorAppealDetails}` : ""}
Additional Notes: ${input.additionalNotes || "None"}

${referenceSection}

Generate a complete, professional appeal letter using the generate_appeal_letter tool.`;

  return { systemPrompt, userPrompt };
}

