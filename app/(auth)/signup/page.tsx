"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupSchema, type SignupInput } from "@/schemas/user.schema";
import { createClient } from "@/lib/supabase/client";
import { Shield, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(SignupSchema),
  });

  async function onSubmit(data: SignupInput) {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.full_name,
          },
        },
      });
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Account created. Check your inbox for confirmation instructions.");
      router.push("/login");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-white/[0.08] bg-zinc-900/60 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 transition-colors focus:border-blue-500/80 focus:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-blue-500/40";
  const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-400";
  const requiredStar = <span className="text-red-400 ml-0.5">*</span>;

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
            Create Your Free Account
          </h1>
          <p className="text-xs text-zinc-400">
            Start drafting statutory insurance rebuttals immediately
          </p>
        </div>

        {/* Card */}
        <div className="cinematic-card p-7 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="full_name" className={labelClass}>
                Full Name {requiredStar}
              </label>
              <input
                id="full_name"
                type="text"
                autoComplete="name"
                {...register("full_name")}
                className={inputClass}
                placeholder="Jane Doe"
              />
              {errors.full_name && (
                <p className="mt-1 text-xs text-red-400 font-mono">{errors.full_name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className={labelClass}>
                Email Address {requiredStar}
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

            <div>
              <label htmlFor="password" className={labelClass}>
                Password {requiredStar}
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                {...register("password")}
                className={inputClass}
                placeholder="Min 8 chars, 1 uppercase, 1 number"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-400 font-mono">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className={labelClass}>
                Confirm Password {requiredStar}
              </label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                {...register("confirmPassword")}
                className={inputClass}
                placeholder="Re-enter password"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-400 font-mono">{errors.confirmPassword.message}</p>
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
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/[0.06] text-center">
            <p className="text-xs text-zinc-400">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Footnote */}
        <p className="text-center font-mono text-[11px] text-zinc-600">
          By signing up, you agree to our terms of service and privacy policy
        </p>
      </div>
    </div>
  );
}
