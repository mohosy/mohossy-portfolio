import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Inter } from "next/font/google";
import "./globals.css";

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
  icons: {
    icon: [
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/icons/favicon-32.png",
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sans.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
