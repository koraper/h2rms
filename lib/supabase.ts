import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Admin client with service role key (server-side only)
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Helper functions
export const getCurrentUser = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  return { user: session?.user, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signUpWithEmail = async (
  email: string,
  password: string,
  metadata?: {
    first_name?: string;
    last_name?: string;
    department?: string;
  }
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });
  return { data, error };
};

export const resetPassword = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });
  return { data, error };
};

// Database helper functions
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  return { data, error };
};

export const updateUserProfile = async (userId: string, updates: any) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  return { data, error };
};

export const getDepartments = async () => {
  const { data, error } = await supabase
    .from('departments')
    .select('*')
    .order('name');

  return { data, error };
};

export const getAttendanceRecords = async (
  employeeId: string,
  startDate?: string,
  endDate?: string
) => {
  let query = supabase
    .from('attendance')
    .select('*')
    .eq('employee_id', employeeId)
    .order('date', { ascending: false });

  if (startDate) {
    query = query.gte('date', startDate);
  }
  if (endDate) {
    query = query.lte('date', endDate);
  }

  const { data, error } = await query;
  return { data, error };
};

export const createAttendanceRecord = async (attendanceData: {
  employee_id: string;
  check_in?: string;
  check_out?: string;
  date: string;
  status: string;
  notes?: string;
}) => {
  const { data, error } = await supabase
    .from('attendance')
    .insert(attendanceData)
    .select()
    .single();

  return { data, error };
};

export const getLeaveRequests = async (employeeId?: string) => {
  let query = supabase
    .from('leave_requests')
    .select(`
      *,
      employee:profiles!employee_id(first_name, last_name, department),
      approver:profiles!approved_by(first_name, last_name)
    `)
    .order('created_at', { ascending: false });

  if (employeeId) {
    query = query.eq('employee_id', employeeId);
  }

  const { data, error } = await query;
  return { data, error };
};

export const createLeaveRequest = async (leaveData: {
  employee_id: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  days_requested: number;
  reason?: string;
}) => {
  const { data, error } = await supabase
    .from('leave_requests')
    .insert(leaveData)
    .select()
    .single();

  return { data, error };
};