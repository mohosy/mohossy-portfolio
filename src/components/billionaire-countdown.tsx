"use client";

import { useEffect, useState } from "react";

const START_AT_MS = Date.UTC(2026, 4, 17, 19, 0, 0); // May 17, 2026, 12:00 PM PT
const DEADLINE_MS = START_AT_MS + 1000 * 86_400_000;
const DEADLINE_LABEL = "Feb 10, 2029";

type Remaining = { days: number; hours: number; minutes: number; seconds: number };

function getRemaining(now: number): Remaining {
  const diff = Math.max(0, DEADLINE_MS - now);
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1000),
  };
}

const INITIAL: Remaining = { days: 0, hours: 0, minutes: 0, seconds: 0 };

export function BillionaireCountdown() {
  const [r, setR] = useState<Remaining>(INITIAL);

  useEffect(() => {
    const tick = () => setR(getRemaining(Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const dd = String(r.days).padStart(3, "0");
  const hh = String(r.hours).padStart(2, "0");
  const mm = String(r.minutes).padStart(2, "0");
  const ss = String(r.seconds).padStart(2, "0");

  return (
    <aside
      className="cd-overlay"
      aria-label={`Countdown ending ${DEADLINE_LABEL}`}
    >
      <div className="cd-overlay-ribbon">
        <span className="cd-overlay-dot" aria-hidden="true">●</span>
        Countdown
      </div>
      <div className="cd-overlay-digits" suppressHydrationWarning>
        <span className="sr-only">{`${r.days} days, ${r.hours} hours, ${r.minutes} minutes, ${r.seconds} seconds remaining`}</span>
        <span aria-hidden="true">{dd}</span>
        <span className="cd-overlay-sep" aria-hidden="true">:</span>
        <span aria-hidden="true">{hh}</span>
        <span className="cd-overlay-sep" aria-hidden="true">:</span>
        <span aria-hidden="true">{mm}</span>
        <span className="cd-overlay-sep" aria-hidden="true">:</span>
        <span aria-hidden="true">{ss}</span>
      </div>
    </aside>
  );
}
