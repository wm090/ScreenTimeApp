export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      app_config: {
        Row: {
          app_id: string;
          created_at: string;
          custom_messages: Json | null;
          id: number;
          notification_level: string;
          threshold_minutes: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          app_id: string;
          created_at?: string;
          custom_messages?: Json | null;
          id?: number;
          notification_level?: string;
          threshold_minutes?: number;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          app_id?: string;
          created_at?: string;
          custom_messages?: Json | null;
          id?: number;
          notification_level?: string;
          threshold_minutes?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "app_config_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      app_usage: {
        Row: {
          app_id: string;
          created_at: string;
          id: number;
          timestamp: string;
          usage_time: number;
          user_id: string;
        };
        Insert: {
          app_id: string;
          created_at?: string;
          id?: number;
          timestamp: string;
          usage_time: number;
          user_id: string;
        };
        Update: {
          app_id?: string;
          created_at?: string;
          id?: number;
          timestamp?: string;
          usage_time?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "app_usage_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      user_settings: {
        Row: {
          created_at: string;
          id: number;
          quiet_hours_enabled: boolean;
          quiet_hours_end: string;
          quiet_hours_start: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          quiet_hours_enabled?: boolean;
          quiet_hours_end?: string;
          quiet_hours_start?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          quiet_hours_enabled?: boolean;
          quiet_hours_end?: string;
          quiet_hours_start?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_settings_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      users: {
        Row: {
          created_at: string;
          id: string;
          nickname: string;
          password: string;
          email: string;
          email_confirmed: boolean;
          reset_token: string | null;
          reset_token_expires: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          nickname: string;
          password: string;
          email: string;
          email_confirmed?: boolean;
          reset_token?: string | null;
          reset_token_expires?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          nickname?: string;
          password?: string;
          email?: string;
          email_confirmed?: boolean;
          reset_token?: string | null;
          reset_token_expires?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
