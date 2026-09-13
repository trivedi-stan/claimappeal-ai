import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Lock, ShieldCheck, Database, EyeOff, Server, FileText } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Privacy Policy | ClaimAppeal AI",
  description:
    "Learn how ClaimAppeal AI safeguards your medical records, EOBs, and personal health data with zero-model-training guarantees and AES-256 encryption.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20">
      <SiteHeader />

      <main className="flex-1 py-12 md:py-16">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6">
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

          {/* Header */}
          <div className="space-y-3 pb-8 border-b border-border">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Lock className="h-3.5 w-3.5" />
              Data Protection &amp; HIPAA-Conscious Design
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Privacy Policy
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Effective Date: September 13, 2026 • Version 2.2
            </p>
          </div>

          {/* Zero Model Training Guarantee Callout Box */}
          <div className="my-8 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 sm:p-6 text-emerald-950 dark:text-emerald-200">
            <div className="flex items-start gap-3.5">
              <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
              <div className="space-y-1.5 text-xs sm:text-sm leading-relaxed">
                <p className="font-semibold text-emerald-900 dark:text-emerald-300">
                  Zero-Health-Data Model Training Guarantee
                </p>
                <p>
                  ClaimAppeal AI strictly prohibits the use of your uploaded denial notices, Explanation of Benefits (EOBs), clinical charts, or generated appeal letters to train public or commercial artificial intelligence models. Your clinical and financial data is processed transiently and isolated to your private account.
                </p>
              </div>
            </div>
          </div>

          {/* Main Privacy Policy Content */}
          <div className="prose prose-sm dark:prose-invert max-w-none space-y-10 text-muted-foreground leading-relaxed text-xs sm:text-sm">
            <section id="introduction" className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-foreground">
                1. Introduction
              </h2>
              <p>
                At ClaimAppeal AI (“we”, “our”, or “us”), we respect the deeply sensitive nature of healthcare coverage, medical billing, and clinical diagnoses. This Privacy Policy details how we collect, store, isolate, and safeguard your data when you access our platform and utilize our statutory appeal letter generator.
              </p>
              <p>
                By using the Service, you consent to the data practices described in this policy. If you do not agree, please do not use the Platform or upload documents.
              </p>
            </section>

            <section id="information-collected" className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-foreground">
                2. Information We Collect
              </h2>
              <p>We collect information only to the extent necessary to deliver high-fidelity appeal drafting:</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                <div className="p-4 rounded-lg border border-border bg-card">
                  <div className="flex items-center gap-2 font-semibold text-foreground mb-1 text-xs sm:text-sm">
                    <Database className="h-4 w-4 text-primary" />
                    Account &amp; Auth Information
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Email address, hashed authentication credentials managed through Supabase Auth, account role, and subscription status (e.g. Free 1-appeal allowance vs. Pro).
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-border bg-card">
                  <div className="flex items-center gap-2 font-semibold text-foreground mb-1 text-xs sm:text-sm">
                    <FileText className="h-4 w-4 text-emerald-500" />
                    Denial Documents &amp; Claim Inputs
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Uploaded denial letters, EOB statements, insurer names, claim numbers, CARC/RARC codes, service dates, procedure descriptions, and relevant physician clinical notes.
                  </p>
                </div>
              </div>

              <p>
                <strong>Technical Metadata:</strong> We collect standard operational telemetry including browser user agent, IP address for fraud prevention and rate limiting, timestamps, and error diagnostics.
              </p>
            </section>

            <section id="how-we-use" className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-foreground">
                3. How We Use Your Data
              </h2>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong>Statutory Appeal Generation:</strong> To parse denial reasons, match them against federal statutory standards (ERISA § 503, ACA § 2719), and synthesize formal rebuttal correspondence.
                </li>
                <li>
                  <strong>Account &amp; Quota Enforcement:</strong> To verify active access, track single-use free allowances (1 lifetime appeal), and manage premium subscriptions.
                </li>
                <li>
                  <strong>Security &amp; Abuse Mitigation:</strong> To detect malicious bot activity, brute-force attempts, and unauthorized bulk scanning.
                </li>
              </ul>
              <p>
                We do NOT sell, rent, or monetize personal health data or contact lists to pharmaceutical marketers, brokers, data brokers, or advertising networks.
              </p>
            </section>

            <section id="hipaa" className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-foreground">
                4. HIPAA-Conscious Architectural Security
              </h2>
              <p>
                While ClaimAppeal AI directly serves consumers as an assistive drafting tool, our technology architecture incorporates safeguards aligned with the Health Insurance Portability and Accountability Act (HIPAA) Security Rule:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong>Cryptographic Encryption:</strong> All data is encrypted in transit using Transport Layer Security (TLS 1.3) and at rest utilizing Advanced Encryption Standard (AES-256).
                </li>
                <li>
                  <strong>Row-Level Security (RLS):</strong> Database tables enforcing Postgres Row-Level Security ensure that users can strictly query and access only records linked directly to their authenticated user identifier (`auth.uid() = user_id`).
                </li>
                <li>
                  <strong>Ephemeral Document OCR:</strong> When you upload a denial document or image for scanning, optical character recognition and parsing are processed securely, and files can be purged upon request.
                </li>
              </ul>
            </section>

            <section id="ai-subprocessors" className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-foreground">
                5. AI Sub-Processors &amp; Data Transmission
              </h2>
              <p>
                To generate legal and medical appeal rebuttals, sanitized text excerpts are transmitted to enterprise AI API providers (such as OpenAI Enterprise / Anthropic / Google Cloud Vertex). Under our enterprise service agreements:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Data sent via enterprise APIs is <strong>never</strong> retained for model training or RLHF tuning.</li>
                <li>Payloads are processed under strict zero-data-retention or ephemeral logging policies.</li>
                <li>Data transmissions are secured under TLS 1.3 point-to-point encryption.</li>
              </ul>
            </section>

            <section id="data-retention" className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-foreground">
                6. Data Retention &amp; User Deletion Rights
              </h2>
              <p>
                You retain complete authority over your claim history. At any time, you can:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong>Delete Specific Appeals:</strong> Remove individual appeal drafts from your dashboard, which cascades immediately across database records.
                </li>
                <li>
                  <strong>Account Termination:</strong> Request a complete account wipe by emailing <a href="mailto:privacy@claimappeal.ai" className="text-primary hover:underline">privacy@claimappeal.ai</a> or using the Settings menu. Upon account deletion, all associated health inputs, generated letters, and auth credentials are permanently expunged within 30 days.
                </li>
              </ul>
            </section>

            <section id="cookies" className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-foreground">
                7. Cookies &amp; Local Storage
              </h2>
              <p>
                We maintain a minimal cookie footprint. We do not use third-party tracking pixels (such as Meta Pixel or Google Analytics advertising trackers) that monitor health-related searches.
              </p>
              <p>
                Our cookies and local storage tokens are strictly functional:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Session State:</strong> Supabase authentication tokens stored in secure, HTTP-only cookie headers.</li>
                <li><strong>UI Preferences:</strong> Local storage key storing your preferred theme (Dark vs. Light mode).</li>
              </ul>
            </section>

            <section id="contact-privacy" className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-foreground">
                8. Privacy Officer &amp; Inquiries
              </h2>
              <p>
                If you have questions regarding this Privacy Policy, wish to exercise GDPR/CCPA consumer rights, or require information on data handling practices:
              </p>
              <div className="rounded-lg border border-border bg-card p-4 space-y-1 text-xs">
                <p className="font-semibold text-foreground">ClaimAppeal AI Data Privacy &amp; Security Office</p>
                <p>Email: <a href="mailto:privacy@claimappeal.ai" className="text-primary hover:underline">privacy@claimappeal.ai</a></p>
                <p>Support Ticket: <Link href="/contact" className="text-primary hover:underline">claimappeal.ai/contact</Link></p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
