# Cara Perbaiki Struktur Supabase Manual

## Masalah
- Struktur tabel hasil migrasi dari Neon tidak sesuai dengan frontend
- Field `additional_tasks` menggunakan `name` tapi frontend mengharapkan `title`
- Field `date` format tidak sesuai
- Missing field `status` yang dibutuhkan frontend

## Langkah Perbaikan

### 1. Buka Supabase Dashboard
- Login ke https://supabase.com
- Pilih project Anda
- Masuk ke **SQL Editor**

### 2. Hapus Data Migrasi Lama
Jalankan SQL ini untuk hapus data lama:

```sql
-- Hapus semua data dari tabel yang bermasalah
DELETE FROM additional_tasks;
DELETE FROM supervisions;
DELETE FROM events;
DELETE FROM tasks;
DELETE FROM schools;
DELETE FROM users WHERE username NOT IN ('admin', 'wawan');
```

### 3. Perbaiki Struktur Tabel additional_tasks
```sql
-- Drop dan recreate tabel additional_tasks dengan struktur yang benar
DROP TABLE IF EXISTS additional_tasks CASCADE;

CREATE TABLE additional_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    school_id UUID REFERENCES schools(id) ON DELETE SET NULL,
    title TEXT NOT NULL, -- Frontend menggunakan 'title', bukan 'name'
    description TEXT NOT NULL,
    date DATE NOT NULL, -- Frontend mengirim date sebagai string YYYY-MM-DD
    status TEXT DEFAULT 'pending', -- Frontend menggunakan status
    photo TEXT, -- Frontend menggunakan 'photo' untuk foto utama
    photo2 TEXT, -- Foto kedua
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create index
CREATE INDEX idx_additional_tasks_user_id ON additional_tasks(user_id);
CREATE INDEX idx_additional_tasks_date ON additional_tasks(date);
```

### 4. Pastikan Users dan Schools Ada
```sql
-- Insert users jika belum ada
INSERT INTO users (username, password, full_name, role) VALUES 
('admin', '$2b$10$K7L1OJ45/4Y2nIvL0DXbu.b7Q5Qr4WzO.BhHb9gYRt5h8K9L0DXbu', 'Administrator', 'admin'),
('wawan', '$2b$10$K7L1OJ45/4Y2nIvL0DXbu.b7Q5Qr4WzO.BhHb9gYRt5h8K9L0DXbu', 'Wawan Pengawas', 'pengawas')
ON CONFLICT (username) DO NOTHING;

-- Insert sample school
INSERT INTO schools (user_id, name, address, contact, principal_name) 
SELECT u.id, 'SMK Negeri 1 Garut', 'Jl. Raya Garut No. 1', '0262-123456', 'Drs. Budi Santoso'
FROM users u WHERE u.username = 'wawan'
ON CONFLICT DO NOTHING;
```

### 5. Set RLS Policies
```sql
-- Enable RLS
ALTER TABLE additional_tasks ENABLE ROW LEVEL SECURITY;

-- Create policy yang permissive untuk testing
CREATE POLICY "Allow all operations" ON additional_tasks FOR ALL USING (true);

-- Grant permissions
GRANT ALL ON additional_tasks TO postgres, anon, authenticated;
```

### 6. Test Insert Manual
```sql
-- Test insert data manual
INSERT INTO additional_tasks (user_id, title, description, date, status) 
SELECT u.id, 'Test Kegiatan Manual', 'Test deskripsi manual', '2025-01-15', 'pending'
FROM users u WHERE u.username = 'wawan';

-- Cek data berhasil masuk
SELECT * FROM additional_tasks;
```

## Setelah Schema Diperbaiki

### 1. Restart Server
```bash
# Stop server yang sedang berjalan
# Kemudian start ulang
npm run dev
```

### 2. Clear Browser Cache
- Tekan Ctrl+Shift+R untuk hard refresh
- Atau clear localStorage:
```javascript
localStorage.clear();
```

### 3. Login Ulang
- Login dengan username: `wawan`, password: `wawan123`
- Atau username: `admin`, password: `admin123`

### 4. Test Input Data
- Masuk ke halaman "Kegiatan Tambahan"
- Klik "Tambah Kegiatan"
- Isi form dan simpan
- Data seharusnya muncul di halaman dan tersimpan di Supabase

## Verifikasi
Cek di Supabase Dashboard > Table Editor > additional_tasks untuk memastikan data masuk dengan benar.

## Jika Masih Bermasalah
1. Cek console browser untuk error messages
2. Cek Network tab untuk melihat API calls
3. Pastikan environment variables Supabase sudah benar di `.env`