-- Fix title constraint dan data di additional_tasks
-- Jalankan di Supabase SQL Editor

-- 1. Update existing records yang title-nya NULL
UPDATE additional_tasks 
SET title = name 
WHERE title IS NULL AND name IS NOT NULL;

-- 2. Update records yang name dan title keduanya NULL
UPDATE additional_tasks 
SET title = 'Tugas Tambahan', name = 'Tugas Tambahan'
WHERE title IS NULL AND name IS NULL;

-- 3. Buat title menjadi optional (nullable) untuk menghindari constraint error
ALTER TABLE additional_tasks 
ALTER COLUMN title DROP NOT NULL;

-- 4. Atau jika ingin tetap required, pastikan ada default value
-- ALTER TABLE additional_tasks 
-- ALTER COLUMN title SET DEFAULT 'Tugas Tambahan';

-- 5. Verifikasi data
SELECT id, title, name, location, organizer, date 
FROM additional_tasks 
ORDER BY created_at DESC 
LIMIT 10;