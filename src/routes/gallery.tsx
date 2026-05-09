import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "গ্যালারি — পাবনা নাগরিক কমিটি" },
      { name: "description", content: "পিএনসি-র সভা, সামাজিক উদ্যোগ, মানবিক কার্যক্রম ও পাবনার বিভিন্ন মুহূর্তের ছবি।" },
      { property: "og:title", content: "গ্যালারি — পিএনসি" },
      { property: "og:description", content: "আমাদের কাজের মুহূর্তগুলো।" },
    ],
  }),
  component: GalleryPage,
});

const categories = ["সকল", "সভা ও আলোচনা", "সামাজিক উদ্যোগ", "মানবিক কার্যক্রম", "শুভেচ্ছা ও সম্মাননা", "পাবনার মুহূর্ত"];

const items = [
  { cat: "সভা ও আলোচনা", title: "মাসিক সাধারণ সভা", q: "community meeting bangladesh discussion" },
  { cat: "সামাজিক উদ্যোগ", title: "শীতবস্ত্র বিতরণ", q: "winter clothes distribution bangladesh" },
  { cat: "মানবিক কার্যক্রম", title: "ত্রাণ বিতরণ", q: "relief distribution bangladesh volunteers" },
  { cat: "শুভেচ্ছা ও সম্মাননা", title: "সংবর্ধনা অনুষ্ঠান", q: "award ceremony bangladesh" },
  { cat: "পাবনার মুহূর্ত", title: "পাবনা শহর", q: "pabna city bangladesh" },
  { cat: "সামাজিক উদ্যোগ", title: "শিক্ষা উপকরণ", q: "school children books bangladesh" },
  { cat: "সভা ও আলোচনা", title: "নাগরিক সংলাপ", q: "civic dialogue community bangladesh" },
  { cat: "মানবিক কার্যক্রম", title: "রক্তদান কর্মসূচি", q: "blood donation camp bangladesh" },
  { cat: "পাবনার মুহূর্ত", title: "পদ্মা নদী", q: "padma river bangladesh sunset" },
  { cat: "শুভেচ্ছা ও সম্মাননা", title: "অভিনন্দন", q: "congratulations group bangladesh" },
  { cat: "সামাজিক উদ্যোগ", title: "বৃক্ষরোপণ", q: "tree plantation bangladesh community" },
  { cat: "সভা ও আলোচনা", title: "যুব সম্মেলন", q: "youth conference bangladesh" },
];

function GalleryPage() {
  const [active, setActive] = useState("সকল");
  const filtered = active === "সকল" ? items : items.filter((i) => i.cat === active);
  return (
    <>
      <PageHeader
        eyebrow="গ্যালারি"
        title="আমাদের কাজের মুহূর্তগুলো"
        description="পিএনসি-র বিভিন্ন কার্যক্রম, সভা, সামাজিক উদ্যোগ ও পাবনার গর্বের মুহূর্ত।"
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
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((it, i) => (
            <figure key={i} className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-card aspect-[4/3]">
              <img
                src={`https://source.unsplash.com/600x450/?${encodeURIComponent(it.q)}`}
                alt={it.title}
                loading="lazy"
                width={600}
                height={450}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent p-4 text-primary-foreground">
                <p className="text-xs opacity-90">{it.cat}</p>
                <p className="font-semibold">{it.title}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </>
  );
}
