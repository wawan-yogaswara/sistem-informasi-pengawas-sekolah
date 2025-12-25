# Solusi Error "Policy Already Exists"

## Masalah
Error di Supabase SQL Editor: 
```
ERROR: 42710: policy "darurat_izinkan_semua_tasks" for table "tasks" already exists
```

## Penyebab
- Kebijakan RLS dengan nama yang sama sudah ada sebelumnya
- SQL dijalankan berulang kali
- Konflik nama kebijakan

## Solusi Cepat

### 1. Gunakan SQL Fix Versi 2
Jalankan file `fix-rls-tasks-emergency-v2.sql` yang sudah mengatasi masalah ini.

### 2. Atau Jalankan SQL Berikut Secara Bertahap

#### Langkah 1: Hapus Semua Kebijakan Lama
```sql
-- Hapus semua kebijakan yang mungkin ada
DROP POLICY IF EXISTS "darurat_izinkan_semua_tasks" ON tasks;
DROP POLICY IF EXISTS "Allow all operations on tasks" ON tasks;
DROP POLICY IF EXISTS "Users can view own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can insert own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can update own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can delete own tasks" ON tasks;
DROP POLICY IF EXISTS "tasks_policy" ON tasks;
DROP POLICY IF EXISTS "emergency_allow_all_tasks" ON tasks;
```

#### Langkah 2: Matikan RLS
```sql
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
```

#### Langkah 3: Test Akses Data
```sql
SELECT COUNT(*) FROM tasks;
```

#### Langkah 4: Aktifkan RLS dengan Kebijakan Baru
```sql
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tasks_full_access_v2" ON tasks 
FOR ALL 
USING (true) 
WITH CHECK (true);
```

#### Langkah 5: Verifikasi
```sql
SELECT COUNT(*) FROM tasks;
```

### 3. Jika Masih Error

#### Cek Kebijakan yang Ada
```sql
SELECT policyname FROM pg_policies WHERE tablename = 'tasks';
```

#### Hapus Semua Kebijakan Secara Manual
```sql
-- Ganti [nama_policy] dengan nama yang muncul dari query di atas
DROP POLICY IF EXISTS "[nama_policy]" ON tasks;
```

#### Reset RLS Completely
```sql
-- Matikan RLS sepenuhnya (HATI-HATI: Tidak aman untuk production)
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
```

## Cara Mencegah Error Ini

### 1. Selalu Gunakan IF EXISTS
```sql
DROP POLICY IF EXISTS "nama_policy" ON tasks;
```

### 2. Cek Kebijakan Sebelum Membuat
```sql
-- Cek dulu apakah ada
SELECT policyname FROM pg_policies 
WHERE tablename = 'tasks' AND policyname = 'nama_policy';

-- Baru buat jika tidak ada
```

### 3. Gunakan Nama Unik
```sql
-- Tambahkan timestamp atau versi
CREATE POLICY "tasks_policy_v2_20241224" ON tasks FOR ALL USING (true);
```

## Langkah Selanjutnya

1. **Jalankan SQL fix versi 2**
2. **Refresh aplikasi** (Ctrl+F5)
3. **Test input data** di halaman Tugas Harian
4. **Cek apakah data muncul** di list

## Jika Masih Bermasalah

### Cek Konfigurasi Aplikasi
1. File `.env` - pastikan ada `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`
2. Restart server aplikasi
3. Cek console browser (F12) untuk error lain

### Kontak Developer
Screenshot error dan kirim ke developer jika masih bermasalah.

## Catatan Keamanan
- Kebijakan `USING (true)` memungkinkan semua user akses semua data
- Ini hanya untuk debugging/development
- Untuk production, gunakan kebijakan yang lebih ketat berdasarkan user_id