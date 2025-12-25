# SOLUSI SEDERHANA: Data Laporan Tidak Sinkron

## Masalah
Halaman laporan isinya belum sama dengan data yang diinput di halaman tugas harian, supervisi dan tugas tambahan.

## Penyebab Utama
1. **Field mapping salah** - Reports page menggunakan `photo1` tapi database pakai `photo`
2. **Cache lama** - Data tersimpan di localStorage cache
3. **API endpoint berbeda** - Setiap halaman pakai API yang berbeda

## Solusi Cepat

### 1. Buka Browser Console di Halaman Reports
Tekan F12, lalu jalankan:

```javascript
// Hapus cache lama
localStorage.removeItem('reports_activities_cache');

// Test API endpoints
fetch('/api/tasks-daily?user_id=421cdb28-f2af-4f1f-aa5f-c59a3d661a2e').then(r=>r.json()).then(console.log);
fetch('/api/supervisions?user_id=421cdb28-f2af-4f1f-aa5f-c59a3d661a2e').then(r=>r.json()).then(console.log);
fetch('/api/activities?user_id=421cdb28-f2af-4f1f-aa5f-c59a3d661a2e').then(r=>r.json()).then(console.log);

// Refresh halaman
location.reload();
```

### 2. Jika Masih Belum Sinkron
1. Restart server: `npm run dev`
2. Hard refresh browser: Ctrl+Shift+R
3. Cek apakah data tersimpan di Supabase dashboard

### 3. Verifikasi Data
- Buka Supabase dashboard
- Cek tabel: `tasks`, `supervisions`, `additional_tasks`
- Pastikan `user_id` = `421cdb28-f2af-4f1f-aa5f-c59a3d661a2e`

## Yang Sudah Diperbaiki
✅ Field mapping foto di reports.tsx
✅ User ID consistency untuk user wawan
✅ API endpoint error handling

## Test Langsung
1. Input data baru di halaman Tugas Harian
2. Langsung cek di halaman Reports
3. Jika tidak muncul, jalankan console script di atas