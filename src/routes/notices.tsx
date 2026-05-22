import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/site/PageHeader";
import { Calendar, FileText, X, ExternalLink, Search } from "lucide-react";


export const Route = createFileRoute("/notices")({
  head: () => ({
    meta: [
      { title: "নোটিশ — পাবনা নাগরিক কমিটি" },
      { name: "description", content: "পাবনা নাগরিক কমিটি (পিএনসি)-এর অফিসিয়াল নোটিশ ও ঘোষণা।" },
      { property: "og:title", content: "নোটিশ — পিএনসি" },
      { property: "og:description", content: "পিএনসি-এর সাম্প্রতিক অফিসিয়াল নোটিশ ও ঘোষণাসমূহ।" },
      { property: "og:url", content: "https://pncpab.lovable.app/notices" },
    ],
    links: [{ rel: "canonical", href: "https://pncpab.lovable.app/notices" }],
  }),
  component: NoticesPage,
});

type Notice = {
  id: string;
  title: string;
  summary: string;
  date: string;
  category: "ঘোষণা" | "নোটিশ" | "সভা" | "কমিটি";
  image: string;
};

const notices: Notice[] = [
  {
    id: "co-chairman-charge",
    title: "কো-চেয়ারম্যানের দায়িত্বভার গ্রহণ অনুষ্ঠান",
    summary:
      "কো-চেয়ারম্যান ও বীর মুক্তিযোদ্ধা আলহাজ মোঃ জহুরুল ইসলাম বিশু আগামী ০৫ এপ্রিল ২০২৬, রবিবার দুপুর ১২টায় পাবনা জেলা পরিষদ কার্যালয়ে দায়িত্বভার গ্রহণ করবেন। সকল সদস্য ও শুভানুধ্যায়ীর উপস্থিতি কাম্য।",
    date: "০৫ এপ্রিল ২০২৬",
    category: "ঘোষণা",
    image: "/notices/notice-co-chairman-charge.jpeg",
  },
  {
    id: "congratulations",
    title: "অভিনন্দন ও শুভেচ্ছা — জনাব মোঃ জহুরুল ইসলাম বিশু",
    summary:
      "জেলা পরিষদের পূর্ণকালীন প্রশাসক হিসেবে নিয়োগপ্রাপ্ত হওয়ায় কো-চেয়ারম্যান বীর মুক্তিযোদ্ধা জনাব মোঃ জহুরুল ইসলাম বিশুকে পাবনা নাগরিক কমিটির পক্ষ থেকে আন্তরিক অভিনন্দন।",
    date: "এপ্রিল ২০২৬",
    category: "ঘোষণা",
    image: "/notices/notice-congratulations.jpeg",
  },
  {
    id: "election-subcommittee",
    title: "নির্বাচনী প্রচারণা উপ-কমিটি — পাবনা-৫ আসন",
    summary:
      "ত্রয়োদশ জাতীয় সংসদ নির্বাচনে পাবনা-৫ (সদর) আসনের জন্য পিএনসি নির্বাচনী প্রচারণা উপ-কমিটি গঠন করা হয়েছে। আহ্বায়কসহ ১৩ সদস্যের কমিটি অনুমোদিত।",
    date: "২০২৬",
    category: "কমিটি",
    image: "/notices/notice-election-subcommittee.jpeg",
  },
  {
    id: "citizen-assembly",
    title: "নাগরিক সুধী সমাবেশ ও আলোচনা সভা",
    summary:
      "পাবনা-৫ (সদর) আসনে অ্যাডভোকেট শামছুর রহমান শিমুল বিশ্বাসের প্রতি সমর্থন প্রসঙ্গে নাগরিক ভাবনা নিয়ে আলোচনা। ৪ ফেব্রুয়ারি ২০২৬, সন্ধ্যা ৬:৩০, বনমালী ইনস্টিটিউট, পাবনা।",
    date: "০৪ ফেব্রুয়ারি ২০২৬",
    category: "সভা",
    image: "/notices/notice-citizen-assembly.jpeg",
  },
];

const CATEGORIES = ["সব", "ঘোষণা", "নোটিশ", "সভা", "কমিটি"] as const;
type CategoryFilter = (typeof CATEGORIES)[number];

function NoticesPage() {
  const [open, setOpen] = useState<Notice | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("সব");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return notices.filter((n) => {
      const catMatch = category === "সব" || n.category === category;
      if (!catMatch) return false;
      if (!q) return true;
      return (
        n.title.toLowerCase().includes(q) ||
        n.summary.toLowerCase().includes(q) ||
        n.date.toLowerCase().includes(q)
      );
    });
  }, [query, category]);

  return (
    <>

      <PageHeader
        eyebrow="অফিসিয়াল"
        title="নোটিশ ও ঘোষণা"
        description="পাবনা নাগরিক কমিটির সাম্প্রতিক অফিসিয়াল নোটিশ — সংক্ষেপে পড়ুন, প্রয়োজনে মূল নোটিশ দেখুন।"
      />

      <section className="container-pnc py-12">
        {/* Search + category filters */}
        <div className="mb-8 flex flex-col gap-4">
          <label className="relative block">
            <span className="sr-only">নোটিশ খুঁজুন</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="শিরোনাম, বিষয় বা তারিখ দিয়ে খুঁজুন…"
              className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-2.5 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => {
              const active = c === category;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={
                    "rounded-full border px-3.5 py-1.5 text-xs font-medium transition " +
                    (active
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground")
                  }
                  aria-pressed={active}
                >
                  {c}
                </button>
              );
            })}
          </div>

          <div className="text-xs text-muted-foreground">
            {filtered.length.toLocaleString("bn-BD")} টি নোটিশ পাওয়া গেছে
            {(query || category !== "সব") && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setCategory("সব");
                }}
                className="ml-2 text-primary hover:underline"
              >
                ফিল্টার রিসেট করুন
              </button>
            )}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center">
            <p className="text-sm text-muted-foreground">
              কোনো নোটিশ পাওয়া যায়নি। অন্য কিছু খুঁজে দেখুন বা ফিল্টার রিসেট করুন।
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {filtered.map((n) => (
              <article
                key={n.id}
                className="group flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 font-medium text-primary">
                    <FileText className="h-3 w-3" />
                    {n.category}
                  </span>
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {n.date}
                  </span>
                </div>

                <h2 className="mt-3 text-lg font-semibold leading-snug">{n.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-4">
                  {n.summary}
                </p>

                <div className="mt-5 flex items-center gap-3">
                  <button
                    onClick={() => setOpen(n)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                  >
                    মূল নোটিশ দেখুন
                    <ExternalLink className="h-3.5 w-3.5" />
                  </button>
                  <a
                    href={n.image}
                    download
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    ডাউনলোড
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}

        <p className="mt-10 text-center text-xs text-muted-foreground">
          যোগাযোগ: pnc.pabna@outlook.com · +৮৮০ ১৭১৬-৮০৮০৭৪
        </p>
      </section>


      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setOpen(null)}
        >
          <button
            onClick={() => setOpen(null)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label="বন্ধ করুন"
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src={open.image}
            alt={open.title}
            className="max-h-[90vh] max-w-full rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
