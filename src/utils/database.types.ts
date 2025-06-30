export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      roles: {
        Row: {
          id: number
          role: string
        }
        Insert: {
          id?: number
          role: string
        }
        Update: {
          id?: number
          role?: string
        }
        Relationships: []
      }
      user_add_info: {
        Row: {
          employment_type: Database["public"]["Enums"]["employment_type"]
          job_title: string
          support_docs: string
          uuid: string
          work_address: string
        }
        Insert: {
          employment_type: Database["public"]["Enums"]["employment_type"]
          job_title: string
          support_docs: string
          uuid?: string
          work_address: string
        }
        Update: {
          employment_type?: Database["public"]["Enums"]["employment_type"]
          job_title?: string
          support_docs?: string
          uuid?: string
          work_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_add_info_uuid_fkey"
            columns: ["uuid"]
            isOneToOne: true
            referencedRelation: "admins"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_add_info_uuid_fkey"
            columns: ["uuid"]
            isOneToOne: true
            referencedRelation: "user_with_roles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_add_info_uuid_fkey"
            columns: ["uuid"]
            isOneToOne: true
            referencedRelation: "users_complete_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_info: {
        Row: {
          address: string
          birthdate: string
          gender: Database["public"]["Enums"]["gender"]
          name: string
          updated_by: string | null
          uuid: string
        }
        Insert: {
          address?: string
          birthdate: string
          gender: Database["public"]["Enums"]["gender"]
          name?: string
          updated_by?: string | null
          uuid?: string
        }
        Update: {
          address?: string
          birthdate?: string
          gender?: Database["public"]["Enums"]["gender"]
          name?: string
          updated_by?: string | null
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_info_uuid_fkey"
            columns: ["uuid"]
            isOneToOne: true
            referencedRelation: "admins"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_info_uuid_fkey"
            columns: ["uuid"]
            isOneToOne: true
            referencedRelation: "user_with_roles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_info_uuid_fkey"
            columns: ["uuid"]
            isOneToOne: true
            referencedRelation: "users_complete_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_roles: {
        Row: {
          role_id: number
          user_id: string
        }
        Insert: {
          role_id: number
          user_id: string
        }
        Update: {
          role_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "admins"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user_with_roles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users_complete_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      admins: {
        Row: {
          created_at: string | null
          email: string | null
          role: string | null
          user_id: string | null
        }
        Relationships: []
      }
      user_with_roles: {
        Row: {
          created_at: string | null
          email: string | null
          is_deleted: boolean | null
          role: string | null
          user_id: string | null
        }
        Relationships: []
      }
      users_complete_profiles: {
        Row: {
          address: string | null
          birthdate: string | null
          created_at: string | null
          email: string | null
          gender: Database["public"]["Enums"]["gender"] | null
          is_deleted: boolean | null
          name: string | null
          role: string | null
          updated_by: string | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      employment_type: "FULL_TIME" | "PART_TIME" | "SELF_EMPLOYED"
      gender: "MALE" | "FEMALE"
      loan_type: "PERSONAL" | "HOME" | "BUSINESS"
      Yn: "Y" | "N"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      employment_type: ["FULL_TIME", "PART_TIME", "SELF_EMPLOYED"],
      gender: ["MALE", "FEMALE"],
      loan_type: ["PERSONAL", "HOME", "BUSINESS"],
      Yn: ["Y", "N"],
    },
  },
} as const
