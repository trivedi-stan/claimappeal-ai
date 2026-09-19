import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please provide a valid email address."),
  action: z.enum(["reset_password", "resend_verification"]).optional(),
});

/**
 * POST /api/auth/forgot-password
 * 
 * 1. Checks if the account exists.
 *    If NOT registered:
 *      - Returns 404 with { registered: false, error: "not_registered" }
 *      - NO email is sent.
 * 2. Checks if the email has been confirmed / verified.
 *    If NOT verified:
 *      - Returns 403 with { registered: true, verified: false, error: "email_not_verified" }
 *      - NO reset password email is sent.
 *    If action is "resend_verification":
 *      - Dispatches a fresh verification email so the user can verify their account.
 * 3. If registered AND verified:
 *      - Dispatches the secure password reset link to their verified email.
 *      - Returns 200 with { registered: true, verified: true, success: true }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parseResult = forgotPasswordSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          registered: false,
          verified: false,
          error: "invalid_email",
          message: parseResult.error.errors[0]?.message || "Invalid email address.",
        },
        { status: 400 }
      );
    }

    const cleanEmail = parseResult.data.email.trim().toLowerCase();
    const action = parseResult.data.action || "reset_password";
    const admin = createAdminClient();

    // 1. Check if user exists in public.profiles
    const { data: profile } = await admin
      .from("profiles")
      .select("id, email")
      .ilike("email", cleanEmail)
      .maybeSingle();

    let targetUser: any = null;

    if (profile?.id) {
      const { data: userData } = await admin.auth.admin.getUserById(profile.id);
      targetUser = userData?.user || null;
    } else {
      // Fallback check directly in auth.users
      const { data: userList } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
      targetUser =
        userList?.users?.find((u: { email?: string }) => u.email?.toLowerCase() === cleanEmail) ||
        null;
    }

    // If unregistered: DO NOT send email, prompt user to register first
    if (!targetUser) {
      return NextResponse.json(
        {
          registered: false,
          verified: false,
          error: "not_registered",
          message: "No account found with this email. You need to register first.",
        },
        { status: 404 }
      );
    }

    const requestUrl = new URL(request.url);
    const origin =
      process.env.NEXT_PUBLIC_APP_URL ||
      requestUrl.origin ||
      "https://www.getclaimappeal.com";

    // Action: Resend verification email for unconfirmed accounts
    if (action === "resend_verification") {
      const { error: resendError } = await admin.auth.resend({
        type: "signup",
        email: cleanEmail,
        options: {
          emailRedirectTo: `${origin}/api/auth/callback?redirect=/dashboard`,
        },
      });

      if (resendError) {
        return NextResponse.json(
          {
            registered: true,
            error: resendError.message,
            message: resendError.message,
          },
          { status: 400 }
        );
      }

      return NextResponse.json({
        registered: true,
        success: true,
        message: "Verification email has been resent. Please check your inbox and spam folder.",
      });
    }

    // 2. Check if user's email has been verified / confirmed
    const isEmailVerified = !!targetUser.email_confirmed_at;

    if (!isEmailVerified) {
      return NextResponse.json(
        {
          registered: true,
          verified: false,
          error: "email_not_verified",
          message:
            "Your email address has not been verified yet. Please check your inbox to confirm your email before requesting a password reset.",
        },
        { status: 403 }
      );
    }

    // 3. User is registered and verified: dispatch password reset email
    const { error: resetError } = await admin.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo: `${origin}/api/auth/callback?redirect=/reset-password`,
    });

    if (resetError) {
      return NextResponse.json(
        {
          registered: true,
          verified: true,
          error: resetError.message,
          message: resetError.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      registered: true,
      verified: true,
      success: true,
      message: "Password reset link dispatched to your email.",
    });
  } catch (err: any) {
    console.error("[forgot-password API error]", err);
    return NextResponse.json(
      {
        registered: false,
        verified: false,
        error: "server_error",
        message: "An unexpected error occurred while processing your request. Please try again.",
      },
      { status: 500 }
    );
  }
}
