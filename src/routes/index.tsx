import { createFileRoute, Link } from "@tanstack/react-router";
import {
  GraduationCap, Stethoscope, HeartPulse, Users, ShieldCheck, Award,
  BookOpenCheck, Activity, ArrowRight, Quote, Building2, Microscope,
} from "lucide-react";
import heroImg from "@/assets/hero-nursing.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pabna Nursing College — Government Nursing Education in Pabna, Bangladesh" },
      { name: "description", content: "Pabna Nursing College: BNMC-aligned BSc, Post-Basic BSc, Diploma in Nursing Science & Midwifery and Diploma in Midwifery, with clinical training at the 250-bed General Hospital, Pabna." },
      { property: "og:title", content: "Pabna Nursing College" },
      { property: "og:description", content: "Shaping the future of healthcare excellence in Bangladesh." },
    ],
  }),
  component: HomePage,
});

const badges = [
  { icon: ShieldCheck, label: "BNMC Aligned Curriculum" },
  { icon: Stethoscope, label: "Clinical Training at 250-bed General Hospital" },
  { icon: Award, label: "Government Nursing Education" },
  { icon: Microscope, label: "Research & Community Health Focus" },
];

const pillars = [
  { icon: GraduationCap, title: "Academic Excellence", desc: "Rigorous, evidence-based nursing curriculum aligned with national standards." },
  { icon: Stethoscope, title: "Clinical Integration", desc: "Hands-on training at the 250-bed General Hospital, Pabna." },
  { icon: HeartPulse, title: "Ethical Nursing Practice", desc: "Compassionate care grounded in professional ethics and discipline." },
  { icon: Users, title: "Community Health", desc: "Active contribution to public health awareness and community wellbeing." },
];

function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden gradient-hero text-primary-foreground">
        <div className="container-pnc grid gap-12 py-16 md:py-24 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold ring-1 ring-white/20">
              <Building2 className="h-3.5 w-3.5" /> Government Nursing Institution · Pabna
            </p>
            <h1 className="text-balance mt-5 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              Pabna Nursing College: Shaping the Future of Healthcare Excellence
            </h1>
            <p className="mt-5 max-w-xl text-base md:text-lg opacity-90">
              Academic excellence, clinical training, and compassionate healthcare leadership
              connected with the 250-bed General Hospital, Pabna.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/academics" className="inline-flex items-center gap-2 rounded-md bg-gold px-5 py-3 font-semibold text-gold-foreground hover:opacity-90 transition">
                Explore Programs <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/admission" className="inline-flex items-center gap-2 rounded-md border border-white/30 bg-white/5 px-5 py-3 font-semibold hover:bg-white/10 transition">
                Admission Information
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {badges.map((b) => (
                <div key={b.label} className="flex items-start gap-2 rounded-lg bg-white/8 p-3 ring-1 ring-white/15 backdrop-blur">
                  <b.icon className="h-5 w-5 shrink-0 text-gold" />
                  <span className="text-xs font-medium leading-snug">{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gold/20 blur-2xl" aria-hidden />
            <img
              src={heroImg}
              alt="Nursing students training at Pabna Nursing College"
              width={1600}
              height={1024}
              className="relative w-full rounded-2xl shadow-elegant ring-1 ring-white/20 object-cover aspect-[4/3]"
              fetchPriority="high"
            />
            <div className="absolute -bottom-5 -left-5 hidden md:flex items-center gap-3 rounded-xl bg-background text-foreground p-4 shadow-elegant ring-1 ring-border">
              <div className="rounded-md bg-primary-soft p-2 text-primary"><Activity className="h-6 w-6" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Clinical Partner</p>
                <p className="text-sm font-semibold">250-bed General Hospital, Pabna</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-20 md:py-28">
        <div className="container-pnc grid gap-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">About PNC</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-balance">
              An Institution Built for Healthcare Leadership
            </h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              Pabna Nursing College is a key nursing education institution in Pabna, Bangladesh,
              supporting the development of skilled, ethical, and clinically competent nursing
              professionals. The college combines classroom-based academic learning with practical
              clinical exposure through its connection with the 250-bed General Hospital, Pabna.
            </p>
            <Link to="/about" className="mt-6 inline-flex items-center gap-2 font-semibold text-primary hover:gap-3 transition-all">
              Learn more about our institution <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {pillars.map((p) => (
              <div key={p.title} className="group rounded-xl border border-border bg-card p-6 shadow-card hover:border-primary/40 hover:-translate-y-0.5 transition-all">
                <div className="inline-flex rounded-lg bg-primary-soft p-2.5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <p.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold">{p.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROGRAMS PREVIEW */}
      <section className="bg-surface py-20 md:py-24">
        <div className="container-pnc">
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Academic Programs</p>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold">Nursing Programs Offered</h2>
            </div>
            <Link to="/academics" className="inline-flex items-center gap-2 font-semibold text-primary">
              View all programs <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              { t: "BSc in Nursing", d: "4 Years" },
              { t: "Post-Basic BSc in Nursing", d: "2 Years" },
              { t: "Diploma in Nursing Science & Midwifery", d: "3 Years" },
              { t: "Diploma in Midwifery", d: "3 Years" },
            ].map((c) => (
              <Link to="/academics" key={c.t} className="group rounded-xl bg-card border border-border p-6 shadow-card hover:shadow-elegant hover:-translate-y-0.5 transition-all">
                <BookOpenCheck className="h-7 w-7 text-gold" />
                <h3 className="mt-4 font-semibold leading-snug">{c.t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{c.d}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                  View Details <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PRINCIPAL'S MESSAGE */}
      <section className="py-20 md:py-24">
        <div className="container-pnc">
          <div className="relative mx-auto max-w-4xl rounded-2xl bg-primary text-primary-foreground p-10 md:p-14 shadow-elegant overflow-hidden">
            <Quote className="absolute -top-4 -left-4 h-32 w-32 text-white/5" />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Message from the Principal</p>
            <h2 className="mt-3 text-2xl md:text-3xl font-bold text-balance">
              Building competent, compassionate nurses for Bangladesh
            </h2>
            <p className="mt-5 text-base md:text-lg opacity-90 leading-relaxed">
              "Our mission is to develop competent, compassionate, and responsible nursing
              professionals who can serve Bangladesh's healthcare system with excellence,
              discipline, and humanity."
            </p>
            <div className="mt-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-gold/20 ring-2 ring-gold flex items-center justify-center font-semibold text-gold">PR</div>
              <div>
                <p className="font-semibold">Office of the Principal</p>
                <p className="text-xs opacity-80">Pabna Nursing College</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-pnc pb-8">
        <div className="rounded-2xl border border-border bg-gradient-to-br from-primary-soft to-background p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-primary">Ready to begin your nursing career?</h3>
            <p className="mt-2 text-muted-foreground">Check the latest admission circular and prepare your application.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/admission" className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground hover:opacity-90">
              Admission Info
            </Link>
            <Link to="/notice-board" className="inline-flex items-center gap-2 rounded-md border border-primary/30 px-5 py-3 font-semibold text-primary hover:bg-primary-soft">
              View Notices
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
