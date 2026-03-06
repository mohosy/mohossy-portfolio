"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  intensity?: "low" | "medium";
  from?: "bottom" | "left";
  pace?: "normal" | "slow";
};

export function Reveal({
  children,
  className,
  delay = 0,
  intensity = "medium",
  from = "bottom",
  pace = "normal",
}: RevealProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 92%", "end 8%"],
  });
  const entryPoint = Math.min(
    (intensity === "low" ? 0.12 : 0.14) + delay * (pace === "slow" ? 0.7 : 0.45),
    pace === "slow" ? 0.5 : 0.35,
  );
  const exitPoint = 0.9;
  const introY = intensity === "low" ? 34 : 58;
  const outroY = intensity === "low" ? -20 : -38;
  const introX =
    from === "left"
      ? intensity === "low"
        ? pace === "slow"
          ? -56
          : -42
        : pace === "slow"
          ? -88
          : -68
      : 0;
  const outroX = from === "left" ? (intensity === "low" ? 12 : 18) : 0;
  const introScale = intensity === "low" ? 0.975 : 0.955;
  const outroScale = intensity === "low" ? 0.986 : 0.972;
  const y = useTransform(scrollYProgress, [0, entryPoint, exitPoint, 1], [introY, 0, 0, outroY]);
  const x = useTransform(scrollYProgress, [0, entryPoint, exitPoint, 1], [introX, 0, 0, outroX]);
  const opacity = useTransform(scrollYProgress, [0, entryPoint, exitPoint, 1], [0, 1, 1, 0.56]);
  const scale = useTransform(
    scrollYProgress,
    [0, entryPoint, exitPoint, 1],
    [introScale, 1, 1, outroScale],
  );

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ opacity, x, y, scale }}
    >
      {children}
    </motion.div>
  );
}
