-- STEP 5: Verifikasi semua kolom sudah ada
-- Jalankan ini TERAKHIR untuk memastikan

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'tasks' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Harus muncul kolom:
-- school_name (text)
-- activity_type (text) 
-- school_id (uuid)
-- photo2 (text)