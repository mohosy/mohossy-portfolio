"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";

type TrackedLinkProps = {
  href: string;
  eventName: string;
  className?: string;
  children: ReactNode;
  target?: "_blank" | "_self";
  rel?: string;
};

export function TrackedLink({
  href,
  eventName,
  className,
  children,
  target = "_self",
  rel,
}: TrackedLinkProps) {
  const resolvedRel =
    rel ?? (target === "_blank" ? "noopener noreferrer" : undefined);

  return (
    <Link
      href={href}
      className={className}
      target={target}
      rel={resolvedRel}
      onClick={() => trackEvent(eventName, { href })}
    >
      {children}
    </Link>
  );
}
