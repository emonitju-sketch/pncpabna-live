# ইস্যু রেজোলিউশন ট্র্যাকিং + ইমেইল নোটিফিকেশন

বিদ্যমান `event_registrations` টেবিলকে "ইস্যু/আবেদন" হিসেবে ব্যবহার করে স্ট্যাটাস ট্র্যাকিং, আপভোট ও ইমেইল আপডেট যোগ করব।

---

## ১. ডাটাবেস পরিবর্তন

**`event_registrations`-এ নতুন কলাম:**
- `status` (text, default `'pending'`) — `pending` / `in_review` / `in_progress` / `resolved` / `rejected`
- `status_note` (text, nullable) — অ্যাডমিনের মন্তব্য
- `status_updated_at` (timestamptz)
- `last_notified_status` (text, nullable) — ইমেইল ডুপ্লিকেট ঠেকাতে

**নতুন টেবিল `issue_upvotes`:**
- `id`, `registration_id` (FK→event_registrations), `voter_email` (text), `created_at`
- UNIQUE (registration_id, voter_email)
- public INSERT, public SELECT (count দেখানোর জন্য)

**RLS:**
- `event_registrations`: admin ALL (আছে), public SELECT যোগ — শুধু `email` মিললে নিজের আবেদন দেখা যাবে (Public Status Page)
- `issue_upvotes`: public SELECT + INSERT, admin ALL

---

## ২. ইমেইল ইনফ্রা (Lovable built-in)

ধাপ:
1. সেন্ডার ডোমেইন সেটআপ ডায়লগ (নিচে বাটন)
2. `email_domain--setup_email_infra` — queue + cron job
3. `email_domain--scaffold_transactional_email` — sender route
4. নতুন টেমপ্লেট `issue-status-update.tsx` (বাংলা, সবুজ-সোনালি ব্র্যান্ডিং)

**ট্রিগার:** Admin UI থেকে status বদলালে server function → submitter (`event_registrations.email`) + সব `issue_upvotes.voter_email`-কে আলাদা আলাদা ইমেইল enqueue করবে; `last_notified_status` আপডেট হবে যাতে রিসেন্ড না হয়।

---

## ৩. UI পরিবর্তন

**Admin (`/admin`) — নতুন ট্যাব "আবেদন/ইস্যু":**
- সব registrations টেবিল: name, phone, event, status badge, upvote count
- প্রতি সারিতে status dropdown + note ইনপুট → Save → server fn কল
- Filter: status, event

**Public — নতুন পেজ `/issues/$id`:**
- টাইটেল, বর্তমান স্ট্যাটাস (timeline), অ্যাডমিনের নোট
- আপভোট বাটন — visitor email + click → `issue_upvotes` insert
- ইমেইল আপডেট সাবস্ক্রিপশন (upvote-ই subscription হিসেবে কাজ করে)

**Public — `/issues` (লিস্ট):**
- সব registration কার্ড: title (event name), status badge, upvote count
- শুধু সাম্প্রতিক ৫০টা, status filter

**Registration form-এ note:** "স্ট্যাটাস আপডেট আপনার ইমেইলে পাঠানো হবে।"

---

## ৪. টেকনিক্যাল

**Server functions** (`src/lib/issues.functions.ts`):
- `updateIssueStatus({ id, status, note })` — admin only (`requireSupabaseAuth` + `has_role` check), Supabase update + enqueue emails via `enqueue_email` RPC
- `upvoteIssue({ registrationId, email })` — public, insert into `issue_upvotes`
- `getPublicIssue({ id })` — public read

**Email template** `issue-status-update.tsx`:
- Props: `issueTitle`, `oldStatus`, `newStatus`, `note`, `viewUrl`
- Subject: `আপনার আবেদনের স্ট্যাটাস: <newStatus_bn>`

**Status বাংলা ম্যাপিং:** pending→অপেক্ষমাণ, in_review→যাচাই হচ্ছে, in_progress→কাজ চলছে, resolved→সমাধান হয়েছে, rejected→অগ্রহণযোগ্য।

---

## বিল্ড অর্ডার

1. মাইগ্রেশন (কলাম + `issue_upvotes` + RLS)
2. ইমেইল ডোমেইন সেটআপ → infra → scaffold
3. ইমেইল টেমপ্লেট + server functions
4. Admin "ইস্যু" ট্যাব
5. Public `/issues` ও `/issues/$id` পেজ + আপভোট
6. Registration form-এ আপডেট-নোটিস

---

## প্রথম স্টেপ যা এখনই দরকার

ইমেইল পাঠাতে একটা sender ডোমেইন setup করতে হবে। সেটা শেষ হলে বাকি সব auto-build হবে।
