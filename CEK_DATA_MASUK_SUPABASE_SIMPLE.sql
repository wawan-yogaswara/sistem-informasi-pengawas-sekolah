-- 🔍 CEK DATA YANG BARU MASUK KE SUPABASE
-- Copy paste ke SQL Editor untuk melihat semua data

-- ========================================
-- 1. LIHAT SEMUA USERS YANG BERHASIL DIIMPORT
-- ========================================
SELECT 'DATA USERS YANG BERHASIL DIIMPORT' as info;
SELECT 
    username as "Username",
    full_name as "Nama Lengkap", 
    role as "Role",
    nip as "NIP",
    rank as "Pangkat"
FROM users 
ORDER BY username;

-- ========================================
-- 2. LIHAT SEKOLAH DENGAN PENGAWASNYA
-- ========================================
SELECT 'DATA SEKOLAH & PENGAWAS' as info;
SELECT 
    s.name as "Nama Sekolah",
    s.principal_name as "Kepala Sekolah",
    u.full_name as "Pengawas"
FROM schools s 
JOIN users u ON s.user_id = u.id
ORDER BY u.full_name, s.name;

-- ========================================
-- 3. LIHAT TUGAS TAMBAHAN
-- ========================================
SELECT 'DATA TUGAS TAMBAHAN' as info;
SELECT 
    at.name as "Nama Kegiatan",
    DATE(at.date) as "Tanggal",
    at.location as "Lokasi",
    u.full_name as "Pengawas"
FROM additional_tasks at
JOIN users u ON at.user_id = u.id
ORDER BY at.date;

-- ========================================
-- 4. STATISTIK RINGKAS
-- ========================================
SELECT 'RINGKASAN DATA' as info;
SELECT 
    (SELECT COUNT(*) FROM users) as "Total Users",
    (SELECT COUNT(*) FROM schools) as "Total Sekolah", 
    (SELECT COUNT(*) FROM additional_tasks) as "Total Tugas Tambahan",
    (SELECT COUNT(*) FROM supervisions) as "Total Supervisi";

-- ========================================
-- 5. SEKOLAH PER PENGAWAS
-- ========================================
SELECT 'PEMBAGIAN SEKOLAH PER PENGAWAS' as info;
SELECT 
    u.full_name as "Nama Pengawas",
    COUNT(s.id) as "Jumlah Sekolah"
FROM users u
LEFT JOIN schools s ON u.id = s.user_id
WHERE u.role = 'pengawas'
GROUP BY u.id, u.full_name
ORDER BY COUNT(s.id) DESC;