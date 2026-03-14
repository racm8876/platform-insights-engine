import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface Observation {
  id: string;
  message: string;
  category: "trend" | "alert" | "recommendation";
  timestamp: string;
}

const observations: Observation[] = [
  {
    id: "1",
    message: "Trend Detected: 12% surge in Cybersecurity demand over the past 3 weeks.",
    category: "trend",
    timestamp: "2 min ago",
  },
  {
    id: "2",
    message: "AI Engineering placements up 28% — consider expanding recruiter pipeline.",
    category: "recommendation",
    timestamp: "18 min ago",
  },
  {
    id: "3",
    message: "Candidate engagement dropped 5% in Healthcare vertical. Investigate sourcing channels.",
    category: "alert",
    timestamp: "1 hr ago",
  },
  {
    id: "4",
    message: "Top-performing recruiters averaging 3.2x placement rate vs platform median.",
    category: "trend",
    timestamp: "3 hr ago",
  },
  {
    id: "5",
    message: "Cloud Infrastructure roles showing 15% faster time-to-fill this quarter.",
    category: "trend",
    timestamp: "5 hr ago",
  },
];

const categoryStyles: Record<Observation["category"], string> = {
  trend: "bg-accent/10 text-accent border-accent/20",
  alert: "bg-destructive/10 text-destructive border-destructive/20",
  recommendation: "bg-success/10 text-success border-success/20",
};

const categoryLabels: Record<Observation["category"], string> = {
  trend: "Trend",
  alert: "Alert",
  recommendation: "Action",
};

const IntelligenceFeed = () => {
  return (
    <div className="rounded-lg border border-border bg-card shadow-sm">
      <div className="flex items-center gap-2 border-b border-border px-5 py-4">
        <Sparkles className="h-4 w-4 text-accent" />
        <h2 className="font-display text-sm font-semibold text-card-foreground">Intelligence Feed</h2>
      </div>
      <div className="divide-y divide-border">
        {observations.map((obs, i) => (
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
                  className={`inline-flex rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${categoryStyles[obs.category]}`}
                >
                  {categoryLabels[obs.category]}
                </span>
                <span className="text-[11px] text-muted-foreground">{obs.timestamp}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default IntelligenceFeed;
