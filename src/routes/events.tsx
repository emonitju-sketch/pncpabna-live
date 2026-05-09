import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Calendar, MapPin, Clock, UserPlus, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/site/PageHeader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "ইভেন্ট ক্যালেন্ডার — পাবনা নাগরিক কমিটি" },
      { name: "description", content: "পিএনসি-র আসন্ন সভা, কর্মসূচি ও কমিউনিটি ইভেন্টের তারিখ, স্থান ও নিবন্ধন।" },
      { property: "og:title", content: "ইভেন্ট ক্যালেন্ডার — পিএনসি" },
      { property: "og:description", content: "আসন্ন কর্মসূচি ও নিবন্ধন।" },
    ],
  }),
  component: EventsPage,
});

type Event = {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  location: string;
  registration_open: boolean;
};

const regSchema = z.object({
  full_name: z.string().trim().min(2, "নাম লিখুন").max(100),
  phone: z.string().trim().min(10, "সঠিক ফোন নম্বর দিন").max(20),
  email: z.string().trim().email("সঠিক ইমেইল").max(255).optional().or(z.literal("")),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("bn-BD", { day: "numeric", month: "long", year: "numeric" });
}
function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("bn-BD", { hour: "2-digit", minute: "2-digit" });
}

function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [openEvent, setOpenEvent] = useState<Event | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("events")
      .select("id, title, description, event_date, location, registration_open")
      .order("event_date", { ascending: true });
    if (error) toast.error(error.message);
    setEvents((data as Event[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const upcoming = events.filter((e) => new Date(e.event_date) >= new Date());
  const past = events.filter((e) => new Date(e.event_date) < new Date());

  return (
    <>
      <PageHeader
        eyebrow="ইভেন্ট ক্যালেন্ডার"
        title="আসন্ন সভা ও কর্মসূচি"
        description="পিএনসি-র আসন্ন ইভেন্টগুলো দেখুন এবং সরাসরি নিবন্ধন করুন।"
      />
      <section className="container-pnc py-12 md:py-16 space-y-12">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-5">আসন্ন ইভেন্ট</h2>
          {loading ? (
            <p className="text-muted-foreground">লোড হচ্ছে...</p>
          ) : upcoming.length === 0 ? (
            <p className="text-muted-foreground rounded-2xl border border-dashed border-border bg-card p-8 text-center">এই মুহূর্তে কোনো আসন্ন ইভেন্ট নেই।</p>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((e) => (
                <EventCard key={e.id} event={e} onRegister={() => setOpenEvent(e)} />
              ))}
            </div>
          )}
        </div>

        {past.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-5">পূর্ববর্তী ইভেন্ট</h2>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {past.map((e) => <EventCard key={e.id} event={e} past />)}
            </div>
          </div>
        )}
      </section>

      {openEvent && <RegisterModal event={openEvent} onClose={() => setOpenEvent(null)} />}
    </>
  );
}

function EventCard({ event, onRegister, past }: { event: Event; onRegister?: () => void; past?: boolean }) {
  return (
    <article className={`card-hover rounded-2xl border border-border bg-card p-6 shadow-card flex flex-col ${past ? "opacity-75" : ""}`}>
      <div className="flex items-start gap-3">
        <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
          <Calendar className="h-6 w-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-foreground">{event.title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{fmtDate(event.event_date)} · <Clock className="inline h-3 w-3" /> {fmtTime(event.event_date)}</p>
        </div>
      </div>
      {event.description && <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{event.description}</p>}
      <p className="mt-3 text-sm flex items-start gap-1.5 text-foreground/80"><MapPin className="h-4 w-4 mt-0.5 shrink-0 text-red-accent" /> {event.location}</p>
      {!past && event.registration_open && onRegister && (
        <button onClick={onRegister} className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-red-accent px-4 py-2 text-sm font-semibold text-red-accent-foreground hover:opacity-90 transition">
          <UserPlus className="h-4 w-4" /> নিবন্ধন করুন
        </button>
      )}
      {!past && !event.registration_open && (
        <p className="mt-5 text-xs text-muted-foreground italic">নিবন্ধন বন্ধ</p>
      )}
    </article>
  );
}

function RegisterModal({ event, onClose }: { event: Event; onClose: () => void }) {
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = regSchema.safeParse(Object.fromEntries(fd));
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    setBusy(true);
    const { error } = await supabase.from("event_registrations").insert({
      event_id: event.id,
      full_name: parsed.data.full_name,
      phone: parsed.data.phone,
      email: parsed.data.email || null,
      notes: parsed.data.notes || null,
    });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("নিবন্ধন সফল! ধন্যবাদ।");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-elegant" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-bold text-foreground text-lg">নিবন্ধন: {event.title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{fmtDate(event.event_date)}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={submit} className="mt-5 space-y-4">
          <div><Label htmlFor="full_name">পূর্ণ নাম *</Label><Input id="full_name" name="full_name" className="mt-1.5" required /></div>
          <div><Label htmlFor="phone">মোবাইল *</Label><Input id="phone" name="phone" type="tel" className="mt-1.5" required /></div>
          <div><Label htmlFor="email">ইমেইল</Label><Input id="email" name="email" type="email" className="mt-1.5" /></div>
          <div><Label htmlFor="notes">মন্তব্য</Label><Textarea id="notes" name="notes" rows={2} className="mt-1.5" /></div>
          <button type="submit" disabled={busy} className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition disabled:opacity-60">
            {busy ? "পাঠানো হচ্ছে..." : "নিবন্ধন নিশ্চিত করুন"}
          </button>
        </form>
      </div>
    </div>
  );
}
