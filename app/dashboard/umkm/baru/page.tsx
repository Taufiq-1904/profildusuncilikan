"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { UmkmEditor } from "@/components/dashboard/umkm-editor";

function NewUmkm() {
  // ?rt=rt03 preselects the RT, used by the "Tambah UMKM" link on an RT page.
  const rt = useSearchParams().get("rt") ?? undefined;
  return <UmkmEditor defaultRtId={rt} />;
}

export default function UmkmBaruPage() {
  return (
    <Suspense fallback={null}>
      <NewUmkm />
    </Suspense>
  );
}
