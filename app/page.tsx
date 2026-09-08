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

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-blue-500/30 selection:text-blue-200">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.08] bg-zinc-950/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Shield className="h-4.5 w-4.5" />
            </div>
            <span className="text-base font-semibold tracking-tight text-zinc-100">
              ClaimAppeal<span className="text-blue-400 ml-1 font-mono text-xs font-bold">AI</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-xs font-medium text-zinc-400">
            <a href="#features" className="hover:text-zinc-200 transition-colors">
              Verification Engine
            </a>
            <a href="#protocol" className="hover:text-zinc-200 transition-colors">
              Intake Protocol
            </a>
            <Link href="/pricing" className="hover:text-zinc-200 transition-colors">
              Pricing
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors px-3 py-1.5"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="btn-primary text-xs px-4 py-2 inline-flex items-center gap-1.5 font-medium shadow-[0_0_20px_rgba(59,130,246,0.25)]"
            >
              Start Free Draft
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-32 md:pb-36">
        {/* Radial ambient lighting */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(59,130,246,0.12),rgba(255,255,255,0))]" />

        <div className="container mx-auto max-w-5xl px-6 text-center">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/[0.08] px-3.5 py-1 text-xs font-mono text-blue-400 mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span>ERISA § 503 & ACA § 2719 Legal Rebuttal Engine</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-zinc-100 leading-[1.08] mb-6">
            Turn Insurance Denials Into{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-blue-200 to-zinc-400">
              Irrefutable Legal Appeals
            </span>
          </h1>

          {/* Subheading */}
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-zinc-400 leading-relaxed mb-10">
            Stop letting automated carrier algorithms deny medically necessary care.
            Synthesize formal, letterhead-ready rebuttals citing clinical guidelines,
            substantive statutory precedents, and treating physician evidence in under 2 minutes.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/signup"
              className="btn-primary w-full sm:w-auto px-7 py-3 text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(59,130,246,0.3)]"
            >
              <span>Draft Your First Appeal</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/pricing"
              className="btn-secondary w-full sm:w-auto px-6 py-3 text-sm font-medium inline-flex items-center justify-center gap-2"
            >
              <span>View Membership Tiers</span>
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-500 font-mono">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              3 Free Appeals / Month
            </span>
            <span className="hidden sm:inline text-zinc-700">·</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              No Credit Card Required
            </span>
            <span className="hidden sm:inline text-zinc-700">·</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              HIPAA-Conscious RLS Architecture
            </span>
          </div>

          {/* Product Studio Mockup (Linear / Raycast Style) */}
          <div className="mt-16 sm:mt-20 relative mx-auto max-w-4xl">
            <div className="rounded-xl border border-white/[0.1] bg-zinc-900/60 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl">
              <div className="rounded-lg border border-white/[0.06] bg-zinc-950 p-4 sm:p-6 text-left space-y-4">
                {/* Studio Header Bar */}
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                      <div className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                      <div className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                    </div>
                    <span className="text-xs font-mono text-zinc-400">
                      Appeal Case #CLM-2025-08912 · Aetna Commercial PPO
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="badge-cobalt text-[10px]">ERISA § 503 Formatted</span>
                    <span className="badge-success text-[10px]">Ready to Export</span>
                  </div>
                </div>

                {/* Studio Split Content */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-2">
                  <div className="md:col-span-4 rounded-lg bg-zinc-900/40 border border-white/[0.04] p-3.5 space-y-3">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold block">
                      Rebuttal Intelligence
                    </span>
                    <div className="space-y-2 text-xs">
                      <div className="rounded bg-zinc-950/60 p-2 border border-white/[0.04]">
                        <span className="text-[10px] text-zinc-500 block">CARC Denial Code</span>
                        <span className="font-mono text-red-400 font-medium">CO-50 (Not Medically Necessary)</span>
                      </div>
                      <div className="rounded bg-zinc-950/60 p-2 border border-white/[0.04]">
                        <span className="text-[10px] text-zinc-500 block">Treating Physician</span>
                        <span className="text-zinc-300">Dr. Robert Vance, MD (Orthopedics)</span>
                      </div>
                      <div className="rounded bg-zinc-950/60 p-2 border border-white/[0.04]">
                        <span className="text-[10px] text-zinc-500 block">Disputed Charge</span>
                        <span className="font-mono text-zinc-100 font-bold">$4,850.00</span>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-8 rounded-lg bg-zinc-900/40 border border-white/[0.04] p-4 space-y-2.5 font-mono text-[11px] leading-relaxed text-zinc-300">
                    <div className="text-zinc-500 uppercase text-[10px] border-b border-white/[0.04] pb-2 flex justify-between">
                      <span>Formal Demand for Reconsideration</span>
                      <span>Page 1 of 3</span>
                    </div>
                    <p className="text-zinc-400">
                      ATTN: Appeals & Grievance Committee, Aetna Health Inc.
                      <br />
                      RE: Expedited First-Level Appeal for Prior Authorization Denial
                    </p>
                    <p className="text-zinc-300">
                      Pursuant to 29 U.S.C. § 1133 (ERISA § 503) and 29 C.F.R. § 2560.503-1, this letter serves as a formal rebuttal to your adverse benefit determination dated January 14, 2025...
                    </p>
                    <p className="text-zinc-400 italic">
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
      <section id="protocol" className="border-t border-white/[0.08] py-24 bg-zinc-950/40">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-blue-400">
              Systematic Methodology
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
              How ClaimAppeal AI Overturns Denials
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
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
                <span className="text-xs font-mono font-bold text-blue-400 block">
                  {item.step} / PROTOCOL
                </span>
                <h3 className="text-base font-semibold text-zinc-100">{item.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Capabilities Grid */}
      <section id="features" className="border-t border-white/[0.08] py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-blue-400">
              Architecture & Compliance
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
              Engineered for Clinical & Legal Scrutiny
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
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
                <f.icon className="h-5 w-5 text-blue-400" />
                <h3 className="text-sm font-semibold text-zinc-200">{f.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="border-t border-white/[0.08] py-24 bg-zinc-950/60 relative overflow-hidden">
        <div className="container mx-auto max-w-4xl px-6 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-100">
            Fight Unjust Denials with Legal Precision
          </h2>
          <p className="mx-auto max-w-xl text-sm text-zinc-400 leading-relaxed">
            Begin with 3 free appeals each month. Upgrade to Pro for unlimited generation, priority drafting, and clinical documentation analysis.
          </p>
          <div className="pt-2">
            <Link
              href="/signup"
              className="btn-primary px-8 py-3.5 text-sm font-semibold inline-flex items-center gap-2 shadow-[0_0_25px_rgba(59,130,246,0.3)]"
            >
              <span>Create Your Free Appeal Draft</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-zinc-950 py-12 text-xs text-zinc-500">
        <div className="container mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <Shield className="h-4 w-4 text-blue-400" />
            <span className="font-semibold text-zinc-300">
              ClaimAppeal<span className="text-blue-400 font-mono">AI</span>
            </span>
          </div>

          <p className="max-w-xl text-center md:text-left text-[11px] leading-relaxed text-zinc-500">
            ClaimAppeal AI is a technical drafting assistant and does not provide legal representation or medical diagnosis. All generated rebuttals must be reviewed by the member or treating provider before submission.
          </p>

          <p className="font-mono text-[11px]">
            © {new Date().getFullYear()} ClaimAppeal AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
