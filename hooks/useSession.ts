"use client";

import { useEffect, useState } from "react";
import { getSession, saveSession } from "@/lib/storage";
import type { Session } from "@/types";

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSession(getSession());
    setReady(true);
  }, []);

  function updateSession(patch: Partial<Session>) {
    setSession((current) => {
      if (!current) return current;
      const next = { ...current, ...patch };
      saveSession(next);
      return next;
    });
  }

  return { session, ready, updateSession };
}
