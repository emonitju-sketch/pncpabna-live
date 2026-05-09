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
    ],
  }),
  component: GalleryPage,
});

const CATEGORIES = ["সকল", "সভা ও আলোচনা", "সামাজিক উদ্যোগ", "মানবিক কার্যক্রম", "শুভেচ্ছা ও সম্মাননা", "পাবনার মুহূর্ত"];

type Img = { id: string; title: string; category: string; image_path: string };

function GalleryPage() {
  const [active, setActive] = useState("সকল");
  const [images, setImages] = useState<Img[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("gallery_images")
        .select("id, title, category, image_path")
        .order("created_at", { ascending: false });
      setImages((data as Img[]) || []);
      setLoading(false);
    })();
  }, []);

  const filtered = active === "সকল" ? images : images.filter((i) => i.category === active);

  return (
    <>
      <PageHeader
        eyebrow="গ্যালারি"
        title="আমাদের কাজের মুহূর্তগুলো"
        description="পিএনসি-র বিভিন্ন কার্যক্রম, সভা, সামাজিক উদ্যোগ ও পাবনার গর্বের মুহূর্ত।"
      />
      <section className="container-pnc py-12 md:py-16">
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((c) => (
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

        {loading ? (
          <p className="text-muted-foreground">লোড হচ্ছে...</p>
        ) : filtered.length === 0 ? (
          <p className="text-muted-foreground rounded-2xl border border-dashed border-border bg-card p-8 text-center">
            এখনো কোনো ছবি প্রকাশিত হয়নি।
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((it) => (
              <figure key={it.id} className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-card aspect-[4/3]">
                <img
                  src={publicUrl("gallery", it.image_path)}
                  alt={it.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent p-4 text-primary-foreground">
                  <p className="text-xs opacity-90">{it.category}</p>
                  <p className="font-semibold">{it.title}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
