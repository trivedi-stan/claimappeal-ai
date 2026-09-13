import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Shield,
  Scale,
  FileCheck2,
  Lock,
  Zap,
  CheckCircle,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "About Us | ClaimAppeal AI",
  description:
    "Learn why ClaimAppeal AI was created to level the playing field against algorithmic medical insurance denials with statutory precision and clinical due process.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20">
      <SiteHeader />

      <main className="flex-1 py-12 md:py-16">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6">
          {/* Breadcrumb / Back link */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
              Back to Home
            </Link>
          </div>

          {/* Hero Section */}
          <div className="max-w-3xl space-y-4 mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-primary/20 bg-primary/10 text-primary">
              <Shield className="h-3.5 w-3.5" />
              Our Mission &amp; Technology
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
              Leveling the playing field against automated insurance denials.
            </h1>
            <p className="text-sm sm:text-lg text-muted-foreground leading-relaxed">
              Every year, millions of legitimate medical claims are rejected in seconds by automated carrier algorithms. ClaimAppeal AI equips patients and physicians with statutory precision and clinical evidence to overturn unfair denials.
            </p>
          </div>

          {/* The Problem & Context Grid */}
          <div className="my-12 rounded-2xl border border-border bg-card p-6 sm:p-10 shadow-sm space-y-8">
            <div className="max-w-2xl space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                The Healthcare Denial Asymmetry
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Health plans utilize sophisticated algorithmic review engines to reject claims en masse for vague reasons like &quot;not medically necessary&quot; or &quot;experimental.&quot;
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="rounded-xl border border-border/80 bg-background/50 p-5 space-y-2">
                <div className="text-2xl sm:text-3xl font-extrabold text-primary font-mono">
                  &lt; 0.2%
                </div>
                <h4 className="text-xs font-semibold text-foreground">Appeals Filed</h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Fewer than 1 in 500 denied patients ever file a formal appeal due to complex paperwork and intimidating bureaucratic jargon.
                </p>
              </div>

              <div className="rounded-xl border border-border/80 bg-background/50 p-5 space-y-2">
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-500 font-mono">
                  Up to 70%
                </div>
                <h4 className="text-xs font-semibold text-foreground">Overturn Success Rate</h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  When denials are formally challenged with statutory citations and clinical records, carriers reverse up to 70% of adverse determinations.
                </p>
              </div>

              <div className="rounded-xl border border-border/80 bg-background/50 p-5 space-y-2">
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-500 font-mono">
                  2 Minutes
                </div>
                <h4 className="text-xs font-semibold text-foreground">Drafting Velocity</h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  ClaimAppeal AI synthesizes what used to take hours of legal and medical research into an immediate, citation-backed draft.
                </p>
              </div>
            </div>
          </div>

          {/* Three Core Architectural Pillars */}
          <div className="space-y-8 my-16">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Engineered for Legal &amp; Clinical Rigor
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                We do not write generic letters. Every draft generated by ClaimAppeal AI is anchored in established federal statutes and recognized clinical necessity criteria.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Pillar 1 */}
              <div className="rounded-xl border border-border bg-card p-6 space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Scale className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-foreground text-sm">
                  1. Statutory Anchoring
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Appeals cite federal protections under <strong>ERISA § 503</strong> (29 C.F.R. § 2560.503-1) requiring a full and fair review, carrier disclosure of internal guidelines, and strict procedural compliance under <strong>ACA § 2719</strong> for external reviews.
                </p>
              </div>

              {/* Pillar 2 */}
              <div className="rounded-xl border border-border bg-card p-6 space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                  <FileCheck2 className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-foreground text-sm">
                  2. Code-Level Rebuttal
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Our system parses exact Claim Adjustment Reason Codes (CARC) and Remittance Advice Remark Codes (RARC) like CO-50 or CO-197, pairing them with recognized benchmarks such as <strong>Milliman Care Guidelines (MCG)</strong> and <strong>InterQual</strong>.
                </p>
              </div>

              {/* Pillar 3 */}
              <div className="rounded-xl border border-border bg-card p-6 space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
                  <Lock className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-foreground text-sm">
                  3. Health Data Privacy
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  We guarantee <strong>zero AI model training</strong> on uploaded clinical documents or EOBs. Protected by AES-256 encryption at rest and Supabase Row-Level Security, your health information remains strictly confidential.
                </p>
              </div>
            </div>
          </div>

          {/* Statutory Disclaimers Card */}
          <div className="rounded-xl border border-border bg-muted/40 p-6 sm:p-8 space-y-4 my-12">
            <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
              <AlertCircle className="h-4 w-4 text-primary" />
              Our Commitment &amp; Role as an Assistive Technology
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              ClaimAppeal AI does not provide medical treatment, diagnoses, or formal legal representation. We are not a law firm or medical provider. Our software empowers consumers, advocates, and providers by converting complex denial notices into structured, professional rebuttal drafts that must be reviewed and submitted directly by the subscriber or their healthcare provider.
            </p>
            <div className="flex flex-wrap gap-4 text-xs pt-2">
              <div className="flex items-center gap-1.5 text-foreground">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                <span>1 Free Personalized Appeal Per Account</span>
              </div>
              <div className="flex items-center gap-1.5 text-foreground">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                <span>Instant PDF / Word Compatible Exports</span>
              </div>
              <div className="flex items-center gap-1.5 text-foreground">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                <span>Zero Health Record Model Training</span>
              </div>
            </div>
          </div>

          {/* Bottom CTA Box */}
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-8 text-center space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Ready to challenge an unfair denial?
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
              Draft your first citation-backed rebuttal letter today. Every new account receives one free personalized appeal with full statutory citations.
            </p>
            <div className="pt-2">
              <Link
                href="/appeals/new"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-xs sm:text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity"
              >
                Create Your Free Personalized Appeal
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
