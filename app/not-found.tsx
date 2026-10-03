import Link from "next/link";
import { Compass, Home } from "lucide-react";
import { Container } from "@/components/layout/container";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center py-20">
      <Container>
        <div className="mx-auto max-w-md text-center">
          <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-700">
            <Compass className="h-8 w-8" aria-hidden="true" />
          </span>
          <p className="mt-6 font-display text-sm font-semibold uppercase tracking-wide text-brand-700">
            404
          </p>
          <h1 className="mt-2 text-balance font-display text-2xl font-semibold text-ink-900 sm:text-3xl">
            Halaman tidak ditemukan
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-500">
            Halaman yang Anda cari mungkin sudah dipindahkan, dihapus, atau alamatnya salah ketik.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex h-11 items-center gap-2 rounded-full bg-brand-700 px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-800"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            Kembali ke Beranda
          </Link>
        </div>
      </Container>
    </section>
  );
}
