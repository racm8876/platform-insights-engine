import MetricCard, { MetricCardSkeleton } from "@/components/MetricCard";
import IntelligenceFeed from "@/components/IntelligenceFeed";
import { DemandTrendsChart, RecruiterActivityChart } from "@/components/AnalyticsCharts";
import PlacementTable from "@/components/PlacementTable";
import { Activity, Sparkles, LogOut } from "lucide-react";
import { useMetrics } from "@/hooks/useDashboardData";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { data: metrics, isLoading } = useMetrics();
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Activity className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold text-foreground">Platform Intelligence</h1>
              <p className="text-xs text-muted-foreground">{user?.email} · Admin</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-3 py-1.5">
              <Sparkles className="h-3 w-3 text-accent" />
              <span className="text-xs font-medium text-accent">Live data</span>
            </div>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <MetricCardSkeleton key={i} />)
            : metrics?.map((m) => (
                <MetricCard
                  key={m.id}
                  title={m.title}
                  value={m.value}
                  change={Number(m.change)}
                  sparkData={m.spark_data}
                  isAiSurfaced={m.is_ai_surfaced}
                />
              ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <DemandTrendsChart />
            <RecruiterActivityChart />
          </div>
          <div className="lg:col-span-1">
            <IntelligenceFeed />
          </div>
        </div>

        <div className="mt-6">
          <PlacementTable />
        </div>
      </main>
    </div>
  );
};

export default Index;
