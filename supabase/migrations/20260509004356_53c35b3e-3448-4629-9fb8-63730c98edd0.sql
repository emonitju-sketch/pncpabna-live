
CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  table_name text NOT NULL,
  action text NOT NULL CHECK (action IN ('INSERT','UPDATE','DELETE')),
  record_id uuid,
  user_id uuid,
  user_email text,
  old_data jsonb,
  new_data jsonb
);

CREATE INDEX idx_audit_logs_created_at ON public.audit_logs (created_at DESC);
CREATE INDEX idx_audit_logs_table ON public.audit_logs (table_name, created_at DESC);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audit admin read" ON public.audit_logs
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.log_audit_event()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_email text;
BEGIN
  SELECT email INTO v_email FROM auth.users WHERE id = v_user_id;

  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_logs (table_name, action, record_id, user_id, user_email, new_data)
    VALUES (TG_TABLE_NAME, TG_OP, NEW.id, v_user_id, v_email, to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.audit_logs (table_name, action, record_id, user_id, user_email, old_data, new_data)
    VALUES (TG_TABLE_NAME, TG_OP, NEW.id, v_user_id, v_email, to_jsonb(OLD), to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.audit_logs (table_name, action, record_id, user_id, user_email, old_data)
    VALUES (TG_TABLE_NAME, TG_OP, OLD.id, v_user_id, v_email, to_jsonb(OLD));
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.log_audit_event() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER gallery_images_audit
  AFTER INSERT OR UPDATE OR DELETE ON public.gallery_images
  FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

CREATE TRIGGER reports_audit
  AFTER INSERT OR UPDATE OR DELETE ON public.reports
  FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();
