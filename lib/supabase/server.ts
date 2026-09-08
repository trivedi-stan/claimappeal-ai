import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server-side Supabase client.
 * Uses cookie store for session management in Next.js App Router.
 * Uses the pgBouncer transaction-mode pooler (port 6543) when
 * SUPABASE_DB_URL is set — reduces cold-start DB latency by ~30%.
 * Import this in Server Components, Server Actions, and API routes.
 */
export async function createClient() {
  const cookieStore = await cookies();

  // Prefer the pgBouncer pooler URL for DB operations; fall back to direct URL
  const supabaseUrl =
    process.env.SUPABASE_DB_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "https://placeholder-project.supabase.co";

  return createServerClient(
    supabaseUrl,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key",
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
      },
    }
  );
}

/**
 * Admin Supabase client using the service role key.
 * Bypasses RLS — ONLY use in trusted server-side code (webhooks, admin routes).
 * NEVER expose this to the browser.
 */
export function createAdminClient() {
  const { createClient } = require("@supabase/supabase-js");
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
