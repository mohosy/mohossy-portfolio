"use client";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { siteProfile } from "@/content/portfolio";
import { trackEvent } from "@/lib/analytics";

export function TopNav() {
  const { scrollY } = useScroll();
  const easedScrollY = useSpring(scrollY, { stiffness: 96, damping: 28, mass: 0.34 });
  const depth = useTransform(easedScrollY, [0, 420], [0, 1]);

  const navBgOpacity = useTransform(depth, [0, 1], [0, 0.94]);
  const navBorderOpacity = useTransform(depth, [0, 1], [0, 0.16]);
  const navBlur = useTransform(depth, [0, 1], [0, 20]);
  const navTextColor = useTransform(depth, [0, 1], ["rgba(255,255,255,1)", "rgba(28,24,20,1)"]);

  const navBg = useMotionTemplate`rgba(250, 247, 240, ${navBgOpacity})`;
  const navBorder = useMotionTemplate`rgba(0, 0, 0, ${navBorderOpacity})`;

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 px-4 sm:px-6"
      style={{
        backgroundColor: navBg,
        borderBottom: useMotionTemplate`1px solid rgba(0,0,0,${navBorderOpacity})`,
        backdropFilter: useMotionTemplate`blur(${navBlur}px)`,
        WebkitBackdropFilter: useMotionTemplate`blur(${navBlur}px)`,
        color: navTextColor,
      }}
    >
      <nav
        className="mx-auto flex h-14 max-w-5xl items-center justify-between"
        aria-label="Primary"
      >
        <a
          href="#hero"
          className="text-[0.95rem] font-semibold tracking-tight"
        >
          Mo Shirmohammadi
        </a>

        <div className="flex items-center gap-5">
          {/* Resume button hidden per request — uncomment to restore
          <a
            href={siteProfile.resumeUrl}
            download="Mo-Shirmohammadi-Resume.pdf"
            className="text-sm font-medium opacity-80 hover:opacity-100 transition-opacity"
            onClick={() => trackEvent("nav_resume_click")}
          >
            Resume
          </a>
          */}
          <a
            href={`mailto:${siteProfile.email}`}
            className="text-sm font-medium opacity-80 hover:opacity-100 transition-opacity"
            onClick={() => trackEvent("nav_contact_click")}
          >
            Contact
          </a>
        </div>
      </nav>
    </motion.header>
  );
}
