-- Fix additional_tasks schema untuk memastikan bisa menyimpan data
-- Jalankan di Supabase SQL Editor

-- Update tabel additional_tasks agar lebih fleksibel
ALTER TABLE additional_tasks 
ALTER COLUMN user_id DROP NOT NULL;

ALTER TABLE additional_tasks 
ALTER COLUMN school_id DROP NOT NULL;

-- Pastikan kolom date bisa nullable juga
ALTER TABLE additional_tasks 
ALTER COLUMN date DROP NOT NULL;

-- Cek struktur tabel setelah perubahan
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'additional_tasks' 
ORDER BY ordinal_position;