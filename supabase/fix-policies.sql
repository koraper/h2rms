-- Fix RLS Policy Issues
-- Run this SQL to fix the infinite recursion problem

-- Drop problematic policies
DROP POLICY IF EXISTS "Managers can view department profiles" ON profiles;

-- Create safer policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Fix attendance policies
DROP POLICY IF EXISTS "Managers can view department attendance" ON attendance;

CREATE POLICY "Admins can view all attendance" ON attendance
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Fix leave request policies
DROP POLICY IF EXISTS "Managers can view and approve department leave requests" ON leave_requests;

CREATE POLICY "Admins can manage all leave requests" ON leave_requests
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );