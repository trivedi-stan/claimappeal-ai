import Link from "next/link";
import {
  Shield,
  FileText,
  Clock,
  Zap,
  CheckCircle2,
  ArrowRight,
  Star,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold tracking-tight">
              ClaimAppeal<span className="text-primary"> AI</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/pricing"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Pricing
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="gradient-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:brightness-110"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="absolute inset-0 gradient-surface" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        <div className="container relative mx-auto px-4 text-center">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <Star className="h-4 w-4" />
              AI-Powered Appeal Drafting
            </div>
            <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
              Turn Insurance Denials Into{" "}
              <span className="text-gradient">Professional Appeals</span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              Stop struggling with confusing denial letters. Answer a few
              questions and get a professional, ready-to-submit appeal letter in
              under 2 minutes. No legal expertise required.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/signup"
                className="gradient-primary inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:brightness-110"
              >
                Start Your Free Appeal
                <ArrowRight className="h-5 w-5" />
              </Link>
              <p className="text-sm text-muted-foreground">
                3 free appeals per month · No credit card required
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-4 text-center text-3xl font-bold">
            How It Works
          </h2>
          <p className="mb-12 text-center text-muted-foreground">
            Three simple steps to a professional appeal letter
          </p>
          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
            {[
              {
                icon: FileText,
                step: "1",
                title: "Enter Your Details",
                desc: "Answer questions about your denial — insurance info, claim details, and the reason for denial.",
              },
              {
                icon: Zap,
                step: "2",
                title: "AI Generates Your Letter",
                desc: "Our AI creates a professional appeal letter with proper legal references and compelling arguments.",
              },
              {
                icon: CheckCircle2,
                step: "3",
                title: "Review & Download",
                desc: "Edit your letter, download as PDF, and submit to your insurance company.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="group relative rounded-2xl border bg-card p-6 text-center shadow-sm transition-all hover:shadow-md"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl gradient-primary text-white text-lg font-bold shadow-md">
                  {item.step}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Built for Trust & Speed
          </h2>
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Shield,
                title: "No Fabricated Facts",
                desc: "Our AI never invents medical facts, policy language, or regulatory citations. Missing info is flagged, never guessed.",
              },
              {
                icon: Clock,
                title: "Under 2 Minutes",
                desc: "Complete the wizard, get your draft. Fast enough to fit into any workflow.",
              },
              {
                icon: FileText,
                title: "Professional PDF",
                desc: "Download a letterhead-quality PDF ready to mail, fax, or upload to your insurer's portal.",
              },
              {
                icon: CheckCircle2,
                title: "Always Editable",
                desc: "Every draft is fully editable before export. You're always in control of the final letter.",
              },
              {
                icon: Zap,
                title: "Version History",
                desc: "Regenerate as many times as you need. Every version is saved and accessible.",
              },
              {
                icon: Star,
                title: "Trusted References",
                desc: "All citations come from verified regulatory sources — ERISA, ACA, and general appeal-rights guidance.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md"
              >
                <feature.icon className="mb-3 h-6 w-6 text-primary" />
                <h3 className="mb-1.5 font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">
            Ready to Fight Your Denial?
          </h2>
          <p className="mb-8 text-muted-foreground">
            Start with 3 free appeals per month. No credit card required.
          </p>
          <Link
            href="/signup"
            className="gradient-primary inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:brightness-110"
          >
            Create Your First Appeal
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/20 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-semibold">
                ClaimAppeal<span className="text-primary"> AI</span>
              </span>
            </div>
            <p className="max-w-md text-xs text-muted-foreground">
              ClaimAppeal AI is a drafting assistant, not a law firm or medical
              provider. AI-generated drafts should be reviewed carefully before
              submission. We do not guarantee appeal approval.
            </p>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} ClaimAppeal AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
