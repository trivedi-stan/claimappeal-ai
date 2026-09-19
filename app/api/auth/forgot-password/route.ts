import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please provide a valid email address."),
});

/**
 * POST /api/auth/forgot-password
 * 
 * Verifies if the account exists before dispatching a password reset link.
 * If the email is not registered:
 *   - No email is sent.
 *   - Returns 404 with registered: false so UI can show a popup informing the user to register first.
 * If the email is registered:
 *   - Calls Supabase auth to dispatch the password reset link to their inbox.
 *   - Returns 200 with registered: true.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parseResult = forgotPasswordSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          registered: false,
          error: "invalid_email",
          message: parseResult.error.errors[0]?.message || "Invalid email address.",
        },
        { status: 400 }
      );
    }

    const cleanEmail = parseResult.data.email.trim().toLowerCase();
    const admin = createAdminClient();

    // 1. Check if user exists in public.profiles
    const { data: profile } = await admin
      .from("profiles")
      .select("id, email")
      .ilike("email", cleanEmail)
      .maybeSingle();

    let userFound = !!profile;

    // 2. Fallback check directly in auth.users if not found in profiles table
    if (!userFound) {
      const { data: userList } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
      userFound = !!userList?.users?.some(
        (u: { email?: string }) => u.email?.toLowerCase() === cleanEmail
      );
    }

    // If unregistered: DO NOT send email, prompt to register first
    if (!userFound) {
      return NextResponse.json(
        {
          registered: false,
          error: "not_registered",
          message: "No account found with this email. You need to register first.",
        },
        { status: 404 }
      );
    }

    // If registered: dispatch password reset email
    const requestUrl = new URL(request.url);
    const origin =
      process.env.NEXT_PUBLIC_APP_URL ||
      requestUrl.origin ||
      "https://www.getclaimappeal.com";

    const { error: resetError } = await admin.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo: `${origin}/api/auth/callback?redirect=/reset-password`,
    });

    if (resetError) {
      return NextResponse.json(
        {
          registered: true,
          error: resetError.message,
          message: resetError.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      registered: true,
      success: true,
      message: "Password reset link dispatched to your email.",
    });
  } catch (err: any) {
    console.error("[forgot-password API error]", err);
    return NextResponse.json(
      {
        registered: false,
        error: "server_error",
        message: "An unexpected error occurred while processing your request. Please try again.",
      },
      { status: 500 }
    );
  }
}
