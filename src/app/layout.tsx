import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://operators-grimoire.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "The Claude Code Operator's Grimoire — 14 senior-dev skills, $99",
  description:
    "Fourteen curated Claude Code skills that turn the CLI into a disciplined senior operator: spec-driven dev, ADRs, scaffolds, evals, orchestration. One-time purchase. No subscription. No telemetry.",
  applicationName: "Operator's Grimoire",
  keywords: [
    "Claude Code",
    "Claude skills",
    "spec-driven development",
    "ADR",
    "agent orchestration",
    "Anthropic",
    "developer tools",
  ],
  authors: [{ name: "Operator" }],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Operator's Grimoire",
    title: "The Claude Code Operator's Grimoire",
    description:
      "Fourteen curated Claude Code skills for senior developers. One-time $99. No subscription. No telemetry.",
    images: [
      {
        url: "/og-card.png",
        width: 1200,
        height: 630,
        alt: "The Operator's Grimoire",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Claude Code Operator's Grimoire",
    description:
      "Fourteen curated Claude Code skills for senior developers. One-time $99.",
    images: ["/og-card.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
