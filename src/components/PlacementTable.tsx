import { motion } from "framer-motion";

interface PlacementRow {
  industry: string;
  placements: number;
  successRate: number;
  avgDays: number;
  trend: number;
}

const data: PlacementRow[] = [
  { industry: "AI Engineering", placements: 147, successRate: 89, avgDays: 18, trend: 28 },
  { industry: "Cybersecurity", placements: 132, successRate: 85, avgDays: 22, trend: 12 },
  { industry: "Cloud Infrastructure", placements: 98, successRate: 82, avgDays: 25, trend: 8 },
  { industry: "Data Science", placements: 91, successRate: 79, avgDays: 21, trend: 5 },
  { industry: "Healthcare IT", placements: 64, successRate: 74, avgDays: 30, trend: -5 },
  { industry: "FinTech", placements: 58, successRate: 81, avgDays: 24, trend: 3 },
];

const PlacementTable = () => {
  return (
    <div className="rounded-lg border border-border bg-card shadow-sm">
      <div className="px-5 py-4 border-b border-border">
        <h3 className="font-display text-sm font-semibold text-card-foreground">Placement Success by Industry</h3>
        <p className="text-xs text-muted-foreground">Current quarter performance</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Industry</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">Placements</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">Success Rate</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">Avg Days</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((row, i) => (
              <motion.tr
                key={row.industry}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15, delay: i * 0.03 }}
                className="hover:bg-secondary/50 transition-colors duration-100"
              >
                <td className="px-5 py-3 font-medium text-card-foreground">{row.industry}</td>
                <td className="px-5 py-3 text-right font-body tabular-nums text-card-foreground">{row.placements}</td>
                <td className="px-5 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="h-1.5 w-16 rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-300"
                        style={{ width: `${row.successRate}%` }}
                      />
                    </div>
                    <span className="tabular-nums text-card-foreground">{row.successRate}%</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">{row.avgDays}d</td>
                <td className="px-5 py-3 text-right">
                  <span className={`text-xs font-semibold tabular-nums ${row.trend > 0 ? "text-success" : "text-destructive"}`}>
                    {row.trend > 0 ? "+" : ""}{row.trend}%
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlacementTable;
