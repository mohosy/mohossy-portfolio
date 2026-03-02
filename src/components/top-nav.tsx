"use client";

import { useEffect, useState } from "react";
import { navItems } from "@/content/portfolio";
import { trackEvent } from "@/lib/analytics";

export function TopNav() {
  const [active, setActive] = useState<string>("hero");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    navItems.forEach(({ id }) => {
      const node = document.getElementById(id);
      if (!node) {
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry.isIntersecting) {
            setActive(id);
          }
        },
        { threshold: 0.35, rootMargin: "-10% 0px -55% 0px" },
      );

      observer.observe(node);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--line)] bg-[color:var(--surface-glass)] backdrop-blur-lg">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-10"
        aria-label="Primary"
      >
        <a
          href="#hero"
          className="font-[family-name:var(--font-display)] text-lg tracking-tight text-[var(--text-strong)]"
        >
          Mo.
        </a>
        <ul className="hidden items-center gap-2 lg:flex">
          {navItems.map((item) => {
            const isActive = active === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={[
                    "rounded-full px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-[var(--accent-teal)] text-white"
                      : "text-[var(--text-muted)] hover:bg-[var(--surface-alt)] hover:text-[var(--text-strong)]",
                  ].join(" ")}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
        <a
          href="#contact"
          className="rounded-full bg-[var(--accent-orange)] px-4 py-2 text-sm font-semibold text-[var(--text-strong)] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-orange)]"
          onClick={() => trackEvent("primary_contact_anchor_click")}
        >
          Internship Contact
        </a>
      </nav>
      <div className="overflow-x-auto px-4 pb-3 lg:hidden">
        <ul className="flex min-w-max gap-2">
          {navItems.map((item) => {
            const isActive = active === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={[
                    "block rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide",
                    isActive
                      ? "bg-[var(--accent-steel)] text-white"
                      : "bg-[var(--surface-alt)] text-[var(--text-muted)]",
                  ].join(" ")}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
}
