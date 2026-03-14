import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useIntelligenceObservations } from "@/hooks/useDashboardData";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";

type Category = "trend" | "alert" | "recommendation";

const categoryStyles: Record<Category, string> = {
  trend: "bg-accent/10 text-accent border-accent/20",
  alert: "bg-destructive/10 text-destructive border-destructive/20",
  recommendation: "bg-success/10 text-success border-success/20",
};

const categoryLabels: Record<Category, string> = {
  trend: "Trend",
  alert: "Alert",
  recommendation: "Action",
};

const IntelligenceFeed = () => {
  const { data: observations, isLoading } = useIntelligenceObservations();

  return (
    <div className="rounded-lg border border-border bg-card shadow-sm">
      <div className="flex items-center gap-2 border-b border-border px-5 py-4">
        <Sparkles className="h-4 w-4 text-accent" />
        <h2 className="font-display text-sm font-semibold text-card-foreground">Intelligence Feed</h2>
      </div>
      <div className="divide-y divide-border">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-3 px-5 py-3.5">
                <Skeleton className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))
          : observations?.map((obs, i) => (
              <motion.div
                key={obs.id}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15, delay: i * 0.05 }}
                className="flex gap-3 px-5 py-3.5"
              >
                <div className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent animate-pulse-glow" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-relaxed text-card-foreground">{obs.message}</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span
                      className={`inline-flex rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${categoryStyles[obs.category as Category] || ""}`}
                    >
                      {categoryLabels[obs.category as Category] || obs.category}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {formatDistanceToNow(new Date(obs.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
      </div>
    </div>
  );
};

export default IntelligenceFeed;
