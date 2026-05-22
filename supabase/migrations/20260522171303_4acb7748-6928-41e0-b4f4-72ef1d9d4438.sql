ALTER TABLE public.activities
  ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS external_url text;

CREATE INDEX IF NOT EXISTS idx_activities_featured
  ON public.activities (is_featured, display_order DESC, activity_date DESC);