import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";
import "./globals.css";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.getclaimappeal.com";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#09090b",
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "ClaimAppeal AI — Turn Insurance Denials Into Professional Appeals",
    template: "%s | ClaimAppeal AI",
  },
  description:
    "Generate formal, legal-precedent and clinical-evidence backed insurance appeal letters in under 2 minutes. Overturn health insurance denials with ERISA § 503 and ACA § 2719 citations.",
  keywords: [
    "insurance appeal",
    "claim denial",
    "appeal letter template",
    "medical necessity appeal",
    "prior authorization denial",
    "ERISA appeal deadlines",
    "CARC denial codes",
    "health insurance dispute",
    "medical billing advocate",
    "how to appeal denied claim",
  ],
  authors: [{ name: "ClaimAppeal AI Clinical & Legal Research Team" }],
  creator: "ClaimAppeal AI",
  publisher: "ClaimAppeal AI",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "ClaimAppeal AI",
    title: "ClaimAppeal AI — Turn Insurance Denials Into Overturned Appeals",
    description:
      "Stop letting automated carrier algorithms deny medically necessary care. Synthesize formal, letterhead-ready rebuttals citing clinical guidelines and federal statutory precedents in under 2 minutes.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ClaimAppeal AI — Turn Insurance Denials Into Overturned Appeals",
    description:
      "Synthesize formal, letterhead-ready rebuttals citing clinical guidelines and federal statutory precedents in under 2 minutes.",
    creator: "@ClaimAppealAI",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "googleb1ddb028e5d2b9db",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${baseUrl}/#organization`,
      name: "ClaimAppeal AI",
      url: baseUrl,
      description:
        "AI-powered legal and clinical rebuttal platform overturning health insurance claim denials under ERISA § 503 and ACA § 2719.",
      sameAs: [
        "https://twitter.com/ClaimAppealAI",
        "https://github.com/trivedi-stan/claimappeal-ai",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
      url: baseUrl,
      name: "ClaimAppeal AI",
      publisher: {
        "@id": `${baseUrl}/#organization`,
      },
      inLanguage: "en-US",
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${baseUrl}/#application`,
      name: "ClaimAppeal AI",
      applicationCategory: "HealthApplication",
      operatingSystem: "All",
      offers: {
        "@type": "Offer",
        price: "0.00",
        priceCurrency: "USD",
        description: "1 Free Lifetime Appeal Rebuttal Draft",
      },
      featureList: [
        "Automated CARC/RARC Denial Code Extraction",
        "ERISA § 503 Statutory Citation Grounding",
        "ACA § 2719 Timeliness Compliance Check",
        "Letterhead PDF Export with Medical Exhibits",
      ],
    },
  ],
};

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || "G-CMKJM9CNET";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased text-foreground selection:bg-primary/25 selection:text-primary-foreground">
        {/* Google tag (gtag.js) */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', '${GA_MEASUREMENT_ID}');
            `,
          }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          {children}
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              duration: 4000,
            }}
          />
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
