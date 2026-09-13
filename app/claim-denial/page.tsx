import type { Metadata } from "next";
import { CategoryHubPage } from "@/components/seo/CategoryHubPage";

export const metadata: Metadata = {
  title: "What to Do When Insurance Claims Are Denied | ClaimAppeal AI",
  description: "Immediate action plans, legal rights, and survival guides for patients and families facing denied health insurance claims.",
  alternates: {
    canonical: "/claim-denial",
  },
};

export default function ClaimDenialHubPage() {
  return <CategoryHubPage category="claim-denial" />;
}
