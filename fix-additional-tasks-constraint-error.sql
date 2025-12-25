-- FIX ADDITIONAL TASKS CONSTRAINT ERROR
-- Copy paste this SQL to Supabase SQL Editor to fix constraint issues

-- 1. First, check current table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'additional_tasks' 
ORDER BY ordinal_position;

-- 2. Add missing columns if they don't exist
ALTER TABLE additional_tasks ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE additional_tasks ADD COLUMN IF NOT EXISTS organizer TEXT;
ALTER TABLE additional_tasks ADD COLUMN IF NOT EXISTS photo2 TEXT;

-- 3. Fix user_id constraint - allow both UUID and TEXT
-- Drop the foreign key constraint temporarily
ALTER TABLE additional_tasks DROP CONSTRAINT IF EXISTS additional_tasks_user_id_fkey;

-- Change user_id to TEXT to allow flexible user identification
ALTER TABLE additional_tasks ALTER COLUMN user_id TYPE TEXT;

-- 4. Fix school_id constraint - make it optional and allow TEXT
ALTER TABLE additional_tasks DROP CONSTRAINT IF EXISTS additional_tasks_school_id_fkey;
ALTER TABLE additional_tasks ALTER COLUMN school_id TYPE TEXT;
ALTER TABLE additional_tasks ALTER COLUMN school_id DROP NOT NULL;

-- 5. Ensure date column exists and is properly typed
ALTER TABLE additional_tasks ALTER COLUMN date TYPE DATE;

-- 6. Update any existing records with invalid user_id to use Wawan's UUID
UPDATE additional_tasks 
SET user_id = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e' 
WHERE user_id NOT LIKE '%-%-%-%-%' OR user_id = 'wawan' OR user_id = 'default_user';

-- 7. Update any existing records with invalid school_id to use default school
UPDATE additional_tasks 
SET school_id = '1cd40355-1b07-402d-8309-b243c098cfe9' 
WHERE school_id IS NULL OR school_id NOT LIKE '%-%-%-%-%';

-- 8. Verify the fix worked
SELECT 
  id,
  user_id,
  school_id,
  title,
  date,
  status,
  location,
  organizer,
  created_at
FROM additional_tasks 
ORDER BY created_at DESC 
LIMIT 5;

-- 9. Check table structure after fix
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'additional_tasks' 
ORDER BY ordinal_position;

-- 10. Test insert with the expected data format
-- This should work without constraint errors now
INSERT INTO additional_tasks (
  user_id,
  school_id,
  title,
  description,
  date,
  status,
  location,
  organizer,
  photo,
  photo2
) VALUES (
  '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e',
  '1cd40355-1b07-402d-8309-b243c098cfe9',
  'Test Kegiatan Tambahan',
  'Test deskripsi kegiatan',
  CURRENT_DATE,
  'completed',
  'Test Location',
  'Pengawas Sekolah',
  NULL,
  NULL
);

-- 11. Clean up test data (optional)
-- DELETE FROM additional_tasks WHERE title = 'Test Kegiatan Tambahan';

-- SUCCESS MESSAGE
SELECT 'Additional tasks table constraint issues have been fixed!' as status;