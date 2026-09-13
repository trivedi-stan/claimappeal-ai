import Link from "next/link";
import { Check, ArrowRight, Sparkles, Shield, Zap, Building2 } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PLANS } from "@/config/plans";

export default function PricingPage() {
  const planList = Object.values(PLANS);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteHeader />

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
            Start free with 1 personalized appeal for your account. Upgrade whenever you need higher volume or priority processing.
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

          {/* Feature Comparison Table */}
          <div className="mt-24 mx-auto max-w-4xl text-left">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Plan Comparison
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                Detailed breakdown of features included with each membership tier.
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-border/80 bg-card/60 shadow-lg backdrop-blur-md">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="py-4 px-6 font-semibold text-foreground text-left w-2/5">Feature</th>
                      <th className="py-4 px-4 font-semibold text-foreground text-center w-1/5">Free</th>
                      <th className="py-4 px-4 font-semibold text-primary text-center w-1/5">Pro</th>
                      <th className="py-4 px-4 font-semibold text-foreground text-center w-1/5">Business</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    <tr className="hover:bg-muted/20 transition-colors">
                      <td className="py-3.5 px-6 font-medium text-foreground">Price</td>
                      <td className="py-3.5 px-4 text-center font-semibold text-foreground">$0</td>
                      <td className="py-3.5 px-4 text-center font-semibold text-primary">$19/mo</td>
                      <td className="py-3.5 px-4 text-center font-semibold text-foreground">$99/mo</td>
                    </tr>
                    <tr className="hover:bg-muted/20 transition-colors">
                      <td className="py-3.5 px-6 font-medium text-foreground">Personalized Appeals</td>
                      <td className="py-3.5 px-4 text-center text-muted-foreground">1 lifetime</td>
                      <td className="py-3.5 px-4 text-center font-medium text-foreground">10/month</td>
                      <td className="py-3.5 px-4 text-center font-medium text-foreground">100/month</td>
                    </tr>
                    <tr className="hover:bg-muted/20 transition-colors">
                      <td className="py-3.5 px-6 text-muted-foreground">PDF download</td>
                      <td className="py-3.5 px-4 text-center">
                        <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/20 transition-colors">
                      <td className="py-3.5 px-6 text-muted-foreground">Version history</td>
                      <td className="py-3.5 px-4 text-center">
                        <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/20 transition-colors">
                      <td className="py-3.5 px-6 text-muted-foreground">AI draft review</td>
                      <td className="py-3.5 px-4 text-center">
                        <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/20 transition-colors">
                      <td className="py-3.5 px-6 text-muted-foreground">Insurance presets</td>
                      <td className="py-3.5 px-4 text-center text-muted-foreground/50">—</td>
                      <td className="py-3.5 px-4 text-center">
                        <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/20 transition-colors">
                      <td className="py-3.5 px-6 text-muted-foreground">Priority support</td>
                      <td className="py-3.5 px-4 text-center text-muted-foreground/50">—</td>
                      <td className="py-3.5 px-4 text-center">
                        <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/20 transition-colors">
                      <td className="py-3.5 px-6 text-muted-foreground">Usage analytics</td>
                      <td className="py-3.5 px-4 text-center text-muted-foreground/50">—</td>
                      <td className="py-3.5 px-4 text-center text-muted-foreground/50">—</td>
                      <td className="py-3.5 px-4 text-center">
                        <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/20 transition-colors">
                      <td className="py-3.5 px-6 text-muted-foreground">Email export</td>
                      <td className="py-3.5 px-4 text-center text-muted-foreground/50">—</td>
                      <td className="py-3.5 px-4 text-center text-muted-foreground/50">—</td>
                      <td className="py-3.5 px-4 text-center">
                        <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
