import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { AIService } from "@/services/ai.service";
import { generateRequestId } from "@/lib/utils";
import { checkRateLimit, RATE_LIMITS } from "@/lib/security/rate-limiter";

/**
 * POST /api/appeals/[id]/generate — Trigger AI generation pipeline
 * Rate-limited endpoint (most expensive operation).
 */
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const requestId = generateRequestId();

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { success: false, data: null, error: "Unauthorized", requestId },
        { status: 401 }
      );
    }

    // Rate limit check (expensive AI operation)
    const rateLimit = checkRateLimit(user.id, RATE_LIMITS.generation);
    if (!rateLimit.success) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "Too many generation requests. Please wait a moment before trying again.",
          requestId,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.max(1, rateLimit.reset - Math.floor(Date.now() / 1000))),
            "X-RateLimit-Limit": String(rateLimit.limit),
            "X-RateLimit-Remaining": String(rateLimit.remaining),
            "X-RateLimit-Reset": String(rateLimit.reset),
          },
        }
      );
    }

    const result = await AIService.generateAppeal(user.id, id);

    return NextResponse.json({
      success: true,
      data: {
        output: result.output,
        versionNumber: result.versionNumber,
        durationMs: result.durationMs,
      },
      error: null,
      requestId,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";

    // Map internal errors to safe user-facing messages
    const userMessages: Record<string, { msg: string; status: number }> = {
      QUOTA_EXCEEDED: {
        msg: "You've reached your generation limit for this period. Please upgrade your plan.",
        status: 429,
      },
      PROMPT_INJECTION_DETECTED: {
        msg: "Suspicious instruction patterns detected in your appeal inputs. Please ensure your inputs only contain factual information.",
        status: 400,
      },
      APPEAL_NOT_FOUND: { msg: "Appeal not found.", status: 404 },
      UNAUTHORIZED: { msg: "Not authorized.", status: 403 },
    };

    const mapped = userMessages[message];
    if (mapped) {
      return NextResponse.json(
        { success: false, data: null, error: mapped.msg, requestId },
        { status: mapped.status }
      );
    }

    console.error(`[API] POST /api/appeals/${id}/generate error:`, err);
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: "We couldn't generate your appeal right now. Your information has been saved. Please try again.",
        requestId,
      },
      { status: 500 }
    );
  }
}
