import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import {
  Shield, LogOut, Calendar, Image as ImageIcon, FileText, Plus, Trash2, Users, Download, History, Sparkles, Activity
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, publicUrl } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ContentStudio } from "@/components/admin/ContentStudio";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "অ্যাডমিন প্যানেল — পিএনসি" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

const GALLERY_CATEGORIES = ["সভা ও আলোচনা", "সামাজিক উদ্যোগ", "মানবিক কার্যক্রম", "শুভেচ্ছা ও সম্মাননা", "পাবনার মুহূর্ত"];
type Tab = "studio" | "events" | "gallery" | "reports" | "registrations" | "audit" | "mcp";

function AdminPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("studio");
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (cancelled) return;
      if (error || !data) {
        setIsAdmin(false);
        toast.error("এই পাতায় প্রবেশের অনুমতি নেই।");
        navigate({ to: "/" });
      } else {
        setIsAdmin(true);
      }
    })();
    return () => { cancelled = true; };
  }, [user, navigate]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  if (loading || !user || isAdmin !== true) return <div className="container-pnc py-20 text-center text-muted-foreground">লোড হচ্ছে...</div>;

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: "studio", label: "AI স্টুডিও", icon: Sparkles },
    { id: "events", label: "ইভেন্ট", icon: Calendar },
    { id: "gallery", label: "গ্যালারি", icon: ImageIcon },
    { id: "reports", label: "প্রতিবেদন", icon: FileText },
    { id: "registrations", label: "নিবন্ধন", icon: Users },
    { id: "audit", label: "অডিট লগ", icon: History },
    { id: "mcp", label: "MCP মনিটর", icon: Activity },
  ];

  return (
    <section className="container-pnc py-10 md:py-14">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Shield className="h-5 w-5" /></div>
          <div>
            <h1 className="text-xl font-bold text-foreground">অ্যাডমিন প্যানেল</h1>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to="/" className="rounded-md border border-border px-3 py-2 text-sm hover:bg-muted">সাইটে যান</Link>
          <button onClick={signOut} className="inline-flex items-center gap-1.5 rounded-md bg-muted px-3 py-2 text-sm hover:bg-muted/80"><LogOut className="h-4 w-4" /> লগআউট</button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-border mb-6">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition ${
              tab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>

      {tab === "studio" && <ContentStudio />}
      {tab === "events" && <EventsAdmin />}
      {tab === "gallery" && <GalleryAdmin />}
      {tab === "reports" && <ReportsAdmin />}
      {tab === "registrations" && <RegistrationsAdmin />}
      {tab === "audit" && <AuditAdmin />}
      {tab === "mcp" && <MCPMonitor />}
    </section>
  );
}

/* ============ AUDIT ============ */
function AuditAdmin() {
  const [logs, setLogs] = useState<any[]>([]);
  const [filter, setFilter] = useState<"all" | "gallery_images" | "reports">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      let q = supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(200);
      if (filter !== "all") q = q.eq("table_name", filter);
      const { data, error } = await q;
      if (error) toast.error("লগ লোড করা যায়নি");
      setLogs(data || []);
      setLoading(false);
    })();
  }, [filter]);

  const titleOf = (row: any) =>
    row.new_data?.title || row.old_data?.title || row.record_id?.slice(0, 8) || "—";

  const actionBadge = (a: string) => {
    const map: Record<string, string> = {
      INSERT: "bg-green-500/15 text-green-700 dark:text-green-400",
      UPDATE: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
      DELETE: "bg-red-500/15 text-red-700 dark:text-red-400",
    };
    return <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${map[a] || "bg-muted"}`}>{a}</span>;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {(["all", "gallery_images", "reports"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-md px-3 py-1.5 text-sm ${filter === f ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"}`}
          >
            {f === "all" ? "সব" : f === "gallery_images" ? "গ্যালারি" : "প্রতিবেদন"}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">লোড হচ্ছে...</p>
      ) : logs.length === 0 ? (
        <p className="text-sm text-muted-foreground">কোনো লগ পাওয়া যায়নি।</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-left">
                <th className="px-3 py-2 font-medium">সময়</th>
                <th className="px-3 py-2 font-medium">টেবিল</th>
                <th className="px-3 py-2 font-medium">অ্যাকশন</th>
                <th className="px-3 py-2 font-medium">শিরোনাম</th>
                <th className="px-3 py-2 font-medium">ব্যবহারকারী</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.id} className="border-t border-border">
                  <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">
                    {new Date(l.created_at).toLocaleString("bn-BD")}
                  </td>
                  <td className="px-3 py-2">{l.table_name === "gallery_images" ? "গ্যালারি" : "প্রতিবেদন"}</td>
                  <td className="px-3 py-2">{actionBadge(l.action)}</td>
                  <td className="px-3 py-2 max-w-xs truncate">{titleOf(l)}</td>
                  <td className="px-3 py-2 text-muted-foreground">{l.user_email || l.user_id?.slice(0, 8) || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ============ MCP MONITOR ============ */
type MCPLog = {
  id: string;
  created_at: string;
  tool_name: string;
  user_id: string | null;
  user_email: string | null;
  client_id: string | null;
  success: boolean;
  error_message: string | null;
  duration_ms: number | null;
  input_summary: Record<string, unknown> | null;
};

function MCPMonitor() {
  const [logs, setLogs] = useState<MCPLog[]>([]);
  const [statusFilter, setStatusFilter] = useState<"all" | "success" | "error">("all");
  const [toolFilter, setToolFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    let q = (supabase as any)
      .from("mcp_audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(300);
    if (statusFilter === "success") q = q.eq("success", true);
    if (statusFilter === "error") q = q.eq("success", false);
    if (toolFilter !== "all") q = q.eq("tool_name", toolFilter);
    const { data, error } = await q;
    if (error) toast.error("MCP লগ লোড করা যায়নি");
    setLogs((data as MCPLog[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [statusFilter, toolFilter]);

  const toolNames = Array.from(new Set(logs.map((l) => l.tool_name))).sort();

  const total = logs.length;
  const errors = logs.filter((l) => !l.success).length;
  const avgDuration = total
    ? Math.round(logs.reduce((s, l) => s + (l.duration_ms || 0), 0) / total)
    : 0;
  const uniqueUsers = new Set(logs.map((l) => l.user_id).filter(Boolean)).size;

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">মোট কল</p>
          <p className="text-2xl font-bold">{total}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">ত্রুটি</p>
          <p className="text-2xl font-bold text-red-600">{errors}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">গড় সময়</p>
          <p className="text-2xl font-bold">{avgDuration}ms</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">ব্যবহারকারী</p>
          <p className="text-2xl font-bold">{uniqueUsers}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {(["all", "success", "error"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setStatusFilter(f)}
            className={`rounded-md px-3 py-1.5 text-sm ${statusFilter === f ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"}`}
          >
            {f === "all" ? "সব" : f === "success" ? "সফল" : "ব্যর্থ"}
          </button>
        ))}
        <select
          value={toolFilter}
          onChange={(e) => setToolFilter(e.target.value)}
          className="rounded-md border border-border bg-background px-3 py-1.5 text-sm"
        >
          <option value="all">সব টুল</option>
          {toolNames.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <button
          onClick={load}
          className="rounded-md bg-muted hover:bg-muted/80 px-3 py-1.5 text-sm"
        >
          রিফ্রেশ
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">লোড হচ্ছে...</p>
      ) : logs.length === 0 ? (
        <p className="text-sm text-muted-foreground">এখনো কোনো MCP কল রেকর্ড নেই।</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-left">
                <th className="px-3 py-2 font-medium">সময়</th>
                <th className="px-3 py-2 font-medium">টুল</th>
                <th className="px-3 py-2 font-medium">স্ট্যাটাস</th>
                <th className="px-3 py-2 font-medium">সময়কাল</th>
                <th className="px-3 py-2 font-medium">ব্যবহারকারী</th>
                <th className="px-3 py-2 font-medium">বিস্তারিত</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <>
                  <tr key={l.id} className="border-t border-border">
                    <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">
                      {new Date(l.created_at).toLocaleString("bn-BD")}
                    </td>
                    <td className="px-3 py-2 font-mono text-xs">{l.tool_name}</td>
                    <td className="px-3 py-2">
                      {l.success ? (
                        <span className="inline-block rounded px-2 py-0.5 text-xs font-medium bg-green-500/15 text-green-700 dark:text-green-400">সফল</span>
                      ) : (
                        <span className="inline-block rounded px-2 py-0.5 text-xs font-medium bg-red-500/15 text-red-700 dark:text-red-400">ব্যর্থ</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">{l.duration_ms ?? "—"}ms</td>
                    <td className="px-3 py-2 text-muted-foreground max-w-[180px] truncate">{l.user_email || l.user_id?.slice(0, 8) || "—"}</td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => setExpanded(expanded === l.id ? null : l.id)}
                        className="text-primary hover:underline text-xs"
                      >
                        {expanded === l.id ? "লুকান" : "দেখুন"}
                      </button>
                    </td>
                  </tr>
                  {expanded === l.id && (
                    <tr className="border-t border-border bg-muted/30">
                      <td colSpan={6} className="px-3 py-3">
                        <div className="space-y-2 text-xs">
                          {l.error_message && (
                            <div><span className="font-medium text-red-600">Error:</span> {l.error_message}</div>
                          )}
                          {l.client_id && (
                            <div><span className="font-medium">Client:</span> <code>{l.client_id}</code></div>
                          )}
                          <div>
                            <span className="font-medium">Input:</span>
                            <pre className="mt-1 rounded bg-background border border-border p-2 overflow-x-auto">
{JSON.stringify(l.input_summary, null, 2)}
                            </pre>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


/* ============ EVENTS ============ */
const eventSchema = z.object({
  title: z.string().trim().min(2).max(200),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  event_date: z.string().min(1),
  location: z.string().trim().min(2).max(200),
});

function EventsAdmin() {
  const [events, setEvents] = useState<any[]>([]);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("events").select("*").order("event_date", { ascending: false });
    setEvents(data || []);
  };
  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = eventSchema.safeParse(Object.fromEntries(fd));
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    setBusy(true);
    const { error } = await supabase.from("events").insert({
      title: parsed.data.title,
      description: parsed.data.description || null,
      event_date: new Date(parsed.data.event_date).toISOString(),
      location: parsed.data.location,
      registration_open: fd.get("registration_open") === "on",
    });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("ইভেন্ট যোগ হয়েছে");
    (e.target as HTMLFormElement).reset();
    load();
  };

  const del = async (id: string) => {
    if (!confirm("মুছে ফেলবেন?")) return;
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("মুছে ফেলা হয়েছে"); load(); }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <form onSubmit={submit} className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-card space-y-4 h-fit">
        <h2 className="font-bold flex items-center gap-2"><Plus className="h-4 w-4" /> নতুন ইভেন্ট</h2>
        <div><Label htmlFor="title">শিরোনাম *</Label><Input id="title" name="title" className="mt-1.5" required /></div>
        <div><Label htmlFor="description">বিবরণ</Label><Textarea id="description" name="description" rows={3} className="mt-1.5" /></div>
        <div><Label htmlFor="event_date">তারিখ ও সময় *</Label><Input id="event_date" name="event_date" type="datetime-local" className="mt-1.5" required /></div>
        <div><Label htmlFor="location">স্থান *</Label><Input id="location" name="location" className="mt-1.5" required /></div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="registration_open" defaultChecked /> নিবন্ধন চালু</label>
        <button disabled={busy} className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60">{busy ? "..." : "যোগ করুন"}</button>
      </form>
      <div className="lg:col-span-3 space-y-3">
        <h2 className="font-bold">সব ইভেন্ট ({events.length})</h2>
        {events.map((e) => (
          <div key={e.id} className="rounded-xl border border-border bg-card p-4 shadow-card flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold">{e.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{new Date(e.event_date).toLocaleString("bn-BD")} · {e.location}</p>
            </div>
            <button onClick={() => del(e.id)} className="text-red-accent hover:bg-red-accent/10 p-2 rounded"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
        {events.length === 0 && <p className="text-sm text-muted-foreground">কোনো ইভেন্ট নেই।</p>}
      </div>
    </div>
  );
}

/* ============ GALLERY ============ */
function GalleryAdmin() {
  const [images, setImages] = useState<any[]>([]);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("gallery_images").select("*").order("created_at", { ascending: false });
    setImages(data || []);
  };
  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const file = fd.get("file") as File;
    const title = (fd.get("title") as string)?.trim();
    const category = fd.get("category") as string;
    if (!file || file.size === 0) { toast.error("ছবি নির্বাচন করুন"); return; }
    if (!title || title.length < 2) { toast.error("শিরোনাম দিন"); return; }
    if (file.size > 10 * 1024 * 1024) { toast.error("সর্বোচ্চ ১০MB"); return; }
    setBusy(true);
    const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const up = await supabase.storage.from("gallery").upload(path, file);
    if (up.error) { toast.error(up.error.message); setBusy(false); return; }
    const { error } = await supabase.from("gallery_images").insert({ title, category, image_path: path });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("ছবি যোগ হয়েছে");
    (e.target as HTMLFormElement).reset();
    load();
  };

  const del = async (img: any) => {
    if (!confirm("মুছে ফেলবেন?")) return;
    await supabase.storage.from("gallery").remove([img.image_path]);
    const { error } = await supabase.from("gallery_images").delete().eq("id", img.id);
    if (error) toast.error(error.message); else { toast.success("মুছে ফেলা হয়েছে"); load(); }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <form onSubmit={submit} className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-card space-y-4 h-fit">
        <h2 className="font-bold flex items-center gap-2"><Plus className="h-4 w-4" /> নতুন ছবি</h2>
        <div><Label htmlFor="title">শিরোনাম *</Label><Input id="title" name="title" className="mt-1.5" required /></div>
        <div>
          <Label htmlFor="category">ক্যাটাগরি *</Label>
          <select id="category" name="category" className="mt-1.5 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm" required>
            {GALLERY_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div><Label htmlFor="file">ছবি (max 10MB) *</Label><Input id="file" name="file" type="file" accept="image/*" className="mt-1.5" required /></div>
        <button disabled={busy} className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60">{busy ? "আপলোড হচ্ছে..." : "আপলোড করুন"}</button>
      </form>
      <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {images.map((img) => (
          <div key={img.id} className="relative group rounded-xl overflow-hidden border border-border aspect-square">
            <img src={publicUrl("gallery", img.image_path)} alt={img.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-center p-2">
              <p className="text-xs text-white font-semibold line-clamp-2">{img.title}</p>
              <p className="text-[10px] text-white/80 mt-1">{img.category}</p>
              <button onClick={() => del(img)} className="mt-2 inline-flex items-center gap-1 rounded bg-red-accent px-2 py-1 text-xs text-white"><Trash2 className="h-3 w-3" /> মুছুন</button>
            </div>
          </div>
        ))}
        {images.length === 0 && <p className="text-sm text-muted-foreground col-span-full">কোনো ছবি নেই।</p>}
      </div>
    </div>
  );
}

/* ============ REPORTS ============ */
function ReportsAdmin() {
  const [reports, setReports] = useState<any[]>([]);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("reports").select("*").order("year", { ascending: false });
    setReports(data || []);
  };
  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const file = fd.get("file") as File;
    const title = (fd.get("title") as string)?.trim();
    const year = parseInt(fd.get("year") as string, 10);
    const description = (fd.get("description") as string)?.trim();
    if (!file || file.size === 0) { toast.error("PDF নির্বাচন করুন"); return; }
    if (!title || title.length < 2) { toast.error("শিরোনাম দিন"); return; }
    if (!year || year < 2000 || year > 2100) { toast.error("সঠিক বছর দিন"); return; }
    if (file.size > 25 * 1024 * 1024) { toast.error("সর্বোচ্চ ২৫MB"); return; }
    setBusy(true);
    const path = `${year}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const up = await supabase.storage.from("reports").upload(path, file, { contentType: file.type });
    if (up.error) { toast.error(up.error.message); setBusy(false); return; }
    const { error } = await supabase.from("reports").insert({ title, year, description: description || null, file_path: path });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("প্রতিবেদন প্রকাশ হয়েছে");
    (e.target as HTMLFormElement).reset();
    load();
  };

  const del = async (r: any) => {
    if (!confirm("মুছে ফেলবেন?")) return;
    await supabase.storage.from("reports").remove([r.file_path]);
    const { error } = await supabase.from("reports").delete().eq("id", r.id);
    if (error) toast.error(error.message); else { toast.success("মুছে ফেলা হয়েছে"); load(); }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <form onSubmit={submit} className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-card space-y-4 h-fit">
        <h2 className="font-bold flex items-center gap-2"><Plus className="h-4 w-4" /> নতুন প্রতিবেদন</h2>
        <div><Label htmlFor="r-title">শিরোনাম *</Label><Input id="r-title" name="title" className="mt-1.5" required /></div>
        <div><Label htmlFor="year">বছর *</Label><Input id="year" name="year" type="number" min="2000" max="2100" defaultValue={new Date().getFullYear()} className="mt-1.5" required /></div>
        <div><Label htmlFor="r-desc">বিবরণ</Label><Textarea id="r-desc" name="description" rows={3} className="mt-1.5" /></div>
        <div><Label htmlFor="r-file">PDF (max 25MB) *</Label><Input id="r-file" name="file" type="file" accept="application/pdf" className="mt-1.5" required /></div>
        <button disabled={busy} className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60">{busy ? "আপলোড হচ্ছে..." : "প্রকাশ করুন"}</button>
      </form>
      <div className="lg:col-span-3 space-y-3">
        {reports.map((r) => (
          <div key={r.id} className="rounded-xl border border-border bg-card p-4 shadow-card flex items-start justify-between gap-3">
            <div className="flex-1">
              <p className="font-semibold">{r.title} <span className="text-xs text-muted-foreground">({r.year})</span></p>
              {r.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{r.description}</p>}
            </div>
            <a href={publicUrl("reports", r.file_path)} target="_blank" rel="noopener noreferrer" className="text-primary hover:bg-primary-soft p-2 rounded"><Download className="h-4 w-4" /></a>
            <button onClick={() => del(r)} className="text-red-accent hover:bg-red-accent/10 p-2 rounded"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
        {reports.length === 0 && <p className="text-sm text-muted-foreground">কোনো প্রতিবেদন নেই।</p>}
      </div>
    </div>
  );
}

/* ============ REGISTRATIONS ============ */
function RegistrationsAdmin() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("event_registrations")
        .select("*, events(title, event_date)")
        .order("created_at", { ascending: false });
      setRows(data || []);
    })();
  }, []);
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-card">
      <table className="w-full text-sm">
        <thead className="bg-muted text-left">
          <tr>
            <th className="p-3">নাম</th><th className="p-3">ফোন</th><th className="p-3">ইমেইল</th>
            <th className="p-3">ইভেন্ট</th><th className="p-3">তারিখ</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t border-border">
              <td className="p-3 font-medium">{r.full_name}</td>
              <td className="p-3">{r.phone}</td>
              <td className="p-3 text-muted-foreground">{r.email || "—"}</td>
              <td className="p-3">{r.events?.title || "—"}</td>
              <td className="p-3 text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString("bn-BD")}</td>
            </tr>
          ))}
          {rows.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">কোনো নিবন্ধন নেই।</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
