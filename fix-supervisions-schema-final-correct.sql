-- FIX SUPERVISIONS SCHEMA - FINAL CORRECT VERSION
-- Jalankan di Supabase SQL Editor

-- Tambah kolom 'school' sebagai TEXT untuk menyimpan nama sekolah langsung
-- Ini untuk kompatibilitas dengan frontend yang menggunakan nama sekolah
ALTER TABLE supervisions 
ADD COLUMN IF NOT EXISTS school TEXT;

-- Tambah kolom yang hilang lainnya
ALTER TABLE supervisions 
ADD COLUMN IF NOT EXISTS photo1 TEXT,
ADD COLUMN IF NOT EXISTS photo2 TEXT,
ADD COLUMN IF NOT EXISTS teacher_name TEXT,
ADD COLUMN IF NOT EXISTS teacher_nip TEXT;

-- Pastikan kolom recommendations ada
ALTER TABLE supervisions 
ADD COLUMN IF NOT EXISTS recommendations TEXT;

-- Update data existing jika ada school_id tapi belum ada school name
UPDATE supervisions 
SET school = (
  SELECT name FROM schools WHERE schools.id = supervisions.school_id
)
WHERE school IS NULL AND school_id IS NOT NULL;

-- Buat school_id optional (bisa NULL) untuk backward compatibility
ALTER TABLE supervisions 
ALTER COLUMN school_id DROP NOT NULL;

-- Cek struktur tabel final
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'supervisions' 
ORDER BY ordinal_position;

-- Test query untuk memastikan bisa select dengan kolom 'school'
-- SELECT id, school, type, date, findings FROM supervisions LIMIT 1;