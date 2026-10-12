import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThousandDayCountdown } from "@/components/thousand-day-countdown";

const minecraft = localFont({
  src: "../../fonts/Minecraft.ttf",
  display: "block",
});

export const metadata: Metadata = {
  title: "1000 Day Countdown",
  alternates: {
    canonical: "/count",
  },
};

export default function CountPage() {
  return (
    <main
      id="main-content"
      className={`${minecraft.className} flex min-h-[100svh] items-center justify-center bg-white py-16 text-black`}
    >
      <ThousandDayCountdown />
    </main>
  );
}
