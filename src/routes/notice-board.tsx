import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { Search, FileText, Calendar } from "lucide-react";

export const Route = createFileRoute("/notice-board")({
  head: () => ({
    meta: [
      { title: "Notice Board — Pabna Nursing College" },
      { name: "description", content: "Latest admission notices, exam routines, results, class routines and announcements from Pabna Nursing College." },
      { property: "og:title", content: "PNC Notice Board" },
      { property: "og:description", content: "Official notices and announcements from Pabna Nursing College." },
    ],
  }),
  component: NoticePage,
});

const CATEGORIES = [
  "All",
  "Admission Notice",
  "Exam Routine",
  "Result",
  "Class Routine",
  "Scholarship",
  "General Announcement",
] as const;

type Cat = (typeof CATEGORIES)[number];

const NOTICES: { title: string; date: string; cat: Exclude<Cat, "All">; summary: string }[] = [
  { title: "Admission Circular Published", date: "2025-01-15", cat: "Admission Notice", summary: "Official nursing admission circular for the upcoming academic session has been published." },
  { title: "Exam Routine Update", date: "2025-02-02", cat: "Exam Routine", summary: "Updated exam routine for ongoing semester. Please check the schedule and report on time." },
  { title: "Student Registration Notice", date: "2025-02-10", cat: "General Announcement", summary: "All admitted students must complete registration formalities by the specified date." },
  { title: "Clinical Rotation Schedule", date: "2025-02-18", cat: "Class Routine", summary: "Clinical rotation assignments for current batch have been released. See the notice for details." },
  { title: "Semester Result Published", date: "2025-03-05", cat: "Result", summary: "Final semester results are now available. Visit the office for verified copies." },
  { title: "Government Scholarship Announcement", date: "2025-03-12", cat: "Scholarship", summary: "Eligible students may apply for the government nursing scholarship. Deadlines apply." },
];

function NoticePage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<Cat>("All");

  const filtered = useMemo(() => {
    return NOTICES.filter((n) => (cat === "All" || n.cat === cat) &&
      (q === "" || (n.title + n.summary).toLowerCase().includes(q.toLowerCase())));
  }, [q, cat]);

  return (
    <>
      <PageHeader eyebrow="Notice Board" title="Official Notices & Announcements" description="Stay updated with admission circulars, exam routines, results and important announcements." />

      <section className="container-pnc py-12">
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="relative md:w-96">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search notices..."
              className="w-full h-11 rounded-md border border-input bg-background pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  cat === c ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-primary-soft"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {filtered.map((n) => (
            <li key={n.title} className="rounded-xl border border-border bg-card p-6 shadow-card hover:shadow-elegant transition-shadow">
              <div className="flex items-center gap-2 text-xs">
                <span className="rounded-full bg-primary-soft px-2.5 py-1 font-semibold text-primary">{n.cat}</span>
                <span className="flex items-center gap-1 text-muted-foreground"><Calendar className="h-3.5 w-3.5" /> {n.date}</span>
              </div>
              <h3 className="mt-3 font-semibold flex items-start gap-2">
                <FileText className="h-5 w-5 text-gold mt-0.5 shrink-0" /> {n.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{n.summary}</p>
              <button className="mt-4 text-sm font-semibold text-primary hover:underline">Read more →</button>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="md:col-span-2 text-center text-muted-foreground py-12">No notices match your search.</li>
          )}
        </ul>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          <button className="rounded-md border border-primary/30 bg-primary-soft px-5 py-2.5 text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition">
            Student Login
          </button>
          <button className="rounded-md border border-primary/30 bg-primary-soft px-5 py-2.5 text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition">
            Faculty Login
          </button>
        </div>
      </section>
    </>
  );
}
