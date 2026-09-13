export type SearchIntentType =
  | "generate"
  | "understand"
  | "action"
  | "template"
  | "denial_reason"
  | "document";

export type InsuranceType =
  | "health"
  | "medical"
  | "dental"
  | "vision"
  | "prescription"
  | "hospital"
  | "medicare"
  | "medicaid"
  | "general";

export type SeoCategory =
  | "guides"
  | "appeal-letter"
  | "denial-reasons"
  | "insurance-types"
  | "claim-denial"
  | "templates"
  | "claim-help";

export interface SeoFaqItem {
  question: string;
  answer: string;
}

export interface DocumentChecklistItem {
  name: string;
  source: string;
  purpose: string;
  isRequired: boolean;
}

export interface StatutoryCitation {
  statute: string; // e.g. "ERISA § 503 / 29 C.F.R. § 2560.503-1"
  rule: string;
  practicalImpact: string;
}

export interface SeoCtaConfig {
  headline: string;
  subtext: string;
  buttonText: string;
  badgeText?: string;
  prefillReason?: string;
  prefillInsurance?: string;
}

export interface SeoArticle {
  id: string;
  slug: string;
  category: SeoCategory;
  title: string;
  h1: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  canonicalPath: string; // e.g. "/guides/how-to-appeal-an-insurance-claim"

  primaryKeyword: string;
  secondaryKeywords: string[];
  searchIntent: SearchIntentType;
  insuranceType: InsuranceType;
  denialCode?: string; // e.g. "CO-50", "CO-197"
  denialReasonName?: string; // e.g. "Medical Necessity"

  publishedAt: string;
  updatedAt: string;
  readingTime: string;
  tags: string[];

  // Structured Content Sections
  executiveSummary: string[];
  whyThisHappens: {
    overview: string;
    carrierTactics: string[];
    automatedAlgorithms?: string; // e.g. "InterQual / Milliman MCG"
  };
  whatItMeans: {
    plainEnglish: string;
    financialLiability: string;
    timelinesNotice: string;
  };
  requiredDocuments: DocumentChecklistItem[];
  stepByStepPlaybook: {
    step: number;
    title: string;
    instructions: string;
    pitfallToAvoid?: string;
  }[];
  statutoryPrecedents: StatutoryCitation[];
  sampleLetterExcerpt?: {
    heading: string;
    scenario: string;
    content: string;
  };
  faq: SeoFaqItem[];
  cta: SeoCtaConfig;

  // Cross-linking
  relatedSlugs?: string[]; // explicitly linked slugs
}

export interface CategoryMetadata {
  category: SeoCategory;
  title: string;
  shortTitle: string;
  description: string;
  pathPrefix: string;
  iconName: string;
  badgeColor: string;
}
