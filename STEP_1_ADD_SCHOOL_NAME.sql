-- STEP 1: Tambah kolom school_name
-- Jalankan ini PERTAMA

ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS school_name TEXT;