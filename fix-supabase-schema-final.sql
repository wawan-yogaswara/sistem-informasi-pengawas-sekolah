-- Fix Supabase Schema - Menambahkan kolom dan tabel yang hilang
-- Jalankan di Supabase SQL Editor

-- 1. Tambahkan kolom category ke tabel tasks jika belum ada
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'tasks' AND column_name = 'category') THEN
        ALTER TABLE tasks ADD COLUMN category VARCHAR(100);
    END IF;
END $$;

-- 2. Buat tabel events jika belum ada
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    school_id UUID,
    title VARCHAR(255) NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    time VARCHAR(10),
    description TEXT,
    reminded BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Pastikan semua kolom yang diperlukan ada di tabel tasks
DO $$ 
BEGIN
    -- Tambahkan kolom photo1 jika belum ada
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'tasks' AND column_name = 'photo1') THEN
        ALTER TABLE tasks ADD COLUMN photo1 TEXT;
    END IF;
    
    -- Tambahkan kolom photo2 jika belum ada
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'tasks' AND column_name = 'photo2') THEN
        ALTER TABLE tasks ADD COLUMN photo2 TEXT;
    END IF;
END $$;

-- 4. Pastikan semua kolom yang diperlukan ada di tabel supervisions
DO $$ 
BEGIN
    -- Tambahkan kolom photo1 jika belum ada
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'supervisions' AND column_name = 'photo1') THEN
        ALTER TABLE supervisions ADD COLUMN photo1 TEXT;
    END IF;
    
    -- Tambahkan kolom photo2 jika belum ada
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'supervisions' AND column_name = 'photo2') THEN
        ALTER TABLE supervisions ADD COLUMN photo2 TEXT;
    END IF;
    
    -- Tambahkan kolom teacher_name jika belum ada
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'supervisions' AND column_name = 'teacher_name') THEN
        ALTER TABLE supervisions ADD COLUMN teacher_name VARCHAR(255);
    END IF;
    
    -- Tambahkan kolom teacher_nip jika belum ada
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'supervisions' AND column_name = 'teacher_nip') THEN
        ALTER TABLE supervisions ADD COLUMN teacher_nip VARCHAR(50);
    END IF;
END $$;

-- 5. Pastikan semua kolom yang diperlukan ada di tabel additional_tasks
DO $$ 
BEGIN
    -- Tambahkan kolom photo1 jika belum ada
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'additional_tasks' AND column_name = 'photo1') THEN
        ALTER TABLE additional_tasks ADD COLUMN photo1 TEXT;
    END IF;
    
    -- Tambahkan kolom photo2 jika belum ada
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'additional_tasks' AND column_name = 'photo2') THEN
        ALTER TABLE additional_tasks ADD COLUMN photo2 TEXT;
    END IF;
END $$;

-- 6. Update RLS policies untuk tabel events
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Policy untuk SELECT events
DROP POLICY IF EXISTS "Users can view own events" ON events;
CREATE POLICY "Users can view own events" ON events
    FOR SELECT USING (true);

-- Policy untuk INSERT events
DROP POLICY IF EXISTS "Users can insert own events" ON events;
CREATE POLICY "Users can insert own events" ON events
    FOR INSERT WITH CHECK (true);

-- Policy untuk UPDATE events
DROP POLICY IF EXISTS "Users can update own events" ON events;
CREATE POLICY "Users can update own events" ON events
    FOR UPDATE USING (true);

-- Policy untuk DELETE events
DROP POLICY IF EXISTS "Users can delete own events" ON events;
CREATE POLICY "Users can delete own events" ON events
    FOR DELETE USING (true);

-- 7. Refresh schema cache (ini akan dilakukan otomatis setelah perubahan)
NOTIFY pgrst, 'reload schema';

-- 8. Verifikasi struktur tabel
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name IN ('users', 'schools', 'tasks', 'supervisions', 'additional_tasks', 'events')
    AND table_schema = 'public'
ORDER BY table_name, ordinal_position;