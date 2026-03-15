import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Gather platform data
    const [jobsRes, candidatesRes, appsRes, agenciesRes] = await Promise.all([
      supabase.from("jobs").select("*"),
      supabase.from("candidates").select("*"),
      supabase.from("applications").select("*"),
      supabase.from("agencies").select("*"),
    ]);

    const platformData = {
      jobs: jobsRes.data || [],
      candidates: candidatesRes.data || [],
      applications: appsRes.data || [],
      agencies: agenciesRes.data || [],
    };

    const stats = {
      totalJobs: platformData.jobs.length,
      openJobs: platformData.jobs.filter((j: any) => j.status === "open").length,
      totalCandidates: platformData.candidates.length,
      activeCandidates: platformData.candidates.filter((c: any) => c.status === "active").length,
      totalApplications: platformData.applications.length,
      hiredCount: platformData.applications.filter((a: any) => a.status === "hired").length,
      avgEngagement: platformData.candidates.length > 0
        ? (platformData.candidates.reduce((s: number, c: any) => s + Number(c.engagement_score), 0) / platformData.candidates.length).toFixed(1)
        : 0,
      lowEngagementPct: platformData.candidates.length > 0
        ? ((platformData.candidates.filter((c: any) => Number(c.engagement_score) < 50).length / platformData.candidates.length) * 100).toFixed(1)
        : 0,
      industriesBreakdown: Object.entries(
        platformData.jobs.reduce((acc: any, j: any) => { acc[j.industry] = (acc[j.industry] || 0) + 1; return acc; }, {})
      ),
      skillDemand: platformData.jobs.flatMap((j: any) => j.required_skills || [])
        .reduce((acc: any, s: string) => { acc[s] = (acc[s] || 0) + 1; return acc; }, {}),
      candidateSkills: platformData.candidates.flatMap((c: any) => c.skills || [])
        .reduce((acc: any, s: string) => { acc[s] = (acc[s] || 0) + 1; return acc; }, {}),
    };

    const prompt = `You are the Platform Intelligence Agent for a recruitment analytics platform. Analyze this data and generate exactly 5 actionable insights.

PLATFORM DATA SUMMARY:
- Total Jobs: ${stats.totalJobs} (${stats.openJobs} open)
- Total Candidates: ${stats.totalCandidates} (${stats.activeCandidates} active)
- Total Applications: ${stats.totalApplications}
- Successful Hires: ${stats.hiredCount}
- Average Engagement Score: ${stats.avgEngagement}/100
- Low Engagement Users: ${stats.lowEngagementPct}%
- Industry Distribution: ${JSON.stringify(Object.fromEntries(stats.industriesBreakdown))}
- Top Required Skills: ${JSON.stringify(stats.skillDemand)}
- Candidate Skill Supply: ${JSON.stringify(stats.candidateSkills)}
- Agencies: ${platformData.agencies.length} partners, avg success rate: ${platformData.agencies.length > 0 ? (platformData.agencies.reduce((s: number, a: any) => s + Number(a.success_rate), 0) / platformData.agencies.length).toFixed(1) : 0}%

Generate insights covering: skill gaps, market trends, hiring bottlenecks, engagement issues, and strategic recommendations.`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are a recruitment platform intelligence agent. Return ONLY valid JSON array of insights." },
          { role: "user", content: prompt },
        ],
        tools: [{
          type: "function",
          function: {
            name: "generate_insights",
            description: "Generate platform intelligence insights",
            parameters: {
              type: "object",
              properties: {
                insights: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      category: { type: "string", enum: ["skill_gap", "market_trend", "hiring_bottleneck", "engagement", "performance", "career", "platform"] },
                      title: { type: "string" },
                      summary: { type: "string" },
                      details: { type: "string" },
                      severity: { type: "string", enum: ["info", "warning", "critical"] },
                      dashboard_target: { type: "string", enum: ["admin", "hr", "user", "licensing"] },
                      is_actionable: { type: "boolean" },
                    },
                    required: ["category", "title", "summary", "details", "severity", "dashboard_target", "is_actionable"],
                    additionalProperties: false,
                  },
                },
              },
              required: ["insights"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "generate_insights" } },
      }),
    });

    if (!aiResponse.ok) {
      const status = aiResponse.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${status}`);
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    let insights: any[] = [];

    if (toolCall?.function?.arguments) {
      const parsed = JSON.parse(toolCall.function.arguments);
      insights = parsed.insights || [];
    }

    // Store insights in database
    if (insights.length > 0) {
      const { error: insertError } = await supabase.from("ai_insights").insert(
        insights.map((i: any) => ({
          category: i.category,
          title: i.title,
          summary: i.summary,
          details: i.details,
          severity: i.severity,
          dashboard_target: i.dashboard_target,
          is_actionable: i.is_actionable,
          generated_by: "platform-intelligence-agent",
        }))
      );
      if (insertError) console.error("Insert error:", insertError);
    }

    // Log audit event
    await supabase.from("audit_logs").insert({
      action: "ai_agent_run",
      resource_type: "ai_insights",
      details: { insights_generated: insights.length, stats },
    });

    return new Response(JSON.stringify({ success: true, insights, stats }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("AI Agent error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
