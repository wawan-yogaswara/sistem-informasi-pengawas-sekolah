-- TEST AKSES TASKS SEKARANG
-- Jalankan query ini satu per satu di Supabase SQL Editor

-- ============================================================
-- 1. CEK KEBIJAKAN YANG AKTIF
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
-- 2. CEK APAKAH ADA DATA DI TABEL TASKS
-- ============================================================
SELECT COUNT(*) as total_tasks FROM tasks;

-- ============================================================
-- 3. LIHAT SAMPLE DATA (JIKA ADA)
-- ============================================================
SELECT 
  id,
  user_id,
  title,
  date,
  created_at
FROM tasks 
ORDER BY created_at DESC 
LIMIT 5;

-- ============================================================
-- 4. CEK STRUKTUR TABEL
-- ============================================================
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'tasks' 
ORDER BY ordinal_position;

-- ============================================================
-- 5. JIKA TIDAK ADA DATA, INSERT DATA TEST
-- ============================================================
-- Ganti 'user-uuid-test' dengan UUID user yang valid
INSERT INTO tasks (
  user_id, 
  title, 
  description, 
  date, 
  activity_type
) VALUES (
  'user-uuid-1234-5678-9012-123456789012', 
  'Test Tugas Harian', 
  'Ini adalah data test untuk memastikan input berfungsi', 
  CURRENT_DATE,
  'Perencanaan'
);

-- ============================================================
-- 6. CEK LAGI SETELAH INSERT
-- ============================================================
SELECT COUNT(*) as total_tasks_after_insert FROM tasks;

-- ============================================================
-- 7. LIHAT DATA TERBARU
-- ============================================================
SELECT 
  id,
  user_id,
  title,
  activity_type,
  date,
  created_at
FROM tasks 
ORDER BY created_at DESC 
LIMIT 3;