
-- Timestamp update function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Metrics table
CREATE TABLE public.metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  value TEXT NOT NULL,
  change NUMERIC NOT NULL DEFAULT 0,
  spark_data NUMERIC[] NOT NULL DEFAULT '{}',
  is_ai_surfaced BOOLEAN NOT NULL DEFAULT false,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read metrics" ON public.metrics FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage metrics" ON public.metrics FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Intelligence observations
CREATE TABLE public.intelligence_observations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('trend', 'alert', 'recommendation')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.intelligence_observations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read observations" ON public.intelligence_observations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage observations" ON public.intelligence_observations FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Placement stats by industry
CREATE TABLE public.placement_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  industry TEXT NOT NULL,
  placements INTEGER NOT NULL DEFAULT 0,
  success_rate NUMERIC NOT NULL DEFAULT 0,
  avg_days INTEGER NOT NULL DEFAULT 0,
  trend NUMERIC NOT NULL DEFAULT 0,
  quarter TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.placement_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read placement_stats" ON public.placement_stats FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage placement_stats" ON public.placement_stats FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Demand trends (monthly data points)
CREATE TABLE public.demand_trends (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  month TEXT NOT NULL,
  ai INTEGER NOT NULL DEFAULT 0,
  cyber INTEGER NOT NULL DEFAULT 0,
  cloud INTEGER NOT NULL DEFAULT 0,
  health INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.demand_trends ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read demand_trends" ON public.demand_trends FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage demand_trends" ON public.demand_trends FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Recruiter activity
CREATE TABLE public.recruiter_activity (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  placements INTEGER NOT NULL DEFAULT 0,
  interviews INTEGER NOT NULL DEFAULT 0,
  quarter TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.recruiter_activity ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read recruiter_activity" ON public.recruiter_activity FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage recruiter_activity" ON public.recruiter_activity FOR ALL TO authenticated USING (true) WITH CHECK (true);
