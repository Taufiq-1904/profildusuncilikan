"use client";

import { useSyncExternalStore } from "react";
import { newsStore } from "@/lib/newsService";

function useNewsState() {
  return useSyncExternalStore(newsStore.subscribe, newsStore.getState, newsStore.getServerState);
}

// Daftar berita dari Supabase. Kosong sampai pemuatan pertama selesai; pakai
// useNewsReady() bila perlu membedakan "belum dimuat" dari "memang tidak ada".
export function useNews() {
  return useNewsState().items;
}

export function useNewsReady(): boolean {
  return useNewsState().ready;
}

const noopSubscribe = () => () => {};

// False during server render and hydration, true afterwards.
export function useIsClient(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );
}
