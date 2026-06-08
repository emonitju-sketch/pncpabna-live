# নাগরিক সংলাপ ২০২৬ — Implementation Plan

## 1. Constants (single source of truth)
Create `src/lib/nagorik-songlap.ts`:
- `REGISTRATION_DEADLINE = new Date("2026-06-26T23:30:00+06:00")`
- `POPUP_KEY = "pnc:nagorik-songlap-2026"`
- `EVENT_SLUG = "nagorik-songlap-2026"`
- helper `isRegistrationOpen()`

## 2. Database (migration)
Table `public.program_registrations`:
- `id uuid pk`, `name`, `email`, `phone`, `comment` (nullable)
- `ip_address`, `user_agent`, `status` default 'registered', `source` default 'website'
- `created_at timestamptz default now()`

GRANTs:
- `INSERT` to `anon`, `authenticated`
- `ALL` to `service_role`

RLS:
- Public: INSERT only
- Admin (uses existing `has_role(_, 'admin')`): SELECT, UPDATE, DELETE

## 3. Server route — registration submit
`src/routes/api/public/nagorik-songlap-2026.ts` (POST)
- Zod validate (name 2-100, email, phone 10-15, comment max 1000)
- Check `new Date() < REGISTRATION_DEADLINE` → else 403 closed message
- Rate limit: 5/hour per IP via `supabaseAdmin` count on `ip_address` + `created_at > now() - interval '1 hour'`
- Insert via `supabaseAdmin` with `ip_address`, `user_agent`

## 4. Registration page
`src/routes/nagorik-songlap-2026.tsx`
- SEO meta: title, description, og:type=event, og:image, twitter card
- JSON-LD Event schema in `scripts`
- If open: form (name, email, phone, comment) → POST to `/api/public/nagorik-songlap-2026`
- If closed: "নিবন্ধন কার্যক্রম সমাপ্ত হয়েছে।" + CTA back to home/about
- Toast on success/error

## 5. Homepage popup
`src/components/site/NagorikSonglapPopup.tsx`
- On `/`, if `isRegistrationOpen()` and not dismissed → show after 1200ms
- Dismiss sets `localStorage[POPUP_KEY] = "true"`
- CTA → Link to `/nagorik-songlap-2026`
- Mount in `src/routes/index.tsx`

## 6. Sitemap
Add `/nagorik-songlap-2026` to `src/routes/sitemap[.]xml.ts`.

## Notes
- Uses existing `supabaseAdmin` and Lovable Cloud (no edge functions).
- All Bengali UI text.
- DB migration is sent first for approval; code referencing the table follows after approval.
