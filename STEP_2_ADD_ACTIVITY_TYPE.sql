-- STEP 2: Tambah kolom activity_type
-- Jalankan ini KEDUA

ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS activity_type TEXT;