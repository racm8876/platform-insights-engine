import DashboardLayout from "@/components/DashboardLayout";
import StatCard, { StatCardSkeleton } from "@/components/StatCard";
import InsightCard from "@/components/InsightCard";
import { useCandidates, useJobs, useAiInsights } from "@/hooks/usePlatformData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, BarChart3, Target, AlertTriangle } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell } from "recharts";

export default function HRDashboard() {
  const { data: candidates, isLoading } = useCandidates();
  const { data: jobs } = useJobs();
  const { data: insights } = useAiInsights("hr");

  const skillSupply = candidates?.flatMap((c: any) => c.skills || [])
    .reduce((acc: Record<string, number>, s: string) => { acc[s] = (acc[s] || 0) + 1; return acc; }, {}) || {};
  const skillDemand = jobs?.flatMap((j: any) => j.required_skills || [])
    .reduce((acc: Record<string, number>, s: string) => { acc[s] = (acc[s] || 0) + 1; return acc; }, {}) || {};

  const allSkills = [...new Set([...Object.keys(skillSupply), ...Object.keys(skillDemand)])];
  const skillGapData = allSkills.map(skill => ({
    skill,
    supply: skillSupply[skill] || 0,
    demand: skillDemand[skill] || 0,
    gap: (skillDemand[skill] || 0) - (skillSupply[skill] || 0),
  })).sort((a, b) => b.gap - a.gap).slice(0, 10);

  const industryDistribution = candidates?.reduce((acc: Record<string, number>, c: any) => {
    acc[c.industry] = (acc[c.industry] || 0) + 1; return acc;
  }, {}) || {};
  const industryData = Object.entries(industryDistribution).map(([name, value]) => ({ name, value }));
  const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--success))", "hsl(var(--destructive))", "#f59e0b"];

  const activeCandidates = candidates?.filter((c: any) => c.status === "active").length || 0;
  const avgProfileCompleteness = candidates?.length
    ? (candidates.reduce((s: number, c: any) => s + Number(c.profile_completeness), 0) / candidates.length).toFixed(0)
    : "0";
  const gapCount = skillGapData.filter(s => s.gap > 0).length;

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">HR Consultant Dashboard</h1>
          <p className="text-sm text-muted-foreground">Candidate trends, skill gap analysis, and hiring demand</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
          ) : (
            <>
              <StatCard title="Active Candidates" value={activeCandidates} icon={<Users className="h-5 w-5" />} trend={6} />
              <StatCard title="Total Skills Tracked" value={allSkills.length} icon={<BarChart3 className="h-5 w-5" />} />
              <StatCard title="Avg Profile Completeness" value={`${avgProfileCompleteness}%`} icon={<Target className="h-5 w-5" />} trend={3} />
              <StatCard title="Skill Gaps Detected" value={gapCount} icon={<AlertTriangle className="h-5 w-5" />} subtitle="skills with demand > supply" />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle className="text-sm">Skill Gap Analysis (Demand vs Supply)</CardTitle></CardHeader>
            <CardContent>
              <ChartContainer config={{ demand: { label: "Demand", color: "hsl(var(--primary))" }, supply: { label: "Supply", color: "hsl(var(--success))" } }} className="h-[300px]">
                <BarChart data={skillGapData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="skill" className="text-[10px]" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="demand" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="supply" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm">Candidate Industry Distribution</CardTitle></CardHeader>
            <CardContent>
              <ChartContainer config={{ value: { label: "Candidates" } }} className="h-[300px]">
                <PieChart>
                  <Pie data={industryData} cx="50%" cy="50%" outerRadius={100} dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {industryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-sm">Candidate Pipeline</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="py-2 pr-4">Name</th>
                    <th className="py-2 pr-4">Industry</th>
                    <th className="py-2 pr-4">Skills</th>
                    <th className="py-2 pr-4">Experience</th>
                    <th className="py-2 pr-4">Engagement</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates?.slice(0, 10).map((c: any) => (
                    <tr key={c.id} className="border-b border-border/50">
                      <td className="py-2 pr-4 font-medium">{c.name}</td>
                      <td className="py-2 pr-4">{c.industry}</td>
                      <td className="py-2 pr-4">
                        <div className="flex flex-wrap gap-1">
                          {(c.skills || []).slice(0, 3).map((s: string) => (
                            <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                          ))}
                          {(c.skills || []).length > 3 && <Badge variant="outline" className="text-[10px]">+{c.skills.length - 3}</Badge>}
                        </div>
                      </td>
                      <td className="py-2 pr-4">{c.experience_years}y</td>
                      <td className="py-2 pr-4">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-16 rounded-full bg-muted">
                            <div className="h-2 rounded-full bg-primary" style={{ width: `${c.engagement_score}%` }} />
                          </div>
                          <span className="text-xs">{c.engagement_score}</span>
                        </div>
                      </td>
                      <td className="py-2">
                        <Badge variant={c.status === "active" ? "default" : "secondary"}>{c.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {insights && insights.length > 0 && (
          <div>
            <h2 className="font-display text-lg font-semibold mb-3">HR Intelligence</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insights.slice(0, 4).map((insight: any) => (
                <InsightCard key={insight.id} title={insight.title} summary={insight.summary} details={insight.details} category={insight.category} severity={insight.severity} dashboardTarget={insight.dashboard_target} isActionable={insight.is_actionable} createdAt={insight.created_at} />
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
