# SOLUSI: Supervisi Tidak Lengkap di Halaman Laporan

## Masalah
- Halaman Supervisi menampilkan 2 kegiatan supervisi
- Halaman Laporan hanya menampilkan 1 kegiatan supervisi

## Kemungkinan Penyebab

### 1. **User ID Mismatch**
- Supervisi mungkin tersimpan dengan `user_id` yang berbeda
- Halaman Supervisi tidak memfilter berdasarkan `user_id`
- Halaman Laporan memfilter berdasarkan `user_id` yang spesifik

### 2. **Field Mapping Issue**
- Supervisi menggunakan field `school` atau `school_name`
- Reports page mencari berdasarkan `school_id` untuk matching dengan tabel schools
- Jika tidak ada `school_id`, data tidak diproses dengan benar

### 3. **API Filtering**
- API `/api/supervisions` memfilter berdasarkan `user_id`
- Jika supervisi memiliki `user_id` yang berbeda, tidak akan muncul

## Langkah Diagnosis

### 1. Jalankan Script Diagnosis
```javascript
// Copy paste ke browser console di halaman Laporan
```

Gunakan file: `CEK_SUPERVISI_SIMPLE.js`

### 2. Cek Data di Supabase Dashboard
- Buka Supabase Dashboard
- Lihat tabel `supervisions`
- Periksa field `user_id` untuk semua record
- Pastikan semua supervisi milik wawan memiliki `user_id` yang sama

## Solusi

### Solusi 1: Fix User ID (Paling Mungkin)
```javascript
// Copy paste ke browser console
```

Gunakan file: `NUCLEAR_FIX_SUPERVISI_LAPORAN.js`

### Solusi 2: Update Reports Page Logic
Jika masalah di field mapping, perlu update kode Reports page untuk handle supervisi tanpa `school_id`.

### Solusi 3: Manual Fix di Supabase
1. Buka Supabase Dashboard
2. Masuk ke tabel `supervisions`
3. Update semua record supervisi milik wawan:
   ```sql
   UPDATE supervisions 
   SET user_id = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e' 
   WHERE user_id IS NULL 
   OR user_id = 'wawan' 
   OR user_id = 'default_user';
   ```

## Cara Test

1. **Sebelum Fix:**
   - Buka halaman Supervisi → catat jumlah supervisi
   - Buka halaman Laporan → catat jumlah supervisi di laporan

2. **Jalankan Fix:**
   - Gunakan salah satu script di atas

3. **Setelah Fix:**
   - Refresh halaman Laporan
   - Pastikan jumlah supervisi sama dengan halaman Supervisi

## Expected Result
- Halaman Supervisi: 2 supervisi
- Halaman Laporan: 2 supervisi (sama)

## Files untuk Diagnosis & Fix
1. `CEK_SUPERVISI_SIMPLE.js` - Diagnosis cepat
2. `DEBUG_SUPERVISI_LAPORAN_MISMATCH.js` - Diagnosis detail
3. `NUCLEAR_FIX_SUPERVISI_LAPORAN.js` - Fix otomatis
4. `FIX_SUPERVISI_LAPORAN_MISMATCH.js` - Fix alternatif