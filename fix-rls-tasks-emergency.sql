-- PERBAIKAN DARURAT: Tabel Tasks RLS - DIPERBARUI
-- Jalankan SQL ini di Supabase SQL Editor jika data tugas harian tidak muncul
-- Solusi untuk error "TypeError: Failed to fetch"

-- ============================================================
-- 1. CEK STATUS RLS DAN TABEL
-- ============================================================
-- Cek apakah RLS aktif di tabel tasks
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'tasks';

-- Cek apakah tabel tasks ada
SELECT table_name, table_schema 
FROM information_schema.tables 
WHERE table_name = 'tasks';

-- ============================================================
-- 2. CEK KEBIJAKAN (POLICIES) YANG ADA
-- ============================================================
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'tasks';

-- ============================================================
-- 3. PERBAIKAN DARURAT - MATIKAN RLS SEMENTARA
-- ============================================================
-- Langkah 1: Matikan RLS untuk debugging
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;

-- Langkah 2: Hapus semua kebijakan yang ada
DROP POLICY IF EXISTS "Allow all operations on tasks" ON tasks;
DROP POLICY IF EXISTS "Users can view own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can insert own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can update own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can delete own tasks" ON tasks;
DROP POLICY IF EXISTS "tasks_policy" ON tasks;
DROP POLICY IF EXISTS "emergency_allow_all_tasks" ON tasks;

-- Langkah 3: Buat kebijakan baru yang sangat permisif
CREATE POLICY "darurat_izinkan_semua_tasks" ON tasks FOR ALL USING (true) WITH CHECK (true);

-- Langkah 4: Aktifkan RLS kembali
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 5. CEK DATA TASKS SETELAH PERBAIKAN
-- ============================================================
-- Lihat semua data tasks
SELECT id, user_id, title, date, created_at 
FROM tasks 
ORDER BY created_at DESC 
LIMIT 10;

-- Lihat unique user_ids
SELECT DISTINCT user_id, COUNT(*) as jumlah_tugas 
FROM tasks 
GROUP BY user_id;

-- ============================================================
-- 6. CEK STRUKTUR TABEL
-- ============================================================
-- Pastikan kolom baru sudah ada
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'tasks' 
ORDER BY ordinal_position;

-- ============================================================
-- 7. TAMBAH KOLOM BARU JIKA BELUM ADA
-- ============================================================
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS activity_type VARCHAR(50) CHECK (activity_type IN ('Perencanaan', 'Pendampingan', 'Pelaporan')),
ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS photo2 TEXT;

-- ============================================================
-- 8. UPDATE DATA LAMA (OPSIONAL)
-- ============================================================
-- Jika ada data lama tanpa activity_type, set default
UPDATE tasks 
SET activity_type = 'Perencanaan' 
WHERE activity_type IS NULL;

-- ============================================================
-- 9. VERIFIKASI AKHIR
-- ============================================================
-- Cek apakah data bisa diakses
SELECT 
  id,
  user_id,
  title,
  activity_type,
  school_id,
  date,
  created_at
FROM tasks 
ORDER BY created_at DESC 
LIMIT 5;

-- Cek total records
SELECT COUNT(*) as total_tugas FROM tasks;

-- ============================================================
-- ROLLBACK DARURAT - JALANKAN INI JIKA DATA MASIH TIDAK MUNCUL
-- ============================================================

-- Hapus semua kebijakan yang ketat
DROP POLICY IF EXISTS "Users can view own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can insert own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can update own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can delete own tasks" ON tasks;

-- Buat kebijakan permisif untuk darurat
CREATE POLICY "darurat_izinkan_semua_tasks" ON tasks FOR ALL USING (true);

-- ============================================================
-- CATATAN PENTING
-- ============================================================
-- Setelah masalah teratasi, sebaiknya:
-- 1. Aktifkan kembali RLS dengan kebijakan yang proper
-- 2. Buat kebijakan yang hanya izinkan user melihat data mereka sendiri
-- 3. Test ulang untuk memastikan keamanan tetap terjaga

-- Contoh kebijakan yang lebih aman (jalankan setelah masalah teratasi):
/*
DROP POLICY IF EXISTS "darurat_izinkan_semua_tasks" ON tasks;

CREATE POLICY "User bisa lihat tugas sendiri" ON tasks 
FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "User bisa tambah tugas sendiri" ON tasks 
FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "User bisa update tugas sendiri" ON tasks 
FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "User bisa hapus tugas sendiri" ON tasks 
FOR DELETE USING (auth.uid()::text = user_id);
*/

-- ============================================================
-- INSTRUKSI PENGGUNAAN
-- ============================================================
-- 1. Copy semua SQL di atas
-- 2. Buka Supabase Dashboard > SQL Editor
-- 3. Paste dan jalankan SQL
-- 4. Refresh halaman aplikasi
-- 5. Cek apakah data tugas harian sudah muncul

-- Jika masih error, coba:
-- 1. Cek koneksi internet
-- 2. Cek kredensial Supabase di file .env
-- 3. Restart server aplikasi