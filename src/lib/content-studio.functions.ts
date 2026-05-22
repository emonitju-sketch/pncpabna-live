import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const SUPABASE_URL = () => process.env.SUPABASE_URL!;

const GENERIC_ERROR = "অপারেশন ব্যর্থ হয়েছে। পরে আবার চেষ্টা করুন।";

async function assertAdmin(userId: string) {
  // Use service-role client so role lookup is independent of caller JWT.
  const { data, error } = await supabaseAdmin.rpc("has_role", {
    _user_id: userId,
    _role: "admin",
  });
  if (error || !data) throw new Error("Forbidden: admin only");
}

function publicGalleryUrl(path: string | null | undefined) {
  if (!path) return null;
  return `${SUPABASE_URL()}/storage/v1/object/public/gallery/${path}`;
}

// ---------- AI categorize ----------
const SYSTEM_PROMPT = `তুমি পাবনা নাগরিক কমিটি (PNC)-এর কন্টেন্ট এডিটর। প্রতিটি Facebook পোস্ট (ছবি + caption) পড়ে সিদ্ধান্ত নাও কোন সেকশনে যাবে এবং বাংলায় পরিপাটি কন্টেন্ট তৈরি করো।

ক্যাটেগরি নিয়ম:
- "activity": ব্যানার, সভা, মানববন্ধন, কর্মসূচি, নির্দিষ্ট তারিখের event
- "news": ঘোষণা, বিবৃতি, প্রেস কভারেজ, সাংবাদিক উল্লেখ
- "gallery": নিছক মুহূর্ত/ছবি (caption ছোট, descriptive)
- "notice": "জরুরি", "সবার অবগতির জন্য", "ঘোষণা" শব্দযুক্ত alert

সবকিছু বাংলায় উত্তর দাও। JSON ছাড়া অন্য কিছু লিখবে না।`;

const TOOL_SCHEMA = {
  name: "categorize_content",
  description: "Categorize and structure a Facebook post into PNC site content",
  parameters: {
    type: "object",
    properties: {
      category: { type: "string", enum: ["activity", "news", "gallery", "notice"] },
      title_bn: { type: "string", description: "৮-১৪ শব্দের আকর্ষণীয় বাংলা শিরোনাম" },
      summary_bn: { type: "string", description: "১-২ লাইন সারাংশ" },
      body_bn: { type: "string", description: "৩-৬ লাইন বিস্তারিত বাংলা বিবরণ (caption-এর ভিত্তিতে, কিছু পুনর্লিখন করে)" },
      tags: { type: "array", items: { type: "string" }, description: "৩-৬টি বাংলা ট্যাগ" },
      event_date: { type: "string", description: "ঘটনার তারিখ YYYY-MM-DD format (caption-এ পেলে), নয়তো খালি" },
      confidence: { type: "number", description: "0-1 আত্মবিশ্বাস" },
    },
    required: ["category", "title_bn", "summary_bn", "body_bn", "tags", "confidence"],
    additionalProperties: false,
  },
};

async function categorizeOne(caption: string, imageUrl: string | null) {
  const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
  if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

  const userContent: any[] = [
    { type: "text", text: `Caption:\n${caption || "(ছবি, ক্যাপশন নেই)"}` },
  ];
  if (imageUrl) userContent.push({ type: "image_url", image_url: { url: imageUrl } });

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userContent },
      ],
      tools: [{ type: "function", function: TOOL_SCHEMA }],
      tool_choice: { type: "function", function: { name: "categorize_content" } },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("AI gateway error", res.status, body.slice(0, 500));
    if (res.status === 429) throw new Error("AI rate-limit, একটু পরে চেষ্টা করুন");
    if (res.status === 402) throw new Error("AI credit ফুরিয়েছে — Lovable workspace-এ যোগ করুন");
    throw new Error("AI সার্ভিস সাময়িকভাবে অনুপলব্ধ।");
  }

  const json: any = await res.json();
  const call = json?.choices?.[0]?.message?.tool_calls?.[0];
  if (!call?.function?.arguments) throw new Error("AI returned no tool call");
  const parsed = JSON.parse(call.function.arguments);
  return { parsed, raw: json };
}

export const analyzeDrafts = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        items: z
          .array(
            z.object({
              image_path: z.string().nullable().optional(),
              caption: z.string().max(8000).optional().default(""),
            })
          )
          .min(1)
          .max(20),
      })
      .parse(input)
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    await assertAdmin(userId);

    const results: any[] = [];
    for (const item of data.items) {
      try {
        const imageUrl = publicGalleryUrl(item.image_path);
        const { parsed, raw } = await categorizeOne(item.caption, imageUrl);
        const { data: row, error } = await supabase
          .from("content_drafts")
          .insert({
            image_path: item.image_path ?? null,
            original_caption: item.caption,
            ai_category: parsed.category,
            ai_title_bn: parsed.title_bn,
            ai_summary_bn: parsed.summary_bn,
            ai_body_bn: parsed.body_bn,
            ai_tags: parsed.tags ?? [],
            ai_event_date: parsed.event_date || null,
            ai_confidence: parsed.confidence ?? null,
            ai_model: "google/gemini-2.5-flash",
            ai_raw_response: raw,
            final_category: parsed.category,
            final_title_bn: parsed.title_bn,
            final_body_bn: parsed.body_bn,
            final_date: parsed.event_date || null,
            created_by: userId,
          })
          .select()
          .single();
        if (error) throw error;
        results.push({ ok: true, id: row.id });
      } catch (e: any) {
        results.push({ ok: false, error: e?.message ?? String(e) });
      }
    }
    return { results };
  });

// ---------- update / reject / publish ----------
export const updateDraft = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        final_category: z.enum(["gallery", "news", "activity", "notice"]).optional(),
        final_title_bn: z.string().max(300).optional(),
        final_body_bn: z.string().max(8000).optional(),
        final_date: z.string().nullable().optional(),
      })
      .parse(input)
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    await assertAdmin(userId);
    const { id, ...patch } = data;
    const { error } = await supabase
      .from("content_drafts")
      .update(patch)
      .eq("id", id)
      .eq("admin_status", "pending");
    if (error) {
      console.error("updateDraft failed", error);
      throw new Error(GENERIC_ERROR);
    }
    return { ok: true };
  });

export const rejectDraft = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    await assertAdmin(userId);
    const { error } = await supabase
      .from("content_drafts")
      .update({ admin_status: "rejected" })
      .eq("id", data.id)
      .eq("admin_status", "pending");
    if (error) {
      console.error("rejectDraft failed", error);
      throw new Error(GENERIC_ERROR);
    }
    return { ok: true };
  });

export const publishDraft = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    await assertAdmin(userId);

    const { data: d, error: e1 } = await supabase
      .from("content_drafts")
      .select("*")
      .eq("id", data.id)
      .single();
    if (e1 || !d) {
      console.error("publishDraft load failed", e1);
      throw new Error("Draft not found");
    }
    if (d.admin_status !== "pending") {
      throw new Error("এই draft আগেই প্রকাশিত বা বাতিল হয়েছে।");
    }

    const cat = d.final_category || d.ai_category;
    const title = d.final_title_bn || d.ai_title_bn || "শিরোনাম";
    const body = d.final_body_bn || d.ai_body_bn || d.original_caption;
    const date = d.final_date || d.ai_event_date || null;

    let targetTable = "";
    let recordId = "";

    if (cat === "news") {
      const { data: row, error } = await supabase
        .from("news")
        .insert({
          title_bn: title,
          summary_bn: d.ai_summary_bn,
          body_bn: body,
          cover_image_path: d.image_path,
          category: "সাধারণ",
          published_at: date ? new Date(date).toISOString() : new Date().toISOString(),
          created_by: userId,
        })
        .select("id")
        .single();
      if (error) { console.error("publish insert failed", error); throw new Error(GENERIC_ERROR); }
      targetTable = "news";
      recordId = row.id;
    } else if (cat === "notice") {
      const { data: row, error } = await supabase
        .from("notices")
        .insert({
          title_bn: title,
          body_bn: body,
          priority: 10,
          created_by: userId,
        })
        .select("id")
        .single();
      if (error) { console.error("publish insert failed", error); throw new Error(GENERIC_ERROR); }
      targetTable = "notices";
      recordId = row.id;
    } else if (cat === "activity") {
      const { data: row, error } = await supabase
        .from("activities")
        .insert({
          title_bn: title,
          description_bn: body,
          activity_date: date,
          location: "পাবনা",
          category: "সামাজিক",
          cover_image_path: d.image_path,
          created_by: userId,
        })
        .select("id")
        .single();
      if (error) { console.error("publish insert failed", error); throw new Error(GENERIC_ERROR); }
      targetTable = "activities";
      recordId = row.id;
    } else {
      // gallery
      if (!d.image_path) throw new Error("Gallery item-এ ছবি লাগবে");
      const { data: row, error } = await supabase
        .from("gallery_images")
        .insert({
          title,
          category: "সভা ও আলোচনা",
          image_path: d.image_path,
          caption_bn: d.ai_summary_bn || title,
          event_date: date,
          display_order: 0,
          created_by: userId,
        })
        .select("id")
        .single();
      if (error) { console.error("publish insert failed", error); throw new Error(GENERIC_ERROR); }
      targetTable = "gallery_images";
      recordId = row.id;
    }

    await supabase
      .from("content_drafts")
      .update({
        admin_status: "published",
        published_record_table: targetTable,
        published_record_id: recordId,
      })
      .eq("id", data.id);

    return { ok: true, table: targetTable, id: recordId };
  });
