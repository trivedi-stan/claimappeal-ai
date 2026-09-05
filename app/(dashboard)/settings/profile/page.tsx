"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

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
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="animate-fade-in">
      <h1 className="mb-1 text-2xl font-bold">Profile Settings</h1>
      <p className="mb-6 text-muted-foreground">Manage your account details</p>

      <div className="max-w-lg rounded-xl border bg-card p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Email</label>
            <input type="email" value={email} disabled
              className="w-full rounded-lg border border-input bg-muted/50 px-4 py-2.5 text-sm text-muted-foreground cursor-not-allowed" />
            <p className="mt-1 text-xs text-muted-foreground">Email cannot be changed</p>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Full Name</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20"
              placeholder="Your full name" />
          </div>
          <button onClick={handleSave} disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:brightness-110 disabled:opacity-50">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
