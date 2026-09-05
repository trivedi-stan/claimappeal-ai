import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClaimAppeal AI — Turn Insurance Denials Into Professional Appeals",
  description:
    "Generate professional insurance appeal letters in minutes. ClaimAppeal AI helps patients and billing professionals draft compelling appeals from confusing denial letters.",
  keywords: [
    "insurance appeal",
    "claim denial",
    "appeal letter",
    "medical billing",
    "insurance denial help",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            duration: 4000,
          }}
        />
      </body>
    </html>
  );
}
