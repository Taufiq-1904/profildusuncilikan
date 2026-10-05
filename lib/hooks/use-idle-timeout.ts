"use client";

import { useEffect, useRef } from "react";

export const IDLE_TIMEOUT_MS = 10 * 60 * 1000;

// Dibaca halaman login untuk menjelaskan kenapa pengguna keluar sendiri.
export const IDLE_NOTICE_KEY = "profildesa:idle-logout";

// Waktu aktivitas terakhir disimpan di localStorage agar semua tab berbagi
// satu jam: bekerja di tab A menjaga tab B tetap masuk. Bila storage diblokir,
// hook tetap jalan dengan catatan di memori tab itu saja.
const LAST_ACTIVE_KEY = "profildesa:last-active";
const CHECK_EVERY_MS = 5_000;
const WRITE_EVERY_MS = 2_000;
const ACTIVITY_EVENTS = ["pointerdown", "keydown", "wheel", "scroll", "touchstart", "mousemove"] as const;

function readLastActive(): number | null {
  try {
    const value = Number(localStorage.getItem(LAST_ACTIVE_KEY));
    return Number.isFinite(value) && value > 0 ? value : null;
  } catch {
    return null;
  }
}

export function markActive(now = Date.now()): void {
  try {
    localStorage.setItem(LAST_ACTIVE_KEY, String(now));
  } catch {
    // Storage tidak tersedia; catatan di memori sudah cukup.
  }
}

export function clearActivity(): void {
  try {
    localStorage.removeItem(LAST_ACTIVE_KEY);
  } catch {
    // Sama seperti di atas.
  }
}

// Memanggil onIdle sekali bila tidak ada aktivitas (klik, ketik, gulir, sentuh)
// selama timeoutMs. Pengecekan juga jalan saat tab kembali dibuka, karena
// timer browser bisa tertahan ketika laptop tidur atau tab di latar belakang.
export function useIdleTimeout(enabled: boolean, onIdle: () => void, timeoutMs = IDLE_TIMEOUT_MS): void {
  const onIdleRef = useRef(onIdle);
  useEffect(() => {
    onIdleRef.current = onIdle;
  });

  useEffect(() => {
    if (!enabled) return;

    // Sesi yang dipulihkan dari cookie setelah browser lama ditutup langsung
    // dianggap kedaluwarsa; tanpa catatan sama sekali, hitungan mulai sekarang.
    const stored = readLastActive();
    let last = stored ?? Date.now();
    if (stored === null) markActive(last);

    let lastWrite = 0;
    let fired = false;

    const idleFor = () => Date.now() - Math.max(last, readLastActive() ?? 0);

    function expireIfIdle(): boolean {
      if (fired) return true;
      if (idleFor() < timeoutMs) return false;
      fired = true;
      onIdleRef.current();
      return true;
    }

    function handleActivity() {
      // Gerakan pertama setelah lama diam tidak boleh menyelamatkan sesi.
      if (expireIfIdle()) return;
      const now = Date.now();
      last = now;
      if (now - lastWrite >= WRITE_EVERY_MS) {
        lastWrite = now;
        markActive(now);
      }
    }

    function handleVisible() {
      if (document.visibilityState === "visible") expireIfIdle();
    }

    expireIfIdle();
    const timer = window.setInterval(expireIfIdle, CHECK_EVERY_MS);
    for (const name of ACTIVITY_EVENTS) window.addEventListener(name, handleActivity, { passive: true });
    document.addEventListener("visibilitychange", handleVisible);
    window.addEventListener("focus", handleVisible);

    return () => {
      window.clearInterval(timer);
      for (const name of ACTIVITY_EVENTS) window.removeEventListener(name, handleActivity);
      document.removeEventListener("visibilitychange", handleVisible);
      window.removeEventListener("focus", handleVisible);
    };
  }, [enabled, timeoutMs]);
}
