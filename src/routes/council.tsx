import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { Quote, Users } from "lucide-react";
import bishu from "@/assets/leader-bishu.webp";
import mukul from "@/assets/leader-mukul.webp";
import jewel from "@/assets/leader-jewel.webp";

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
      "ব্যবসায়িক দূরদৃষ্টি ও আত্মসামাজিক দায়বদ্ধতার সমন্বয়ে সমৃদ্ধ, সচেতন ও ঐক্যবদ্ধ পাবনা গড়ে তোলা আমাদের অঙ্গীকার।",
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
  { role: "কো-চেয়ারম্যান", name: "জনাব মো: জহুরুল ইসলাম বিশু" },
  { role: "কো-চেয়ারম্যান", name: "জনাব খতিব আব্দুল জাহিদ মুকুল" },
  { role: "প্রেসিডিয়াম সদস্য", name: "গোলাম রব্বানী কামনা" },
  { role: "প্রেসিডিয়াম সদস্য", name: "মো: রবিউল ইসলাম রবি" },
  { role: "প্রেসিডিয়াম সদস্য", name: "মো: আজাদ খান নান্টু" },
  { role: "প্রেসিডিয়াম সদস্য", name: "মো: এহসানুল হক দিপু" },
  { role: "প্রেসিডিয়াম সদস্য", name: "এ কে এম আশরাফুল হক" },
  { role: "প্রেসিডিয়াম সদস্য", name: "আব্দুল্লাহ আল মামুন" },
  { role: "প্রেসিডিয়াম সদস্য", name: "মাহবুব আলম" },
  { role: "প্রেসিডিয়াম সদস্য", name: "মো: শহীদূজ্জামান মতিন" },
  { role: "সাধারণ সম্পাদক", name: "জনাব মো: আবুল বাসার খান জুয়েল" },
  { role: "যুগ্ম-সাধারণ সম্পাদক", name: "ইঞ্জি. আবু নূর আশফাক আহমেদ লর্ড" },
  { role: "যুগ্ম-সাধারণ সম্পাদক", name: "আবু সায়েম শিপলু" },
  { role: "সাংগঠনিক সম্পাদক", name: "জনাব মো: রাশেদুল ইসলাম" },
  { role: "সহ-সাংগঠনিক সম্পাদক", name: "মো: আব্দুল্লাহ আল মামুন সুরুজ" },
  { role: "সহ-সাংগঠনিক সম্পাদক", name: "মির্জা রুবেল" },
  { role: "কোষাধ্যক্ষ", name: "আবু সাইদ মোহাম্মদ মোস্তাক" },
  { role: "দপ্তর সম্পাদক", name: "মো: মহিউদ্দিন ভূঁইয়া" },
  { role: "প্রচার সম্পাদক", name: "এ কে আজাদ" },
  { role: "সহ-প্রচার সম্পাদক", name: "মো: নাঈম ইমতিয়াজ লিমন" },
  { role: "ছাত্র বিষয়ক সম্পাদক", name: "মো: আল আমিন" },
  { role: "যুব বিষয়ক সম্পাদক", name: "ইঞ্জি: মো: এনামুল হক" },
  { role: "সহ-ইউথ বিষয়ক সম্পাদক", name: "মো: খলিলুর রহমান" },
  { role: "সাহিত্য ও সংস্কৃতি বিষয়ক সম্পাদক", name: "ইঞ্জি. মনজুর হোসেন দীপ্ত" },
  { role: "সহ-সাহিত্য ও সংস্কৃতি বিষয়ক সম্পাদক", name: "কমলেশ অধিকারী" },
  { role: "ধর্ম বিষয়ক সম্পাদক", name: "ডা: কাজী রকিবুল ইসলাম" },
  { role: "সহ-ধর্ম বিষয়ক সম্পাদক", name: "উজ্জ্বল কুমার মজুমদার" },
  { role: "পরিবেশ বিষয়ক সম্পাদক", name: "ইঞ্জি: মো: সাইফুল ইসলাম" },
  { role: "ক্রীড়া সম্পাদক", name: "মো: আলতাফ হোসেন" },
  { role: "সহ-ক্রীড়া সম্পাদক", name: "মো: রবিউল ইসলাম" },
  { role: "শিল্প ও বাণিজ্য সম্পাদক", name: "হোসেন আলী মিঠু" },
  { role: "তথ্য ও প্রযুক্তি সম্পাদক", name: "সাকিব রাব্বানী" },
  { role: "সহ-তথ্য ও প্রযুক্তি সম্পাদক", name: "জাহিদ হাসান ইমন" },
  { role: "মহিলা বিষয়ক সম্পাদক", name: "ডা: নাসরিন সুলতানা" },
  { role: "শিক্ষা সম্পাদক", name: "ইঞ্জি. আন নূর রহমান" },
  { role: "পরিকল্পনা ও উন্নয়ন সম্পাদক", name: "মো: শফিকুল ইসলাম রাজু" },
  { role: "সহ-পরিকল্পনা ও উন্নয়ন সম্পাদক", name: "ইঞ্জি: আবু রাশেদ শামীম" },
  { role: "অনুষ্ঠান বিষয়ক সম্পাদক", name: "রশিদ উন নবী" },
  { role: "পল্লী উন্নয়ন বিষয়ক সম্পাদক", name: "মো: জাহাঙ্গীর হোসেন" },
  { role: "পাঠাগার ও প্রকাশনা বিষয়ক সম্পাদক", name: "হামিদুর রহমান মাসুদ" },
  { role: "গবেষণা ও প্রশিক্ষণ বিষয়ক সম্পাদক", name: "মো: শহিদুল ইসলাম" },
  { role: "মুক্তিযুদ্ধ বিষয়ক সম্পাদক", name: "মো: মোয়াজ্জেমুল ইসলাম" },
  { role: "মানবাধিকার বিষয়ক সম্পাদক", name: "মো: রইজ উদ্দিন" },
  { role: "সদস্য", name: "মো: শফিউল আলম বাবু" },
  { role: "সদস্য", name: "মো: আব্দুল মোক্তাদির" },
  { role: "সদস্য", name: "দেবব্রত কর্মকার বাপ্পী" },
  { role: "সদস্য", name: "মো: আব্দুল্লাহ আল মামুন খোকন" },
  { role: "সদস্য", name: "মো: ফরহাদ হোসেন" },
  { role: "সদস্য", name: "মো: ইব্রাহিম হোসেন রিপন" },
  { role: "সদস্য", name: "মো: আব্দুল কালাম আজাদ" },
  { role: "সদস্য", name: "মো: সোহেল রহমান" },
  { role: "সদস্য", name: "মো: রবিউল হাসান রাসেল" },
  { role: "সদস্য", name: "মো: ফজলে রাব্বি" },
  { role: "সদস্য", name: "মো: আব্দুল কালাম আজাদ" },
  { role: "সদস্য", name: "মো: কামরুল ইসলাম" },
  { role: "সদস্য", name: "মো: ফয়সাল কবির পলাশ" },
  { role: "সদস্য", name: "মো: রাইসুল করিম" },
  { role: "সদস্য", name: "মো: হারুন অর রশিদ" },
  { role: "সদস্য", name: "মো: মুনসুর আলী" },
  { role: "সদস্য", name: "মো: মাসুদ রানা" },
  { role: "সদস্য", name: "মো: জাহাঙ্গীর আলম" },
  { role: "সদস্য", name: "মো: রেজওয়ান আলী রানা" },
  { role: "সদস্য", name: "মো: আনিসুর রহমান" },
  { role: "সদস্য", name: "মো: তানভীর হাসান" },
  { role: "সদস্য", name: "মো: ওমর ফারুক সৌরভ" },
  { role: "সদস্য", name: "মো: মেহেদী হাসান (সজল)" },
  { role: "সদস্য", name: "মো: ইমদাদুল হক মিলন" },
  { role: "সদস্য", name: "মো: হাসান করিম" },
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

    </>
  );
}
