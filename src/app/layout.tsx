import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { IBM_Plex_Mono, Plus_Jakarta_Sans, Syne } from "next/font/google";
import "./globals.css";

const display = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const sans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mohossy.com"),
  title: {
    default: "Mo Shirmohammadi | Software Engineer Portfolio",
    template: "%s | Mo Shirmohammadi",
  },
  description:
    "Software engineer portfolio focused on distributed systems, data infrastructure, and applied ML. Includes interactive systems demos and flagship engineering projects.",
  keywords: [
    "Mo Shirmohammadi",
    "Software Engineer",
    "Distributed Systems",
    "Data Infrastructure",
    "Applied ML",
    "Portfolio",
    "USC",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://mohossy.com",
    title: "Mo Shirmohammadi | Software Engineer Portfolio",
    description:
      "Production-minded systems, data, and ML engineering projects with interactive demos.",
    images: [
      {
        url: "/images/touchless-ops-copilot.png",
        width: 1200,
        height: 630,
        alt: "Surgical data mesh dashboard preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mo Shirmohammadi | Software Engineer Portfolio",
    description:
      "Production-minded systems, data, and ML engineering projects with interactive demos.",
    images: ["/images/touchless-ops-copilot.png"],
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
    <html lang="en">
      <body className={`${display.variable} ${sans.variable} ${mono.variable} antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-[var(--accent-teal)] focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to main content
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
