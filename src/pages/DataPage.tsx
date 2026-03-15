import DashboardLayout from "@/components/DashboardLayout";
import { useJobs, useCandidates, useApplications } from "@/hooks/usePlatformData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DataPage() {
  const { data: jobs } = useJobs();
  const { data: candidates } = useCandidates();
  const { data: applications } = useApplications();

  const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    open: "default", closed: "secondary", hired: "default", applied: "outline",
    interviewed: "secondary", reviewed: "secondary", rejected: "destructive",
    active: "default", inactive: "secondary",
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Jobs & Candidates Data</h1>
          <p className="text-sm text-muted-foreground">Platform recruitment data overview</p>
        </div>

        <Tabs defaultValue="jobs">
          <TabsList>
            <TabsTrigger value="jobs">Jobs ({jobs?.length || 0})</TabsTrigger>
            <TabsTrigger value="candidates">Candidates ({candidates?.length || 0})</TabsTrigger>
            <TabsTrigger value="applications">Applications ({applications?.length || 0})</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs">
            <Card>
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-left text-muted-foreground">
                        <th className="py-2 pr-4">Title</th>
                        <th className="py-2 pr-4">Company</th>
                        <th className="py-2 pr-4">Industry</th>
                        <th className="py-2 pr-4">Location</th>
                        <th className="py-2 pr-4">Salary</th>
                        <th className="py-2 pr-4">Apps</th>
                        <th className="py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobs?.map((j: any) => (
                        <tr key={j.id} className="border-b border-border/50">
                          <td className="py-2 pr-4 font-medium">{j.title}</td>
                          <td className="py-2 pr-4">{j.company}</td>
                          <td className="py-2 pr-4">{j.industry}</td>
                          <td className="py-2 pr-4 text-xs">{j.location}</td>
                          <td className="py-2 pr-4 text-xs">{j.salary_range}</td>
                          <td className="py-2 pr-4">{j.applications_count}</td>
                          <td className="py-2"><Badge variant={statusColors[j.status] || "outline"}>{j.status}</Badge></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="candidates">
            <Card>
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-left text-muted-foreground">
                        <th className="py-2 pr-4">Name</th>
                        <th className="py-2 pr-4">Email</th>
                        <th className="py-2 pr-4">Industry</th>
                        <th className="py-2 pr-4">Exp</th>
                        <th className="py-2 pr-4">Skills</th>
                        <th className="py-2 pr-4">Engagement</th>
                        <th className="py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {candidates?.map((c: any) => (
                        <tr key={c.id} className="border-b border-border/50">
                          <td className="py-2 pr-4 font-medium">{c.name}</td>
                          <td className="py-2 pr-4 text-xs">{c.email}</td>
                          <td className="py-2 pr-4">{c.industry}</td>
                          <td className="py-2 pr-4">{c.experience_years}y</td>
                          <td className="py-2 pr-4">
                            <div className="flex flex-wrap gap-1">
                              {(c.skills || []).slice(0, 2).map((s: string) => <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>)}
                              {(c.skills || []).length > 2 && <Badge variant="outline" className="text-[10px]">+{c.skills.length - 2}</Badge>}
                            </div>
                          </td>
                          <td className="py-2 pr-4">{Number(c.engagement_score).toFixed(0)}</td>
                          <td className="py-2"><Badge variant={statusColors[c.status] || "outline"}>{c.status}</Badge></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications">
            <Card>
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-left text-muted-foreground">
                        <th className="py-2 pr-4">Job</th>
                        <th className="py-2 pr-4">Candidate</th>
                        <th className="py-2 pr-4">Applied</th>
                        <th className="py-2 pr-4">Reviewed</th>
                        <th className="py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications?.map((a: any) => (
                        <tr key={a.id} className="border-b border-border/50">
                          <td className="py-2 pr-4 font-medium">{a.jobs?.title || "—"}</td>
                          <td className="py-2 pr-4">{a.candidates?.name || "—"}</td>
                          <td className="py-2 pr-4 text-xs">{new Date(a.applied_at).toLocaleDateString()}</td>
                          <td className="py-2 pr-4 text-xs">{a.reviewed_at ? new Date(a.reviewed_at).toLocaleDateString() : "—"}</td>
                          <td className="py-2"><Badge variant={statusColors[a.status] || "outline"}>{a.status}</Badge></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
