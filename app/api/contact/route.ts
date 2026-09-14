import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, carrier, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Please fill in all required fields (name, email, message)." },
        { status: 400 }
      );
    }

    if (!resend) {
      console.error("[Contact API] RESEND_API_KEY is not configured.");
      return NextResponse.json(
        { success: false, error: "Email service is temporarily unavailable. Please email support@getclaimappeal.com directly." },
        { status: 500 }
      );
    }

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; background-color: #f8fafc; margin: 0; padding: 24px; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; }
    .header { background: #0f172a; color: #ffffff; padding: 24px 32px; }
    .header h2 { margin: 0; font-size: 20px; font-weight: 700; }
    .header p { margin: 4px 0 0 0; font-size: 13px; color: #94a3b8; }
    .content { padding: 32px; }
    .field { margin-bottom: 20px; }
    .label { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-bottom: 4px; }
    .value { font-size: 15px; color: #0f172a; background: #f1f5f9; padding: 10px 14px; border-radius: 6px; }
    .message-box { font-size: 15px; color: #0f172a; background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; white-space: pre-wrap; }
    .footer { padding: 20px 32px; background: #f8fafc; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>📬 New Support Inquiry</h2>
      <p>Submitted via getclaimappeal.com/contact</p>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">From</div>
        <div class="value"><strong>${name}</strong> &lt;${email}&gt;</div>
      </div>
      <div class="field">
        <div class="label">Inquiry Category</div>
        <div class="value">${subject || "General Support"}</div>
      </div>
      ${
        carrier
          ? `
      <div class="field">
        <div class="label">Insurance Carrier</div>
        <div class="value">${carrier}</div>
      </div>
      `
          : ""
      }
      <div class="field">
        <div class="label">Detailed Message</div>
        <div class="message-box">${message}</div>
      </div>
    </div>
    <div class="footer">
      Hit "Reply" in your email client to respond directly to <strong>${email}</strong>.
    </div>
  </div>
</body>
</html>
    `;

    const result = await resend.emails.send({
      from: "ClaimAppeal AI Contact <noreply@getclaimappeal.com>",
      to: "support@getclaimappeal.com",
      replyTo: email,
      subject: `[Support Inquiry] ${subject || "Help with an Appeal Draft"} - ${name}`,
      html: htmlContent,
    });

    if (result.error) {
      console.error("[Contact API] Resend error:", result.error);
      return NextResponse.json(
        { success: false, error: result.error.message || "Failed to send message." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("[Contact API] Unexpected error:", err);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
