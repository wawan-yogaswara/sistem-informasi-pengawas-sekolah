# INSTRUKSI UPDATE FITUR BARU

## Fitur yang Ditambahkan

### 1. Halaman Tugas Tambahan (Additional Tasks)
- ✅ **Tempat Kegiatan** - Field input untuk lokasi kegiatan
- ✅ **Penyelenggara Kegiatan** - Field input untuk penyelenggara
- ✅ **Upload Foto Tambahan** - Mendukung hingga 2 foto per kegiatan
- ✅ **Tombol Edit** - Untuk mengedit kegiatan yang sudah ada
- ✅ **Tombol Cetak** - Untuk mencetak laporan kegiatan dalam format PDF

### 2. Daftar Tugas (Tugas Harian)
- ✅ **Jenis Kegiatan** - Dropdown dengan pilihan: Perencanaan, Pendampingan, Pelaporan
- ✅ **Tempat Kegiatan** - Dropdown sekolah binaan
- ✅ **Upload Foto** - Satu foto per tugas

## Langkah-langkah Update

### Step 1: Update Database Schema
1. Buka Supabase Dashboard: https://supabase.com/dashboard
2. Pilih project Anda
3. Klik "SQL Editor" di sidebar kiri
4. Copy dan paste isi file `update-database-schema-enhanced.sql`
5. Klik "Run" untuk menjalankan SQL

### Step 2: Restart Development Server
```bash
# Stop server jika sedang berjalan (Ctrl+C)
# Kemudian restart
npm run dev
```

### Step 3: Test Fitur Baru

#### Test Tugas Tambahan:
1. Buka halaman "Kegiatan Tambahan"
2. Klik "Tambah Kegiatan"
3. Isi semua field baru:
   - Tempat Kegiatan
   - Penyelenggara Kegiatan
   - Pilih sekolah dari dropdown
   - Upload hingga 2 foto
4. Simpan dan verifikasi data tersimpan
5. Test tombol Edit dan Cetak

#### Test Tugas Harian:
1. Buka halaman "Tugas Harian"
2. Klik "Tambah Tugas"
3. Isi field baru:
   - Pilih Jenis Kegiatan (Perencanaan/Pendampingan/Pelaporan)
   - Pilih Tempat Kegiatan (Sekolah Binaan)
   - Upload foto
4. Simpan dan verifikasi data tersimpan

## Verifikasi Database

Jalankan query ini di Supabase SQL Editor untuk memastikan kolom baru sudah ada:

```sql
-- Cek kolom baru di additional_tasks
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'additional_tasks' 
AND column_name IN ('location', 'organizer', 'photo2');

-- Cek kolom baru di tasks
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'tasks' 
AND column_name IN ('activity_type', 'school_id');
```

## Troubleshooting

### Jika ada error saat update database:
1. Pastikan koneksi ke Supabase stabil
2. Cek apakah tabel sudah ada dengan nama yang benar
3. Jalankan SQL satu per satu jika ada error

### Jika dropdown sekolah kosong:
1. Pastikan ada data sekolah di tabel `schools`
2. Cek di halaman "Sekolah Binaan" dan tambahkan sekolah jika belum ada

### Jika upload foto tidak berfungsi:
1. Pastikan file gambar berukuran < 5MB
2. Pastikan format file adalah JPG/PNG
3. Cek console browser untuk error

## Fitur Cetak PDF

Tombol cetak akan membuka window baru dengan format laporan yang bisa dicetak atau disimpan sebagai PDF. Format laporan mencakup:
- Header dengan judul kegiatan
- Informasi lengkap kegiatan
- Foto-foto yang diupload
- Format yang siap cetak

## Status Update

✅ Database schema updated
✅ Additional Tasks page enhanced
✅ Tasks page enhanced  
✅ Photo upload functionality
✅ Edit functionality
✅ Print functionality
✅ School dropdown integration

Semua fitur sudah siap digunakan!