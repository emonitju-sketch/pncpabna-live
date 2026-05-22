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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activities: {
        Row: {
          activity_date: string | null
          category: string
          cover_image_path: string | null
          created_at: string
          created_by: string | null
          description_bn: string | null
          display_order: number
          external_url: string | null
          id: string
          is_featured: boolean
          is_published: boolean
          location: string | null
          title_bn: string
          updated_at: string
        }
        Insert: {
          activity_date?: string | null
          category?: string
          cover_image_path?: string | null
          created_at?: string
          created_by?: string | null
          description_bn?: string | null
          display_order?: number
          external_url?: string | null
          id?: string
          is_featured?: boolean
          is_published?: boolean
          location?: string | null
          title_bn: string
          updated_at?: string
        }
        Update: {
          activity_date?: string | null
          category?: string
          cover_image_path?: string | null
          created_at?: string
          created_by?: string | null
          description_bn?: string | null
          display_order?: number
          external_url?: string | null
          id?: string
          is_featured?: boolean
          is_published?: boolean
          location?: string | null
          title_bn?: string
          updated_at?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          new_data: Json | null
          old_data: Json | null
          record_id: string | null
          table_name: string
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name: string
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      constitution_amendments: {
        Row: {
          change_summary_bn: string
          created_at: string
          effective_date: string
          id: string
          version: string
        }
        Insert: {
          change_summary_bn: string
          created_at?: string
          effective_date?: string
          id?: string
          version: string
        }
        Update: {
          change_summary_bn?: string
          created_at?: string
          effective_date?: string
          id?: string
          version?: string
        }
        Relationships: []
      }
      content_drafts: {
        Row: {
          admin_status: string
          ai_body_bn: string | null
          ai_category: string | null
          ai_confidence: number | null
          ai_event_date: string | null
          ai_model: string | null
          ai_raw_response: Json | null
          ai_summary_bn: string | null
          ai_tags: string[] | null
          ai_title_bn: string | null
          created_at: string
          created_by: string | null
          final_body_bn: string | null
          final_category: string | null
          final_date: string | null
          final_title_bn: string | null
          id: string
          image_path: string | null
          original_caption: string
          published_record_id: string | null
          published_record_table: string | null
          updated_at: string
        }
        Insert: {
          admin_status?: string
          ai_body_bn?: string | null
          ai_category?: string | null
          ai_confidence?: number | null
          ai_event_date?: string | null
          ai_model?: string | null
          ai_raw_response?: Json | null
          ai_summary_bn?: string | null
          ai_tags?: string[] | null
          ai_title_bn?: string | null
          created_at?: string
          created_by?: string | null
          final_body_bn?: string | null
          final_category?: string | null
          final_date?: string | null
          final_title_bn?: string | null
          id?: string
          image_path?: string | null
          original_caption: string
          published_record_id?: string | null
          published_record_table?: string | null
          updated_at?: string
        }
        Update: {
          admin_status?: string
          ai_body_bn?: string | null
          ai_category?: string | null
          ai_confidence?: number | null
          ai_event_date?: string | null
          ai_model?: string | null
          ai_raw_response?: Json | null
          ai_summary_bn?: string | null
          ai_tags?: string[] | null
          ai_title_bn?: string | null
          created_at?: string
          created_by?: string | null
          final_body_bn?: string | null
          final_category?: string | null
          final_date?: string | null
          final_title_bn?: string | null
          id?: string
          image_path?: string | null
          original_caption?: string
          published_record_id?: string | null
          published_record_table?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      event_registrations: {
        Row: {
          created_at: string
          email: string | null
          event_id: string
          full_name: string
          id: string
          last_notified_status: string | null
          notes: string | null
          phone: string
          status: string
          status_note: string | null
          status_updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          event_id: string
          full_name: string
          id?: string
          last_notified_status?: string | null
          notes?: string | null
          phone: string
          status?: string
          status_note?: string | null
          status_updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          event_id?: string
          full_name?: string
          id?: string
          last_notified_status?: string | null
          notes?: string | null
          phone?: string
          status?: string
          status_note?: string | null
          status_updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          cover_image_path: string | null
          created_at: string
          created_by: string | null
          description: string | null
          event_date: string
          id: string
          location: string
          registration_open: boolean
          title: string
          updated_at: string
        }
        Insert: {
          cover_image_path?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          event_date: string
          id?: string
          location: string
          registration_open?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          cover_image_path?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          event_date?: string
          id?: string
          location?: string
          registration_open?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      gallery_images: {
        Row: {
          caption_bn: string | null
          category: string
          created_at: string
          created_by: string | null
          display_order: number
          event_date: string | null
          id: string
          image_path: string
          is_featured: boolean
          title: string
        }
        Insert: {
          caption_bn?: string | null
          category: string
          created_at?: string
          created_by?: string | null
          display_order?: number
          event_date?: string | null
          id?: string
          image_path: string
          is_featured?: boolean
          title: string
        }
        Update: {
          caption_bn?: string | null
          category?: string
          created_at?: string
          created_by?: string | null
          display_order?: number
          event_date?: string | null
          id?: string
          image_path?: string
          is_featured?: boolean
          title?: string
        }
        Relationships: []
      }
      issue_upvotes: {
        Row: {
          created_at: string
          id: string
          registration_id: string
          voter_email: string
        }
        Insert: {
          created_at?: string
          id?: string
          registration_id: string
          voter_email: string
        }
        Update: {
          created_at?: string
          id?: string
          registration_id?: string
          voter_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "issue_upvotes_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: false
            referencedRelation: "event_registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      news: {
        Row: {
          body_bn: string | null
          category: string
          cover_image_path: string | null
          created_at: string
          created_by: string | null
          id: string
          is_published: boolean
          published_at: string
          source_url: string | null
          summary_bn: string | null
          title_bn: string
          updated_at: string
        }
        Insert: {
          body_bn?: string | null
          category?: string
          cover_image_path?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          is_published?: boolean
          published_at?: string
          source_url?: string | null
          summary_bn?: string | null
          title_bn: string
          updated_at?: string
        }
        Update: {
          body_bn?: string | null
          category?: string
          cover_image_path?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          is_published?: boolean
          published_at?: string
          source_url?: string | null
          summary_bn?: string | null
          title_bn?: string
          updated_at?: string
        }
        Relationships: []
      }
      notices: {
        Row: {
          body_bn: string | null
          created_at: string
          created_by: string | null
          expires_at: string | null
          id: string
          is_active: boolean
          priority: number
          starts_at: string
          title_bn: string
          updated_at: string
        }
        Insert: {
          body_bn?: string | null
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          priority?: number
          starts_at?: string
          title_bn: string
          updated_at?: string
        }
        Update: {
          body_bn?: string | null
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          priority?: number
          starts_at?: string
          title_bn?: string
          updated_at?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          file_path: string
          id: string
          published_at: string
          title: string
          year: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          file_path: string
          id?: string
          published_at?: string
          title: string
          year: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          file_path?: string
          id?: string
          published_at?: string
          title?: string
          year?: number
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          hero_image_path: string | null
          hero_object_position: string
          id: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          hero_image_path?: string | null
          hero_object_position?: string
          id: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          hero_image_path?: string | null
          hero_object_position?: string
          id?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      issue_upvote_counts: {
        Row: {
          registration_id: string | null
          upvote_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "issue_upvotes_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: false
            referencedRelation: "event_registrations"
            referencedColumns: ["id"]
          },
        ]
      }
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
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
