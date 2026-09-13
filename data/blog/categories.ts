import { BlogCategory } from "@/types/blog";

export const BLOG_CATEGORIES: BlogCategory[] = [
  {
    slug: "insurance-denials",
    title: "Insurance Denials",
    description:
      "Understand why carriers reject claims, how to decode adverse benefit determinations, and how to spot bad-faith denials.",
    iconName: "AlertTriangle",
    pillarTitle: "Insurance Claim Denials: The Complete Patient Guide",
    pillarDescription:
      "Health plans deny more than 200 million claims each year. Learn how denial algorithms operate, what your denial letter actually means, and how to prepare an effective challenge.",
  },
  {
    slug: "claim-appeals",
    title: "Claim Appeals",
    description:
      "Step-by-step guidance for internal appeals, external reviews, ERISA § 503 rebuttals, and administrative due process.",
    iconName: "Scale",
    pillarTitle: "Health Insurance Claim Appeals: Process & Strategy",
    pillarDescription:
      "Fewer than 0.2% of denied claims are ever appealed, yet up to 70% of formal appeals succeed. Master the statutory appeal timeline, evidentiary documentation, and submission protocol.",
  },
  {
    slug: "prior-authorization",
    title: "Prior Authorization",
    description:
      "Navigate pre-certification disputes, peer-to-peer reviews, urgent care expediting, and clinical criterion mismatches.",
    iconName: "ShieldAlert",
    pillarTitle: "Prior Authorization Denials: Overturn Strategies",
    pillarDescription:
      "When an insurer refuses pre-certification for a recommended surgery, MRI, or medication, use these clinical necessity rubrics and peer-to-peer talking points to reverse the refusal.",
  },
  {
    slug: "medical-billing",
    title: "Medical Billing",
    description:
      "Demystify Explanation of Benefits (EOBs), out-of-network balance billing, CPT and ICD-10 coding errors, and the No Surprises Act.",
    iconName: "FileSpreadsheet",
    pillarTitle: "Medical Billing & EOB Navigation",
    pillarDescription:
      "Unravel confusing hospital bills, duplicate line items, and unbundled codes to ensure you only pay what your insurance plan is legally mandated to cover.",
  },
  {
    slug: "insurance-terms",
    title: "Insurance Terms & Codes",
    description:
      "Decode Claim Adjustment Reason Codes (CARC), Remittance Advice Remark Codes (RARC), and standard policy nomenclature.",
    iconName: "BookOpen",
    pillarTitle: "Insurance Codes & Terminology Explained",
    pillarDescription:
      "From CO-50 and CO-197 to allowed amounts and maximum out-of-pocket maximums, translate insurer jargon into plain English.",
  },
  {
    slug: "health-insurance",
    title: "Health Insurance Guides",
    description:
      "Practical guides on employer-sponsored ERISA plans, ACA Marketplace policies, Medicare Advantage, and Medicaid rights.",
    iconName: "ShieldCheck",
    pillarTitle: "Navigating Health Insurance Policies",
    pillarDescription:
      "Comprehensive resources for understanding plan documents, Summary of Benefits and Coverage (SBC), formulary tiers, and network tiers.",
  },
  {
    slug: "ai-insurance",
    title: "AI & Insurance Tech",
    description:
      "Explore how artificial intelligence is transforming medical denial appeals and how patients can level the playing field.",
    iconName: "Cpu",
    pillarTitle: "AI in Health Insurance Claims & Appeals",
    pillarDescription:
      "Carriers use algorithms like nH Predict to deny care in seconds. Discover how patients and providers leverage statutory AI to draft rigorous rebuttals.",
  },
  {
    slug: "patient-rights",
    title: "Patient Rights",
    description:
      "Learn about federal rights under ERISA § 503, ACA § 2719, HIPAA record access rules, and state external review boards.",
    iconName: "UserCheck",
    pillarTitle: "Patient Rights & Legal Protections",
    pillarDescription:
      "Federal law grants patients enforceable legal rights to a full and fair review, carrier disclosure of internal medical criteria, and independent external adjudication.",
  },
];

export function getCategoryBySlug(slug: string): BlogCategory | undefined {
  return BLOG_CATEGORIES.find((cat) => cat.slug === slug);
}
