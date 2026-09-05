"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupSchema, type SignupInput } from "@/schemas/user.schema";
import { createClient } from "@/lib/supabase/client";
import { Shield, Loader2 } from "lucide-react";
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
      toast.success("Account created! Check your email to verify.");
      router.push("/login");
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
            <span className="text-2xl font-bold">
              ClaimAppeal<span className="text-primary"> AI</span>
            </span>
          </Link>
          <p className="mt-2 text-muted-foreground">Create your free account</p>
        </div>

        <div className="rounded-2xl border bg-card p-8 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="full_name" className="mb-1.5 block text-sm font-medium">
                Full Name <span className="text-destructive">*</span>
              </label>
              <input
                id="full_name"
                type="text"
                autoComplete="name"
                {...register("full_name")}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20"
                placeholder="Jane Doe"
              />
              {errors.full_name && (
                <p className="mt-1 text-xs text-destructive">{errors.full_name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
                Email <span className="text-destructive">*</span>
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register("email")}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20"
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
                Password <span className="text-destructive">*</span>
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                {...register("password")}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20"
                placeholder="Min 8 chars, 1 uppercase, 1 number"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium">
                Confirm Password <span className="text-destructive">*</span>
              </label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                {...register("confirmPassword")}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20"
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="gradient-primary flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:brightness-110 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
