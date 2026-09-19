"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgotPasswordSchema, type ForgotPasswordInput } from "@/schemas/user.schema";
import { Shield, Loader2, ArrowLeft, MailCheck, UserPlus, AlertCircle, X, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [showUnregisteredModal, setShowUnregisteredModal] = useState(false);
  const [unregisteredEmail, setUnregisteredEmail] = useState("");

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  // Close modal on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && showUnregisteredModal) {
        setShowUnregisteredModal(false);
        setFocus("email");
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showUnregisteredModal, setFocus]);

  async function onSubmit(data: ForgotPasswordInput) {
    setLoading(true);
    setShowUnregisteredModal(false);
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });

      const result = await response.json();

      if (!response.ok || !result.registered) {
        if (result.error === "not_registered" || response.status === 404) {
          setUnregisteredEmail(data.email);
          setShowUnregisteredModal(true);
          toast.error("Account not found. You need to register first.");
          return;
        }
        toast.error(result.message || "Unable to send reset link. Please try again.");
        return;
      }

      setSent(true);
      toast.success("Password reset link dispatched.");
    } catch {
      toast.error("Something went wrong. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:bg-background focus:outline-none focus:ring-1 focus:ring-primary/40";
  const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 relative overflow-hidden text-foreground">
      {/* Top right theme toggle */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        <ThemeToggle />
      </div>

      {/* Ambient lighting */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_40%_at_50%_20%,rgba(59,130,246,0.1),transparent)]" />

      <div className="w-full max-w-md space-y-6 animate-fade-in py-12">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary">
              <Shield className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-foreground">
              ClaimAppeal<span className="text-primary ml-1 font-mono text-xs font-bold">AI</span>
            </span>
          </Link>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Reset Your Password
          </h1>
          <p className="text-xs text-muted-foreground">
            Enter your email to verify your account and receive a secure recovery link
          </p>
        </div>

        {/* Card */}
        <div className="cinematic-card p-7 sm:p-8">
          {sent ? (
            <div className="text-center space-y-4 py-2">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                <MailCheck className="h-6 w-6" />
              </div>
              <h2 className="text-sm font-semibold text-foreground">Recovery Email Dispatched</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                An authorized reset link has been dispatched to your email address. Check your inbox and spam folder.
              </p>
              <div className="pt-2">
                <Link
                  href="/login"
                  className="btn-secondary text-xs px-4 py-2 inline-flex items-center gap-1.5"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Return to Sign In</span>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="email" className={labelClass}>
                  Account Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register("email")}
                  className={inputClass}
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500 font-mono">{errors.email.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-2.5 text-xs font-semibold tracking-wide flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.25)] disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-primary-foreground" />
                    <span>Verifying Account...</span>
                  </>
                ) : (
                  "Send Password Reset Link"
                )}
              </button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-border text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Unregistered Account Alert Modal */}
      {showUnregisteredModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-fade-in"
          onClick={() => {
            setShowUnregisteredModal(false);
            setFocus("email");
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div 
            className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-2xl space-y-5 animate-scale-in text-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => {
                setShowUnregisteredModal(false);
                setFocus("email");
              }}
              className="absolute top-4 right-4 rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              aria-label="Close dialog"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Warning Icon Badge */}
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 shadow-[0_0_25px_rgba(245,158,11,0.2)]">
              <UserPlus className="h-7 w-7" />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <h2 id="modal-title" className="text-lg font-bold tracking-tight text-foreground">
                Account Not Found
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                No account was found for:
              </p>
              <div className="inline-block max-w-full font-mono text-xs font-semibold text-foreground bg-muted/80 px-3 py-1.5 rounded-lg border border-border/70 break-all select-all">
                {unregisteredEmail}
              </div>
              <p className="text-xs text-muted-foreground pt-1 leading-relaxed">
                You need to register first before you can sign in or reset your password. It takes less than 30 seconds to get started.
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-2.5 pt-2">
              <Link
                href={`/signup?email=${encodeURIComponent(unregisteredEmail)}`}
                className="btn-primary w-full py-2.5 text-xs font-semibold tracking-wide flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
              >
                <span>Create Free Account</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>

              <button
                type="button"
                onClick={() => {
                  setShowUnregisteredModal(false);
                  setFocus("email");
                }}
                className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors py-2 font-medium"
              >
                Try a different email address
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
