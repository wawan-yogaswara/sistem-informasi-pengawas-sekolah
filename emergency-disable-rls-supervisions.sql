-- EMERGENCY: DISABLE RLS UNTUK SUPERVISIONS
-- Jalankan jika masih ada masalah akses data

-- Disable RLS sementara untuk troubleshooting
ALTER TABLE supervisions DISABLE ROW LEVEL SECURITY;

-- Atau update policy untuk allow all
DROP POLICY IF EXISTS "Allow all operations on supervisions" ON supervisions;
CREATE POLICY "Allow all operations on supervisions" ON supervisions FOR ALL USING (true);

-- Re-enable RLS dengan policy yang permissive
ALTER TABLE supervisions ENABLE ROW LEVEL SECURITY;

-- Test query
SELECT COUNT(*) as total_supervisions FROM supervisions;
SELECT * FROM supervisions ORDER BY created_at DESC LIMIT 3;