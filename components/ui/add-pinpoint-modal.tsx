"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, MapPin } from "lucide-react";
import { ImageField } from "@/components/dashboard/image-field";
import { LocationPicker, type PickedLocation } from "@/components/dashboard/location-picker";
import { PIN_CATEGORIES, type PinCategory } from "@/lib/data/mapData";
import { umkmFormHref } from "@/lib/umkmPrefill";

export type PinFormData = {
  nama: string;
  deskripsi: string;
  kategori: PinCategory;
  lat: number;
  lng: number;
  // Link Google Maps bila lokasi ditentukan dari link; kosong bila dari klik di peta.
  mapsUrl?: string;
  kontak?: string;
  alamat?: string;
  foto?: string;
};

type Props = {
  lat?: number;
  lng?: number;
  // RT pemilik bila modal dibuka dari halaman sebuah RT; dipakai untuk form UMKM.
  rtId?: string;
  onAdd: (data: PinFormData) => void;
  onClose: () => void;
};

export function AddPinpointModal({ lat, lng, rtId, onAdd, onClose }: Props) {
  const router = useRouter();
  const [nama, setNama] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [kategori, setKategori] = useState<PinCategory>("Fasilitas Umum");
  const [kontak, setKontak] = useState("");
  const [alamat, setAlamat] = useState("");
  const [foto, setFoto] = useState<string | undefined>();
  const [location, setLocation] = useState<PickedLocation>({ lat, lng, mapsUrl: "" });
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nama.trim()) { setError("Nama lokasi wajib diisi."); return; }
    if (!deskripsi.trim()) { setError("Deskripsi wajib diisi."); return; }
    if (location.lat === undefined || location.lng === undefined) {
      setError("Tandai lokasinya dulu: klik di peta atau tempel link Google Maps.");
      return;
    }

    // UMKM tidak disimpan sebagai pinpoint biasa. Datanya dibawa ke form UMKM,
    // sehingga usahanya masuk daftar UMKM dan muncul di peta dari satu sumber.
    if (kategori === "UMKM") {
      router.push(
        umkmFormHref({
          nama: nama.trim(),
          deskripsi: deskripsi.trim(),
          kontak,
          alamat,
          mapsUrl: location.mapsUrl,
          lat: String(location.lat),
          lng: String(location.lng),
          logo: foto,
          rtId,
        })
      );
      return;
    }

    try {
      onAdd({
        nama: nama.trim(),
        deskripsi: deskripsi.trim(),
        kategori,
        lat: location.lat,
        lng: location.lng,
        mapsUrl: location.mapsUrl.trim() || undefined,
        kontak: kontak.trim() || undefined,
        alamat: alamat.trim() || undefined,
        foto,
      });
      onClose();
    } catch (err) {
      // Keep the form open so nothing typed is lost.
      setError(err instanceof Error ? err.message : "Lokasi gagal disimpan.");
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-ink-900/50 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-brand-600" />
            <h2 className="font-display text-lg font-semibold text-ink-900">Tambah Lokasi / Pinpoint</h2>
          </div>
          <button onClick={onClose} aria-label="Tutup dialog" className="rounded-full p-1.5 text-ink-500 hover:bg-cream transition-colors">
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          <div>
            <label htmlFor="pin-nama" className="mb-1.5 block text-sm font-medium text-ink-700">Nama Lokasi</label>
            <input
              id="pin-nama"
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Contoh: Warung Bu Siti"
              className="w-full rounded-xl border border-line bg-cream-100 px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-300 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <div>
            <label htmlFor="pin-kategori" className="mb-1.5 block text-sm font-medium text-ink-700">Kategori</label>
            <select
              id="pin-kategori"
              value={kategori}
              onChange={(e) => setKategori(e.target.value as PinCategory)}
              className="w-full rounded-xl border border-line bg-cream-100 px-4 py-2.5 text-sm text-ink-900 focus:border-brand-500 focus:outline-none"
            >
              {PIN_CATEGORIES.map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>

          {kategori === "UMKM" && (
            <p className="rounded-xl border border-gold-400/40 bg-gold-100 px-3 py-2 text-xs leading-relaxed text-ink-700">
              UMKM dikelola lewat daftar UMKM supaya tampil di halaman UMKM sekaligus di peta. Isi data di bawah
              seperti biasa; setelah itu kamu diarahkan ke form UMKM untuk melengkapi kategori dan produknya.
            </p>
          )}

          <div>
            <label htmlFor="pin-deskripsi" className="mb-1.5 block text-sm font-medium text-ink-700">Deskripsi</label>
            <textarea
              id="pin-deskripsi"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Ceritakan singkat tentang lokasi ini..."
              rows={3}
              className="w-full resize-none rounded-xl border border-line bg-cream-100 px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-300 focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="pin-kontak" className="mb-1.5 block text-sm font-medium text-ink-700">Nomor Kontak (opsional)</label>
            <input
              id="pin-kontak"
              type="text"
              value={kontak}
              onChange={(e) => setKontak(e.target.value)}
              placeholder="0812-3456-7890"
              className="w-full rounded-xl border border-line bg-cream-100 px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-300 focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="pin-alamat" className="mb-1.5 block text-sm font-medium text-ink-700">Alamat singkat (opsional)</label>
            <input
              id="pin-alamat"
              type="text"
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              placeholder="Contoh: Jl. Kenanga, RT 02"
              className="w-full rounded-xl border border-line bg-cream-100 px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-300 focus:border-brand-500 focus:outline-none"
            />
          </div>

          <ImageField label="Foto (opsional)" value={foto} onChange={setFoto} onError={setError} maxWidth={700} aspectClass="aspect-[16/9]" />

          <LocationPicker idPrefix="pin" value={location} onChange={(patch) => setLocation((prev) => ({ ...prev, ...patch }))} kind={kategori} />

          {error && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-line px-4 py-2.5 text-sm font-semibold text-ink-700 hover:bg-cream-100 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition-colors"
            >
              <MapPin className="h-4 w-4" />
              {kategori === "UMKM" ? "Lanjut ke Form UMKM" : "Simpan Lokasi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
