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
  download?: boolean | string;
};

export function TrackedLink({
  href,
  eventName,
  className,
  children,
  target = "_self",
  rel,
  download,
}: TrackedLinkProps) {
  const resolvedRel =
    rel ?? (target === "_blank" ? "noopener noreferrer" : undefined);

  return (
    <Link
      href={href}
      className={className}
      target={target}
      rel={resolvedRel}
      download={download}
      onClick={() => trackEvent(eventName, { href })}
    >
      {children}
    </Link>
  );
}
