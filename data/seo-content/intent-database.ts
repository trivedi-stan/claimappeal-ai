import { CategoryMetadata, SearchIntentType, InsuranceType, SeoCategory } from "@/types/seo-content";

export const SEO_CATEGORIES: CategoryMetadata[] = [
  {
    category: "guides",
    title: "Claim Appeal Guides & Playbooks",
    shortTitle: "Appeal Guides",
    description: "In-depth procedural roadmaps for challenging denied health, hospital, and medical insurance claims.",
    pathPrefix: "/guides",
    iconName: "BookOpen",
    badgeColor: "text-blue-500 bg-blue-500/10 border-blue-500/20",
  },
  {
    category: "appeal-letter",
    title: "Insurance Appeal Letter Guides",
    shortTitle: "Appeal Letters",
    description: "High-intent blueprints for drafting formal legal rebuttals tailored to specific clinical rejections.",
    pathPrefix: "/appeal-letter",
    iconName: "FileText",
    badgeColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    category: "denial-reasons",
    title: "Claim Denial Reasons & Rebuttals",
    shortTitle: "Denial Reasons",
    description: "Detailed breakdowns of common carrier rejection rationales, automated algorithms, and statutory defenses.",
    pathPrefix: "/denial-reasons",
    iconName: "ShieldAlert",
    badgeColor: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  },
  {
    category: "insurance-types",
    title: "Insurance Type Claim Solutions",
    shortTitle: "Insurance Types",
    description: "Specialized denial resolution for Medical, Dental, Vision, Prescription, Hospital, and Medicare coverage.",
    pathPrefix: "/insurance-types",
    iconName: "Layers",
    badgeColor: "text-purple-500 bg-purple-500/10 border-purple-500/20",
  },
  {
    category: "claim-denial",
    title: "What to Do After a Claim Denial",
    shortTitle: "What To Do",
    description: "Immediate action steps, patient rights, and dispute protocols when your insurance claim is rejected.",
    pathPrefix: "/claim-denial",
    iconName: "HelpCircle",
    badgeColor: "text-rose-500 bg-rose-500/10 border-rose-500/20",
  },
  {
    category: "templates",
    title: "Insurance Appeal Letter Templates",
    shortTitle: "Templates",
    description: "Letterhead-ready appeal letter templates and clinical rebuttal examples citing federal legal standards.",
    pathPrefix: "/templates",
    iconName: "Copy",
    badgeColor: "text-cyan-500 bg-cyan-500/10 border-cyan-500/20",
  },
  {
    category: "claim-help",
    title: "EOB & Medical Billing Documents",
    shortTitle: "EOB & Help",
    description: "How to read your Explanation of Benefits, decode CARC/RARC codes, and gather required medical records.",
    pathPrefix: "/claim-help",
    iconName: "FileCheck2",
    badgeColor: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
  },
];

export const INTENT_DEFINITIONS = {
  generate: {
    label: "Generate Appeal Letter",
    searchTerms: ["generate", "create", "write", "generator", "AI appeal generator"],
    primaryCta: "Generate My Appeal Letter with ClaimAppeal AI",
  },
  understand: {
    label: "Understand Rejection",
    searchTerms: ["why was my claim denied", "what does claim denied mean", "rejection reasons", "explain"],
    primaryCta: "Decode My Denial & Start Free Appeal",
  },
  action: {
    label: "Action & Dispute",
    searchTerms: ["what to do", "how to appeal", "how to fight", "how to dispute", "how to submit appeal"],
    primaryCta: "Start My Official Insurance Appeal",
  },
  template: {
    label: "Letter Templates",
    searchTerms: ["appeal letter template", "appeal letter example", "sample letter of appeal"],
    primaryCta: "Customize This Template with AI (Free)",
  },
  denial_reason: {
    label: "Specific Denial Reasons",
    searchTerms: ["medical necessity", "prior authorization", "coding error", "out of network", "experimental"],
    primaryCta: "Appeal This Specific Denial Reason",
  },
  document: {
    label: "EOB & Records",
    searchTerms: ["EOB says claim denied", "CARC code", "medical records", "letter of medical necessity"],
    primaryCta: "Analyze My EOB & Draft Rebuttal",
  },
};

export const INSURANCE_TYPE_LABELS: Record<InsuranceType, string> = {
  health: "Health Insurance (Commercial & Employer)",
  medical: "Medical Claims & Physician Services",
  dental: "Dental Insurance & Procedures",
  vision: "Vision Care & Ophthalmology",
  prescription: "Prescription Drugs & Pharmacy (Part D)",
  hospital: "Hospital Bills & Inpatient Surgeries",
  medicare: "Medicare Advantage & Part B",
  medicaid: "Medicaid Managed Care",
  general: "All Insurance Types",
};

export function getCategoryMeta(cat: SeoCategory): CategoryMetadata {
  const found = SEO_CATEGORIES.find((c) => c.category === cat);
  return (
    found || {
      category: cat,
      title: "Claim Appeal Resources",
      shortTitle: "Resources",
      description: "Insurance appeal guides and statutory tools.",
      pathPrefix: `/${cat}`,
      iconName: "FileText",
      badgeColor: "text-primary bg-primary/10 border-primary/20",
    }
  );
}
