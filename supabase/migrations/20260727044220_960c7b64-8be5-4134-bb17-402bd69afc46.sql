
-- 1. Tighten program_registrations INSERT policy (was WITH CHECK true)
DROP POLICY IF EXISTS "Anyone can register" ON public.program_registrations;

CREATE POLICY "Public program registrations restricted"
ON public.program_registrations
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(btrim(name)) BETWEEN 2 AND 100
  AND length(btrim(email)) BETWEEN 3 AND 255
  AND email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND length(btrim(phone)) BETWEEN 10 AND 20
  AND (comment IS NULL OR length(comment) <= 1000)
  AND status = 'registered'
  AND source IN ('website', 'mcp')
  AND now() < TIMESTAMP WITH TIME ZONE '2026-06-26 23:30:00+06'
);

-- 2. Trigger-based enforcement of events.registration_open on event_registrations
CREATE OR REPLACE FUNCTION public.enforce_event_registration_open()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_open boolean;
BEGIN
  SELECT registration_open INTO v_open
  FROM public.events
  WHERE id = NEW.event_id;

  IF v_open IS NULL THEN
    RAISE EXCEPTION 'Event not found'
      USING ERRCODE = 'foreign_key_violation';
  END IF;

  IF v_open IS NOT TRUE THEN
    RAISE EXCEPTION 'Registration is closed for this event'
      USING ERRCODE = 'check_violation';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_event_registration_open_trg ON public.event_registrations;
CREATE TRIGGER enforce_event_registration_open_trg
BEFORE INSERT ON public.event_registrations
FOR EACH ROW
EXECUTE FUNCTION public.enforce_event_registration_open();
