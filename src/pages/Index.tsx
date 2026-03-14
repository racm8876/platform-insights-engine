import MetricCard from "@/components/MetricCard";
import IntelligenceFeed from "@/components/IntelligenceFeed";
import { DemandTrendsChart, RecruiterActivityChart } from "@/components/AnalyticsCharts";
import PlacementTable from "@/components/PlacementTable";
import { Activity, Sparkles } from "lucide-react";

const metrics = [
  {
    title: "Placement Success Rate",
    value: "82.4%",
    change: 4.2,
    sparkData: [72, 74, 76, 78, 79, 81, 82],
    isAiSurfaced: false,
  },
  {
    title: "Candidate Engagement",
    value: "68.7%",
    change: -2.1,
    sparkData: [71, 70, 72, 69, 68, 69, 69],
    isAiSurfaced: true,
  },
  {
    title: "Active Requisitions",
    value: "1,247",
    change: 15.3,
    sparkData: [980, 1020, 1050, 1100, 1150, 1200, 1247],
    isAiSurfaced: true,
  },
  {
    title: "Avg Time-to-Fill",
    value: "23 days",
    change: -8.0,
    sparkData: [28, 27, 26, 25, 24, 24, 23],
    isAiSurfaced: false,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Activity className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold text-foreground">Platform Intelligence</h1>
              <p className="text-xs text-muted-foreground">Super Admin · Analytics Agent</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-3 py-1.5">
            <Sparkles className="h-3 w-3 text-accent" />
            <span className="text-xs font-medium text-accent">5 new insights</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-6">
        {/* Metrics Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m, i) => (
            <MetricCard key={i} {...m} />
          ))}
        </div>

        {/* Charts + Feed */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <DemandTrendsChart />
            <RecruiterActivityChart />
          </div>
          <div className="lg:col-span-1">
            <IntelligenceFeed />
          </div>
        </div>

        {/* Table */}
        <div className="mt-6">
          <PlacementTable />
        </div>
      </main>
    </div>
  );
};

export default Index;
