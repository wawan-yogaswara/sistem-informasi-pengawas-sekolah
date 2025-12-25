-- ========================================
-- FIX SCHEMA MISMATCH TASKS TABLE - COMPLETE
-- ========================================
-- Jalankan semua perintah ini di Supabase SQL Editor
-- Copy paste semua dan jalankan sekaligus

-- 1. Tambah kolom school_name
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS school_name TEXT;

-- 2. Tambah kolom activity_type  
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS activity_type TEXT;

-- 3. Tambah kolom school_id
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS school_id UUID;

-- 4. Tambah kolom photo2
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS photo2 TEXT;

-- 5. Tambah kolom photo
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS photo TEXT;

-- 6. Tambah kolom completed
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS completed BOOLEAN DEFAULT false;

-- 7. Tambah kolom created_at
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- ========================================
-- VERIFIKASI HASIL
-- ========================================
-- Jalankan query ini untuk memastikan semua kolom sudah ada:

SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'tasks' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Harus muncul kolom:
-- ✓ id (uuid)
-- ✓ user_id (text)  
-- ✓ title (character varying)
-- ✓ description (text)
-- ✓ date (date)
-- ✓ school_name (text) <- BARU
-- ✓ activity_type (text) <- BARU
-- ✓ school_id (uuid) <- BARU
-- ✓ photo2 (text) <- BARU
-- ✓ photo (text) <- BARU
-- ✓ completed (boolean) <- BARU
-- ✓ created_at (timestamp with time zone) <- BARU