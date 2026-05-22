import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { Quote, Users } from "lucide-react";
import bishu from "@/assets/leader-bishu.webp";
import mukul from "@/assets/leader-mukul.webp";
import jewel from "@/assets/leader-jewel.webp";
import mpSelim from "@/assets/mp-selim-reza-habib.avif";
import mpShimul from "@/assets/mp-shimul-biswas.avif";

export const Route = createFileRoute("/council")({
  head: () => ({
    meta: [
      { title: "কার্যনির্বাহী কমিটি — পাবনা নাগরিক কমিটি (পিএনসি)" },
      { name: "description", content: "পাবনা নাগরিক কমিটি (পিএনসি)–এর বর্তমান কার্যনির্বাহী কমিটি ও নেতৃবৃন্দের পরিচয়।" },
      { property: "og:title", content: "কার্যনির্বাহী কমিটি — পিএনসি" },
      { property: "og:description", content: "বর্তমান কার্যনির্বাহী কমিটি, কো-চেয়ারম্যানগণ ও সাধারণ সম্পাদক।" },
      { property: "og:url", content: "https://pncpab.lovable.app/council" },
    ],
    links: [{ rel: "canonical", href: "https://pncpab.lovable.app/council" }],
  }),
  component: CouncilPage,
});

type Leader = {
  name: string;
  role: string;
  photo: string;
  quote: string;
};

const leaders: Leader[] = [
  {
    name: "জনাব মোঃ জহুরুল ইসলাম বিশু",
    role: "কো-চেয়ারম্যান",
    photo: bishu,
    quote:
      "আমাদের লক্ষ্য একটি সচেতন, মানবিক, ঐক্যবদ্ধ ও উন্নয়নমুখী পাবনা গড়ে তোলা। নাগরিকের অংশগ্রহণই হবে আমাদের শক্তি।",
  },
  {
    name: "জনাব খতিব আব্দুল জাহিদ মুকুল",
    role: "কো-চেয়ারম্যান",
    photo: mukul,
    quote:
      "নাগরিকের ঐক্য, অধিকার ও অংশগ্রহণই একটি উন্নত, সুশাসিত ও সচেতন পাবনা গঠনের মূল শক্তি।",
  },
  {
    name: "জনাব মোঃ আবুল বাশার খান জুয়েল",
    role: "সাধারণ সম্পাদক",
    photo: jewel,
    quote:
      "পাবনাকে একটি পরিচ্ছন্ন, সচেতন, প্রযুক্তিনির্ভর ও মানবিক শহর হিসেবে গড়ে তুলতে আমরা সবাই একসাথে কাজ করবো।",
  },
];

// বর্তমান কার্যনির্বাহী কমিটি (সংক্ষিপ্ত তালিকা — পদ অনুসারে)
const executive: { role: string; name: string }[] = [
  { role: "কো-চেয়ারম্যান", name: "জনাব মোঃ জহুরুল ইসলাম বিশু" },
  { role: "কো-চেয়ারম্যান", name: "জনাব খতিব আব্দুল জাহিদ মুকুল" },
  { role: "সাধারণ সম্পাদক", name: "জনাব মোঃ আবুল বাশার খান জুয়েল" },
  { role: "যুগ্ম সাধারণ সম্পাদক", name: "—" },
  { role: "সাংগঠনিক সম্পাদক", name: "—" },
  { role: "অর্থ সম্পাদক", name: "—" },
  { role: "দপ্তর সম্পাদক", name: "—" },
  { role: "প্রচার ও প্রকাশনা সম্পাদক", name: "—" },
  { role: "শিক্ষা ও সাংস্কৃতিক সম্পাদক", name: "—" },
  { role: "সমাজকল্যাণ সম্পাদক", name: "—" },
  { role: "ক্রীড়া সম্পাদক", name: "—" },
  { role: "নারী বিষয়ক সম্পাদক", name: "—" },
];

const mps = [
  {
    name: "জনাব এ কে এম সেলিম রেজা হাবিব",
    title: "মাননীয় সংসদ সদস্য",
    constituency: "পাবনা-২ (সুজানগর ও আংশিক বেড়া)",
    party: "বাংলাদেশ জাতীয়তাবাদী দল (বিএনপি)",
    photo: mpSelim,
    quote:
      "পাবনার নাগরিক উন্নয়ন ও সুশাসনভিত্তিক কার্যক্রমে পাবনা নাগরিক কমিটি অগ্রণী ভূমিকা পালন করবে বলে আমি আশাবাদী।",
  },
  {
    name: "জনাব শামছুর রহমান শিমুল বিশ্বাস",
    title: "মাননীয় সংসদ সদস্য",
    constituency: "পাবনা-৪",
    party: "বাংলাদেশ জাতীয়তাবাদী দল (বিএনপি)",
    photo: mpShimul,
    quote:
      "নাগরিক সচেতনতা ও সামাজিক উন্নয়নে পিএনসি-এর ইতিবাচক ভূমিকার পাশে আমরা আছি।",
  },
];

function CouncilPage() {
  return (
    <>
      <PageHeader
        eyebrow="বর্তমান নেতৃত্ব"
        title="পাবনা নাগরিক কমিটি — কার্যনির্বাহী কমিটি"
        description="বর্তমান কার্যনির্বাহী কমিটির নেতৃবৃন্দ, যাঁরা নাগরিক ঐক্য, সুশাসন ও উন্নয়নমুখী পাবনা গঠনে নেতৃত্ব দিচ্ছেন।"
      />

      {/* Top leadership */}
      <section className="container-pnc py-14 md:py-20">
        <div className="grid gap-7 md:grid-cols-3">
          {leaders.map((l) => (
            <article
              key={l.name}
              className="group rounded-2xl border border-border bg-card shadow-card card-hover overflow-hidden flex flex-col"
            >
              <div className="aspect-[4/5] overflow-hidden bg-primary-soft">
                <img
                  src={l.photo}
                  alt={l.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-5 flex flex-col gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-[var(--gold)]">
                  {l.role}
                </span>
                <h3 className="font-display text-lg font-bold text-foreground leading-snug">
                  {l.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed relative pl-5">
                  <Quote className="absolute left-0 top-0 h-3.5 w-3.5 text-primary/60" />
                  {l.quote}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Full executive committee */}
      <section className="bg-primary-soft/40 border-y border-border">
        <div className="container-pnc py-14 md:py-20">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-primary">
                বর্তমান কমিটি
              </div>
              <h2 className="mt-1 text-2xl md:text-3xl font-bold text-foreground">
                কার্যনির্বাহী কমিটির সদস্যবৃন্দ
              </h2>
            </div>
            <Users className="hidden sm:block h-8 w-8 text-primary/70" />
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
            <table className="w-full text-sm">
              <thead className="bg-primary text-primary-foreground">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold w-12">#</th>
                  <th className="text-left px-4 py-3 font-semibold">পদবি</th>
                  <th className="text-left px-4 py-3 font-semibold">নাম</th>
                </tr>
              </thead>
              <tbody>
                {executive.map((e, i) => (
                  <tr
                    key={i}
                    className="border-t border-border hover:bg-primary-soft/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-muted-foreground">
                      {(i + 1).toLocaleString("bn-BD")}
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">{e.role}</td>
                    <td className="px-4 py-3 text-muted-foreground">{e.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            * পূর্ণ তালিকা শীঘ্রই হালনাগাদ করা হবে।
          </p>
        </div>
      </section>

      {/* MP greetings */}
      <section className="container-pnc py-14 md:py-20">
        <div className="mb-8">
          <div className="text-xs font-semibold uppercase tracking-wide text-primary">
            শুভেচ্ছা বাণী
          </div>
          <h2 className="mt-1 text-2xl md:text-3xl font-bold text-foreground">
            মাননীয় সংসদ সদস্যদের বাণী
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {mps.map((m) => (
            <article
              key={m.name}
              className="rounded-2xl border border-border bg-card shadow-card overflow-hidden flex flex-col sm:flex-row"
            >
              <div className="sm:w-44 shrink-0 aspect-square sm:aspect-auto bg-primary-soft">
                <img
                  src={m.photo}
                  alt={m.name}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-5 flex flex-col gap-2">
                <h3 className="font-display text-base font-bold text-foreground leading-snug">
                  {m.name}
                </h3>
                <div className="text-xs text-muted-foreground space-y-0.5">
                  <div>{m.title} — {m.constituency}</div>
                  <div>দল: {m.party}</div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed relative pl-5">
                  <Quote className="absolute left-0 top-0 h-3.5 w-3.5 text-primary/60" />
                  {m.quote}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
