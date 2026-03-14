import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface SparklineProps {
  data: number[];
  color?: string;
}

const Sparkline = ({ data, color = "hsl(var(--primary))" }: SparklineProps) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 80;
  const height = 28;
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * height}`)
    .join(" ");

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  sparkData: number[];
  isAiSurfaced?: boolean;
}

const MetricCard = ({ title, value, change, sparkData, isAiSurfaced = false }: MetricCardProps) => {
  const isPositive = change > 0;
  const isNeutral = change === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className="relative rounded-lg border border-border bg-card p-5 shadow-sm"
    >
      {isAiSurfaced && (
        <div className="absolute top-3 right-3 h-2 w-2 rounded-full bg-accent animate-pulse-glow" />
      )}
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</p>
      <div className="mt-2 flex items-end justify-between gap-3">
        <div>
          <p className="font-display text-2xl font-bold text-card-foreground">{value}</p>
          <div className="mt-1 flex items-center gap-1">
            {isNeutral ? (
              <Minus className="h-3 w-3 text-muted-foreground" />
            ) : isPositive ? (
              <TrendingUp className="h-3 w-3 text-success" />
            ) : (
              <TrendingDown className="h-3 w-3 text-destructive" />
            )}
            <span
              className={`text-xs font-semibold ${
                isNeutral ? "text-muted-foreground" : isPositive ? "text-success" : "text-destructive"
              }`}
            >
              {isPositive ? "+" : ""}
              {change}%
            </span>
            <span className="text-xs text-muted-foreground">vs last month</span>
          </div>
        </div>
        <Sparkline
          data={sparkData}
          color={isPositive ? "hsl(var(--success))" : isNeutral ? "hsl(var(--muted-foreground))" : "hsl(var(--destructive))"}
        />
      </div>
    </motion.div>
  );
};

export default MetricCard;
