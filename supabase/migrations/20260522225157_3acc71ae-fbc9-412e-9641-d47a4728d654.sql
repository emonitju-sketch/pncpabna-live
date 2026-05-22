DROP POLICY IF EXISTS "upvotes public insert" ON public.issue_upvotes;

CREATE POLICY "upvotes anon insert"
  ON public.issue_upvotes FOR INSERT
  TO anon
  WITH CHECK (
    length(btrim(voter_email)) > 3
    AND voter_email ~ '^[^@]+@[^@]+\.[^@]+$'
  );

CREATE POLICY "upvotes authenticated insert"
  ON public.issue_upvotes FOR INSERT
  TO authenticated
  WITH CHECK (
    length(btrim(voter_email)) > 3
    AND voter_email ~ '^[^@]+@[^@]+\.[^@]+$'
    AND lower(voter_email) = lower(auth.email())
  );