import type { Metadata } from "next";
import { CategoryHubPage } from "@/components/seo/CategoryHubPage";

export const metadata: Metadata = {
  title: "Insurance Types Claim Appeal Solutions | ClaimAppeal AI",
  description: "Specialized appeal guides and legal playbooks for Health, Medical, Dental, Vision, Prescription, Hospital, and Medicare Advantage claims.",
  alternates: {
    canonical: "/insurance-types",
  },
};

export default function InsuranceTypesHubPage() {
  return <CategoryHubPage category="insurance-types" />;
}
