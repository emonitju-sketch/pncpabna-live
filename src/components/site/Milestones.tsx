import { Flag, Users, Megaphone, HeartHandshake, Vote, Sparkles } from "lucide-react";

type Item = {
  date: string;
  title: string;
  text: string;
  icon: typeof Flag;
  color: string;
};

const items: Item[] = [
  { date: "জানুয়ারি ২০২৬", title: "পিএনসি প্রতিষ্ঠা ও যাত্রা শুরু", text: "নাগরিক ঐক্যের ভিত্তিতে আনুষ্ঠানিক যাত্রা শুরু।", icon: Flag, color: "text-primary bg-primary-soft" },
  { date: "৩১ জানুয়ারি ২০২৬", title: "প্রথম সুধী সমাবেশ", text: "পাবনার সর্বস্তরের মানুষের সাথে প্রথম মতবিনিময়।", icon: Users, color: "text-red-accent bg-red-accent/10" },
  { date: "ফেব্রুয়ারি ২০২৬", title: "২৪ দফার নাগরিক সনদ", text: "পাবনার উন্নয়ন ও অধিকারের জন্য চূড়ান্ত দাবিনামা।", icon: Megaphone, color: "text-foreground bg-[var(--gold)]/30" },
  { date: "মার্চ ২০২৬", title: "নাগরিক ঐক্যে দোয়া ও ইফতার মাহফিল", text: "একসাথে বসি, একসাথে ভাবি, একসাথে গড়ি পাবনা।", icon: HeartHandshake, color: "text-primary bg-primary-soft" },
  { date: "এপ্রিল ২০২৬", title: "কো-চেয়ারম্যানের দায়িত্বভার গ্রহণ", text: "সাংগঠনিক কাঠামো শক্তিশালীকরণ।", icon: Sparkles, color: "text-red-accent bg-red-accent/10" },
  { date: "মে ২০২৬", title: "পাবনা-৫ আসনে সমর্থন ঘোষণা", text: "জনাব জহুরুল ইসলাম বিশুর প্রতি পূর্ণ সমর্থন।", icon: Vote, color: "text-foreground bg-[var(--gold)]/30" },
];

export function Milestones() {
  return (
    <section className="container-pnc py-16 md:py-24">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-accent mb-3">গুরুত্বপূর্ণ মাইলফলক</p>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">আমাদের যাত্রার গল্প</h2>
        <p className="mt-4 text-muted-foreground text-base md:text-lg">
          পিএনসি-র প্রতিষ্ঠা থেকে আজ পর্যন্ত — পাবনার মানুষের সাথে কাঁধে কাঁধ মিলিয়ে।
        </p>
      </div>

      <ol className="mt-10 relative border-l-2 border-primary/20 pl-6 md:pl-8 space-y-8">
        {items.map((it) => (
          <li key={it.title} className="relative group">
            <span className={`absolute -left-[34px] md:-left-[42px] top-0 inline-flex h-10 w-10 items-center justify-center rounded-full ring-4 ring-background shadow-sm ${it.color}`}>
              <it.icon className="h-4.5 w-4.5" />
            </span>
            <div className="rounded-xl border border-border bg-card p-5 shadow-card transition group-hover:-translate-y-0.5 group-hover:shadow-elegant">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{it.date}</p>
              <h3 className="mt-1.5 text-lg font-bold text-foreground">{it.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{it.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
