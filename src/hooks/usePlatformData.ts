import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useJobs = () =>
  useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("jobs").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

export const useCandidates = () =>
  useQuery({
    queryKey: ["candidates"],
    queryFn: async () => {
      const { data, error } = await supabase.from("candidates").select("*").order("engagement_score", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

export const useApplications = () =>
  useQuery({
    queryKey: ["applications"],
    queryFn: async () => {
      const { data, error } = await supabase.from("applications").select("*, jobs(*), candidates(*)");
      if (error) throw error;
      return data;
    },
  });

export const useAgencies = () =>
  useQuery({
    queryKey: ["agencies"],
    queryFn: async () => {
      const { data, error } = await supabase.from("agencies").select("*").order("placements_count", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

export const useAiInsights = (dashboardTarget?: string) =>
  useQuery({
    queryKey: ["ai_insights", dashboardTarget],
    queryFn: async () => {
      let query = supabase.from("ai_insights").select("*").order("created_at", { ascending: false });
      if (dashboardTarget) query = query.eq("dashboard_target", dashboardTarget);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

export const useAuditLogs = () =>
  useQuery({
    queryKey: ["audit_logs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(50);
      if (error) throw error;
      return data;
    },
  });

export const useRunAiAgent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke("ai-agent");
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["ai_insights"] });
      queryClient.invalidateQueries({ queryKey: ["audit_logs"] });
      toast({
        title: "AI Agent Complete",
        description: `Generated ${data?.insights?.length || 0} new insights`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "AI Agent Error",
        description: error.message || "Failed to run AI agent",
        variant: "destructive",
      });
    },
  });
};
