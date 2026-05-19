CREATE TABLE public.site_settings (
  id text PRIMARY KEY,
  hero_image_path text,
  hero_object_position text NOT NULL DEFAULT 'center',
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "site_settings public read"
  ON public.site_settings FOR SELECT
  TO public USING (true);

CREATE POLICY "site_settings admin insert"
  ON public.site_settings FOR INSERT
  TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "site_settings admin update"
  ON public.site_settings FOR UPDATE
  TO authenticated USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER site_settings_set_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.site_settings (id, hero_object_position) VALUES ('home', 'center')
  ON CONFLICT (id) DO NOTHING;