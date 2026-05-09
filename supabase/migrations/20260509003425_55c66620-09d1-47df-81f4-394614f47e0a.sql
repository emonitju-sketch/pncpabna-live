
-- Lock down has_role execution
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

-- Replace always-true insert policy with minimal sanity guard
DROP POLICY IF EXISTS "registrations public insert" ON public.event_registrations;

CREATE POLICY "registrations public insert" ON public.event_registrations
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    event_id IS NOT NULL
    AND length(btrim(full_name)) > 0
    AND length(btrim(phone)) > 0
  );
