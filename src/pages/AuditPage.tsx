import DashboardLayout from "@/components/DashboardLayout";
import { useAuditLogs } from "@/hooks/usePlatformData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Clock } from "lucide-react";

export default function AuditPage() {
  const { data: logs, isLoading } = useAuditLogs();

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Audit Logs</h1>
          <p className="text-sm text-muted-foreground">System transparency and compliance trail</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2"><Shield className="h-4 w-4" /> Activity Log</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="animate-pulse flex gap-3 py-2">
                    <div className="h-4 w-24 bg-muted rounded" />
                    <div className="h-4 flex-1 bg-muted rounded" />
                  </div>
                ))}
              </div>
            ) : logs && logs.length > 0 ? (
              <div className="space-y-2">
                {logs.map((log: any) => (
                  <div key={log.id} className="flex items-start gap-3 rounded-lg border border-border/50 p-3">
                    <Clock className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-[10px]">{log.action}</Badge>
                        <Badge variant="secondary" className="text-[10px]">{log.resource_type}</Badge>
                      </div>
                      {log.details && (
                        <p className="text-xs text-muted-foreground truncate">
                          {typeof log.details === "object" ? JSON.stringify(log.details) : log.details}
                        </p>
                      )}
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {new Date(log.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No audit logs yet. Run the AI agent to generate activity.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
