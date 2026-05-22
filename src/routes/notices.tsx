import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useCallback } from "react";
import { PageHeader } from "@/components/site/PageHeader";
import {
  Calendar as CalendarIcon,
  FileText,
  X,
  ExternalLink,
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowDown,
  ArrowUp,
} from "lucide-react";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { format, isValid, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const noticeSearchSchema = z.object({
  page: fallback(z.number().int().min(1), 1).default(1),
  category: fallback(z.string(), "সব").default("সব"),
  query: fallback(z.string(), "").default(""),
  sort: fallback(z.enum(["newest", "oldest"]), "newest").default("newest"),
  dateFrom: z.string().optional().catch(undefined),
  dateTo: z.string().optional().catch(undefined),
});

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
  validateSearch: zodValidator(noticeSearchSchema),
  component: NoticesPage,
});

type Notice = {
  id: string;
  title: string;
  summary: string;
  date: string;
  sortDate: string; // ISO YYYY-MM-DD for sorting / filtering
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
    sortDate: "2026-04-05",
    category: "ঘোষণা",
    image: "/notices/notice-co-chairman-charge.jpeg",
  },
  {
    id: "congratulations",
    title: "অভিনন্দন ও শুভেচ্ছা — জনাব মোঃ জহুরুল ইসলাম বিশু",
    summary:
      "জেলা পরিষদের পূর্ণকালীন প্রশাসক হিসেবে নিয়োগপ্রাপ্ত হওয়ায় কো-চেয়ারম্যান বীর মুক্তিযোদ্ধা জনাব মোঃ জহুরুল ইসলাম বিশুকে পাবনা নাগরিক কমিটির পক্ষ থেকে আন্তরিক অভিনন্দন।",
    date: "এপ্রিল ২০২৬",
    sortDate: "2026-04-01",
    category: "ঘোষণা",
    image: "/notices/notice-congratulations.jpeg",
  },
  {
    id: "election-subcommittee",
    title: "নির্বাচনী প্রচারণা উপ-কমিটি — পাবনা-৫ আসন",
    summary:
      "ত্রয়োদশ জাতীয় সংসদ নির্বাচনে পাবনা-৫ (সদর) আসনের জন্য পিএনসি নির্বাচনী প্রচারণা উপ-কমিটি গঠন করা হয়েছে। আহ্বায়কসহ ১৩ সদস্যের কমিটি অনুমোদিত।",
    date: "২০২৬",
    sortDate: "2026-01-01",
    category: "কমিটি",
    image: "/notices/notice-election-subcommittee.jpeg",
  },
  {
    id: "citizen-assembly",
    title: "নাগরিক সুধী সমাবেশ ও আলোচনা সভা",
    summary:
      "পাবনা-৫ (সদর) আসনে অ্যাডভোকেট শামছুর রহমান শিমুল বিশ্বাসের প্রতি সমর্থন প্রসঙ্গে নাগরিক ভাবনা নিয়ে আলোচনা। ৪ ফেব্রুয়ারি ২০২৬, সন্ধ্যা ৬:৩০, বনমালী ইনস্টিটিউট, পাবনা।",
    date: "০৪ ফেব্রুয়ারি ২০২৬",
    sortDate: "2026-02-04",
    category: "সভা",
    image: "/notices/notice-citizen-assembly.jpeg",
  },
];

const CATEGORIES = ["সব", "ঘোষণা", "নোটিশ", "সভা", "কমিটি"] as const;
type CategoryFilter = (typeof CATEGORIES)[number];

const PAGE_SIZE = 6;

function NoticesPage() {
  const navigate = Route.useNavigate();
  const search = Route.useSearch();

  const page = search.page ?? 1;
  const category = (search.category as CategoryFilter) ?? "সব";
  const query = search.query ?? "";
  const sort = search.sort ?? "newest";
  const dateFrom = search.dateFrom;
  const dateTo = search.dateTo;

  const [open, setOpen] = useState<Notice | null>(null);

  const updateSearch = useCallback(
    (patch: Partial<z.infer<typeof noticeSearchSchema>>) => {
      navigate({
        search: (prev: z.infer<typeof noticeSearchSchema>) => ({ ...prev, ...patch }),
      });
    },
    [navigate]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let result = notices.filter((n) => {
      const catMatch = category === "সব" || n.category === category;
      if (!catMatch) return false;
      if (!q) return true;
      return (
        n.title.toLowerCase().includes(q) ||
        n.summary.toLowerCase().includes(q) ||
        n.date.toLowerCase().includes(q)
      );
    });

    // date range
    if (dateFrom) {
      const from = parseISO(dateFrom);
      if (isValid(from)) {
        result = result.filter((n) => n.sortDate >= dateFrom);
      }
    }
    if (dateTo) {
      const to = parseISO(dateTo);
      if (isValid(to)) {
        result = result.filter((n) => n.sortDate <= dateTo);
      }
    }

    // sort
    result.sort((a, b) => {
      const cmp = a.sortDate.localeCompare(b.sortDate);
      return sort === "newest" ? -cmp : cmp;
    });

    return result;
  }, [query, category, sort, dateFrom, dateTo]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const hasActiveFilters =
    query || category !== "সব" || sort !== "newest" || dateFrom || dateTo;

  const dateFromObj = dateFrom ? parseISO(dateFrom) : undefined;
  const dateToObj = dateTo ? parseISO(dateTo) : undefined;

  return (
    <>
      <PageHeader
        eyebrow="অফিসিয়াল"
        title="নোটিশ ও ঘোষণা"
        description="পাবনা নাগরিক কমিটির সাম্প্রতিক অফিসিয়াল নোটিশ — সংক্ষেপে পড়ুন, প্রয়োজনে মূল নোটিশ দেখুন।"
      />

      <section className="container-pnc py-12">
        {/* Search + filters */}
        <div className="mb-8 flex flex-col gap-4">
          <label className="relative block">
            <span className="sr-only">নোটিশ খুঁজুন</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => updateSearch({ query: e.target.value, page: 1 })}
              placeholder="শিরোনাম, বিষয় বা তারিখ দিয়ে খুঁজুন…"
              className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-2.5 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => {
              const active = c === category;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => updateSearch({ category: c, page: 1 })}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-xs font-medium transition",
                    active
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  )}
                  aria-pressed={active}
                >
                  {c}
                </button>
              );
            })}
          </div>

          {/* Sort + date range row */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Sort toggle */}
            <button
              type="button"
              onClick={() =>
                updateSearch({ sort: sort === "newest" ? "oldest" : "newest" })
              }
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition",
                "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
              )}
              aria-label="সর্ট পরিবর্তন"
            >
              {sort === "newest" ? (
                <>
                  <ArrowDown className="h-3.5 w-3.5" />
                  নতুন → পুরাতন
                </>
              ) : (
                <>
                  <ArrowUp className="h-3.5 w-3.5" />
                  পুরাতন → নতুন
                </>
              )}
            </button>

            {/* Date from */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-9 gap-1.5 rounded-lg text-xs font-normal",
                    !dateFrom && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="h-3.5 w-3.5" />
                  {dateFromObj && isValid(dateFromObj)
                    ? format(dateFromObj, "dd MMM yyyy")
                    : "শুরুর তারিখ"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateFromObj && isValid(dateFromObj) ? dateFromObj : undefined}
                  onSelect={(d) =>
                    updateSearch({
                      dateFrom: d ? format(d, "yyyy-MM-dd") : undefined,
                      page: 1,
                    })
                  }
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>

            {/* Date to */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-9 gap-1.5 rounded-lg text-xs font-normal",
                    !dateTo && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="h-3.5 w-3.5" />
                  {dateToObj && isValid(dateToObj)
                    ? format(dateToObj, "dd MMM yyyy")
                    : "শেষ তারিখ"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateToObj && isValid(dateToObj) ? dateToObj : undefined}
                  onSelect={(d) =>
                    updateSearch({
                      dateTo: d ? format(d, "yyyy-MM-dd") : undefined,
                      page: 1,
                    })
                  }
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>

            {/* Reset */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={() =>
                  updateSearch({
                    query: "",
                    category: "সব",
                    sort: "newest",
                    dateFrom: undefined,
                    dateTo: undefined,
                    page: 1,
                  })
                }
                className="text-xs text-primary hover:underline"
              >
                ফিল্টার রিসেট করুন
              </button>
            )}
          </div>

          <div className="text-xs text-muted-foreground">
            {filtered.length.toLocaleString("bn-BD")} টি নোটিশ পাওয়া গেছে
            {totalPages > 1 && ` · পৃষ্ঠা ${safePage.toLocaleString("bn-BD")} / ${totalPages.toLocaleString("bn-BD")}`}
          </div>
        </div>

        {paginated.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center">
            <p className="text-sm text-muted-foreground">
              কোনো নোটিশ পাওয়া যায়নি। অন্য কিছু খুঁজে দেখুন বা ফিল্টার রিসেট করুন।
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {paginated.map((n) => (
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
                    <CalendarIcon className="h-3 w-3" />
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => updateSearch({ page: safePage - 1 })}
              className={cn(
                "inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-xs font-medium transition",
                safePage <= 1
                  ? "border-border/50 bg-muted/50 text-muted-foreground cursor-not-allowed"
                  : "border-border bg-card text-foreground hover:border-primary/40"
              )}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              আগের পৃষ্ঠা
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => updateSearch({ page: p })}
                  className={cn(
                    "h-8 w-8 rounded-lg text-xs font-medium transition",
                    p === safePage
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                  aria-current={p === safePage ? "page" : undefined}
                >
                  {p.toLocaleString("bn-BD")}
                </button>
              ))}
            </div>

            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => updateSearch({ page: safePage + 1 })}
              className={cn(
                "inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-xs font-medium transition",
                safePage >= totalPages
                  ? "border-border/50 bg-muted/50 text-muted-foreground cursor-not-allowed"
                  : "border-border bg-card text-foreground hover:border-primary/40"
              )}
            >
              পরের পৃষ্ঠা
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
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
