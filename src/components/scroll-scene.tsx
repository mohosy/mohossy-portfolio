"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { createContext, useContext, useRef, type ReactNode } from "react";

const SceneProgressContext = createContext<MotionValue<number> | null>(null);

export function useSceneProgress() {
  return useContext(SceneProgressContext);
}

type ScrollSceneProps = {
  children: ReactNode;
  scrollHeight?: string;
  className?: string;
  id?: string;
  /** Disable pinning — content scrolls normally (for final sections) */
  static?: boolean;
};

export function ScrollScene({
  children,
  scrollHeight = "180vh",
  className,
  id,
  static: isStatic = false,
}: ScrollSceneProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end end"],
  });

  const enterScale = useTransform(scrollYProgress, [0, 0.15], [0.92, 1]);
  const holdScale = useTransform(scrollYProgress, [0.15, 0.75], [1, 1]);
  const exitScale = useTransform(scrollYProgress, [0.75, 1], [1, 0.95]);
  const scale = useTransform(scrollYProgress, (v) => {
    if (v < 0.15) return enterScale.get();
    if (v > 0.75) return exitScale.get();
    return holdScale.get();
  });

  const enterOpacity = useTransform(scrollYProgress, [0, 0.12], [0, 1]);
  const holdOpacity = useTransform(scrollYProgress, [0.12, 0.78], [1, 1]);
  const exitOpacity = useTransform(scrollYProgress, [0.78, 1], [1, 0]);
  const opacity = useTransform(scrollYProgress, (v) => {
    if (v < 0.12) return enterOpacity.get();
    if (v > 0.78) return exitOpacity.get();
    return holdOpacity.get();
  });

  const blur = useTransform(scrollYProgress, (v) => {
    if (v < 0.15) {
      const t = v / 0.15;
      return `blur(${(1 - t) * 6}px)`;
    }
    if (v > 0.8) {
      const t = (v - 0.8) / 0.2;
      return `blur(${t * 4}px)`;
    }
    return "blur(0px)";
  });

  // Reduced motion or static: no pinning, just render children
  if (reducedMotion || isStatic) {
    return (
      <SceneProgressContext.Provider value={scrollYProgress}>
        <div ref={outerRef} id={id} className={className}>
          {children}
        </div>
      </SceneProgressContext.Provider>
    );
  }

  return (
    <SceneProgressContext.Provider value={scrollYProgress}>
      <div
        ref={outerRef}
        id={id}
        style={{ height: scrollHeight }}
        className="relative"
      >
        <div
          className="sticky top-0 flex min-h-screen items-center overflow-hidden"
          style={{ height: "100vh" }}
        >
          <motion.div
            className={["w-full", className ?? ""].join(" ").trim()}
            style={{ scale, opacity, filter: blur }}
          >
            {children}
          </motion.div>
        </div>
      </div>
    </SceneProgressContext.Provider>
  );
}
