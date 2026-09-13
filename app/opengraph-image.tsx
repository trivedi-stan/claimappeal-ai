import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ClaimAppeal AI — Turn Insurance Denials Into Overturned Appeals";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#09090b",
          backgroundImage:
            "radial-gradient(circle at 25px 25px, #18181b 2%, transparent 0%), radial-gradient(circle at 75px 75px, #18181b 2%, transparent 0%)",
          backgroundSize: "100px 100px",
          padding: "70px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                backgroundColor: "rgba(59, 130, 246, 0.15)",
                border: "1px solid rgba(59, 130, 246, 0.4)",
                color: "#3b82f6",
                fontSize: "24px",
                fontWeight: "bold",
              }}
            >
              🛡️
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
              <span style={{ fontSize: "28px", fontWeight: "800", color: "#ffffff", letterSpacing: "-0.02em" }}>
                ClaimAppeal
              </span>
              <span style={{ fontSize: "16px", fontWeight: "700", color: "#3b82f6", fontFamily: "monospace" }}>
                AI
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "8px 18px",
              borderRadius: "9999px",
              backgroundColor: "rgba(39, 39, 42, 0.8)",
              border: "1px solid #3f3f46",
              color: "#a1a1aa",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            ERISA § 503 &amp; ACA § 2719 Defense Framework
          </div>
        </div>

        {/* Center Main Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "980px" }}>
          <h1
            style={{
              fontSize: "56px",
              fontWeight: "900",
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              color: "#ffffff",
              margin: 0,
            }}
          >
            Turn Health Insurance Denials Into Irrefutable Legal Appeals
          </h1>
          <p
            style={{
              fontSize: "22px",
              color: "#a1a1aa",
              lineHeight: 1.4,
              margin: 0,
            }}
          >
            Synthesize formal, letterhead-ready rebuttals citing clinical guidelines, statutory precedents, and treating physician evidence in under 2 minutes.
          </p>
        </div>

        {/* Bottom Feature Badges */}
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "16px",
              color: "#22c55e",
              fontWeight: "600",
            }}
          >
            ✓ 1 Lifetime Free Appeal Per Account
          </div>
          <div style={{ color: "#52525b" }}>•</div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "16px",
              color: "#60a5fa",
              fontWeight: "600",
            }}
          >
            ✓ CARC/RARC Denial Code Decoder
          </div>
          <div style={{ color: "#52525b" }}>•</div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "16px",
              color: "#fbbf24",
              fontWeight: "600",
            }}
          >
            ✓ Clinical Letterhead PDF Export
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
