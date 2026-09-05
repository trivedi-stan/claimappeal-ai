import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { AppealPdfDocument } from "@/components/pdf/AppealPdfDocument";
import { generateRequestId } from "@/lib/utils";
import React from "react";

/**
 * POST /api/documents/pdf — Render and return a PDF buffer.
 * Returns raw application/pdf for download.
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

    const { appealId, editedBody } = await request.json();
    if (!appealId || !editedBody) {
      return NextResponse.json(
        { success: false, data: null, error: "Missing appeal ID or body", requestId },
        { status: 400 }
      );
    }

    // Get latest version for metadata
    const { data: version } = await supabase
      .from("appeal_versions")
      .select("structured_output")
      .eq("appeal_id", appealId)
      .order("version_number", { ascending: false })
      .limit(1)
      .single();

    if (!version?.structured_output) {
      return NextResponse.json(
        { success: false, data: null, error: "No generated letter found", requestId },
        { status: 404 }
      );
    }

    const output = version.structured_output as Record<string, unknown>;
    const letter = output.letter as { recipient: string; subject: string };

    // Render PDF
    const pdfBuffer = await renderToBuffer(
      React.createElement(AppealPdfDocument, {
        recipient: letter.recipient,
        subject: letter.subject,
        body: editedBody,
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      })
    );

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="appeal-letter.pdf"`,
      },
    });
  } catch (err) {
    console.error("[API] POST /api/documents/pdf error:", err);
    return NextResponse.json(
      { success: false, data: null, error: "Failed to generate PDF", requestId },
      { status: 500 }
    );
  }
}
