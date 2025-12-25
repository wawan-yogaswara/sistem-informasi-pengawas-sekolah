-- PERBAIKAN DARURAT TASKS RLS - VERSI 2
-- Solusi untuk error "policy already exists" dan "TypeError: Failed to fetch"
-- Jalankan SQL ini di Supabase SQL Editor

-- ============================================================
-- 1. HAPUS SEMUA KEBIJAKAN YANG ADA TERLEBIH DAHULU
-- ============================================================
-- Hapus kebijakan lama yang mungkin bermasalah
DROP POLICY IF EXISTS "darurat_izinkan_semua_tasks" ON tasks;
DROP POLICY IF EXISTS "Allow all operations on tasks" ON tasks;
DROP POLICY IF EXISTS "Users can view own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can insert own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can update own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can delete own tasks" ON tasks;
DROP POLICY IF EXISTS "tasks_policy" ON tasks;
DROP POLICY IF EXISTS "emergency_allow_all_tasks" ON tasks;

-- ============================================================
-- 2. MATIKAN RLS SEMENTARA
-- ============================================================
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;

-- ============================================================
-- 3. CEK APAKAH DATA BISA DIAKSES TANPA RLS
-- ============================================================
-- Test query sederhana
SELECT COUNT(*) as total_tasks FROM tasks;

-- Lihat sample data
SELECT id, user_id, title, date 
FROM tasks 
ORDER BY created_at DESC 
LIMIT 3;

-- ============================================================
-- 4. AKTIFKAN RLS DENGAN KEBIJAKAN BARU
-- ============================================================
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Buat kebijakan baru dengan nama unik
CREATE POLICY "tasks_full_access_v2" ON tasks 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- ============================================================
-- 5. TEST AKSES SETELAH KEBIJAKAN BARU
-- ============================================================
-- Cek apakah data masih bisa diakses
SELECT COUNT(*) as total_tasks_after_rls FROM tasks;

-- ============================================================
-- 6. CEK KEBIJAKAN YANG AKTIF SEKARANG
-- ============================================================
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'tasks';

-- ============================================================
-- 7. VERIFIKASI STRUKTUR TABEL
-- ============================================================
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'tasks' 
ORDER BY ordinal_position;

-- ============================================================
-- 8. TAMBAH KOLOM JIKA DIPERLUKAN
-- ============================================================
-- Tambah kolom baru jika belum ada (aman untuk dijalankan berulang)
DO $$ 
BEGIN
    -- Cek dan tambah activity_type
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'tasks' AND column_name = 'activity_type'
    ) THEN
        ALTER TABLE tasks ADD COLUMN activity_type VARCHAR(50) 
        CHECK (activity_type IN ('Perencanaan', 'Pendampingan', 'Pelaporan'));
    END IF;
    
    -- Cek dan tambah school_id
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'tasks' AND column_name = 'school_id'
    ) THEN
        ALTER TABLE tasks ADD COLUMN school_id UUID REFERENCES schools(id) ON DELETE SET NULL;
    END IF;
    
    -- Cek dan tambah photo2
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'tasks' AND column_name = 'photo2'
    ) THEN
        ALTER TABLE tasks ADD COLUMN photo2 TEXT;
    END IF;
END $$;

-- ============================================================
-- 9. UPDATE DATA LAMA
-- ============================================================
-- Set default activity_type untuk data lama
UPDATE tasks 
SET activity_type = 'Perencanaan' 
WHERE activity_type IS NULL;

-- ============================================================
-- 10. VERIFIKASI FINAL
-- ============================================================
-- Cek data final
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

-- Cek total data
SELECT COUNT(*) as total_tasks_final FROM tasks;

-- Cek RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'tasks';

-- ============================================================
-- SELESAI!
-- ============================================================
-- Sekarang refresh aplikasi dan cek apakah data tugas harian sudah muncul
-- Jika masih bermasalah, cek:
-- 1. Koneksi internet
-- 2. File .env (VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY)
-- 3. Restart server aplikasi