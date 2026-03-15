import DashboardLayout from "@/components/DashboardLayout";
import StatCard, { StatCardSkeleton } from "@/components/StatCard";
import InsightCard from "@/components/InsightCard";
import { useJobs, useAiInsights } from "@/hooks/usePlatformData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, TrendingUp, Lightbulb, GraduationCap } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

export default function UserDashboard() {
  const { data: jobs, isLoading } = useJobs();
  const { data: insights } = useAiInsights("user");

  const openJobs = jobs?.filter((j: any) => j.status === "open") || [];
  const skillDemand = openJobs.flatMap((j: any) => j.required_skills || [])
    .reduce((acc: Record<string, number>, s: string) => { acc[s] = (acc[s] || 0) + 1; return acc; }, {});
  const topSkills = Object.entries(skillDemand)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 8)
    .map(([skill, count]) => ({ skill, count }));

  const industryJobs = openJobs.reduce((acc: Record<string, number>, j: any) => {
    acc[j.industry] = (acc[j.industry] || 0) + 1; return acc;
  }, {});
  const industryData = Object.entries(industryJobs).map(([industry, count]) => ({ industry, count }));

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">User Dashboard</h1>
          <p className="text-sm text-muted-foreground">Career suggestions, skill recommendations, and job market insights</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
          ) : (
            <>
              <StatCard title="Open Positions" value={openJobs.length} icon={<Briefcase className="h-5 w-5" />} trend={15} />
              <StatCard title="Top Skill Demand" value={topSkills[0]?.skill || "N/A"} icon={<TrendingUp className="h-5 w-5" />} subtitle={`${topSkills[0]?.count || 0} jobs`} />
              <StatCard title="Industries Hiring" value={Object.keys(industryJobs).length} icon={<GraduationCap className="h-5 w-5" />} />
              <StatCard title="Career Insights" value={insights?.length || 0} icon={<Lightbulb className="h-5 w-5" />} subtitle="AI-generated" />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle className="text-sm">Recommended Skills to Learn</CardTitle></CardHeader>
            <CardContent>
              <ChartContainer config={{ count: { label: "Jobs requiring", color: "hsl(var(--primary))" } }} className="h-[300px]">
                <BarChart data={topSkills} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="skill" width={100} className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm">Job Market by Industry</CardTitle></CardHeader>
            <CardContent>
              <ChartContainer config={{ count: { label: "Open positions", color: "hsl(var(--accent))" } }} className="h-[300px]">
                <BarChart data={industryData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="industry" className="text-xs" angle={-20} textAnchor="end" height={60} />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-sm">Latest Job Openings</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {openJobs.slice(0, 8).map((job: any) => (
                <div key={job.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="font-medium text-sm">{job.title}</p>
                    <p className="text-xs text-muted-foreground">{job.company} · {job.location}</p>
                    <div className="flex gap-1 mt-1">
                      {(job.required_skills || []).slice(0, 3).map((s: string) => (
                        <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-primary">{job.salary_range}</p>
                    <p className="text-[10px] text-muted-foreground">{job.applications_count} applicants</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {insights && insights.length > 0 && (
          <div>
            <h2 className="font-display text-lg font-semibold mb-3">Career Intelligence</h2>
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
