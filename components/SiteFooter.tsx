import Link from "next/link";
import { Shield, Lock, FileText, CheckCircle2 } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card/40 backdrop-blur-sm text-muted-foreground text-xs">
      {/* Top Disclaimer Banner */}
      <div className="border-b border-border/60 bg-muted/40 py-3 px-4 sm:px-6">
        <div className="container mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] leading-relaxed">
          <div className="flex items-center gap-2 text-foreground/90 font-medium">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
            <span>Statutory AI Rebuttal Engine • ERISA § 503 &amp; ACA § 2719 Defense Framework</span>
          </div>
          <div className="text-muted-foreground flex items-center gap-3">
            <span>1 Free Personalized Appeal Per Account</span>
            <span>•</span>
            <span className="text-emerald-500 font-medium flex items-center gap-1">
              <Lock className="h-3 w-3 inline" /> Zero-Health-Data Training
            </span>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Col 1 & 2: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary shrink-0">
                <Shield className="h-4.5 w-4.5" />
              </div>
              <span className="text-base font-semibold tracking-tight text-foreground">
                ClaimAppeal<span className="text-primary ml-1 font-mono text-xs font-bold">AI</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed max-w-sm text-muted-foreground">
              Automating substantive, evidence-backed medical denial appeals against algorithmic insurance rejections. Grounded in federal law, clinical guideline benchmarks, and procedural due process.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-[10px]">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded border border-border bg-background/60 text-foreground/80 font-mono">
                <Lock className="h-3 w-3 text-emerald-500" /> AES-256 / Supabase RLS
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded border border-border bg-background/60 text-foreground/80 font-mono">
                <CheckCircle2 className="h-3 w-3 text-primary" /> ERISA § 503 Certified Code
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded border border-border bg-background/60 text-foreground/80 font-mono">
                <FileText className="h-3 w-3 text-amber-500" /> 1 Free Personalized Appeal
              </span>
            </div>
          </div>

          {/* Col 3: Platform */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">Platform</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/appeals/new" className="hover:text-foreground transition-colors">
                  Draft New Appeal
                </Link>
              </li>
              <li>
                <Link href="/#features" className="hover:text-foreground transition-colors">
                  Denial Extraction Engine
                </Link>
              </li>
              <li>
                <Link href="/#protocol" className="hover:text-foreground transition-colors">
                  Four-Phase Intake Protocol
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-foreground transition-colors">
                  Pricing &amp; Quotas
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-foreground transition-colors">
                  Patient &amp; Provider Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Statutory Resources & Blog */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">Resources &amp; Guides</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/resources" className="hover:text-foreground transition-colors font-medium text-primary">
                  Claim Help Directory
                </Link>
              </li>
              <li>
                <Link href="/guides" className="hover:text-foreground transition-colors">
                  Claim Appeal Guides
                </Link>
              </li>
              <li>
                <Link href="/appeal-letter" className="hover:text-foreground transition-colors">
                  Appeal Letter Blueprints
                </Link>
              </li>
              <li>
                <Link href="/denial-reasons" className="hover:text-foreground transition-colors">
                  Denial Reasons &amp; CARC
                </Link>
              </li>
              <li>
                <Link href="/templates" className="hover:text-foreground transition-colors">
                  Letter Templates (Word/PDF)
                </Link>
              </li>
              <li>
                <Link href="/insurance-types" className="hover:text-foreground transition-colors">
                  Insurance Type Solutions
                </Link>
              </li>
              <li>
                <Link href="/carriers" className="hover:text-foreground transition-colors">
                  Insurance Carrier Guides
                </Link>
              </li>
              <li>
                <Link href="/claim-help" className="hover:text-foreground transition-colors">
                  EOB &amp; Document Guides
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Company & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">Company &amp; Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/privacy#hipaa" className="hover:text-foreground transition-colors">
                  HIPAA &amp; Security Shield
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="mt-12 rounded-lg border border-border/80 bg-muted/30 p-4 text-[11px] leading-relaxed text-muted-foreground">
          <p className="font-medium text-foreground mb-1">
            ⚠️ Legal &amp; Medical Practice Disclaimer:
          </p>
          <p>
            ClaimAppeal AI is an automated technological drafting and workflow productivity system. ClaimAppeal AI is not a law firm, attorney referral service, or licensed healthcare provider, and does not provide legal advice, medical diagnosis, or patient care representation. Using this service does not establish an attorney-client or doctor-patient relationship. All generated letters, statutory citations, and clinical references are assistive drafts intended for personal review and modification by the subscriber or their licensed treating physician prior to carrier filing.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© {new Date().getFullYear()} ClaimAppeal AI. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">
              Contact
            </Link>
            <Link href="/blog" className="hover:text-foreground transition-colors">
              Blog &amp; Resources
            </Link>
            <Link href="/about" className="hover:text-foreground transition-colors">
              About
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
