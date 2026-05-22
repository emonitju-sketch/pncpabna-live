import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/site/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import { publicUrl } from "@/hooks/use-auth";
import {
  Megaphone, MessageSquare, GraduationCap, HeartHandshake,
  Users, Vote, Building2, Sparkles, ArrowRight, X, CheckCircle2, Calendar, MapPin, Tag,
} from "lucide-react";

export const Route = createFileRoute("/activities")({
  head: () => ({
    meta: [
      { title: "আমাদের কার্যক্রম — পাবনা নাগরিক কমিটি" },
      { name: "description", content: "সামাজিক সচেতনতা, নাগরিক সংলাপ, যুব নেতৃত্ব, মানবিক সহায়তা — পিএনসি-র বিভিন্ন কার্যক্রম ও প্রকল্প।" },
      { property: "og:title", content: "আমাদের কার্যক্রম — পিএনসি" },
      { property: "og:description", content: "পাবনার জন্য নাগরিক উদ্যোগ ও কর্মসূচি।" },
    ],
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
};

type Pillar = {
  icon: typeof Megaphone;
  title: string;
  text: string;
  details: string;
  highlights: string[];
};

const pillars: Pillar[] = [
  { icon: Megaphone, title: "সামাজিক সচেতনতা ক্যাম্পেইন", text: "জনস্বাস্থ্য, পরিবেশ, শিক্ষা ও নাগরিক দায়িত্ব নিয়ে সচেতনতা।", details: "পাবনার বিভিন্ন এলাকায় নিয়মিত সচেতনতামূলক ক্যাম্পেইন — ডেঙ্গু প্রতিরোধ, পরিবেশ সংরক্ষণ, মাদকবিরোধী সচেতনতা, সড়ক নিরাপত্তা।", highlights: ["জনস্বাস্থ্য", "পরিবেশ", "মাদকবিরোধী", "সড়ক নিরাপত্তা"] },
  { icon: MessageSquare, title: "নাগরিক সংলাপ", text: "পাবনার সমস্যা নিয়ে সংলাপ ও সমাধান অনুসন্ধান।", details: "নিয়মিত মতবিনিময় সভায় স্থানীয় সমস্যা চিহ্নিত করে যৌথ সমাধান এবং প্রশাসনিক সমন্বয়।", highlights: ["মাসিক সংলাপ", "সমস্যা চিহ্নিতকরণ", "প্রশাসনিক সমন্বয়", "নীতি-প্রস্তাবনা"] },
  { icon: GraduationCap, title: "যুব নেতৃত্ব", text: "তরুণদের নেতৃত্ব ও দক্ষতা উন্নয়ন।", details: "তরুণ প্রজন্মের জন্য নেতৃত্ব প্রশিক্ষণ, কর্মশালা ও ভলান্টিয়ার প্রোগ্রাম।", highlights: ["ওয়ার্কশপ", "ভলান্টিয়ার", "ক্যারিয়ার গাইডেন্স", "যুব বিতর্ক"] },
  { icon: HeartHandshake, title: "মানবিক সহায়তা", text: "দুর্যোগে অসহায় মানুষের পাশে।", details: "বন্যা, শৈত্যপ্রবাহ বা জরুরি পরিস্থিতিতে দ্রুত মানবিক সহায়তা — খাদ্য, কম্বল, ওষুধ।", highlights: ["দুর্যোগ ত্রাণ", "শীতবস্ত্র", "চিকিৎসা সহায়তা", "পুনর্বাসন"] },
  { icon: Users, title: "জনস্বার্থ", text: "নাগরিক অধিকার ও সেবা সুনিশ্চিতকরণ।", details: "নাগরিক সেবা সহজীকরণ, তথ্য অধিকার চর্চা ও স্থানীয় সরকারের সেবার মান নিরীক্ষা।", highlights: ["তথ্য অধিকার", "সেবা মূল্যায়ন", "জনগণের কণ্ঠ", "স্বচ্ছতা"] },
  { icon: Vote, title: "নাগরিক মতামত", text: "জনস্বার্থে দাবি কর্তৃপক্ষের কাছে।", details: "জনমত জরিপ, স্বাক্ষর সংগ্রহ ও স্মারকলিপির মাধ্যমে দাবি পৌঁছানো।", highlights: ["জনমত জরিপ", "স্মারকলিপি", "অ্যাডভোকেসি", "কর্তৃপক্ষ"] },
  { icon: Building2, title: "কমিউনিটি উদ্যোগ", text: "এলাকাভিত্তিক সামাজিক প্রকল্প।", details: "পরিচ্ছন্নতা অভিযান, বৃক্ষরোপণ, রক্তদান ক্যাম্প — মহল্লাভিত্তিক উদ্যোগ।", highlights: ["পরিচ্ছন্নতা", "বৃক্ষরোপণ", "রক্তদান", "মহল্লা উন্নয়ন"] },
  { icon: Sparkles, title: "পাবনার ব্র্যান্ডিং", text: "পাবনার সম্ভাবনা দেশ-বিদেশে।", details: "পাবনার সংস্কৃতি, ঐতিহ্য ও ব্যক্তিত্ব আধুনিক মাধ্যমে তুলে ধরা।", highlights: ["সাংস্কৃতিক উৎসব", "ঐতিহ্য", "ডিজিটাল প্রচার", "আন্তঃজেলা"] },
];

function fmtDate(iso: string | null) {
  if (!iso) return "তারিখ অনির্ধারিত";
  return new Date(iso).toLocaleDateString("bn-BD", { day: "numeric", month: "long", year: "numeric" });
}

function ActivitiesPage() {
  const [active, setActive] = useState<Pillar | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("সকল");

  useEffect(() => {
    (async () => {
      const { data } = await (supabase as any)
        .from("activities")
        .select("id, title_bn, description_bn, activity_date, location, category, cover_image_path")
        .eq("is_published", true)
        .order("activity_date", { ascending: false, nullsFirst: false })
        .limit(60);
      setActivities((data as Activity[]) || []);
      setLoading(false);
    })();
  }, []);

  const categories = useMemo(
    () => ["সকল", ...Array.from(new Set(activities.map((a) => a.category)))],
    [activities]
  );
  const filtered = filter === "সকল" ? activities : activities.filter((a) => a.category === filter);

  return (
    <>
      <PageHeader
        eyebrow="কার্যক্রম ও প্রকল্প"
        title="পাবনার জন্য আমাদের নিরন্তর উদ্যোগ"
        description="সামাজিক সচেতনতা থেকে মানবিক সহায়তা — পিএনসি-র প্রতিটি কর্মসূচি পাবনার মানুষের কল্যাণে নিবেদিত।"
      />

      {/* Live activities */}
      <section className="container-pnc pt-12 md:pt-16">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">সাম্প্রতিক কর্মসূচি</h2>
            <p className="text-sm text-muted-foreground mt-1">তারিখ, স্থান ও ছবিসহ পিএনসি-র প্রকল্পসমূহ।</p>
          </div>
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition border ${
                    filter === c
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-muted-foreground border-border hover:border-primary hover:text-primary"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        {loading ? (
          <p className="text-muted-foreground">লোড হচ্ছে...</p>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <Sparkles className="h-8 w-8 mx-auto text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">
              এখনো কোনো কর্মসূচি প্রকাশিত হয়নি। AI স্টুডিও থেকে ছবি ও caption দিয়ে যোগ করুন।
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((a) => (
              <article key={a.id} className="card-hover group rounded-2xl border border-border bg-card overflow-hidden shadow-card flex flex-col">
                {a.cover_image_path ? (
                  <div className="aspect-[16/10] overflow-hidden bg-muted">
                    <img
                      src={publicUrl("gallery", a.cover_image_path)}
                      alt={a.title_bn}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="aspect-[16/10] bg-gradient-to-br from-primary-soft to-primary/10 flex items-center justify-center">
                    <Sparkles className="h-10 w-10 text-primary/40" />
                  </div>
                )}
                <div className="p-5 flex flex-col flex-1">
                  <span className="inline-flex items-center gap-1.5 self-start text-[11px] font-semibold uppercase tracking-wide text-red-accent bg-red-accent/10 px-2 py-1 rounded">
                    <Tag className="h-3 w-3" /> {a.category}
                  </span>
                  <h3 className="mt-3 font-bold text-foreground leading-snug">{a.title_bn}</h3>
                  {a.description_bn && (
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-3 flex-1">{a.description_bn}</p>
                  )}
                  <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {fmtDate(a.activity_date)}</span>
                    {a.location && <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {a.location}</span>}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Pillars */}
      <section className="container-pnc py-16 md:py-20">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">আমাদের কাজের ক্ষেত্র</h2>
          <p className="text-sm text-muted-foreground mt-1">যে আটটি স্তম্ভের উপর গড়ে উঠেছে পিএনসি-র কার্যক্রম।</p>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl bg-card p-6 md:p-7 shadow-elegant" onClick={(e) => e.stopPropagation()}>
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
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
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
