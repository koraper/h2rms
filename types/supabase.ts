export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      attendance: {
        Row: {
          id: string
          employee_id: string
          check_in: string | null
          check_out: string | null
          date: string
          status: 'present' | 'absent' | 'late' | 'half_day'
          notes: string | null
          location_id: string | null
          ip_address: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          employee_id: string
          check_in?: string | null
          check_out?: string | null
          date: string
          status?: 'present' | 'absent' | 'late' | 'half_day'
          notes?: string | null
          location_id?: string | null
          ip_address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          employee_id?: string
          check_in?: string | null
          check_out?: string | null
          date?: string
          status?: 'present' | 'absent' | 'late' | 'half_day'
          notes?: string | null
          location_id?: string | null
          ip_address?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          table_name: string | null
          record_id: string | null
          old_values: Json | null
          new_values: Json | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          table_name?: string | null
          record_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          table_name?: string | null
          record_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
      departments: {
        Row: {
          id: string
          name: string
          description: string | null
          manager_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          manager_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          manager_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          title: string
          description: string | null
          file_path: string | null
          file_size: number | null
          mime_type: string | null
          uploaded_by: string | null
          access_level: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          file_path?: string | null
          file_size?: number | null
          mime_type?: string | null
          uploaded_by?: string | null
          access_level?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          file_path?: string | null
          file_size?: number | null
          mime_type?: string | null
          uploaded_by?: string | null
          access_level?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      leave_requests: {
        Row: {
          id: string
          employee_id: string
          leave_type: 'vacation' | 'sick' | 'personal' | 'maternity' | 'paternity' | 'emergency'
          start_date: string
          end_date: string
          days_requested: number
          reason: string | null
          status: 'pending' | 'approved' | 'rejected' | 'cancelled'
          approved_by: string | null
          approved_at: string | null
          rejection_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          employee_id: string
          leave_type: 'vacation' | 'sick' | 'personal' | 'maternity' | 'paternity' | 'emergency'
          start_date: string
          end_date: string
          days_requested: number
          reason?: string | null
          status?: 'pending' | 'approved' | 'rejected' | 'cancelled'
          approved_by?: string | null
          approved_at?: string | null
          rejection_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          employee_id?: string
          leave_type?: 'vacation' | 'sick' | 'personal' | 'maternity' | 'paternity' | 'emergency'
          start_date?: string
          end_date?: string
          days_requested?: number
          reason?: string | null
          status?: 'pending' | 'approved' | 'rejected' | 'cancelled'
          approved_by?: string | null
          approved_at?: string | null
          rejection_reason?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      locations: {
        Row: {
          id: string
          name: string
          address: string | null
          coordinates: unknown | null
          qr_code_data: string | null
          is_active: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          address?: string | null
          coordinates?: unknown | null
          qr_code_data?: string | null
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string | null
          coordinates?: unknown | null
          qr_code_data?: string | null
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          first_name: string | null
          last_name: string | null
          role: 'admin' | 'manager' | 'employee'
          department: string | null
          hire_date: string | null
          phone: string | null
          address: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          role?: 'admin' | 'manager' | 'employee'
          department?: string | null
          hire_date?: string | null
          phone?: string | null
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          role?: 'admin' | 'manager' | 'employee'
          department?: string | null
          hire_date?: string | null
          phone?: string | null
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      attendance_status: 'present' | 'absent' | 'late' | 'half_day'
      leave_status: 'pending' | 'approved' | 'rejected' | 'cancelled'
      leave_type: 'vacation' | 'sick' | 'personal' | 'maternity' | 'paternity' | 'emergency'
      user_role: 'admin' | 'manager' | 'employee'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}