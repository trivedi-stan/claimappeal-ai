import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Shield, ArrowRight, Layers, FileText, ShieldAlert, HelpCircle, Copy, FileCheck2 } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SearchIntentHub } from "@/components/seo/SearchIntentHub";
import { SEO_CATEGORIES } from "@/data/seo-content/intent-database";

export const metadata: Metadata = {
  title: "Claim Appeal Resources & Knowledge Engine | ClaimAppeal AI",
  description: "Search hundreds of statutory playbooks, appeal letter templates, and denial reason rebuttals for health, hospital, dental, and medical insurance claims.",
  alternates: {
    canonical: "/resources",
  },
};

const categoryIcons: Record<string, any> = {
  guides: BookOpen,
  "appeal-letter": FileText,
  "denial-reasons": ShieldAlert,
  "insurance-types": Layers,
  "claim-denial": HelpCircle,
  templates: Copy,
  "claim-help": FileCheck2,
};

export default function ResourcesDirectoryPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20">
      <SiteHeader />

      <main className="flex-1 py-12 md:py-16">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 space-y-16">
          {/* Header Banner */}
          <section className="text-center max-w-3xl mx-auto space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border border-primary/20 bg-primary/10 text-primary">
              <Shield className="h-3.5 w-3.5" />
              <span>ClaimAppeal AI Search Intent Knowledge Engine</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
              Insurance Claim Help &amp; Appeal Directory
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Search by your specific denial reason, claim type, or insurance carrier to discover statutory appeal playbooks, clinical evidence checklists, and formal letter templates.
            </p>
          </section>

          {/* 7 Category Exploration Cards */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SEO_CATEGORIES.map((cat) => {
              const IconComp = categoryIcons[cat.category] || BookOpen;
              return (
                <Link
                  key={cat.category}
                  href={cat.pathPrefix}
                  className="group rounded-xl border border-border bg-card p-5 hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary">
                      <IconComp className="h-4.5 w-4.5" />
                    </div>
                    <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center gap-1 text-xs font-semibold text-primary">
                    <span>Browse Hub</span>
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </section>

          {/* Interactive Search Intent Hub */}
          <section id="search-directory">
            <SearchIntentHub />
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
