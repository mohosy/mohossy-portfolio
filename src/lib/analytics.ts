"use client";

import { track } from "@vercel/analytics";

type AnalyticsPayload = Record<string, string | number | boolean>;

export function trackEvent(name: string, payload?: AnalyticsPayload): void {
  track(name, payload);
}
