# SOLUSI FOTO APEL PAGI DAN MONITORING BPMU TIDAK MUNCUL

## STATUS: 🔧 DALAM PERBAIKAN

## MASALAH YANG DILAPORKAN
- Foto untuk kegiatan "Apel Pagi" tidak muncul di halaman reports
- Foto untuk kegiatan "Monitoring BPMU" tidak muncul di halaman reports
- PDF laporan sudah dikembalikan ke semula (dengan persentase)

## ANALISIS MASALAH

### 1. Kemungkinan Penyebab
- **Field mapping salah**: Data di localStorage menggunakan `photo1`/`photo2`, tapi di Supabase mungkin berbeda
- **Path foto salah**: Foto tersimpan sebagai filename saja, bukan full path
- **Data tidak ter-migrasi**: Foto tidak ter-upload ke Supabase dengan benar
- **Format foto berbeda**: Base64 vs file path vs URL

### 2. Struktur Data
- **LocalStorage**: `photo1`, `photo2` (filename atau base64)
- **Supabase**: `photo`, `photo1`, `photo2` (path atau base64)
- **Reports.tsx mapping**: 
  ```javascript
  photo1: task.photo || task.photo1
  photo2: task.photo2
  ```

## LANGKAH PERBAIKAN

### 1. Diagnosa Masalah
Jalankan script diagnosa untuk mengidentifikasi masalah:
```javascript
// Copy paste ke browser console
// File: DIAGNOSA_FOTO_APEL_PAGI_MONITORING_BPMU.js
```

### 2. Cek Struktur Database
Periksa struktur tabel additional_tasks di Supabase:
```javascript
// Copy paste ke browser console  
// File: CEK_STRUKTUR_FOTO_ADDITIONAL_TASKS.js
```

### 3. Perbaiki Data di Supabase
Perbaiki data yang tidak memiliki foto:
```javascript
// Copy paste ke browser console
// File: FIX_FOTO_APEL_PAGI_MONITORING_BPMU.js
```

### 4. Perbaiki Path Foto di Reports
Perbaiki path foto yang salah di halaman reports:
```javascript
// Copy paste ke browser console (di halaman reports)
// File: FIX_PATH_FOTO_REPORTS.js
```

## PERBAIKAN YANG SUDAH DILAKUKAN

### 1. ✅ PDF Dikembalikan ke Semula
- Persentase kualitas dikembalikan ke tampilan PDF
- Skor kualitas keseluruhan ditampilkan kembali
- Progress bar tetap berfungsi

### 2. 🔧 Script Diagnosa dan Perbaikan
- Script untuk diagnosa masalah foto
- Script untuk cek struktur database
- Script untuk perbaiki data di Supabase
- Script untuk perbaiki path foto di reports

## CARA MENGGUNAKAN

### 1. Buka Halaman Reports
- Login sebagai user yang memiliki data "Apel Pagi" dan "Monitoring BPMU"
- Buka halaman Reports

### 2. Jalankan Diagnosa
- Buka Developer Console (F12)
- Copy paste script `DIAGNOSA_FOTO_APEL_PAGI_MONITORING_BPMU.js`
- Lihat hasil diagnosa

### 3. Jalankan Perbaikan
- Copy paste script `FIX_FOTO_APEL_PAGI_MONITORING_BPMU.js`
- Copy paste script `FIX_PATH_FOTO_REPORTS.js`
- Refresh halaman reports

### 4. Verifikasi Hasil
- Cek apakah foto sekarang muncul di halaman reports
- Test export PDF untuk memastikan foto muncul di PDF

## KEMUNGKINAN SOLUSI LAIN

### 1. Manual Upload Ulang
Jika script tidak berhasil, upload ulang foto secara manual:
- Buka halaman input Tugas Tambahan
- Edit kegiatan "Apel Pagi" dan "Monitoring BPMU"
- Upload ulang foto yang hilang

### 2. Migrasi Ulang Data
Jika data tidak ada di Supabase:
- Jalankan script migrasi ulang dari localStorage ke Supabase
- Pastikan foto ter-upload dengan benar

### 3. Cek Server Upload
Pastikan server dapat mengakses folder uploads:
- Cek apakah file foto ada di folder `uploads/`
- Cek permission folder uploads
- Cek konfigurasi server untuk serve static files

## MONITORING

### Indikator Berhasil
- ✅ Foto "Apel Pagi" muncul di halaman reports
- ✅ Foto "Monitoring BPMU" muncul di halaman reports  
- ✅ Foto muncul di PDF export
- ✅ Tidak ada broken image di console

### Indikator Masih Bermasalah
- ❌ Foto masih tidak muncul setelah refresh
- ❌ Console menunjukkan error 404 untuk foto
- ❌ PDF export tidak menampilkan foto
- ❌ Broken image di halaman reports

## CATATAN TEKNIS

### Field Mapping di Reports.tsx
```javascript
// Current mapping
photo1: task.photo || task.photo1, // Try 'photo' first, then 'photo1'
photo2: task.photo2

// Mungkin perlu ditambah fallback
photo1: task.photo || task.photo1 || task.image1,
photo2: task.photo2 || task.image2
```

### Path Foto yang Benar
- Base64: `data:image/jpeg;base64,/9j/4AAQ...`
- File path: `/uploads/filename.jpg`
- Full URL: `http://localhost:5000/uploads/filename.jpg`

### Debugging Console Commands
```javascript
// Cek activities di memory
console.log(window.allActivities);

// Cek foto di DOM
document.querySelectorAll('img[src*="data:"], img[src*="/uploads/"]');

// Cek broken images
Array.from(document.querySelectorAll('img')).filter(img => img.naturalWidth === 0 && img.complete);
```