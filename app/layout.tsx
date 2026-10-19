import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Local Client Engine | High-Converting Pitch & Roadmap Generator",
  description: "Build & sell $1,500 local business websites in under 2 hours. Generate custom AI system prompts, 5-page roadmaps, and 3-tier closing scripts for cafes, clinics, salons, and local services.",
  keywords: ["Whop SaaS", "Local Business Websites", "Agency Prompts", "Freelance Web Dev", "Client Pitch Scripts"],
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

