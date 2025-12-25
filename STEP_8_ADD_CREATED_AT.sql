-- STEP 8: Tambah kolom created_at
-- Jalankan ini KETUJUH

ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();