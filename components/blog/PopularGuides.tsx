import Link from "next/link";
import { ArrowRight, Flame, FileText, CheckCircle2, ShieldAlert, Scale } from "lucide-react";

export function PopularGuides() {
  const guides = [
    {
      title: "Why Was My Claim Denied?",
      desc: "Top 10 common reasons insurers reject claims and how to isolate your CARC code.",
      href: "/blog/why-was-my-health-insurance-claim-denied",
      icon: ShieldAlert,
      badge: "Essential",
    },
    {
      title: "How to Appeal a Denial",
      desc: "Step-by-step statutory appeal protocol under ERISA § 503 and ACA § 2719.",
      href: "/blog/how-to-appeal-a-denied-health-insurance-claim",
      icon: Scale,
      badge: "Popular",
    },
    {
      title: "Prior Authorization Denied?",
      desc: "What to do next when pre-certification is rejected. Expedited 72-hour review rules.",
      href: "/blog/prior-authorization-denied-what-to-do-next",
      icon: CheckCircle2,
      badge: "Urgent Care",
    },
    {
      title: "Understanding Your EOB",
      desc: "How to decode allowed amounts, patient responsibility, and contractual write-offs.",
      href: "/blog/how-to-read-explanation-of-benefits",
      icon: FileText,
      badge: "Billing",
    },
    {
      title: "Medical Necessity Denials",
      desc: "How insurers apply MCG/InterQual criteria and how to prove clinical qualification.",
      href: "/blog/what-is-medical-necessity-denial",
      icon: ShieldAlert,
      badge: "Clinical",
    },
    {
      title: "Appeal Letter Guide & Template",
      desc: "Anatomy of an effective administrative rebuttal letter with statutory citations.",
      href: "/blog/how-to-write-health-insurance-appeal-letter",
      icon: Scale,
      badge: "Template",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
            <Flame className="h-3.5 w-3.5" />
            Top Resources
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Popular Insurance Guides
          </h2>
        </div>

        <Link
          href="/blog"
          className="text-xs font-medium text-primary hover:underline hidden sm:inline-flex items-center gap-1"
        >
          View all guides <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {guides.map((g) => {
          const IconComponent = g.icon;
          return (
            <Link
              key={g.href}
              href={g.href}
              className="group flex flex-col justify-between rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-primary/40 hover:shadow-md"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:scale-105 transition-transform">
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider rounded-full bg-muted px-2 py-0.5 text-muted-foreground">
                    {g.badge}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                  {g.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {g.desc}
                </p>
              </div>

              <div className="pt-4 mt-2 flex items-center text-xs font-semibold text-primary group-hover:underline">
                <span>Read guide</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
