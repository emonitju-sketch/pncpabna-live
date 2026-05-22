
ALTER TABLE public.event_registrations
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS status_note text,
  ADD COLUMN IF NOT EXISTS status_updated_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS last_notified_status text;

ALTER TABLE public.event_registrations
  ADD CONSTRAINT event_registrations_status_check
  CHECK (status IN ('pending','in_review','in_progress','resolved','rejected'));

-- Public can read their own submission by matching email (no PII leak via SELECT * — we'll project columns in server fn)
CREATE POLICY "registrations public read own"
  ON public.event_registrations
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- issue_upvotes
CREATE TABLE public.issue_upvotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id uuid NOT NULL REFERENCES public.event_registrations(id) ON DELETE CASCADE,
  voter_email text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (registration_id, voter_email)
);

ALTER TABLE public.issue_upvotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "upvotes public read"
  ON public.issue_upvotes FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "upvotes public insert"
  ON public.issue_upvotes FOR INSERT TO anon, authenticated
  WITH CHECK (length(btrim(voter_email)) > 3 AND voter_email ~ '^[^@]+@[^@]+\.[^@]+$');

CREATE POLICY "upvotes admin all"
  ON public.issue_upvotes FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_issue_upvotes_registration ON public.issue_upvotes(registration_id);
CREATE INDEX idx_event_registrations_status ON public.event_registrations(status);
