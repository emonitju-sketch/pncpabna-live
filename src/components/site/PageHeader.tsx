type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function PageHeader({ eyebrow, title, description }: Props) {
  return (
    <section className="relative gradient-hero text-primary-foreground overflow-hidden">
      {/* Decorative pattern */}
      <div aria-hidden className="absolute inset-0 pattern-dots text-white pointer-events-none" />
      <div aria-hidden className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-[color-mix(in_oklab,var(--gold)_25%,transparent)] blur-3xl pointer-events-none" />
      <div aria-hidden className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-[color-mix(in_oklab,var(--red-accent)_25%,transparent)] blur-3xl pointer-events-none" />

      <div className="relative container-pnc py-16 md:py-24">
        {eyebrow && (
          <p className="reveal text-[0.72rem] font-semibold uppercase tracking-[0.22em] opacity-95 mb-4 inline-flex items-center gap-3">
            <span className="h-px w-8 bg-[var(--gold)]" />
            {eyebrow}
          </p>
        )}
        <h1 className="reveal reveal-delay-1 text-balance text-3xl md:text-5xl lg:text-6xl font-bold max-w-4xl heading-display">
          {title}
        </h1>
        <div className="reveal reveal-delay-2 mt-5 gold-divider" />
        {description && (
          <p className="reveal reveal-delay-3 mt-5 max-w-2xl text-base md:text-lg opacity-95 text-pretty">
            {description}
          </p>
        )}
      </div>
      <div className="gold-strip" />
    </section>
  );
}
