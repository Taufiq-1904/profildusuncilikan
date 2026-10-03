"use client";

import { useMemo, useState } from "react";
import { UmkmCard } from "@/components/cards/umkm-card";
import { FILTER_ALL, FilterBar } from "@/components/sections/filter-bar";
import { Pagination } from "@/components/ui/pagination";
import { getWilayahFilterOptions, wilayahContains } from "@/lib/data/wilayahData";
import { useUmkm } from "@/lib/hooks/use-directory";
import { selectActiveUmkm } from "@/lib/umkmService";

const PAGE_SIZE = 9;

export function UmkmDirectory() {
  const stored = useUmkm();
  const umkm = useMemo(() => selectActiveUmkm(stored), [stored]);
  const [query, setQuery] = useState("");
  const [jenis, setJenis] = useState(FILTER_ALL);
  const [wilayahId, setWilayahId] = useState(FILTER_ALL);
  const [page, setPage] = useState(1);

  const chips = useMemo(
    () =>
      Array.from(new Set(umkm.map((u) => u.jenis)))
        .sort((a, b) => a.localeCompare(b, "id"))
        .map((name) => ({ id: name, name })),
    [umkm]
  );

  const wilayahOptions = useMemo(() => getWilayahFilterOptions(umkm.map((u) => u.rtId)), [umkm]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return umkm.filter((u) => {
      if (jenis !== FILTER_ALL && u.jenis !== jenis) return false;
      if (wilayahId !== FILTER_ALL && !wilayahContains(wilayahId, u.rtId)) return false;
      if (!q) return true;
      return (
        u.nama.toLowerCase().includes(q) ||
        (u.deskripsi ?? "").toLowerCase().includes(q) ||
        (u.produk ?? "").toLowerCase().includes(q)
      );
    });
  }, [umkm, jenis, wilayahId, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div>
      <FilterBar
        searchLabel="Cari UMKM atau produk"
        query={query}
        onQuery={(v) => {
          setQuery(v);
          setPage(1);
        }}
        wilayahOptions={wilayahOptions}
        wilayahId={wilayahId}
        onWilayah={(v) => {
          setWilayahId(v);
          setPage(1);
        }}
        chips={chips}
        chipId={jenis}
        onChip={(v) => {
          setJenis(v);
          setPage(1);
        }}
      />

      {paged.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {paged.map((u) => (
            <UmkmCard key={u.id} umkm={u} />
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center text-sm text-ink-500">
          {umkm.length === 0
            ? "Belum ada UMKM yang terdaftar."
            : "Tidak ada UMKM yang cocok dengan filter yang dipilih."}
        </p>
      )}

      <Pagination page={currentPage} totalPages={totalPages} onChange={setPage} label="Halaman UMKM" />
    </div>
  );
}
