type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function PageHeader({ eyebrow, title, description }: Props) {
  return (
    <section className="gradient-hero text-primary-foreground">
      <div className="container-pnc py-14 md:py-20">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-90 mb-3">{eyebrow}</p>
        )}
        <h1 className="text-balance text-3xl md:text-5xl font-bold max-w-3xl">{title}</h1>
        {description && (
          <p className="mt-4 max-w-2xl text-base md:text-lg opacity-90">{description}</p>
        )}
      </div>
    </section>
  );
}
