-- FIX SUPERVISI LANGSUNG - COPY PASTE KE SUPABASE SQL EDITOR

-- Tambah kolom school yang hilang
ALTER TABLE supervisions ADD COLUMN IF NOT EXISTS school TEXT;

-- Tambah kolom foto yang hilang  
ALTER TABLE supervisions ADD COLUMN IF NOT EXISTS photo1 TEXT;
ALTER TABLE supervisions ADD COLUMN IF NOT EXISTS photo2 TEXT;

-- Tambah kolom guru yang hilang
ALTER TABLE supervisions ADD COLUMN IF NOT EXISTS teacher_name TEXT;
ALTER TABLE supervisions ADD COLUMN IF NOT EXISTS teacher_nip TEXT;

-- Tambah kolom rekomendasi yang hilang
ALTER TABLE supervisions ADD COLUMN IF NOT EXISTS recommendations TEXT;

-- FIX FOREIGN KEY CONSTRAINT - Ubah user_id ke TEXT
ALTER TABLE supervisions DROP CONSTRAINT IF EXISTS supervisions_user_id_fkey;
ALTER TABLE supervisions ALTER COLUMN user_id TYPE TEXT;

-- Buat school_id tidak wajib
ALTER TABLE supervisions ALTER COLUMN school_id DROP NOT NULL;

-- Cek hasil (jalankan untuk verifikasi)
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'supervisions' 
ORDER BY ordinal_position;