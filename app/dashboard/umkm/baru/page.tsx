"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { UmkmEditor } from "@/components/dashboard/umkm-editor";
import { readUmkmPrefill } from "@/lib/umkmPrefill";

function NewUmkm() {
  // ?rt=rt03 preselects the RT, used by the "Tambah UMKM" link on an RT page.
  // Parameter lain mengisi form dari pinpoint (lihat lib/umkmPrefill).
  const prefill = readUmkmPrefill(useSearchParams());
  return <UmkmEditor defaultRtId={prefill.rtId} prefill={prefill} />;
}

export default function UmkmBaruPage() {
  return (
    <Suspense fallback={null}>
      <NewUmkm />
    </Suspense>
  );
}
