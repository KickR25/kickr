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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      admin_chat_messages: {
        Row: {
          admin_id: string
          content: string
          created_at: string | null
          id: string
          image_url: string | null
        }
        Insert: {
          admin_id: string
          content: string
          created_at?: string | null
          id?: string
          image_url?: string | null
        }
        Update: {
          admin_id?: string
          content?: string
          created_at?: string | null
          id?: string
          image_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_chat_messages_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          action_type: Database["public"]["Enums"]["action_type"]
          actor_admin_id: string
          details: Json | null
          id: string
          target_user_id: string | null
          timestamp: string | null
        }
        Insert: {
          action_type: Database["public"]["Enums"]["action_type"]
          actor_admin_id: string
          details?: Json | null
          id?: string
          target_user_id?: string | null
          timestamp?: string | null
        }
        Update: {
          action_type?: Database["public"]["Enums"]["action_type"]
          actor_admin_id?: string
          details?: Json | null
          id?: string
          target_user_id?: string | null
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_actor_admin_id_fkey"
            columns: ["actor_admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_log_target_user_id_fkey"
            columns: ["target_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      friendships: {
        Row: {
          created_at: string | null
          friend_id: string
          id: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          friend_id: string
          id?: string
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          friend_id?: string
          id?: string
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "friendships_friend_id_fkey"
            columns: ["friend_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friendships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_read: boolean | null
          receiver_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          receiver_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          receiver_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_read: boolean | null
          related_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          related_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          related_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      post_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          post_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          post_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          post_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      post_likes: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      post_shares: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_shares_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_shares_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          content: string
          created_at: string | null
          id: string
          images: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          images?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          images?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          admin_level: Database["public"]["Enums"]["admin_level"] | null
          avatar: string | null
          bio: string | null
          cover_image: string | null
          created_at: string | null
          email: string | null
          id: string
          location: string | null
          name: string
          role: string
          updated_at: string | null
        }
        Insert: {
          admin_level?: Database["public"]["Enums"]["admin_level"] | null
          avatar?: string | null
          bio?: string | null
          cover_image?: string | null
          created_at?: string | null
          email?: string | null
          id: string
          location?: string | null
          name: string
          role?: string
          updated_at?: string | null
        }
        Update: {
          admin_level?: Database["public"]["Enums"]["admin_level"] | null
          avatar?: string | null
          bio?: string | null
          cover_image?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          location?: string | null
          name?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      sanctions: {
        Row: {
          created_at: string | null
          created_by_admin: string
          ends_at: string | null
          id: string
          is_permanent: boolean | null
          reason: string
          revoked_at: string | null
          revoked_by_admin: string | null
          status: Database["public"]["Enums"]["sanction_status"] | null
          type: Database["public"]["Enums"]["sanction_type"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          created_by_admin: string
          ends_at?: string | null
          id?: string
          is_permanent?: boolean | null
          reason: string
          revoked_at?: string | null
          revoked_by_admin?: string | null
          status?: Database["public"]["Enums"]["sanction_status"] | null
          type: Database["public"]["Enums"]["sanction_type"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          created_by_admin?: string
          ends_at?: string | null
          id?: string
          is_permanent?: boolean | null
          reason?: string
          revoked_at?: string | null
          revoked_by_admin?: string | null
          status?: Database["public"]["Enums"]["sanction_status"] | null
          type?: Database["public"]["Enums"]["sanction_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sanctions_created_by_admin_fkey"
            columns: ["created_by_admin"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sanctions_revoked_by_admin_fkey"
            columns: ["revoked_by_admin"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sanctions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sponsorship_deals: {
        Row: {
          club_id: string
          commission_amount: number | null
          commission_rate: number | null
          completed_at: string | null
          created_at: string | null
          id: string
          package_id: string
          sponsor_id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          club_id: string
          commission_amount?: number | null
          commission_rate?: number | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          package_id: string
          sponsor_id: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          club_id?: string
          commission_amount?: number | null
          commission_rate?: number | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          package_id?: string
          sponsor_id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sponsorship_deals_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sponsorship_deals_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "sponsorship_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sponsorship_deals_sponsor_id_fkey"
            columns: ["sponsor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sponsorship_packages: {
        Row: {
          benefits: string
          created_at: string | null
          duration: number
          id: string
          images: string[] | null
          is_available: boolean | null
          package_name: string
          price: number
          region: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          benefits: string
          created_at?: string | null
          duration: number
          id?: string
          images?: string[] | null
          is_available?: boolean | null
          package_name: string
          price: number
          region: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          benefits?: string
          created_at?: string | null
          duration?: number
          id?: string
          images?: string[] | null
          is_available?: boolean | null
          package_name?: string
          price?: number
          region?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sponsorship_packages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      training_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          training_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          training_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          training_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "training_comments_training_id_fkey"
            columns: ["training_id"]
            isOneToOne: false
            referencedRelation: "trainings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      training_likes: {
        Row: {
          created_at: string | null
          id: string
          training_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          training_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          training_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "training_likes_training_id_fkey"
            columns: ["training_id"]
            isOneToOne: false
            referencedRelation: "trainings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      training_saves: {
        Row: {
          created_at: string | null
          id: string
          training_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          training_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          training_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "training_saves_training_id_fkey"
            columns: ["training_id"]
            isOneToOne: false
            referencedRelation: "trainings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_saves_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      trainings: {
        Row: {
          created_at: string | null
          description: string
          duration: number
          gender: string | null
          goal: string
          id: string
          images: string[] | null
          materials: string | null
          player_count: string
          team_category: string
          title: string
          updated_at: string | null
          user_id: string
          videos: string[] | null
        }
        Insert: {
          created_at?: string | null
          description: string
          duration: number
          gender?: string | null
          goal: string
          id?: string
          images?: string[] | null
          materials?: string | null
          player_count: string
          team_category: string
          title: string
          updated_at?: string | null
          user_id: string
          videos?: string[] | null
        }
        Update: {
          created_at?: string | null
          description?: string
          duration?: number
          gender?: string | null
          goal?: string
          id?: string
          images?: string[] | null
          materials?: string | null
          player_count?: string
          team_category?: string
          title?: string
          updated_at?: string | null
          user_id?: string
          videos?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trainings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      expire_sanctions: { Args: never; Returns: undefined }
      get_active_sanctions: {
        Args: { p_user_id: string }
        Returns: {
          created_by_admin_name: string
          ends_at: string
          id: string
          is_permanent: boolean
          reason: string
          type: Database["public"]["Enums"]["sanction_type"]
        }[]
      }
      get_feed_posts: {
        Args: { p_limit?: number; p_offset?: number }
        Returns: {
          comments_count: number
          content: string
          created_at: string
          id: string
          images: string[]
          is_liked_by_user: boolean
          likes_count: number
          shares_count: number
          user_avatar: string
          user_id: string
          user_name: string
        }[]
      }
      get_friend_requests: {
        Args: { p_user_id: string }
        Returns: {
          created_at: string
          id: string
          user_avatar: string
          user_id: string
          user_name: string
          user_role: string
        }[]
      }
      get_friends: {
        Args: { p_user_id: string }
        Returns: {
          avatar: string
          id: string
          location: string
          name: string
          role: string
        }[]
      }
      get_post_comments: {
        Args: { p_post_id: string }
        Returns: {
          content: string
          created_at: string
          id: string
          user_avatar: string
          user_id: string
          user_name: string
        }[]
      }
      get_sponsorship_packages: {
        Args: { p_limit?: number; p_offset?: number }
        Returns: {
          benefits: string
          created_at: string
          duration: number
          id: string
          images: string[]
          is_available: boolean
          package_name: string
          price: number
          region: string
          user_avatar: string
          user_id: string
          user_name: string
        }[]
      }
      get_training_comments: {
        Args: { p_training_id: string }
        Returns: {
          content: string
          created_at: string
          id: string
          user_avatar: string
          user_id: string
          user_name: string
        }[]
      }
      get_trainings: {
        Args: { p_limit?: number; p_offset?: number }
        Returns: {
          comments_count: number
          created_at: string
          description: string
          duration: number
          gender: string
          goal: string
          id: string
          images: string[]
          is_liked_by_user: boolean
          is_saved_by_user: boolean
          likes_count: number
          materials: string
          player_count: string
          saves_count: number
          team_category: string
          title: string
          user_avatar: string
          user_id: string
          user_name: string
          videos: string[]
        }[]
      }
      get_unread_messages_count: {
        Args: { p_user_id: string }
        Returns: number
      }
      get_unread_notifications_count: {
        Args: { p_user_id: string }
        Returns: number
      }
      get_user_deals: {
        Args: { p_user_id: string }
        Returns: {
          club_id: string
          club_name: string
          commission_amount: number
          commission_rate: number
          created_at: string
          id: string
          package_id: string
          package_name: string
          sponsor_id: string
          sponsor_name: string
          status: string
        }[]
      }
      promote_user_to_admin_4: {
        Args: { user_email: string }
        Returns: undefined
      }
    }
    Enums: {
      action_type:
        | "sanction_created"
        | "sanction_revoked"
        | "admin_promoted"
        | "admin_demoted"
        | "admin_removed"
      admin_level: "ADMIN_1" | "ADMIN_2" | "ADMIN_3" | "ADMIN_4"
      sanction_status: "ACTIVE" | "REVOKED" | "EXPIRED"
      sanction_type: "MESSAGE_BAN" | "COMMENT_BAN" | "FULL_BAN"
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
      action_type: [
        "sanction_created",
        "sanction_revoked",
        "admin_promoted",
        "admin_demoted",
        "admin_removed",
      ],
      admin_level: ["ADMIN_1", "ADMIN_2", "ADMIN_3", "ADMIN_4"],
      sanction_status: ["ACTIVE", "REVOKED", "EXPIRED"],
      sanction_type: ["MESSAGE_BAN", "COMMENT_BAN", "FULL_BAN"],
    },
  },
} as const
