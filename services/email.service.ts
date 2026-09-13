import { Resend } from "resend";
import { getPlan, type PlanId } from "@/config/plans";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const fromEmail = process.env.EMAIL_FROM || "onboarding@resend.dev";

export interface SubscriptionEmailParams {
  to: string;
  userName?: string;
  plan: PlanId;
  subscriptionId: string;
  amountFormatted?: string;
  nextBillingDate?: string;
}

export class EmailService {
  /**
   * Send a branded subscription activation receipt to the customer
   */
  static async sendSubscriptionActivatedEmail({
    to,
    userName,
    plan,
    subscriptionId,
    amountFormatted,
    nextBillingDate,
  }: SubscriptionEmailParams): Promise<boolean> {
    if (!resend) {
      console.warn("[EmailService] RESEND_API_KEY not configured, skipping email delivery.");
      return false;
    }

    const planConfig = getPlan(plan);
    const displayName = userName || to.split("@")[0];
    const priceText = amountFormatted || `$${planConfig.priceMonthly / 100}/month`;
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL || "https://claimappeal.ai";

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #09090b; color: #f4f4f5; margin: 0; padding: 40px 20px; }
    .container { max-width: 540px; margin: 0 auto; background: #18181b; border: 1px solid #27272a; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
    .header { padding: 32px 32px 24px; text-align: center; border-bottom: 1px solid #27272a; background: linear-gradient(180deg, rgba(37,99,235,0.1) 0%, transparent 100%); }
    .logo { font-size: 20px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; }
    .logo span { color: #3b82f6; }
    .badge { display: inline-block; background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.3); color: #34d399; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 20px; margin-top: 12px; text-transform: uppercase; }
    .content { padding: 32px; }
    h1 { font-size: 22px; font-weight: 700; margin: 0 0 12px; color: #ffffff; text-align: center; }
    p { font-size: 14px; line-height: 1.6; color: #a1a1aa; margin: 0 0 20px; }
    .receipt-card { background: #27272a; border-radius: 12px; padding: 20px; margin: 24px 0; }
    .receipt-row { display: flex; justify-content: space-between; font-size: 13px; padding: 8px 0; border-bottom: 1px solid #3f3f46; }
    .receipt-row:last-child { border-bottom: none; padding-bottom: 0; }
    .label { color: #a1a1aa; }
    .value { color: #ffffff; font-weight: 600; text-align: right; }
    .cta-btn { display: block; width: fit-content; margin: 28px auto 0; background: #2563eb; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; padding: 12px 32px; border-radius: 8px; text-align: center; }
    .footer { padding: 20px; text-align: center; font-size: 12px; color: #71717a; border-top: 1px solid #27272a; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">ClaimAppeal <span>AI</span></div>
      <div class="badge">Payment Confirmed</div>
    </div>
    <div class="content">
      <h1>Subscription Activated!</h1>
      <p>Hello ${displayName},</p>
      <p>Thank you for subscribing to <strong>ClaimAppeal AI ${planConfig.name} Plan</strong>. Your generation quota has been refreshed and is ready for use.</p>
      
      <div class="receipt-card">
        <div class="receipt-row">
          <span class="label">Plan</span>
          <span class="value">${planConfig.name} Plan</span>
        </div>
        <div class="receipt-row">
          <span class="label">Quota</span>
          <span class="value">${planConfig.generationsPerMonth} Appeals / Month</span>
        </div>
        <div class="receipt-row">
          <span class="label">Amount</span>
          <span class="value">${priceText}</span>
        </div>
        <div class="receipt-row">
          <span class="label">Subscription ID</span>
          <span class="value" style="font-family: monospace; font-size: 11px;">${subscriptionId}</span>
        </div>
        ${
          nextBillingDate
            ? `<div class="receipt-row">
                 <span class="label">Next Billing Date</span>
                 <span class="value">${new Date(nextBillingDate).toLocaleDateString()}</span>
               </div>`
            : ""
        }
      </div>

      <a href="${appUrl}/dashboard" class="cta-btn">Open Dashboard</a>
    </div>
    <div class="footer">
      Questions? Contact support at support@claimappeal.ai<br>
      © ${new Date().getFullYear()} ClaimAppeal AI. All rights reserved.
    </div>
  </div>
</body>
</html>
    `;

    try {
      await resend.emails.send({
        from: `ClaimAppeal AI <${fromEmail}>`,
        to: [to],
        subject: `[Receipt] Your ClaimAppeal AI ${planConfig.name} subscription is active!`,
        html: htmlContent,
      });
      return true;
    } catch (err) {
      console.error("[EmailService] Failed to send subscription receipt email:", err);
      return false;
    }
  }

  /**
   * Send cancellation confirmation email
   */
  static async sendSubscriptionCancelledEmail({
    to,
    userName,
    plan,
    endDate,
  }: {
    to: string;
    userName?: string;
    plan: PlanId;
    endDate?: string;
  }): Promise<boolean> {
    if (!resend) return false;

    const planConfig = getPlan(plan);
    const displayName = userName || to.split("@")[0];
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://claimappeal.ai";

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #09090b; color: #f4f4f5; margin: 0; padding: 40px 20px; }
    .container { max-width: 540px; margin: 0 auto; background: #18181b; border: 1px solid #27272a; border-radius: 16px; overflow: hidden; }
    .header { padding: 32px 32px 20px; text-align: center; border-bottom: 1px solid #27272a; }
    .logo { font-size: 20px; font-weight: 800; color: #ffffff; }
    .logo span { color: #3b82f6; }
    .content { padding: 32px; }
    h1 { font-size: 20px; font-weight: 700; margin: 0 0 12px; color: #ffffff; text-align: center; }
    p { font-size: 14px; line-height: 1.6; color: #a1a1aa; margin: 0 0 16px; }
    .note { background: #27272a; border-radius: 8px; padding: 16px; font-size: 13px; color: #d4d4d8; margin: 20px 0; }
    .cta-btn { display: block; width: fit-content; margin: 24px auto 0; background: #27272a; border: 1px solid #3f3f46; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 600; padding: 10px 24px; border-radius: 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">ClaimAppeal <span>AI</span></div>
    </div>
    <div class="content">
      <h1>Subscription Cancellation Confirmed</h1>
      <p>Hello ${displayName},</p>
      <p>We've received your request to cancel your <strong>${planConfig.name} Plan</strong> subscription.</p>
      <div class="note">
        ${
          endDate
            ? `You will continue to have full access to your ${planConfig.name} generation quota until <strong>${new Date(endDate).toLocaleDateString()}</strong>.`
            : "Your subscription has been canceled."
        }
      </div>
      <p>After that, your account will return to the standard free tier. If you ever want to resume your subscription, you can do so anytime from your settings.</p>
      <a href="${appUrl}/settings/billing" class="cta-btn">Manage Subscription</a>
    </div>
  </div>
</body>
</html>
    `;

    try {
      await resend.emails.send({
        from: `ClaimAppeal AI <${fromEmail}>`,
        to: [to],
        subject: `Your ClaimAppeal AI ${planConfig.name} subscription has been canceled`,
        html: htmlContent,
      });
      return true;
    } catch (err) {
      console.error("[EmailService] Failed to send cancellation email:", err);
      return false;
    }
  }
}
