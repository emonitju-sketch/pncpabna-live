
-- gallery_images additions
ALTER TABLE public.gallery_images
  ADD COLUMN IF NOT EXISTS caption_bn text,
  ADD COLUMN IF NOT EXISTS event_date date,
  ADD COLUMN IF NOT EXISTS display_order integer NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_gallery_order ON public.gallery_images(display_order DESC, created_at DESC);

-- news table
CREATE TABLE public.news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_bn text NOT NULL,
  summary_bn text,
  body_bn text,
  cover_image_path text,
  source_url text,
  category text NOT NULL DEFAULT 'সাধারণ',
  published_at timestamptz NOT NULL DEFAULT now(),
  is_published boolean NOT NULL DEFAULT true,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
CREATE POLICY "news public read" ON public.news FOR SELECT TO anon, authenticated USING (is_published = true);
CREATE POLICY "news admin all" ON public.news FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE INDEX idx_news_published ON public.news(published_at DESC) WHERE is_published = true;
CREATE TRIGGER news_set_updated BEFORE UPDATE ON public.news FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- notices table
CREATE TABLE public.notices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_bn text NOT NULL,
  body_bn text,
  priority integer NOT NULL DEFAULT 0,
  starts_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz,
  is_active boolean NOT NULL DEFAULT true,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notices public read" ON public.notices FOR SELECT TO anon, authenticated
  USING (is_active = true AND starts_at <= now() AND (expires_at IS NULL OR expires_at > now()));
CREATE POLICY "notices admin all" ON public.notices FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE INDEX idx_notices_active ON public.notices(priority DESC, starts_at DESC) WHERE is_active = true;
CREATE TRIGGER notices_set_updated BEFORE UPDATE ON public.notices FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- content_drafts table
CREATE TABLE public.content_drafts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_path text,
  original_caption text NOT NULL,
  ai_category text,
  ai_title_bn text,
  ai_summary_bn text,
  ai_body_bn text,
  ai_tags text[],
  ai_event_date date,
  ai_confidence numeric,
  ai_model text,
  ai_raw_response jsonb,
  admin_status text NOT NULL DEFAULT 'pending',
  final_category text,
  final_title_bn text,
  final_body_bn text,
  final_date date,
  published_record_table text,
  published_record_id uuid,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT drafts_status_check CHECK (admin_status IN ('pending','approved','rejected','published')),
  CONSTRAINT drafts_category_check CHECK (
    ai_category IS NULL OR ai_category IN ('gallery','news','activity','notice')
  )
);
ALTER TABLE public.content_drafts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "drafts admin all" ON public.content_drafts FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE INDEX idx_drafts_status ON public.content_drafts(admin_status, created_at DESC);
CREATE TRIGGER drafts_set_updated BEFORE UPDATE ON public.content_drafts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
