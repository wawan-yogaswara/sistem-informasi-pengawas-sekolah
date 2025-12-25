-- FIX TASKS LANGSUNG - COPY PASTE KE SUPABASE SQL EDITOR

-- Tambah kolom yang hilang di tabel tasks
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS school TEXT;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS photo TEXT;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS school_id TEXT;

-- FIX FOREIGN KEY CONSTRAINT - Ubah user_id ke TEXT
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_user_id_fkey;
ALTER TABLE tasks ALTER COLUMN user_id TYPE TEXT;

-- Tambah kolom tanggal jika belum ada
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS date DATE;

-- Cek hasil (jalankan untuk verifikasi)
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'tasks' 
ORDER BY ordinal_position;