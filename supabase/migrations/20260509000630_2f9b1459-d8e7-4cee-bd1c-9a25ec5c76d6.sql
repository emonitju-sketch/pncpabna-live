
-- EVENTS
create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  event_date timestamptz not null,
  location text not null,
  registration_open boolean not null default true,
  cover_image_path text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.events enable row level security;
create policy "events public read" on public.events for select using (true);
create policy "events auth insert" on public.events for insert to authenticated with check (true);
create policy "events auth update" on public.events for update to authenticated using (true) with check (true);
create policy "events auth delete" on public.events for delete to authenticated using (true);

-- EVENT REGISTRATIONS
create table public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  full_name text not null,
  phone text not null,
  email text,
  notes text,
  created_at timestamptz not null default now()
);
alter table public.event_registrations enable row level security;
create policy "registrations public insert" on public.event_registrations for insert to anon, authenticated with check (true);
create policy "registrations auth read" on public.event_registrations for select to authenticated using (true);
create policy "registrations auth delete" on public.event_registrations for delete to authenticated using (true);
create index on public.event_registrations(event_id);

-- GALLERY
create table public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  image_path text not null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
alter table public.gallery_images enable row level security;
create policy "gallery public read" on public.gallery_images for select using (true);
create policy "gallery auth insert" on public.gallery_images for insert to authenticated with check (true);
create policy "gallery auth update" on public.gallery_images for update to authenticated using (true) with check (true);
create policy "gallery auth delete" on public.gallery_images for delete to authenticated using (true);

-- REPORTS
create table public.reports (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  year int not null,
  description text,
  file_path text not null,
  created_by uuid references auth.users(id) on delete set null,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
alter table public.reports enable row level security;
create policy "reports public read" on public.reports for select using (true);
create policy "reports auth insert" on public.reports for insert to authenticated with check (true);
create policy "reports auth update" on public.reports for update to authenticated using (true) with check (true);
create policy "reports auth delete" on public.reports for delete to authenticated using (true);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;
create trigger events_updated_at before update on public.events for each row execute function public.set_updated_at();

-- STORAGE BUCKETS
insert into storage.buckets (id, name, public) values ('gallery', 'gallery', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('reports', 'reports', true) on conflict (id) do nothing;

-- STORAGE POLICIES
create policy "gallery public read" on storage.objects for select using (bucket_id = 'gallery');
create policy "gallery auth write" on storage.objects for insert to authenticated with check (bucket_id = 'gallery');
create policy "gallery auth update" on storage.objects for update to authenticated using (bucket_id = 'gallery');
create policy "gallery auth delete" on storage.objects for delete to authenticated using (bucket_id = 'gallery');

create policy "reports public read" on storage.objects for select using (bucket_id = 'reports');
create policy "reports auth write" on storage.objects for insert to authenticated with check (bucket_id = 'reports');
create policy "reports auth update" on storage.objects for update to authenticated using (bucket_id = 'reports');
create policy "reports auth delete" on storage.objects for delete to authenticated using (bucket_id = 'reports');
