import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types (generated from schema)
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'admin' | 'caregiver' | 'accountant' | 'field_worker' | 'parent'
          avatar: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          role?: 'admin' | 'caregiver' | 'accountant' | 'field_worker' | 'parent'
          avatar?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'admin' | 'caregiver' | 'accountant' | 'field_worker' | 'parent'
          avatar?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      locations: {
        Row: {
          id: string
          name: string
          address: string
          latitude: number
          longitude: number
          radius: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          address: string
          latitude: number
          longitude: number
          radius?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string
          latitude?: number
          longitude?: number
          radius?: number
          created_at?: string
          updated_at?: string
        }
      }
      children: {
        Row: {
          id: string
          first_name: string
          last_name: string
          date_of_birth: string
          parent_id: string
          program: string
          status: 'active' | 'inactive'
          emergency_contact: string
          medical_info: string | null
          enrollment_date: string
          referral_id: string | null
          home_location_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          date_of_birth: string
          parent_id: string
          program: string
          status?: 'active' | 'inactive'
          emergency_contact: string
          medical_info?: string | null
          enrollment_date?: string
          referral_id?: string | null
          home_location_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          date_of_birth?: string
          parent_id?: string
          program?: string
          status?: 'active' | 'inactive'
          emergency_contact?: string
          medical_info?: string | null
          enrollment_date?: string
          referral_id?: string | null
          home_location_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      parents: {
        Row: {
          id: string
          user_id: string | null
          first_name: string
          last_name: string
          email: string
          phone: string
          address: string
          billing_status: 'current' | 'overdue' | 'paid'
          total_due: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          first_name: string
          last_name: string
          email: string
          phone: string
          address: string
          billing_status?: 'current' | 'overdue' | 'paid'
          total_due?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          first_name?: string
          last_name?: string
          email?: string
          phone?: string
          address?: string
          billing_status?: 'current' | 'overdue' | 'paid'
          total_due?: number
          created_at?: string
          updated_at?: string
        }
      }
      attendance_records: {
        Row: {
          id: string
          child_id: string
          date: string
          check_in: string | null
          check_out: string | null
          status: 'present' | 'absent' | 'late' | 'early_departure'
          caregiver_name: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          child_id: string
          date: string
          check_in?: string | null
          check_out?: string | null
          status: 'present' | 'absent' | 'late' | 'early_departure'
          caregiver_name: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          child_id?: string
          date?: string
          check_in?: string | null
          check_out?: string | null
          status?: 'present' | 'absent' | 'late' | 'early_departure'
          caregiver_name?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}