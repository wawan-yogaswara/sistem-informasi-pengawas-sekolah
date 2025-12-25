-- STEP 7: Tambah kolom completed
-- Jalankan ini KEENAM

ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS completed BOOLEAN DEFAULT false;