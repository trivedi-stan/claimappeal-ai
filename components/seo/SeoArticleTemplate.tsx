"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Shield,
  Clock,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ArrowRight,
  Copy,
  Check,
  Scale,
  FileText,
  FileCheck2,
  Sparkles,
  HelpCircle,
  FolderOpen,
} from "lucide-react";
import { SeoArticle } from "@/types/seo-content";
import { getCategoryMeta, getRelatedSeoArticles } from "@/lib/seo-engine";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { trackEvent } from "@/lib/analytics";

interface SeoArticleTemplateProps {
  article: SeoArticle;
}

export function SeoArticleTemplate({ article }: SeoArticleTemplateProps) {
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const categoryMeta = getCategoryMeta(article.category);
  const relatedArticles = getRelatedSeoArticles(article, 4);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://claimappeal-ai.vercel.app";
  const canonicalUrl = `${baseUrl}${article.canonicalPath}`;

  const copySampleText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2500);
    trackEvent({
      name: "sample_letter_copied",
      article_slug: article.slug,
      category: article.category,
    });
  };

  // Structured Data (JSON-LD)
  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.metaDescription,
    url: canonicalUrl,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {
      "@type": "Organization",
      name: "ClaimAppeal AI Legal & Clinical Research Team",
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "ClaimAppeal AI",
      url: baseUrl,
      logo: `${baseUrl}/icon.png`,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
  };

  const jsonLdBreadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: categoryMeta.shortTitle,
        item: `${baseUrl}${categoryMeta.pathPrefix}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: canonicalUrl,
      },
    ],
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: article.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20">
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumbs) }}
      />
      {article.faq && article.faq.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
        />
      )}

      <SiteHeader />

      <main className="flex-1 py-10 md:py-14">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 space-y-12">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
            <Link href="/blog" className="hover:text-foreground transition-colors">
              Resources
            </Link>
            <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
            <Link
              href={categoryMeta.pathPrefix}
              className="hover:text-foreground transition-colors text-foreground font-medium"
            >
              {categoryMeta.shortTitle}
            </Link>
            <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
            <span className="text-muted-foreground truncate max-w-[200px] sm:max-w-xs">
              {article.title}
            </span>
          </nav>

          {/* Article Header & Metadata */}
          <header className="space-y-4 border-b border-border/80 pb-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${categoryMeta.badgeColor}`}>
                <Shield className="h-3 w-3" />
                <span>{categoryMeta.shortTitle}</span>
              </span>

              {article.denialCode && (
                <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded border border-primary/30 bg-primary/10 text-primary">
                  <span>CARC {article.denialCode}</span>
                </span>
              )}

              <span className="text-xs text-muted-foreground flex items-center gap-1 font-mono ml-auto">
                <Clock className="h-3 w-3" />
                {article.readingTime}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
              {article.h1}
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {article.excerpt}
            </p>

            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
              <span>By ClaimAppeal AI Legal &amp; Clinical Research Team</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Updated {article.updatedAt}
              </span>
            </div>
          </header>

          {/* Executive Summary / Key Takeaways Box */}
          <section className="rounded-2xl border border-primary/20 bg-primary/5 p-6 md:p-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-primary tracking-wider uppercase">
              <Sparkles className="h-4 w-4" />
              <span>Key Takeaways &amp; Executive Summary</span>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm text-foreground/90">
              {article.executiveSummary.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Section: Why This Denial Happens & What It Means */}
          <section className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <span>Why Did This Denial Happen &amp; What It Means</span>
            </h2>

            <div className="grid gap-6 sm:grid-cols-2 text-xs sm:text-sm">
              <div className="rounded-xl border border-border bg-card p-5 space-y-3">
                <h3 className="font-semibold text-foreground text-sm flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  Carrier Rejection Rationale
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {article.whyThisHappens.overview}
                </p>
                <div className="pt-2 border-t border-border/60 space-y-1.5">
                  <span className="text-xs font-semibold text-foreground">Common Carrier Tactics:</span>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 text-xs">
                    {article.whyThisHappens.carrierTactics.map((tactic, idx) => (
                      <li key={idx}>{tactic}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-5 space-y-3">
                <h3 className="font-semibold text-foreground text-sm flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-blue-500" />
                  What This Means For You
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {article.whatItMeans.plainEnglish}
                </p>
                <div className="pt-2 border-t border-border/60 space-y-2 text-xs">
                  <div>
                    <span className="font-semibold text-foreground block">Financial Responsibility:</span>
                    <span className="text-muted-foreground">{article.whatItMeans.financialLiability}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-foreground block">Filing Deadline:</span>
                    <span className="text-primary font-mono font-medium">{article.whatItMeans.timelinesNotice}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Required Documents Checklist */}
          {article.requiredDocuments && article.requiredDocuments.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <FileCheck2 className="h-5 w-5 text-emerald-500" />
                <span>Evidence Checklist: Documents You Need to Overturn</span>
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Appeals backed by objective documentary evidence have a dramatically higher overturn rate. Assemble these items:
              </p>

              <div className="rounded-xl border border-border divide-y divide-border/60 bg-card overflow-hidden">
                {article.requiredDocuments.map((doc, idx) => (
                  <div key={idx} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground text-sm">{doc.name}</span>
                        {doc.isRequired ? (
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-500">
                            Required
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                            Recommended
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground">{doc.purpose}</p>
                    </div>
                    <div className="text-[11px] text-muted-foreground font-mono bg-muted/60 px-2.5 py-1 rounded shrink-0 self-start sm:self-auto border border-border/60">
                      Source: {doc.source}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Section: Step-by-Step Appeal Playbook */}
          <section className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <span>Step-by-Step Appeal Playbook</span>
            </h2>

            <div className="space-y-4">
              {article.stepByStepPlaybook.map((item) => (
                <div key={item.step} className="rounded-xl border border-border bg-card/60 p-5 md:p-6 space-y-2.5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary font-mono text-xs font-bold shrink-0">
                      0{item.step}
                    </span>
                    <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pl-10">
                    {item.instructions}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Statutory Precedents Callout */}
          {article.statutoryPrecedents && article.statutoryPrecedents.length > 0 && (
            <section className="rounded-2xl border border-primary/30 bg-card p-6 md:p-8 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-primary uppercase">
                <Scale className="h-4 w-4" />
                <span>Statutory Authority &amp; Legal Citations</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Insurers are bound by federal administrative regulations. Citing these specific statutory rules in your appeal prevents arbitrary denials:
              </p>
              <div className="grid gap-4 sm:grid-cols-2 pt-2">
                {article.statutoryPrecedents.map((stat, idx) => (
                  <div key={idx} className="rounded-xl border border-border/80 bg-background/80 p-4 space-y-1.5 text-xs">
                    <span className="font-mono font-bold text-primary block">{stat.statute}</span>
                    <span className="font-semibold text-foreground block">{stat.rule}</span>
                    <p className="text-muted-foreground text-[11px] leading-relaxed">{stat.practicalImpact}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Section: Sample Letter Excerpt */}
          {article.sampleLetterExcerpt && (
            <section className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <span>{article.sampleLetterExcerpt.heading}</span>
                  </h2>
                  <p className="text-xs text-muted-foreground">{article.sampleLetterExcerpt.scenario}</p>
                </div>
                <button
                  type="button"
                  onClick={() => copySampleText(article.sampleLetterExcerpt!.content)}
                  className="btn-secondary text-xs px-3 py-1.5 inline-flex items-center gap-1.5 shrink-0"
                >
                  {copiedSnippet ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedSnippet ? "Copied" : "Copy Excerpt"}</span>
                </button>
              </div>

              <div className="rounded-xl border border-border bg-muted/40 p-5 font-mono text-xs text-foreground/90 whitespace-pre-wrap leading-relaxed overflow-x-auto shadow-inner">
                {article.sampleLetterExcerpt.content}
              </div>
            </section>
          )}

          {/* High-Intent Conversion CTA Box */}
          <section className="rounded-2xl border border-primary/40 bg-gradient-to-br from-primary/15 via-card to-background p-8 md:p-10 space-y-6 text-center shadow-lg relative overflow-hidden">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 border border-primary/30 text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{article.cta.badgeText || "1 Lifetime Free Appeal Included"}</span>
            </div>

            <div className="space-y-2 max-w-xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                {article.cta.headline}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {article.cta.subtext}
              </p>
            </div>

            <div>
              <Link
                href={`/signup?reason=${encodeURIComponent(article.cta.prefillReason || article.category)}&type=${encodeURIComponent(article.cta.prefillInsurance || article.insuranceType)}`}
                onClick={() =>
                  trackEvent({
                    name: "seo_cta_clicked",
                    slug: article.slug,
                    category: article.category,
                    intent: article.searchIntent,
                  })
                }
                className="btn-primary text-sm px-8 py-3.5 font-semibold inline-flex items-center gap-2 shadow-[0_0_25px_rgba(59,130,246,0.35)]"
              >
                <span>{article.cta.buttonText}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Zero credit card required • Instant letterhead PDF export • HIPAA-grade RLS security
            </p>
          </section>

          {/* Section: Frequently Asked Questions */}
          {article.faq && article.faq.length > 0 && (
            <section className="space-y-4 pt-4">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" />
                <span>Frequently Asked Questions</span>
              </h2>

              <div className="space-y-3">
                {article.faq.map((item, idx) => (
                  <div key={idx} className="rounded-xl border border-border bg-card p-5 space-y-2">
                    <h3 className="text-sm font-semibold text-foreground">{item.question}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Section: Related Claim Help & Cross-Intent Internal Linking */}
          {relatedArticles && relatedArticles.length > 0 && (
            <section className="space-y-6 pt-6 border-t border-border/80">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-primary">
                    Related Claim Help &amp; Resources
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-1">
                    Continue Your Appeal Strategy
                  </h2>
                </div>
                <Link
                  href="/blog"
                  className="text-xs font-semibold text-primary hover:text-primary/80 inline-flex items-center gap-1 shrink-0"
                >
                  <span>All Resources</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {relatedArticles.map((rel) => {
                  const relMeta = getCategoryMeta(rel.category);
                  return (
                    <Link
                      key={rel.id}
                      href={rel.canonicalPath}
                      className="group rounded-xl border border-border bg-card p-5 hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between gap-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                          <span className={`px-2 py-0.5 rounded-full border ${relMeta.badgeColor} font-medium`}>
                            {relMeta.shortTitle}
                          </span>
                          <span className="font-mono">{rel.readingTime}</span>
                        </div>
                        <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
                          {rel.title}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {rel.excerpt}
                        </p>
                      </div>

                      <div className="text-xs font-semibold text-primary flex items-center gap-1 pt-1">
                        <span>Read Guide</span>
                        <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* Legal Informational Notice */}
          <footer className="rounded-xl border border-border/60 bg-muted/20 p-5 text-[11px] leading-relaxed text-muted-foreground space-y-1">
            <p className="font-semibold text-foreground flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
              <span>Legal Notice &amp; Disclaimer:</span>
            </p>
            <p>
              ClaimAppeal AI provides self-help software and educational materials. The information presented does not constitute legal or medical advice. Health plans vary; always review your plan&apos;s Summary Plan Description (SPD) and official adverse benefit determination notices for exact procedural requirements.
            </p>
          </footer>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
