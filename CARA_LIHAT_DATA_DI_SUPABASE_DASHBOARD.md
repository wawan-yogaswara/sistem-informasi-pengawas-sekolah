# 📊 CARA LIHAT DATA DI SUPABASE DASHBOARD

## 🔗 AKSES SUPABASE DASHBOARD

### **LANGKAH 1: BUKA SUPABASE DASHBOARD**
1. Buka browser dan kunjungi: **https://supabase.com/dashboard**
2. Login dengan akun Supabase Anda
3. Pilih project: **school-guard-manager** (atau nama project Anda)

### **LANGKAH 2: NAVIGASI KE TABLE EDITOR**
1. Di sidebar kiri, klik **"Table Editor"**
2. Anda akan melihat daftar tabel yang tersedia

## 📋 TABEL-TABEL YANG PERLU DICEK

### **1. TABEL `additional_tasks`**
- **Lokasi:** Table Editor → additional_tasks
- **Berisi:** Data tugas tambahan yang diinput
- **Kolom penting:** 
  - `id` - ID unik
  - `name` - Nama tugas
  - `date` - Tanggal tugas
  - `location` - Lokasi
  - `user_id` - ID user
  - `created_at` - Waktu dibuat

### **2. TABEL `supervisions`**
- **Lokasi:** Table Editor → supervisions
- **Berisi:** Data supervisi sekolah
- **Kolom penting:**
  - `id` - ID unik
  - `school_name` - Nama sekolah
  - `type` - Jenis supervisi (Akademik/Manajerial)
  - `date` - Tanggal supervisi
  - `findings` - Temuan
  - `recommendations` - Rekomendasi
  - `user_id` - ID user
  - `created_at` - Waktu dibuat

### **3. TABEL `activities` atau `events`**
- **Lokasi:** Table Editor → activities (atau events)
- **Berisi:** Data aktivitas/kegiatan
- **Kolom penting:**
  - `id` - ID unik
  - `title` atau `name` - Judul aktivitas
  - `description` - Deskripsi
  - `date` - Tanggal aktivitas
  - `location` - Lokasi
  - `user_id` - ID user
  - `created_at` - Waktu dibuat

## 🔍 CARA CEK DATA YANG TERSIMPAN

### **METODE 1: MELALUI TABLE EDITOR**
1. Klik pada nama tabel (misal: `additional_tasks`)
2. Anda akan melihat semua data dalam bentuk tabel
3. Scroll ke kanan untuk melihat semua kolom
4. Perhatikan kolom `created_at` untuk melihat kapan data dibuat

### **METODE 2: MELALUI SQL EDITOR**
1. Di sidebar kiri, klik **"SQL Editor"**
2. Buat query baru
3. Jalankan query berikut untuk melihat data:

```sql
-- Lihat semua data tugas tambahan
SELECT * FROM additional_tasks ORDER BY created_at DESC;

-- Lihat semua data supervisi
SELECT * FROM supervisions ORDER BY created_at DESC;

-- Lihat semua data aktivitas
SELECT * FROM activities ORDER BY created_at DESC;
-- ATAU jika menggunakan tabel events:
SELECT * FROM events ORDER BY created_at DESC;
```

## 🚨 IDENTIFIKASI DATA DUMMY VS DATA REAL

### **CIRI-CIRI DATA DUMMY:**
- **Nama generik:** "Pembinaan Guru", "Rapat Koordinasi", "Workshop Guru"
- **Tanggal:** Biasanya tanggal yang sama atau berurutan
- **Deskripsi:** Deskripsi standar/template
- **User ID:** Biasanya menggunakan ID default

### **CIRI-CIRI DATA REAL:**
- **Nama spesifik:** Sesuai dengan yang Anda input
- **Tanggal:** Tanggal yang Anda tentukan
- **Deskripsi:** Deskripsi yang Anda tulis
- **User ID:** ID user yang sedang login
- **Created_at:** Timestamp baru (hari ini)

## 🔧 FILTER DAN PENCARIAN

### **FILTER BERDASARKAN TANGGAL:**
1. Di Table Editor, klik ikon filter (🔍)
2. Pilih kolom `created_at`
3. Set filter "greater than" dengan tanggal hari ini
4. Ini akan menampilkan data yang baru saja dibuat

### **PENCARIAN BERDASARKAN NAMA:**
1. Gunakan search box di atas tabel
2. Ketik kata kunci dari data yang Anda input
3. Sistem akan memfilter data sesuai pencarian

## 📊 MONITORING DATA REAL-TIME

### **AUTO-REFRESH:**
1. Di Table Editor, aktifkan auto-refresh
2. Setiap kali ada data baru, tabel akan otomatis update
3. Berguna saat testing input data dari aplikasi

### **SORT BY CREATED_AT:**
1. Klik header kolom `created_at`
2. Pilih "Sort Descending" 
3. Data terbaru akan muncul di atas

## ⚠️ TROUBLESHOOTING

### **JIKA TIDAK ADA DATA:**
1. **Cek koneksi API:** Pastikan API endpoints sudah diperbaiki
2. **Cek environment variables:** Pastikan SUPABASE_URL dan SUPABASE_ANON_KEY benar
3. **Cek network:** Pastikan tidak ada error di browser console

### **JIKA MASIH ADA DATA DUMMY:**
1. **Hapus manual:** Select data dummy dan klik Delete
2. **Gunakan SQL:** Jalankan query DELETE untuk hapus data dummy
3. **Reset tabel:** Truncate tabel jika perlu mulai dari kosong

```sql
-- Hapus semua data dummy (HATI-HATI!)
DELETE FROM additional_tasks WHERE name LIKE '%Pembinaan%' OR name LIKE '%Rapat%';
DELETE FROM supervisions WHERE school_name LIKE '%SDN%' AND findings LIKE '%Pembelajaran%';
```

## 🎯 LANGKAH VERIFIKASI

### **CHECKLIST VERIFIKASI:**
- [ ] Buka Supabase Dashboard
- [ ] Masuk ke Table Editor
- [ ] Cek tabel `additional_tasks`
- [ ] Cek tabel `supervisions` 
- [ ] Cek tabel `activities` atau `events`
- [ ] Pastikan data yang muncul adalah data real Anda
- [ ] Pastikan tidak ada data dummy
- [ ] Cek timestamp `created_at` untuk memastikan data baru

### **JIKA DATA SUDAH BENAR:**
✅ **Selamat!** API sudah berfungsi dengan baik dan data tersimpan ke Supabase

### **JIKA MASIH ADA MASALAH:**
❌ Gunakan script yang sudah saya buatkan di `SETUP_SUPABASE_API_FINAL.html` untuk troubleshooting lebih lanjut.

---

## 📱 AKSES CEPAT
- **Supabase Dashboard:** https://supabase.com/dashboard
- **Project Anda:** https://supabase.com/dashboard/project/fmxeboullgcewzjpql
- **Table Editor:** https://supabase.com/dashboard/project/fmxeboullgcewzjpql/editor

**Sekarang Anda bisa memonitor data real-time langsung dari Supabase Dashboard!** 🎉