-- ============================================================
-- UPDATE DATABASE SCHEMA - Enhanced Features
-- ============================================================
-- Jalankan SQL ini di Supabase SQL Editor untuk menambah fitur baru

-- ============================================================
-- UPDATE TABEL ADDITIONAL_TASKS
-- ============================================================
-- Tambah kolom baru untuk tugas tambahan
ALTER TABLE additional_tasks 
ADD COLUMN IF NOT EXISTS location VARCHAR(200),
ADD COLUMN IF NOT EXISTS organizer VARCHAR(200),
ADD COLUMN IF NOT EXISTS photo2 TEXT;

-- ============================================================
-- UPDATE TABEL TASKS (Tugas Harian)
-- ============================================================
-- Tambah kolom baru untuk tugas harian
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS activity_type VARCHAR(50) CHECK (activity_type IN ('Perencanaan', 'Pendampingan', 'Pelaporan')),
ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS photo2 TEXT;

-- Index untuk performa
CREATE INDEX IF NOT EXISTS idx_tasks_activity_type ON tasks(activity_type);
CREATE INDEX IF NOT EXISTS idx_tasks_school_id ON tasks(school_id);

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================
-- Jalankan query ini untuk verifikasi update berhasil:

-- Cek kolom baru di additional_tasks
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'additional_tasks' 
AND column_name IN ('location', 'organizer', 'photo2');

-- Cek kolom baru di tasks
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'tasks' 
AND column_name IN ('activity_type', 'school_id', 'photo2');

-- ============================================================
-- SELESAI!
-- ============================================================
-- Database schema sudah diupdate dengan fitur baru