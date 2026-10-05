"use client";

import { useState } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import {
  Users, Home, Store, Sparkles, Newspaper, Map,
  Trash2, Plus, User, Phone, ArrowRight, Pencil,
} from "lucide-react";
import { AGE_GROUPS, sumUmur, totalWarga } from "@/lib/data/demografiData";
import { getRTById, type RT } from "@/lib/data/wilayahData";
import { selectUmkmByRT, deleteUmkm } from "@/lib/umkmService";
import { selectPotensiByRT, addPotensiRT, updatePotensiRT, deletePotensiRT, type RTPotensi } from "@/lib/potensiService";
import {
  useDemografi,
  useDemografiReady,
  useWilayahHeads,
  usePotensi,
  usePotensiReady,
  useUmkm,
  useUmkmReady,
} from "@/lib/hooks/use-directory";
import { DonutChart } from "@/components/ui/donut-chart";
import { BarChart } from "@/components/ui/bar-chart";
import { DemografiForm } from "@/components/dashboard/demografi-form";
import { AddPotensiModal } from "@/components/ui/add-potensi-modal";
import { MediaImage } from "@/components/ui/media-image";
import { useAuth } from "@/components/providers/auth-provider";
import { canManageWilayah } from "@/lib/auth";

type Tab = "ringkasan" | "umkm" | "potensi";

const TAB_LIST: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "ringkasan", label: "Ringkasan", icon: Home },
  { id: "umkm",      label: "UMKM", icon: Store },
  { id: "potensi",   label: "Potensi RT", icon: Sparkles },
];

const KATEGORI_COLORS: Record<string, string> = {
  Pertanian:   "#16a34a",
  Peternakan:  "#0891b2",
  Kerajinan:   "#d97706",
  Pariwisata:  "#7c3aed",
  Perdagangan: "#dc2626",
  Lainnya:     "#64748b",
};

export default function RTDetailPage() {
  const params = useParams();
  const rtId = params.id as string;
  const { user } = useAuth();
  const rt: RT | undefined = getRTById(rtId);
  const umkm = selectUmkmByRT(useUmkm(), rtId);
  const potensi = selectPotensiByRT(usePotensi(), rtId);
  const [activeTab, setActiveTab] = useState<Tab>("ringkasan");
  // Daftar UMKM dan potensi dimuat dari Supabase di browser.
  const umkmReady = useUmkmReady();
  const potensiReady = usePotensiReady();
  const demografi = useDemografi().find((d) => d.rtId === rtId);
  const demografiReady = useDemografiReady();
  const { headOf, roleOf } = useWilayahHeads();
  const mounted = umkmReady && potensiReady && demografiReady;
  const [actionError, setActionError] = useState("");

  const [showAddPotensi, setShowAddPotensi] = useState(false);
  const [editingPotensi, setEditingPotensi] = useState<RTPotensi | null>(null);

  if (!mounted) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
      </div>
    );
  }

  if (!rt) return notFound();

  const canManage = canManageWilayah(user, rtId);

  async function handleDeleteUMKM(id: string) {
    if (!confirm("Hapus data UMKM ini?")) return;
    setActionError("");
    try {
      await deleteUmkm(id);
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "UMKM gagal dihapus.");
    }
  }
  // Modal menampilkan error yang dilempar, jadi biarkan keduanya merambat.
  async function handleAddPotensi(data: Omit<RTPotensi, "id" | "rtId">) {
    await addPotensiRT(rtId, data);
  }
  async function handleEditPotensi(data: Omit<RTPotensi, "id" | "rtId">) {
    if (!editingPotensi) return;
    await updatePotensiRT(editingPotensi.id, data);
  }
  async function handleDeletePotensi(id: string) {
    if (!confirm("Hapus data potensi ini?")) return;
    setActionError("");
    try {
      await deletePotensiRT(id);
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Potensi gagal dihapus.");
    }
  }

  return (
    <div className="p-6 lg:p-8">
      {/* ── Header ── */}
      <div className="mb-6">
        <p className="text-sm font-medium uppercase tracking-wide text-ink-500">Detail Rukun Tetangga</p>
        <h1 className="font-display text-2xl font-bold text-ink-900">{rt.label} — Dusun Cilikan</h1>

        <div className="mt-3 flex flex-wrap gap-3">
          {[
            { peran: "Ketua", person: headOf(rt.id), newQuery: "ketua=1" },
            { peran: "Sekretaris", person: roleOf(rt.id, "sekretaris"), newQuery: "jabatan=Sekretaris" },
            { peran: "Bendahara", person: roleOf(rt.id, "bendahara"), newQuery: "jabatan=Bendahara" },
          ].map((p) => (
            <div key={p.peran} className="flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-1.5">
              <User className="h-3.5 w-3.5 text-ink-400" />
              <span className="text-xs text-ink-500">{p.peran}:</span>
              <span className="text-xs font-semibold text-ink-800">{p.person?.name ?? "Belum diisi"}</span>
              {canManage && (
                <Link
                  href={`/dashboard/struktur?wilayah=${rt.id}&${p.person ? `edit=${p.person.id}` : p.newQuery}`}
                  className="text-xs font-semibold text-brand-700 hover:text-brand-800"
                >
                  {p.person ? "Ubah" : "Isi"}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>

      {actionError && (
        <p role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {actionError}
        </p>
      )}

      {/* ── Quick-stat cards ── */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total Warga", value: demografi ? `${totalWarga(demografi)} jiwa` : "–", color: "bg-brand-50 text-brand-700", icon: Users },
          { label: "Kepala Keluarga", value: demografi ? `${demografi.jumlahKK} KK` : "–", color: "bg-teal-50 text-teal-700", icon: Home },
          { label: "Jumlah UMKM", value: `${umkm.length} usaha`, color: "bg-amber-50 text-amber-700", icon: Store },
          { label: "Potensi RT", value: `${potensi.length} data`, color: "bg-purple-50 text-purple-700", icon: Sparkles },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl border border-line bg-paper p-4 shadow-sm`}>
            <div className={`mb-2 inline-flex rounded-xl p-2 ${s.color}`}>
              <s.icon className="h-4 w-4" />
            </div>
            <p className="text-xs font-medium text-ink-500">{s.label}</p>
            <p className="mt-0.5 font-display text-lg font-bold text-ink-900">{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div className="mb-6 flex gap-1 overflow-x-auto rounded-2xl border border-line bg-cream-100 p-1">
        {TAB_LIST.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-1 shrink-0 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-semibold whitespace-nowrap transition-all sm:text-sm ${
                activeTab === tab.id
                  ? "bg-white text-brand-700 shadow-sm"
                  : "text-ink-500 hover:text-ink-900"
              }`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ════════════════ TAB: RINGKASAN ════════════════ */}
      {activeTab === "ringkasan" && (
        <div className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-line bg-paper p-6 shadow-sm">
              <h2 className="mb-4 font-display text-sm font-semibold text-ink-900">Komposisi Gender</h2>
              {demografi && totalWarga(demografi) > 0 ? (
                <DonutChart
                  size={160}
                  strokeWidth={30}
                  centerLabel="warga"
                  centerValue={totalWarga(demografi)}
                  segments={[
                    { label: "Laki-laki", value: demografi.laki, color: "#0891b2" },
                    { label: "Perempuan", value: demografi.perempuan, color: "#ec4899" },
                  ]}
                />
              ) : (
                <p className="text-sm text-ink-500">Data kependudukan belum diisi.</p>
              )}
            </div>

            <div className="rounded-2xl border border-line bg-paper p-6 shadow-sm">
              <h2 className="mb-5 font-display text-sm font-semibold text-ink-900">Piramida Usia</h2>
              {demografi && sumUmur(demografi.kelompokUmur) > 0 ? (
                <BarChart
                  bars={AGE_GROUPS.map((label, i) => ({ label, value: demografi.kelompokUmur[i] }))}
                  height={160}
                  barColor="#16a34a"
                  unit=" jiwa"
                />
              ) : (
                <p className="text-sm text-ink-500">Data kelompok usia belum diisi.</p>
              )}
            </div>
          </div>

          {canManage && <DemografiForm key={rtId} rtId={rtId} rtLabel={rt.label} initial={demografi} />}

          {/* Quick links to other features */}
          <div className="grid gap-3 sm:grid-cols-2">
            <Link href={`/dashboard/berita?wilayah=${rtId}`}
              className="group flex items-center justify-between rounded-2xl border border-line bg-paper p-5 shadow-sm hover:border-brand-400 hover:shadow-md transition-all">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-brand-50 p-2.5"><Newspaper className="h-5 w-5 text-brand-600" /></div>
                <div>
                  <p className="font-semibold text-ink-900 text-sm">Berita RT</p>
                  <p className="text-xs text-ink-500">Kelola berita {rt.label}</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-ink-300 group-hover:text-brand-600 group-hover:translate-x-1 transition-all" />
            </Link>
            <Link href={`/dashboard/rt/${rtId}/peta`}
              className="group flex items-center justify-between rounded-2xl border border-line bg-paper p-5 shadow-sm hover:border-teal-400 hover:shadow-md transition-all">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-teal-50 p-2.5"><Map className="h-5 w-5 text-teal-600" /></div>
                <div>
                  <p className="font-semibold text-ink-900 text-sm">Pinpoint Peta</p>
                  <p className="text-xs text-ink-500">Kelola lokasi {rt.label}</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-ink-300 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>
      )}

      {/* ════════════════ TAB: UMKM ════════════════ */}
      {activeTab === "umkm" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-ink-500">{umkm.length} usaha terdaftar di {rt.label}</p>
            {canManage && (
              <Link
                href={`/dashboard/umkm/baru?rt=${rtId}`}
                className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-600 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                Tambah UMKM
              </Link>
            )}
          </div>

          {umkm.length === 0 && (
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-line bg-paper py-16 text-center">
              <Store className="h-8 w-8 text-ink-300" />
              <p className="text-sm text-ink-500">Belum ada data UMKM untuk {rt.label}.</p>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {umkm.map((u) => (
              <div key={u.id} className="rounded-2xl border border-line bg-paper p-5 shadow-sm hover:shadow-md transition-all">
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50">
                      <Store className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-ink-900 text-sm">{u.nama}</p>
                      <span className="text-xs text-amber-600 font-medium">{u.jenis}</span>
                    </div>
                  </div>
                  {canManage && (
                    <div className="flex shrink-0 items-center">
                      <Link
                        href={`/dashboard/umkm/${u.id}`}
                        aria-label={`Edit ${u.nama}`}
                        className="rounded-lg p-1.5 text-ink-300 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDeleteUMKM(u.id)}
                        aria-label={`Hapus ${u.nama}`}
                        className="rounded-lg p-1.5 text-ink-300 hover:bg-red-50 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <p className="text-xs text-ink-600 mb-2">{u.deskripsi ?? "–"}</p>

                {u.produk && (
                  <p className="text-xs text-ink-500">
                    <span className="font-medium text-ink-700">Produk:</span> {u.produk}
                  </p>
                )}

                <div className="mt-3 flex items-center gap-3 border-t border-line pt-3">
                  <User className="h-3.5 w-3.5 text-ink-400 shrink-0" />
                  <span className="text-xs text-ink-600">{u.pemilik || "–"}</span>
                  {u.kontak && (
                    <>
                      <Phone className="h-3.5 w-3.5 text-ink-400 shrink-0 ml-auto" />
                      <a href={`tel:${u.kontak}`} className="text-xs font-medium text-brand-600 hover:underline">
                        {u.kontak}
                      </a>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ════════════════ TAB: POTENSI ════════════════ */}
      {activeTab === "potensi" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-ink-500">{potensi.length} potensi terdokumentasi di {rt.label}</p>
            {canManage && (
              <button
                onClick={() => setShowAddPotensi(true)}
                className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-700 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                Tambah Potensi
              </button>
            )}
          </div>

          {potensi.length === 0 && (
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-line bg-paper py-16 text-center">
              <Sparkles className="h-8 w-8 text-ink-300" />
              <p className="text-sm text-ink-500">Belum ada potensi terdokumentasi untuk {rt.label}.</p>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {potensi.map((p) => {
              const color = KATEGORI_COLORS[p.kategori] ?? "#64748b";
              return (
                <div key={p.id} className="rounded-2xl border bg-paper p-5 shadow-sm hover:shadow-md transition-all"
                  style={{ borderColor: color + "40" }}>
                  {p.foto && (
                    <MediaImage src={p.foto} alt={p.judul} sizes="360px" className="mb-4 aspect-[16/9] w-full rounded-xl" />
                  )}
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div>
                      <span className="inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold text-white mb-2"
                        style={{ backgroundColor: color }}>
                        {p.kategori}
                      </span>
                      <p className="font-semibold text-ink-900 text-sm leading-snug">{p.judul}</p>
                    </div>
                    {canManage && (
                      <div className="mt-1 flex shrink-0 items-center">
                        <button
                          type="button"
                          onClick={() => setEditingPotensi(p)}
                          aria-label={`Edit ${p.judul}`}
                          className="rounded-lg p-1.5 text-ink-300 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePotensi(p.id)}
                          aria-label={`Hapus ${p.judul}`}
                          className="rounded-lg p-1.5 text-ink-300 hover:bg-red-50 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-xs leading-relaxed text-ink-600">{p.deskripsi}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Modals ── */}
      {showAddPotensi && <AddPotensiModal onAdd={handleAddPotensi} onClose={() => setShowAddPotensi(false)} />}
      {editingPotensi && (
        <AddPotensiModal
          key={editingPotensi.id}
          initial={editingPotensi}
          onAdd={handleEditPotensi}
          onClose={() => setEditingPotensi(null)}
        />
      )}
    </div>
  );
}
