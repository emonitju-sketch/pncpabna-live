import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import {
  Copy,
  Check,
  Plug,
  ShieldCheck,
  Sparkles,
  Terminal,
  BookOpen,
  UserCircle,
  ListChecks,
  FileText,
  CalendarDays,
  UserPlus,
  MessageSquare,
  Play,
  Loader2,
} from "lucide-react";

export const Route = createFileRoute("/mcp-guide")({
  component: McpGuidePage,
  head: () => ({
    meta: [
      { title: "MCP ব্যবহার নির্দেশিকা — পিএনসি" },
      {
        name: "description",
        content:
          "পাবনা নাগরিক কমিটির MCP সার্ভার ChatGPT, Claude বা Cursor-এ কীভাবে যুক্ত করবেন ও ব্যবহার করবেন — সম্পূর্ণ বাংলা নির্দেশিকা।",
      },
      { property: "og:title", content: "MCP ব্যবহার নির্দেশিকা — পিএনসি" },
      {
        property: "og:description",
        content: "পিএনসি MCP সার্ভার সংযোগ ও ব্যবহারের ধাপে ধাপে নির্দেশিকা।",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const MCP_URL = "https://pncpabna.live/mcp";

const tools = [
  {
    icon: UserCircle,
    name: "whoami",
    title: "আমি কে?",
    desc: "বর্তমানে sign-in করা user-এর তথ্য (নাম, ইমেইল, ID) দেখায়। সংযোগ ঠিক আছে কিনা যাচাই করার জন্য প্রথমে এটি ব্যবহার করুন।",
    example: "আমি কে হিসেবে sign in করা আছি?",
  },
  {
    icon: ListChecks,
    name: "list_activities",
    title: "কার্যক্রম তালিকা",
    desc: "পিএনসি-র সকল প্রকাশিত কার্যক্রম (activities) তারিখ অনুযায়ী দেখায়।",
    example: "পিএনসি-র সাম্প্রতিক কার্যক্রমগুলো দেখাও।",
  },
  {
    icon: FileText,
    name: "list_notices",
    title: "নোটিশ তালিকা",
    desc: "নোটিশ বোর্ডের সব announcement/নোটিশ তালিকা আকারে দেয়। ক্যাটেগরি ফিল্টারও সাপোর্ট করে।",
    example: "সর্বশেষ ৫টি নোটিশ দেখাও।",
  },
  {
    icon: BookOpen,
    name: "get_notice",
    title: "নোটিশ বিস্তারিত",
    desc: "slug দিয়ে একটি নির্দিষ্ট নোটিশের সম্পূর্ণ বিবরণ ফেরত দেয়।",
    example: "'notice-slug' এই নোটিশটির সম্পূর্ণ বিবরণ পড়ে শোনাও।",
  },
  {
    icon: CalendarDays,
    name: "list_events",
    title: "ইভেন্ট তালিকা",
    desc: "আসন্ন ও অতীত ইভেন্টের তালিকা দেখায়।",
    example: "সামনের ইভেন্টগুলো কী কী?",
  },
  {
    icon: UserPlus,
    name: "register_nagorik_songlap_2026",
    title: "নাগরিক সংলাপ ২০২৬ রেজিস্ট্রেশন",
    desc: "সাইন-ইন করা user-কে নাগরিক সংলাপ ২০২৬-এ registration করে দেয় (deadline: ২৬ জুন ২০২৬)।",
    example: "আমাকে নাগরিক সংলাপ ২০২৬-এ registration করে দাও।",
  },
];

const clients = [
  {
    name: "ChatGPT",
    steps: [
      "Settings → Connectors → Add custom connector খুলুন।",
      "MCP Server URL হিসেবে নিচের URL টি paste করুন।",
      'Authentication: "OAuth" বেছে নিন এবং Connect চাপুন।',
      "নতুন window-এ পিএনসি অ্যাকাউন্টে sign in করুন এবং Approve চাপুন।",
    ],
  },
  {
    name: "Claude (Desktop / Web)",
    steps: [
      "Settings → Connectors → Add custom connector এ যান।",
      "URL দিন ও Connect চাপুন।",
      "পিএনসি অ্যাকাউন্টে sign in করে অনুমোদন দিন।",
      "চ্যাটে টুলস আইকন থেকে পিএনসি টুলগুলো enable করুন।",
    ],
  },
  {
    name: "Cursor / অন্যান্য",
    steps: [
      "MCP server list-এ নতুন server যোগ করুন।",
      "Transport: HTTP/Streamable, URL: নিচের URL।",
      "OAuth prompt এলে sign in ও approve করুন।",
    ],
  },
];

function McpGuidePage() {
  const [copied, setCopied] = useState(false);

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(MCP_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  };

  return (
    <div>
      <PageHeader
        eyebrow="Agent Integration"
        title="MCP ব্যবহার নির্দেশিকা"
        description="ChatGPT, Claude বা Cursor-এর মতো AI assistant থেকে সরাসরি পিএনসি-র তথ্য দেখা ও কাজ করার জন্য MCP সার্ভার কীভাবে যুক্ত করবেন ও ব্যবহার করবেন — একটি সহজ বাংলা গাইড।"
      />

      <main className="container-pnc py-12 md:py-16 space-y-14">
        {/* Server URL card */}
        <section className="rounded-2xl border border-border bg-gradient-to-br from-primary-soft/60 to-background p-6 md:p-8 shadow-elegant">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <Plug className="h-4 w-4" />
            আপনার MCP সার্ভার URL
          </div>
          <div className="mt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <code className="flex-1 rounded-lg bg-background border border-border px-4 py-3 font-mono text-sm md:text-base break-all">
              {MCP_URL}
            </code>
            <Button onClick={copyUrl} className="gap-2 shrink-0">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "কপি হয়েছে" : "URL কপি করুন"}
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground flex items-start gap-2">
            <ShieldCheck className="h-4 w-4 mt-0.5 text-primary shrink-0" />
            এই সার্ভার OAuth দিয়ে সুরক্ষিত — সংযোগের সময় আপনার পিএনসি অ্যাকাউন্টে sign in করতে হবে। টুলগুলো আপনার হয়ে কাজ করবে এবং আপনার ডেটা RLS দ্বারা সুরক্ষিত থাকবে।
          </p>
        </section>

        {/* Quick start */}
        <section>
          <h2 className="heading-display text-2xl md:text-3xl font-bold text-primary flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-[var(--gold)]" />
            দ্রুত শুরু — ৪ ধাপে সংযোগ
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                n: "১",
                t: "URL কপি করুন",
                d: "উপরের বক্স থেকে MCP সার্ভার URL কপি করুন।",
              },
              {
                n: "২",
                t: "AI app-এ যোগ করুন",
                d: "ChatGPT / Claude / Cursor-এর Connector সেকশনে গিয়ে নতুন MCP সার্ভার যুক্ত করুন।",
              },
              {
                n: "৩",
                t: "Sign in করুন",
                d: "OAuth উইন্ডোতে আপনার পিএনসি অ্যাকাউন্ট দিয়ে sign in করে Approve চাপুন।",
              },
              {
                n: "৪",
                t: "টুল ব্যবহার করুন",
                d: 'চ্যাটে লিখুন — "আমি কে?" বা "নোটিশ দেখাও" — AI নিজেই টুল কল করবে।',
              },
            ].map((s) => (
              <div
                key={s.n}
                className="rounded-xl border border-border bg-background p-5 hover:shadow-elegant transition-shadow"
              >
                <div className="h-9 w-9 rounded-full gradient-hero text-primary-foreground flex items-center justify-center font-bold">
                  {s.n}
                </div>
                <div className="mt-3 font-semibold text-foreground">{s.t}</div>
                <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Client-specific setup */}
        <section>
          <h2 className="heading-display text-2xl md:text-3xl font-bold text-primary flex items-center gap-2">
            <Terminal className="h-6 w-6 text-[var(--gold)]" />
            AI Client অনুযায়ী সেটআপ
          </h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {clients.map((c) => (
              <div key={c.name} className="rounded-xl border border-border bg-background p-6">
                <div className="font-semibold text-lg text-primary">{c.name}</div>
                <ol className="mt-3 space-y-2 text-sm text-foreground/90 list-decimal list-inside">
                  {c.steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>

        {/* Tools */}
        <section>
          <h2 className="heading-display text-2xl md:text-3xl font-bold text-primary flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-[var(--gold)]" />
            উপলব্ধ টুলসমূহ ({tools.length}টি)
          </h2>
          <p className="mt-2 text-muted-foreground text-sm">
            AI-কে শুধু স্বাভাবিক বাংলায় জিজ্ঞেস করলেই সে নিজে থেকে সঠিক টুলটি কল করবে। নিচে প্রতিটি টুল এবং একটি উদাহরণ প্রম্পট দেওয়া হলো।
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {tools.map((t) => {
              const Icon = t.icon;
              return (
                <div
                  key={t.name}
                  className="rounded-xl border border-border bg-background p-5 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary-soft flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <div className="font-semibold text-foreground">{t.title}</div>
                        <code className="text-xs font-mono text-muted-foreground">{t.name}</code>
                      </div>
                      <p className="mt-1.5 text-sm text-foreground/85">{t.desc}</p>
                      <div className="mt-3 flex items-start gap-2 text-sm rounded-lg bg-muted/50 border border-border p-3">
                        <MessageSquare className="h-4 w-4 mt-0.5 text-[var(--gold)] shrink-0" />
                        <span className="italic">“{t.example}”</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Tips / FAQ */}
        <section className="rounded-2xl border border-border bg-muted/30 p-6 md:p-8">
          <h2 className="heading-display text-xl md:text-2xl font-bold text-primary">টিপস ও প্রায়শই জিজ্ঞাসিত প্রশ্ন</h2>
          <div className="mt-4 space-y-4 text-sm text-foreground/90">
            <div>
              <div className="font-semibold">সংযোগ ব্যর্থ হলে?</div>
              <p className="text-muted-foreground mt-1">
                Browser-এ pncpabna.live-এ আগে sign in করে নিন, তারপর AI app থেকে আবার Connect চাপুন।
              </p>
            </div>
            <div>
              <div className="font-semibold">টুল কল হচ্ছে না?</div>
              <p className="text-muted-foreground mt-1">
                Claude/ChatGPT-তে চ্যাটের টুল আইকন থেকে পিএনসি টুলগুলো enable আছে কিনা দেখুন। প্রথম বার AI অনুমতি চাইলে Allow দিন।
              </p>
            </div>
            <div>
              <div className="font-semibold">আমার ডেটা কি নিরাপদ?</div>
              <p className="text-muted-foreground mt-1">
                হ্যাঁ। টুলগুলো আপনার token দিয়ে চলে — শুধু যেসব ডেটা আপনি ওয়েবসাইটে দেখতে পান তা-ই AI দেখবে। Access token কখনো AI-কে দেখানো হয় না।
              </p>
            </div>
            <div>
              <div className="font-semibold">অ্যাক্সেস বন্ধ করতে চাইলে?</div>
              <p className="text-muted-foreground mt-1">
                সংশ্লিষ্ট AI app-এর Connectors সেটিংস থেকে পিএনসি সংযোগটি Remove/Disconnect করে দিন।
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
