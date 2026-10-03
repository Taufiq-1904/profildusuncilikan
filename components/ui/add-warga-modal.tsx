"use client";

import { useState } from "react";
import { X, UserPlus } from "lucide-react";
import type { Warga } from "@/lib/data/rtData";

const STATUS_OPTIONS: Warga["statusKawin"][] = ["Belum Kawin", "Kawin", "Cerai Hidup", "Cerai Mati"];
const PENDIDIKAN_OPTIONS: NonNullable<Warga["pendidikan"]>[] = ["Tidak Sekolah", "SD", "SMP", "SMA", "D3", "S1", "S2", "Lainnya"];
const PEKERJAAN_OPTIONS = ["Petani", "Pedagang", "Wiraswasta", "Karyawan Swasta", "Pegawai Negeri", "Buruh Tani", "Ibu Rumah Tangga", "Pelajar", "Mahasiswa", "Pensiunan", "Tidak Bekerja", "Lainnya"];

type Props = {
  onAdd: (warga: Omit<Warga, "id">) => void;
  onClose: () => void;
};

export function AddWargaModal({ onAdd, onClose }: Props) {
  const [nama, setNama] = useState("");
  const [jk, setJk] = useState<"L" | "P">("L");
  const [nik, setNik] = useState("");
  const [tempatLahir, setTempatLahir] = useState("");
  const [tanggalLahir, setTanggalLahir] = useState("");
  const [statusKawin, setStatusKawin] = useState<Warga["statusKawin"]>("Belum Kawin");
  const [pekerjaan, setPekerjaan] = useState("Petani");
  const [pekerjaanCustom, setPekerjaanCustom] = useState("");
  const [pendidikan, setPendidikan] = useState<NonNullable<Warga["pendidikan"]>>("SMA");
  const [alamat, setAlamat] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nama.trim()) { setError("Nama wajib diisi."); return; }
    onAdd({
      nama: nama.trim(),
      jenisKelamin: jk,
      nik: nik.trim() || undefined,
      tempatLahir: tempatLahir.trim() || undefined,
      tanggalLahir: tanggalLahir || undefined,
      statusKawin,
      pekerjaan: pekerjaan === "Lainnya" ? pekerjaanCustom.trim() || "Lainnya" : pekerjaan,
      pendidikan,
      alamat: alamat.trim() || undefined,
    });
    onClose();
  }

  const inputCls = "w-full rounded-xl border border-line bg-cream-100 px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-300 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/30";
  const labelCls = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-ink-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-6 py-4"
          style={{ background: "linear-gradient(135deg, #052e16 0%, #0e4f5c 100%)" }}>
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-brand-300" />
            <h2 className="font-display text-base font-semibold text-white">Tambah Data Warga</h2>
          </div>
          <button onClick={onClose} className="rounded-full p-1.5 text-white/70 hover:bg-white/10 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto px-6 py-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelCls}>Nama Lengkap *</label>
              <input type="text" value={nama} onChange={(e) => setNama(e.target.value)}
                placeholder="Contoh: Budi Santoso" required className={inputCls} />
            </div>

            <div>
              <label className={labelCls}>Jenis Kelamin</label>
              <div className="flex gap-2">
                {(["L", "P"] as const).map((v) => (
                  <button key={v} type="button" onClick={() => setJk(v)}
                    className={`flex-1 rounded-xl border py-2.5 text-sm font-semibold transition-all ${
                      jk === v ? "border-brand-600 bg-brand-50 text-brand-700" : "border-line bg-cream-100 text-ink-600 hover:bg-cream"
                    }`}>
                    {v === "L" ? "Laki-laki" : "Perempuan"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={labelCls}>NIK (opsional)</label>
              <input type="text" value={nik} onChange={(e) => setNik(e.target.value)}
                placeholder="16 digit NIK" maxLength={16} className={inputCls} />
            </div>

            <div>
              <label className={labelCls}>Tempat Lahir</label>
              <input type="text" value={tempatLahir} onChange={(e) => setTempatLahir(e.target.value)}
                placeholder="Sleman" className={inputCls} />
            </div>

            <div>
              <label className={labelCls}>Tanggal Lahir</label>
              <input type="date" value={tanggalLahir} onChange={(e) => setTanggalLahir(e.target.value)}
                className={inputCls} />
            </div>

            <div>
              <label className={labelCls}>Status Kawin</label>
              <select value={statusKawin} onChange={(e) => setStatusKawin(e.target.value as Warga["statusKawin"])}
                className={inputCls}>
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className={labelCls}>Pendidikan Terakhir</label>
              <select value={pendidikan} onChange={(e) => setPendidikan(e.target.value as NonNullable<Warga["pendidikan"]>)}
                className={inputCls}>
                {PENDIDIKAN_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div>
              <label className={labelCls}>Pekerjaan</label>
              <select value={pekerjaan} onChange={(e) => setPekerjaan(e.target.value)} className={inputCls}>
                {PEKERJAAN_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            {pekerjaan === "Lainnya" && (
              <div>
                <label className={labelCls}>Pekerjaan (isi manual)</label>
                <input type="text" value={pekerjaanCustom} onChange={(e) => setPekerjaanCustom(e.target.value)}
                  placeholder="Sebutkan pekerjaan..." className={inputCls} />
              </div>
            )}

            <div className="sm:col-span-2">
              <label className={labelCls}>Alamat</label>
              <input type="text" value={alamat} onChange={(e) => setAlamat(e.target.value)}
                placeholder="Contoh: RT 01 No. 5, Cilikan" className={inputCls} />
            </div>
          </div>

          {error && <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

          <div className="mt-5 flex gap-3">
            <button type="button" onClick={onClose}
              className="flex-1 rounded-xl border border-line px-4 py-2.5 text-sm font-semibold text-ink-700 hover:bg-cream-100 transition-colors">
              Batal
            </button>
            <button type="submit"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition-colors">
              <UserPlus className="h-4 w-4" />
              Simpan Warga
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
