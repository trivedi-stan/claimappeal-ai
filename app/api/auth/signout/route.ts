import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/auth/signout — Server-side sign out
 */
export async function POST() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  return NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"), {
    status: 302,
  });
}
