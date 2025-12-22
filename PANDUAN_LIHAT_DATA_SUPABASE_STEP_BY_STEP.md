# 👀 PANDUAN MELIHAT DATA DI SUPABASE - STEP BY STEP

## **Metode 1: Table Editor (Termudah)**

### Langkah-langkah:
1. ✅ Buka **Supabase Dashboard** di browser
2. ✅ Di sidebar kiri, klik **"Table Editor"**
3. ✅ Anda akan melihat daftar tabel:
   - `users` (4 records)
   - `schools` (17 records) 
   - `additional_tasks` (6 records)
   - `supervisions` (1 record)
   - `tasks` (1 record)

4. ✅ **Klik nama tabel** untuk melihat isinya
5. ✅ Data akan tampil dalam bentuk tabel yang mudah dibaca

### Contoh Data yang Akan Terlihat:

**Tabel Users:**
- admin | Administrator | admin
- wawan | H. Wawan Yogaswara, S.Pd, M.Pd | pengawas
- yenihandayani | Yeni Handayani | pengawas  
- itasdik | Iman Tasdik | pengawas

**Tabel Schools:**
- SDN 1 Garut | Drs. Ahmad Suryadi | wawan
- SMPN 2 Garut | Dra. Siti Nurhasanah | wawan
- SMKN 4 Garut | Drs. Asep Wijaya, M.Pd | yenihandayani
- dst...

## **Metode 2: SQL Editor**

### Langkah-langkah:
1. ✅ Di Supabase Dashboard, klik **"SQL Editor"**
2. ✅ Copy paste query dari file `CEK_DATA_MASUK_SUPABASE_SIMPLE.sql`
3. ✅ Klik **"Run"** untuk melihat hasil
4. ✅ Scroll ke bawah untuk melihat semua hasil query

## **Metode 3: Test Login ke Aplikasi**

### Untuk memastikan data benar-benar masuk:
1. ✅ Buka aplikasi di browser
2. ✅ Login dengan:
   - **Username**: `wawan` | **Password**: `admin123`
   - **Username**: `yenihandayani` | **Password**: `admin123`
   - **Username**: `itasdik` | **Password**: `admin123`

3. ✅ Cek halaman:
   - **Dashboard** - Harus menampilkan statistik real
   - **Sekolah** - Harus menampilkan sekolah sesuai pengawas
   - **Tugas Tambahan** - Harus menampilkan 6 kegiatan
   - **Profil** - Harus menampilkan data lengkap dengan NIP

## **Data yang Berhasil Diimport:**

### ✅ **4 Users:**
- admin (Administrator)
- wawan (H. Wawan Yogaswara, S.Pd, M.Pd)
- yenihandayani (Yeni Handayani) 
- itasdik (Iman Tasdik)

### ✅ **17 Sekolah:**
- **Wawan**: 8 sekolah (SDN 1 Garut, SMPN 2 Garut, dll)
- **Yeni**: 5 sekolah (SMKN 4 Garut, SDN 2 Garut, dll)
- **Iman**: 4 sekolah (SMAN 2 Garut, SMKN 1 Garut, dll)

### ✅ **6 Tugas Tambahan:**
- Rapat Koordinasi (wawan)
- Workshop Guru (wawan)
- Evaluasi Kurikulum (yenihandayani)
- Monitoring Pembelajaran (itasdik)
- Pembinaan Guru (yenihandayani)
- Sosialisasi Program (itasdik)

### ✅ **1 Supervisi:**
- Supervisi Akademik di SDN 1 Garut (wawan)

🎉 **Semua data real sudah berhasil masuk ke Supabase!**