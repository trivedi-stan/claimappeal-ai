import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser-side Supabase client.
 * Uses NEXT_PUBLIC_* keys — safe to expose to the browser.
 * Import this in client components ("use client").
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key"
  );
}
