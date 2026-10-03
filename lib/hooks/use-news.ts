"use client";

import { useSyncExternalStore } from "react";
import { getNewsSnapshot, getServerNewsSnapshot, subscribeNews } from "@/lib/newsService";

export function useNews() {
  return useSyncExternalStore(subscribeNews, getNewsSnapshot, getServerNewsSnapshot);
}

const noopSubscribe = () => () => {};

// False during server render and hydration, true afterwards. Anything that
// depends on localStorage (a slug that may only exist in the browser, form
// defaults) waits for this instead of rendering from the seed data first.
export function useIsClient(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );
}
