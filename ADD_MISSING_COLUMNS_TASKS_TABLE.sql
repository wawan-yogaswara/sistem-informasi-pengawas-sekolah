-- 🔧 ADD MISSING COLUMNS: Menambahkan kolom yang hilang ke tabel tasks
-- Jalankan di Supabase SQL Editor jika ingin menambahkan kolom school_name

-- Cek struktur tabel tasks saat ini
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'tasks' 
ORDER BY ordinal_position;

-- Tambahkan kolom school_name jika belum ada
DO $$ 
BEGIN
    -- Cek apakah kolom school_name sudah ada
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'tasks' AND column_name = 'school_name'
    ) THEN
        -- Tambahkan kolom school_name
        ALTER TABLE tasks ADD COLUMN school_name TEXT;
        RAISE NOTICE 'Column school_name added to tasks table';
    ELSE
        RAISE NOTICE 'Column school_name already exists in tasks table';
    END IF;
    
    -- Cek apakah kolom activity_type sudah ada
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'tasks' AND column_name = 'activity_type'
    ) THEN
        -- Tambahkan kolom activity_type
        ALTER TABLE tasks ADD COLUMN activity_type TEXT;
        RAISE NOTICE 'Column activity_type added to tasks table';
    ELSE
        RAISE NOTICE 'Column activity_type already exists in tasks table';
    END IF;
    
    -- Cek apakah kolom school_id sudah ada
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'tasks' AND column_name = 'school_id'
    ) THEN
        -- Tambahkan kolom school_id
        ALTER TABLE tasks ADD COLUMN school_id UUID;
        RAISE NOTICE 'Column school_id added to tasks table';
    ELSE
        RAISE NOTICE 'Column school_id already exists in tasks table';
    END IF;
    
    -- Cek apakah kolom photo2 sudah ada
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'tasks' AND column_name = 'photo2'
    ) THEN
        -- Tambahkan kolom photo2
        ALTER TABLE tasks ADD COLUMN photo2 TEXT;
        RAISE NOTICE 'Column photo2 added to tasks table';
    ELSE
        RAISE NOTICE 'Column photo2 already exists in tasks table';
    END IF;
END $$;

-- Cek struktur tabel tasks setelah perubahan
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'tasks' 
ORDER BY ordinal_position;

-- Update existing records untuk set school_name dari school_id jika ada
UPDATE tasks 
SET school_name = schools.name 
FROM schools 
WHERE tasks.school_id = schools.id 
AND tasks.school_name IS NULL;

-- Buat index untuk performa yang lebih baik
CREATE INDEX IF NOT EXISTS idx_tasks_school_id ON tasks(school_id);
CREATE INDEX IF NOT EXISTS idx_tasks_activity_type ON tasks(activity_type);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);

-- Tampilkan summary
SELECT 
    'tasks' as table_name,
    COUNT(*) as total_records,
    COUNT(school_name) as records_with_school_name,
    COUNT(activity_type) as records_with_activity_type,
    COUNT(school_id) as records_with_school_id
FROM tasks;