import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { Target, Eye, Award, BookOpen, Hospital, HeartPulse } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Pabna Nursing College — Government Nursing Institution" },
      { name: "description", content: "Learn about Pabna Nursing College, a government nursing education institution in Bangladesh aligned with BNMC and connected with the 250-bed General Hospital, Pabna." },
      { property: "og:title", content: "About Pabna Nursing College" },
      { property: "og:description", content: "Mission, vision and values of a credible government nursing institution in Pabna, Bangladesh." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About Us"
        title="An Institution Built for Healthcare Leadership"
        description="Pabna Nursing College is a key nursing education institution in Pabna, Bangladesh, training skilled, ethical, and clinically competent nursing professionals."
      />
      <section className="container-pnc py-16 md:py-20 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6 text-muted-foreground leading-relaxed">
          <p>
            Pabna Nursing College (PNC) combines classroom-based academic learning with practical
            clinical exposure through its connection with the 250-bed General Hospital, Pabna. As a
            government nursing institution, PNC operates within the framework of Bangladesh's
            national nursing education and follows the standards of the Bangladesh Nursing &
            Midwifery Council (BNMC) and the Directorate General of Nursing & Midwifery (DGNM).
          </p>
          <p>
            Our programs prepare students for diverse roles across hospital nursing, community
            health, midwifery, leadership, education and nursing research, with strong emphasis on
            ethics, evidence-based practice and patient-centred care.
          </p>
          <div className="grid gap-5 sm:grid-cols-2 mt-4">
            {[
              { icon: Target, title: "Mission", text: "Develop competent, compassionate, ethical nursing professionals serving Bangladesh's healthcare system." },
              { icon: Eye, title: "Vision", text: "To be a leading center of nursing education and clinical excellence in Bangladesh." },
              { icon: Award, title: "Values", text: "Excellence, integrity, compassion, discipline, lifelong learning and service." },
              { icon: BookOpen, title: "Approach", text: "Evidence-based, patient-centred education integrating theory and clinical practice." },
            ].map((c) => (
              <div key={c.title} className="rounded-xl border border-border bg-card p-6 shadow-card">
                <c.icon className="h-6 w-6 text-primary" />
                <h3 className="mt-3 font-semibold text-foreground">{c.title}</h3>
                <p className="mt-1 text-sm">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
        <aside className="space-y-4">
          <div className="rounded-xl bg-primary text-primary-foreground p-6 shadow-elegant">
            <Hospital className="h-7 w-7 text-gold" />
            <h3 className="mt-3 font-semibold">Clinical Partner</h3>
            <p className="mt-1 text-sm opacity-90">250-bed General Hospital, Pabna — providing wide clinical exposure across departments.</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <HeartPulse className="h-7 w-7 text-primary" />
            <h3 className="mt-3 font-semibold">Recognized By</h3>
            <ul className="mt-2 text-sm text-muted-foreground space-y-1">
              <li>Bangladesh Nursing & Midwifery Council (BNMC)</li>
              <li>Directorate General of Nursing & Midwifery (DGNM)</li>
              <li>Ministry of Health & Family Welfare, Bangladesh</li>
            </ul>
          </div>
        </aside>
      </section>
    </>
  );
}
