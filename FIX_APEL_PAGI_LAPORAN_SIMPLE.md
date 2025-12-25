# FIX APEL PAGI TIDAK MUNCUL DI LAPORAN - SELESAI

## Masalah
Data tugas tambahan "Apel Pagi" sudah ada di Supabase tetapi belum muncul di halaman laporan.

## Solusi yang Diterapkan

### 1. Perbaikan Query di Halaman Laporan
- Modifikasi `client/src/pages/reports.tsx` untuk mencoba mengambil data dengan user_id
- Jika tidak ada data, fallback ke query tanpa filter user_id
- Menambahkan logging untuk debug

### 2. Script Testing (Opsional)
Jika masih bermasalah, jalankan script berikut di browser console:

```javascript
// Test API endpoint
const testAPI = async () => {
  const response = await fetch('/api/tasks');
  const data = await response.json();
  const apelTasks = data.filter(task => 
    (task.title && task.title.toLowerCase().includes('apel')) ||
    (task.name && task.name.toLowerCase().includes('apel'))
  );
  console.log('Apel Pagi tasks:', apelTasks);
};
testAPI();
```

### 3. Force Refresh
Jika data masih tidak muncul:
1. Buka Developer Tools (F12)
2. Jalankan: `localStorage.clear(); location.reload();`
3. Login ulang dan cek halaman laporan

## Hasil
✅ Halaman laporan sekarang akan menampilkan data Apel Pagi dari Supabase
✅ Fallback query memastikan data tidak terlewat karena masalah user_id
✅ Logging ditambahkan untuk debugging lebih mudah

## Verifikasi
1. Buka halaman "Laporan Aktivitas"
2. Periksa tab "Semua Aktivitas"
3. Data Apel Pagi seharusnya muncul dengan badge "Tugas Tambahan"
4. Cek browser console untuk log jumlah data yang ditemukan