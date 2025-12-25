-- Fix Supabase Schema untuk mencocokkan dengan API
-- Jalankan di Supabase SQL Editor

-- Update additional_tasks table untuk menambah kolom yang dibutuhkan API
ALTER TABLE additional_tasks 
ADD COLUMN IF NOT EXISTS name VARCHAR(200),
ADD COLUMN IF NOT EXISTS location VARCHAR(200),
ADD COLUMN IF NOT EXISTS organizer VARCHAR(100),
ADD COLUMN IF NOT EXISTS photo1 TEXT,
ADD COLUMN IF NOT EXISTS photo2 TEXT;

-- Update tasks table untuk menambah kolom yang dibutuhkan API
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS category VARCHAR(50),
ADD COLUMN IF NOT EXISTS photo1 TEXT;

-- Update users table untuk menambah kolom yang dibutuhkan API
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS full_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS rank VARCHAR(50),
ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- Update schools table untuk menambah kolom yang dibutuhkan API
ALTER TABLE schools 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id),
ADD COLUMN IF NOT EXISTS contact VARCHAR(50),
ADD COLUMN IF NOT EXISTS principal_name VARCHAR(100);

-- Migrate existing data
UPDATE users SET full_name = name WHERE full_name IS NULL;
UPDATE schools SET principal_name = principal WHERE principal_name IS NULL;
UPDATE additional_tasks SET name = title WHERE name IS NULL AND title IS NOT NULL;

-- Verify schema
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'additional_tasks' 
ORDER BY ordinal_position;

SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'tasks' 
ORDER BY ordinal_position;

SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'schools' 
ORDER BY ordinal_position;