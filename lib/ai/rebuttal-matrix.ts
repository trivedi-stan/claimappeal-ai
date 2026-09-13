import type { NormalizedAppealInput } from "@/types";

export interface CriterionMapping {
  id: string;
  criterion: string;
  status: "covered" | "partial" | "missing";
  evidence: string | null;
  recommendation?: string;
}

export interface RebuttalMatrixAnalysis {
  criteria: CriterionMapping[];
  coverageCount: number;
  totalCount: number;
  coveragePercentage: number;
  strengthRating: "High" | "Moderate" | "Needs Documentation";
  potentialImprovements: string[];
  clinicalSummary: string;
}

/**
 * Standard Medical Necessity Criteria benchmarks (MCG / InterQual / Milliman guidelines).
 */
const MEDICAL_NECESSITY_CRITERIA = [
  {
    id: "symptoms_duration",
    criterion: "Persistent Symptoms & Chronicity",
    keywords: ["week", "month", "day", "persist", "chronic", "ongoing", "recurrent", "longstanding", "duration"],
    recommendation: "Specify exact symptom chronicity (e.g., 6+ weeks of radicular pain) to satisfy guideline duration requirements.",
  },
  {
    id: "conservative_therapy",
    criterion: "Failure of Conservative Therapy",
    keywords: ["physical therapy", "pt", "nsaid", "medication", "injections", "epidural", "rest", "chiropractic", "exercise", "conservative"],
    recommendation: "Document at least 6 weeks of supervised physical therapy, oral anti-inflammatories, or injections.",
  },
  {
    id: "objective_findings",
    criterion: "Objective Neurological / Clinical Findings",
    keywords: ["straight leg", "slr", "radiculopathy", "numbness", "weakness", "reflex", "dermatome", "l4", "l5", "s1", "sensory", "motor", "spasm", "exam"],
    recommendation: "Attach documented physical exam findings (e.g., positive straight-leg raise, focal motor deficit, dermatomal sensory loss).",
  },
  {
    id: "functional_impairment",
    criterion: "Documented Functional Impairment",
    keywords: ["walking", "sitting", "sleeping", "work", "occupational", "daily living", "adl", "standing", "lifting", "driving", "interfere"],
    recommendation: "Describe how symptoms directly impede occupational duties, sitting, walking, or sleep quality.",
  },
  {
    id: "procedure_indication",
    criterion: "Clinical Indication for Requested Procedure",
    keywords: ["mri", "imaging", "ruling out", "pathology", "nerve-root", "compression", "herniation", "stenosis", "indication", "surgery"],
    recommendation: "State physician's rationale for imaging/procedure (e.g., ruling out progressive nerve-root compression or structural pathology).",
  },
];

const PRIOR_AUTH_CRITERIA = [
  {
    id: "prior_auth_request",
    criterion: "Prior Authorization Submission Record",
    keywords: ["submitted", "request", "reference", "tracking", "prior auth", "authorization"],
    recommendation: "Provide original prior authorization request date, tracking ID, or proof of timely submission.",
  },
  {
    id: "urgent_emergency",
    criterion: "Urgent / Emergency Clinical Need",
    keywords: ["urgent", "emergency", "acute", "immediate", "deterioration", "hospital"],
    recommendation: "Highlight why delaying treatment would jeopardize patient health (supporting retrospective authorization).",
  },
  {
    id: "continuity_of_care",
    criterion: "Continuity of Treatment & Clinical Rationale",
    keywords: ["course", "regimen", "physician", "plan", "prescribe", "treatment"],
    recommendation: "Include physician documentation supporting uninterrupted treatment course.",
  },
];

const GENERAL_CRITERIA = [
  {
    id: "claim_documentation",
    criterion: "Clinical Documentation & Records",
    keywords: ["record", "chart", "note", "physician", "documentation", "letter", "report"],
    recommendation: "Ensure signed clinical chart notes and provider letters of medical necessity are attached.",
  },
  {
    id: "coding_accuracy",
    criterion: "Coding & Adjudication Clarification",
    keywords: ["cpt", "icd", "code", "billing", "modifier", "charge"],
    recommendation: "Verify that CPT procedure codes and ICD-10 diagnosis codes match the treating provider's claim submission.",
  },
  {
    id: "procedural_rights",
    criterion: "Statutory Full-and-Fair Review Rights",
    keywords: ["appeal", "eob", "denial", "erisa", "review", "statutory", "timely"],
    recommendation: "Confirm appeal is submitted within the 180-day internal appeal deadline from the date of the denial notice.",
  },
];

/**
 * Analyzes case input to build the Denial Rebuttal Matrix.
 * Extracts criteria based on denial reason, matches evidence, and scores coverage.
 */
export function buildRebuttalMatrix(
  input: Pick<
    NormalizedAppealInput,
    | "denialReason"
    | "denialCode"
    | "denialDescription"
    | "medicalNecessityExplanation"
    | "cptCodes"
    | "diagnosisCodes"
    | "additionalNotes"
  >
): RebuttalMatrixAnalysis {
  const reasonLower = (input.denialReason || "").toLowerCase();
  const codeLower = (input.denialCode || "").toLowerCase();
  const descLower = (input.denialDescription || "").toLowerCase();
  const medExLower = (input.medicalNecessityExplanation || "").toLowerCase();
  const notesLower = (input.additionalNotes || "").toLowerCase();

  const combinedEvidenceText = `${descLower} ${medExLower} ${notesLower} ${input.cptCodes.join(" ")} ${input.diagnosisCodes.join(" ")}`;

  // Select criteria set based on denial category
  let targetCriteria = MEDICAL_NECESSITY_CRITERIA;
  if (reasonLower.includes("prior auth") || codeLower.includes("197") || descLower.includes("prior auth")) {
    targetCriteria = PRIOR_AUTH_CRITERIA;
  } else if (!reasonLower.includes("necessity") && !codeLower.includes("50") && !medExLower.includes("mri")) {
    // If generic or other denial
    targetCriteria = GENERAL_CRITERIA;
  }

  const mappedCriteria: CriterionMapping[] = targetCriteria.map((crit) => {
    // Check if evidence text contains any keywords
    const matchedKeywords = crit.keywords.filter((kw) => combinedEvidenceText.includes(kw));

    if (matchedKeywords.length >= 2 || (matchedKeywords.length === 1 && medExLower.length > 30)) {
      // Find a snippet of evidence
      const snippet = extractSnippet(combinedEvidenceText, matchedKeywords[0]);
      return {
        id: crit.id,
        criterion: crit.criterion,
        status: "covered",
        evidence: snippet || "Documented in clinical explanation",
      };
    } else if (matchedKeywords.length === 1) {
      return {
        id: crit.id,
        criterion: crit.criterion,
        status: "partial",
        evidence: `Mentioned (${matchedKeywords[0]})`,
        recommendation: crit.recommendation,
      };
    } else {
      return {
        id: crit.id,
        criterion: crit.criterion,
        status: "missing",
        evidence: null,
        recommendation: crit.recommendation,
      };
    }
  });

  const coveredCount = mappedCriteria.filter((c) => c.status === "covered").length;
  const partialCount = mappedCriteria.filter((c) => c.status === "partial").length;
  const totalCount = mappedCriteria.length;
  const effectiveCovered = coveredCount + partialCount * 0.5;
  const coveragePercentage = Math.round((effectiveCovered / totalCount) * 100);

  let strengthRating: "High" | "Moderate" | "Needs Documentation" = "High";
  if (coveragePercentage < 50) {
    strengthRating = "Needs Documentation";
  } else if (coveragePercentage < 80) {
    strengthRating = "Moderate";
  }

  const potentialImprovements = mappedCriteria
    .filter((c) => c.status !== "covered" && c.recommendation)
    .map((c) => c.recommendation as string);

  // Standard recommended additions
  if (potentialImprovements.length === 0) {
    potentialImprovements.push(
      "Attach signed clinical chart notes from the treating physician.",
      "Include physical therapy logs and diagnostic imaging reports as numbered exhibits.",
      "Attach a copy of the carrier's original Explanation of Benefits (EOB)."
    );
  }

  const clinicalSummary =
    strengthRating === "High"
      ? "Comprehensive clinical evidence matches standard insurer coverage criteria. The appeal establishes symptom chronicity, failed conservative care, and physician clinical justification."
      : strengthRating === "Moderate"
      ? "Solid clinical baseline with some criteria partially documented. Adding specific exam dates or therapy duration will strengthen the rebuttal."
      : "Clinical documentation gap detected. Insurers frequently affirm denials if conservative therapy or objective exam signs are omitted.";

  return {
    criteria: mappedCriteria,
    coverageCount: coveredCount,
    totalCount,
    coveragePercentage,
    strengthRating,
    potentialImprovements,
    clinicalSummary,
  };
}

function extractSnippet(text: string, keyword: string): string {
  const idx = text.indexOf(keyword);
  if (idx === -1) return "";
  const start = Math.max(0, idx - 20);
  const end = Math.min(text.length, idx + keyword.length + 35);
  let snippet = text.substring(start, end).trim();
  if (start > 0) snippet = `...${snippet}`;
  if (end < text.length) snippet = `${snippet}...`;
  return snippet;
}
