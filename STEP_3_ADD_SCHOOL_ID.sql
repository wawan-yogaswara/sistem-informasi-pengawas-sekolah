-- STEP 3: Tambah kolom school_id
-- Jalankan ini KETIGA

ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS school_id UUID;