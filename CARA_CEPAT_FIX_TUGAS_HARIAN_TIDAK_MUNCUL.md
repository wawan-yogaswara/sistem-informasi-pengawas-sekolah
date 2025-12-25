# Cara Cepat Fix Tugas Harian Tidak Muncul

## Masalah
- Halaman Tugas Harian kosong/tidak muncul data
- Error "TypeError: Failed to fetch" di console browser
- Data tidak tersimpan ke Supabase

## Solusi Cepat

### 1. Jalankan SQL Fix di Supabase
1. Buka [Supabase Dashboard](https://supabase.com/dashboard)
2. Pilih project Anda
3. Klik **SQL Editor** di sidebar kiri
4. Copy paste SQL dari file `fix-rls-tasks-emergency.sql`
5. Klik **Run** untuk menjalankan

### 2. Refresh Aplikasi
1. Tutup browser/tab aplikasi
2. Buka kembali aplikasi
3. Login ulang jika perlu
4. Cek halaman Tugas Harian

### 3. Jika Masih Bermasalah

#### Cek Koneksi Supabase
```javascript
// Jalankan di Console Browser (F12)
console.log('SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY);
```

#### Restart Server
```bash
# Stop server
Ctrl + C

# Start ulang
npm run dev
```

#### Cek File .env
Pastikan file `.env` berisi:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Test Input Data Baru
1. Klik tombol "Tambah Tugas"
2. Isi form dengan data test
3. Klik Simpan
4. Cek apakah data muncul di list

## Jika Masih Error

### Cek di Supabase Dashboard
1. Buka **Table Editor** > **tasks**
2. Lihat apakah ada data di tabel
3. Jika kosong, berarti masalah di input data
4. Jika ada data, berarti masalah di RLS policies

### Matikan RLS Sementara
```sql
-- Jalankan di SQL Editor Supabase
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
```

### Aktifkan Kembali dengan Policy Sederhana
```sql
-- Setelah masalah teratasi
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "izinkan_semua" ON tasks FOR ALL USING (true);
```

## Catatan Penting
- Solusi ini bersifat sementara untuk debugging
- Setelah aplikasi berjalan normal, sebaiknya gunakan RLS policy yang lebih aman
- Backup data sebelum menjalankan SQL fix

## Kontak
Jika masih bermasalah, screenshot error dan kirim ke developer.