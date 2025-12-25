-- EMERGENCY: DISABLE RLS UNTUK TESTING
-- Jalankan di Supabase SQL Editor jika input masih tidak masuk

-- DISABLE RLS untuk semua tabel
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE supervisions DISABLE ROW LEVEL SECURITY;
ALTER TABLE additional_tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE schools DISABLE ROW LEVEL SECURITY;

-- Hapus semua policies yang mungkin bermasalah
DROP POLICY IF EXISTS "Users can view their own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can insert their own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can update their own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can delete their own tasks" ON tasks;

DROP POLICY IF EXISTS "Users can view their own supervisions" ON supervisions;
DROP POLICY IF EXISTS "Users can insert their own supervisions" ON supervisions;
DROP POLICY IF EXISTS "Users can update their own supervisions" ON supervisions;
DROP POLICY IF EXISTS "Users can delete their own supervisions" ON supervisions;

DROP POLICY IF EXISTS "Users can view their own additional_tasks" ON additional_tasks;
DROP POLICY IF EXISTS "Users can insert their own additional_tasks" ON additional_tasks;
DROP POLICY IF EXISTS "Users can update their own additional_tasks" ON additional_tasks;
DROP POLICY IF EXISTS "Users can delete their own additional_tasks" ON additional_tasks;

DROP POLICY IF EXISTS "Anyone can view schools" ON schools;

-- Pesan konfirmasi
SELECT 'RLS DISABLED - Input seharusnya bisa masuk sekarang' as status;