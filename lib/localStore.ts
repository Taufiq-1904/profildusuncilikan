// Small reactive collection store on top of localStorage. It has the shape
// useSyncExternalStore wants (stable snapshot reference while the stored
// string is unchanged), and it is the only place that touches localStorage
// for the directory modules. Replacing it with database queries later should
// not change the services or the UI that sit on top of it.

export type LocalStore<T> = {
  getSnapshot: () => T[];
  getServerSnapshot: () => T[];
  subscribe: (onChange: () => void) => () => void;
  write: (items: T[]) => void;
};

type Options<T> = {
  key: string;
  seed: T[];
  // Runs on whatever was stored, so records saved by an older version of the
  // app are upgraded on read instead of being dropped.
  normalize?: (items: unknown[]) => T[];
};

export function createLocalStore<T>({ key, seed, normalize }: Options<T>): LocalStore<T> {
  const changeEvent = `cilikan:store:${key}`;
  let cachedRaw: string | null | undefined;
  let cached: T[] = seed;

  function getSnapshot(): T[] {
    if (typeof window === "undefined") return seed;
    const raw = localStorage.getItem(key);
    if (raw === cachedRaw) return cached;
    cachedRaw = raw;
    if (!raw) {
      cached = seed;
      return cached;
    }
    try {
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) cached = seed;
      else cached = normalize ? normalize(parsed) : (parsed as T[]);
    } catch {
      cached = seed;
    }
    return cached;
  }

  function write(items: T[]): void {
    try {
      localStorage.setItem(key, JSON.stringify(items));
    } catch {
      throw new Error(
        "Penyimpanan browser penuh. Hapus data lama atau gunakan gambar yang lebih kecil."
      );
    }
    window.dispatchEvent(new Event(changeEvent));
  }

  function subscribe(onChange: () => void): () => void {
    const onStorage = (e: StorageEvent) => {
      if (e.key === null || e.key === key) onChange();
    };
    window.addEventListener(changeEvent, onChange);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(changeEvent, onChange);
      window.removeEventListener("storage", onStorage);
    };
  }

  return { getSnapshot, getServerSnapshot: () => seed, subscribe, write };
}
