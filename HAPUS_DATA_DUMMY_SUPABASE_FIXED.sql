-- 🗑️ HAPUS DATA DUMMY DARI SUPABASE
-- Script untuk menghapus semua data dummy/sample dari database

-- ========================================
-- HAPUS SEMUA DATA LAMA
-- ========================================

-- Hapus data dari tabel yang memiliki foreign key terlebih dahulu
DELETE FROM additional_tasks;
DELETE FROM supervisions;
DELETE FROM tasks;
DELETE FROM events;
DELETE FROM schools;
DELETE FROM users;

-- ========================================
-- VERIFIKASI DATA SUDAH TERHAPUS
-- ========================================
SELECT 'VERIFIKASI PENGHAPUSAN DATA' as status;
SELECT '==============================' as separator;

SELECT 'users' as table_name, COUNT(*) as remaining FROM users
UNION ALL
SELECT 'schools' as table_name, COUNT(*) as remaining FROM schools
UNION ALL
SELECT 'tasks' as table_name, COUNT(*) as remaining FROM tasks
UNION ALL
SELECT 'events' as table_name, COUNT(*) as remaining FROM events
UNION ALL
SELECT 'supervisions' as table_name, COUNT(*) as remaining FROM supervisions
UNION ALL
SELECT 'additional_tasks' as table_name, COUNT(*) as remaining FROM additional_tasks;

-- ✅ PENGHAPUSAN SELESAI!
SELECT '✅ SEMUA DATA DUMMY BERHASIL DIHAPUS!' as final_status;