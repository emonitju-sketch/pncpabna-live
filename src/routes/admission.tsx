import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { CheckCircle2, FileText, ClipboardList, BookCheck, UserCheck, GraduationCap } from "lucide-react";

export const Route = createFileRoute("/admission")({
  head: () => ({
    meta: [
      { title: "Admission — Pabna Nursing College, Bangladesh" },
      { name: "description", content: "Admission requirements, entrance exam subjects and how to apply to Pabna Nursing College through the official DGNM/BNMC nursing admission process." },
      { property: "og:title", content: "Nursing Admission at Pabna Nursing College" },
      { property: "og:description", content: "Official admission requirements and step-by-step application process." },
    ],
  }),
  component: AdmissionPage,
});

const requirements = [
  "SSC/HSC academic background",
  "Minimum combined GPA requirement (per official circular)",
  "Science-related knowledge preferred",
  "Admission through national nursing admission process under relevant authorities",
];

const subjects = ["General Science", "English", "Mathematics", "General Knowledge"];

const steps = [
  { icon: FileText, t: "Check Official Admission Circular", d: "Refer to the latest DGNM/BNMC nursing admission circular." },
  { icon: ClipboardList, t: "Prepare Required Documents", d: "Academic transcripts, certificates, photos and ID as specified." },
  { icon: BookCheck, t: "Apply Through Official Process", d: "Submit your application via the official DGNM/BNMC channel." },
  { icon: UserCheck, t: "Attend Admission Test", d: "Sit for the centralized written examination." },
  { icon: GraduationCap, t: "Final Selection & Enrollment", d: "Complete final selection, verification and enrollment at PNC." },
];

function AdmissionPage() {
  return (
    <>
      <PageHeader
        eyebrow="Admission"
        title="Begin Your Journey in Nursing"
        description="A clear, transparent admission process aligned with national nursing education authorities."
      />
      <section className="container-pnc py-16 md:py-20 grid gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-card">
          <h2 className="text-2xl font-bold text-primary">Admission Requirements</h2>
          <ul className="mt-5 space-y-3">
            {requirements.map((r) => (
              <li key={r} className="flex items-start gap-3 text-sm">
                <CheckCircle2 className="h-5 w-5 text-success mt-0.5 shrink-0" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl bg-primary text-primary-foreground p-8 shadow-elegant">
          <h2 className="text-2xl font-bold">Entrance Exam Subjects</h2>
          <p className="mt-2 text-sm opacity-90">Centralized written test administered by the relevant authority.</p>
          <ul className="mt-5 grid grid-cols-2 gap-3">
            {subjects.map((s) => (
              <li key={s} className="rounded-lg bg-white/10 px-4 py-3 text-sm font-medium ring-1 ring-white/15">{s}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-pnc pb-20">
        <h2 className="text-2xl md:text-3xl font-bold text-center">How to Apply</h2>
        <p className="mt-2 text-center text-muted-foreground">Follow these steps to complete your admission process.</p>
        <ol className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
          {steps.map((s, i) => (
            <li key={s.t} className="relative rounded-xl border border-border bg-card p-6 shadow-card">
              <span className="absolute -top-3 left-6 rounded-full bg-gold px-3 py-1 text-xs font-bold text-gold-foreground">Step {i + 1}</span>
              <s.icon className="h-7 w-7 text-primary mt-2" />
              <h3 className="mt-3 font-semibold">{s.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
