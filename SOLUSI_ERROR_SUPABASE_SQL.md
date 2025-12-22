# 🚨 SOLUSI ERROR SUPABASE SQL

## Masalah yang Terjadi
Error: `column "school_name" does not exist`

## Penyebab
Query di Supabase SQL Editor menggunakan nama kolom yang salah. Nama kolom yang benar adalah `name`, bukan `school_name`.

## Solusi Langsung

### 1. Hapus Data Dummy Terlebih Dahulu
Copy dan paste script ini ke Supabase SQL Editor:

```sql
-- Hapus semua data dummy
DELETE FROM additional_tasks;
DELETE FROM supervisions;
DELETE FROM tasks;
DELETE FROM events;
DELETE FROM schools;
DELETE FROM users;

-- Verifikasi
SELECT 'users' as table_name, COUNT(*) as remaining FROM users
UNION ALL
SELECT 'schools' as table_name, COUNT(*) as remaining FROM schools
UNION ALL
SELECT 'tasks' as table_name, COUNT(*) as remaining FROM tasks
UNION ALL
SELECT 'supervisions' as table_name, COUNT(*) as remaining FROM supervisions
UNION ALL
SELECT 'additional_tasks' as table_name, COUNT(*) as remaining FROM additional_tasks;
```

### 2. Jalankan Migrasi Data Real
Setelah data dummy terhapus, copy dan paste script dari file `FIX_SUPABASE_MIGRATION_SIMPLE.sql`

## Struktur Tabel yang Benar
- Tabel `schools` memiliki kolom `name` (bukan `school_name`)
- Tabel `users` memiliki kolom `username` dan `full_name`
- Semua tabel menggunakan UUID sebagai primary key

## Langkah-Langkah
1. ✅ Buka Supabase Dashboard
2. ✅ Masuk ke SQL Editor
3. ✅ Jalankan script penghapusan data dummy
4. ✅ Jalankan script migrasi data real
5. ✅ Verifikasi data berhasil diimport

## Tips
- Selalu gunakan nama kolom yang benar sesuai schema
- Periksa struktur tabel di Table Editor jika ragu
- Jalankan query SELECT terlebih dahulu untuk memastikan syntax benar

✅ **Setelah mengikuti langkah ini, data real akan berhasil diimport ke Supabase!**