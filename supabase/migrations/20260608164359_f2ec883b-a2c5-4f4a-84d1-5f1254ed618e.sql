
CREATE TABLE public.program_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  comment text,
  ip_address text,
  user_agent text,
  status text NOT NULL DEFAULT 'registered',
  source text NOT NULL DEFAULT 'website',
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.program_registrations TO anon, authenticated;
GRANT ALL ON public.program_registrations TO service_role;

ALTER TABLE public.program_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can register"
  ON public.program_registrations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view registrations"
  ON public.program_registrations
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update registrations"
  ON public.program_registrations
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete registrations"
  ON public.program_registrations
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX program_registrations_ip_created_idx
  ON public.program_registrations (ip_address, created_at DESC);
