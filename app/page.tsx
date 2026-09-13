import Link from "next/link";
import {
  Shield,
  FileText,
  Clock,
  Zap,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Scale,
  Lock,
  ChevronRight,
  ExternalLink,
  ArrowUpRight,
  FileCheck2,
  Layers,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { getPopularArticles } from "@/lib/blog";

export default function HomePage() {
  const popularArticles = getPopularArticles().slice(0, 3);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/25 selection:text-primary-foreground">
      {/* Navigation Header */}
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 md:pt-32 md:pb-36">
        {/* Radial ambient lighting */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(59,130,246,0.12),transparent)]" />

        <div className="container mx-auto max-w-5xl px-4 sm:px-6 text-center">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.08] px-3 py-1 text-[11px] sm:text-xs font-mono text-primary mb-6 sm:mb-8 max-w-full truncate">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse shrink-0" />
            <span className="truncate">ERISA § 503 & ACA § 2719 Legal Rebuttal Engine</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.12] sm:leading-[1.08] mb-5 sm:mb-6">
            Turn Insurance Denials Into{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-blue-600 to-foreground dark:from-zinc-100 dark:via-blue-200 dark:to-zinc-400">
              Irrefutable Legal Appeals
            </span>
          </h1>

          {/* Subheading */}
          <p className="mx-auto max-w-2xl text-sm sm:text-lg text-muted-foreground leading-relaxed mb-8 sm:mb-10">
            Stop letting automated carrier algorithms deny medically necessary care.
            Synthesize formal, letterhead-ready rebuttals citing clinical guidelines,
            substantive statutory precedents, and treating physician evidence in under 2 minutes.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/signup"
              className="btn-primary w-full sm:w-auto px-7 py-3 text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(59,130,246,0.3)] min-h-[44px]"
            >
              <span>Draft Your First Appeal</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/pricing"
              className="btn-secondary w-full sm:w-auto px-6 py-3 text-sm font-medium inline-flex items-center justify-center gap-2 min-h-[44px]"
            >
              <span>View Membership Tiers</span>
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-muted-foreground font-mono">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              1 Free Personalized Appeal
            </span>
            <span className="hidden sm:inline text-border">·</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              No Credit Card Required
            </span>
            <span className="hidden sm:inline text-border">·</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              HIPAA-Conscious RLS Architecture
            </span>
          </div>

          {/* Product Studio Mockup */}
          <div className="mt-12 sm:mt-20 relative mx-auto max-w-4xl">
            <div className="rounded-xl border border-border bg-card/70 p-2 shadow-2xl backdrop-blur-xl dark:border-white/[0.1] dark:bg-zinc-900/60">
              <div className="rounded-lg border border-border bg-background p-3.5 sm:p-6 text-left space-y-4 dark:border-white/[0.06] dark:bg-zinc-950">
                {/* Studio Header Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3 sm:pb-4 dark:border-white/[0.06]">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex gap-1.5 shrink-0">
                      <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground/40" />
                      <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground/40" />
                      <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground/40" />
                    </div>
                    <span className="text-[11px] sm:text-xs font-mono text-muted-foreground truncate">
                      Appeal Case #CLM-2025-08912 · Aetna PPO
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="badge-cobalt text-[9px] sm:text-[10px]">ERISA § 503</span>
                    <span className="badge-success text-[9px] sm:text-[10px]">Ready to Export</span>
                  </div>
                </div>

                {/* Studio Split Content */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-2">
                  <div className="md:col-span-4 rounded-lg bg-muted/40 border border-border p-3.5 space-y-3 dark:bg-zinc-900/40 dark:border-white/[0.04]">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold block">
                      Rebuttal Intelligence
                    </span>
                    <div className="space-y-2 text-xs">
                      <div className="rounded bg-card p-2 border border-border dark:bg-zinc-950/60 dark:border-white/[0.04]">
                        <span className="text-[10px] text-muted-foreground block">CARC Denial Code</span>
                        <span className="font-mono text-red-500 dark:text-red-400 font-medium">CO-50 (Not Medically Necessary)</span>
                      </div>
                      <div className="rounded bg-card p-2 border border-border dark:bg-zinc-950/60 dark:border-white/[0.04]">
                        <span className="text-[10px] text-muted-foreground block">Treating Physician</span>
                        <span className="text-foreground">Dr. Robert Vance, MD (Orthopedics)</span>
                      </div>
                      <div className="rounded bg-card p-2 border border-border dark:bg-zinc-950/60 dark:border-white/[0.04]">
                        <span className="text-[10px] text-muted-foreground block">Disputed Charge</span>
                        <span className="font-mono text-foreground font-bold">$4,850.00</span>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-8 rounded-lg bg-muted/40 border border-border p-4 space-y-2.5 font-mono text-[11px] leading-relaxed text-foreground/90 dark:bg-zinc-900/40 dark:border-white/[0.04] dark:text-zinc-300">
                    <div className="text-muted-foreground uppercase text-[10px] border-b border-border dark:border-white/[0.04] pb-2 flex justify-between">
                      <span>Formal Demand for Reconsideration</span>
                      <span>Page 1 of 3</span>
                    </div>
                    <p className="text-muted-foreground">
                      ATTN: Appeals & Grievance Committee, Aetna Health Inc.
                      <br />
                      RE: Expedited First-Level Appeal for Prior Authorization Denial
                    </p>
                    <p className="text-foreground">
                      Pursuant to 29 U.S.C. § 1133 (ERISA § 503) and 29 C.F.R. § 2560.503-1, this letter serves as a formal rebuttal to your adverse benefit determination dated January 14, 2025...
                    </p>
                    <p className="text-muted-foreground italic">
                      &ldquo;The treating provider documented comprehensive failure of conservative management over 12 weeks, satisfying all criteria under Milliman Care Guidelines (MCG) Section A-0291...&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="protocol" className="border-t border-border py-24 bg-muted/30">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-primary">
              Systematic Methodology
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              How ClaimAppeal AI Overturns Denials
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Engineered by medical billing advocates and legal engineers to systematically dismantle standard carrier denial codes.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Intake Case Parameters",
                desc: "Provide your carrier name, denial code (e.g. CO-50, PR-96), procedure CPT codes, and treating provider notes through a 7-step guided intake protocol.",
              },
              {
                step: "02",
                title: "Statutory Rebuttal Synthesis",
                desc: "Our engine maps the denial reason against ERISA regulations, ACA standards, and medical necessity frameworks to formulate a clinical and statutory argument.",
              },
              {
                step: "03",
                title: "Letterhead PDF Delivery",
                desc: "Review the draft in a dual-pane studio, inspect required medical records exhibits, and export a formal letter ready for submission by mail, fax, or portal.",
              },
            ].map((item) => (
              <div key={item.step} className="cinematic-card p-6 sm:p-8 space-y-4">
                <span className="text-xs font-mono font-bold text-primary block">
                  {item.step} / PROTOCOL
                </span>
                <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Capabilities Grid */}
      <section id="features" className="border-t border-border py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-primary">
              Architecture & Compliance
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Engineered for Clinical & Legal Scrutiny
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Carrier medical directors scrutinize appeals with skeptical eyes. Every ClaimAppeal draft is built with institutional rigor.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Scale,
                title: "Statutory Citation Engine",
                desc: "Grounds arguments in ERISA § 503, ACA § 2719, and 29 C.F.R. § 2560.503-1 timeliness requirements.",
              },
              {
                icon: Shield,
                title: "Zero-Hallucination Guard",
                desc: "Never fabricates diagnosis codes or policy terms. Missing documentation is cleanly flagged as an exhibit checklist.",
              },
              {
                icon: FileCheck2,
                title: "CARC & RARC Code Decoding",
                desc: "Directly translates cryptic Remittance Advice codes into concrete legal rebuttals.",
              },
              {
                icon: FileText,
                title: "Official Letterhead PDF Export",
                desc: "Generates high-contrast, clean vector PDFs formatted for automated insurance scanning and OCR intake.",
              },
              {
                icon: Layers,
                title: "Immutable Revision History",
                desc: "Every version generated is saved with timestamped audit logs for subsequent Level 2 or external appeals.",
              },
              {
                icon: Lock,
                title: "Health Data Isolation",
                desc: "Supabase Row-Level Security (RLS) guarantees complete cryptographic isolation of your claim files.",
              },
            ].map((f) => (
              <div key={f.title} className="cinematic-card p-6 space-y-3">
                <f.icon className="h-5 w-5 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Blog & Legal Appeal Guides */}
      <section className="border-t border-border py-20 bg-muted/20">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-primary">
                Educational Resources &amp; Guides
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Insurance Denial Playbooks &amp; Legal Guides
              </h2>
              <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
                Step-by-step guides, statutory citations (ERISA, ACA), and clinical evidence templates to help you overcome denied claims.
              </p>
            </div>
            <Link
              href="/blog"
              className="text-xs font-semibold text-primary hover:text-primary/80 inline-flex items-center gap-1.5 shrink-0 self-start sm:self-auto py-2 px-3 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors"
            >
              <span>View All Blog Articles</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {popularArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="border-t border-border py-24 bg-muted/40 relative overflow-hidden">
        <div className="container mx-auto max-w-4xl px-6 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Fight Unjust Denials with Legal Precision
          </h2>
          <p className="mx-auto max-w-xl text-sm text-muted-foreground leading-relaxed">
            Begin with 1 free personalized appeal for your account. Upgrade to Pro for 10 personalized appeals per month, priority drafting, and clinical documentation analysis.
          </p>
          <div className="pt-2">
            <Link
              href="/signup"
              className="btn-primary px-8 py-3.5 text-sm font-semibold inline-flex items-center gap-2 shadow-[0_0_25px_rgba(59,130,246,0.3)]"
            >
              <span>Create Your Free Personalized Appeal</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}
