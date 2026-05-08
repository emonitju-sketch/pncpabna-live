import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { Mail, Microscope, BookOpen } from "lucide-react";

export const Route = createFileRoute("/faculty")({
  head: () => ({
    meta: [
      { title: "Faculty & Research — Pabna Nursing College" },
      { name: "description", content: "Meet the faculty of Pabna Nursing College and explore research focused on evidence-based nursing practice and community health." },
      { property: "og:title", content: "Faculty & Research at PNC" },
      { property: "og:description", content: "Faculty profiles and research spotlight on nursing practice in Bangladesh." },
    ],
  }),
  component: FacultyPage,
});

const faculty = [
  { name: "Office of the Principal", role: "Principal", dept: "Administration & Academic Affairs" },
  { name: "Vice Principal", role: "Vice Principal", dept: "Academic Coordination" },
  { name: "Faculty Member", role: "Senior Instructor", dept: "Medical-Surgical Nursing" },
  { name: "Faculty Member", role: "Instructor", dept: "Maternal & Child Health Nursing" },
  { name: "Faculty Member", role: "Instructor", dept: "Community Health Nursing" },
  { name: "Faculty Member", role: "Instructor", dept: "Fundamentals of Nursing" },
  { name: "Faculty Member", role: "Instructor", dept: "Midwifery" },
  { name: "Faculty Member", role: "Clinical Instructor", dept: "Clinical Training" },
];

function initials(s: string) {
  return s.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

function FacultyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Faculty & Research"
        title="Educators Shaping the Next Generation of Nurses"
        description="Our faculty bring academic rigour, clinical depth and ethical leadership to every classroom and clinical setting."
      />

      <section className="container-pnc py-16 md:py-20">
        <h2 className="text-2xl md:text-3xl font-bold">Faculty Profiles</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {faculty.map((f, i) => (
            <article key={i} className="rounded-2xl border border-border bg-card p-6 shadow-card hover:shadow-elegant transition-shadow">
              <div className="h-20 w-20 rounded-full gradient-hero text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto ring-4 ring-primary-soft">
                {initials(f.name)}
              </div>
              <h3 className="mt-4 text-center font-semibold">{f.name}</h3>
              <p className="text-center text-sm text-primary font-medium">{f.role}</p>
              <p className="text-center text-xs text-muted-foreground mt-1">{f.dept}</p>
              <a href="mailto:ncprincipal.pabna@gmail.com" className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground hover:text-primary">
                <Mail className="h-3.5 w-3.5" /> Contact via office
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-surface py-16 md:py-20">
        <div className="container-pnc grid gap-10 lg:grid-cols-2 items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Research Spotlight</p>
            <h2 className="mt-3 text-3xl font-bold">Research & Evidence-Based Nursing Practice</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Pabna Nursing College encourages academic inquiry, nursing research, and
              evidence-based practice. Faculty and students contribute to public health awareness,
              clinical knowledge, and professional development.
            </p>
          </div>
          <div className="rounded-2xl bg-primary text-primary-foreground p-8 shadow-elegant">
            <div className="flex items-center gap-3 text-gold">
              <Microscope className="h-6 w-6" />
              <span className="text-xs font-semibold uppercase tracking-wider">Featured Study</span>
            </div>
            <h3 className="mt-3 text-xl md:text-2xl font-bold">
              Nurses' Anxiety and Depression While Providing Care to COVID-19 Patients
            </h3>
            <p className="mt-3 text-sm opacity-90">
              An exploration of mental health challenges among frontline nurses, contributing
              evidence to inform institutional support, training, and resilience-building programs
              in nursing practice.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-1.5 text-xs font-medium ring-1 ring-white/20">
              <BookOpen className="h-3.5 w-3.5 text-gold" /> Nursing Research · Public Health
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
