-- Script untuk memeriksa struktur tabel additional_tasks
-- Jalankan di Supabase SQL Editor

-- 1. Cek struktur kolom tabel additional_tasks
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'additional_tasks' 
ORDER BY ordinal_position;

-- 2. Cek apakah ada data di tabel
SELECT COUNT(*) as total_records FROM additional_tasks;

-- 3. Cek sample data (5 record pertama)
SELECT 
    id,
    user_id,
    title,
    name,
    description,
    date,
    location,
    organizer,
    photo,
    photo1,
    photo2,
    created_at
FROM additional_tasks 
ORDER BY created_at DESC 
LIMIT 5;

-- 4. Cek user_id yang ada
SELECT DISTINCT user_id, COUNT(*) as count
FROM additional_tasks 
GROUP BY user_id;

-- 5. Cek apakah ada kolom name dan title
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'additional_tasks' AND column_name = 'name') 
        THEN 'name column exists' 
        ELSE 'name column missing' 
    END as name_status,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'additional_tasks' AND column_name = 'title') 
        THEN 'title column exists' 
        ELSE 'title column missing' 
    END as title_status;