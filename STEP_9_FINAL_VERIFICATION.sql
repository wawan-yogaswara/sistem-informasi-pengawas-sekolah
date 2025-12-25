-- STEP 9: Verifikasi FINAL - semua kolom sudah ada
-- Jalankan ini TERAKHIR untuk memastikan

SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'tasks' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Harus muncul kolom:
-- id (uuid)
-- user_id (text)
-- title (character varying)
-- description (text)
-- date (date)
-- school_name (text) ✓
-- activity_type (text) ✓
-- school_id (uuid) ✓
-- photo2 (text) ✓
-- photo (text) ✓
-- completed (boolean) ✓
-- created_at (timestamp with time zone) ✓