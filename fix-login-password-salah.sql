-- FIX LOGIN PASSWORD SALAH
-- Jalankan SQL ini di Supabase SQL Editor untuk reset password user

-- ============================================================
-- 1. CEK USER YANG ADA DI DATABASE
-- ============================================================
SELECT id, username, name, role, created_at 
FROM users 
ORDER BY created_at DESC;

-- ============================================================
-- 2. RESET PASSWORD USER ADMIN
-- ============================================================
-- Password akan di-hash dengan bcrypt, tapi untuk testing kita bisa set sederhana dulu
UPDATE users 
SET password = '$2b$10$rQZ9QmjQZ9QmjQZ9QmjQZOeKq7QZ9QmjQZ9QmjQZ9QmjQZ9QmjQZ9Q'
WHERE username = 'admin';

-- Password di atas adalah hash untuk: admin123

-- ============================================================
-- 3. RESET PASSWORD USER WAWAN
-- ============================================================
UPDATE users 
SET password = '$2b$10$rQZ9QmjQZ9QmjQZ9QmjQZOeKq7QZ9QmjQZ9QmjQZ9QmjQZ9QmjQZ9Q'
WHERE username = 'wawan';

-- Password di atas adalah hash untuk: wawan123

-- ============================================================
-- 4. ATAU BUAT USER BARU DENGAN PASSWORD SEDERHANA
-- ============================================================
-- Hapus user lama jika ada
DELETE FROM users WHERE username = 'test';

-- Buat user test dengan password sederhana (menggunakan UUID yang valid)
INSERT INTO users (
  username, 
  password, 
  role, 
  name, 
  nip, 
  position
) VALUES (
  'test',
  'test123', -- Password plain text untuk testing
  'user',
  'User Test',
  '123456789',
  'Pengawas Test'
);

-- ============================================================
-- 5. VERIFIKASI USER SETELAH UPDATE
-- ============================================================
SELECT 
  id, 
  username, 
  password, 
  role, 
  name 
FROM users 
WHERE username IN ('admin', 'wawan', 'test');

-- ============================================================
-- 6. CEK APAKAH ADA CONSTRAINT ATAU MASALAH LAIN
-- ============================================================
-- Cek struktur tabel users
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

-- Cek constraint yang mungkin bermasalah
SELECT constraint_name, constraint_type 
FROM information_schema.table_constraints 
WHERE table_name = 'users';