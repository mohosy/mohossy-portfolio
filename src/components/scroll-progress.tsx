"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    damping: 28,
    stiffness: 120,
    mass: 0.22,
  });

  if (reducedMotion) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed left-2.5 top-1/2 z-40 hidden h-32 w-[2px] -translate-y-1/2 rounded-full bg-black/8 lg:block">
      <motion.div
        className="h-full w-full origin-top rounded-full bg-[var(--accent-teal)] shadow-[0_0_10px_rgba(37,99,235,0.3)]"
        style={{ scaleY: progress }}
      />
    </div>
  );
}
