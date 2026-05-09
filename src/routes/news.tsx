import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/site/PageHeader";
import { Calendar, Tag, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: "সংবাদ ও আপডেট — পাবনা নাগরিক কমিটি" },
      { name: "description", content: "পিএনসি-র সাম্প্রতিক সংবাদ, কার্যক্রমের আপডেট, অভিনন্দন ও সামাজিক উদ্যোগের খবর।" },
      { property: "og:title", content: "সংবাদ ও আপডেট — পিএনসি" },
      { property: "og:description", content: "পাবনা নাগরিক কমিটির সর্বশেষ খবর।" },
    ],
  }),
  component: NewsPage,
});

const categories = ["সকল", "অভিনন্দন", "সংগঠন সংবাদ", "সামাজিক উদ্যোগ", "নাগরিক সচেতনতা", "পাবনা আপডেট"];

const news = [
  {
    cat: "অভিনন্দন",
    date: "১০ মে, ২০২৬",
    title: "পিএনসি নেতার অর্জনে অভিনন্দন",
    text: "পাবনা নাগরিক কমিটির যুব বিষয়ক সম্পাদক জনাব মোঃ এনামুল হক ‘বাপেক্স অফিসার্স ওয়েলফেয়ার এসোসিয়েশন নির্বাচন ২০২৬’-এ সাংগঠনিক সম্পাদক পদে বিনা প্রতিদ্বন্দ্বিতায় নির্বাচিত হয়েছেন। পাবনা নাগরিক কমিটির পক্ষ থেকে আন্তরিক অভিনন্দন।",
  },
  {
    cat: "সামাজিক উদ্যোগ",
    date: "২ মে, ২০২৬",
    title: "শীতার্ত মানুষের পাশে পিএনসি",
    text: "পাবনা সদর ও আশেপাশের এলাকায় শীতার্ত অসহায় মানুষের মাঝে পিএনসি-র সদস্যবৃন্দের উদ্যোগে শীতবস্ত্র বিতরণ কার্যক্রম সম্পন্ন হয়েছে।",
  },
  {
    cat: "নাগরিক সচেতনতা",
    date: "২৫ এপ্রিল, ২০২৬",
    title: "ডেঙ্গু প্রতিরোধে সচেতনতামূলক প্রচার",
    text: "ডেঙ্গু প্রতিরোধে পাবনার বিভিন্ন এলাকায় পরিচ্ছন্নতা ও সচেতনতামূলক প্রচার কার্যক্রম পরিচালনা করেছে পিএনসি।",
  },
  {
    cat: "সংগঠন সংবাদ",
    date: "১৮ এপ্রিল, ২০২৬",
    title: "পিএনসি-র মাসিক সাধারণ সভা অনুষ্ঠিত",
    text: "পাবনা নাগরিক কমিটির মাসিক সাধারণ সভায় আগামী কর্মপরিকল্পনা ও সাংগঠনিক বিষয়ে গুরুত্বপূর্ণ সিদ্ধান্ত গৃহীত হয়েছে।",
  },
  {
    cat: "পাবনা আপডেট",
    date: "১০ এপ্রিল, ২০২৬",
    title: "পাবনার রাস্তাঘাট সংস্কারে নাগরিক দাবি",
    text: "পাবনা শহরের গুরুত্বপূর্ণ সড়কগুলোর সংস্কার ও জনদুর্ভোগ লাঘবে স্থানীয় কর্তৃপক্ষের কাছে আনুষ্ঠানিক দাবি জানিয়েছে পিএনসি।",
  },
  {
    cat: "সামাজিক উদ্যোগ",
    date: "১ এপ্রিল, ২০২৬",
    title: "শিক্ষা উপকরণ বিতরণ কর্মসূচি",
    text: "পাবনার সুবিধাবঞ্চিত শিক্ষার্থীদের মাঝে শিক্ষা উপকরণ ও বইপত্র বিতরণ করেছে পিএনসি-র শিক্ষা উপ-কমিটি।",
  },
];

function NewsPage() {
  const [active, setActive] = useState("সকল");
  const filtered = active === "সকল" ? news : news.filter((n) => n.cat === active);

  return (
    <>
      <PageHeader
        eyebrow="সংবাদ ও আপডেট"
        title="সাম্প্রতিক খবর ও কার্যক্রম"
        description="পাবনা নাগরিক কমিটির বিভিন্ন কার্যক্রম, অর্জন ও সামাজিক উদ্যোগের সর্বশেষ আপডেট।"
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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((n) => (
            <article key={n.title} className="card-hover rounded-2xl border border-border bg-card p-6 shadow-card flex flex-col">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5 text-red-accent font-semibold"><Tag className="h-3.5 w-3.5" /> {n.cat}</span>
                <span className="inline-flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {n.date}</span>
              </div>
              <h3 className="mt-3 text-lg font-bold text-foreground">{n.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-4 flex-1">{n.text}</p>
              <button className="mt-5 self-start inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all">
                আরও পড়ুন <ArrowRight className="h-4 w-4" />
              </button>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
