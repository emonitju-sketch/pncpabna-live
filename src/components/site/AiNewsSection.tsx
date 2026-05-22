import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Sparkles, Calendar, Tag, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { publicUrl } from "@/hooks/use-auth";

type NewsItem = {
  id: string;
  title_bn: string;
  summary_bn: string | null;
  cover_image_path: string | null;
  category: string;
  published_at: string;
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("bn-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function AiNewsSection() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("news")
        .select("id, title_bn, summary_bn, cover_image_path, category, published_at")
        .eq("is_published", true)
        .not("cover_image_path", "is", null)
        .order("published_at", { ascending: false })
        .limit(5);
      setItems((data as NewsItem[]) || []);
      setLoading(false);
    })();
  }, []);

  if (loading || items.length === 0) return null;

  const [featured, ...rest] = items;

  return (
    <section className="bg-surface border-y border-border">
      <div className="container-pnc py-16 md:py-20">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1.5 rounded-full">
              <Sparkles className="h-3.5 w-3.5" /> AI সংবাদ ধারণা
            </span>
            <h2 className="mt-3 text-2xl md:text-3xl font-bold text-foreground">
              পিএনসি-র সাম্প্রতিক সংবাদ
            </h2>
            <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl">
              নির্বাচন, নাগরিক উদ্যোগ ও উন্নয়ন — ছবি থেকে অনুপ্রাণিত হয়ে AI-সহায়তায় প্রস্তুতকৃত বাংলা সংবাদ।
            </p>
          </div>
          <Link
            to="/news"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all"
          >
            সব সংবাদ দেখুন <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {/* Featured large card */}
          <article className="lg:col-span-2 card-hover group rounded-2xl border border-border bg-card overflow-hidden shadow-card flex flex-col md:flex-row">
            {featured.cover_image_path && (
              <div className="md:w-1/2 aspect-[16/10] md:aspect-auto overflow-hidden bg-muted">
                <img
                  src={publicUrl("gallery", featured.cover_image_path)}
                  alt={featured.title_bn}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            )}
            <div className="p-6 md:p-7 flex flex-col flex-1">
              <div className="flex items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1 text-red-accent bg-red-accent/10 px-2 py-1 rounded font-semibold uppercase tracking-wide">
                  <Tag className="h-3 w-3" /> {featured.category}
                </span>
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-3 w-3" /> {fmtDate(featured.published_at)}
                </span>
              </div>
              <h3 className="mt-3 text-xl md:text-2xl font-bold text-foreground leading-snug">
                {featured.title_bn}
              </h3>
              {featured.summary_bn && (
                <p className="mt-3 text-sm md:text-base text-muted-foreground line-clamp-4 flex-1">
                  {featured.summary_bn}
                </p>
              )}
              <Link
                to="/news"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all self-start"
              >
                বিস্তারিত পড়ুন <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </article>

          {/* Side stack */}
          <div className="grid gap-5">
            {rest.slice(0, 2).map((n) => (
              <article
                key={n.id}
                className="card-hover group rounded-2xl border border-border bg-card overflow-hidden shadow-card flex"
              >
                {n.cover_image_path && (
                  <div className="w-28 sm:w-36 shrink-0 overflow-hidden bg-muted">
                    <img
                      src={publicUrl("gallery", n.cover_image_path)}
                      alt={n.title_bn}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-4 flex flex-col flex-1 min-w-0">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-red-accent">
                    {n.category}
                  </span>
                  <h3 className="mt-1.5 font-semibold text-sm text-foreground leading-snug line-clamp-3">
                    {n.title_bn}
                  </h3>
                  <span className="mt-auto pt-2 text-[11px] text-muted-foreground inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {fmtDate(n.published_at)}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Bottom row — remaining 2 */}
        {rest.length > 2 && (
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {rest.slice(2, 4).map((n) => (
              <article
                key={n.id}
                className="card-hover group rounded-2xl border border-border bg-card overflow-hidden shadow-card flex"
              >
                {n.cover_image_path && (
                  <div className="w-32 shrink-0 overflow-hidden bg-muted">
                    <img
                      src={publicUrl("gallery", n.cover_image_path)}
                      alt={n.title_bn}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-4 flex flex-col flex-1 min-w-0">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-red-accent">
                    {n.category}
                  </span>
                  <h3 className="mt-1.5 font-semibold text-sm text-foreground leading-snug line-clamp-3">
                    {n.title_bn}
                  </h3>
                  {n.summary_bn && (
                    <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">
                      {n.summary_bn}
                    </p>
                  )}
                  <span className="mt-auto pt-2 text-[11px] text-muted-foreground inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {fmtDate(n.published_at)}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
