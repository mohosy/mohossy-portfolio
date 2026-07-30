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
    default: "Mo Shirmohammadi | Network & Systems Engineer",
    template: "%s | Mo Shirmohammadi",
  },
  description:
    "Network and systems engineer working across BGP/OSPF routing fabrics, eBPF data planes, and cloud infrastructure, plus the automation and observability that keep them online.",
  keywords: [
    "Mo Shirmohammadi",
    "Network Engineer",
    "Systems Engineer",
    "BGP",
    "OSPF",
    "eBPF",
    "XDP",
    "Network Automation",
    "Software Engineer",
    "Portfolio",
    "USC",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://mohossy.com",
    title: "Mo Shirmohammadi | Network & Systems Engineer",
    description:
      "Routing fabrics, eBPF data planes, and cloud infrastructure, with the automation and observability that keep them online.",
    images: [
      {
        url: "/images/tedx/tedx-stage.jpg",
        width: 2400,
        height: 1600,
        alt: "Mo Shirmohammadi speaking on the TEDx stage",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mo Shirmohammadi | Network & Systems Engineer",
    description:
      "Routing fabrics, eBPF data planes, and cloud infrastructure, with the automation and observability that keep them online.",
    images: ["/images/tedx/tedx-stage.jpg"],
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
      <body className={`${display.variable} ${sans.variable} ${mono.variable} antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-[var(--accent-teal)] focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-black"
        >
          Skip to main content
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
