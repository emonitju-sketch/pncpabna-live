import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, useCallback } from "react";
import { PageHeader } from "@/components/site/PageHeader";
import {
  Calendar as CalendarIcon,
  FileText,
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowDown,
  ArrowUp,
  ArrowRight,
} from "lucide-react";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { format, isValid, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { publicUrl } from "@/hooks/use-auth";

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
      { title: "নোটিশ বোর্ড — পাবনা নাগরিক কমিটি" },
      { name: "description", content: "পাবনা নাগরিক কমিটি (পিএনসি)-এর অফিসিয়াল নোটিশ, প্রেস বিজ্ঞপ্তি ও ঘোষণাসমূহ — তারিখ অনুসারে সাজানো নোটিশ বোর্ড।" },
      { property: "og:title", content: "নোটিশ বোর্ড — পিএনসি" },
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
  slug: string | null;
  title_bn: string;
  body_bn: string | null;
  category: string;
  priority: number;
  starts_at: string;
  cover_image_path: string | null;
};

const CATEGORIES = ["সব", "ঘোষণা", "নোটিশ", "সভা"] as const;
const PAGE_SIZE = 6;

const bnDate = (iso: string) =>
  new Date(iso).toLocaleDateString("bn-BD", { day: "numeric", month: "long", year: "numeric" });

function NoticesPage() {
  const navigate = Route.useNavigate();
  const search = Route.useSearch();

  const page = search.page ?? 1;
  const category = search.category ?? "সব";
  const query = search.query ?? "";
  const sort = search.sort ?? "newest";
  const dateFrom = search.dateFrom;
  const dateTo = search.dateTo;

  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await (supabase as any)
        .from("notices")
        .select("id, slug, title_bn, body_bn, category, priority, starts_at, cover_image_path")
        .eq("is_active", true)
        .order("starts_at", { ascending: false });
      setNotices((data as Notice[]) || []);
      setLoading(false);
    })();
  }, []);

  const updateSearch = useCallback(
    (patch: Partial<z.infer<typeof noticeSearchSchema>>) => {
      navigate({ search: (prev: z.infer<typeof noticeSearchSchema>) => ({ ...prev, ...patch }) });
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
        n.title_bn.toLowerCase().includes(q) ||
        (n.body_bn ?? "").toLowerCase().includes(q)
      );
    });
    const isoOf = (n: Notice) => n.starts_at.slice(0, 10);
    if (dateFrom && isValid(parseISO(dateFrom))) result = result.filter((n) => isoOf(n) >= dateFrom);
    if (dateTo && isValid(parseISO(dateTo))) result = result.filter((n) => isoOf(n) <= dateTo);
    result.sort((a, b) => {
      const cmp = a.starts_at.localeCompare(b.starts_at);
      return sort === "newest" ? -cmp : cmp;
    });
    return result;
  }, [notices, query, category, sort, dateFrom, dateTo]);

  const hasActiveFilters = query || category !== "সব" || sort !== "newest" || dateFrom || dateTo;

  // Featured = highest priority notice (only show when no active filters & first page)
  const featured = !hasActiveFilters && safePageOnly1(page) ? notices.slice().sort((a, b) => b.priority - a.priority || b.starts_at.localeCompare(a.starts_at))[0] : null;
  const visibleList = featured ? filtered.filter((n) => n.id !== featured.id) : filtered;
  const totalPages = Math.max(1, Math.ceil(visibleList.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = visibleList.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const dateFromObj = dateFrom ? parseISO(dateFrom) : undefined;
  const dateToObj = dateTo ? parseISO(dateTo) : undefined;

  return (
    <>
      <PageHeader
        eyebrow="অফিসিয়াল"
        title="নোটিশ বোর্ড"
        description="পাবনা নাগরিক কমিটির সাম্প্রতিক অফিসিয়াল নোটিশ, প্রেস বিজ্ঞপ্তি ও ঘোষণা — তারিখ অনুসারে সাজানো।"
      />

      <section className="container-pnc py-12">
        {/* Filter Panel */}
        <div className="mb-8 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex flex-col gap-5">
            {/* Top row: search + count */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
              <label className="relative block flex-1 max-w-xl">
                <span className="sr-only">নোটিশ খুঁজুন</span>
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => updateSearch({ query: e.target.value, page: 1 })}
                  placeholder="শিরোনাম বা বিষয় দিয়ে খুঁজুন…"
                  className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </label>
              <div className="shrink-0 text-sm text-muted-foreground">
                {loading ? "লোড হচ্ছে…" : (
                  <span className="inline-flex items-center gap-1.5">
                    <span className="inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-primary/10 px-2 text-xs font-semibold text-primary">
                      {filtered.length.toLocaleString("bn-BD")}
                    </span>
                    টি নোটিশ
                  </span>
                )}
              </div>
            </div>

            {/* Category chips */}
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">বিভাগ</p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => {
                  const active = c === category;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => updateSearch({ category: c, page: 1 })}
                      className={cn(
                        "rounded-full border px-4 py-1.5 text-sm font-medium transition",
                        active
                          ? "border-primary bg-primary text-primary-foreground shadow-sm"
                          : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      )}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date range + sort + reset */}
            <div className="flex flex-wrap items-end gap-3">
              <div className="flex flex-col gap-1">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">শুরুর তারিখ</p>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className={cn("h-9 gap-1.5 rounded-lg text-xs font-normal", !dateFrom && "text-muted-foreground")}>
                      <CalendarIcon className="h-3.5 w-3.5" />
                      {dateFromObj && isValid(dateFromObj) ? format(dateFromObj, "dd MMM yyyy") : "সিলেক্ট করুন"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={dateFromObj} onSelect={(d) => updateSearch({ dateFrom: d ? format(d, "yyyy-MM-dd") : undefined, page: 1 })} initialFocus className="p-3 pointer-events-auto" />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">শেষ তারিখ</p>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className={cn("h-9 gap-1.5 rounded-lg text-xs font-normal", !dateTo && "text-muted-foreground")}>
                      <CalendarIcon className="h-3.5 w-3.5" />
                      {dateToObj && isValid(dateToObj) ? format(dateToObj, "dd MMM yyyy") : "সিলেক্ট করুন"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={dateToObj} onSelect={(d) => updateSearch({ dateTo: d ? format(d, "yyyy-MM-dd") : undefined, page: 1 })} initialFocus className="p-3 pointer-events-auto" />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">সাজানো</p>
                <button
                  type="button"
                  onClick={() => updateSearch({ sort: sort === "newest" ? "oldest" : "newest" })}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-xs font-medium text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
                >
                  {sort === "newest" ? (
                    <><ArrowDown className="h-3.5 w-3.5" />নতুন → পুরাতন</>
                  ) : (
                    <><ArrowUp className="h-3.5 w-3.5" />পুরাতন → নতুন</>
                  )}
                </button>
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={() => updateSearch({ query: "", category: "সব", sort: "newest", dateFrom: undefined, dateTo: undefined, page: 1 })}
                  className="mb-0.5 text-xs text-destructive hover:underline"
                >
                  ফিল্টার রিসেট
                </button>
              )}
            </div>
          </div>
        </div>

        {loading ? null : paginated.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center">
            <p className="text-sm text-muted-foreground">কোনো নোটিশ পাওয়া যায়নি।</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {paginated.map((n, idx) => {
              const serial = (safePage - 1) * PAGE_SIZE + idx + 1;
              const detailTo = n.slug ? `/notices/${n.slug}` : `/notices/${n.id}`;
              return (
                <article key={n.id} className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  {n.cover_image_path && (
                    <Link to={detailTo} className="relative block aspect-[3/4] overflow-hidden bg-gradient-to-br from-primary-soft/40 to-muted">
                      <img
                        src={publicUrl("gallery", n.cover_image_path)}
                        alt={n.title_bn}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </Link>
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 font-medium text-primary">
                        <FileText className="h-3 w-3" />{n.category}
                      </span>
                      <span className="text-muted-foreground">#{serial.toLocaleString("bn-BD")}</span>
                    </div>
                    <h2 className="mt-3 text-base font-semibold leading-snug line-clamp-2">{n.title_bn}</h2>
                    <p className="mt-1.5 inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <CalendarIcon className="h-3 w-3" />{bnDate(n.starts_at)}
                    </p>
                    {n.body_bn && (
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-3">{n.body_bn}</p>
                    )}
                    <Link
                      to={detailTo}
                      className="mt-4 inline-flex items-center gap-1.5 self-start rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                    >
                      বিস্তারিত দেখুন <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => updateSearch({ page: safePage - 1 })}
              className={cn(
                "inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-xs font-medium transition",
                safePage <= 1 ? "border-border/50 bg-muted/50 text-muted-foreground cursor-not-allowed" : "border-border bg-card text-foreground hover:border-primary/40"
              )}
            >
              <ChevronLeft className="h-3.5 w-3.5" />আগের
            </button>
            <span className="text-xs text-muted-foreground px-2">{safePage.toLocaleString("bn-BD")} / {totalPages.toLocaleString("bn-BD")}</span>
            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => updateSearch({ page: safePage + 1 })}
              className={cn(
                "inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-xs font-medium transition",
                safePage >= totalPages ? "border-border/50 bg-muted/50 text-muted-foreground cursor-not-allowed" : "border-border bg-card text-foreground hover:border-primary/40"
              )}
            >
              পরের<ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </section>
    </>
  );
}
