import { Container } from "@/components/layout/container";
import { HeroLandscape } from "./hero-landscape";

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-brand-950 py-24 pt-40 sm:pt-44">
      <div className="absolute inset-0 opacity-70">
        <HeroLandscape />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/50 to-brand-950/20" />
      <Container className="relative">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-300">
          {eyebrow}
        </p>
        <h1 className="mt-3 max-w-2xl text-balance font-display text-4xl font-semibold text-white sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-xl text-base leading-relaxed text-brand-100/85">
            {description}
          </p>
        )}
      </Container>
    </section>
  );
}
