# 👀 CARA LIHAT DATA DI SUPABASE SETELAH MIGRASI

## 1. Melalui Table Editor (Cara Termudah)

### Langkah-langkah:
1. ✅ Di Supabase Dashboard, klik **"Table Editor"** di sidebar kiri
2. ✅ Pilih tabel yang ingin dilihat:
   - **users** - Lihat data user (admin, wawan, yenihandayani, itasdik)
   - **schools** - Lihat data sekolah (17 sekolah)
   - **tasks** - Lihat data tugas
   - **supervisions** - Lihat data supervisi
   - **additional_tasks** - Lihat data tugas tambahan (6 records)

### Data yang Berhasil Diimport:
- ✅ **4 Users**: admin, wawan, yenihandayani, itasdik
- ✅ **17 Schools**: SDN 1 Garut, SMPN 2 Garut, SMAN 1 Garut, dll
- ✅ **1 Task**: Supervisi Akademik
- ✅ **1 Supervision**: Data supervisi di SDN 1 Garut
- ✅ **6 Additional Tasks**: Rapat Koordinasi, Workshop Guru, dll

## 2. Melalui SQL Editor (Cara Advanced)

Copy dan paste query ini untuk melihat data:

```sql
-- Lihat semua users
SELECT username, full_name, role, nip FROM users;

-- Lihat semua sekolah dengan nama pengawas
SELECT s.name as sekolah, s.principal_name as kepala_sekolah, u.full_name as pengawas
FROM schools s 
JOIN users u ON s.user_id = u.id;

-- Lihat tugas tambahan dengan nama pengawas
SELECT at.name as kegiatan, at.date, at.location, u.full_name as pengawas
FROM additional_tasks at
JOIN users u ON at.user_id = u.id
ORDER BY at.date;

-- Lihat supervisi
SELECT s.type, s.date, sc.name as sekolah, u.full_name as pengawas
FROM supervisions s
JOIN schools sc ON s.school_id = sc.id
JOIN users u ON s.user_id = u.id;
```

## 3. Test Login ke Aplikasi

Sekarang Anda bisa login dengan:
- **Username**: `wawan` | **Password**: `admin123`
- **Username**: `yenihandayani` | **Password**: `admin123`
- **Username**: `itasdik` | **Password**: `admin123`
- **Username**: `admin` | **Password**: `admin123`

## 4. Verifikasi Data di Aplikasi

Setelah login, cek:
- ✅ Dashboard menampilkan statistik yang benar
- ✅ Halaman Sekolah menampilkan sekolah sesuai pengawas
- ✅ Halaman Tugas Tambahan menampilkan 6 kegiatan
- ✅ Data profil pengawas lengkap dengan NIP dan pangkat

🎉 **Data real sudah berhasil diimport ke Supabase!**