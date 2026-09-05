import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { AppealService } from "@/services/appeal.service";
import { generateRequestId } from "@/lib/utils";

/**
 * GET    /api/appeals/[id] — Get single appeal
 * PATCH  /api/appeals/[id] — Update appeal + wizard step data
 * DELETE /api/appeals/[id] — Delete appeal
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const requestId = generateRequestId();
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, data: null, error: "Unauthorized", requestId }, { status: 401 });
    }

    const appeal = await AppealService.getById(id);
    if (!appeal || appeal.profile_id !== user.id) {
      return NextResponse.json({ success: false, data: null, error: "Not found", requestId }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: appeal, error: null, requestId });
  } catch (err) {
    console.error(`[API] GET /api/appeals/${id} error:`, err);
    return NextResponse.json({ success: false, data: null, error: "Failed to get appeal", requestId }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const requestId = generateRequestId();
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, data: null, error: "Unauthorized", requestId }, { status: 401 });
    }

    // Verify ownership
    const existing = await AppealService.getById(id);
    if (!existing || existing.profile_id !== user.id) {
      return NextResponse.json({ success: false, data: null, error: "Not found", requestId }, { status: 404 });
    }

    const body = await request.json();

    // Update appeal metadata
    if (body.title || body.status) {
      await AppealService.update(id, {
        title: body.title,
        status: body.status,
      });
    }

    // Save wizard step data
    if (body.insurance && body.insurance.company) {
      await AppealService.saveInsuranceInfo(id, body.insurance);
    }
    if (body.claim) {
      await AppealService.saveClaimInfo(id, body.claim);
    }
    if (body.denial && body.denial.denial_reason) {
      await AppealService.saveDenialInfo(id, body.denial);
    }
    if (body.supporting) {
      await AppealService.saveSupportingInfo(id, body.supporting);
    }

    const updated = await AppealService.getById(id);
    return NextResponse.json({ success: true, data: updated, error: null, requestId });
  } catch (err) {
    console.error(`[API] PATCH /api/appeals/${id} error:`, err);
    return NextResponse.json({ success: false, data: null, error: "Failed to update appeal", requestId }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const requestId = generateRequestId();
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, data: null, error: "Unauthorized", requestId }, { status: 401 });
    }

    const existing = await AppealService.getById(id);
    if (!existing || existing.profile_id !== user.id) {
      return NextResponse.json({ success: false, data: null, error: "Not found", requestId }, { status: 404 });
    }

    await AppealService.delete(id);
    return NextResponse.json({ success: true, data: null, error: null, requestId });
  } catch (err) {
    console.error(`[API] DELETE /api/appeals/${id} error:`, err);
    return NextResponse.json({ success: false, data: null, error: "Failed to delete appeal", requestId }, { status: 500 });
  }
}
