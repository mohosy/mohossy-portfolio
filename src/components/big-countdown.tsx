"use client";

import { AnimatePresence, motion } from "framer-motion";

const pad = (n: number, width = 2) => String(n).padStart(width, "0");

function groups(seconds: number, days: number) {
  return [
    { label: "DAYS", value: pad(days, 3) },
    { label: "HRS", value: pad(Math.floor((seconds % 86_400) / 3600)) },
    { label: "MIN", value: pad(Math.floor((seconds % 3600) / 60)) },
    { label: "SEC", value: pad(seconds % 60) },
  ];
}

// Each digit rolls down into place when it changes.
function Digit({ value }: { value: string }) {
  return (
    <span className="relative inline-block h-[1.15em] overflow-hidden px-[0.04em]">
      <span className="invisible">0</span>
      <AnimatePresence initial={false}>
        <motion.span
          key={value}
          className="absolute inset-0 text-center"
          initial={{ y: "-100%" }}
          animate={{ y: "0%", transition: { duration: 0.32, ease: [0.34, 1.56, 0.64, 1] } }}
          exit={{ y: "100%", transition: { duration: 0.22, ease: "easeIn" } }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

// Big DDD:HH:MM:SS with DAYS/HRS/MIN/SEC labels. The caller sets the font and the size (font-size).
// `days` replaces the full days left (e.g. /count shows the day you're in, so it matches the reel).
export function BigCountdown({ seconds, days, className = "" }: { seconds: number; days?: number; className?: string }) {
  return (
    <div
      className={`flex items-start justify-center leading-[1.15] ${className}`}
      role="timer"
      aria-label={`${seconds} seconds left`}
    >
      {groups(seconds, days ?? Math.floor(seconds / 86_400)).map((group, i) => (
        <div key={group.label} className="flex items-start">
          {i > 0 && <span className="h-[1.15em]">:</span>}
          <div className="flex flex-col items-center">
            <div className="flex">
              <AnimatePresence initial={false}>
                {group.value.split("").map((digit, d, all) => (
                  // Keyed from the right, so 1000 -> 999 slides the leading "1" away smoothly.
                  <motion.span
                    key={all.length - 1 - d}
                    className="inline-block overflow-hidden"
                    initial={{ width: 0 }}
                    animate={{ width: "auto" }}
                    exit={{ width: 0 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                  >
                    <Digit value={digit} />
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
            <span className="mt-[0.35em] text-[max(0.14em,12px)] tracking-[0.2em] text-neutral-500">{group.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
