-- FIX LOGIN SEDERHANA
-- Jalankan SQL ini satu per satu di Supabase SQL Editor

-- ============================================================
-- 1. CEK USER YANG ADA
-- ============================================================
SELECT id, username, name, role FROM users;

-- ============================================================
-- 2. BUAT USER TEST BARU (SEDERHANA)
-- ============================================================
-- Hapus user test jika sudah ada
DELETE FROM users WHERE username = 'test';

-- Buat user test baru
INSERT INTO users (username, password, role, name, nip, position) 
VALUES ('test', 'test123', 'user', 'User Test', '123456789', 'Pengawas Test');

-- ============================================================
-- 3. UPDATE PASSWORD USER YANG ADA (JIKA PERLU)
-- ============================================================
-- Update password admin menjadi sederhana
UPDATE users SET password = 'admin123' WHERE username = 'admin';

-- Update password wawan menjadi sederhana  
UPDATE users SET password = 'wawan123' WHERE username = 'wawan';

-- ============================================================
-- 4. VERIFIKASI USER SETELAH UPDATE
-- ============================================================
SELECT username, password, role, name FROM users 
WHERE username IN ('admin', 'wawan', 'test');

-- ============================================================
-- 5. CEK APAKAH TABEL USERS PUNYA RLS
-- ============================================================
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'users';

-- ============================================================
-- 6. MATIKAN RLS UNTUK USERS (JIKA PERLU)
-- ============================================================
ALTER TABLE users DISABLE ROW LEVEL SECURITY;