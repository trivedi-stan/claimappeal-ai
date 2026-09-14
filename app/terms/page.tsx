import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, AlertTriangle, ShieldCheck, Mail } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Terms of Service | ClaimAppeal AI",
  description:
    "Read the terms and conditions for using ClaimAppeal AI's statutory medical insurance denial drafting platform.",
};

export default function TermsPage() {
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
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-primary/20 bg-primary/10 text-primary">
              <ShieldCheck className="h-3.5 w-3.5" />
              Legal Documentation
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Terms of Service
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Last updated: September 13, 2026 • Version 2.4
            </p>
          </div>

          {/* Important Legal Callout Box (DocuGov-style) */}
          <div className="my-8 rounded-xl border border-amber-500/30 bg-amber-500/10 p-5 sm:p-6 text-amber-900 dark:text-amber-200">
            <div className="flex items-start gap-3.5">
              <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="space-y-1.5 text-xs sm:text-sm leading-relaxed">
                <p className="font-semibold text-amber-800 dark:text-amber-300">
                  Important Notice: Not a Law Firm or Healthcare Provider
                </p>
                <p>
                  ClaimAppeal AI provides software productivity tools to assist individuals and healthcare providers in drafting structured medical insurance denial appeal letters. We do not provide legal advice, medical diagnosis, or patient representation. Using this service does not create an attorney-client or doctor-patient relationship.
                </p>
              </div>
            </div>
          </div>

          {/* Legal Content Sections */}
          <div className="prose prose-sm dark:prose-invert max-w-none space-y-10 text-muted-foreground leading-relaxed text-xs sm:text-sm">
            <section id="acceptance" className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-foreground">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing or using the ClaimAppeal AI platform (“Service”, “Platform”, “we”, “our”, or “us”), you agree to be bound by these Terms of Service (“Terms”). If you are using the Service on behalf of an organization or medical practice, you represent and warrant that you have authority to bind that entity to these Terms.
              </p>
              <p>
                If you do not agree to all provisions of these Terms, you must immediately discontinue use of the Service.
              </p>
            </section>

            <section id="description" className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-foreground">
                2. Description of Service
              </h2>
              <p>
                ClaimAppeal AI is an automated productivity application that analyzes Explanation of Benefits (EOB) statements, carrier denial notices, and clinical notes to generate structured, statutory medical appeal letters grounded in ERISA § 503, ACA § 2719, and standard Claim Adjustment Reason Codes (CARC/RARC).
              </p>
              <p>
                The Service provides drafting templates, legal statute references, and clinical guidelines lookup (e.g., Milliman Care Guidelines, InterQual). The Service does not submit appeals on your behalf directly to insurance carriers unless expressly contracted through an authorized enterprise integration.
              </p>
            </section>

            <section id="no-advice" className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-foreground">
                3. No Legal, Financial, or Medical Advice
              </h2>
              <p>
                The contents of this Platform, including generated appeal letters, statutory citations, and suggested rebuttals, are generated by algorithmic models and are provided solely for informational and drafting assistance.
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong>No Attorney-Client Privilege:</strong> Communications through ClaimAppeal AI are not protected by attorney-client privilege.
                </li>
                <li>
                  <strong>No Medical Diagnosis or Treatment:</strong> The Service does not replace medical judgment. All clinical statements must be confirmed by the treating physician.
                </li>
                <li>
                  <strong>Mandatory User Verification:</strong> You are strictly responsible for reviewing every appeal letter for factual correctness, policy validity, and clinical accuracy before submitting it to any insurer, state insurance commissioner, or review board.
                </li>
              </ul>
            </section>

            <section id="accounts" className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-foreground">
                4. User Accounts &amp; Security
              </h2>
              <p>
                To utilize the Service, you may be required to register an account using Supabase authentication or magic links. You agree to provide accurate and complete registration information and maintain the security of your credentials. You are solely responsible for any activity that occurs under your account.
              </p>
              <p>
                Sharing accounts across unaffiliated third parties without explicit enterprise licensing is strictly prohibited.
              </p>
            </section>

            <section id="quotas-billing" className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-foreground">
                5. Free Quota, Subscriptions &amp; Billing
              </h2>
              <p>
                ClaimAppeal AI offers both free and premium access tiers:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong>Free Tier Allowance:</strong> Each new user account receives one (1) free personalized appeal per account for lifetime. This quota is granted upon account creation and does not reset monthly.
                </li>
                <li>
                  <strong>Pro &amp; Business Subscriptions:</strong> Users may upgrade to paid subscriptions for higher monthly personalized appeal quotas, multi-phase intake protocols, priority clinical guidance retrieval, and custom PDF export formatting.
                </li>
                <li>
                  <strong>Refunds:</strong> Because generated appeals and AI processing incur direct compute and statutory database indexing costs, payments are generally non-refundable once an appeal letter has been processed, except where required by applicable consumer law.
                </li>
              </ul>
            </section>

            <section id="user-responsibilities" className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-foreground">
                6. User Responsibilities &amp; Uploaded Records
              </h2>
              <p>
                When uploading denial letters, EOBs, or clinical records to the Platform:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  You certify that you are the insured patient, the authorized policyholder, or an authorized healthcare provider or legal representative acting with full patient consent.
                </li>
                <li>
                  You agree not to upload fraudulent, fabricated, or deliberately falsified clinical or claim documents.
                </li>
                <li>
                  You acknowledge that while our infrastructure employs end-to-end encryption and row-level security (RLS), you remain responsible for maintaining offline backups of your primary medical records.
                </li>
              </ul>
            </section>

            <section id="no-guarantee" className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-foreground">
                7. No Guarantee of Claim Overturn or Payout
              </h2>
              <p>
                Insurance carriers evaluate claims under internal medical policies, complex plan exclusions, and state regulations. ClaimAppeal AI does NOT guarantee that any appeal letter generated by the Service will result in a denial reversal, claim reimbursement, coverage pre-authorization, or settlement.
              </p>
            </section>

            <section id="ip" className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-foreground">
                8. Intellectual Property &amp; Ownership of Generated Appeals
              </h2>
              <p>
                <strong>Your Generated Letters:</strong> You retain full ownership, title, and intellectual property rights to the specific finalized appeal letters generated through your account for your claims. You have an unrestricted license to print, edit, and transmit your generated letters to insurers.
              </p>
              <p>
                <strong>Platform IP:</strong> ClaimAppeal AI retains all rights, title, and interest in and to the Platform, including proprietary prompt architectures, statutory citation databases, UI components, branding, algorithms, and documentation.
              </p>
            </section>

            <section id="acceptable-use" className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-foreground">
                9. Acceptable Use Policy
              </h2>
              <p>You agree not to:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Reverse-engineer, decompile, or extract the source code or proprietary prompt chains of the Service.</li>
                <li>Scrape, mine, or harvest data through automated bots or scripts without express written consent.</li>
                <li>Use the Service to generate false, harassing, or fraudulent claim filings.</li>
                <li>Circumvent account quota limits, including creating multiple automated accounts to bypass the 1-free-appeal lifetime allowance.</li>
              </ul>
            </section>

            <section id="liability" className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-foreground">
                10. Limitation of Liability
              </h2>
              <p>
                To the maximum extent permitted by law, ClaimAppeal AI and its founders, employees, and licensors shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of insurance benefits, denied medical coverage, out-of-pocket medical bills, missed filing deadlines, or loss of data resulting from your use of the Service.
              </p>
              <p>
                In no event shall our total aggregate liability exceed the total amount paid by you to ClaimAppeal AI in the twelve (12) months preceding the event giving rise to liability, or $50 USD, whichever is greater.
              </p>
            </section>

            <section id="governing-law" className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-foreground">
                11. Governing Law &amp; Dispute Resolution
              </h2>
              <p>
                These Terms are governed by and construed in accordance with the laws of the State of Delaware, without regard to its conflict of law principles. Any dispute arising out of or related to these Terms shall be resolved through binding individual arbitration administered by the American Arbitration Association (AAA), rather than in court.
              </p>
            </section>

            <section id="contact-info" className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-foreground">
                12. Contact Information
              </h2>
              <p>
                For questions or inquiries regarding these Terms of Service, please contact our compliance team:
              </p>
              <div className="rounded-lg border border-border bg-card p-4 space-y-1 text-xs">
                <p className="font-semibold text-foreground">ClaimAppeal AI Legal &amp; Compliance</p>
                <p>Email: <a href="mailto:support@getclaimappeal.com" className="text-primary hover:underline">support@getclaimappeal.com</a></p>
                <p>Support Portal: <Link href="/contact" className="text-primary hover:underline">getclaimappeal.com/contact</Link></p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
