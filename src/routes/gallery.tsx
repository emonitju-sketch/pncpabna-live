import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { publicUrl } from "@/hooks/use-auth";
import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "গ্যালারি — পাবনা নাগরিক কমিটি" },
      { name: "description", content: "পিএনসি-র সভা, সামাজিক উদ্যোগ, মানবিক কার্যক্রম ও পাবনার মুহূর্তের ছবি।" },
      { property: "og:title", content: "গ্যালারি — পিএনসি" },
      { property: "og:description", content: "আমাদের কাজের মুহূর্তগুলো।" },
      { property: "og:url", content: "https://pncpab.lovable.app/gallery" },
    ],
    links: [{ rel: "canonical", href: "https://pncpab.lovable.app/gallery" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "গ্যালারি — পাবনা নাগরিক কমিটি",
        url: "https://pncpab.lovable.app/gallery",
        inLanguage: "bn",
        isPartOf: { "@type": "WebSite", name: "PNC Pabna", url: "https://pncpab.lovable.app/" },
      }),
    }],
  }),
  component: GalleryPage,
});

type Img = { id: string; title: string; category: string; image_path: string; caption_bn: string | null };

function GalleryPage() {
  const [active, setActive] = useState("সকল");
  const [images, setImages] = useState<Img[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<Img | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("gallery_images")
        .select("id, title, category, image_path, caption_bn")
        .eq("is_featured", true)
        .order("display_order", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(12);
      setImages((data as Img[]) || []);
      setLoading(false);
    })();
  }, []);

  // Build categories from actual data
  const categories = ["সকল", ...Array.from(new Set(images.map((i) => i.category))).sort()];
  const filtered = active === "সকল" ? images : images.filter((i) => i.category === active);

  return (
    <>
      <PageHeader
        eyebrow="নির্বাচিত মুহূর্ত"
        title="আমাদের কাজের কিছু উল্লেখযোগ্য মুহূর্ত"
        description="পিএনসি-র গুরুত্বপূর্ণ কার্যক্রম থেকে বাছাই করা কিছু ছবি — সংখ্যায় কম, কিন্তু অর্থে গভীর।"
      />
      <section className="container-pnc py-12 md:py-16">
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
              {c !== "সকল" && (
                <span className="ml-2 text-xs opacity-70">
                  ({images.filter((i) => i.category === c).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-muted-foreground rounded-2xl border border-dashed border-border bg-card p-8 text-center">
            এখনো কোনো ছবি প্রকাশিত হয়নি।
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((it) => (
              <figure
                key={it.id}
                onClick={() => setLightbox(it)}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-card aspect-[4/3] cursor-pointer"
              >
                <img
                  src={publicUrl("gallery", it.image_path)}
                  alt={it.caption_bn || it.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 text-white">
                  <p className="text-xs opacity-90">{it.category}</p>
                  <p className="font-semibold line-clamp-2">{it.caption_bn || it.title}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </section>

      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
        >
          <button
            aria-label="বন্ধ করুন"
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 rounded-full bg-white/10 text-white w-10 h-10 flex items-center justify-center hover:bg-white/20"
          >
            ✕
          </button>
          <figure onClick={(e) => e.stopPropagation()} className="max-w-5xl w-full">
            <img
              src={publicUrl("gallery", lightbox.image_path)}
              alt={lightbox.caption_bn || lightbox.title}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />
            {(lightbox.caption_bn || lightbox.title) && (
              <figcaption className="mt-4 text-white/90 text-center">
                <p className="text-xs opacity-70 mb-1">{lightbox.category}</p>
                <p>{lightbox.caption_bn || lightbox.title}</p>
              </figcaption>
            )}
          </figure>
        </div>
      )}
    </>
  );
}
