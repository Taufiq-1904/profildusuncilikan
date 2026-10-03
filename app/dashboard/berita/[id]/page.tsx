"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { NewsEditor } from "@/components/dashboard/news-editor";
import { useAuth } from "@/components/providers/auth-provider";
import { useIsClient, useNews } from "@/lib/hooks/use-news";
import { canManageArticle, findById } from "@/lib/newsService";

function Notice({ message }: { message: string }) {
  return (
    <div className="p-8">
      <p className="text-sm text-ink-700">{message}</p>
      <Link href="/dashboard/berita" className="mt-3 inline-block text-sm font-semibold text-brand-700 hover:underline">
        Kembali ke daftar berita
      </Link>
    </div>
  );
}

export default function EditBeritaPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const isClient = useIsClient();
  const all = useNews();

  // The editor copies the article into form state once on mount, so it must
  // not mount until the real stored list (not the seed) is available.
  if (!isClient) return null;

  const article = findById(all, id);
  if (!article) return <Notice message="Berita tidak ditemukan." />;
  if (!canManageArticle(user, article)) {
    return <Notice message="Akun Anda tidak memiliki wewenang untuk mengedit berita ini." />;
  }

  return <NewsEditor key={article.id} article={article} />;
}
