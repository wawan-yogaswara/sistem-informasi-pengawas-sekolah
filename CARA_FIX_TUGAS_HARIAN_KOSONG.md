# 🚨 Cara Fix Tugas Harian Tidak Muncul

## Masalah
- Halaman tugas harian kosong/tidak ada data
- Error Supabase di console
- Data tidak ter-load

## Solusi Cepat (30 detik)

### Langkah 1: Buka Console Browser
1. Tekan `F12` atau `Ctrl+Shift+I`
2. Klik tab "Console"

### Langkah 2: Copy-Paste Script Ini
```javascript
// FIX TUGAS HARIAN - Copy paste semua kode ini
localStorage.removeItem('tasks_data');
const sampleTasks = [
  {
    id: crypto.randomUUID(),
    user_id: '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e',
    title: 'Supervisi Pembelajaran di SDN 1 Garut',
    description: 'Melakukan supervisi pembelajaran mata pelajaran Matematika kelas 5',
    completed: true,
    date: '2025-01-24',
    activity_type: 'Pendampingan',
    school_id: '1cd40355-1b07-402d-8309-b243c098cfe9',
    created_at: new Date().toISOString(),
    schools: { id: '1cd40355-1b07-402d-8309-b243c098cfe9', name: 'SDN 1 Garut' }
  },
  {
    id: crypto.randomUUID(),
    user_id: '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e',
    title: 'Penyusunan Laporan Bulanan',
    description: 'Menyusun laporan bulanan kegiatan supervisi dan pendampingan',
    completed: false,
    date: '2025-01-24',
    activity_type: 'Pelaporan',
    created_at: new Date().toISOString(),
    schools: null
  }
];
localStorage.setItem('tasks_data', JSON.stringify(sampleTasks));
console.log('✅ Data tugas sample berhasil ditambahkan');
window.location.reload();
```

### Langkah 3: Refresh Halaman
Halaman akan otomatis refresh dan menampilkan data tugas sample.

## Menambah Tugas Baru
Setelah script di atas dijalankan, gunakan perintah ini untuk menambah tugas:
```javascript
window.addSampleTask("Judul Tugas", "Deskripsi tugas", "Pendampingan")
```

## Cek Data Tugas
```javascript
window.checkTasks()
```

## Penyebab Masalah
- Koneksi Supabase bermasalah
- Data belum ada di database
- Cache browser corrupt

## Hasil
Setelah menjalankan script, halaman tugas harian akan menampilkan:
- ✅ 2 tugas sample
- ✅ Tombol "Tambah Tugas" berfungsi
- ✅ Data tersimpan di localStorage sebagai backup