"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import {
  Loader2,
  Save,
  User,
  ShieldCheck,
  Mail,
  Key,
  Lock,
  CheckCircle2,
  Send,
  ArrowRight,
} from "lucide-react";
import { ThemeSettingsCard } from "@/components/ThemeSettingsCard";

export default function ProfileSettingsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  // Password reset state
  const [sendingReset, setSendingReset] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // Direct password change state
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setEmail(user.email ?? "");
      const { data } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();
      setFullName(data?.full_name ?? "");
      setLoading(false);
    }
    loadProfile();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSave() {
    setSaving(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName, updated_at: new Date().toISOString() })
        .eq("id", user.id);
      if (error) throw error;
      toast.success("Profile preferences updated.");
    } catch {
      toast.error("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  }

  async function handleRequestResetEmail() {
    if (!email) return;
    setSendingReset(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || "Failed to dispatch reset link.");
        return;
      }

      setResetSent(true);
      toast.success(`Password reset link dispatched to ${email}. Check your inbox!`);
    } catch {
      toast.error("Network error while requesting password reset.");
    } finally {
      setSendingReset(false);
    }
  }

  async function handleUpdatePasswordDirect(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (!/[A-Z]/.test(newPassword)) {
      toast.error("Password must contain at least 1 uppercase letter.");
      return;
    }
    if (!/[0-9]/.test(newPassword)) {
      toast.error("Password must contain at least 1 number.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setUpdatingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Password updated successfully!");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordChange(false);
    } catch {
      toast.error("An unexpected error occurred while updating your password.");
    } finally {
      setUpdatingPassword(false);
    }
  }

  const getInitials = (name: string, emailStr: string) => {
    if (name.trim()) {
      return name
        .trim()
        .split(/\s+/)
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
    }
    return emailStr ? emailStr.substring(0, 2).toUpperCase() : "U";
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-3">
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
        <p className="text-xs font-mono text-muted-foreground">Loading user profile...</p>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:bg-background focus:outline-none focus:ring-1 focus:ring-primary/40";
  const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground";

  return (
    <div className="mx-auto max-w-3xl space-y-8 animate-fade-in pb-16">
      {/* Top Header */}
      <div className="border-b border-border pb-5">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-1">
          <Link href="/dashboard" className="hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <span className="text-muted-foreground/60">/</span>
          <span className="text-foreground">Account Preferences</span>
        </div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Profile Settings
          </h1>
          <span className="badge-neutral">User Security</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Manage your personal identity credentials, authenticated email endpoint, and visual theme.
        </p>
      </div>

      {/* Main Profile Form */}
      <div className="cinematic-card p-6 md:p-8 space-y-6">
        {/* User Avatar & Identity Header */}
        <div className="flex items-center gap-4 border-b border-border pb-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted border border-border text-lg font-mono font-semibold text-foreground shadow-inner">
            {getInitials(fullName, email)}
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              {fullName || "Registered User"}
            </h2>
            <p className="text-xs font-mono text-muted-foreground mt-0.5">{email}</p>
            <span className="badge-cobalt text-[10px] mt-2 inline-block">
              Supabase Auth Verified
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className={labelClass}>Authenticated Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                value={email}
                disabled
                className="w-full rounded-lg border border-border/60 bg-muted/60 pl-10 pr-4 py-2.5 text-sm font-mono text-muted-foreground cursor-not-allowed"
              />
            </div>
            <p className="mt-1.5 text-[11px] text-muted-foreground font-mono">
              Email changes are restricted to primary auth security protocols.
            </p>
          </div>

          <div>
            <label className={labelClass}>Full Name / Signature Identity</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`${inputClass} pl-10`}
                placeholder="e.g., Sarah Jenkins"
              />
            </div>
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              Appears on appeal letter signature blocks by default.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-border flex items-center justify-between">
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary text-xs px-5 py-2.5 inline-flex items-center gap-2 font-medium shadow-[0_0_20px_rgba(59,130,246,0.25)] disabled:opacity-40"
          >
            {saving ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary-foreground" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                <span>Save Profile Changes</span>
              </>
            )}
          </button>
          <span className="text-[11px] text-muted-foreground font-mono">
            Last active session encrypted
          </span>
        </div>
      </div>

      {/* Theme / Appearance Preference Card */}
      <ThemeSettingsCard />

      {/* Security, Authentication & Password Card */}
      <div className="cinematic-card p-6 md:p-8 space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary">
              <Key className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-tight text-foreground">
                Authentication & Password Security
              </h2>
              <p className="text-xs text-muted-foreground">
                Manage your credentials and password recovery options
              </p>
            </div>
          </div>
          <span className="badge-neutral text-[10px]">Active</span>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          Your account is secured with Supabase Authentication using salted bcrypt hashing and row-level security (RLS) policies protecting all confidential health records.
        </p>

        {/* Action Row: Send Reset Link or Update Directly */}
        <div className="rounded-xl border border-border bg-card/60 p-4 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Reset Password via Email
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Send a secure recovery link to <span className="font-mono text-foreground font-medium">{email}</span>
              </p>
            </div>

            <button
              type="button"
              onClick={handleRequestResetEmail}
              disabled={sendingReset}
              className="btn-secondary text-xs px-4 py-2 inline-flex items-center justify-center gap-1.5 shrink-0"
            >
              {sendingReset ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Sending Link...</span>
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  <span>Send Reset Email</span>
                </>
              )}
            </button>
          </div>

          {resetSent && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs animate-fade-in font-medium">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>
                Recovery email dispatched to {email}. Check your inbox and spam folder.
              </span>
            </div>
          )}

          <div className="border-t border-border/60 pt-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Update Password Directly
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Change your password immediately without checking your email
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPasswordChange(!showPasswordChange)}
                className="text-xs text-primary hover:underline font-medium inline-flex items-center gap-1"
              >
                <span>{showPasswordChange ? "Cancel" : "Change Password"}</span>
                <ArrowRight className={`h-3 w-3 transition-transform ${showPasswordChange ? "rotate-90" : ""}`} />
              </button>
            </div>

            {showPasswordChange && (
              <form onSubmit={handleUpdatePasswordDirect} className="mt-4 space-y-3.5 animate-fade-in">
                <div>
                  <label className={labelClass}>New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                    <input
                      type="password"
                      autoComplete="new-password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min 8 chars, 1 uppercase, 1 number"
                      className={`${inputClass} pl-10`}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Confirm New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                    <input
                      type="password"
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your new password"
                      className={`${inputClass} pl-10`}
                      required
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={updatingPassword}
                    className="btn-primary text-xs px-5 py-2 inline-flex items-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.25)] disabled:opacity-50"
                  >
                    {updatingPassword ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-primary-foreground" />
                        <span>Updating Password...</span>
                      </>
                    ) : (
                      <>
                        <Key className="h-3.5 w-3.5" />
                        <span>Save New Password</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
