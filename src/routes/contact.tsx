import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { PageHeader } from "@/components/site/PageHeader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Facebook, MessageCircle, Send, Clock } from "lucide-react";
import contactIllustration from "@/assets/contact-illustration.jpg";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "যোগাযোগ — পাবনা নাগরিক কমিটি" },
      { name: "description", content: "পাবনা নাগরিক কমিটি - পিএনসি-র সাথে যোগাযোগ করুন। ফোন, ইমেইল ও ফেসবুক মেসেঞ্জার।" },
      { property: "og:title", content: "যোগাযোগ — পিএনসি" },
      { property: "og:description", content: "আমাদের সাথে যোগাযোগ করুন।" },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "নাম লিখুন").max(100),
  phone: z.string().trim().min(10, "সঠিক মোবাইল দিন").max(20),
  email: z.string().trim().email("সঠিক ইমেইল দিন").max(255).optional().or(z.literal("")),
  subject: z.string().trim().min(2, "বিষয় লিখুন").max(150),
  message: z.string().trim().min(5, "বার্তা লিখুন").max(1000),
});

function ContactPage() {
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
      toast.success("আপনার বার্তা পাঠানো হয়েছে। ধন্যবাদ!");
    }, 700);
  };

  return (
    <>
      <PageHeader
        eyebrow="যোগাযোগ"
        title="যোগাযোগ করুন"
        description="যেকোনো প্রশ্ন, পরামর্শ বা সহযোগিতার জন্য আমাদের সাথে যোগাযোগ করুন।"
      />

      {/* Hero illustration band */}
      <section className="container-pnc pt-10 md:pt-14">
        <div className="grid gap-8 lg:grid-cols-2 items-center rounded-3xl border border-border bg-gradient-to-br from-primary-soft/60 via-card to-primary-soft/30 overflow-hidden shadow-card">
          <div className="p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-snug">
              একটি বার্তা — হাজারো সম্ভাবনা
            </h2>
            <p className="mt-3 text-foreground/75 leading-relaxed">
              পাবনার যেকোনো নাগরিক সমস্যা, পরামর্শ বা সহযোগিতার আগ্রহ — সরাসরি আমাদের জানান।
              পিএনসি প্রতিটি বার্তা গুরুত্ব সহকারে পড়ে এবং দ্রুত সাড়া দেয়।
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-card/70 backdrop-blur p-3 border border-border/60">
                <Clock className="h-4 w-4 text-primary mb-1.5" />
                <div className="font-semibold text-foreground">২৪ ঘণ্টায়</div>
                <div className="text-xs text-muted-foreground">গড় উত্তর</div>
              </div>
              <div className="rounded-xl bg-card/70 backdrop-blur p-3 border border-border/60">
                <MessageCircle className="h-4 w-4 text-primary mb-1.5" />
                <div className="font-semibold text-foreground">সরাসরি</div>
                <div className="text-xs text-muted-foreground">Messenger সাপোর্ট</div>
              </div>
            </div>
          </div>
          <div className="relative h-full min-h-[280px] md:min-h-[360px]">
            <img
              src={contactIllustration}
              alt="পিএনসি নাগরিক সংলাপ"
              loading="lazy"
              width={1024}
              height={1024}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="container-pnc py-14 md:py-20 grid gap-10 lg:grid-cols-5">
        <aside className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl bg-primary text-primary-foreground p-6 shadow-elegant space-y-4">
            <div>
              <h3 className="font-semibold text-lg">পাবনা নাগরিক কমিটি - পিএনসি</h3>
              <p className="text-sm opacity-90 mt-1">নাগরিক ঐক্যেই বদলাবে পাবনা।</p>
            </div>
            <div className="space-y-2.5 text-sm">
              <p className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 shrink-0" /> পাবনা সদর, পাবনা, বাংলাদেশ</p>
              <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> <a href="tel:+8801716808074" className="hover:underline">+৮৮০ ১৭১৬-৮০৮০৭৪</a></p>
              <p className="flex items-center gap-2"><Mail className="h-4 w-4" /> <a href="mailto:pnc.pabna@outlook.com" className="hover:underline break-all">pnc.pabna@outlook.com</a></p>
            </div>
          </div>

          <a href="https://m.me/pncpabna" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-2xl border border-border bg-card p-5 shadow-card card-hover">
            <MessageCircle className="h-6 w-6 text-primary" />
            <div>
              <div className="font-semibold text-foreground">Messenger-এ যোগাযোগ</div>
              <div className="text-xs text-muted-foreground">দ্রুত উত্তরের জন্য মেসেজ করুন</div>
            </div>
          </a>
          <a href="https://www.facebook.com/pncpabna/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-2xl border border-border bg-card p-5 shadow-card card-hover">
            <Facebook className="h-6 w-6 text-primary" />
            <div>
              <div className="font-semibold text-foreground">আমাদের ফেসবুক পেজ</div>
              <div className="text-xs text-muted-foreground">facebook.com/pncpabna</div>
            </div>
          </a>
        </aside>

        <form onSubmit={onSubmit} className="lg:col-span-3 rounded-2xl border border-border bg-card p-6 md:p-8 shadow-card space-y-5">
          <div>
            <h3 className="text-xl font-bold text-foreground">আমাদের বার্তা পাঠান</h3>
            <p className="text-sm text-muted-foreground mt-1">নিচের ফর্মটি পূরণ করুন — আমরা যোগাযোগ করব।</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field name="name" label="নাম *" />
            <Field name="phone" label="মোবাইল *" type="tel" />
            <Field name="email" label="ইমেইল" type="email" />
            <Field name="subject" label="বিষয় *" />
            <div className="sm:col-span-2">
              <Label htmlFor="message">বার্তা *</Label>
              <Textarea id="message" name="message" rows={5} className="mt-1.5" />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition disabled:opacity-60"
            >
              <Send className="h-4 w-4" /> {submitting ? "পাঠানো হচ্ছে..." : "বার্তা পাঠান"}
            </button>
            <a href="https://m.me/pncpabna" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-red-accent px-6 py-3 text-sm font-semibold text-red-accent-foreground hover:opacity-90 transition">
              <MessageCircle className="h-4 w-4" /> Messenger-এ যোগাযোগ
            </a>
          </div>
        </form>
      </section>

      <section className="container-pnc pb-20">
        <div className="overflow-hidden rounded-2xl border border-border shadow-card">
          <iframe
            title="Pabna Map"
            src="https://www.google.com/maps?q=Pabna,Bangladesh&output=embed"
            width="100%"
            height="380"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block w-full"
          />
        </div>
      </section>
    </>
  );
}

function Field({ name, label, type = "text" }: { name: string; label: string; type?: string }) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} type={type} className="mt-1.5" />
    </div>
  );
}
