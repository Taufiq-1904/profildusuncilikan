"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Plus, Trash2 } from "lucide-react";
import { errorClass } from "@/components/dashboard/form-styles";
import { PlaceGlyph } from "@/components/map/marker-icons";
import { PlaceMapView } from "@/components/map/place-map-view";
import { AddPinpointModal, type PinFormData } from "@/components/ui/add-pinpoint-modal";
import { useAuth } from "@/components/providers/auth-provider";
import { canManageWilayah, isDusun } from "@/lib/auth";
import { getWilayahLabel } from "@/lib/data/wilayahData";
import { usePins } from "@/lib/hooks/use-directory";
import { pinToPlace } from "@/lib/mapPlaces";
import { addPin, deletePin } from "@/lib/mapService";
import { cn } from "@/lib/utils";

export default function AdminPetaPage() {
  const { user } = useAuth();
  const router = useRouter();
  const pins = usePins();
  const places = useMemo(() => pins.map(pinToPlace), [pins]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Client-side guard only. The services check permissions themselves, but a
    // real backend is still needed to make that binding.
    if (user && !isDusun(user)) router.replace("/dashboard");
  }, [user, router]);

  // Errors are thrown on purpose: the modal shows them and stays open.
  function handleAddPin(data: PinFormData) {
    addPin({ ...data, createdBy: user!.wilayahId });
    setAdding(false);
  }

  function handleDeletePin(id: string) {
    if (!confirm("Hapus lokasi ini?")) return;
    setError("");
    try {
      deletePin(id);
      setSelectedId(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lokasi gagal dihapus.");
    }
  }

  const canDelete = (id: string) => {
    const pin = pins.find((p) => p.id === id);
    return pin ? canManageWilayah(user, pin.createdBy) : false;
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-ink-500">Dashboard</p>
          <h1 className="font-display text-2xl font-semibold text-ink-900">Kelola Peta & Lokasi</h1>
          <p className="mt-1 text-sm text-ink-500">
            Lokasi umum dikelola di sini. UMKM dan organisasi muncul di peta otomatis bila lokasinya sudah ditandai.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold shadow-sm transition-colors bg-brand-600 text-white hover:bg-brand-700"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Tambah Lokasi
        </button>
      </div>

      {error && (
        <p role="alert" className={cn(errorClass, "mb-4")}>
          {error}
        </p>
      )}

      <PlaceMapView
        places={places}
        selectedId={selectedId}
        onSelect={setSelectedId}
        height="440px"
        eager
        renderActions={(place) =>
          canDelete(place.id) ? (
            <button
              type="button"
              onClick={() => handleDeletePin(place.id)}
              className="ml-auto inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              Hapus
            </button>
          ) : null
        }
        className="mb-6 rounded-2xl border border-line shadow-sm"
      />

      <div className="overflow-hidden rounded-2xl border border-line bg-paper shadow-sm">
        <div className="flex items-center justify-between border-b border-line bg-cream-100 px-6 py-3">
          <p className="text-sm font-semibold text-ink-700">{pins.length} lokasi terdaftar</p>
        </div>
        <ul className="divide-y divide-line">
          {pins.map((pin) => (
            <li key={pin.id} className="flex items-center gap-4 px-6 py-3.5">
              <PlaceGlyph kind={pin.kategori} className="h-8 w-8" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink-900">{pin.nama}</p>
                <p className="text-xs text-ink-500">
                  {pin.kategori} · Oleh: {getWilayahLabel(pin.createdBy)}
                </p>
              </div>
              {canDelete(pin.id) && (
                <button
                  type="button"
                  onClick={() => handleDeletePin(pin.id)}
                  aria-label={`Hapus ${pin.nama}`}
                  className="rounded-lg p-2 text-ink-500 transition-colors hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      {adding && <AddPinpointModal onAdd={handleAddPin} onClose={() => setAdding(false)} />}
    </div>
  );
}
