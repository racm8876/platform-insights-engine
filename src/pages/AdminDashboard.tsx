import DashboardLayout from "@/components/DashboardLayout";
import StatCard, { StatCardSkeleton } from "@/components/StatCard";
import InsightCard from "@/components/InsightCard";
import { useMetrics, usePlacementStats, useDemandTrends, useRecruiterActivity } from "@/hooks/useDashboardData";
import { useJobs, useCandidates, useApplications, useAiInsights, useRunAiAgent } from "@/hooks/usePlatformData";
import { DemandTrendsChart, RecruiterActivityChart } from "@/components/AnalyticsCharts";
import PlacementTable from "@/components/PlacementTable";
import IntelligenceFeed from "@/components/IntelligenceFeed";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, Users, Briefcase, TrendingUp, Brain, Loader2 } from "lucide-react";

export default function AdminDashboard() {
  const { data: jobs } = useJobs();
  const { data: candidates } = useCandidates();
  const { data: applications } = useApplications();
  const { data: insights } = useAiInsights("admin");
  const { data: metrics, isLoading } = useMetrics();
  const aiAgent = useRunAiAgent();

  const totalJobs = jobs?.length || 0;
  const totalCandidates = candidates?.length || 0;
  const hiredCount = applications?.filter((a: any) => a.status === "hired").length || 0;
  const hiringRate = applications?.length ? ((hiredCount / applications.length) * 100).toFixed(1) : "0";
  const avgEngagement = candidates?.length
    ? (candidates.reduce((s: number, c: any) => s + Number(c.engagement_score), 0) / candidates.length).toFixed(0)
    : "0";

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Super Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Platform-wide analytics and AI-powered insights</p>
          </div>
          <Button onClick={() => aiAgent.mutate()} disabled={aiAgent.isPending} className="gap-2">
            {aiAgent.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Brain className="h-4 w-4" />}
            Generate AI Insights
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
          ) : (
            <>
              <StatCard title="Total Jobs" value={totalJobs} icon={<Briefcase className="h-5 w-5" />} trend={12} subtitle="vs last quarter" />
              <StatCard title="Active Candidates" value={totalCandidates} icon={<Users className="h-5 w-5" />} trend={8} subtitle="vs last quarter" />
              <StatCard title="Hiring Rate" value={`${hiringRate}%`} icon={<TrendingUp className="h-5 w-5" />} trend={-3} subtitle="success rate" />
              <StatCard title="Avg Engagement" value={`${avgEngagement}/100`} icon={<LayoutDashboard className="h-5 w-5" />} trend={5} subtitle="platform-wide" />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <DemandTrendsChart />
            <RecruiterActivityChart />
          </div>
          <div className="space-y-6">
            <IntelligenceFeed />
          </div>
        </div>

        {insights && insights.length > 0 && (
          <div>
            <h2 className="font-display text-lg font-semibold mb-3">AI Intelligence Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insights.slice(0, 4).map((insight: any) => (
                <InsightCard
                  key={insight.id}
                  title={insight.title}
                  summary={insight.summary}
                  details={insight.details}
                  category={insight.category}
                  severity={insight.severity}
                  dashboardTarget={insight.dashboard_target}
                  isActionable={insight.is_actionable}
                  createdAt={insight.created_at}
                />
              ))}
            </div>
          </div>
        )}

        <PlacementTable />
      </div>
    </DashboardLayout>
  );
}
