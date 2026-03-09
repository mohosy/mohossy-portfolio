"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGroup,
  motion,
  useMotionTemplate,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { siteProfile } from "@/content/portfolio";
import { trackEvent } from "@/lib/analytics";

const TRACKED_SECTIONS = [
  "hero",
  "about",
  "featured",
  "catalog",
  "irl",
  "lab",
  "experience",
  "contact",
] as const;

const NAV_LINKS = [
  { id: "hero", label: "Home", href: "#hero", activeIds: ["hero"] },
  { id: "about", label: "About", href: "#about", activeIds: ["about"] },
  {
    id: "projects",
    label: "Projects",
    href: "#featured",
    activeIds: ["featured", "catalog", "irl", "lab"],
  },
  {
    id: "experience",
    label: "Experience",
    href: "#experience",
    activeIds: ["experience"],
  },
  { id: "contact", label: "Contact", href: "#contact", activeIds: ["contact"] },
] as const;

export function TopNav() {
  const pathname = usePathname();
  const isPortfolioRoute = pathname === "/";
  const isOpenSourceRoute = pathname.startsWith("/open-source");
  const usesLightChrome = isOpenSourceRoute;
  const reducedMotion = useReducedMotion();
  const [activeSection, setActiveSection] = useState("hero");
  const [isScrolling, setIsScrolling] = useState(false);
  const [isSettling, setIsSettling] = useState(false);
  const [compactMode, setCompactMode] = useState(false);
  const stopTimerRef = useRef<number | null>(null);
  const settleTimerRef = useRef<number | null>(null);
  const isNavActive = (ids: readonly string[]) => ids.includes(activeSection);
  const navState = isScrolling ? "scrolling" : isSettling ? "settling" : "resting";

  useEffect(() => {
    const elements = TRACKED_SECTIONS
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (elements.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) {
          return;
        }

        visible.sort(
          (a, b) =>
            b.intersectionRatio - a.intersectionRatio ||
            a.boundingClientRect.top - b.boundingClientRect.top,
        );

        setActiveSection(visible[0].target.id);
      },
      {
        threshold: [0.2, 0.45, 0.7],
        rootMargin: "-32% 0px -52% 0px",
      },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const { scrollY } = useScroll();
  const easedScrollY = useSpring(scrollY, { stiffness: 96, damping: 28, mass: 0.34 });
  const depth = useTransform(easedScrollY, [0, 420], [0, 1]);
  const navScale = useTransform(depth, [0, 1], [1, 0.985]);
  const navY = useTransform(depth, [0, 1], [0, -2]);
  const navTilt = useTransform(depth, [0, 1], [0, -0.25]);
  const navShadow = useTransform(
    depth,
    [0, 1],
    usesLightChrome
      ? ["0 14px 34px rgba(106,78,44,0.1)", "0 20px 46px rgba(106,78,44,0.16)"]
      : ["0 14px 34px rgba(0,0,0,0.42)", "0 20px 46px rgba(0,0,0,0.56)"],
  );
  const islandWidth = useTransform(depth, [0, 1], ["53rem", "40.5rem"]);
  const islandPadX = useTransform(depth, [0, 1], [12, 7]);
  const islandPadY = useTransform(depth, [0, 1], [7, 4.5]);
  const brandScale = useTransform(depth, [0, 1], [1, 0.91]);
  const linksScale = useTransform(depth, [0, 1], [1, 0.93]);
  const actionsScale = useTransform(depth, [0, 1], [1, 0.9]);
  const linksGap = useTransform(depth, [0, 1], [12, 7.5]);
  const navBgOpacity = useTransform(depth, [0, 1], usesLightChrome ? [0.84, 0.94] : [0.74, 0.88]);
  const navBorderOpacity = useTransform(
    depth,
    [0, 1],
    usesLightChrome ? [0.1, 0.16] : [0.16, 0.24],
  );
  const navBg = usesLightChrome
    ? useMotionTemplate`rgba(250, 245, 237, ${navBgOpacity})`
    : useMotionTemplate`rgba(8, 8, 8, ${navBgOpacity})`;
  const navBorder = usesLightChrome
    ? useMotionTemplate`rgba(88, 68, 45, ${navBorderOpacity})`
    : useMotionTemplate`rgba(255, 255, 255, ${navBorderOpacity})`;
  const bubbleAOffsetY = useTransform(depth, [0, 1], [0, -9]);
  const bubbleBOffsetY = useTransform(depth, [0, 1], [0, -7]);
  const bubbleAOffsetX = useTransform(depth, [0, 1], [0, 7]);
  const bubbleBOffsetX = useTransform(depth, [0, 1], [0, -6]);
  const bubbleAScale = useTransform(depth, [0, 1], [1, 1.1]);
  const bubbleBScale = useTransform(depth, [0, 1], [1, 1.08]);
  const bubbleAOpacity = useTransform(depth, [0, 1], [0.16, 0.26]);
  const bubbleBOpacity = useTransform(depth, [0, 1], [0.14, 0.24]);
  const bubbleCOpacity = useTransform(depth, [0, 1], [0.08, 0.16]);
  const underlineWidth = useTransform(depth, [0, 1], ["48%", "70%"]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (reducedMotion) {
      return;
    }

    setCompactMode(latest > 64);
    setIsScrolling(true);
    setIsSettling(false);
    if (stopTimerRef.current !== null) {
      window.clearTimeout(stopTimerRef.current);
    }
    if (settleTimerRef.current !== null) {
      window.clearTimeout(settleTimerRef.current);
    }
    stopTimerRef.current = window.setTimeout(() => {
      setIsScrolling(false);
      setIsSettling(true);
      settleTimerRef.current = window.setTimeout(() => setIsSettling(false), 380);
    }, 150);
  });

  useEffect(() => {
    return () => {
      if (stopTimerRef.current !== null) {
        window.clearTimeout(stopTimerRef.current);
      }
      if (settleTimerRef.current !== null) {
        window.clearTimeout(settleTimerRef.current);
      }
    };
  }, []);

  return (
    <motion.header
      className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-3 sm:px-5"
      style={reducedMotion ? undefined : { y: navY, rotateX: navTilt }}
      initial={
        reducedMotion
          ? false
          : {
              opacity: 0,
              scale: 0.92,
              filter: "blur(10px)",
            }
      }
      animate={
        reducedMotion
          ? undefined
          : {
              opacity: 1,
              scale: 1,
              filter: "blur(0px)",
            }
      }
      transition={{ duration: 0.78, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
    >
      <motion.nav
        className={[
          "pointer-events-auto nav-shell relative flex w-full items-center overflow-hidden rounded-full border border-[var(--line)] bg-[color:var(--surface-glass)] backdrop-blur-xl",
          navState === "scrolling"
            ? "nav-shell-scrolling"
            : navState === "settling"
              ? "nav-shell-settling"
              : "nav-shell-resting",
        ].join(" ")}
        data-nav-state={navState}
        style={
          reducedMotion
            ? undefined
            : {
                scale: navScale,
                boxShadow: navShadow,
                backgroundColor: navBg,
                borderColor: navBorder,
                maxWidth: islandWidth,
                paddingLeft: islandPadX,
                paddingRight: islandPadX,
                paddingTop: islandPadY,
                paddingBottom: islandPadY,
              }
        }
        animate={
          reducedMotion
            ? undefined
            : isScrolling
              ? { scaleX: 0.973, scaleY: 0.968, borderRadius: 24 }
              : isSettling
                ? {
                    scaleX: [0.976, 1.01, 1],
                    scaleY: [0.974, 1.004, 1],
                    borderRadius: [36, 999],
                  }
                : { scaleX: 1, scaleY: 1, borderRadius: 999 }
        }
        transition={{
          type: "spring",
          stiffness: isScrolling ? 420 : 320,
          damping: isScrolling ? 34 : 30,
          mass: 0.62,
        }}
        data-nav-tone={usesLightChrome ? "light" : "dark"}
        aria-label="Primary"
      >
        <motion.span
          aria-hidden="true"
          className="nav-activity-ring absolute inset-0 rounded-full"
          animate={
            reducedMotion
              ? undefined
              : isScrolling
                ? {
                    opacity: 0.98,
                    scale: 1.012,
                  }
                : isSettling
                  ? {
                      opacity: [0.86, 0.6, 0.44],
                      scale: [1.008, 1],
                    }
                  : {
                      opacity: 0.44,
                      scale: 1,
                    }
          }
          transition={{ duration: isSettling ? 0.6 : 0.28, ease: "easeOut" }}
        />
        <motion.span
          aria-hidden="true"
          className={[
            "absolute -left-6 -top-8 h-20 w-20 rounded-full blur-2xl",
            usesLightChrome ? "bg-[#e0cab0]/78" : "bg-white/14",
          ].join(" ")}
          style={
            reducedMotion
              ? undefined
              : {
                  x: bubbleAOffsetX,
                  y: bubbleAOffsetY,
                  opacity: bubbleAOpacity,
                  scale: bubbleAScale,
                }
          }
          animate={
            reducedMotion
              ? undefined
              : isScrolling
                ? { x: [0, 12, 0], y: [0, -6, 0], scale: [1, 1.1, 1] }
                : isSettling
                  ? { x: [0, 5, 0], y: [0, -2, 0], scale: [1.04, 1] }
                : { x: [0, 7, 0], y: [0, -3, 0], scale: [1, 1.06, 1] }
          }
          transition={
            reducedMotion
              ? undefined
              : {
                  duration: isScrolling ? 3.6 : isSettling ? 1.8 : 7.8,
                  repeat: isSettling ? 0 : Infinity,
                  ease: "easeInOut",
                }
          }
        />
        <motion.span
          aria-hidden="true"
          className={[
            "absolute right-[22%] top-[-34px] h-16 w-16 rounded-full blur-2xl",
            usesLightChrome ? "bg-[#d7dfd1]/86" : "bg-[#9fe3ff1f]",
          ].join(" ")}
          style={
            reducedMotion
              ? undefined
              : {
                  x: bubbleBOffsetX,
                  y: bubbleBOffsetY,
                  opacity: bubbleBOpacity,
                  scale: bubbleBScale,
                }
          }
          animate={
            reducedMotion
              ? undefined
              : isScrolling
                ? { x: [0, -10, 0], y: [0, -5, 0], scale: [1, 1.08, 1] }
                : isSettling
                  ? { x: [0, -4, 0], y: [0, -2, 0], scale: [1.03, 1] }
                : { x: [0, -6, 0], y: [0, -2, 0], scale: [1, 1.04, 1] }
          }
          transition={
            reducedMotion
              ? undefined
              : {
                  duration: isScrolling ? 3.2 : isSettling ? 1.7 : 8.8,
                  repeat: isSettling ? 0 : Infinity,
                  ease: "easeInOut",
                }
          }
        />
        <motion.span
          aria-hidden="true"
          className={[
            "absolute bottom-[-22px] left-[38%] h-14 w-14 rounded-full blur-2xl",
            usesLightChrome ? "bg-[#f7f0e5]/90" : "bg-white/10",
          ].join(" ")}
          style={reducedMotion ? undefined : { opacity: bubbleCOpacity }}
          animate={
            reducedMotion
              ? undefined
              : isScrolling
                ? { x: [0, 13, 0], y: [0, -7, 0], scale: [1, 1.1, 1] }
                : isSettling
                  ? { x: [0, 5, 0], y: [0, -2, 0], scale: [1.04, 1] }
                : { x: [0, 9, 0], y: [0, -3, 0], scale: [1, 1.06, 1] }
          }
          transition={
            reducedMotion
              ? undefined
              : {
                  duration: isScrolling ? 3.9 : isSettling ? 1.85 : 9.7,
                  repeat: isSettling ? 0 : Infinity,
                  ease: "easeInOut",
                }
          }
        />
        <motion.span
          aria-hidden="true"
          className="absolute left-1/2 top-0 h-px -translate-x-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent"
          style={reducedMotion ? undefined : { width: underlineWidth }}
        />

        {isPortfolioRoute ? (
          <motion.a
            href="#hero"
            className="relative z-10 inline-flex shrink-0 items-center rounded-full px-1.5 py-0.5 font-[family-name:var(--font-display)] text-[9.5px] font-semibold tracking-[0.14em] text-[var(--text-strong)] sm:text-[10.5px]"
            style={reducedMotion ? undefined : { scale: brandScale }}
          >
            MO SHIRMOHAMMADI
          </motion.a>
        ) : (
          <motion.div
            className="relative z-10 shrink-0"
            style={reducedMotion ? undefined : { scale: brandScale }}
          >
            <Link
              href="/"
              className="inline-flex items-center rounded-full px-1.5 py-0.5 font-[family-name:var(--font-display)] text-[9.5px] font-semibold tracking-[0.14em] text-[var(--text-strong)] sm:text-[10.5px]"
              onClick={() => trackEvent("secondary_nav_home_click")}
            >
              MO SHIRMOHAMMADI
            </Link>
          </motion.div>
        )}

        <LayoutGroup id="top-nav-tabs">
          {isPortfolioRoute ? (
            <motion.ul
              className="relative z-10 hidden flex-1 items-center justify-center md:flex"
              style={reducedMotion ? undefined : { scale: linksScale, gap: linksGap }}
            >
              {NAV_LINKS.map((item) => {
                const isActive = isNavActive(item.activeIds);

                return (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={[
                        "top-nav-link relative inline-flex h-7 items-center justify-center overflow-hidden rounded-full border border-transparent px-2.5 text-[10px] font-medium uppercase tracking-[0.14em] transition-all",
                        isActive ? "is-active" : "",
                      ].join(" ")}
                    >
                      {isActive ? (
                        <motion.span
                          layoutId="top-nav-active-pill"
                          className="top-nav-active-pill absolute inset-0 rounded-full"
                          transition={
                            reducedMotion
                              ? { duration: 0 }
                              : { type: "spring", stiffness: 520, damping: 42, mass: 0.55 }
                          }
                        />
                      ) : null}
                      <span className="relative z-10">{item.label}</span>
                    </a>
                  </li>
                );
              })}
            </motion.ul>
          ) : (
            <motion.ul
              className="relative z-10 hidden flex-1 items-center justify-center md:flex"
              style={reducedMotion ? undefined : { scale: linksScale, gap: linksGap }}
            >
              {[
                { id: "portfolio", label: "Portfolio", href: "/", active: pathname === "/" },
                {
                  id: "open-source",
                  label: "Open Source",
                  href: "/open-source",
                  active: isOpenSourceRoute,
                },
                {
                  id: "github",
                  label: "GitHub",
                  href: siteProfile.githubUrl,
                  active: false,
                  external: true,
                },
              ].map((item) => (
                <li key={item.id}>
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className={[
                        "top-nav-link relative inline-flex h-7 items-center justify-center overflow-hidden rounded-full border border-transparent px-2.5 text-[10px] font-medium uppercase tracking-[0.14em] transition-all",
                        item.active ? "is-active" : "",
                      ].join(" ")}
                      onClick={() => trackEvent(`secondary_nav_${item.id}_click`)}
                    >
                      {item.active ? (
                        <motion.span
                          layoutId="top-nav-active-pill"
                          className="top-nav-active-pill absolute inset-0 rounded-full"
                          transition={
                            reducedMotion
                              ? { duration: 0 }
                              : { type: "spring", stiffness: 520, damping: 42, mass: 0.55 }
                          }
                        />
                      ) : null}
                      <span className="relative z-10">{item.label}</span>
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      aria-current={item.active ? "page" : undefined}
                      className={[
                        "top-nav-link relative inline-flex h-7 items-center justify-center overflow-hidden rounded-full border border-transparent px-2.5 text-[10px] font-medium uppercase tracking-[0.14em] transition-all",
                        item.active ? "is-active" : "",
                      ].join(" ")}
                      onClick={() => trackEvent(`secondary_nav_${item.id}_click`)}
                    >
                      {item.active ? (
                        <motion.span
                          layoutId="top-nav-active-pill"
                          className="top-nav-active-pill absolute inset-0 rounded-full"
                          transition={
                            reducedMotion
                              ? { duration: 0 }
                              : { type: "spring", stiffness: 520, damping: 42, mass: 0.55 }
                          }
                        />
                      ) : null}
                      <span className="relative z-10">{item.label}</span>
                    </Link>
                  )}
                </li>
              ))}
            </motion.ul>
          )}
        </LayoutGroup>

        <motion.div
          className="relative z-10 ml-auto flex items-center gap-1.5"
          style={reducedMotion ? undefined : { scale: actionsScale }}
        >
          {!compactMode ? (
            <>
              <div className="top-resume-wrap">
                <a
                  href={siteProfile.resumeUrl}
                  download="Mo-Shirmohammadi-Resume.pdf"
                  aria-label="Download resume"
                  title="Download resume"
                  className="top-resume-icon"
                  onClick={() => trackEvent("primary_resume_icon_click")}
                >
                  <DownloadIcon />
                  <span>Resume</span>
                </a>
              </div>
              <a
                href={`mailto:${siteProfile.email}`}
                className="btn-gold-glass top-contact-btn"
                onClick={() => trackEvent("primary_contact_email_click")}
              >
                Contact
              </a>
            </>
          ) : null}
        </motion.div>
      </motion.nav>
    </motion.header>
  );
}

function DownloadIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 fill-none stroke-current"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
    >
      <path d="M12 4v11" />
      <path d="m7.5 11.5 4.5 4.5 4.5-4.5" />
      <path d="M4 20h16" />
    </svg>
  );
}
