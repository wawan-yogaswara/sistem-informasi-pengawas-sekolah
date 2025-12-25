-- FIX ADDITIONAL TASKS LANGSUNG - COPY PASTE KE SUPABASE SQL EDITOR

-- Tambah kolom yang hilang di tabel additional_tasks
ALTER TABLE additional_tasks ADD COLUMN IF NOT EXISTS school TEXT;
ALTER TABLE additional_tasks ADD COLUMN IF NOT EXISTS photo TEXT;
ALTER TABLE additional_tasks ADD COLUMN IF NOT EXISTS school_id TEXT;

-- FIX FOREIGN KEY CONSTRAINT - Ubah user_id ke TEXT
ALTER TABLE additional_tasks DROP CONSTRAINT IF EXISTS additional_tasks_user_id_fkey;
ALTER TABLE additional_tasks ALTER COLUMN user_id TYPE TEXT;

-- Tambah kolom tanggal jika belum ada
ALTER TABLE additional_tasks ADD COLUMN IF NOT EXISTS date DATE;

-- Cek hasil (jalankan untuk verifikasi)
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'additional_tasks' 
ORDER BY ordinal_position;