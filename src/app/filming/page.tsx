import type { Metadata } from "next";
import { FilmingCountdown } from "@/components/filming-countdown";

export const metadata: Metadata = {
  title: "Filming",
  robots: { index: false },
};

export default function FilmingPage() {
  return (
    <main id="main-content" className="flex min-h-[100svh] items-center justify-center bg-white text-black">
      <FilmingCountdown />
    </main>
  );
}
