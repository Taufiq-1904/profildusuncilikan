"use client";

import { useMemo, useState } from "react";
import { OrganizationCard } from "@/components/cards/organization-card";
import { FILTER_ALL, FilterBar } from "@/components/sections/filter-bar";
import { Pagination } from "@/components/ui/pagination";
import { organizationFields } from "@/lib/data/organizationData";
import { getWilayahFilterOptions, wilayahContains } from "@/lib/data/wilayahData";
import { useOrganizations } from "@/lib/hooks/use-directory";
import { selectAllOrganizations } from "@/lib/organizationService";

const PAGE_SIZE = 9;

export function OrganizationDirectory() {
  const stored = useOrganizations();
  const organizations = useMemo(() => selectAllOrganizations(stored), [stored]);
  const [query, setQuery] = useState("");
  const [fieldId, setFieldId] = useState(FILTER_ALL);
  const [wilayahId, setWilayahId] = useState(FILTER_ALL);
  const [page, setPage] = useState(1);

  // Filter options come from what exists, so a new RW/RT or field appears on
  // its own after its first organization.
  const chips = useMemo(() => {
    const used = new Set(organizations.map((o) => o.fieldId));
    return organizationFields.filter((f) => used.has(f.id));
  }, [organizations]);

  const wilayahOptions = useMemo(
    () => getWilayahFilterOptions(organizations.map((o) => o.wilayahId)),
    [organizations]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return organizations.filter((o) => {
      if (fieldId !== FILTER_ALL && o.fieldId !== fieldId) return false;
      if (wilayahId !== FILTER_ALL && !wilayahContains(wilayahId, o.wilayahId)) return false;
      if (!q) return true;
      return o.name.toLowerCase().includes(q) || o.summary.toLowerCase().includes(q);
    });
  }, [organizations, fieldId, wilayahId, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div>
      <FilterBar
        searchLabel="Cari organisasi"
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
        chips={chips.map((c) => ({ id: c.id, name: c.name }))}
        chipId={fieldId}
        onChip={(v) => {
          setFieldId(v);
          setPage(1);
        }}
      />

      {paged.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {paged.map((o) => (
            <OrganizationCard key={o.id} organization={o} />
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center text-sm text-ink-500">
          {organizations.length === 0
            ? "Belum ada organisasi yang terdaftar."
            : "Tidak ada organisasi yang cocok dengan filter yang dipilih."}
        </p>
      )}

      <Pagination page={currentPage} totalPages={totalPages} onChange={setPage} label="Halaman organisasi" />
    </div>
  );
}
