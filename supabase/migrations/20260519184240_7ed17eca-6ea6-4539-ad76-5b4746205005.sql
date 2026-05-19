CREATE TABLE public.constitution_amendments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  version text NOT NULL,
  change_summary_bn text NOT NULL,
  effective_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.constitution_amendments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "amendments public read" ON public.constitution_amendments FOR SELECT USING (true);
CREATE POLICY "amendments admin insert" ON public.constitution_amendments FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(),'admin'));
CREATE POLICY "amendments admin update" ON public.constitution_amendments FOR UPDATE TO authenticated USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));
CREATE POLICY "amendments admin delete" ON public.constitution_amendments FOR DELETE TO authenticated USING (has_role(auth.uid(),'admin'));
CREATE TRIGGER audit_amendments AFTER INSERT OR UPDATE OR DELETE ON public.constitution_amendments FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

INSERT INTO public.constitution_amendments (version, change_summary_bn, effective_date)
VALUES ('v1.0', 'প্রাথমিক প্রকাশ - পূর্ণাঙ্গ গঠনতন্ত্র চূড়ান্ত ও কার্যকর।', CURRENT_DATE);