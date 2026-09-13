export interface DenialCodeInfo {
  code: string;
  category: string;
  description: string;
  carrierStrategy: string;
  legalStandard: string;
  appealPlaybook: string;
  targetArticleSlug: string;
}

export const COMMON_DENIAL_CODES: DenialCodeInfo[] = [
  {
    code: "CO-50",
    category: "Medical Necessity",
    description: "These are non-covered services because this is not deemed a 'medical necessity' by the payer.",
    carrierStrategy:
      "Automated batch algorithms (e.g., McKesson InterQual or Milliman MCG) flag procedures when submitted clinical notes lack specific keyword qualifiers, even if prescribed by treating specialists.",
    legalStandard:
      "Under ERISA § 503 (29 C.F.R. § 2560.503-1(h)), internal clinical criteria cannot preempt the clinical judgment of the attending physician without specific, transparent clinical peer review rationale.",
    appealPlaybook:
      "Request the clinical criteria used, demand the credentialed peer reviewer's report, and attach a formal Treating Physician Letter of Medical Necessity citing peer-reviewed clinical guidelines.",
    targetArticleSlug: "how-to-appeal-medical-necessity-denial",
  },
  {
    code: "CO-197",
    category: "Prior Authorization",
    description: "Precertification/authorization/notification absent or invalid.",
    carrierStrategy:
      "Payers use procedural absence of pre-approval as an absolute barrier to coverage, even in urgent or rapidly progressing conditions.",
    legalStandard:
      "ACA § 2719 and emergency exception doctrines prohibit retrospective denial if the care was provided under emergent triage conditions or if the carrier failed timely response protocols.",
    appealPlaybook:
      "Establish whether emergency or urgent care rules apply, submit retroactive authorization requests, and show evidence of timely submission attempts or administrative carrier delays.",
    targetArticleSlug: "prior-authorization-denial-appeal-guide",
  },
  {
    code: "CO-16",
    category: "Administrative / Coding",
    description: "Claim/service lacks information or has submission/billing errors.",
    carrierStrategy:
      "Administrative kickbacks intended to delay settlement cycles. Often triggered by missing modifiers, outdated NPIs, or incomplete chart records.",
    legalStandard:
      "Federal prompt-pay statutes and CMS rules require insurers to clearly define the specific missing data element rather than issuing generic non-substantive dismissals.",
    appealPlaybook:
      "Request the provider billing department submit a corrected claim with the specific missing attachments rather than a full formal legal appeal.",
    targetArticleSlug: "eob-explanation-of-benefits-claim-denial-guide",
  },
  {
    code: "CO-96",
    category: "Non-Covered Service / Investigational",
    description: "Non-covered charges. Payer deems treatment experimental, investigational, or unproven.",
    carrierStrategy:
      "Categorizing FDA-approved or standard off-label therapies as 'experimental' to avoid reimbursing high-cost novel oncology or specialty treatments.",
    legalStandard:
      "External independent review organizations (IROs) overturn experimental designations at high rates when standard-of-care compendia (NCCN, ASCO) support the regimen.",
    appealPlaybook:
      "Cite FDA approvals, randomized clinical trials, clinical society consensus statements, and demand an external review by a board-certified specialist in the relevant field.",
    targetArticleSlug: "experimental-investigational-treatment-denial-appeal",
  },
  {
    code: "PR-204",
    category: "Benefit Limitation",
    description: "This service/equipment/drug is not covered under the patient's current benefit plan.",
    carrierStrategy:
      "Invoking plan exclusions or annual maximums buried in 200-page Summary Plan Descriptions (SPD).",
    legalStandard:
      "Mental Health Parity and Addiction Equity Act (MHPAEA) or ACA Essential Health Benefit rules prohibit restrictive coverage limitations on protected categories of care.",
    appealPlaybook:
      "Demand the complete Summary Plan Description (SPD) under ERISA § 104(b)(4), scrutinize plan definitions, and challenge non-quantitative treatment limitations (NQTLs).",
    targetArticleSlug: "how-to-request-insurance-plan-documents-erisa",
  },
  {
    code: "CO-4",
    category: "Coding & Modifiers",
    description: "The procedure code is inconsistent with the modifier used or a required modifier is missing.",
    carrierStrategy:
      "Automated NCCI (National Correct Coding Initiative) unbundling audits rejecting claims where multiple services were billed concurrently.",
    legalStandard:
      "If distinct anatomic sites or independent clinical encounters occurred, standard CPT guidelines allow modifiers -59, -XE, -XP, -XS, or -XU.",
    appealPlaybook:
      "Have the billing specialist review the operatory note or encounter record, append the appropriate modifier, and resubmit without administrative penalty.",
    targetArticleSlug: "why-was-my-health-insurance-claim-denied",
  },
];
