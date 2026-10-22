import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClientCloser AI — Autonomous Agency OS & Proposal Engine",
  description: "Turn cold prospect websites into closed $3,000+ retainers. Instant CRO site audits, 3-tier proposals, cold outreach packages, and AI scope creep shields.",
  keywords: ["ClientCloser AI", "Agency Operating System", "AI Proposal Generator", "CRO Site Audit", "Freelance Closing Tool", "Scope Creep Shield"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#090d16] text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}

