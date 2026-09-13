"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Loader2, Save, User, ShieldCheck, Mail, Key } from "lucide-react";
import { ThemeSettingsCard } from "@/components/ThemeSettingsCard";

export default function ProfileSettingsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setEmail(user.email ?? "");
      const { data } = await supabase.from("profiles").select("full_name").eq("id", user.id).single();
      setFullName(data?.full_name ?? "");
      setLoading(false);
    }
    loadProfile();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSave() {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { error } = await supabase.from("profiles").update({ full_name: fullName, updated_at: new Date().toISOString() }).eq("id", user.id);
      if (error) throw error;
      toast.success("Profile preferences updated.");
    } catch {
      toast.error("Failed to update profile.");
    } finally {
      setSaving(false);
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

      {/* Security & Access Info */}
      <div className="cinematic-card p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Key className="h-4 w-4 text-primary" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground">
            Authentication & Password
          </h2>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Your account is secured via enterprise Supabase Authentication with salted bcrypt hashing and row-level security (RLS) partition policies on all health records.
        </p>
        <div>
          <Link
            href="/forgot-password"
            className="text-xs text-primary hover:underline font-medium inline-flex items-center gap-1 transition-colors"
          >
            Request password reset link →
          </Link>
        </div>
      </div>
    </div>
  );
}
