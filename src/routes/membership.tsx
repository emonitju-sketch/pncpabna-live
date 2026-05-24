import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { PageHeader } from "@/components/site/PageHeader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Users, HeartHandshake, Megaphone } from "lucide-react";

export const Route = createFileRoute("/membership")({
  head: () => ({
    meta: [
      { title: "সদস্য হোন — পাবনা নাগরিক কমিটি" },
      { name: "description", content: "পাবনার উন্নয়ন ও সামাজিক ঐক্যের কাজে আমাদের সাথে যুক্ত হোন। পিএনসি সদস্যপদের জন্য আবেদন করুন।" },
      { property: "og:title", content: "সদস্য হোন — পিএনসি" },
      { property: "og:description", content: "পাবনার নাগরিক উদ্যোগে অংশ নিন।" },
      { property: "og:url", content: "https://pncpabna.live/membership" },
    ],
    links: [{ rel: "canonical", href: "https://pncpabna.live/membership" }],
  }),
  component: MembershipPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "পূর্ণ নাম লিখুন").max(100),
  phone: z.string().trim().min(10, "সঠিক মোবাইল নম্বর দিন").max(20),
  email: z.string().trim().email("সঠিক ইমেইল দিন").max(255).optional().or(z.literal("")),
  address: z.string().trim().min(2, "ঠিকানা লিখুন").max(200),
  profession: z.string().trim().max(100).optional().or(z.literal("")),
  interest: z.string().trim().max(150).optional().or(z.literal("")),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
});

const benefits = [
  { icon: Users, title: "নাগরিক নেটওয়ার্ক", text: "পাবনার সচেতন মানুষদের সাথে যুক্ত হন।" },
  { icon: Megaphone, title: "কণ্ঠস্বর তুলুন", text: "জনস্বার্থে আপনার মতামত পৌঁছে দিন।" },
  { icon: HeartHandshake, title: "সামাজিক উদ্যোগ", text: "মানবিক ও কল্যাণমূলক কাজে অংশ নিন।" },
];

function MembershipPage() {
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd) as Record<string, string>;
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      (e.target as HTMLFormElement).reset();
      toast.success("আপনার আবেদন সফলভাবে পাঠানো হয়েছে। ধন্যবাদ!");
    }, 800);
  };

  return (
    <>
      <PageHeader
        eyebrow="সদস্য হোন"
        title="আপনিও যুক্ত হোন"
        description="পাবনার উন্নয়ন, সামাজিক ঐক্য এবং জনস্বার্থে কাজ করতে আমাদের সাথে যুক্ত হোন।"
      />
      <section className="container-pnc py-14 md:py-20 grid gap-10 lg:grid-cols-5">
        <aside className="lg:col-span-2 space-y-4">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">সদস্যপদের সুবিধা</h2>
          {benefits.map((b) => (
            <div key={b.title} className="rounded-2xl border border-border bg-card p-6 shadow-card flex gap-4">
              <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <b.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{b.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{b.text}</p>
              </div>
            </div>
          ))}
          <div className="rounded-2xl bg-primary text-primary-foreground p-6 shadow-elegant">
            <CheckCircle2 className="h-7 w-7" />
            <h3 className="mt-3 font-semibold">কোনো ফি নেই</h3>
            <p className="mt-1 text-sm opacity-95">পিএনসি সদস্যপদ সম্পূর্ণ স্বেচ্ছাভিত্তিক ও বিনামূল্যে।</p>
          </div>
        </aside>

        <form onSubmit={onSubmit} className="lg:col-span-3 rounded-2xl border border-border bg-card p-6 md:p-8 shadow-card space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field name="name" label="পূর্ণ নাম *" />
            <Field name="phone" label="মোবাইল নম্বর *" type="tel" />
            <Field name="email" label="ইমেইল" type="email" />
            <Field name="profession" label="পেশা" />
            <div className="sm:col-span-2">
              <Field name="address" label="ঠিকানা *" />
            </div>
            <div className="sm:col-span-2">
              <Field name="interest" label="আগ্রহের ক্ষেত্র" placeholder="যেমন: শিক্ষা, স্বাস্থ্য, যুব উন্নয়ন" />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="message">বার্তা</Label>
              <Textarea id="message" name="message" rows={4} className="mt-1.5" placeholder="আপনি কীভাবে অবদান রাখতে চান?" />
            </div>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-red-accent px-6 py-3 text-sm font-semibold text-red-accent-foreground hover:opacity-90 transition disabled:opacity-60"
          >
            {submitting ? "পাঠানো হচ্ছে..." : "আবেদন পাঠান"}
          </button>
        </form>
      </section>
    </>
  );
}

function Field({ name, label, type = "text", placeholder }: { name: string; label: string; type?: string; placeholder?: string }) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} type={type} placeholder={placeholder} className="mt-1.5" />
    </div>
  );
}
