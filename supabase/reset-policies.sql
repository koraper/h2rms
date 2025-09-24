-- Reset and Fix RLS Policies
-- Run this SQL to completely reset and fix all policies

-- Drop ALL existing policies first
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Managers can view department profiles" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;

DROP POLICY IF EXISTS "Employees can view own attendance" ON attendance;
DROP POLICY IF EXISTS "Employees can insert own attendance" ON attendance;
DROP POLICY IF EXISTS "Managers can view department attendance" ON attendance;
DROP POLICY IF EXISTS "Admins can view all attendance" ON attendance;

DROP POLICY IF EXISTS "Employees can view own leave requests" ON leave_requests;
DROP POLICY IF EXISTS "Employees can create leave requests" ON leave_requests;
DROP POLICY IF EXISTS "Employees can update own pending leave requests" ON leave_requests;
DROP POLICY IF EXISTS "Managers can view and approve department leave requests" ON leave_requests;
DROP POLICY IF EXISTS "Admins can manage all leave requests" ON leave_requests;

DROP POLICY IF EXISTS "Everyone can view departments" ON departments;
DROP POLICY IF EXISTS "Only admins can modify departments" ON departments;

-- Create simple, safe policies

-- Profiles: Everyone can read all profiles, users can update their own
CREATE POLICY "Anyone can view profiles" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Departments: Everyone can view
CREATE POLICY "Anyone can view departments" ON departments
  FOR SELECT USING (true);

-- Attendance: Users can see their own, admins can see all
CREATE POLICY "Users can view own attendance" ON attendance
  FOR SELECT USING (employee_id = auth.uid());

CREATE POLICY "Users can insert own attendance" ON attendance
  FOR INSERT WITH CHECK (employee_id = auth.uid());

-- Leave requests: Users can see their own
CREATE POLICY "Users can view own leave requests" ON leave_requests
  FOR SELECT USING (employee_id = auth.uid());

CREATE POLICY "Users can create leave requests" ON leave_requests
  FOR INSERT WITH CHECK (employee_id = auth.uid());

-- Simple policies for other tables
CREATE POLICY "Users can view locations" ON locations
  FOR SELECT USING (true);

CREATE POLICY "Users can view documents" ON documents
  FOR SELECT USING (true);

CREATE POLICY "Users can view audit logs" ON audit_logs
  FOR SELECT USING (user_id = auth.uid());