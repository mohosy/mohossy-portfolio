"use client";

import { motion, useReducedMotion } from "framer-motion";
import { type ReactNode } from "react";

type CinematicRevealVariant = "hero-image" | "lab-heading" | "footer";

type CinematicRevealProps = {
  children: ReactNode;
  className?: string;
  variant: CinematicRevealVariant;
  delay?: number;
  amount?: number;
};

export function CinematicReveal({
  children,
  className,
  variant,
  delay = 0,
  amount = 0.32,
}: CinematicRevealProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  const initial =
    variant === "hero-image"
      ? {
          opacity: 0,
          x: 38,
          y: 24,
          scale: 0.92,
          rotate: 1.2,
          filter: "blur(9px) saturate(0.84)",
          clipPath: "inset(0 24% 0 0)",
        }
      : variant === "lab-heading"
        ? {
            opacity: 0,
            y: 38,
            scale: 0.93,
            rotateX: 16,
            filter: "blur(8px)",
          }
        : {
            opacity: 0,
            y: 56,
            scale: 0.94,
            rotateX: 12,
            filter: "blur(10px)",
            clipPath: "inset(12% 0 0 0 round 2rem)",
          };

  const animate =
    variant === "hero-image"
      ? {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          rotate: 0,
          filter: "blur(0px) saturate(1)",
          clipPath: "inset(0 0% 0 0)",
        }
      : variant === "lab-heading"
        ? {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            filter: "blur(0px)",
          }
        : {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            filter: "blur(0px)",
            clipPath: "inset(0 0 0 0 round 2rem)",
          };

  return (
    <motion.div
      className={[
        "relative",
        variant === "hero-image" ? "hero-image-cinematic" : "",
        className ?? "",
      ]
        .join(" ")
        .trim()}
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, amount }}
      transition={{
        duration: variant === "hero-image" ? 0.96 : 0.9,
        ease: [0.22, 1, 0.36, 1],
        delay,
      }}
      style={{ transformPerspective: 1000 }}
    >
      {variant === "lab-heading" ? (
        <>
          <motion.span
            aria-hidden="true"
            className="lab-heading-sweep"
            initial={{ x: "-120%", opacity: 0 }}
            whileInView={{ x: "190%", opacity: [0, 0.7, 0] }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{
              duration: 1.15,
              ease: [0.22, 1, 0.36, 1],
              delay: delay + 0.16,
            }}
          />
          <motion.span
            aria-hidden="true"
            className="lab-heading-pulse"
            initial={{ scale: 0.7, opacity: 0 }}
            whileInView={{ scale: [0.72, 1.24, 1], opacity: [0, 0.9, 0.38] }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 1.05, delay: delay + 0.26, ease: "easeOut" }}
          />
        </>
      ) : null}

      {variant === "footer" ? (
        <>
          <motion.span
            aria-hidden="true"
            className="footer-cinematic-glow"
            initial={{ scale: 0.62, opacity: 0 }}
            whileInView={{ scale: [0.62, 1.24, 1], opacity: [0, 0.85, 0.44] }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 1.05, delay: delay + 0.24, ease: "easeOut" }}
          />
          <motion.span
            aria-hidden="true"
            className="footer-cinematic-sweep"
            initial={{ x: "-120%", opacity: 0 }}
            whileInView={{ x: "140%", opacity: [0, 0.7, 0] }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 1.18, delay: delay + 0.08, ease: [0.22, 1, 0.36, 1] }}
          />
        </>
      ) : null}

      {children}

      {variant === "hero-image" ? (
        <motion.span
          aria-hidden="true"
          className="hero-image-reveal-glint"
          initial={{ x: "-140%", opacity: 0 }}
          whileInView={{ x: "140%", opacity: [0, 0.64, 0] }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 1.14, ease: [0.22, 1, 0.36, 1], delay: delay + 0.2 }}
        />
      ) : null}
    </motion.div>
  );
}
