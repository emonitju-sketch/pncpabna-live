# Plan: Constitution & Governance System for PNC

Build a digital constitution + civic engagement layer on top of the existing PNC site. Scope is intentionally split into phases so we ship value early.

## Phase 1 — Constitution System (digital gothontontro)

**New public route: `/constitution`**
- Chapter navigation sidebar (অধ্যায় ১–N) parsed from the uploaded `পাবনা_নাগরিক_কমিটি_PNC.txt`
- Two view modes toggle: **Legal version** (full text) and **Simple version** (plain-language summary per chapter — admin editable later, start with legal only)
- Sticky table of contents, in-page anchor scroll, search within constitution
- **Download PDF** button (generated client-side from the content)
- **QR code** block on the page for quick mobile access to `/constitution`
- **WhatsApp share** button
- Version badge (v1.0) + "last updated" date

**Data**
- Store chapters in a new `constitution_chapters` table: chapter_number, title_bn, body_bn, summary_bn, order, version
- Public read, admin write (RLS following existing pattern)
- Seed from the uploaded file in a migration

**Admin tab in `/admin`:** manage chapters + amendments log (`constitution_amendments` table: version, change_summary, effective_date)

## Phase 2 — Public Engagement (Civic Issues)

**New public route: `/issues`** + `/issues/$id`
- Citizens submit issues (title, description, category, location, optional photo upload to a new `issues` storage bucket)
- Public list with filter by status: Reported → Under Review → Action → Resolved
- Upvote/"vote problems" (one vote per device via localStorage initially; later per-account)
- Status timeline on detail page

**Data**
- `issues` table (status enum, vote_count, reporter_name, reporter_phone, etc.)
- `issue_updates` table (status changes + notes, admin authored)
- `issue_votes` table (device_id, issue_id) — RLS public insert with rate-limit check
- Admin tab: triage, update status, add resolution notes — every change auto-logged to existing `audit_logs`

## Phase 3 — Governance Decision Log

**Admin-only route: `/admin` → Decisions tab**
- Log every decision with: level (1 Normal / 2 Strategic / 3 Emergency), title, description, vote_for, vote_against, abstain, outcome, decided_by, ratified (for emergency)
- Validation: Level 2 needs ≥ 2/3 yes; Level 3 marked "pending ratification" until ratified flag set
- Conflict-of-interest checkbox per voter (logged, not enforced)
- Public read-only summary at `/decisions` (title, level, date, outcome) — full vote breakdown admin-only

**Data:** `decisions` table + `decision_votes` table, both audit-logged via existing trigger

## Out of scope (deferred — confirm in a follow-up)

These are listed in your message but each is a multi-week build. I'll flag for a separate plan:
- Financial system / treasurer module / annual audit reports
- Real digital election / voting engine
- Membership onboarding flow + show-cause / no-confidence workflow
- Native mobile app
- Notification system (push / email / WhatsApp broadcast)

## Technical notes

- All new tables get RLS: public read where appropriate, admin write via existing `has_role(auth.uid(),'admin')`
- Audit trigger `log_audit_event` attached to all new admin-managed tables
- PDF generation: `jspdf` + Bengali font (Noto Sans Bengali) bundled in `src/assets`
- QR codes: `qrcode.react` (no server needed)
- All routes follow existing TanStack file-route pattern with proper `head()` SEO metadata in Bengali

## Build order

1. Phase 1 (Constitution) — ship first, biggest user-visible win
2. Phase 2 (Issues) — public engagement loop
3. Phase 3 (Decisions) — internal governance

Confirm and I'll start with Phase 1.
