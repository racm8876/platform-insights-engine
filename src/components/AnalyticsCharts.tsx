import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { useDemandTrends, useRecruiterActivity } from "@/hooks/useDashboardData";
import { Skeleton } from "@/components/ui/skeleton";

const ChartSkeleton = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
    <h3 className="font-display text-sm font-semibold text-card-foreground">{title}</h3>
    <p className="mb-4 text-xs text-muted-foreground">{subtitle}</p>
    <Skeleton className="h-[260px] w-full rounded" />
  </div>
);

const DemandTrendsChart = () => {
  const { data: demandData, isLoading } = useDemandTrends();

  if (isLoading) return <ChartSkeleton title="Job Market Demand by Vertical" subtitle="Open requisitions · Last 7 months" />;

  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
      <h3 className="font-display text-sm font-semibold text-card-foreground">Job Market Demand by Vertical</h3>
      <p className="mb-4 text-xs text-muted-foreground">Open requisitions · Last 7 months</p>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={demandData}>
          <defs>
            <linearGradient id="aiGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(239, 84%, 67%)" stopOpacity={0.2} />
              <stop offset="95%" stopColor="hsl(239, 84%, 67%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="cyberGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.2} />
              <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(215, 16%, 47%)" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "hsl(215, 16%, 47%)" }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ backgroundColor: "hsl(0, 0%, 100%)", border: "1px solid hsl(214, 32%, 91%)", borderRadius: "8px", fontSize: "12px" }} />
          <Area type="monotone" dataKey="ai" stroke="hsl(239, 84%, 67%)" fill="url(#aiGrad)" strokeWidth={2} name="AI Engineering" />
          <Area type="monotone" dataKey="cyber" stroke="hsl(160, 84%, 39%)" fill="url(#cyberGrad)" strokeWidth={2} name="Cybersecurity" />
          <Area type="monotone" dataKey="cloud" stroke="hsl(263, 70%, 58%)" fill="none" strokeWidth={2} strokeDasharray="4 4" name="Cloud Infra" />
          <Area type="monotone" dataKey="health" stroke="hsl(215, 16%, 47%)" fill="none" strokeWidth={1.5} strokeDasharray="2 2" name="Healthcare" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const RecruiterActivityChart = () => {
  const { data: recruiterData, isLoading } = useRecruiterActivity();

  if (isLoading) return <ChartSkeleton title="Top Recruiter Activity" subtitle="Placements & interviews · This quarter" />;

  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
      <h3 className="font-display text-sm font-semibold text-card-foreground">Top Recruiter Activity</h3>
      <p className="mb-4 text-xs text-muted-foreground">Placements & interviews · This quarter</p>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={recruiterData} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(215, 16%, 47%)" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "hsl(215, 16%, 47%)" }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ backgroundColor: "hsl(0, 0%, 100%)", border: "1px solid hsl(214, 32%, 91%)", borderRadius: "8px", fontSize: "12px" }} />
          <Bar dataKey="placements" fill="hsl(239, 84%, 67%)" radius={[4, 4, 0, 0]} name="Placements" />
          <Bar dataKey="interviews" fill="hsl(214, 32%, 91%)" radius={[4, 4, 0, 0]} name="Interviews" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export { DemandTrendsChart, RecruiterActivityChart };
