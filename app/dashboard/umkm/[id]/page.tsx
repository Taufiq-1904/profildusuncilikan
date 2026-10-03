"use client";

import { useParams } from "next/navigation";
import { Notice } from "@/components/dashboard/notice";
import { UmkmEditor } from "@/components/dashboard/umkm-editor";
import { useAuth } from "@/components/providers/auth-provider";
import { useUmkm } from "@/lib/hooks/use-directory";
import { useIsClient } from "@/lib/hooks/use-news";
import { canManageUmkm, findUmkmById } from "@/lib/umkmService";

export default function EditUmkmPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const isClient = useIsClient();
  const all = useUmkm();

  if (!isClient) return null;

  const umkm = findUmkmById(all, id);
  const back = { backHref: "/dashboard/umkm", backLabel: "Kembali ke daftar UMKM" };
  if (!umkm) return <Notice message="UMKM tidak ditemukan." {...back} />;
  if (!canManageUmkm(user, umkm)) {
    return <Notice message="Akun Anda tidak memiliki wewenang untuk mengedit UMKM ini." {...back} />;
  }

  return <UmkmEditor key={umkm.id} umkm={umkm} />;
}
