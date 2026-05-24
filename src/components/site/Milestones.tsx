import { useEffect, useRef, useState } from "react";
import { Rocket, Handshake, ScrollText, Moon, Landmark, Vote } from "lucide-react";
import { AnimatedCounter } from "./AnimatedCounter";

type Item = {
  date: string;
  title: string;
  text: string;
  icon: typeof Rocket;
  emoji: string;
  category: string;
  featured?: boolean;
};

const items: Item[] = [
  {
    date: "৩০ নভেম্বর ২০২৫",
    title: "পিএনসি প্রতিষ্ঠা ও যাত্রা শুরু",
    text: "নাগরিক ঐক্যের ভিত্তিতে আনুষ্ঠানিক যাত্রা শুরু।",
    icon: Rocket,
    emoji: "🚀",
    category: "প্রতিষ্ঠা",
    featured: true,
  },
  {
    date: "০৪ ফেব্রুয়ারি ২০২৬",
    title: "প্রথম সুধী সমাবেশ",
    text: "পাবনার সর্বস্তরের মানুষের সাথে প্রথম মতবিনিময়।",
    icon: Handshake,
    emoji: "🤝",
    category: "জনসম্পৃক্ততা",
  },
  {
    date: "০৪ ফেব্রুয়ারি ২০২৬",
    title: "২৪ দফার নাগরিক সনদ",
    text: "পাবনার উন্নয়ন, নাগরিক অধিকার এবং ভবিষ্যৎ প্রজন্মের জন্য চূড়ান্ত দাবিনামা ঘোষণা।",
    icon: ScrollText,
    emoji: "📜",
    category: "দাবিনামা",
    featured: true,
  },
  {
    date: "০৮ মার্চ ২০২৬",
    title: "নাগরিক ঐক্যে দোয়া ও ইফতার মাহফিল",
    text: "একসাথে বসি, একসাথে ভাবি, একসাথে গড়ি পাবনা।",
    icon: Moon,
    emoji: "🌙",
    category: "সম্প্রীতি",
  },
  {
    date: "০৫ এপ্রিল ২০২৬",
    title: "কো-চেয়ারম্যান মোঃ জহুরুল ইসলাম বিশু মহোদয়ের পাবনা জেলা পরিষদের প্রশাসক পদে দায়িত্বভার গ্রহণ",
    text: "নাগরিক নেতৃত্ব ও জনস্বার্থে নতুন দায়িত্ব গ্রহণ।",
    icon: Landmark,
    emoji: "🏛️",
    category: "নেতৃত্ব",
    featured: true,
  },
  {
    date: "২০ ডিসেম্বর ২০২৫",
    title: "পাবনা-৫ আসনে জাতীয় সংসদ সদস্য নির্বাচনে মোঃ শামছুর রহমান শিমুল বিশ্বাস-এর প্রতি আনুষ্ঠানিকভাবে পূর্ণ সমর্থন ঘোষণা",
    text: "পাবনার উন্নয়ন ও নাগরিক স্বার্থে সম্মিলিত অঙ্গীকারের অংশ হিসেবে সমর্থন ঘোষণা।",
    icon: Vote,
    emoji: "🗳️",
    category: "রাজনৈতিক কার্যক্রম",
  },
];

function TimelineNode({ item, index }: { item: Item; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const isLeft = index % 2 === 0;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Icon = item.icon;

  return (
    <div
      ref={ref}
      className={`relative md:grid md:grid-cols-2 md:gap-12 items-center transition-all duration-700 ease-out ${
        visible
          ? "opacity-100 translate-y-0"
          : `opacity-0 ${isLeft ? "md:-translate-x-6" : "md:translate-x-6"} translate-y-8`
      }`}
      style={{ transitionDelay: `${index * 90}ms` }}
    >
      {/* Center dot (desktop) */}
      <span className="hidden md:flex absolute left-1/2 top-8 -translate-x-1/2 z-10">
        <span
          className={`relative inline-flex h-14 w-14 items-center justify-center rounded-full ring-4 ring-background shadow-elegant ${
            item.featured
              ? "bg-gradient-to-br from-red-accent to-primary text-white"
              : "bg-primary-soft text-primary"
          }`}
        >
          {item.featured && (
            <>
              <span className="absolute inset-0 rounded-full animate-ping bg-red-accent/40" />
              <span className="absolute -inset-2 rounded-full bg-[var(--gold)]/30 blur-xl animate-pulse" />
            </>
          )}
          <Icon className="h-6 w-6 relative" />
        </span>
      </span>

      {/* Mobile dot */}
      <span className="md:hidden absolute -left-[34px] top-6 z-10">
        <span
          className={`relative inline-flex h-11 w-11 items-center justify-center rounded-full ring-4 ring-background shadow-card ${
            item.featured
              ? "bg-gradient-to-br from-red-accent to-primary text-white"
              : "bg-primary-soft text-primary"
          }`}
        >
          {item.featured && (
            <span className="absolute -inset-1.5 rounded-full bg-[var(--gold)]/30 blur-md animate-pulse" />
          )}
          <Icon className="h-5 w-5 relative" />
        </span>
      </span>

      {/* Card */}
      <div className={`${isLeft ? "md:col-start-1 md:pr-8 md:text-right" : "md:col-start-2 md:pl-8"}`}>
        <article
          className={`group relative rounded-2xl border border-border/70 bg-card/70 backdrop-blur-xl p-6 md:p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-elegant ${
            item.featured
              ? "md:p-8 ring-1 ring-[var(--gold)]/50 bg-gradient-to-br from-card/90 to-primary-soft/40 shadow-[0_0_40px_-12px_var(--gold)]"
              : ""
          }`}
        >
          {item.featured && (
            <span className="absolute -top-3 left-6 md:left-auto md:right-6 inline-flex items-center gap-1 rounded-full bg-[var(--gold)] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground shadow">
              ⭐ Featured
            </span>
          )}

          <div className={`flex flex-wrap items-center gap-2 ${isLeft ? "md:justify-end" : ""}`}>
            <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-sm">
              {item.date}
            </span>
            <span className="inline-flex items-center rounded-full bg-red-accent/10 px-2.5 py-1 text-[11px] font-semibold text-red-accent">
              {item.category}
            </span>
          </div>

          <h3
            className={`mt-3 font-bold text-foreground heading-display ${
              item.featured ? "text-xl md:text-2xl" : "text-lg md:text-xl"
            }`}
          >
            <span className="mr-2">{item.emoji}</span>
            {item.title}
          </h3>
          <p className="mt-2 text-sm md:text-base text-muted-foreground leading-relaxed">{item.text}</p>

          {/* Connector arrow */}
          <span
            aria-hidden
            className={`hidden md:block absolute top-10 h-3 w-3 rotate-45 border border-border bg-card ${
              isLeft ? "-right-1.5 border-l-0 border-b-0" : "-left-1.5 border-r-0 border-t-0"
            }`}
          />
        </article>
      </div>
    </div>
  );
}

export function Milestones() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height + vh * 0.4;
      const passed = vh - rect.top;
      const p = Math.max(0, Math.min(1, passed / total));
      setProgress(p);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-surface to-background">
      {/* Animated background blobs */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-primary/10 blur-3xl animate-pulse" />
        <div
          className="absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-red-accent/10 blur-3xl animate-pulse"
          style={{ animationDelay: "1.2s" }}
        />
        <div
          className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-[var(--gold)]/10 blur-3xl animate-pulse"
          style={{ animationDelay: "2.4s" }}
        />
        <div className="absolute inset-0 pattern-dots text-primary/5" />
      </div>

      <div className="container-pnc py-16 md:py-24 relative">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-accent mb-3">
            গুরুত্বপূর্ণ মাইলফলক
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground heading-display">
            আমাদের যাত্রার গল্প
          </h2>
          <div className="mt-5 mx-auto gold-divider" />
          <p className="mt-5 text-muted-foreground text-base md:text-lg">
            পিএনসি-র প্রতিষ্ঠা থেকে আজ পর্যন্ত — পাবনার মানুষের সাথে কাঁধে কাঁধ মিলিয়ে।
          </p>
        </div>

        {/* Stats counter */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {[
            { n: items.length, suffix: "", l: "মোট মাইলফলক" },
            { n: 12, suffix: "+", l: "চলমান কার্যক্রম" },
            { n: 10000, suffix: "+", l: "নাগরিক সম্পৃক্ততা" },
          ].map((s) => (
            <div
              key={s.l}
              className="rounded-2xl border border-border/70 bg-card/70 backdrop-blur-xl p-6 text-center shadow-card card-hover"
            >
              <div className="text-3xl md:text-4xl font-bold text-primary heading-display">
                <AnimatedCounter to={s.n} suffix={s.suffix} />
              </div>
              <div className="mt-1.5 text-sm text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div ref={trackRef} className="relative mt-16 md:mt-20">
          {/* Center track (desktop) */}
          <div
            aria-hidden
            className="hidden md:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-[3px] bg-border/60 rounded-full overflow-hidden"
          >
            <span
              className="absolute top-0 left-0 right-0 bg-gradient-to-b from-red-accent via-primary to-[var(--gold)] transition-[height] duration-150 ease-out"
              style={{ height: `${progress * 100}%` }}
            />
          </div>

          {/* Mobile left track */}
          <div
            aria-hidden
            className="md:hidden absolute left-[6px] top-0 bottom-0 w-[2px] bg-border/60 rounded-full overflow-hidden"
          >
            <span
              className="absolute top-0 left-0 right-0 bg-gradient-to-b from-red-accent via-primary to-[var(--gold)] transition-[height] duration-150 ease-out"
              style={{ height: `${progress * 100}%` }}
            />
          </div>

          <div className="space-y-12 md:space-y-16 pl-10 md:pl-0">
            {items.map((it, i) => (
              <TimelineNode key={it.title} item={it} index={i} />
            ))}
          </div>
        </div>

        {/* Closing message */}
        <div className="mt-20 max-w-3xl mx-auto text-center">
          <div className="relative rounded-3xl gradient-hero text-primary-foreground p-8 md:p-10 shadow-elegant overflow-hidden">
            <span
              aria-hidden
              className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-[var(--gold)]/30 blur-2xl animate-pulse"
            />
            <p className="relative text-lg md:text-2xl font-semibold leading-relaxed">
              "আমরা শুধু একটি সংগঠন নই — আমরা পাবনার মানুষের সম্মিলিত কণ্ঠস্বর।"
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
