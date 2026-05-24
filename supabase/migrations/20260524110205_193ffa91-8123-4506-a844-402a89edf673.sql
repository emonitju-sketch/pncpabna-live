ALTER TABLE public.notices
  ADD COLUMN IF NOT EXISTS cover_image_path text,
  ADD COLUMN IF NOT EXISTS slug text UNIQUE,
  ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'ঘোষণা';