import Link from "next/link";
import { Shield, Check, ArrowRight } from "lucide-react";
import { PLANS } from "@/config/plans";

export default function PricingPage() {
  const planList = Object.values(PLANS);

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold">ClaimAppeal<span className="text-primary"> AI</span></span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground">Log in</Link>
            <Link href="/signup" className="gradient-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-md hover:brightness-110">
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </nav>

      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-4xl font-extrabold">Simple, Transparent Pricing</h1>
          <p className="mb-12 text-lg text-muted-foreground">Start free, upgrade when you need more</p>

          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
            {planList.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl border p-6 shadow-sm transition-all hover:shadow-md ${
                  plan.id === "pro" ? "border-primary ring-2 ring-primary/20 scale-105" : ""
                }`}
              >
                {plan.id === "pro" && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full gradient-primary px-4 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </div>
                )}
                <h3 className="mb-1 text-xl font-bold">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-extrabold">
                    {plan.priceMonthly === 0 ? "Free" : `$${plan.priceMonthly / 100}`}
                  </span>
                  {plan.priceMonthly > 0 && (
                    <span className="text-muted-foreground">/mo</span>
                  )}
                </div>
                <ul className="mb-6 space-y-2 text-left text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.id === "free" ? "/signup" : `/signup?plan=${plan.id}`}
                  className={`block w-full rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition-all ${
                    plan.id === "pro"
                      ? "gradient-primary text-white shadow-md hover:shadow-lg hover:brightness-110"
                      : "border bg-background hover:bg-accent"
                  }`}
                >
                  {plan.id === "free" ? "Get Started Free" : `Start ${plan.name}`}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
