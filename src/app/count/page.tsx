import type { Metadata } from "next";
import { ThousandDayCountdown } from "@/components/thousand-day-countdown";

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
      className="flex min-h-[100svh] items-center justify-center bg-white py-6 text-black"
    >
      <ThousandDayCountdown />
    </main>
  );
}
