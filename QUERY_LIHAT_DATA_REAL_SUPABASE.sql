-- 👀 QUERY UNTUK MELIHAT DATA REAL DI SUPABASE
-- Copy dan paste ke SQL Editor untuk melihat data yang baru diimport

-- ========================================
-- 1. LIHAT SEMUA USERS
-- ========================================
SELECT 'DATA USERS' as info;
SELECT username, full_name, role, nip, rank FROM users ORDER BY username;

-- ========================================
-- 2. LIHAT SEKOLAH DENGAN PENGAWAS
-- ========================================
SELECT 'DATA SEKOLAH & PENGAWAS' as info;
SELECT 
    s.name as nama_sekolah, 
    s.principal_name as kepala_sekolah,
    u.full_name as nama_pengawas,
    u.username as username_pengawas
FROM schools s 
JOIN users u ON s.user_id = u.id
ORDER BY u.username, s.name;

-- ========================================
-- 3. LIHAT TUGAS TAMBAHAN
-- ========================================
SELECT 'DATA TUGAS TAMBAHAN' as info;
SELECT 
    at.name as nama_kegiatan,
    at.date as tanggal,
    at.location as lokasi,
    at.organizer as penyelenggara,
    u.full_name as pengawas
FROM additional_tasks at
JOIN users u ON at.user_id = u.id
ORDER BY at.date;

-- ========================================
-- 4. LIHAT DATA SUPERVISI
-- ========================================
SELECT 'DATA SUPERVISI' as info;
SELECT 
    s.type as jenis_supervisi,
    s.date as tanggal,
    sc.name as nama_sekolah,
    s.findings as temuan,
    u.full_name as pengawas
FROM supervisions s
JOIN schools sc ON s.school_id = sc.id
JOIN users u ON s.user_id = u.id;

-- ========================================
-- 5. STATISTIK DATA
-- ========================================
SELECT 'STATISTIK DATA' as info;
SELECT 
    'Total Users' as kategori, 
    COUNT(*) as jumlah 
FROM users
UNION ALL
SELECT 
    'Total Sekolah' as kategori, 
    COUNT(*) as jumlah 
FROM schools
UNION ALL
SELECT 
    'Total Tugas Tambahan' as kategori, 
    COUNT(*) as jumlah 
FROM additional_tasks
UNION ALL
SELECT 
    'Total Supervisi' as kategori, 
    COUNT(*) as jumlah 
FROM supervisions;

-- ========================================
-- 6. SEKOLAH PER PENGAWAS
-- ========================================
SELECT 'SEKOLAH PER PENGAWAS' as info;
SELECT 
    u.full_name as pengawas,
    COUNT(s.id) as jumlah_sekolah
FROM users u
LEFT JOIN schools s ON u.id = s.user_id
WHERE u.role = 'pengawas'
GROUP BY u.id, u.full_name
ORDER BY jumlah_sekolah DESC;