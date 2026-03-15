import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, AlertTriangle, Info, AlertCircle, Lightbulb } from "lucide-react";

interface InsightCardProps {
  title: string;
  summary: string;
  details?: string | null;
  category: string;
  severity: string;
  dashboardTarget: string;
  isActionable: boolean;
  createdAt: string;
}

const severityConfig: Record<string, { icon: typeof Info; color: string }> = {
  info: { icon: Info, color: "text-blue-500" },
  warning: { icon: AlertTriangle, color: "text-amber-500" },
  critical: { icon: AlertCircle, color: "text-destructive" },
};

const categoryLabels: Record<string, string> = {
  skill_gap: "Skill Gap",
  market_trend: "Market Trend",
  hiring_bottleneck: "Hiring Bottleneck",
  engagement: "Engagement",
  performance: "Performance",
  career: "Career Path",
  platform: "Platform",
};

export default function InsightCard({ title, summary, details, category, severity, dashboardTarget, isActionable, createdAt }: InsightCardProps) {
  const sev = severityConfig[severity] || severityConfig.info;
  const Icon = sev.icon;

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <Icon className={`h-4 w-4 shrink-0 ${sev.color}`} />
            <CardTitle className="text-sm font-semibold leading-tight">{title}</CardTitle>
          </div>
          <div className="flex gap-1">
            {isActionable && (
              <Badge variant="outline" className="text-[10px] border-accent text-accent">
                <Lightbulb className="mr-1 h-3 w-3" />Actionable
              </Badge>
            )}
          </div>
        </div>
        <div className="flex gap-1.5 mt-1">
          <Badge variant="secondary" className="text-[10px]">{categoryLabels[category] || category}</Badge>
          <Badge variant="secondary" className="text-[10px]">{dashboardTarget}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground mb-2">{summary}</p>
        {details && <p className="text-xs text-muted-foreground">{details}</p>}
        <p className="text-[10px] text-muted-foreground mt-2">
          {new Date(createdAt).toLocaleDateString()} · <Brain className="inline h-3 w-3" /> AI Generated
        </p>
      </CardContent>
    </Card>
  );
}
