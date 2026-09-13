import type { Metadata } from "next";
import { CategoryHubPage } from "@/components/seo/CategoryHubPage";

export const metadata: Metadata = {
  title: "EOB & Medical Billing Claim Help | ClaimAppeal AI",
  description: "Decode your Explanation of Benefits (EOB), CARC and RARC rejection codes, and discover what medical records you need to win your appeal.",
  alternates: {
    canonical: "/claim-help",
  },
};

export default function ClaimHelpHubPage() {
  return <CategoryHubPage category="claim-help" />;
}
