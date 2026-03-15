
-- Fix overly permissive insert policies - restrict to service role only by dropping and recreating
DROP POLICY "Service can insert insights" ON public.ai_insights;
DROP POLICY "Service can insert audit_logs" ON public.audit_logs;
