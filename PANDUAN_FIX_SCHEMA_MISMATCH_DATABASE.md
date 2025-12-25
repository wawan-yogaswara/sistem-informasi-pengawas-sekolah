# 🔧 PANDUAN FIX SCHEMA MISMATCH - UPDATE DATABASE

## 🎯 MASALAH YANG DIPERBAIKI

**Error**: `"Could not find the 'school_name' column of 'tasks' in the schema cache"`

**Root Cause**: Frontend mencoba menyimpan ke kolom yang tidak ada di database Supabase.

## 🛠️ SOLUSI: UPDATE DATABASE SCHEMA

Menambahkan kolom yang hilang ke tabel `tasks` di Supabase supaya sesuai dengan frontend.

## 📋 LANGKAH-LANGKAH

### 1. BUKA SUPABASE DASHBOARD
1. Login ke [supabase.com](https://supabase.com)
2. Pilih project Anda
3. Klik **"SQL Editor"** di sidebar kiri

### 2. JALANKAN SQL SCRIPT
1. Copy **seluruh isi** file `FIX_SCHEMA_MISMATCH_SUPABASE_FINAL.sql`
2. Paste ke SQL Editor
3. Klik **"Run"** atau tekan **Ctrl+Enter**

### 3. VERIFIKASI HASIL
Setelah script berhasil dijalankan, Anda akan melihat:

```
✅ Column school_name added to tasks table
✅ Column activity_type added to tasks table  
✅ Column school_id added to tasks table
✅ Column photo2 added to tasks table
🎯 Schema update completed!
```

### 4. CEK STRUKTUR TABEL
Script akan menampilkan struktur tabel sebelum dan sesudah update:

**SEBELUM:**
- id, user_id, title, description, completed, date, photo, created_at

**SESUDAH:**
- id, user_id, title, description, completed, date, photo, created_at
- **school_name** (TEXT) ✅ BARU
- **activity_type** (TEXT) ✅ BARU  
- **school_id** (UUID) ✅ BARU
- **photo2** (TEXT) ✅ BARU

## 🎯 HASIL YANG DICAPAI

### ✅ SCHEMA MISMATCH RESOLVED
- Frontend bisa menyimpan ke kolom `school_name` ✅
- Frontend bisa menyimpan ke kolom `activity_type` ✅
- Frontend bisa menyimpan ke kolom `school_id` ✅
- Frontend bisa menyimpan ke kolom `photo2` ✅

### ✅ DATA EXISTING DIUPDATE
- Records lama diberi default values
- school_name diupdate dari relasi schools (jika ada)
- Tidak ada data yang hilang

### ✅ PERFORMA DITINGKATKAN
- Index dibuat untuk kolom baru
- Query akan lebih cepat

## 🚀 TEST SETELAH UPDATE

1. **Buka halaman Tugas Harian**
2. **Isi form** seperti biasa:
   - Judul Tugas
   - Tanggal
   - Jenis Kegiatan (dropdown)
   - Tempat Kegiatan (dropdown sekolah)
   - Deskripsi
   - Upload foto (opsional)
3. **Klik "Simpan Tugas"**
4. **Hasil**: ✅ Data tersimpan tanpa error!

## 🔍 TROUBLESHOOTING

### Jika masih ada error:
1. **Refresh browser** (Ctrl+F5)
2. **Clear cache** browser
3. **Restart development server** (jika localhost)

### Jika SQL error:
1. Pastikan menggunakan **public schema**: `public.tasks`
2. Pastikan memiliki **permission** untuk ALTER TABLE
3. Coba jalankan **satu per satu** bagian script

## 📊 MONITORING

### Cek apakah kolom berhasil ditambahkan:
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'tasks' 
AND table_schema = 'public'
ORDER BY ordinal_position;
```

### Cek data sample:
```sql
SELECT id, title, school_name, activity_type, school_id
FROM public.tasks 
ORDER BY created_at DESC 
LIMIT 5;
```

## 🎯 KESIMPULAN

**SEBELUM FIX:**
- ❌ Error: "Could not find the 'school_name' column"
- ❌ Frontend tidak bisa menyimpan data
- ❌ Schema mismatch antara frontend-backend

**SESUDAH FIX:**
- ✅ Kolom school_name, activity_type, school_id, photo2 ada
- ✅ Frontend bisa menyimpan data tanpa error
- ✅ Schema frontend-backend sinkron
- ✅ Data existing tetap aman
- ✅ Performa ditingkatkan dengan index

**SOLUSI INI MENYELESAIKAN MASALAH DARI AKAR (DATABASE) BUKAN HANYA WORKAROUND!**

---

## 📁 FILES TERKAIT

- `FIX_SCHEMA_MISMATCH_SUPABASE_FINAL.sql` - SQL script utama
- `ADD_MISSING_COLUMNS_TASKS_TABLE.sql` - SQL script alternatif
- `EMERGENCY_FIX_TUGAS_HARIAN_SEKARANG.js` - Workaround sementara (tidak diperlukan lagi)

**Status**: ✅ **PERMANENT SOLUTION** - Menyelesaikan masalah secara permanen