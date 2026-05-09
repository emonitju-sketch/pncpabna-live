import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FileText, Download, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { publicUrl } from "@/hooks/use-auth";
import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "প্রতিবেদন ও নিউজলেটার — পাবনা নাগরিক কমিটি" },
      { name: "description", content: "পিএনসি-র বার্ষিক কার্যক্রম প্রতিবেদন ও নিউজলেটার ডাউনলোড করুন।" },
      { property: "og:title", content: "প্রতিবেদন — পিএনসি" },
      { property: "og:description", content: "বার্ষিক কার্যক্রম প্রতিবেদন ও নিউজলেটার।" },
    ],
  }),
  component: ReportsPage,
});

type Report = { id: string; title: string; year: number; description: string | null; file_path: string; published_at: string };

function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("reports")
        .select("id, title, year, description, file_path, published_at")
        .order("year", { ascending: false });
      if (error) toast.error(error.message);
      setReports((data as Report[]) || []);
      setLoading(false);
    })();
  }, []);

  const grouped = reports.reduce<Record<number, Report[]>>((acc, r) => {
    (acc[r.year] ||= []).push(r); return acc;
  }, {});
  const years = Object.keys(grouped).map(Number).sort((a, b) => b - a);

  return (
    <>
      <PageHeader
        eyebrow="প্রতিবেদন ও নিউজলেটার"
        title="বার্ষিক কার্যক্রম প্রতিবেদন"
        description="পিএনসি-র বছরভিত্তিক কার্যক্রম প্রতিবেদন ও নিউজলেটার ডাউনলোড করুন।"
      />
      <section className="container-pnc py-12 md:py-16">
        {loading ? (
          <p className="text-muted-foreground">লোড হচ্ছে...</p>
        ) : reports.length === 0 ? (
          <p className="text-muted-foreground rounded-2xl border border-dashed border-border bg-card p-8 text-center">
            এখনো কোনো প্রতিবেদন প্রকাশিত হয়নি।
          </p>
        ) : (
          <div className="space-y-10">
            {years.map((y) => (
              <div key={y}>
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" /> {y.toLocaleString("bn-BD", { useGrouping: false })} সাল
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {grouped[y].map((r) => (
                    <article key={r.id} className="card-hover rounded-2xl border border-border bg-card p-6 shadow-card flex flex-col">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-red-accent/10 text-red-accent">
                        <FileText className="h-6 w-6" />
                      </div>
                      <h3 className="mt-4 font-bold text-foreground">{r.title}</h3>
                      {r.description && <p className="mt-2 text-sm text-muted-foreground line-clamp-3 flex-1">{r.description}</p>}
                      <a
                        href={publicUrl("reports", r.file_path)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
                      >
                        <Download className="h-4 w-4" /> PDF ডাউনলোড
                      </a>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
