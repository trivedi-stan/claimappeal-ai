"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgotPasswordSchema, type ForgotPasswordInput } from "@/schemas/user.schema";
import { createClient } from "@/lib/supabase/client";
import { Shield, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const supabase = createClient();

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordInput>({
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
      toast.success("Reset link sent! Check your email.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">ClaimAppeal<span className="text-primary"> AI</span></span>
          </Link>
          <p className="mt-2 text-muted-foreground">Reset your password</p>
        </div>

        <div className="rounded-2xl border bg-card p-8 shadow-sm">
          {sent ? (
            <div className="text-center">
              <p className="mb-4 text-sm text-muted-foreground">
                We&apos;ve sent a password reset link to your email. Check your inbox and follow the instructions.
              </p>
              <Link href="/login" className="text-sm font-medium text-primary hover:underline">
                Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium">Email</label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register("email")}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20"
                  placeholder="you@example.com"
                />
                {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
              </div>
              <button type="submit" disabled={loading}
                className="gradient-primary flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg disabled:opacity-50">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Reset Link"}
              </button>
            </form>
          )}
          <div className="mt-6 text-center">
            <Link href="/login" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
