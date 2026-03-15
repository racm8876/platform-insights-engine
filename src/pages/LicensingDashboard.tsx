import DashboardLayout from "@/components/DashboardLayout";
import StatCard, { StatCardSkeleton } from "@/components/StatCard";
import InsightCard from "@/components/InsightCard";
import { useAgencies, useAiInsights } from "@/hooks/usePlatformData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Award, TrendingUp, Users } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

export default function LicensingDashboard() {
  const { data: agencies, isLoading } = useAgencies();
  const { data: insights } = useAiInsights("licensing");

  const totalPlacements = agencies?.reduce((s: number, a: any) => s + a.placements_count, 0) || 0;
  const avgSuccessRate = agencies?.length
    ? (agencies.reduce((s: number, a: any) => s + Number(a.success_rate), 0) / agencies.length).toFixed(1)
    : "0";
  const totalRecruiters = agencies?.reduce((s: number, a: any) => s + a.active_recruiters, 0) || 0;

  const chartData = agencies?.map((a: any) => ({
    name: a.name.split(" ")[0],
    placements: a.placements_count,
    successRate: Number(a.success_rate),
  })) || [];

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Licensing Dashboard</h1>
          <p className="text-sm text-muted-foreground">Recruitment agency performance and partner engagement</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
          ) : (
            <>
              <StatCard title="Partner Agencies" value={agencies?.length || 0} icon={<Building2 className="h-5 w-5" />} />
              <StatCard title="Total Placements" value={totalPlacements} icon={<Award className="h-5 w-5" />} trend={14} />
              <StatCard title="Avg Success Rate" value={`${avgSuccessRate}%`} icon={<TrendingUp className="h-5 w-5" />} trend={2} />
              <StatCard title="Active Recruiters" value={totalRecruiters} icon={<Users className="h-5 w-5" />} />
            </>
          )}
        </div>

        <Card>
          <CardHeader><CardTitle className="text-sm">Agency Performance Comparison</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={{ placements: { label: "Placements", color: "hsl(var(--primary))" }, successRate: { label: "Success Rate %", color: "hsl(var(--success))" } }} className="h-[300px]">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="placements" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="successRate" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Agency Details</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="py-2 pr-4">Agency</th>
                    <th className="py-2 pr-4">License</th>
                    <th className="py-2 pr-4">Placements</th>
                    <th className="py-2 pr-4">Success Rate</th>
                    <th className="py-2 pr-4">Engagement</th>
                    <th className="py-2">Recruiters</th>
                  </tr>
                </thead>
                <tbody>
                  {agencies?.map((a: any) => (
                    <tr key={a.id} className="border-b border-border/50">
                      <td className="py-2 pr-4 font-medium">{a.name}</td>
                      <td className="py-2 pr-4"><Badge variant={a.license_type === "enterprise" ? "default" : a.license_type === "premium" ? "secondary" : "outline"}>{a.license_type}</Badge></td>
                      <td className="py-2 pr-4">{a.placements_count}</td>
                      <td className="py-2 pr-4">{Number(a.success_rate).toFixed(1)}%</td>
                      <td className="py-2 pr-4">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-16 rounded-full bg-muted">
                            <div className="h-2 rounded-full bg-accent" style={{ width: `${a.engagement_score}%` }} />
                          </div>
                          <span className="text-xs">{Number(a.engagement_score).toFixed(0)}</span>
                        </div>
                      </td>
                      <td className="py-2">{a.active_recruiters}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {insights && insights.length > 0 && (
          <div>
            <h2 className="font-display text-lg font-semibold mb-3">Partner Intelligence</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insights.map((insight: any) => (
                <InsightCard key={insight.id} title={insight.title} summary={insight.summary} details={insight.details} category={insight.category} severity={insight.severity} dashboardTarget={insight.dashboard_target} isActionable={insight.is_actionable} createdAt={insight.created_at} />
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
