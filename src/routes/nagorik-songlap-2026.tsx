import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, MapPin, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  EVENT_NAME_BN,
  EVENT_DESCRIPTION_BN,
  EVENT_START_ISO,
  EVENT_PATH,
  CLOSED_MESSAGE_BN,
  isRegistrationOpen,
} from "@/lib/nagorik-songlap";

const CANONICAL = `https://pncpabna.live${EVENT_PATH}`;

export const Route = createFileRoute("/nagorik-songlap-2026")({
  head: () => ({
    meta: [
      { title: `${EVENT_NAME_BN} | পাবনা নাগরিক কমিটি` },
      { name: "description", content: EVENT_DESCRIPTION_BN },
      { property: "og:type", content: "event" },
      { property: "og:title", content: EVENT_NAME_BN },
      { property: "og:description", content: EVENT_DESCRIPTION_BN },
      { property: "og:url", content: CANONICAL },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: EVENT_NAME_BN },
      { name: "twitter:description", content: EVENT_DESCRIPTION_BN },
    ],
    links: [{ rel: "canonical", href: CANONICAL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Event",
          name: EVENT_NAME_BN,
          description: EVENT_DESCRIPTION_BN,
          eventStatus: "https://schema.org/EventScheduled",
          eventAttendanceMode:
            "https://schema.org/OfflineEventAttendanceMode",
          startDate: EVENT_START_ISO,
          location: {
            "@type": "Place",
            name: "পাবনা",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Pabna",
              addressCountry: "BD",
            },
          },
          organizer: {
            "@type": "Organization",
            name: "Pabna Nagorik Committee",
            url: "https://pncpabna.live",
          },
          url: CANONICAL,
        }),
      },
    ],
  }),
  component: NagorikSonglapPage,
});

function NagorikSonglapPage() {
  const open = isRegistrationOpen();

  return (
    <main className="bg-surface min-h-[60vh]">
      <section className="gradient-hero text-primary-foreground">
        <div className="container-pnc py-14 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
            পাবনা নাগরিক কমিটি
          </p>
          <h1 className="mt-3 text-3xl md:text-5xl font-bold heading-display">
            {EVENT_NAME_BN}
          </h1>
          <p className="mt-4 max-w-2xl text-base md:text-lg opacity-95">
            {EVENT_DESCRIPTION_BN}
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur border border-white/25 px-4 py-1.5">
              <CalendarDays className="h-4 w-4" /> ২৭ জুন ২০২৬
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur border border-white/25 px-4 py-1.5">
              <MapPin className="h-4 w-4" /> পাবনা
            </span>
          </div>
        </div>
      </section>

      <section className="container-pnc py-12 md:py-16">
        {open ? <RegistrationForm /> : <ClosedState />}
      </section>
    </main>
  );
}

function ClosedState() {
  return (
    <div className="max-w-2xl mx-auto rounded-2xl border border-border bg-card p-8 md:p-12 text-center shadow-card">
      <h2 className="text-2xl md:text-3xl font-bold text-foreground">
        {CLOSED_MESSAGE_BN}
      </h2>
      <p className="mt-4 text-muted-foreground">
        {EVENT_NAME_BN}-এ আগ্রহ প্রকাশের জন্য ধন্যবাদ। আমাদের সাথে যুক্ত থাকুন
        ভবিষ্যৎ কার্যক্রমের আপডেট পেতে।
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-95 transition"
        >
          <ArrowLeft className="h-4 w-4" /> হোমপেজে ফিরে যান
        </Link>
        <Link
          to="/about"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground hover:bg-muted transition"
        >
          পাবনা নাগরিক কমিটি সম্পর্কে জানুন
        </Link>
      </div>
    </div>
  );
}

function RegistrationForm() {
  const [submitting, setSubmitting] = React.useState(false);
  const [done, setDone] = React.useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      phone: String(fd.get("phone") || "").trim(),
      comment: String(fd.get("comment") || "").trim() || null,
    };

    if (payload.name.length < 2 || !payload.email || payload.phone.length < 10) {
      toast.error("সব তথ্য সঠিকভাবে পূরণ করুন।");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/public/nagorik-songlap-2026", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { success: boolean; message: string };
      if (!res.ok || !data.success) {
        toast.error(data.message || "নিবন্ধন ব্যর্থ হয়েছে।");
        return;
      }
      toast.success(data.message);
      setDone(true);
    } catch (err) {
      console.error(err);
      toast.error("নেটওয়ার্ক ত্রুটি। আবার চেষ্টা করুন।");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="max-w-2xl mx-auto rounded-2xl border border-border bg-card p-8 md:p-12 text-center shadow-card">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          ধন্যবাদ! 🎉
        </h2>
        <p className="mt-4 text-muted-foreground">
          আপনার নিবন্ধন সফলভাবে সম্পন্ন হয়েছে। অনুষ্ঠানের বিস্তারিত শীঘ্রই
          আপনাকে জানানো হবে।
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-95 transition"
        >
          <ArrowLeft className="h-4 w-4" /> হোমপেজে ফিরে যান
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto rounded-2xl border border-border bg-card p-6 md:p-10 shadow-card">
      <h2 className="text-2xl md:text-3xl font-bold text-foreground">
        অংশগ্রহণের জন্য নিবন্ধন করুন
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        নিবন্ধনের শেষ তারিখ: ২৬ জুন ২০২৬, রাত ১১:৩০
      </p>

      <form onSubmit={onSubmit} className="mt-6 grid gap-4">
        <Field label="নাম *" name="name" required minLength={2} maxLength={100} />
        <Field label="ইমেইল *" name="email" type="email" required maxLength={255} />
        <Field
          label="মোবাইল নম্বর *"
          name="phone"
          type="tel"
          required
          minLength={10}
          maxLength={20}
          placeholder="01XXXXXXXXX"
        />
        <div className="grid gap-1.5">
          <label htmlFor="comment" className="text-sm font-medium text-foreground">
            মন্তব্য (ঐচ্ছিক)
          </label>
          <textarea
            id="comment"
            name="comment"
            rows={4}
            maxLength={1000}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="আপনার মতামত বা প্রশ্ন..."
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-red-accent px-6 py-3 text-sm md:text-base font-semibold text-red-accent-foreground hover:opacity-95 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> পাঠানো হচ্ছে...
            </>
          ) : (
            "নিবন্ধন সম্পন্ন করুন"
          )}
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  ...rest
}: {
  label: string;
  name: string;
  type?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        {...rest}
      />
    </div>
  );
}
