import type { Metadata } from "next";
import { CategoryHubPage } from "@/components/seo/CategoryHubPage";

export const metadata: Metadata = {
  title: "Claim Appeal Guides & Statutory Playbooks | ClaimAppeal AI",
  description: "Step-by-step guides for appealing denied health, hospital, and medical claims under federal ERISA § 503 and ACA § 2719 regulations.",
  alternates: {
    canonical: "/guides",
  },
};

export default function GuidesIndexPage() {
  return <CategoryHubPage category="guides" />;
}
