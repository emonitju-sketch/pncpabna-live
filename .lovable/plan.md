# ইস্যু রেজোলিউশন ট্র্যাকিং + ইমেইল নোটিফিকেশন

বিদ্যমান `event_registrations` টেবিলকে "ইস্যু/আবেদন" হিসেবে ব্যবহার করে স্ট্যাটাস ট্র্যাকিং, আপভোট ও ইমেইল আপডেট যোগ করব।

---

## ১. ডাটাবেস পরিবর্তন

**`event_registrations` টেবিলে নতুন কলাম:**
- `status` (text, default `'pending'`) — মান: `pending`, `in_review`, `in_progress`, `resolved`, `rejected`
- `status_note` (text, nullable) — অ্যাডমিনের মন্তব্য
- `status_updated_at` (timestamptz)
- `last_notified_status` (text, nullable) — ইমেইল ডুপ্লিকেট ঠেকাতে

**নতুন টেবিল `issue_upvotes`:**
- `id`, `registration_id` (FK), `voter_email` (text), `created_at`
- UNIQUE (registration_id, voter_email)
- public INSERT (rate-limit বাদে), public SELECT count
- voter_email থাকলে স্ট্যাটাস পরিবর্তনে তাকেও ইমেইল

**RLS:** বিদ্যমান admin policy বহাল, public-এর জন্য SELECT যোগ (যাতে নিজের আবেদন স্ট্যাটাস দেখা যায় টোকেন দিয়ে)। একটা পাবলিক রিড ফাংশন `get_issue_status(registration_id, email)` যাতে শুধু নিজের আবেদন দেখা যায়।

**ট্রিগার:** `event_registrations`-এ স্ট্যাটাস বদলালে → submitter + upvoter-দের email queue-এ enqueue করার জন্য একটা ফাংশন কল হবে।

---

## ২. ইমেইল ইনফ্রা

Lovable Cloud-এর built-in email system ব্যবহার করব (ডোমেইন সেটআপ লাগবে — প্রথম ধাপ)। তারপর:
- `email_domain--setup_email_infra` — queue + cron
- `email_domain--scaffold_transactional_email` — sender route
- নতুন টেম