import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/site/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import { publicUrl } from "@/hooks/use-auth";
import hero24Dofa from "@/assets/24-dofa-cover.jpeg";
import heroFallback from "@/assets/hero-pnc.jpg";
import {
  Megaphone, MessageSquare, GraduationCap, HeartHandshake,
  Users, Vote, Building2, Sparkles, ArrowRight, X, CheckCircle2,
  Calendar, MapPin, Tag, ExternalLink, PlayCircle, Star, Flame,
} from "lucide-react";

export const Route = createFileRoute("/activities")({
  head: () => ({
    meta: [
      { title: "আমাদের কার্যক্রম — পাবনা নাগরিক কমিটি" },
      { name: "description", content: "সামাজিক সচেতনতা, নাগরিক সংলাপ, যুব নেতৃত্ব, মানবিক সহায়তা — পিএনসি-র বিভিন্ন কার্যক্রম ও প্রকল্প।" },
      { property: "og:title", content: "আমাদের কার্যক্রম — পিএনসি" },
      { property: "og:description", content: "পাবনার জন্য নাগরিক উদ্যোগ ও কর্মসূচি।" },
      { property: "og:url", content: "https://pncpabna.live/activities" },
    ],
    links: [{ rel: "canonical", href: "https://pncpabna.live/activities" }],
  }),
  component: ActivitiesPage,
});

type Activity = {
  id: string;
  title_bn: string;
  description_bn: string | null;
  activity_date: string | null;
  location: string | null;
  category: string;
  cover_image_path: string | null;
  external_url: string | null;
  is_featured: boolean;
  display_order: number;
  created_at: string;
};

type Pillar = {
  icon: typeof Megaphone;
  title: string;
  text: string;
  details: string;
  highlights: string[];
};

const pillars: Pillar[] = [
  { icon: Users, title: "জনস্বার্থ", text: "নাগরিক অধিকার ও সেবা সুনিশ্চিতকরণ।", details: "নাগরিক সেবা সহজীকরণ, তথ্য অধিকার চর্চা ও স্থানীয় সরকারের সেবার মান নিরীক্ষা।", highlights: ["তথ্য অধিকার", "সেবা মূল্যায়ন", "জনগণের কণ্ঠ", "স্বচ্ছতা"] },
  { icon: Vote, title: "নাগরিক মতামত", text: "জনস্বার্থে দাবি কর্তৃপক্ষের কাছে।", details: "জনমত জরিপ, স্বাক্ষর সংগ্রহ ও স্মারকলিপির মাধ্যমে দাবি পৌঁছানো।", highlights: ["জনমত জরিপ", "স্মারকলিপি", "অ্যাডভোকেসি", "কর্তৃপক্ষ"] },
  { icon: Sparkles, title: "পাবনার ব্র্যান্ডিং", text: "পাবনার সম্ভাবনা দেশ-বিদেশে।", details: "পাবনার সংস্কৃতি, ঐতিহ্য ও ব্যক্তিত্ব আধুনিক মাধ্যমে তুলে ধরা।", highlights: ["সাংস্কৃতিক উৎসব", "ঐতিহ্য", "ডিজিটাল প্রচার", "আন্তঃজেলা"] },
];

function fmtDate(iso: string | null) {
  if (!iso) return "তারিখ অনির্ধারিত";
  return new Date(iso).toLocaleDateString("bn-BD", { day: "numeric", month: "long", year: "numeric" });
}

function isSafeUrl(url: string | null): url is string {
  if (!url) return false;
  try {
    const u = new URL(url);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

function isNew(iso: string | null) {
  if (!iso) return false;
  const days = (Date.now() - new Date(iso).getTime()) / 86400000;
  return days <= 30;
}

function ActivitiesPage() {
  const [active, setActive] = useState<Pillar | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await (supabase as any)
        .from("activities")
        .select("id, title_bn, description_bn, activity_date, location, category, cover_image_path, external_url, is_featured, display_order, created_at")
        .eq("is_published", true)
        .order("is_featured", { ascending: false })
        .order("display_order", { ascending: false })
        .order("activity_date", { ascending: false, nullsFirst: false });
      setActivities((data as Activity[]) || []);
      setLoading(false);
    })();
  }, []);

  // Pick the 24-দফা Facebook video as hero feature
  const hero = useMemo(
    () => activities.find((a) => a.external_url && /facebook\.com/.test(a.external_url)),
    [activities]
  );
  const rest = useMemo(
    () => activities.filter((a) => a.id !== hero?.id),
    [activities, hero]
  );

  return (
    <>
      <PageHeader
        eyebrow="কার্যক্রম ও প্রকল্প"
        title="পাবনার জন্য আমাদের নিরন্তর উদ্যোগ"
        description="সামাজিক সচেতনতা থেকে মানবিক সহায়তা — পিএনসি-র প্রতিটি কর্মসূচি পাবনার মানুষের কল্যাণে নিবেদিত।"
      />

      {/* Featured video hero */}
      {hero && (
        <section className="container-pnc pt-10 md:pt-14">
          <div className="overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/95 via-primary to-primary/80 text-primary-foreground shadow-elegant">
            <div className="grid md:grid-cols-5 gap-0">
              <div className="md:col-span-2 relative bg-white/5 p-4 md:p-6 flex items-center justify-center md:min-h-[420px] overflow-hidden">
                <img
                  src={hero24Dofa}
                  alt={hero.title_bn}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    const img = e.currentTarget;
                    if (img.src !== heroFallback) img.src = heroFallback;
                  }}
                  className="max-h-[420px] w-full h-full object-contain object-center rounded-2xl shadow-md bg-white/5"
                />
              </div>
              <div className="md:col-span-3 p-7 md:p-9 flex flex-col justify-center">
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[var(--gold)]/20 text-[var(--gold)] px-3 py-1 text-[11px] font-bold uppercase tracking-wider border border-[var(--gold)]/40">
                  <Flame className="h-3 w-3" /> বিশেষ ফিচার
                </span>
                <h2 className="mt-4 text-2xl md:text-3xl lg:text-4xl font-bold leading-tight heading-display">
                  {hero.title_bn}
                </h2>
                {hero.description_bn && (
                  <p className="mt-3 text-sm md:text-base opacity-90 leading-relaxed line-clamp-4">
                    {hero.description_bn}
                  </p>
                )}
                <div className="mt-5 flex flex-wrap items-center gap-3 text-xs opacity-90">
                  <span className="inline-flex items-center gap-1.5"><Tag className="h-3.5 w-3.5" />{hero.category}</span>
                  <span className="inline-flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{fmtDate(hero.activity_date)}</span>
                </div>
                {hero.external_url && (
                  <a
                    href={hero.external_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex w-fit items-center gap-2 rounded-lg bg-[var(--gold)] px-5 py-2.5 text-sm font-bold text-foreground hover:opacity-95 transition shadow-md"
                  >
                    <PlayCircle className="h-4 w-4" /> ভিডিও দেখুন
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* All activities grid */}
      <section className="container-pnc pt-12 md:pt-16">
        <div className="mb-6 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">সাম্প্রতিক কর্মসূচি</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {loading ? "লোড হচ্ছে…" : `${rest.length.toLocaleString("bn-BD")}টি মুহূর্ত — ফিচার্ড অগ্রাধিকারে সাজানো।`}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card overflow-hidden animate-pulse">
                <div className="aspect-[4/5] bg-muted" />
                <div className="p-5 space-y-2">
                  <div className="h-3 w-20 bg-muted rounded" />
                  <div className="h-5 w-3/4 bg-muted rounded" />
                  <div className="h-3 w-full bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : rest.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <Sparkles className="h-8 w-8 mx-auto text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">এখনো কোনো কর্মসূচি প্রকাশিত হয়নি।</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((a) => {
              const hasVideo = a.external_url && /facebook\.com\/.*\/videos|\/v\//.test(a.external_url);
              const fresh = isNew(a.activity_date ?? a.created_at);
              return (
                <article
                  key={a.id}
                  className="group rounded-2xl border border-border bg-card overflow-hidden shadow-card flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-elegant"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-primary-soft/40 to-muted">
                    {a.cover_image_path ? (
                      <img
                        src={publicUrl("gallery", a.cover_image_path)}
                        alt={a.title_bn}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="h-10 w-10 text-primary/40" />
                      </div>
                    )}
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      {a.is_featured && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--gold)] text-foreground px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide shadow-sm">
                          <Star className="h-2.5 w-2.5" /> Featured
                        </span>
                      )}
                      {hasVideo && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-accent text-red-accent-foreground px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide shadow-sm">
                          <PlayCircle className="h-2.5 w-2.5" /> Video
                        </span>
                      )}
                      {fresh && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide shadow-sm">
                          New
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <span className="inline-flex items-center gap-1.5 self-start text-[11px] font-semibold uppercase tracking-wide text-primary bg-primary/10 px-2 py-1 rounded">
                      <Tag className="h-3 w-3" /> {a.category}
                    </span>
                    <h3 className="mt-3 font-bold text-foreground leading-snug line-clamp-2">{a.title_bn}</h3>
                    {a.description_bn && (
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-3 flex-1">{a.description_bn}</p>
                    )}
                    <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {fmtDate(a.activity_date)}</span>
                      {a.location && <span className="inline-flex items-center gap-1 truncate max-w-[40%]"><MapPin className="h-3.5 w-3.5" /> {a.location}</span>}
                    </div>
                    {isSafeUrl(a.external_url) && (
                      <a
                        href={a.external_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition"
                      >
                        বিস্তারিত দেখুন <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Pillars */}
      <section className="container-pnc py-16 md:py-20">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">আমাদের কাজের ক্ষেত্র</h2>
          <p className="text-sm text-muted-foreground mt-1">যে স্তম্ভগুলোর উপর গড়ে উঠেছে পিএনসি-র কার্যক্রম।</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((it) => (
            <article key={it.title} className="card-hover rounded-2xl border border-border bg-card p-5 shadow-card flex flex-col">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <it.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold text-foreground">{it.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground flex-1">{it.text}</p>
              <button
                onClick={() => setActive(it)}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all self-start"
              >
                বিস্তারিত <ArrowRight className="h-4 w-4" />
              </button>
            </article>
          ))}
        </div>

        <div className="mt-14 rounded-2xl border border-border bg-primary-soft/40 p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-foreground">আসন্ন ইভেন্টে যোগ দিন</h3>
            <p className="text-sm text-muted-foreground mt-1.5">আমাদের সভা, কর্মশালা ও কমিউনিটি ইভেন্টের তারিখ ও স্থান দেখুন।</p>
          </div>
          <Link to="/events" className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition shrink-0">
            <Calendar className="h-4 w-4" /> ইভেন্ট ক্যালেন্ডার
          </Link>
        </div>
      </section>

      {active && <DetailsModal item={active} onClose={() => setActive(null)} />}
    </>
  );
}

function DetailsModal({ item, onClose }: { item: Pillar; onClose: () => void }) {
  const Icon = item.icon;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl bg-card p-6 md:p-7 shadow-elegant animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-lg leading-tight">{item.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">পিএনসি কার্যক্রম</p>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="বিস্তারিত বন্ধ করুন" className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
        </div>
        <p className="mt-5 text-sm text-foreground/85 leading-relaxed">{item.details}</p>
        <div className="mt-5">
          <h4 className="text-sm font-semibold text-foreground mb-2.5">প্রধান ক্ষেত্রসমূহ</h4>
          <ul className="grid grid-cols-2 gap-2">
            {item.highlights.map((h) => (
              <li key={h} className="flex items-start gap-1.5 text-sm text-foreground/80">
                <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary shrink-0" /> {h}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
          <Link to="/events" onClick={onClose} className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition">
            <Calendar className="h-4 w-4" /> ইভেন্টে যোগ দিন
          </Link>
          <Link to="/contact" onClick={onClose} className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition">
            যোগাযোগ করুন <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
