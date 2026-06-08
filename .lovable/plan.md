# AI-Powered Content Studio

অ্যাডমিন একসাথে অনেক ছবি + caption upload করবেন → Lovable AI (Gemini) প্রতিটাকে পড়ে category, title, summary, tags suggest করবে → অ্যাডমিন review/edit করে publish বাটনে চাপলে সঠিক section-এ লাইভ যাবে।

---

## ১. ডাটাবেস

**নতুন টেবিল `content_drafts`:**
- `id`, `image_path` (storage), `original_caption` (FB-এর raw text)
- `ai_category` — `gallery` / `news` / `activity` / `notice`
- `ai_title_bn`, `ai_summary_bn`, `ai_body_bn`, `ai_tags` (text[])
- `ai_confidence` (0-1), `ai_model`, `ai_raw_response` (jsonb — debugging)
- `admin_status` — `pending` / `approved` / `rejected` / `published`
- `final_category`, `final_title_bn`, `final_body_bn`, `final_date` (edit-able)
- `published_record_id` (publish হলে কোন target table-এ গেছে তার ref)
- `created_by`, `created_at`, `updated_at`

**নতুন টেবিল `news` ও `notices`** (পূর্বের প্ল্যান থেকে): publish target।
**বিদ্যমান `gallery_images`-এ কলাম যোগ:** `caption_bn`, `event_date`, `display_order` (পূর্ব প্ল্যান অনুযায়ী)।

**Storage bucket** `gallery` (আছে) — drafts-ও এখানেই, একই path publish-এর পরও থাকবে (move দরকার নেই)।

**RLS:** `content_drafts` admin-only ALL। `news`/`notices` public SELECT + admin ALL।

---

## ২. AI Categorization (Lovable AI — free Gemini)

Server function `categorizeContent({ image_url, caption })`:
- Gemini-2.5-flash কে structured JSON output দিতে বলবে
- Schema: `{ category, title_bn, summary_bn, body_bn, tags[], event_date?, confidence }`
- বাংলায় output, caption ইংরেজি হলেও বাংলা সংস্করণ তৈরি করবে
- ছবি analyze করে context-aware decision (ভিড়, ব্যানার, ইনডোর সভা, প্রেস কভারেজ ইত্যাদি)

**Routing logic (prompt-এ):**
- ব্যানার + লোক + কোনো নির্দিষ্ট তারিখের event → **activity**
- সাংবাদিক/প্রেস উল্লেখ, ঘোষণা, বিবৃতি → **news**
- নিছক ছবি/মুহূর্ত (caption ছোট, descriptive) → **gallery**
- "জরুরি", "সবার অবগতির জন্য", তারিখ-নির্ভর alert → **notice**

---

## ৩. অ্যাডমিন UI (`/admin` → নতুন ট্যাব "Content Studio")

**Step 1 — Bulk Upload:**
- Drag-drop zone (একসাথে ২০টা পর্যন্ত ছবি)
- প্রতি ছবির পাশে textarea — caption paste করার জন্য
- "Analyze with AI" বাটন → server fn loop চালাবে, progress bar

**Step 2 — Review Grid:**
- প্রতিটা draft কার্ড: ছবি + AI-suggested category badge + title + summary + tags
- Inline edit (title, body, category dropdown, date)
- Buttons: ✅ Approve & Publish | ✏️ Save Draft | ❌ Reject
- Bulk action: "Approve all in News category"

**Step 3 — Publish:**
- Approve চাপলে server fn target table-এ insert করে (`final_category` অনুযায়ী)
- `content_drafts.admin_status='published'`, `published_record_id` সেট
- ৩ সেকেন্ডে লাইভ পেজে দৃশ্যমান

---

## ৪. পাবলিক পেজ আপডেট

- `/news` — `news` টেবিল থেকে dynamic, category filter, search
- `/activities` ও `/events` — `events` টেবিল (publish target)
- `/gallery` — `gallery_images` থেকে category tab + lightbox + caption
- `হোম` — `notices` থেকে highlight strip + সাম্প্রতিক ৩টা news + ৬টা gallery thumb

---

## ৫. টেকনিক্যাল

**Server functions** (`src/lib/content-studio.functions.ts`):
- `analyzeDrafts({ drafts: [{image_path, caption}] })` — admin, Gemini call, drafts insert
- `updateDraft({ id, fields })` — admin
- `publishDraft({ id })` — admin, target table-এ insert
- `rejectDraft({ id })` — admin

**AI call:** Lovable AI Gateway, model `google/gemini-2.5-flash` (cost-efficient, multimodal), JSON mode। কোনো user secret লাগবে না।

**Rate limiting:** একসাথে ৫টার বেশি concurrent call না, queue-style sequential।

---

## বিল্ড অর্ডার

1. মাইগ্রেশন (`content_drafts`, `news`, `notices`, `gallery_images` কলাম)
2. `categorizeContent` server fn + JSON schema
3. Admin "Content Studio" ট্যাব (upload + analyze + review grid)
4. Publish flow (target table insert)
5. পাবলিক পেজ wiring (`/news`, `/gallery`, হোম)
6. আপনার দেওয়া FB caption + ছবি দিয়ে seed run

---

## আপনার থেকে যা লাগবে (build শেষ হলে)

ছবিগুলো + প্রতিটার caption text (Facebook থেকে কপি)। বাকি AI সাজাবে, আপনি শুধু review করবেন।
