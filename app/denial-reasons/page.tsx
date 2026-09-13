import type { Metadata } from "next";
import { CategoryHubPage } from "@/components/seo/CategoryHubPage";

export const metadata: Metadata = {
  title: "Claim Denial Reasons & CARC Rebuttals | ClaimAppeal AI",
  description: "Detailed breakdowns and legal rebuttal strategies for common health insurance denial codes: medical necessity, prior authorization, coding errors, and experimental treatments.",
  alternates: {
    canonical: "/denial-reasons",
  },
};

export default function DenialReasonsHubPage() {
  return <CategoryHubPage category="denial-reasons" />;
}
