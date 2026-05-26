"use client";

import { useEffect, useState } from "react";

const START_AT_MS = Date.UTC(2026, 4, 17, 19, 0, 0); // May 17, 2026, 12:00 PM PT (PDT, UTC-7)
const DEADLINE_MS = START_AT_MS + 1000 * 86_400_000;
const DEADLINE_LABEL = "February 10, 2029";

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

function Digit({ value }: { value: string }) {
  return (
    <span className="cd-digit" aria-hidden="true">
      <span key={value} className="cd-digit-glyph">
        {value}
      </span>
    </span>
  );
}

function NumGroup({
  value,
  pad,
  label,
  fullLabel,
}: {
  value: number;
  pad: number;
  label: string;
  fullLabel: string;
}) {
  const padded = String(value).padStart(pad, "0");
  return (
    <div className="cd-group">
      <div className="cd-digits">
        <span className="sr-only">{`${value} ${fullLabel}`}</span>
        {padded.split("").map((ch, i) => (
          <Digit key={`${label}-${i}`} value={ch} />
        ))}
      </div>
      <span className="cd-label">{label}</span>
    </div>
  );
}

export function BillionaireCountdown() {
  const [remaining, setRemaining] = useState<Remaining>(INITIAL);

  useEffect(() => {
    const tick = () => setRemaining(getRemaining(Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="billionaire-countdown"
      className="section-shell mt-8"
      aria-label="1000 days to become a billionaire — countdown"
    >
      <div className="cd-banner">
        <div className="cd-ribbon">
          <span className="cd-blink" aria-hidden="true">
            ●
          </span>
          1000 Days to Billionaire — or International Headlines
        </div>

        <div className="cd-grid" suppressHydrationWarning>
          <NumGroup value={remaining.days} pad={3} label="days" fullLabel="days" />
          <span className="cd-sep" aria-hidden="true">:</span>
          <NumGroup value={remaining.hours} pad={2} label="hrs" fullLabel="hours" />
          <span className="cd-sep" aria-hidden="true">:</span>
          <NumGroup value={remaining.minutes} pad={2} label="min" fullLabel="minutes" />
          <span className="cd-sep" aria-hidden="true">:</span>
          <NumGroup value={remaining.seconds} pad={2} label="sec" fullLabel="seconds" />
        </div>

        <p className="cd-foot">
          Challenge started May 17, 2026 · Deadline {DEADLINE_LABEL}
        </p>
      </div>
    </section>
  );
}
