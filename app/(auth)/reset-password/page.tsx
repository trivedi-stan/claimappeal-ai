"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPasswordSchema, type ResetPasswordInput } from "@/schemas/user.schema";
import { createClient } from "@/lib/supabase/client";
import { Shield, Loader2, Lock, CheckCircle2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [sessionChecking, setSessionChecking] = useState(true);
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(ResetPasswordSchema),
  });

  useEffect(() => {
    // Listen for auth state change or recovery token
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSessionChecking(false);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setSessionChecking(false);
      }
    });

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  async function onSubmit(data: ResetPasswordInput) {
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      setSuccess(true);
      toast.success("Password updated successfully!");
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch {
      toast.error("An unexpected error occurred. Please try again.");
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
          <Link href="/" className="inline-flex items-center gap-2 mb-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary transition-all group-hover:bg-primary/20">
              <Shield className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-foreground">
              ClaimAppeal<span className="text-primary ml-1 font-mono text-xs font-bold">AI</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Set New Password
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Choose a strong password to protect your account and medical appeals.
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-border bg-card/60 p-6 sm:p-8 backdrop-blur-md shadow-xl space-y-6">
          {success ? (
            <div className="space-y-4 text-center py-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-foreground">Password Reset Complete</h3>
                <p className="text-xs text-muted-foreground">
                  Your password has been updated. Redirecting you to your dashboard...
                </p>
              </div>
              <Link
                href="/dashboard"
                className="btn-primary w-full py-2.5 text-xs font-semibold inline-flex items-center justify-center gap-1.5"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className={labelClass} htmlFor="password">
                  New Password
                </label>
                <div className="relative">
                  <input
                    {...register("password")}
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Min. 8 characters, 1 uppercase, 1 number"
                    className={inputClass}
                  />
                  <Lock className="absolute right-3.5 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass} htmlFor="confirmPassword">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    {...register("confirmPassword")}
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Re-enter your password"
                    className={inputClass}
                  />
                  <Lock className="absolute right-3.5 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-2.5 text-xs font-semibold mt-2 inline-flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.25)] min-h-[42px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <span>Update Password</span>
                )}
              </button>
            </form>
          )}

          <div className="pt-2 text-center">
            <Link
              href="/login"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
