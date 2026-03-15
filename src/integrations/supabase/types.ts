export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      agencies: {
        Row: {
          active_recruiters: number
          created_at: string
          engagement_score: number
          id: string
          license_type: string
          name: string
          partner_since: string
          placements_count: number
          success_rate: number
        }
        Insert: {
          active_recruiters?: number
          created_at?: string
          engagement_score?: number
          id?: string
          license_type?: string
          name: string
          partner_since?: string
          placements_count?: number
          success_rate?: number
        }
        Update: {
          active_recruiters?: number
          created_at?: string
          engagement_score?: number
          id?: string
          license_type?: string
          name?: string
          partner_since?: string
          placements_count?: number
          success_rate?: number
        }
        Relationships: []
      }
      ai_insights: {
        Row: {
          category: string
          created_at: string
          dashboard_target: string
          details: string | null
          generated_by: string
          id: string
          is_actionable: boolean
          severity: string
          summary: string
          title: string
        }
        Insert: {
          category: string
          created_at?: string
          dashboard_target?: string
          details?: string | null
          generated_by?: string
          id?: string
          is_actionable?: boolean
          severity?: string
          summary: string
          title: string
        }
        Update: {
          category?: string
          created_at?: string
          dashboard_target?: string
          details?: string | null
          generated_by?: string
          id?: string
          is_actionable?: boolean
          severity?: string
          summary?: string
          title?: string
        }
        Relationships: []
      }
      applications: {
        Row: {
          applied_at: string
          candidate_id: string
          hired_at: string | null
          id: string
          job_id: string
          reviewed_at: string | null
          status: string
        }
        Insert: {
          applied_at?: string
          candidate_id: string
          hired_at?: string | null
          id?: string
          job_id: string
          reviewed_at?: string | null
          status?: string
        }
        Update: {
          applied_at?: string
          candidate_id?: string
          hired_at?: string | null
          id?: string
          job_id?: string
          reviewed_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          ip_address: string | null
          resource_id: string | null
          resource_type: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          resource_id?: string | null
          resource_type: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          resource_id?: string | null
          resource_type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      candidates: {
        Row: {
          created_at: string
          email: string
          engagement_score: number
          experience_years: number
          id: string
          industry: string
          name: string
          profile_completeness: number
          skills: string[]
          status: string
        }
        Insert: {
          created_at?: string
          email: string
          engagement_score?: number
          experience_years?: number
          id?: string
          industry: string
          name: string
          profile_completeness?: number
          skills?: string[]
          status?: string
        }
        Update: {
          created_at?: string
          email?: string
          engagement_score?: number
          experience_years?: number
          id?: string
          industry?: string
          name?: string
          profile_completeness?: number
          skills?: string[]
          status?: string
        }
        Relationships: []
      }
      demand_trends: {
        Row: {
          ai: number
          cloud: number
          created_at: string
          cyber: number
          health: number
          id: string
          month: string
        }
        Insert: {
          ai?: number
          cloud?: number
          created_at?: string
          cyber?: number
          health?: number
          id?: string
          month: string
        }
        Update: {
          ai?: number
          cloud?: number
          created_at?: string
          cyber?: number
          health?: number
          id?: string
          month?: string
        }
        Relationships: []
      }
      intelligence_observations: {
        Row: {
          category: string
          created_at: string
          id: string
          message: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          message: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          message?: string
        }
        Relationships: []
      }
      jobs: {
        Row: {
          applications_count: number
          company: string
          created_at: string
          id: string
          industry: string
          job_type: string
          location: string
          posted_by: string | null
          required_skills: string[]
          salary_range: string | null
          status: string
          title: string
        }
        Insert: {
          applications_count?: number
          company: string
          created_at?: string
          id?: string
          industry: string
          job_type?: string
          location: string
          posted_by?: string | null
          required_skills?: string[]
          salary_range?: string | null
          status?: string
          title: string
        }
        Update: {
          applications_count?: number
          company?: string
          created_at?: string
          id?: string
          industry?: string
          job_type?: string
          location?: string
          posted_by?: string | null
          required_skills?: string[]
          salary_range?: string | null
          status?: string
          title?: string
        }
        Relationships: []
      }
      metrics: {
        Row: {
          change: number
          created_at: string
          id: string
          is_ai_surfaced: boolean
          recorded_at: string
          spark_data: number[]
          title: string
          value: string
        }
        Insert: {
          change?: number
          created_at?: string
          id?: string
          is_ai_surfaced?: boolean
          recorded_at?: string
          spark_data?: number[]
          title: string
          value: string
        }
        Update: {
          change?: number
          created_at?: string
          id?: string
          is_ai_surfaced?: boolean
          recorded_at?: string
          spark_data?: number[]
          title?: string
          value?: string
        }
        Relationships: []
      }
      placement_stats: {
        Row: {
          avg_days: number
          created_at: string
          id: string
          industry: string
          placements: number
          quarter: string
          success_rate: number
          trend: number
        }
        Insert: {
          avg_days?: number
          created_at?: string
          id?: string
          industry: string
          placements?: number
          quarter: string
          success_rate?: number
          trend?: number
        }
        Update: {
          avg_days?: number
          created_at?: string
          id?: string
          industry?: string
          placements?: number
          quarter?: string
          success_rate?: number
          trend?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          role?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      recruiter_activity: {
        Row: {
          created_at: string
          id: string
          interviews: number
          name: string
          placements: number
          quarter: string
        }
        Insert: {
          created_at?: string
          id?: string
          interviews?: number
          name: string
          placements?: number
          quarter: string
        }
        Update: {
          created_at?: string
          id?: string
          interviews?: number
          name?: string
          placements?: number
          quarter?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
