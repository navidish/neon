import type { TrackingEvent } from "@/types";
import { getSession } from "@/lib/storage";

const EVENTS_KEY = "account_opening_tracking";

export function track(name: string, metadata?: Record<string, string>) {
  if (typeof window === "undefined") return;

  const event: TrackingEvent = {
    name,
    timestamp: new Date().toISOString(),
    sessionId: getSession()?.id,
    metadata
  };

  const current = getEvents();
  current.push(event);
  localStorage.setItem(EVENTS_KEY, JSON.stringify(current));
  console.info("[tracking]", event);
}

export function getEvents(): TrackingEvent[] {
  if (typeof window === "undefined") return [];

  const value = localStorage.getItem(EVENTS_KEY);
  if (!value) return [];

  try {
    return JSON.parse(value) as TrackingEvent[];
  } catch {
    localStorage.removeItem(EVENTS_KEY);
    return [];
  }
}
