import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/site/PageHeader";
import {
  Megaphone, MessageSquare, GraduationCap, HeartHandshake,
  Users, Vote, Building2, Sparkles, ArrowRight, X, CheckCircle2, Calendar,
} from "lucide-react";

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

type Item = {
  icon: typeof Megaphone;
  title: string;
  text: string;
  details: string;
  highlights: string[];
};

const items: Item[] = [
  {
    icon: Megaphone,
    title: "সামাজিক সচেতনতা ক্যাম্পেইন",
    text: "জনস্বাস্থ্য, পরিবেশ, শিক্ষা ও নাগরিক দায়িত্ব নিয়ে সচেতনতা বৃদ্ধির কার্যক্রম।",
    details: "আমরা পাবনার বিভিন্ন এলাকায় নিয়মিতভাবে সচেতনতামূলক ক্যাম্পেইন আয়োজন করি। ডেঙ্গু প্রতিরোধ, পরিবেশ সংরক্ষণ, মাদকবিরোধী সচেতনতা, সড়ক নিরাপত্তা এবং নাগরিক দায়িত্ব নিয়ে সাধারণ মানুষের কাছে বার্তা পৌঁছে দিই।",
    highlights: ["জনস্বাস্থ্য সচেতনতা", "পরিবেশ ও পরিচ্ছন্নতা", "মাদকবিরোধী প্রচারণা", "সড়ক নিরাপত্তা"],
  },
  {
    icon: MessageSquare,
    title: "নাগরিক সমস্যা নিয়ে আলোচনা",
    text: "পাবনার গুরুত্বপূর্ণ সমস্যা নিয়ে সংলাপ, মতবিনিময় ও সমাধান অনুসন্ধান।",
    details: "নাগরিকদের নিয়ে নিয়মিত খোলা সংলাপ ও মতবিনিময় সভা আয়োজন করি, যেখানে স্থানীয় সমস্যা চিহ্নিত করে যৌথ সমাধান বের করা হয়। স্থানীয় প্রশাসন ও বিশেষজ্ঞদেরও আমন্ত্রণ জানানো হয়।",
    highlights: ["মাসিক নাগরিক সংলাপ", "সমস্যা চিহ্নিতকরণ", "প্রশাসনিক সমন্বয়", "নীতি-প্রস্তাবনা"],
  },
  {
    icon: GraduationCap,
    title: "যুব নেতৃত্ব উন্নয়ন",
    text: "তরুণদের নেতৃত্ব, দক্ষতা ও সামাজিক দায়িত্ববোধ গড়ে তোলার উদ্যোগ।",
    details: "তরুণ প্রজন্মের জন্য নেতৃত্ব প্রশিক্ষণ, কর্মশালা, বিতর্ক ও ভলান্টিয়ার প্রোগ্রাম পরিচালনা করি। লক্ষ্য — পাবনার ভবিষ্যৎ নাগরিক নেতৃত্ব তৈরি।",
    highlights: ["লিডারশিপ ওয়ার্কশপ", "ভলান্টিয়ার প্রোগ্রাম", "ক্যারিয়ার গাইডেন্স", "যুব বিতর্ক"],
  },
  {
    icon: HeartHandshake,
    title: "মানবিক সহায়তা",
    text: "দুর্যোগ ও সংকটে অসহায় মানুষের পাশে দাঁড়িয়ে সম্মিলিত সহায়তা।",
    details: "বন্যা, শৈত্যপ্রবাহ, অগ্নিকাণ্ড বা যেকোনো জরুরি পরিস্থিতিতে পিএনসি দ্রুত মানবিক সহায়তা পৌঁছে দেয় — খাদ্য, কম্বল, ওষুধ ও পুনর্বাসন সহায়তার মাধ্যমে।",
    highlights: ["দুর্যোগ ত্রাণ", "শীতবস্ত্র বিতরণ", "চিকিৎসা সহায়তা", "পুনর্বাসন"],
  },
  {
    icon: Users,
    title: "জনস্বার্থমূলক কার্যক্রম",
    text: "সাধারণ নাগরিকের অধিকার ও সেবা সুনিশ্চিত করতে যৌথ উদ্যোগ।",
    details: "নাগরিক সেবা সহজীকরণ, তথ্য অধিকার চর্চা এবং স্থানীয় সরকার কর্তৃক প্রদেয় সেবার মান নিরীক্ষায় আমরা কাজ করি।",
    highlights: ["তথ্য অধিকার", "সেবা মূল্যায়ন", "জনগণের কণ্ঠ", "স্বচ্ছতা"],
  },
  {
    icon: Vote,
    title: "নাগরিক মতামত ও দাবি",
    text: "জনস্বার্থে পাবনার মানুষের মতামত ও দাবি যথাযথ কর্তৃপক্ষের কাছে পৌঁছে দেওয়া।",
    details: "জনমত জরিপ, স্বাক্ষর সংগ্রহ ও স্মারকলিপির মাধ্যমে পাবনাবাসীর গুরুত্বপূর্ণ দাবিগুলো সঠিক কর্তৃপক্ষের কাছে পৌঁছানো হয়।",
    highlights: ["জনমত জরিপ", "স্মারকলিপি", "অ্যাডভোকেসি", "কর্তৃপক্ষের সাথে যোগাযোগ"],
  },
  {
    icon: Building2,
    title: "কমিউনিটি উদ্যোগ",
    text: "এলাকাভিত্তিক ছোট-বড় সামাজিক প্রকল্প ও সমষ্টিগত উদ্যোগ।",
    details: "ওয়ার্ড ও মহল্লাভিত্তিক ছোট প্রকল্প — যেমন পরিচ্ছন্নতা অভিযান, বৃক্ষরোপণ, রক্তদান ক্যাম্প — যা স্থানীয় কমিউনিটিকে শক্তিশালী করে।",
    highlights: ["পরিচ্ছন্নতা অভিযান", "বৃক্ষরোপণ", "রক্তদান ক্যাম্প", "মহল্লা উন্নয়ন"],
  },
  {
    icon: Sparkles,
    title: "পাবনার ইতিবাচক ব্র্যান্ডিং",
    text: "পাবনার সংস্কৃতি, ইতিহাস ও সম্ভাবনাকে দেশ-বিদেশে তুলে ধরা।",
    details: "পাবনার সংস্কৃতি, ঐতিহ্য, ব্যক্তিত্ব ও সম্ভাবনাকে আধুনিক মাধ্যমে দেশ-বিদেশে তুলে ধরে আমরা পাবনার সম্মান বৃদ্ধি করি।",
    highlights: ["সাংস্কৃতিক উৎসব", "ঐতিহ্য সংরক্ষণ", "ডিজিটাল প্রচার", "আন্তঃজেলা সংযোগ"],
  },
];

function ActivitiesPage() {
  const [active, setActive] = useState<Item | null>(null);

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
              <button
                onClick={() => setActive(it)}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all self-start"
              >
                বিস্তারিত দেখুন <ArrowRight className="h-4 w-4" />
              </button>
            </article>
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-border bg-primary-soft/40 p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-foreground">আসন্ন ইভেন্টে যোগ দিন</h3>
            <p className="text-sm text-muted-foreground mt-1.5">আমাদের সভা, কর্মশালা ও কমিউনিটি ইভেন্টের তারিখ ও স্থান দেখুন এবং নিবন্ধন করুন।</p>
          </div>
          <Link to="/events" className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition shrink-0">
            <Calendar className="h-4 w-4" /> ইভেন্ট ক্যালেন্ডার
          </Link>
        </div>
      </section>

      {active && <DetailsModal item={active} onClose={() => setActive(null)} />}
    </>
  );
}

function DetailsModal({ item, onClose }: { item: Item; onClose: () => void }) {
  const Icon = item.icon;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl bg-card p-6 md:p-7 shadow-elegant" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-lg leading-tight">{item.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">পিএনসি কার্যক্রম</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
        </div>
        <p className="mt-5 text-sm text-foreground/85 leading-relaxed">{item.details}</p>
        <div className="mt-5">
          <h4 className="text-sm font-semibold text-foreground mb-2.5">প্রধান ক্ষেত্রসমূহ</h4>
          <ul className="grid grid-cols-2 gap-2">
            {item.highlights.map((h) => (
              <li key={h} className="flex items-start gap-1.5 text-sm text-foreground/80">
                <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary shrink-0" /> {h}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
          <Link to="/events" onClick={onClose} className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition">
            <Calendar className="h-4 w-4" /> ইভেন্টে যোগ দিন
          </Link>
          <Link to="/contact" onClick={onClose} className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition">
            যোগাযোগ করুন <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
