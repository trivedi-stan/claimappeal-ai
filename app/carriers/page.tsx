import type { Metadata } from "next";
import { CategoryHubPage } from "@/components/seo/CategoryHubPage";

export const metadata: Metadata = {
  title: "Health Insurance Carrier Appeal Guides & Playbooks | ClaimAppeal AI",
  description:
    "Carrier-specific appeal guides, grievance addresses, and legal playbooks for UnitedHealthcare, Aetna, Cigna, Blue Cross Blue Shield, Humana, and Kaiser Permanente claims.",
  alternates: {
    canonical: "/carriers",
  },
};

export default function CarriersHubPage() {
  return <CategoryHubPage category="carriers" />;
}
