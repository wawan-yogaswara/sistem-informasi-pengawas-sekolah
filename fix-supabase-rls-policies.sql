-- FIX SUPABASE RLS POLICIES
-- Jalankan di Supabase SQL Editor untuk memperbaiki masalah RLS
-- URL: https://supabase.com/dashboard/project/glhaliktsrcvnznbgxqt/sql

-- 1. Drop existing policies yang mungkin bermasalah
DROP POLICY IF EXISTS "Enable read access for all users" ON users;
DROP POLICY IF EXISTS "Enable insert access for all users" ON users;
DROP POLICY IF EXISTS "Enable update access for all users" ON users;
DROP POLICY IF EXISTS "Enable delete access for all users" ON users;

DROP POLICY IF EXISTS "Enable read access for all users" ON tasks;
DROP POLICY IF EXISTS "Enable insert access for all users" ON tasks;
DROP POLICY IF EXISTS "Enable update access for all users" ON tasks;
DROP POLICY IF EXISTS "Enable delete access for all users" ON tasks;

DROP POLICY IF EXISTS "Enable read access for all users" ON additional_tasks;
DROP POLICY IF EXISTS "Enable insert access for all users" ON additional_tasks;
DROP POLICY IF EXISTS "Enable update access for all users" ON additional_tasks;
DROP POLICY IF EXISTS "Enable delete access for all users" ON additional_tasks;

DROP POLICY IF EXISTS "Enable read access for all users" ON schools;
DROP POLICY IF EXISTS "Enable insert access for all users" ON schools;
DROP POLICY IF EXISTS "Enable update access for all users" ON schools;
DROP POLICY IF EXISTS "Enable delete access for all users" ON schools;

DROP POLICY IF EXISTS "Enable read access for all users" ON supervisions;
DROP POLICY IF EXISTS "Enable insert access for all users" ON supervisions;
DROP POLICY IF EXISTS "Enable update access for all users" ON supervisions;
DROP POLICY IF EXISTS "Enable delete access for all users" ON supervisions;

-- 2. Disable RLS sementara untuk testing
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE additional_tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE schools DISABLE ROW LEVEL SECURITY;
ALTER TABLE supervisions DISABLE ROW LEVEL SECURITY;

-- 3. Pastikan tabel memiliki kolom yang benar
-- Cek dan tambah kolom yang mungkin hilang

-- Untuk tabel tasks
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'Umum';
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS photo1 TEXT;

-- Untuk tabel additional_tasks  
ALTER TABLE additional_tasks ADD COLUMN IF NOT EXISTS name VARCHAR(200);
ALTER TABLE additional_tasks ADD COLUMN IF NOT EXISTS location VARCHAR(200);
ALTER TABLE additional_tasks ADD COLUMN IF NOT EXISTS organizer VARCHAR(200);
ALTER TABLE additional_tasks ADD COLUMN IF NOT EXISTS photo1 TEXT;

-- Update kolom title ke name untuk additional_tasks jika diperlukan
UPDATE additional_tasks SET name = title WHERE name IS NULL AND title IS NOT NULL;

-- Untuk tabel schools
ALTER TABLE schools ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id);
ALTER TABLE schools ADD COLUMN IF NOT EXISTS contact VARCHAR(50);
ALTER TABLE schools ADD COLUMN IF NOT EXISTS principal_name VARCHAR(100);

-- 4. Insert atau update sample users dengan password yang benar
INSERT INTO users (id, username, password, role, name, nip, position) VALUES
('08bf74ed-608d-41e2-941c-896b8a4c8e5a', 'admin', '$2b$10$K7L1OJ45/4Y2nIvL0DXbu.b7Q5Qr4WzO.BhHb9gYRt5h8K9L0DXbu', 'admin', 'Administrator', '123456789', 'Administrator Sistem'),
('4d803b6e-853b-4cfe-8fdf-0389f8d8efb3', 'wawan', '$2b$10$K7L1OJ45/4Y2nIvL0DXbu.b7Q5Qr4WzO.BhHb9gYRt5h8K9L0DXbu', 'user', 'Wawan Setiawan', '987654321', 'Pengawas Sekolah')
ON CONFLICT (username) DO UPDATE SET
  password = EXCLUDED.password,
  role = EXCLUDED.role,
  name = EXCLUDED.name,
  nip = EXCLUDED.nip,
  position = EXCLUDED.position;

-- 5. Buat RLS policies yang lebih permisif untuk development
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE additional_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE supervisions ENABLE ROW LEVEL SECURITY;

-- Policies untuk users
CREATE POLICY "users_select_policy" ON users FOR SELECT USING (true);
CREATE POLICY "users_insert_policy" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "users_update_policy" ON users FOR UPDATE USING (true);
CREATE POLICY "users_delete_policy" ON users FOR DELETE USING (true);

-- Policies untuk tasks
CREATE POLICY "tasks_select_policy" ON tasks FOR SELECT USING (true);
CREATE POLICY "tasks_insert_policy" ON tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "tasks_update_policy" ON tasks FOR UPDATE USING (true);
CREATE POLICY "tasks_delete_policy" ON tasks FOR DELETE USING (true);

-- Policies untuk additional_tasks
CREATE POLICY "additional_tasks_select_policy" ON additional_tasks FOR SELECT USING (true);
CREATE POLICY "additional_tasks_insert_policy" ON additional_tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "additional_tasks_update_policy" ON additional_tasks FOR UPDATE USING (true);
CREATE POLICY "additional_tasks_delete_policy" ON additional_tasks FOR DELETE USING (true);

-- Policies untuk schools
CREATE POLICY "schools_select_policy" ON schools FOR SELECT USING (true);
CREATE POLICY "schools_insert_policy" ON schools FOR INSERT WITH CHECK (true);
CREATE POLICY "schools_update_policy" ON schools FOR UPDATE USING (true);
CREATE POLICY "schools_delete_policy" ON schools FOR DELETE USING (true);

-- Policies untuk supervisions
CREATE POLICY "supervisions_select_policy" ON supervisions FOR SELECT USING (true);
CREATE POLICY "supervisions_insert_policy" ON supervisions FOR INSERT WITH CHECK (true);
CREATE POLICY "supervisions_update_policy" ON supervisions FOR UPDATE USING (true);
CREATE POLICY "supervisions_delete_policy" ON supervisions FOR DELETE USING (true);

-- 6. Grant permissions untuk anon dan authenticated roles
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- 7. Test insert untuk memastikan semuanya bekerja
INSERT INTO tasks (user_id, title, category, description, completed, date, photo1, created_at) VALUES
('4d803b6e-853b-4cfe-8fdf-0389f8d8efb3', 'Test Task After RLS Fix', 'Test', 'Test task untuk memastikan RLS fix berhasil', false, CURRENT_DATE, null, NOW())
ON CONFLICT DO NOTHING;

-- 8. Tampilkan hasil untuk verifikasi
SELECT 'Users count:' as info, COUNT(*) as count FROM users
UNION ALL
SELECT 'Tasks count:' as info, COUNT(*) as count FROM tasks
UNION ALL
SELECT 'Additional tasks count:' as info, COUNT(*) as count FROM additional_tasks
UNION ALL
SELECT 'Schools count:' as info, COUNT(*) as count FROM schools
UNION ALL
SELECT 'Supervisions count:' as info, COUNT(*) as count FROM supervisions;

-- 9. Tampilkan policies yang aktif
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;