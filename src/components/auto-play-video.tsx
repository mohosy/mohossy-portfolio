"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type AutoPlayVideoProps = {
  src: string;
  poster?: string;
  className?: string;
  captionsSrc?: string;
  captionsLabel?: string;
  captionsLang?: string;
  threshold?: number;
  rootMargin?: string;
};

export function AutoPlayVideo({
  src,
  poster,
  className,
  captionsSrc,
  captionsLabel = "English captions",
  captionsLang = "en",
  threshold = 0.3,
  rootMargin = "0px 0px -12% 0px",
}: AutoPlayVideoProps) {
  const reducedMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isInView, setIsInView] = useState(false);
  const [needsSoundUnlock, setNeedsSoundUnlock] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting && entry.intersectionRatio >= threshold);
      },
      { threshold: [0, threshold], rootMargin },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    let cancelled = false;

    const playInView = async () => {
      if (!isInView) {
        video.pause();
        return;
      }

      // Attempt autoplay with sound first.
      video.defaultMuted = false;
      video.muted = false;
      try {
        await video.play();
        if (!cancelled) {
          setNeedsSoundUnlock(false);
        }
        return;
      } catch {
        // Browser blocked sound autoplay; fallback to muted autoplay.
      }

      video.defaultMuted = true;
      video.muted = true;
      try {
        await video.play();
        if (!cancelled) {
          setNeedsSoundUnlock(true);
        }
      } catch {
        if (!cancelled) {
          setNeedsSoundUnlock(true);
        }
      }
    };

    void playInView();

    return () => {
      cancelled = true;
    };
  }, [isInView]);

  useEffect(() => {
    if (!needsSoundUnlock || !isInView) {
      return;
    }

    const unlockSound = async () => {
      const video = videoRef.current;
      if (!video) {
        return;
      }

      video.defaultMuted = false;
      video.muted = false;
      try {
        await video.play();
        setNeedsSoundUnlock(false);
      } catch {
        // Keep prompt visible if autoplay with sound is still blocked.
      }
    };

    window.addEventListener("pointerdown", unlockSound, { passive: true });
    window.addEventListener("keydown", unlockSound);
    window.addEventListener("touchstart", unlockSound, { passive: true });

    return () => {
      window.removeEventListener("pointerdown", unlockSound);
      window.removeEventListener("keydown", unlockSound);
      window.removeEventListener("touchstart", unlockSound);
    };
  }, [needsSoundUnlock, isInView]);

  return (
    <motion.div
      className={["relative", className].filter(Boolean).join(" ")}
      initial={
        reducedMotion
          ? false
          : {
              opacity: 0,
              y: 24,
              scale: 0.98,
              filter: "blur(5px)",
            }
      }
      whileInView={
        reducedMotion
          ? undefined
          : {
              opacity: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
            }
      }
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
    >
      <video
        ref={videoRef}
        className="h-auto w-full"
        controls
        autoPlay
        playsInline
        preload="metadata"
        poster={poster}
      >
        <source src={src} type="video/mp4" />
        {captionsSrc ? (
          <track
            kind="captions"
            src={captionsSrc}
            srcLang={captionsLang}
            label={captionsLabel}
            default
          />
        ) : null}
      </video>
      {needsSoundUnlock ? (
        <button
          type="button"
          onClick={() => {
            const video = videoRef.current;
            if (!video) {
              return;
            }
            video.defaultMuted = false;
            video.muted = false;
            void video.play().then(() => setNeedsSoundUnlock(false)).catch(() => {});
          }}
          className="absolute bottom-3 right-3 z-10 rounded-full border border-[var(--line)] bg-[rgba(255,255,255,0.88)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-strong)] backdrop-blur transition hover:border-[var(--accent-teal)]"
        >
          Tap For Sound
        </button>
      ) : null}
    </motion.div>
  );
}
