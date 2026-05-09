
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "users read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Harden existing function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- event_registrations: admin-only read/delete; public insert stays
DROP POLICY IF EXISTS "registrations auth read" ON public.event_registrations;
DROP POLICY IF EXISTS "registrations auth delete" ON public.event_registrations;

CREATE POLICY "registrations admin read" ON public.event_registrations
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "registrations admin delete" ON public.event_registrations
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- events: admin-only writes
DROP POLICY IF EXISTS "events auth insert" ON public.events;
DROP POLICY IF EXISTS "events auth update" ON public.events;
DROP POLICY IF EXISTS "events auth delete" ON public.events;

CREATE POLICY "events admin insert" ON public.events
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "events admin update" ON public.events
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "events admin delete" ON public.events
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- gallery_images: admin-only writes
DROP POLICY IF EXISTS "gallery auth insert" ON public.gallery_images;
DROP POLICY IF EXISTS "gallery auth update" ON public.gallery_images;
DROP POLICY IF EXISTS "gallery auth delete" ON public.gallery_images;

CREATE POLICY "gallery admin insert" ON public.gallery_images
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "gallery admin update" ON public.gallery_images
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "gallery admin delete" ON public.gallery_images
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- reports: admin-only writes
DROP POLICY IF EXISTS "reports auth insert" ON public.reports;
DROP POLICY IF EXISTS "reports auth update" ON public.reports;
DROP POLICY IF EXISTS "reports auth delete" ON public.reports;

CREATE POLICY "reports admin insert" ON public.reports
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "reports admin update" ON public.reports
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "reports admin delete" ON public.reports
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Storage: prevent listing of public buckets; allow direct-by-name reads; admin writes
DROP POLICY IF EXISTS "Public read gallery" ON storage.objects;
DROP POLICY IF EXISTS "Public read reports" ON storage.objects;
DROP POLICY IF EXISTS "gallery public read" ON storage.objects;
DROP POLICY IF EXISTS "reports public read" ON storage.objects;

CREATE POLICY "gallery read by name" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'gallery' AND name IS NOT NULL);

CREATE POLICY "reports read by name" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'reports' AND name IS NOT NULL);

CREATE POLICY "gallery admin write" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'gallery' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'gallery' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "reports admin write" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'reports' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'reports' AND public.has_role(auth.uid(), 'admin'));
