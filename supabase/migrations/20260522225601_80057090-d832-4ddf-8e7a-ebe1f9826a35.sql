DROP POLICY IF EXISTS "registrations public insert" ON public.event_registrations;

CREATE POLICY "registrations public insert"
  ON public.event_registrations FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    event_id IS NOT NULL
    AND length(btrim(full_name)) > 0
    AND length(btrim(phone)) > 0
    AND (status IS NULL OR status = 'pending')
    AND status_note IS NULL
    AND last_notified_status IS NULL
  );