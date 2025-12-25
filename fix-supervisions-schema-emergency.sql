-- FIX SUPERVISIONS SCHEMA EMERGENCY
-- Jalankan di Supabase SQL Editor

-- Tambah kolom yang hilang di tabel supervisions
ALTER TABLE supervisions 
ADD COLUMN IF NOT EXISTS photo1 TEXT,
ADD COLUMN IF NOT EXISTS photo2 TEXT;

-- Pastikan semua kolom yang diperlukan ada
ALTER TABLE supervisions 
ADD COLUMN IF NOT EXISTS teacher_name TEXT,
ADD COLUMN IF NOT EXISTS teacher_nip TEXT,
ADD COLUMN IF NOT EXISTS recommendations TEXT;

-- Update existing data jika ada
UPDATE supervisions 
SET photo1 = NULL WHERE photo1 IS NULL;

UPDATE supervisions 
SET photo2 = NULL WHERE photo2 IS NULL;

-- Cek struktur tabel
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'supervisions' 
ORDER BY ordinal_position;