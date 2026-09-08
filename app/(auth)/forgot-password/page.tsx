"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgotPasswordSchema, type ForgotPasswordInput } from "@/schemas/user.schema";
import { createClient } from "@/lib/supabase/client";
import { Shield, Loader2, ArrowLeft, MailCheck } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  async function onSubmit(data: ForgotPasswordInput) {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) {
        toast.error(error.message);
        return;
      }
      setSent(true);
      toast.success("Password reset link dispatched.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-white/[0.08] bg-zinc-900/60 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 transition-colors focus:border-blue-500/80 focus:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-blue-500/40";
  const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-400";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#09090b] px-4 relative overflow-hidden text-zinc-100">
      {/* Ambient lighting */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_40%_at_50%_20%,rgba(59,130,246,0.1),rgba(255,255,255,0))]" />

      <div className="w-full max-w-md space-y-6 animate-fade-in py-12">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Shield className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-zinc-100">
              ClaimAppeal<span className="text-blue-400 ml-1 font-mono text-xs font-bold">AI</span>
            </span>
          </Link>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-100">
            Reset Your Password
          </h1>
          <p className="text-xs text-zinc-400">
            We will dispatch a secure recovery link to your email
          </p>
        </div>

        {/* Card */}
        <div className="cinematic-card p-7 sm:p-8">
          {sent ? (
            <div className="text-center space-y-4 py-2">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <MailCheck className="h-6 w-6" />
              </div>
              <h2 className="text-sm font-semibold text-zinc-200">Recovery Email Dispatched</h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                If an account exists under that address, an authorized reset link has been sent. Check your inbox and spam folder.
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
                  <p className="mt-1 text-xs text-red-400 font-mono">{errors.email.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-2.5 text-xs font-semibold tracking-wide flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.25)] disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Transmitting...</span>
                  </>
                ) : (
                  "Send Password Reset Link"
                )}
              </button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-white/[0.06] text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
