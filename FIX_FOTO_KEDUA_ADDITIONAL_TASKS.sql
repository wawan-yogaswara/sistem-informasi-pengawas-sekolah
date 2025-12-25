-- FIX FOTO KEDUA ADDITIONAL TASKS
-- Jalankan SQL ini di Supabase SQL Editor

-- Tambah kolom photo2 ke tabel additional_tasks
ALTER TABLE additional_tasks 
ADD COLUMN IF NOT EXISTS photo2 TEXT;

-- Tambah comment untuk dokumentasi
COMMENT ON COLUMN additional_tasks.photo2 IS 'Base64 encoded second photo for additional task';

-- Verify struktur tabel
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'additional_tasks' 
ORDER BY ordinal_position;