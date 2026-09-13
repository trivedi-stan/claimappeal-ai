import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Sparkles, Shield, AlertTriangle } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getAllArticles, getAllCategories, getFeaturedArticle } from "@/lib/blog";
import { FeaturedArticle } from "@/components/blog/FeaturedArticle";
import { CategoryFilter } from "@/components/blog/CategoryFilter";
import { BlogSearch } from "@/components/blog/BlogSearch";
import { PopularGuides } from "@/components/blog/PopularGuides";
import { ProductCTA } from "@/components/blog/ProductCTA";
import { NewsletterSignup } from "@/components/blog/NewsletterSignup";
import { BreadcrumbJsonLd } from "@/components/blog/JsonLd";

export const metadata: Metadata = {
  title: "Insurance Claims, Denials & Appeals — Explained | ClaimAppeal AI",
  description:
    "Clear, practical guides to help you understand insurance denials, prepare stronger appeals under ERISA and ACA rules, and navigate the medical billing process.",
  alternates: {
    canonical: "https://claimappeal.ai/blog",
  },
  openGraph: {
    title: "Insurance Claims, Denials & Appeals — Explained | ClaimAppeal AI",
    description:
      "Clear, practical guides to help you understand insurance denials, prepare stronger appeals under ERISA and ACA rules, and navigate the medical billing process.",
    url: "https://claimappeal.ai/blog",
    type: "website",
  },
};

export default function BlogLandingPage() {
  const articles = getAllArticles();
  const categories = getAllCategories();
  const featuredArticle = getFeaturedArticle();

  const breadcrumbs = [
    { name: "Home", url: "https://claimappeal.ai" },
    { name: "Blog", url: "https://claimappeal.ai/blog" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20">
      <BreadcrumbJsonLd items={breadcrumbs} />
      <SiteHeader />

      <main className="flex-1 py-12 md:py-16">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 space-y-16">
          {/* Hero Section */}
          <section className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border border-primary/20 bg-primary/10 text-primary">
              <BookOpen className="h-3.5 w-3.5" />
              Patient Due Process &amp; Denial Education
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
              Insurance Claims, Denials &amp; Appeals — Explained
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Clear, practical guides to help you understand insurance denials, prepare stronger appeals, and navigate the claims process.
            </p>

            {/* Primary Hero CTA */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/appeals/new"
                className="btn-primary w-full sm:w-auto px-7 py-3 text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
              >
                <span>Appeal My Claim</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <span className="text-[11px] text-muted-foreground font-medium">
                1 Lifetime Free Appeal Included
              </span>
            </div>
          </section>

          {/* Featured Article */}
          <section aria-label="Featured guide">
            <FeaturedArticle article={featuredArticle} />
          </section>

          {/* Popular Insurance Guides Section */}
          <section aria-label="Popular guides">
            <PopularGuides />
          </section>

          {/* Search and Category Browsing Section */}
          <section id="browse-articles" className="space-y-8 pt-4">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                    All Guides &amp; Educational Articles
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Search or filter through our complete library of statutory rebuttal resources.
                  </p>
                </div>
              </div>

              {/* Category Filter Pills */}
              <CategoryFilter categories={categories} />
            </div>

            {/* Interactive Search Component */}
            <BlogSearch initialArticles={articles} />
          </section>

          {/* Mid-Page Product CTA */}
          <section aria-label="Product callout">
            <ProductCTA
              headline="Your claim was denied. What now?"
              subtext="Don't let an automated rejection cost you thousands. ClaimAppeal AI cross-references your denial codes against federal statutes and clinical criteria to build a customized appeal draft in minutes."
              buttonText="Start My Appeal"
              location="blog_home_mid_cta"
            />
          </section>

          {/* Newsletter Subscription Card */}
          <section aria-label="Newsletter">
            <NewsletterSignup />
          </section>

          {/* Subtle Educational Disclaimer */}
          <div className="rounded-xl border border-border/80 bg-muted/20 p-5 text-[11px] leading-relaxed text-muted-foreground space-y-1">
            <p className="font-semibold text-foreground flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
              Educational &amp; Informational Notice:
            </p>
            <p>
              Content on Claim Appeal AI is provided for general educational purposes and is not a substitute for professional medical, legal, or insurance advice. Always review your insurer&apos;s official instructions and policy documents.
            </p>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
