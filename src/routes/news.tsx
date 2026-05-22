import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/site/PageHeader";
import { Calendar, Tag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { publicUrl } from "@/hooks/use-auth";

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: "সংবাদ ও আপডেট — পাবনা নাগরিক কমিটি" },
      { name: "description", content: "পিএনসি-র সাম্প্রতিক সংবাদ, কার্যক্রমের আপডেট, অভিনন্দন ও সামাজিক উদ্যোগের খবর।" },
      { property: "og:title", content: "সংবাদ ও আপডেট — পিএনসি" },
      { property: "og:description", content: "পাবনা নাগরিক কমিটির সর্বশেষ খবর।" },
      { property: "og:url", content: "https://pncpab.lovable.app/news" },
    ],
    links: [{ rel: "canonical", href: "https://pncpab.lovable.app/news" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "সংবাদ ও আপডেট — পাবনা নাগরিক কমিটি",
          description: "পিএনসি-র সাম্প্রতিক সংবাদ ও কার্যক্রমের আপডেট।",
          url: "https://pncpab.lovable.app/news",
          inLanguage: "bn",
          isPartOf: { "@type": "WebSite", name: "PNC Pabna", url: "https://pncpab.lovable.app/" },
        }),
      },
    ],
  }),
  component: NewsPage,
});

type News = {
  id: string;
  title_bn: string;
  summary_bn: string | null;
  body_bn: string | null;
  cover_image_path: string | null;
  category: string;
  published_at: string;
};

function NewsPage() {
  const [items, setItems] = useState<News[]>([]);
  const [active, setActive] = useState("সকল");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("news")
        .select("id, title_bn, summary_bn, body_bn, cover_image_path, category, published_at")
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(100);
      setItems((data as News[]) || []);
      setLoading(false);
    })();
  }, []);

  const categories = ["সকল", ...Array.from(new Set(items.map((i) => i.category)))];
  const filtered = active === "সকল" ? items : items.filter((i) => i.category === active);

  return (
    <>
      <PageHeader
        eyebrow="সংবাদ ও আপডেট"
        title="সাম্প্রতিক খবর ও কার্যক্রম"
        description="পাবনা নাগরিক কমিটির বিভিন্ন কার্যক্রম, অর্জন ও সামাজিক উদ্যোগের সর্বশেষ আপডেট।"
      />
      <section className="container-pnc py-12 md:py-16">
        {categories.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition border ${
                  active === c
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground border-border hover:border-primary hover:text-primary"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <p className="text-muted-foreground">লোড হচ্ছে...</p>
        ) : filtered.length === 0 ? (
          <p className="text-muted-foreground rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            এখনো কোনো সংবাদ প্রকাশিত হয়নি।
          </p>
        ) : (
          <>
            <h2 className="sr-only">সকল সংবাদ</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((n) => (
                <NewsCard key={n.id} n={n} />
              ))}

            </div>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "ItemList",
                  itemListElement: filtered.slice(0, 20).map((n, i) => ({
                    "@type": "ListItem",
                    position: i + 1,
                    item: {
                      "@type": "NewsArticle",
                      headline: n.title_bn,
                      datePublished: n.published_at,
                      articleSection: n.category,
                      ...(n.cover_image_path
                        ? { image: publicUrl("gallery", n.cover_image_path) }
                        : {}),
                      description: n.summary_bn || (n.body_bn ? n.body_bn.slice(0, 160) : undefined),
                    },
                  })),
                }),
              }}
            />
          </>
        )}
      </section>
    </>
  );
}

function NewsCard({ n }: { n: News }) {
  const [open, setOpen] = useState(false);
  const fullText = n.body_bn || n.summary_bn || "";
  const isLong = fullText.length > 220;
  return (
    <article className="card-hover rounded-2xl border border-border bg-card shadow-card flex flex-col overflow-hidden">
      {n.cover_image_path && (
        <div className="aspect-video bg-muted">
          <img src={publicUrl("gallery", n.cover_image_path)} alt={n.title_bn} className="h-full w-full object-cover" loading="lazy" />
        </div>
      )}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 text-red-accent font-semibold"><Tag className="h-3.5 w-3.5" /> {n.category}</span>
          <span className="inline-flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {new Date(n.published_at).toLocaleDateString("bn-BD")}</span>
        </div>
        <h3 className="mt-3 text-lg font-bold text-foreground">{n.title_bn}</h3>
        <p className={`mt-2 text-sm text-muted-foreground flex-1 whitespace-pre-line ${open ? "" : "line-clamp-5"}`}>{fullText}</p>
        {isLong && (
          <button
            onClick={() => setOpen((v) => !v)}
            className="mt-3 self-start text-sm font-semibold text-primary hover:underline"
          >
            {open ? "সংক্ষেপে দেখুন" : "বিস্তারিত পড়ুন"}
          </button>
        )}
      </div>
    </article>
  );
}

