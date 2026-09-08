import Link from "next/link";
import { Shield, Check, ArrowRight, Zap, Sparkles, Building2 } from "lucide-react";
import { PLANS } from "@/config/plans";

// Static page — pre-built at deploy time, served from CDN edge
export const dynamic = "force-static";

export default function PricingPage() {
  const planList = Object.values(PLANS);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="rounded-lg bg-primary/10 p-1.5 text-primary border border-primary/20">
              <Shield className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              ClaimAppeal<span className="text-primary"> AI</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Log in
            </Link>
            <Link
              href="/signup"
              className="gradient-primary inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold text-white shadow-sm hover:brightness-110 transition-all"
            >
              Get Started <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="container mx-auto px-4 text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-medium text-primary mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            Transparent, Value-Driven Pricing
          </span>
          <h1 className="mb-4 text-4xl sm:text-5xl font-extrabold tracking-tight">
            Appeal Denials with Maximum Impact
          </h1>
          <p className="mx-auto max-w-xl text-base text-muted-foreground mb-16">
            Start free with 3 AI-synthesized appeals per month. Upgrade whenever you need higher volume or priority processing.
          </p>

          {/* Pricing Cards Grid */}
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3 text-left">
            {planList.map((plan) => {
              const isPro = plan.id === "pro";
              const isBusiness = plan.id === "business";

              return (
                <div
                  key={plan.id}
                  className={`relative flex flex-col justify-between rounded-2xl border p-7 backdrop-blur-md transition-all duration-200 ${
                    isPro
                      ? "border-primary/50 bg-gradient-to-b from-primary/10 via-card to-card shadow-xl shadow-primary/10 ring-1 ring-primary/30 md:-translate-y-2"
                      : "border-border/70 bg-card/60 hover:border-border hover:bg-card/90"
                  }`}
                >
                  {isPro && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 rounded-full gradient-primary px-3 py-0.5 text-[11px] font-semibold text-white shadow-md">
                        <Sparkles className="h-3 w-3" />
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold">{plan.name}</h3>
                      {plan.id === "free" && <Shield className="h-5 w-5 text-muted-foreground" />}
                      {isPro && <Zap className="h-5 w-5 text-primary" />}
                      {isBusiness && <Building2 className="h-5 w-5 text-indigo-400" />}
                    </div>

                    <p className="text-xs text-muted-foreground min-h-[36px] mb-5">
                      {plan.description}
                    </p>

                    <div className="mb-6 flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold tracking-tight">
                        {plan.priceMonthly === 0 ? "Free" : `$${plan.priceMonthly / 100}`}
                      </span>
                      {plan.priceMonthly > 0 && (
                        <span className="text-sm text-muted-foreground">/month</span>
                      )}
                    </div>

                    <div className="h-px w-full bg-border/60 mb-6" />

                    <ul className="mb-8 space-y-3 text-xs text-muted-foreground">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          <span className="text-foreground/90 leading-tight">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <Link
                      href={plan.id === "free" ? "/signup" : `/api/billing/checkout?plan=${plan.id}`}
                      className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-center text-xs font-semibold transition-all ${
                        isPro
                          ? "gradient-primary text-white shadow-md hover:shadow-lg hover:brightness-110"
                          : "border border-border/80 bg-background hover:bg-muted/80 text-foreground"
                      }`}
                    >
                      {plan.id === "free" ? "Get Started Free" : `Start ${plan.name}`}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
