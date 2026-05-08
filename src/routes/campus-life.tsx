import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { Stethoscope, FlaskConical, BookOpen, Users, HeartHandshake, CalendarDays, Music2 } from "lucide-react";

export const Route = createFileRoute("/campus-life")({
  head: () => ({
    meta: [
      { title: "Campus Life — Pabna Nursing College" },
      { name: "description", content: "Clinical training, skills lab, library, student activities and cultural events at Pabna Nursing College." },
      { property: "og:title", content: "Campus Life at PNC" },
      { property: "og:description", content: "A vibrant academic and clinical learning environment in Pabna." },
    ],
  }),
  component: CampusPage,
});

const items = [
  { icon: Stethoscope, t: "Clinical Training", d: "Structured rotations at the 250-bed General Hospital, Pabna across all major departments." },
  { icon: FlaskConical, t: "Skills Lab", d: "Simulation-based learning to build safe, competent nursing skills before clinical practice." },
  { icon: BookOpen, t: "Library", d: "Curated nursing and health science resources supporting study and research." },
  { icon: Users, t: "Student Activities", d: "Academic clubs, peer learning, leadership and volunteer initiatives." },
  { icon: HeartHandshake, t: "Public Health Awareness", d: "Community outreach, health camps and patient education programs." },
  { icon: CalendarDays, t: "National Nursing Day", d: "Annual celebration honouring the nursing profession and its leaders." },
  { icon: Music2, t: "Cultural & Academic Events", d: "Seminars, observances and cultural events that nurture all-round growth." },
];

function CampusPage() {
  return (
    <>
      <PageHeader
        eyebrow="Campus Life"
        title="A Learning Environment Built on Practice and Purpose"
        description="Beyond the classroom — clinical, cultural and community experiences that shape complete nurses."
      />
      <section className="container-pnc py-16 md:py-20 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {items.map((c) => (
          <article key={c.t} className="group rounded-2xl border border-border bg-card overflow-hidden shadow-card hover:shadow-elegant transition-shadow">
            <div className="h-32 gradient-hero relative">
              <c.icon className="h-12 w-12 text-gold absolute bottom-4 left-5" />
            </div>
            <div className="p-6">
              <h3 className="font-semibold text-lg">{c.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.d}</p>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
