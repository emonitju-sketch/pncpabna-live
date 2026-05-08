import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { Clock, BookOpenCheck, Stethoscope, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/academics")({
  head: () => ({
    meta: [
      { title: "Academics — BSc, Post-Basic BSc, Diploma in Nursing & Midwifery" },
      { name: "description", content: "Explore nursing programs at Pabna Nursing College: BSc in Nursing, Post-Basic BSc, Diploma in Nursing Science & Midwifery, and Diploma in Midwifery — BNMC aligned." },
      { property: "og:title", content: "Academics at Pabna Nursing College" },
      { property: "og:description", content: "BNMC-aligned nursing programs with strong clinical exposure." },
    ],
  }),
  component: AcademicsPage,
});

const programs = [
  {
    title: "BSc in Nursing",
    duration: "4 Years",
    learning: ["Clinical reasoning", "Health science", "Nursing research", "Leadership", "Community health"],
    clinical: "Comprehensive rotations across medicine, surgery, paediatrics, obstetrics and community health.",
  },
  {
    title: "Post-Basic BSc in Nursing",
    duration: "2 Years",
    learning: ["Professional upgrading", "Advanced nursing concepts", "Academic advancement", "Leadership preparation"],
    clinical: "Advanced practice exposure for registered nurses to expand clinical and managerial competencies.",
  },
  {
    title: "Diploma in Nursing Science & Midwifery",
    duration: "3 Years",
    learning: ["Bedside nursing", "Clinical skills", "Patient care", "Maternal & child health"],
    clinical: "Hands-on bedside nursing at the 250-bed General Hospital, Pabna with structured rotations.",
  },
  {
    title: "Diploma in Midwifery",
    duration: "3 Years",
    learning: ["Maternal care", "Neonatal health", "Safe delivery support", "Community-based maternity services"],
    clinical: "Supervised midwifery practice across antenatal, intranatal, postnatal and community services.",
  },
];

function AcademicsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Academics"
        title="BNMC-Aligned Nursing Programs"
        description="Programs designed for academic depth, clinical competency, and ethical professional practice."
      />
      <section className="container-pnc py-16 md:py-20 grid gap-6 md:grid-cols-2">
        {programs.map((p) => (
          <article key={p.title} className="group rounded-2xl border border-border bg-card p-7 shadow-card hover:shadow-elegant transition-shadow">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
              <Clock className="h-4 w-4" /> {p.duration}
            </div>
            <h2 className="mt-2 text-2xl font-bold">{p.title}</h2>

            <div className="mt-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <BookOpenCheck className="h-4 w-4 text-gold" /> Key Learning Areas
              </h3>
              <ul className="mt-2 flex flex-wrap gap-2">
                {p.learning.map((l) => (
                  <li key={l} className="rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary">{l}</li>
                ))}
              </ul>
            </div>

            <div className="mt-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Stethoscope className="h-4 w-4 text-gold" /> Clinical Exposure
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.clinical}</p>
            </div>

            <Link to="/admission" className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
              View Details <ArrowRight className="h-4 w-4" />
            </Link>
          </article>
        ))}
      </section>
    </>
  );
}
