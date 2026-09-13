import type { Metadata } from "next";
import { CategoryHubPage } from "@/components/seo/CategoryHubPage";

export const metadata: Metadata = {
  title: "Insurance Appeal Letter Guides & Formal Blueprints | ClaimAppeal AI",
  description: "Learn how to draft formal, legally binding insurance claim appeal letters for medical necessity, prior authorization, and out-of-network denials.",
  alternates: {
    canonical: "/appeal-letter",
  },
};

export default function AppealLetterHubPage() {
  return <CategoryHubPage category="appeal-letter" />;
}
