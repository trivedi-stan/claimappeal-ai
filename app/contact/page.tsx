"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  MessageSquare,
  ShieldCheck,
  Send,
  CheckCircle2,
  Clock,
  Building2,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Help with an Appeal Draft",
    carrier: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setIsSubmitted(true);
        toast.success("Message sent! An appeal specialist will reply to your email.");
      } else {
        toast.error(data.error || "Failed to send message. Please try again.");
      }
    } catch {
      toast.error("Network error. Please try again or email support@getclaimappeal.com.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20">
      <SiteHeader />

      <main className="flex-1 py-12 md:py-16">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6">
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

          {/* Hero Section */}
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-primary/20 bg-primary/10 text-primary">
              <MessageSquare className="h-3.5 w-3.5" />
              Support &amp; Inquiries
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Contact ClaimAppeal AI
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Have questions regarding statutory appeal rebuttals, subscription billing, or enterprise clinical workflows? Our team is here to assist.
            </p>
          </div>

          {/* Contact Channels Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Card 1 */}
            <div className="rounded-xl border border-border bg-card p-6 flex flex-col justify-between hover:border-border/80 transition-colors shadow-sm">
              <div className="space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Mail className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-foreground text-sm">General &amp; Technical Support</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  For troubleshooting your personalized appeal, account access, or questions on your 1 free appeal quota.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-border">
                <a
                  href="mailto:support@getclaimappeal.com"
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  support@getclaimappeal.com
                </a>
                <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
                  <Clock className="h-3 w-3" /> Responds within 1 business day
                </span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="rounded-xl border border-border bg-card p-6 flex flex-col justify-between hover:border-border/80 transition-colors shadow-sm">
              <div className="space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-foreground text-sm">Privacy &amp; Compliance</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  For HIPAA compliance questions, data retention reviews, or GDPR/CCPA record deletion requests.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-border">
                <a
                  href="mailto:privacy@getclaimappeal.com"
                  className="text-xs font-semibold text-emerald-500 hover:underline flex items-center gap-1"
                >
                  privacy@getclaimappeal.com
                </a>
                <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
                  <Clock className="h-3 w-3" /> Dedicated Data Protection Officer
                </span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="rounded-xl border border-border bg-card p-6 flex flex-col justify-between hover:border-border/80 transition-colors shadow-sm">
              <div className="space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
                  <Building2 className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-foreground text-sm">Enterprise &amp; Providers</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  High-volume clinical practices, RCM billing agencies, and patient advocacy non-profits.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-border">
                <a
                  href="mailto:enterprise@getclaimappeal.com"
                  className="text-xs font-semibold text-amber-500 hover:underline flex items-center gap-1"
                >
                  enterprise@getclaimappeal.com
                </a>
                <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
                  <Clock className="h-3 w-3" /> Custom BAA &amp; API access
                </span>
              </div>
            </div>
          </div>

          {/* Contact Form Container */}
          <div className="max-w-2xl mx-auto rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
            <div className="mb-6 space-y-1">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Send us a direct message
              </h2>
              <p className="text-xs text-muted-foreground">
                Fill in the details below. We guarantee a prompt response from an appeal specialist.
              </p>
            </div>

            {isSubmitted ? (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-foreground">Message Successfully Received</h3>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Thank you for reaching out, <span className="font-semibold text-foreground">{formData.name}</span>. A support specialist has received your inquiry and will reply to <span className="font-semibold text-foreground">{formData.email}</span> within 24 hours.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-4 inline-flex items-center justify-center px-4 py-2 rounded-lg text-xs font-medium border border-border bg-background hover:bg-muted transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="jane@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Inquiry Category</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="Help with an Appeal Draft">Help with an Appeal Draft</option>
                      <option value="Billing & Subscription Support">Billing &amp; Subscription Support</option>
                      <option value="Free Quota (1 per account)">Free Quota Question</option>
                      <option value="Provider or Enterprise Inquiries">Provider / Enterprise Demo</option>
                      <option value="Privacy & Data Deletion">Privacy / HIPAA Inquiries</option>
                      <option value="Other">Other Question</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">
                      Insurance Carrier <span className="text-muted-foreground font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Aetna, UHC, Cigna, BCBS"
                      value={formData.carrier}
                      onChange={(e) => setFormData({ ...formData, carrier: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Detailed Message</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Describe your question or provide context regarding your medical denial notice..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-y"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary py-2.5 px-4 text-xs font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Sending inquiry...</span>
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5" />
                        Send Support Message
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
