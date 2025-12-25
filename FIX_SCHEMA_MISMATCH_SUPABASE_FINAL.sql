-- 🔧 FIX SCHEMA MISMATCH: Menambahkan kolom yang hilang ke tabel tasks
-- Jalankan di Supabase SQL Editor untuk menyelesaikan schema mismatch

-- 1. CEK STRUKTUR TABEL TASKS SAAT INI
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'tasks' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. TAMBAHKAN KOLOM YANG HILANG
DO $$ 
BEGIN
    -- Tambahkan kolom school_name jika belum ada
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'tasks' 
        AND column_name = 'school_name'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.tasks ADD COLUMN school_name TEXT;
        RAISE NOTICE '✅ Column school_name added to tasks table';
    ELSE
        RAISE NOTICE '⚠️ Column school_name already exists in tasks table';
    END IF;
    
    -- Tambahkan kolom activity_type jika belum ada
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'tasks' 
        AND column_name = 'activity_type'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.tasks ADD COLUMN activity_type TEXT;
        RAISE NOTICE '✅ Column activity_type added to tasks table';
    ELSE
        RAISE NOTICE '⚠️ Column activity_type already exists in tasks table';
    END IF;
    
    -- Tambahkan kolom school_id jika belum ada
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'tasks' 
        AND column_name = 'school_id'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.tasks ADD COLUMN school_id UUID;
        RAISE NOTICE '✅ Column school_id added to tasks table';
    ELSE
        RAISE NOTICE '⚠️ Column school_id already exists in tasks table';
    END IF;
    
    -- Tambahkan kolom photo2 jika belum ada
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'tasks' 
        AND column_name = 'photo2'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.tasks ADD COLUMN photo2 TEXT;
        RAISE NOTICE '✅ Column photo2 added to tasks table';
    ELSE
        RAISE NOTICE '⚠️ Column photo2 already exists in tasks table';
    END IF;
    
    RAISE NOTICE '🎯 Schema update completed!';
END $$;

-- 3. UPDATE DATA EXISTING (OPSIONAL)
-- Set default values untuk records yang sudah ada
UPDATE public.tasks 
SET 
    activity_type = CASE WHEN activity_type IS NULL THEN 'Perencanaan' ELSE activity_type END,
    school_id = CASE WHEN school_id IS NULL THEN '1cd40355-1b07-402d-8309-b243c098cfe9'::uuid ELSE school_id END,
    school_name = CASE WHEN school_name IS NULL THEN 'SDN 1 Garut' ELSE school_name END
WHERE 
    activity_type IS NULL 
    OR school_id IS NULL 
    OR school_name IS NULL;

-- 4. UPDATE SCHOOL_NAME DARI RELASI SCHOOLS (JIKA ADA)
UPDATE public.tasks 
SET school_name = schools.name 
FROM public.schools 
WHERE tasks.school_id = schools.id 
AND (tasks.school_name IS NULL OR tasks.school_name = 'SDN 1 Garut');

-- 5. BUAT INDEX UNTUK PERFORMA
CREATE INDEX IF NOT EXISTS idx_tasks_school_id ON public.tasks(school_id);
CREATE INDEX IF NOT EXISTS idx_tasks_activity_type ON public.tasks(activity_type);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_date ON public.tasks(date);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON public.tasks(created_at);

-- 6. CEK STRUKTUR TABEL SETELAH UPDATE
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'tasks' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 7. TAMPILKAN SUMMARY DATA
SELECT 
    'TASKS TABLE SUMMARY' as info,
    COUNT(*) as total_records,
    COUNT(school_name) as records_with_school_name,
    COUNT(activity_type) as records_with_activity_type,
    COUNT(school_id) as records_with_school_id,
    COUNT(photo2) as records_with_photo2
FROM public.tasks;

-- 8. TAMPILKAN SAMPLE DATA
SELECT 
    id,
    title,
    activity_type,
    school_name,
    school_id,
    date,
    created_at
FROM public.tasks 
ORDER BY created_at DESC 
LIMIT 5;

-- 🎯 HASIL YANG DIHARAPKAN:
-- ✅ Kolom school_name, activity_type, school_id, photo2 ditambahkan
-- ✅ Data existing diupdate dengan default values
-- ✅ Index dibuat untuk performa
-- ✅ Schema mismatch resolved
-- ✅ Frontend bisa menyimpan data tanpa error