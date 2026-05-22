import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Sparkles, Upload, X, Check, Trash2, Wand2, RefreshCw } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { publicUrl } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  analyzeDrafts,
  updateDraft,
  publishDraft,
  rejectDraft,
} from "@/lib/content-studio.functions";

type UploadItem = {
  id: string;
  file: File;
  preview: string;
  caption: string;
  uploadedPath?: string;
  status: "ready" | "uploading" | "uploaded" | "analyzing" | "done" | "error";
  error?: string;
};

const CAT_LABEL: Record<string, string> = {
  news: "সংবাদ",
  activity: "কর্মসূচি",
  gallery: "গ্যালারি",
  notice: "নোটিশ",
};

const CAT_COLOR: Record<string, string> = {
  news: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  activity: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  gallery: "bg-purple-500/15 text-purple-700 dark:text-purple-400",
  notice: "bg-red-500/15 text-red-700 dark:text-red-400",
};

export function ContentStudio() {
  const [items, setItems] = useState<UploadItem[]>([]);
  const [drafts, setDrafts] = useState<any[]>([]);
  const [busy, setBusy] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const analyze = useServerFn(analyzeDrafts);
  const update = useServerFn(updateDraft);
  const publish = useServerFn(publishDraft);
  const reject = useServerFn(rejectDraft);

  const loadDrafts = async () => {
    const { data } = await supabase
      .from("content_drafts")
      .select("*")
      .in("admin_status", ["pending", "approved"])
      .order("created_at", { ascending: false })
      .limit(50);
    setDrafts(data || []);
  };
  useEffect(() => {
    loadDrafts();
  }, []);

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const next: UploadItem[] = Array.from(files).slice(0, 20).map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
      caption: "",
      status: "ready",
    }));
    setItems((p) => [...p, ...next].slice(0, 20));
  };

  const removeItem = (id: string) => setItems((p) => p.filter((i) => i.id !== id));
  const setCaption = (id: string, caption: string) =>
    setItems((p) => p.map((i) => (i.id === id ? { ...i, caption } : i)));

  const runAnalyze = async () => {
    const valid = items;
    if (valid.length === 0) {
      toast.error("কমপক্ষে একটি ছবি যোগ করুন");
      return;
    }
    setBusy(true);
    try {
      // Upload all files first
      const uploaded: { id: string; path: string }[] = [];
      for (const item of valid) {
        setItems((p) => p.map((i) => (i.id === item.id ? { ...i, status: "uploading" } : i)));
        const path = `drafts/${Date.now()}-${item.file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
        const up = await supabase.storage.from("gallery").upload(path, item.file);
        if (up.error) {
          setItems((p) => p.map((i) => (i.id === item.id ? { ...i, status: "error", error: up.error!.message } : i)));
          continue;
        }
        uploaded.push({ id: item.id, path });
        setItems((p) => p.map((i) => (i.id === item.id ? { ...i, uploadedPath: path, status: "analyzing" } : i)));
      }

      const payload = uploaded.map((u) => {
        const item = valid.find((v) => v.id === u.id)!;
        return { image_path: u.path, caption: item.caption };
      });
      if (payload.length === 0) {
        toast.error("কোনো ছবি আপলোড হয়নি");
        setBusy(false);
        return;
      }
      const result = await analyze({ data: { items: payload } });
      const okCount = result.results.filter((r: any) => r.ok).length;
      toast.success(`${okCount}টি বিশ্লেষণ সম্পন্ন`);
      setItems([]);
      await loadDrafts();
    } catch (e: any) {
      toast.error(e?.message ?? "ত্রুটি");
    } finally {
      setBusy(false);
    }
  };

  const saveEdit = async (id: string, patch: any) => {
    try {
      await update({ data: { id, ...patch } });
      toast.success("সংরক্ষণ হয়েছে");
      await loadDrafts();
    } catch (e: any) {
      toast.error(e?.message ?? "ত্রুটি");
    }
  };

  const doPublish = async (id: string) => {
    try {
      const r = await publish({ data: { id } });
      toast.success(`প্রকাশিত: ${r.table}`);
      await loadDrafts();
    } catch (e: any) {
      toast.error(e?.message ?? "ত্রুটি");
    }
  };

  const doReject = async (id: string) => {
    if (!confirm("বাতিল করবেন?")) return;
    try {
      await reject({ data: { id } });
      await loadDrafts();
    } catch (e: any) {
      toast.error(e?.message ?? "ত্রুটি");
    }
  };

  return (
    <div className="space-y-8">
      {/* Upload section */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" /> AI কন্টেন্ট স্টুডিও
          </h2>
          <p className="text-xs text-muted-foreground">
            ৫টি ছবি upload করুন (caption ঐচ্ছিক) → AI ছবি দেখে বাংলা সংবাদ draft তৈরি করবে → review করে publish করুন
          </p>
        </div>

        <div
          className="rounded-xl border-2 border-dashed border-border p-6 text-center cursor-pointer hover:bg-muted/50 transition"
          onClick={() => fileInput.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            addFiles(e.dataTransfer.files);
          }}
        >
          <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
          <p className="mt-2 text-sm">ছবি drag-drop করুন বা ক্লিক করে নির্বাচন করুন (সর্বোচ্চ ২০টি)</p>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => addFiles(e.target.files)}
          />
        </div>

        {items.length > 0 && (
          <>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((it) => (
                <div key={it.id} className="rounded-xl border border-border overflow-hidden bg-background">
                  <div className="relative aspect-video bg-muted">
                    <img src={it.preview} alt="" className="h-full w-full object-cover" />
                    <button
                      onClick={() => removeItem(it.id)}
                      className="absolute top-1 right-1 rounded-full bg-foreground/70 text-background p-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    {it.status !== "ready" && (
                      <div className="absolute bottom-1 left-1 rounded bg-foreground/80 text-background text-xs px-2 py-0.5">
                        {it.status}
                      </div>
                    )}
                  </div>
                  <Textarea
                    placeholder="Caption (ঐচ্ছিক) — ছবি থেকে AI নিজেই বুঝে নেবে"
                    value={it.caption}
                    onChange={(e) => setCaption(it.id, e.target.value)}
                    rows={3}
                    className="rounded-none border-0 text-xs"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={runAnalyze}
              disabled={busy}
              className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60 inline-flex items-center justify-center gap-2"
            >
              <Wand2 className="h-4 w-4" /> {busy ? "AI বিশ্লেষণ চলছে..." : `${items.length}টি বিশ্লেষণ করুন`}
            </button>
          </>
        )}
      </div>

      {/* Drafts review grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">পর্যালোচনার অপেক্ষায় ({drafts.length})</h2>
          <button
            onClick={loadDrafts}
            className="text-xs inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="h-3 w-3" /> রিফ্রেশ
          </button>
        </div>
        {drafts.length === 0 ? (
          <p className="text-sm text-muted-foreground">কোনো draft নেই।</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {drafts.map((d) => (
              <DraftCard key={d.id} draft={d} onSave={saveEdit} onPublish={doPublish} onReject={doReject} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DraftCard({
  draft,
  onSave,
  onPublish,
  onReject,
}: {
  draft: any;
  onSave: (id: string, patch: any) => void;
  onPublish: (id: string) => void;
  onReject: (id: string) => void;
}) {
  const [title, setTitle] = useState(draft.final_title_bn || draft.ai_title_bn || "");
  const [body, setBody] = useState(draft.final_body_bn || draft.ai_body_bn || "");
  const [cat, setCat] = useState(draft.final_category || draft.ai_category || "news");
  const [date, setDate] = useState(draft.final_date || draft.ai_event_date || "");
  const cat_label = CAT_LABEL[cat] ?? cat;

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-card">
      {draft.image_path && (
        <div className="aspect-video bg-muted">
          <img src={publicUrl("gallery", draft.image_path)} alt="" className="h-full w-full object-cover" />
        </div>
      )}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className={`text-xs font-semibold px-2 py-1 rounded ${CAT_COLOR[cat] || "bg-muted"}`}>
            {cat_label}
          </span>
          {draft.ai_confidence != null && (
            <span className="text-xs text-muted-foreground">আস্থা: {Math.round(draft.ai_confidence * 100)}%</span>
          )}
        </div>

        <div>
          <Label className="text-xs">সেকশন</Label>
          <select
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            className="mt-1 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
          >
            <option value="news">সংবাদ</option>
            <option value="activity">কর্মসূচি</option>
            <option value="gallery">গ্যালারি</option>
            <option value="notice">নোটিশ</option>
          </select>
        </div>

        <div>
          <Label className="text-xs">শিরোনাম</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1" />
        </div>

        <div>
          <Label className="text-xs">বিবরণ</Label>
          <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} className="mt-1 text-sm" />
        </div>

        <div>
          <Label className="text-xs">তারিখ (ঐচ্ছিক)</Label>
          <Input type="date" value={date || ""} onChange={(e) => setDate(e.target.value)} className="mt-1" />
        </div>

        {draft.ai_tags && draft.ai_tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {draft.ai_tags.map((t: string) => (
              <span key={t} className="text-xs px-2 py-0.5 bg-muted rounded-full">#{t}</span>
            ))}
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 pt-2">
          <button
            onClick={() =>
              onSave(draft.id, {
                final_category: cat,
                final_title_bn: title,
                final_body_bn: body,
                final_date: date || null,
              })
            }
            className="rounded-md bg-muted px-3 py-2 text-xs hover:bg-muted/80"
          >
            সংরক্ষণ
          </button>
          <button
            onClick={() => {
              onSave(draft.id, {
                final_category: cat,
                final_title_bn: title,
                final_body_bn: body,
                final_date: date || null,
              });
              setTimeout(() => onPublish(draft.id), 400);
            }}
            className="rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground inline-flex items-center justify-center gap-1"
          >
            <Check className="h-3 w-3" /> প্রকাশ
          </button>
          <button
            onClick={() => onReject(draft.id)}
            className="rounded-md bg-red-500/10 px-3 py-2 text-xs text-red-600 inline-flex items-center justify-center gap-1"
          >
            <Trash2 className="h-3 w-3" /> বাতিল
          </button>
        </div>
      </div>
    </div>
  );
}
