import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { Megaphone, MessageSquare, GraduationCap, HeartHandshake, Users, Vote, Building2, Sparkles, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/activities")({
  head: () => ({
    meta: [
      { title: "আমাদের কার্যক্রম — পাবনা নাগরিক কমিটি" },
      { name: "description", content: "সামাজিক সচেতনতা, নাগরিক সংলাপ, যুব নেতৃত্ব, মানবিক সহায়তা — পিএনসি-র বিভিন্ন কার্যক্রম।" },
      { property: "og:title", content: "আমাদের কার্যক্রম — পিএনসি" },
      { property: "og:description", content: "পাবনার জন্য নাগরিক উদ্যোগ ও কর্মসূচি।" },
    ],
  }),
  component: ActivitiesPage,
});

const items = [
  { icon: Megaphone, title: "সামাজিক সচেতনতা ক্যাম্পেইন", text: "জনস্বাস্থ্য, পরিবেশ, শিক্ষা ও নাগরিক দায়িত্ব নিয়ে সচেতনতা বৃদ্ধির কার্যক্রম।" },
  { icon: MessageSquare, title: "নাগরিক সমস্যা নিয়ে আলোচনা", text: "পাবনার গুরুত্বপূর্ণ সমস্যা নিয়ে সংলাপ, মতবিনিময় ও সমাধান অনুসন্ধান।" },
  { icon: GraduationCap, title: "যুব নেতৃত্ব উন্নয়ন", text: "তরুণদের নেতৃত্ব, দক্ষতা ও সামাজিক দায়িত্ববোধ গড়ে তোলার উদ্যোগ।" },
  { icon: HeartHandshake, title: "মানবিক সহায়তা", text: "দুর্যোগ ও সংকটে অসহায় মানুষের পাশে দাঁড়িয়ে সম্মিলিত সহায়তা।" },
  { icon: Users, title: "জনস্বার্থমূলক কার্যক্রম", text: "সাধারণ নাগরিকের অধিকার ও সেবা সুনিশ্চিত করতে যৌথ উদ্যোগ।" },
  { icon: Vote, title: "নাগরিক মতামত ও দাবি", text: "জনস্বার্থে পাবনার মানুষের মতামত ও দাবি যথাযথ কর্তৃপক্ষের কাছে পৌঁছে দেওয়া।" },
  { icon: Building2, title: "কমিউনিটি উদ্যোগ", text: "এলাকাভিত্তিক ছোট-বড় সামাজিক প্রকল্প ও সমষ্টিগত উদ্যোগ।" },
  { icon: Sparkles, title: "পাবনার ইতিবাচক ব্র্যান্ডিং", text: "পাবনার সংস্কৃতি, ইতিহাস ও সম্ভাবনাকে দেশ-বিদেশে তুলে ধরা।" },
];

function ActivitiesPage() {
  return (
    <>
      <PageHeader
        eyebrow="কার্যক্রম"
        title="পাবনার জন্য আমাদের নিরন্তর উদ্যোগ"
        description="সামাজিক সচেতনতা থেকে মানবিক সহায়তা — আমাদের প্রতিটি কার্যক্রম পাবনার মানুষের কল্যাণে নিবেদিত।"
      />
      <section className="container-pnc py-16 md:py-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <article key={it.title} className="card-hover rounded-2xl border border-border bg-card p-6 shadow-card flex flex-col">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <it.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">{it.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground flex-1">{it.text}</p>
              <Link to="/contact" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all">
                বিস্তারিত দেখুন <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
