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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      animes: {
        Row: {
          age_rating: string
          alternative_titles: string | null
          banner_url: string | null
          created_at: string
          featured_order: number
          genres: string[]
          id: string
          is_featured: boolean
          is_published: boolean
          poster_url: string | null
          release_year: number | null
          slug: string
          status: Database["public"]["Enums"]["anime_status"]
          studio: string | null
          synopsis: string | null
          title: string
          tmdb_id: number | null
          updated_at: string
          view_count: number
        }
        Insert: {
          age_rating?: string
          alternative_titles?: string | null
          banner_url?: string | null
          created_at?: string
          featured_order?: number
          genres?: string[]
          id?: string
          is_featured?: boolean
          is_published?: boolean
          poster_url?: string | null
          release_year?: number | null
          slug: string
          status?: Database["public"]["Enums"]["anime_status"]
          studio?: string | null
          synopsis?: string | null
          title: string
          tmdb_id?: number | null
          updated_at?: string
          view_count?: number
        }
        Update: {
          age_rating?: string
          alternative_titles?: string | null
          banner_url?: string | null
          created_at?: string
          featured_order?: number
          genres?: string[]
          id?: string
          is_featured?: boolean
          is_published?: boolean
          poster_url?: string | null
          release_year?: number | null
          slug?: string
          status?: Database["public"]["Enums"]["anime_status"]
          studio?: string | null
          synopsis?: string | null
          title?: string
          tmdb_id?: number | null
          updated_at?: string
          view_count?: number
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          administrator_id: string | null
          created_at: string
          id: string
          metadata: Json | null
          reason: string | null
          target_id: string | null
          target_type: string | null
          target_user_id: string | null
        }
        Insert: {
          action: string
          administrator_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          reason?: string | null
          target_id?: string | null
          target_type?: string | null
          target_user_id?: string | null
        }
        Update: {
          action?: string
          administrator_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          reason?: string | null
          target_id?: string | null
          target_type?: string | null
          target_user_id?: string | null
        }
        Relationships: []
      }
      episodes: {
        Row: {
          anime_id: string
          created_at: string
          description: string | null
          episode_number: number
          id: string
          is_published: boolean
          is_special: boolean
          player_url: string
          published_at: string | null
          release_date: string | null
          season_id: string
          thumbnail_url: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          anime_id: string
          created_at?: string
          description?: string | null
          episode_number: number
          id?: string
          is_published?: boolean
          is_special?: boolean
          player_url: string
          published_at?: string | null
          release_date?: string | null
          season_id: string
          thumbnail_url?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          anime_id?: string
          created_at?: string
          description?: string | null
          episode_number?: number
          id?: string
          is_published?: boolean
          is_special?: boolean
          player_url?: string
          published_at?: string | null
          release_date?: string | null
          season_id?: string
          thumbnail_url?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "episodes_anime_id_fkey"
            columns: ["anime_id"]
            isOneToOne: false
            referencedRelation: "animes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "episodes_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          anime_id: string
          created_at: string
          user_id: string
        }
        Insert: {
          anime_id: string
          created_at?: string
          user_id: string
        }
        Update: {
          anime_id?: string
          created_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_anime_id_fkey"
            columns: ["anime_id"]
            isOneToOne: false
            referencedRelation: "animes"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          banner_url: string | null
          bio: string | null
          created_at: string
          display_name: string
          id: string
          is_verified: boolean
          is_vip: boolean
          show_favorites: boolean
          show_history: boolean
          updated_at: string
          username: string
          vip_expires_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          created_at?: string
          display_name: string
          id: string
          is_verified?: boolean
          is_vip?: boolean
          show_favorites?: boolean
          show_history?: boolean
          updated_at?: string
          username: string
          vip_expires_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string
          id?: string
          is_verified?: boolean
          is_vip?: boolean
          show_favorites?: boolean
          show_history?: boolean
          updated_at?: string
          username?: string
          vip_expires_at?: string | null
        }
        Relationships: []
      }
      seasons: {
        Row: {
          anime_id: string
          created_at: string
          id: string
          is_published: boolean
          season_number: number
          synopsis: string | null
          title: string | null
        }
        Insert: {
          anime_id: string
          created_at?: string
          id?: string
          is_published?: boolean
          season_number: number
          synopsis?: string | null
          title?: string | null
        }
        Update: {
          anime_id?: string
          created_at?: string
          id?: string
          is_published?: boolean
          season_number?: number
          synopsis?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seasons_anime_id_fkey"
            columns: ["anime_id"]
            isOneToOne: false
            referencedRelation: "animes"
            referencedColumns: ["id"]
          },
        ]
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
      watch_history: {
        Row: {
          anime_id: string
          episode_id: string
          last_watched_at: string
          user_id: string
          watched: boolean
        }
        Insert: {
          anime_id: string
          episode_id: string
          last_watched_at?: string
          user_id: string
          watched?: boolean
        }
        Update: {
          anime_id?: string
          episode_id?: string
          last_watched_at?: string
          user_id?: string
          watched?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "watch_history_anime_id_fkey"
            columns: ["anime_id"]
            isOneToOne: false
            referencedRelation: "animes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "watch_history_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "episodes"
            referencedColumns: ["id"]
          },
        ]
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
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      register_anime_view: { Args: { _anime_id: string }; Returns: undefined }
    }
    Enums: {
      anime_status: "em_lancamento" | "finalizado" | "em_breve" | "pausado"
      app_role: "superadmin" | "admin" | "moderator" | "user"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      anime_status: ["em_lancamento", "finalizado", "em_breve", "pausado"],
      app_role: ["superadmin", "admin", "moderator", "user"],
    },
  },
} as const
