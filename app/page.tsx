import { HeroSection } from "@/components/sections/hero-section";
import { StatsSection } from "@/components/sections/stats-section";
import { HeadWelcomeSection } from "@/components/sections/head-welcome-section";
import { AboutSection } from "@/components/sections/about-section";
import { PotentialsSection } from "@/components/sections/potentials-section";
import { NewsSection } from "@/components/sections/news-section";
import { GalleryPreviewSection } from "@/components/sections/gallery-preview-section";
import { MapPreviewSection } from "@/components/sections/map-preview-section";
import { CtaSection } from "@/components/sections/cta-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <HeadWelcomeSection />
      <AboutSection />
      <PotentialsSection />
      <NewsSection />
      <GalleryPreviewSection />
      <MapPreviewSection />
      <CtaSection />
    </>
  );
}
