"use client";

import { useState } from "react";
import { Mail, ArrowRight, CheckCircle2, Shield } from "lucide-react";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubscribed(true);
      toast.success("Subscribed to healthcare appeal strategies!");
      trackEvent({
        name: "newsletter_signup",
        source: "blog_footer_card",
      });
    }, 600);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-4">
      <div className="flex items-center gap-2 text-primary">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <Mail className="h-4.5 w-4.5" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
          Patient Due Process Bulletin
        </span>
      </div>

      <div className="space-y-1">
        <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
          Stay informed on insurance appeal rights &amp; statutory rules
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Monthly insights covering ERISA § 503 legal precedents, new state denial transparency laws, and tactics to overturn medical rejections.
        </p>
      </div>

      {isSubscribed ? (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 flex items-center gap-3 text-xs text-emerald-900 dark:text-emerald-300 font-medium">
          <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
          <span>You&apos;re subscribed! We&apos;ll deliver our next monthly guide to {email}.</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5 pt-1">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/40"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary px-5 py-2.5 text-xs font-semibold whitespace-nowrap shadow-sm disabled:opacity-50 inline-flex items-center justify-center gap-1.5"
          >
            <span>{isSubmitting ? "Subscribing..." : "Get Free Guides"}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </form>
      )}

      <p className="text-[10px] text-muted-foreground flex items-center gap-1.5">
        <Shield className="h-3 w-3 text-emerald-500" />
        No spam, ever. Unsubscribe with one click anytime.
      </p>
    </div>
  );
}
