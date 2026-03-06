"use client";

import { useEffect, useState } from "react";

type TypewriterKickerProps = {
  text: string;
  speedMs?: number;
  delayMs?: number;
};

export function TypewriterKicker({
  text,
  speedMs = 82,
  delayMs = 720,
}: TypewriterKickerProps) {
  const [count, setCount] = useState(0);
  const [state, setState] = useState<"waiting" | "typing" | "done">("waiting");

  useEffect(() => {
    let intervalId: number | null = null;
    const delayId = window.setTimeout(() => {
      setCount(0);
      setState("typing");
      intervalId = window.setInterval(() => {
        setCount((prev) => {
          if (prev >= text.length) {
            if (intervalId !== null) {
              window.clearInterval(intervalId);
            }
            setState("done");
            return prev;
          }
          return prev + 1;
        });
      }, speedMs);
    }, delayMs);

    return () => {
      window.clearTimeout(delayId);
      if (intervalId !== null) {
        window.clearInterval(intervalId);
      }
    };
  }, [text, speedMs, delayMs]);

  const isDone = count >= text.length;
  const visibleText = text.slice(0, count);

  return (
    <span
      className={["hero-kicker-typewriter", state === "typing" ? "is-typing" : ""].join(" ")}
      data-complete={isDone ? "true" : "false"}
      data-state={state}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="hero-kicker-visible">
        {visibleText}
      </span>
      <span aria-hidden="true" className="hero-kicker-caret" />
    </span>
  );
}
