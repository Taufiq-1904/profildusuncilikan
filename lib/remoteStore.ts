// Penyimpanan reaktif kecil di atas Supabase. Bentuknya sama dengan yang
// diminta useSyncExternalStore (snapshot stabil selama datanya belum berganti),
// jadi komponen cukup memanggil hook dan otomatis ter-render ulang setelah
// data dimuat atau setelah ada perubahan (tambah/ubah/hapus).
//
// Sumber kebenarannya adalah database. Store ini hanya cache di memori; tidak
// ada yang ditulis ke localStorage.

export type StoreState<T> = {
  items: T[];
  // false sampai pemuatan pertama selesai (berhasil atau gagal).
  ready: boolean;
  error: string | null;
};

export type RemoteStore<T> = {
  getState: () => StoreState<T>;
  getServerState: () => StoreState<T>;
  subscribe: (onChange: () => void) => () => void;
  // Muat ulang dari database. Tidak pernah melempar error: kegagalan disimpan
  // di state.error supaya pemanggilan setelah mutasi tidak ikut gagal.
  refresh: () => Promise<void>;
};

const EMPTY: never[] = [];

// --- gerbang auth ----------------------------------------------------------
// Data yang dilihat pengelola (draft, UMKM nonaktif) bergantung pada
// sesi login. Store menunggu sesi selesai dipulihkan sebelum memuat, supaya
// halaman tidak sempat menampilkan "tidak ditemukan" untuk draft milik sendiri.

let openGate: () => void = () => {};
const authGate = new Promise<void>((resolve) => {
  openGate = resolve;
});

export function markAuthReady(): void {
  openGate();
}

// --- registry --------------------------------------------------------------

const requestedStores = new Set<{ refresh: () => Promise<void> }>();

// Dipanggil saat login/logout: isi tiap store bisa berbeda untuk tiap sesi.
export function refreshAllStores(): void {
  requestedStores.forEach((s) => void s.refresh());
}

export function createRemoteStore<T>({ load }: { load: () => Promise<T[]> }): RemoteStore<T> {
  const initial: StoreState<T> = { items: EMPTY as T[], ready: false, error: null };
  let state = initial;
  let requested = false;
  let version = 0;
  const listeners = new Set<() => void>();

  function setState(next: StoreState<T>) {
    state = next;
    listeners.forEach((l) => l());
  }

  async function refresh(): Promise<void> {
    if (typeof window === "undefined") return;
    requested = true;
    requestedStores.add(self);
    const mine = ++version;
    try {
      await authGate;
      const items = await load();
      // Hanya hasil permintaan terbaru yang dipakai.
      if (mine === version) setState({ items, ready: true, error: null });
    } catch (e) {
      console.error(e);
      if (mine === version) {
        setState({
          items: state.items,
          ready: true,
          error: e instanceof Error ? e.message : "Data gagal dimuat.",
        });
      }
    }
  }

  function subscribe(onChange: () => void): () => void {
    listeners.add(onChange);
    if (!requested) void refresh();
    return () => {
      listeners.delete(onChange);
    };
  }

  const self = {
    getState: () => state,
    getServerState: () => initial,
    subscribe,
    refresh,
  };
  return self;
}
