-- Prevent duplicate / spam event registrations by enforcing one registration per phone per event
CREATE UNIQUE INDEX IF NOT EXISTS event_registrations_event_phone_unique
  ON public.event_registrations (event_id, phone);