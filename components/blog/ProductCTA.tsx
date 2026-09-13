"use client";

import Link from "next/link";
import { Shield, ArrowRight, CheckCircle2, Lock, FileText } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface ProductCTAProps {
  headline?: string;
  subtext?: string;
  buttonText?: string;
  className?: string;
  location?: string;
}

export function ProductCTA({
  headline = "Your claim was denied. What now?",
  subtext = "Understand the denial and prepare your statutory appeal with ClaimAppeal AI in minutes.",
  buttonText = "Start My Appeal",
  className = "",
  location = "blog_cta",
}: ProductCTAProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-card via-card to-primary/[0.05] p-6 sm:p-8 text-center sm:text-left shadow-sm ${className}`}
    >
      {/* Background glow accent */}
      <div className="pointer-events-none absolute -bottom-12 -right-12 h-48 w-48 rounded-full bg-primary/10 blur-2xl" />

      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
            <Shield className="h-3.5 w-3.5" />
            AI-Assisted Appeal Builder
          </div>

          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            {headline}
          </h3>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {subtext}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              1 Free Personalized Appeal
            </span>
            <span className="flex items-center gap-1">
              <Lock className="h-3.5 w-3.5 text-primary" />
              Zero-Model-Training Guarantee
            </span>
            <span className="flex items-center gap-1">
              <FileText className="h-3.5 w-3.5 text-amber-500" />
              ERISA § 503 Grounded
            </span>
          </div>
        </div>

        <div className="shrink-0 w-full sm:w-auto">
          <Link
            href="/appeals/new"
            onClick={() =>
              trackEvent({
                name: "cta_click",
                location,
                ctaText: buttonText,
                destination: "/appeals/new",
              })
            }
            className="btn-primary w-full sm:w-auto px-6 py-3 text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.25)]"
          >
            <span>{buttonText}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
