
CREATE TABLE public.mcp_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  tool_name text NOT NULL,
  user_id uuid,
  user_email text,
  client_id text,
  success boolean NOT NULL,
  error_message text,
  duration_ms integer,
  input_summary jsonb,
  ip_address text,
  user_agent text
);

CREATE INDEX idx_mcp_audit_logs_created_at ON public.mcp_audit_logs (created_at DESC);
CREATE INDEX idx_mcp_audit_logs_tool_name ON public.mcp_audit_logs (tool_name);
CREATE INDEX idx_mcp_audit_logs_user_id ON public.mcp_audit_logs (user_id);
CREATE INDEX idx_mcp_audit_logs_success ON public.mcp_audit_logs (success);

GRANT SELECT ON public.mcp_audit_logs TO authenticated;
GRANT ALL ON public.mcp_audit_logs TO service_role;

ALTER TABLE public.mcp_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all MCP audit logs"
  ON public.mcp_audit_logs
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
