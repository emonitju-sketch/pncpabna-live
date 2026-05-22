CREATE TABLE public.activities (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title_bn text NOT NULL,
  description_bn text,
  activity_date date,
  location text,
  category text NOT NULL DEFAULT 'সামাজিক',
  cover_image_path text,
  is_published boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "activities public read" ON public.activities
  FOR SELECT TO anon, authenticated
  USING (is_published = true);

CREATE POLICY "activities admin all" ON public.activities
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER set_activities_updated_at
  BEFORE UPDATE ON public.activities
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_activities_date ON public.activities(activity_date DESC NULLS LAST);
CREATE INDEX idx_activities_category ON public.activities(category);