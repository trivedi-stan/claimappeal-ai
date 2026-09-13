import type { Metadata } from "next";
import { CategoryHubPage } from "@/components/seo/CategoryHubPage";

export const metadata: Metadata = {
  title: "Insurance Appeal Letter Templates (Word & PDF) | ClaimAppeal AI",
  description: "Free, customizable appeal letter templates for health insurance, medical necessity, prior authorization, and billing disputes.",
  alternates: {
    canonical: "/templates",
  },
};

export default function TemplatesHubPage() {
  return <CategoryHubPage category="templates" />;
}
