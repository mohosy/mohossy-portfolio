"use client";

import { navItems } from "@/content/portfolio";
import { trackEvent } from "@/lib/analytics";

export function TopNav() {
  const desktopNav = navItems.filter((item) =>
    ["featured", "lab", "about", "contact"].includes(item.id),
  );

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--line)] bg-[color:var(--surface-glass)] backdrop-blur-xl">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-10"
        aria-label="Primary"
      >
        <a
          href="#hero"
          className="font-[family-name:var(--font-display)] text-base font-semibold tracking-[0.18em] text-[var(--text-strong)]"
        >
          MO SHIRMOHAMMADI
        </a>

        <ul className="hidden items-center gap-7 lg:flex">
          {desktopNav.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--text-muted)] transition-colors hover:text-[var(--text-strong)]"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="rounded-full border border-[var(--line)] bg-[var(--accent-teal)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-black transition-all hover:bg-white"
          onClick={() => trackEvent("primary_contact_anchor_click")}
        >
          Contact
        </a>
      </nav>
    </header>
  );
}
