import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { Target, Eye, Award, HeartHandshake, Users, Sparkles } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "আমাদের সম্পর্কে — পাবনা নাগরিক কমিটি" },
      { name: "description", content: "পাবনা নাগরিক কমিটি - পিএনসি একটি নাগরিকভিত্তিক সামাজিক সংগঠন, যা পাবনার উন্নয়ন ও জনস্বার্থে কাজ করে।" },
      { property: "og:title", content: "আমাদের সম্পর্কে — পিএনসি" },
      { property: "og:description", content: "পাবনার মানুষের জন্য, পাবনার মানুষের সংগঠন।" },
      { property: "og:url", content: "https://pncpabna.live/about" },
    ],
    links: [{ rel: "canonical", href: "https://pncpabna.live/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="আমাদের সম্পর্কে"
        title="পাবনার নাগরিকদের জন্য, পাবনার নাগরিকদের সংগঠন"
        description="পাবনা নাগরিক কমিটি - পিএনসি জনস্বার্থ, সামাজিক সচেতনতা ও নাগরিক অংশগ্রহণের মাধ্যমে একটি ইতিবাচক পরিবর্তনের পথে অঙ্গীকারবদ্ধ।"
      />

      <section className="container-pnc py-16 md:py-20 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-5 text-muted-foreground leading-relaxed">
          <p>
            পাবনা নাগরিক কমিটি - পিএনসি একটি নাগরিকভিত্তিক সামাজিক সংগঠন, যা পাবনার উন্নয়ন, জনস্বার্থ, সামাজিক সচেতনতা এবং মানবিক উদ্যোগের পক্ষে কাজ করে। আমরা বিশ্বাস করি সচেতন ও ঐক্যবদ্ধ নাগরিকরাই একটি উন্নত, মানবিক ও দায়িত্বশীল সমাজ গড়ে তুলতে পারে।
          </p>
          <p>
            আমাদের কার্যক্রম রাজনৈতিক দলের ঊর্ধ্বে — আমরা পাবনার সাধারণ মানুষের কণ্ঠস্বর তুলে ধরতে, যুব সমাজকে নেতৃত্বে আনতে এবং সমাজের প্রান্তিক মানুষের পাশে দাঁড়াতে কাজ করি।
          </p>
          <h2 className="mt-8 text-2xl md:text-3xl font-bold text-foreground">আমাদের মূলনীতি ও পদ্ধতি</h2>
          <div className="grid gap-5 sm:grid-cols-2 mt-4">
            {[
              { icon: Target, title: "মূলনীতি", text: "ঐক্য, সচেতনতা, দায়িত্ব ও মানবিকতা।" },
              { icon: Award, title: "মূল্যবোধ", text: "সততা, স্বচ্ছতা, সম্মান ও জনসেবা।" },
              { icon: Users, title: "অংশগ্রহণ", text: "সকল শ্রেণি-পেশার মানুষের সম্মিলন।" },
              { icon: Sparkles, title: "পদ্ধতি", text: "সংলাপ, উদ্যোগ ও সম্মিলিত কর্মসূচি।" },
            ].map((c) => (
              <div key={c.title} className="rounded-xl border border-border bg-card p-6 shadow-card card-hover">
                <c.icon className="h-6 w-6 text-primary" />
                <h3 className="mt-3 font-semibold text-foreground">{c.title}</h3>
                <p className="mt-1 text-sm">{c.text}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl bg-primary text-primary-foreground p-6 shadow-elegant">
            <Target className="h-7 w-7" />
            <h3 className="mt-3 font-semibold text-lg">আমাদের লক্ষ্য</h3>
            <p className="mt-2 text-sm opacity-95">
              পাবনার মানুষের কণ্ঠস্বরকে শক্তিশালী করা এবং নাগরিক অংশগ্রহণের মাধ্যমে উন্নয়নমুখী সমাজ গড়ে তোলা।
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <Eye className="h-7 w-7 text-red-accent" />
            <h3 className="mt-3 font-semibold text-lg">আমাদের স্বপ্ন</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              একটি সচেতন, ঐক্যবদ্ধ, দায়িত্বশীল ও মানবিক পাবনা গড়ে তোলা।
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <HeartHandshake className="h-7 w-7 text-primary" />
            <h3 className="mt-3 font-semibold text-lg">আমাদের অঙ্গীকার</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              জনস্বার্থ, সামাজিক ন্যায়বিচার ও পাবনার ইতিবাচক উন্নয়নের পক্ষে।
            </p>
          </div>
        </aside>
      </section>
    </>
  );
}
