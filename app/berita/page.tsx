import { NewsList } from "@/components/sections/news-list";
import { siteConfig } from "@/lib/data/siteConfig";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Berita",
  description: `Kabar kegiatan, pengumuman, dan perkembangan dari Dusun, RW, dan RT di ${siteConfig.villageName}.`,
  path: "/berita",
});

export default function BeritaPage() {
  return <NewsList />;
}
