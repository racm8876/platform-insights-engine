import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useMetrics = () =>
  useQuery({
    queryKey: ["metrics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("metrics")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

export const useIntelligenceObservations = () =>
  useQuery({
    queryKey: ["intelligence_observations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("intelligence_observations")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

export const usePlacementStats = () =>
  useQuery({
    queryKey: ["placement_stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("placement_stats")
        .select("*")
        .order("placements", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

export const useDemandTrends = () =>
  useQuery({
    queryKey: ["demand_trends"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("demand_trends")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

export const useRecruiterActivity = () =>
  useQuery({
    queryKey: ["recruiter_activity"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recruiter_activity")
        .select("*")
        .order("placements", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
