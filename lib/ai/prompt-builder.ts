import type { NormalizedAppealInput } from "@/types";

const SAFETY_INSTRUCTIONS = `
CRITICAL SAFETY RULES — you must follow these without exception:

1. NEVER fabricate medical facts, policy language, regulatory citations, claim specifics, coverage rules, or deadlines.
2. If information is missing or unclear, write "Information not provided" — do not guess or infer.
3. You may ONLY cite references from the "TRUSTED REFERENCE DOCUMENTS" section below. Do not invent any other references.
4. You are a drafting assistant, NOT a lawyer or medical provider. Do not give legal or medical advice.
5. Do not guarantee appeal approval. Appeals are not guaranteed to succeed.
6. Write in a professional, respectful, formal tone. No emotional language or accusations.
7. If the denial reason does not clearly indicate a specific legal basis, do not fabricate one.
`.trim();

const LETTER_FORMAT_INSTRUCTIONS = `
FORMAT REQUIREMENTS for the letter body:
- Begin with the date placeholder: [DATE]
- Include: patient name, member ID, claim number (all from input)
- Use formal business letter structure
- Reference specific denial details provided
- Cite only the reference documents provided to you
- End with a professional closing and space for signature
- Include the mandatory disclaimer: "This letter is an AI-generated draft. Review all information carefully and consult appropriate professionals before submitting."
`.trim();

/**
 * Builds the system and user prompts for the AI generation pipeline.
 * Merges normalized user input + trusted reference documents.
 */
export function buildPrompt(input: NormalizedAppealInput): {
  systemPrompt: string;
  userPrompt: string;
} {
  const systemPrompt = `You are ClaimAppeal AI, a specialized assistant that generates professional insurance appeal letters.

${SAFETY_INSTRUCTIONS}

${LETTER_FORMAT_INSTRUCTIONS}

Your output must be structured and complete. Always use the generate_appeal_letter tool.`;

  const referenceSection =
    input.referenceDocuments.length > 0
      ? `
TRUSTED REFERENCE DOCUMENTS (you may only cite these):
${input.referenceDocuments
  .map(
    (doc, i) => `
[REF-${i + 1}] ${doc.title}
${doc.content}
`
  )
  .join("\n---\n")}`
      : `TRUSTED REFERENCE DOCUMENTS: None provided for this request.`;

  const userPrompt = `Generate an insurance appeal letter for the following denial:

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
