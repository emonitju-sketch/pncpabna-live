import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { PageHeader } from "@/components/site/PageHeader";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Pabna Nursing College" },
      { name: "description", content: "Contact Pabna Nursing College, located at the 250-bed General Hospital area, Pabna, Bangladesh. Phone, email and contact form." },
      { property: "og:title", content: "Contact Pabna Nursing College" },
      { property: "og:description", content: "Get in touch with PNC by phone, email or contact form." },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  phone: z.string().trim().min(6, "Enter a valid phone").max(20),
  email: z.string().trim().email("Enter a valid email").max(255),
  message: z.string().trim().min(10, "Message is too short").max(1000),
});

function ContactPage() {
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      name: fd.get("name"),
      phone: fd.get("phone"),
      email: fd.get("email"),
      message: fd.get("message"),
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Thank you — your message has been received.");
      (e.target as HTMLFormElement).reset();
    }, 600);
  };

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Contact Pabna Nursing College"
        description="We welcome enquiries from prospective students, alumni, partners, and the community."
      />

      <section className="container-pnc py-16 md:py-20 grid gap-10 lg:grid-cols-3">
        <aside className="space-y-4">
          {[
            { icon: MapPin, t: "Address", d: "Pabna Nursing College, 250 Bedded General Hospital Area, Pabna, Bangladesh" },
            { icon: Phone, t: "Phone", d: "+880 2588 846042", href: "tel:+8802588846042" },
            { icon: Mail, t: "Email", d: "ncprincipal.pabna@gmail.com", href: "mailto:ncprincipal.pabna@gmail.com" },
          ].map((c) => (
            <div key={c.t} className="rounded-xl border border-border bg-card p-6 shadow-card">
              <c.icon className="h-6 w-6 text-primary" />
              <h3 className="mt-3 font-semibold">{c.t}</h3>
              {c.href ? (
                <a href={c.href} className="mt-1 block text-sm text-muted-foreground hover:text-primary">{c.d}</a>
              ) : (
                <p className="mt-1 text-sm text-muted-foreground">{c.d}</p>
              )}
            </div>
          ))}
        </aside>

        <form onSubmit={onSubmit} className="lg:col-span-2 rounded-2xl border border-border bg-card p-8 shadow-card space-y-5">
          <div>
            <h2 className="text-2xl font-bold">Send us a message</h2>
            <p className="mt-1 text-sm text-muted-foreground">We will respond during regular office hours.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field name="name" label="Full Name" />
            <Field name="phone" label="Phone" type="tel" />
            <div className="md:col-span-2"><Field name="email" label="Email" type="email" /></div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium">Message</label>
              <textarea
                name="message"
                rows={5}
                maxLength={1000}
                required
                className="mt-1 w-full rounded-md border border-input bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
          <button
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
          >
            <Send className="h-4 w-4" /> {submitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </section>

      <section className="container-pnc pb-20">
        <div className="overflow-hidden rounded-2xl border border-border shadow-card">
          <iframe
            title="Pabna Nursing College location"
            src="https://www.google.com/maps?q=Pabna+General+Hospital,+Pabna,+Bangladesh&output=embed"
            className="w-full h-[420px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </>
  );
}

function Field({ name, label, type = "text" }: { name: string; label: string; type?: string }) {
  return (
    <div>
      <label className="text-sm font-medium" htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        required
        maxLength={255}
        className="mt-1 w-full h-11 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}
