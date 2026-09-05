import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { AppealService } from "@/services/appeal.service";
import { generateRequestId } from "@/lib/utils";

/**
 * POST /api/appeals — Create a new appeal
 * GET  /api/appeals — List user's appeals
 */
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const appeal = await AppealService.create(user.id, body.title);

    return NextResponse.json(
      { success: true, data: appeal, error: null, requestId },
      { status: 201 }
    );
  } catch (err) {
    console.error("[API] POST /api/appeals error:", err);
    return NextResponse.json(
      { success: false, data: null, error: "Failed to create appeal", requestId },
      { status: 500 }
    );
  }
}

export async function GET() {
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

    const appeals = await AppealService.list(user.id);

    return NextResponse.json(
      { success: true, data: appeals, error: null, requestId },
      { status: 200 }
    );
  } catch (err) {
    console.error("[API] GET /api/appeals error:", err);
    return NextResponse.json(
      { success: false, data: null, error: "Failed to list appeals", requestId },
      { status: 500 }
    );
  }
}
