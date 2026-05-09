import { createFileRoute, Link } from "@tanstack/react-router";
import { Users, Megaphone, HeartHandshake, TrendingUp, Facebook, ArrowRight, Target, Eye, Sparkles } from "lucide-react";
import hero from "@/assets/hero-pnc.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "পাবনা নাগরিক কমিটি - পিএনসি | নাগরিক ঐক্যেই বদলাবে পাবনা" },
      { name: "description", content: "পাবনা নাগরিক কমিটি - পিএনসি একটি নাগরিকভিত্তিক সামাজিক সংগঠন। পাবনার উন্নয়ন, সামাজিক সচেতনতা ও মানবিক উদ্যোগে আমাদের সাথে যুক্ত হোন।" },
      { property: "og:title", content: "পাবনা নাগরিক কমিটি - পিএনসি" },
      { property: "og:description", content: "নাগরিক ঐক্যেই বদলাবে পাবনা।" },
      { property: "og:image", content: hero },
    ],
  }),
  component: HomePage,
});

const features = [
  { icon: Users, title: "নাগরিক ঐক্য", text: "মানুষকে একত্রিত করে জনস্বার্থে সম্মিলিত উদ্যোগ গড়ে তোলা।" },
  { icon: Megaphone, title: "সামাজিক সচেতনতা", text: "সচেতনতা, দায়িত্ববোধ ও ইতিবাচক পরিবর্তনের প্রচার।" },
  { icon: HeartHandshake, title: "জনকল্যাণ", text: "মানুষের সমস্যা, অধিকার ও প্রয়োজনকে গুরুত্ব দেওয়া।" },
  { icon: TrendingUp, title: "পাবনার উন্নয়ন", text: "পাবনার ইতিবাচক পরিবর্তন ও উন্নয়নমূলক উদ্যোগে ভূমিকা রাখা।" },
];

function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <img
          src={hero}
          alt="পাবনার নাগরিকদের ঐক্য"
          width={1920}
          height={1088}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 gradient-overlay" />
        <div className="relative container-pnc py-20 md:py-28 text-primary-foreground">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-4 py-1.5 text-xs font-medium border border-white/20">
            <Sparkles className="h-3.5 w-3.5" /> একটি নাগরিকভিত্তিক সামাজিক সংগঠন
          </span>
          <h1 className="mt-5 text-balance text-4xl md:text-6xl font-bold max-w-4xl leading-tight">
            নাগরিক ঐক্যেই বদলাবে পাবনা।
          </h1>
          <p className="mt-5 max-w-2xl text-base md:text-xl opacity-95">
            পাবনার উন্নয়ন, সামাজিক সচেতনতা, নাগরিক অধিকার এবং মানবিক উদ্যোগে আমরা একসাথে কাজ করি।
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/membership" className="inline-flex items-center gap-2 rounded-lg bg-red-accent px-6 py-3 text-sm md:text-base font-semibold text-red-accent-foreground hover:opacity-90 transition shadow-elegant">
              <Users className="h-5 w-5" /> সদস্য হোন
            </Link>
            <a href="https://www.facebook.com/pncpabna/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-white/15 backdrop-blur border border-white/30 px-6 py-3 text-sm md:text-base font-semibold text-white hover:bg-white/25 transition">
              <Facebook className="h-5 w-5" /> ফেসবুকে অনুসরণ করুন
            </a>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl">
            {[
              ["১০K+", "অনুসারী"],
              ["নাগরিক", "সংগঠন"],
              ["সামাজিক", "উন্নয়ন"],
              ["ঐক্যবদ্ধ", "পাবনার জন্য"],
            ].map(([n, l]) => (
              <div key={l} className="rounded-xl bg-white/10 backdrop-blur border border-white/20 p-4">
                <div className="text-xl md:text-2xl font-bold">{n}</div>
                <div className="text-xs md:text-sm opacity-90 mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT / FEATURES */}
      <section className="container-pnc py-16 md:py-24">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-accent mb-3">আমাদের সম্পর্কে</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">আমরা পাবনার নাগরিকদের কণ্ঠস্বর</h2>
          <p className="mt-4 text-muted-foreground text-base md:text-lg">
            পাবনা নাগরিক কমিটি - পিএনসি একটি নাগরিকভিত্তিক সামাজিক সংগঠন, যা পাবনার উন্নয়ন, জনস্বার্থ, সামাজিক সচেতনতা এবং মানবিক উদ্যোগের পক্ষে কাজ করে। আমরা বিশ্বাস করি সচেতন ও ঐক্যবদ্ধ নাগরিকরাই একটি উন্নত, মানবিক ও দায়িত্বশীল সমাজ গড়ে তুলতে পারে।
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="card-hover rounded-2xl border border-border bg-card p-6 shadow-card">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-semibold text-foreground text-lg">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="bg-surface border-y border-border">
        <div className="container-pnc py-16 md:py-20 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-primary text-primary-foreground p-8 md:p-10 shadow-elegant">
            <Target className="h-9 w-9" />
            <h3 className="mt-4 text-2xl font-bold">আমাদের লক্ষ্য</h3>
            <p className="mt-3 opacity-95 text-base md:text-lg leading-relaxed">
              পাবনার মানুষের কণ্ঠস্বরকে শক্তিশালী করা এবং নাগরিক অংশগ্রহণের মাধ্যমে উন্নয়নমুখী সমাজ গড়ে তোলা।
            </p>
          </div>
          <div className="rounded-2xl bg-card border border-border p-8 md:p-10 shadow-card">
            <Eye className="h-9 w-9 text-red-accent" />
            <h3 className="mt-4 text-2xl font-bold text-foreground">আমাদের স্বপ্ন</h3>
            <p className="mt-3 text-muted-foreground text-base md:text-lg leading-relaxed">
              একটি সচেতন, ঐক্যবদ্ধ, দায়িত্বশীল ও মানবিক পাবনা গড়ে তোলা।
            </p>
          </div>
        </div>
      </section>

      {/* CTA STRIP */}
      <section className="container-pnc py-16 md:py-20">
        <div className="rounded-3xl gradient-hero text-primary-foreground p-8 md:p-14 text-center">
          <h2 className="text-3xl md:text-4xl font-bold">আপনিও যুক্ত হোন এই নাগরিক উদ্যোগে</h2>
          <p className="mt-3 max-w-2xl mx-auto opacity-95">
            পাবনার উন্নয়ন, সামাজিক ঐক্য এবং জনস্বার্থে কাজ করতে আজই আমাদের সাথে যুক্ত হোন।
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link to="/membership" className="inline-flex items-center gap-2 rounded-lg bg-red-accent px-6 py-3 text-sm md:text-base font-semibold text-red-accent-foreground hover:opacity-90 transition">
              সদস্য হোন <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/activities" className="inline-flex items-center gap-2 rounded-lg bg-white/15 backdrop-blur border border-white/30 px-6 py-3 text-sm md:text-base font-semibold hover:bg-white/25 transition">
              আমাদের কার্যক্রম দেখুন
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
