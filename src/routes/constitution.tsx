import { useState, useMemo, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { QRCodeSVG } from "qrcode.react";
import jsPDF from "jspdf";
import { Download, Share2, Search, BookOpen, FileText } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import constitution from "@/data/constitution.json";
import { ConstitutionGate, useConstitutionUnlocked } from "@/components/site/ConstitutionGate";

type Chapter = { num: string; title: string; body: string };
type Amendment = { id: string; version: string; change_summary_bn: string; effective_date: string };

export const Route = createFileRoute("/constitution")({
  head: () => ({
    meta: [
      { title: "গঠনতন্ত্র - পাবনা নাগরিক কমিটি (PNC)" },
      { name: "description", content: "পাবনা নাগরিক কমিটির পূর্ণাঙ্গ গঠনতন্ত্র - অধ্যায় ভিত্তিক, খোঁজযোগ্য, PDF ডাউনলোড এবং QR অ্যাক্সেস সহ।" },
      { property: "og:title", content: "গঠনতন্ত্র - পাবনা নাগরিক কমিটি (PNC)" },
      { property: "og:description", content: "নাগরিক ঐক্যেই বদলাবে পাবনা - পিএনসি গঠনতন্ত্র v1.0" },
      { property: "og:url", content: "https://pncpab.lovable.app/constitution" },
    ],
    links: [{ rel: "canonical", href: "https://pncpab.lovable.app/constitution" }],
  }),
  component: ConstitutionPage,
});

const data = constitution as { preamble: string; chapters: Chapter[] };
const allChapters: Chapter[] = [
  { num: "০", title: "ভূমিকা (Preamble)", body: data.preamble },
  ...data.chapters,
];

function ConstitutionPage() {
  const [query, setQuery] = useState("");
  const [activeNum, setActiveNum] = useState<string>(allChapters[0].num);
  const [amendments, setAmendments] = useState<Amendment[]>([]);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    setShareUrl(window.location.href);
    supabase
      .from("constitution_amendments")
      .select("*")
      .order("effective_date", { ascending: false })
      .then(({ data }) => setAmendments((data as Amendment[]) ?? []));
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return allChapters;
    const q = query.toLowerCase();
    return allChapters.filter(
      (c) => c.title.toLowerCase().includes(q) || c.body.toLowerCase().includes(q),
    );
  }, [query]);

  const active = allChapters.find((c) => c.num === activeNum) ?? allChapters[0];
  const latestVersion = amendments[0]?.version ?? "v1.0";

  const downloadPDF = () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const margin = 40;
    const width = doc.internal.pageSize.getWidth() - margin * 2;
    let y = margin;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Pabna Nagorik Committee (PNC) — Constitution", margin, y);
    y += 22;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Version ${latestVersion}  •  ${new Date().toLocaleDateString("en-GB")}`, margin, y);
    y += 18;
    doc.text("Bengali text below — render with Unicode-capable viewer.", margin, y);
    y += 24;

    allChapters.forEach((c) => {
      const heading = `অধ্যায় ${c.num}: ${c.title}`;
      const lines = doc.splitTextToSize(`${heading}\n\n${c.body}\n\n`, width);
      lines.forEach((line: string) => {
        if (y > doc.internal.pageSize.getHeight() - margin) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin, y);
        y += 14;
      });
      y += 10;
    });
    doc.save(`PNC-Constitution-${latestVersion}.pdf`);
  };

  const share = async () => {
    const text = "পাবনা নাগরিক কমিটি (PNC) - গঠনতন্ত্র";
    if (navigator.share) {
      try {
        await navigator.share({ title: text, url: shareUrl });
        return;
      } catch {
        // fallthrough
      }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${shareUrl}`)}`, "_blank");
  };

  return (
    <>
      <PageHeader
        eyebrow={`সংস্করণ ${latestVersion}`}
        title="পূর্ণাঙ্গ গঠনতন্ত্র"
        description="পাবনা নাগরিক কমিটির সাংগঠনিক মূল দলিল - অধ্যায়, ধারা ও ব্যাখ্যা সহ।"
      />

      <section className="container-pnc py-10">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="অধ্যায় খুঁজুন..."
                aria-label="গঠনতন্ত্রের অধ্যায় খুঁজুন"
                className="pl-9"
              />
            </div>
            <nav className="rounded-lg border border-border bg-card p-2 max-h-[60vh] overflow-auto">
              {filtered.map((c) => (
                <button
                  key={c.num}
                  onClick={() => setActiveNum(c.num)}
                  className={`block w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                    c.num === activeNum
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-primary-soft"
                  }`}
                >
                  <span className="font-semibold">অধ্যায় {c.num}</span>
                  <div className="text-xs opacity-90 mt-0.5">{c.title}</div>
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="text-sm text-muted-foreground p-3">কোনো ফলাফল পাওয়া যায়নি।</p>
              )}
            </nav>

            <div className="rounded-lg border border-border bg-card p-4 space-y-3">
              <button
                onClick={downloadPDF}
                className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                <Download className="h-4 w-4" /> PDF ডাউনলোড
              </button>
              <button
                onClick={share}
                className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-input px-3 py-2 text-sm font-medium hover:bg-primary-soft"
              >
                <Share2 className="h-4 w-4" /> শেয়ার করুন
              </button>
              {shareUrl && (
                <div className="flex flex-col items-center gap-2 pt-2 border-t border-border">
                  <QRCodeSVG value={shareUrl} size={120} />
                  <p className="text-xs text-muted-foreground text-center">
                    QR স্ক্যান করে মোবাইলে পড়ুন
                  </p>
                </div>
              )}
            </div>
          </aside>

          {/* Main content */}
          <main>
            <Tabs defaultValue="legal" className="w-full">
              <TabsList>
                <TabsTrigger value="legal" className="gap-2">
                  <BookOpen className="h-4 w-4" /> পূর্ণ পাঠ
                </TabsTrigger>
                <TabsTrigger value="amendments" className="gap-2">
                  <FileText className="h-4 w-4" /> সংশোধনী
                </TabsTrigger>
              </TabsList>

              <TabsContent value="legal">
                <article className="rounded-lg border border-border bg-card p-6 md:p-8">
                  <header className="border-b border-border pb-4 mb-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                      অধ্যায় {active.num}
                    </p>
                    <h2 className="mt-1 text-2xl md:text-3xl font-bold">{active.title}</h2>
                  </header>
                  <div className="prose prose-neutral max-w-none whitespace-pre-wrap text-base leading-relaxed">
                    {active.body}
                  </div>
                </article>
              </TabsContent>

              <TabsContent value="amendments">
                <div className="rounded-lg border border-border bg-card p-6">
                  <h2 className="text-xl font-semibold mb-4">সংশোধনী লগ</h2>
                  {amendments.length === 0 ? (
                    <p className="text-sm text-muted-foreground">কোনো সংশোধনী এখনো নেই।</p>
                  ) : (
                    <ul className="space-y-4">
                      {amendments.map((a) => (
                        <li key={a.id} className="border-l-4 border-primary pl-4">
                          <div className="flex items-baseline gap-2 flex-wrap">
                            <span className="font-semibold text-primary">{a.version}</span>
                            <span className="text-xs text-muted-foreground">
                              কার্যকর: {new Date(a.effective_date).toLocaleDateString("bn-BD")}
                            </span>
                          </div>
                          <p className="text-sm mt-1">{a.change_summary_bn}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </section>
    </>
  );
}
