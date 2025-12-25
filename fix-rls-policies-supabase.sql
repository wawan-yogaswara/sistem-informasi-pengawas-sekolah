-- FIX RLS POLICIES UNTUK SEMUA TABEL
-- Jalankan di Supabase SQL Editor

-- 1. TASKS TABLE
-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view their own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can insert their own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can update their own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can delete their own tasks" ON tasks;

-- Enable RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create new policies for tasks
CREATE POLICY "Users can view their own tasks" ON tasks
  FOR SELECT USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can insert their own tasks" ON tasks
  FOR INSERT WITH CHECK (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can update their own tasks" ON tasks
  FOR UPDATE USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can delete their own tasks" ON tasks
  FOR DELETE USING (user_id = current_setting('app.current_user_id', true));

-- 2. SUPERVISIONS TABLE
-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view their own supervisions" ON supervisions;
DROP POLICY IF EXISTS "Users can insert their own supervisions" ON supervisions;
DROP POLICY IF EXISTS "Users can update their own supervisions" ON supervisions;
DROP POLICY IF EXISTS "Users can delete their own supervisions" ON supervisions;

-- Enable RLS
ALTER TABLE supervisions ENABLE ROW LEVEL SECURITY;

-- Create new policies for supervisions
CREATE POLICY "Users can view their own supervisions" ON supervisions
  FOR SELECT USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can insert their own supervisions" ON supervisions
  FOR INSERT WITH CHECK (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can update their own supervisions" ON supervisions
  FOR UPDATE USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can delete their own supervisions" ON supervisions
  FOR DELETE USING (user_id = current_setting('app.current_user_id', true));

-- 3. ADDITIONAL_TASKS TABLE
-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view their own additional_tasks" ON additional_tasks;
DROP POLICY IF EXISTS "Users can insert their own additional_tasks" ON additional_tasks;
DROP POLICY IF EXISTS "Users can update their own additional_tasks" ON additional_tasks;
DROP POLICY IF EXISTS "Users can delete their own additional_tasks" ON additional_tasks;

-- Enable RLS
ALTER TABLE additional_tasks ENABLE ROW LEVEL SECURITY;

-- Create new policies for additional_tasks
CREATE POLICY "Users can view their own additional_tasks" ON additional_tasks
  FOR SELECT USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can insert their own additional_tasks" ON additional_tasks
  FOR INSERT WITH CHECK (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can update their own additional_tasks" ON additional_tasks
  FOR UPDATE USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can delete their own additional_tasks" ON additional_tasks
  FOR DELETE USING (user_id = current_setting('app.current_user_id', true));

-- 4. SCHOOLS TABLE (Read-only for all users)
-- Drop existing policies if any
DROP POLICY IF EXISTS "Anyone can view schools" ON schools;

-- Enable RLS
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;

-- Create read-only policy for schools
CREATE POLICY "Anyone can view schools" ON schools
  FOR SELECT USING (true);

-- 5. ALTERNATIVE: DISABLE RLS COMPLETELY (if policies are causing issues)
-- Uncomment these lines if you want to disable RLS temporarily for testing

-- ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE supervisions DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE additional_tasks DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE schools DISABLE ROW LEVEL SECURITY;

-- Check current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename IN ('tasks', 'supervisions', 'additional_tasks', 'schools')
ORDER BY tablename, policyname;