-- 🔧 SIMPLE FIX: Tambah kolom satu per satu
-- Jalankan SATU PER SATU di Supabase SQL Editor

-- STEP 1: Cek tabel tasks saat ini
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'tasks' 
AND table_schema = 'public'
ORDER BY ordinal_position;