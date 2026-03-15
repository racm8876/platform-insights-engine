
-- Jobs table
CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  industry TEXT NOT NULL,
  location TEXT NOT NULL,
  job_type TEXT NOT NULL DEFAULT 'full-time',
  required_skills TEXT[] NOT NULL DEFAULT '{}',
  salary_range TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  posted_by UUID,
  applications_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Candidates table
CREATE TABLE public.candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  skills TEXT[] NOT NULL DEFAULT '{}',
  experience_years INTEGER NOT NULL DEFAULT 0,
  industry TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  engagement_score NUMERIC NOT NULL DEFAULT 0,
  profile_completeness NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Applications table
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
  candidate_id UUID REFERENCES public.candidates(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'applied',
  applied_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  hired_at TIMESTAMPTZ
);

-- Agencies table (for licensing dashboard)
CREATE TABLE public.agencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  license_type TEXT NOT NULL DEFAULT 'standard',
  placements_count INTEGER NOT NULL DEFAULT 0,
  success_rate NUMERIC NOT NULL DEFAULT 0,
  engagement_score NUMERIC NOT NULL DEFAULT 0,
  active_recruiters INTEGER NOT NULL DEFAULT 0,
  partner_since TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- AI Insights table
CREATE TABLE public.ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  details TEXT,
  severity TEXT NOT NULL DEFAULT 'info',
  dashboard_target TEXT NOT NULL DEFAULT 'admin',
  is_actionable BOOLEAN NOT NULL DEFAULT false,
  generated_by TEXT NOT NULL DEFAULT 'platform-intelligence-agent',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Audit Logs table
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Read policies for authenticated users
CREATE POLICY "Authenticated can read jobs" ON public.jobs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can read candidates" ON public.candidates FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can read applications" ON public.applications FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can read agencies" ON public.agencies FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can read ai_insights" ON public.ai_insights FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can read audit_logs" ON public.audit_logs FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Admin write policies
CREATE POLICY "Admins can manage jobs" ON public.jobs FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage candidates" ON public.candidates FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage applications" ON public.applications FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage agencies" ON public.agencies FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage ai_insights" ON public.ai_insights FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage audit_logs" ON public.audit_logs FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Allow service role to insert insights and audit logs (edge functions)
CREATE POLICY "Service can insert insights" ON public.ai_insights FOR INSERT WITH CHECK (true);
CREATE POLICY "Service can insert audit_logs" ON public.audit_logs FOR INSERT WITH CHECK (true);
