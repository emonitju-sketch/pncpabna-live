-- 1. Fix voter_email exposure: only admins can SELECT individual rows
DROP POLICY IF EXISTS "upvotes public read" ON public.issue_upvotes;

CREATE POLICY "upvotes admin read"
ON public.issue_upvotes
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Public-safe view exposing only aggregate counts (no emails)
CREATE OR REPLACE VIEW public.issue_upvote_counts
WITH (security_invoker = on) AS
SELECT registration_id, COUNT(*)::bigint AS upvote_count
FROM public.issue_upvotes
GROUP BY registration_id;

GRANT SELECT ON public.issue_upvote_counts TO anon, authenticated;

-- 2. Lock down SECURITY DEFINER functions from direct client execution
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon, authenticated, public;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;
-- log_audit_event is a trigger function, should not be callable by clients
REVOKE EXECUTE ON FUNCTION public.log_audit_event() FROM anon, authenticated, public;