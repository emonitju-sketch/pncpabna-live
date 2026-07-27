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
  Code2,
} from "lucide-react";

/* ============ Complete Tool Reference data ============ */
type ParamRow = {
  name: string;
  type: string;
  required: boolean;
  desc: string;
};

type ToolReference = {
  name: string;
  title: string;
  purpose: string;
  auth: string;
  returns: string;
  params: ParamRow[];
  prompts: string[];
  jsonExample: object;
  curlExample?: string;
};

const TOOL_REFERENCE: ToolReference[] = [
  {
    name: "whoami",
    title: "আমি কে?",
    purpose:
      "বর্তমান MCP সংযোগে কোন পিএনসি user sign-in করা আছে তা যাচাই করে — সংযোগ ও authentication debug করার প্রথম টুল।",
    auth: "Sign-in আবশ্যক",
    returns: "user_id (UUID), email",
    params: [],
    prompts: ["আমি কে হিসেবে sign in করা আছি?", "MCP সংযোগ ঠিক আছে কিনা যাচাই কর"],
    jsonExample: { name: "whoami", arguments: {} },
  },
  {
    name: "list_activities",
    title: "কার্যক্রম তালিকা",
    purpose:
      "পিএনসি-র প্রকাশিত সব কার্যক্রম (activities) সর্বশেষ তারিখ অনুযায়ী তালিকা আকারে আনে — featured কার্যক্রম উপরে থাকে।",
    auth: "Sign-in আবশ্যক",
    returns: "id, title_bn, description_bn, category, activity_date, location, is_featured, external_url, cover_image_path",
    params: [
      {
        name: "category",
        type: "string (optional)",
        required: false,
        desc: "ক্যাটেগরি ফিল্টার — যেমন: জনস্বার্থ, নাগরিক মতামত, নাগরিক সমর্থন।",
      },
      {
        name: "limit",
        type: "number 1–50 (optional)",
        required: false,
        desc: "সর্বাধিক কতটি row ফেরত দিবে। ডিফল্ট: 20।",
      },
    ],
    prompts: [
      "পিএনসি-র সাম্প্রতিক ১০টি কার্যক্রম দেখাও",
      "জনস্বার্থ ক্যাটেগরির কার্যক্রমগুলো তালিকা কর",
      "সাম্প্রতিক featured কার্যক্রম কী কী?",
    ],
    jsonExample: {
      name: "list_activities",
      arguments: { category: "জনস্বার্থ", limit: 10 },
    },
  },
  {
    name: "list_notices",
    title: "নোটিশ তালিকা",
    purpose:
      "নোটিশ বোর্ডের সক্রিয় ঘোষণা/নোটিশ — priority ও starts_at অনুযায়ী সাজানো।",
    auth: "Sign-in আবশ্যক",
    returns: "id, slug, title_bn, category, priority, starts_at, expires_at, cover_image_path",
    params: [
      {
        name: "category",
        type: "string (optional)",
        required: false,
        desc: "ক্যাটেগরি — ঘোষণা, নোটিশ, সভা ইত্যাদি।",
      },
      {
        name: "search",
        type: "string (optional)",
        required: false,
        desc: "শিরোনামে টেক্সট খোঁজে (case-insensitive)।",
      },
      {
        name: "limit",
        type: "number 1–50 (optional)",
        required: false,
        desc: "সর্বাধিক row। ডিফল্ট: 20।",
      },
    ],
    prompts: [
      "সর্বশেষ ৫টি নোটিশ দেখাও",
      "‘সভা’ ক্যাটেগরির সব নোটিশ তালিকা কর",
      "‘সংলাপ’ শব্দ আছে এমন নোটিশ খোঁজো",
    ],
    jsonExample: {
      name: "list_notices",
      arguments: { category: "সভা", limit: 5 },
    },
  },
  {
    name: "get_notice",
    title: "নোটিশ বিস্তারিত",
    purpose:
      "একটি নির্দিষ্ট নোটিশের সম্পূর্ণ body সহ বিবরণ ফেরত দেয় — slug দিয়ে খোঁজা হয়। list_notices থেকে slug পাওয়া যায়।",
    auth: "Sign-in আবশ্যক",
    returns: "id, slug, title_bn, body_bn (full), category, priority, starts_at, expires_at, cover_image_path, is_active",
    params: [
      {
        name: "slug",
        type: "string (required)",
        required: true,
        desc: "নোটিশের unique slug — যেমন: nagorik-songlap-2026।",
      },
    ],
    prompts: [
      "‘nagorik-songlap-2026’ নোটিশটি সম্পূর্ণ পড়ে শোনাও",
      "সর্বশেষ নোটিশটির বিস্তারিত বিবরণ দাও",
    ],
    jsonExample: {
      name: "get_notice",
      arguments: { slug: "nagorik-songlap-2026" },
    },
  },
  {
    name: "list_events",
    title: "ইভেন্ট তালিকা",
    purpose:
      "আসন্ন ও অতীত ইভেন্ট — event_date অনুযায়ী ascending। চাইলে শুধু open registration-এর ইভেন্ট আনা যায়।",
    auth: "Sign-in আবশ্যক",
    returns: "id, title, description, event_date, location, registration_open, cover_image_path",
    params: [
      {
        name: "only_open",
        type: "boolean (optional)",
        required: false,
        desc: "true দিলে শুধু registration_open = true ইভেন্ট।",
      },
      {
        name: "limit",
        type: "number 1–50 (optional)",
        required: false,
        desc: "সর্বাধিক row। ডিফল্ট: 20।",
      },
    ],
    prompts: [
      "সামনের ইভেন্টগুলো কী কী?",
      "যেসব ইভেন্টে registration খোলা আছে সেগুলো দেখাও",
    ],
    jsonExample: {
      name: "list_events",
      arguments: { only_open: true, limit: 10 },
    },
  },
  {
    name: "register_nagorik_songlap_2026",
    title: "নাগরিক সংলাপ ২০২৬ রেজিস্ট্রেশন",
    purpose:
      "Sign-in করা user-কে নাগরিক সংলাপ ২০২৬ কর্মসূচিতে নিবন্ধন করে। Deadline ২৬ জুন ২০২৬ — server-side enforce করা।",
    auth: "Sign-in আবশ্যক · Deadline: ২৬ জুন ২০২৬",
    returns: "success (bool), message (bn)",
    params: [
      {
        name: "name",
        type: "string (required, 2–100)",
        required: true,
        desc: "নিবন্ধনকারীর পূর্ণ নাম।",
      },
      {
        name: "phone",
        type: "string (required, 10–20)",
        required: true,
        desc: "মোবাইল নম্বর — digits, +, -, space, () allowed।",
      },
      {
        name: "comment",
        type: "string (optional, ≤1000)",
        required: false,
        desc: "ঐচ্ছিক মন্তব্য বা প্রশ্ন।",
      },
    ],
    prompts: [
      "আমাকে নাগরিক সংলাপ ২০২৬-এ registration করে দাও — নাম: রফিকুল ইসলাম, ফোন: 01711223344",
      "নাগরিক সংলাপে যোগ দিতে চাই",
    ],
    jsonExample: {
      name: "register_nagorik_songlap_2026",
      arguments: {
        name: "রফিকুল ইসলাম",
        phone: "01711223344",
        comment: "পানি নিষ্কাশন নিয়ে কথা বলতে চাই",
      },
    },
  },
];

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

        {/* Complete Tool Reference */}
        <ToolReferenceSection />

        {/* Interactive Playground */}
        <ToolPlayground />


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

/* ============ Interactive Tool Playground ============ */
type ToolId = "list_notices" | "list_events" | "whoami";

const TOOL_OPTIONS: { id: ToolId; label: string; icon: any; prompt: string; desc: string }[] = [
  {
    id: "list_notices",
    label: "list_notices",
    icon: FileText,
    prompt: "সাম্প্রতিক ৫টি নোটিশ দেখাও",
    desc: "সক্রিয় নোটিশগুলোর তালিকা আনে।",
  },
  {
    id: "list_events",
    label: "list_events",
    icon: CalendarDays,
    prompt: "আসন্ন ইভেন্টগুলো দেখাও যেখানে registration খোলা আছে",
    desc: "ইভেন্ট তালিকা, চাইলে শুধু open registration।",
  },
  {
    id: "whoami",
    label: "whoami",
    icon: UserCircle,
    prompt: "আমি কে? আমার MCP সংযোগ যাচাই কর",
    desc: "বর্তমান sign-in করা user-এর তথ্য।",
  },
];

function ToolPlayground() {
  const { user, loading } = useAuth();
  const [selected, setSelected] = useState<ToolId>("list_notices");
  const [limit, setLimit] = useState(5);
  const [onlyOpen, setOnlyOpen] = useState(true);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const active = TOOL_OPTIONS.find((t) => t.id === selected)!;

  const run = async () => {
    setRunning(true);
    setError(null);
    setResult(null);
    try {
      if (selected === "list_notices") {
        const { data, error } = await supabase
          .from("notices")
          .select("id,slug,title_bn,category,priority,starts_at,expires_at")
          .eq("is_active", true)
          .order("priority", { ascending: false })
          .order("starts_at", { ascending: false })
          .limit(limit);
        if (error) throw error;
        setResult({ notices: data ?? [] });
      } else if (selected === "list_events") {
        let q = supabase
          .from("events")
          .select("id,title,description,event_date,location,registration_open")
          .order("event_date", { ascending: true })
          .limit(limit);
        if (onlyOpen) q = q.eq("registration_open", true);
        const { data, error } = await q;
        if (error) throw error;
        setResult({ events: data ?? [] });
      } else {
        setResult({
          user_id: user?.id ?? null,
          email: user?.email ?? null,
          authenticated: !!user,
        });
      }
    } catch (e: any) {
      setError(e?.message ?? "Unknown error");
    } finally {
      setRunning(false);
    }
  };

  return (
    <section className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary-soft/40 to-background p-6 md:p-8 shadow-elegant">
      <div className="flex items-start gap-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shrink-0">
          <Play className="h-5 w-5" />
        </div>
        <div>
          <h2 className="heading-display text-2xl md:text-3xl font-bold text-primary">টুল চালিয়ে দেখুন</h2>
          <p className="text-sm text-muted-foreground mt-1">
            নিচের টুলগুলো এখানেই লাইভ চালিয়ে দেখুন — MCP টুল ঠিক এই ডেটাই ফেরত দেয়।
          </p>
        </div>
      </div>

      {!loading && !user && (
        <div className="mt-6 rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-foreground">
            টুল চালাতে প্রথমে{" "}
            <Link to="/login" className="text-primary font-semibold underline">
              sign in
            </Link>{" "}
            করুন। MCP টুলগুলোও আপনার session ব্যবহার করেই ডেটা দেখায়।
          </p>
        </div>
      )}

      {user && (
        <div className="mt-6 space-y-5">
          {/* Tool selector */}
          <div className="flex flex-wrap gap-2">
            {TOOL_OPTIONS.map((t) => {
              const Icon = t.icon;
              const isActive = selected === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setSelected(t.id);
                    setResult(null);
                    setError(null);
                  }}
                  className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-mono transition ${
                    isActive
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card border-border hover:bg-muted"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {t.label}
                </button>
              );
            })}
          </div>

          <p className="text-sm text-muted-foreground">{active.desc}</p>

          {/* Params */}
          {(selected === "list_notices" || selected === "list_events") && (
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <label className="inline-flex items-center gap-2">
                <span className="text-foreground">limit:</span>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={limit}
                  onChange={(e) => setLimit(Math.max(1, Math.min(20, Number(e.target.value) || 1)))}
                  className="w-20 rounded-md border border-border bg-background px-2 py-1"
                />
              </label>
              {selected === "list_events" && (
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={onlyOpen}
                    onChange={(e) => setOnlyOpen(e.target.checked)}
                  />
                  <span className="text-foreground">only_open</span>
                </label>
              )}
            </div>
          )}

          {/* Sample prompt */}
          <div className="rounded-lg border border-border bg-card p-3">
            <div className="text-xs font-semibold text-muted-foreground mb-1">💬 AI-কে যেভাবে বলবেন:</div>
            <p className="text-sm text-foreground italic">"{active.prompt}"</p>
          </div>

          {/* Run button */}
          <Button onClick={run} disabled={running} className="gap-2">
            {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            {running ? "চলছে..." : "টুল চালান"}
          </Button>

          {/* Result */}
          {error && (
            <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-400">
              <div className="font-semibold mb-1">Error</div>
              <div>{error}</div>
            </div>
          )}

          {result && (
            <div className="rounded-lg border border-border bg-background overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 bg-muted/50 border-b border-border">
                <span className="text-xs font-mono text-muted-foreground">
                  {active.label} → response
                </span>
                <button
                  onClick={() => navigator.clipboard.writeText(JSON.stringify(result, null, 2))}
                  className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                >
                  <Copy className="h-3 w-3" /> copy
                </button>
              </div>
              <pre className="p-4 text-xs overflow-x-auto max-h-96 leading-relaxed">
{JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
