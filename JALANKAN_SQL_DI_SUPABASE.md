# CARA MENJALANKAN SQL DI SUPABASE DASHBOARD

## Langkah-langkah:

1. **Buka Supabase Dashboard**
   - Pergi ke: https://supabase.com/dashboard/project/glhaliktsrcvnznbgxqt/sql

2. **Copy SQL dari file supabase-schema-new-clean.sql**
   - Buka file `supabase-schema-new-clean.sql`
   - Copy semua isi file

3. **Paste dan Jalankan di SQL Editor**
   - Paste SQL ke SQL Editor di Supabase
   - Klik tombol "Run" untuk menjalankan

4. **Verifikasi Hasil**
   - Cek di tab "Table Editor" apakah tabel sudah terbuat
   - Pastikan ada tabel: users, schools, tasks, supervisions, additional_tasks

## SQL yang akan dijalankan:

```sql
-- STRUKTUR TABEL BARU SUPABASE YANG SESUAI FRONTEND
-- Hapus semua tabel lama dan buat ulang dengan struktur yang benar

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- HAPUS SEMUA TABEL LAMA
DROP TABLE IF EXISTS additional_tasks CASCADE;
DROP TABLE IF EXISTS supervisions CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS schools CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop existing enums if they exist
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS task_status CASCADE;
DROP TYPE IF EXISTS supervision_type CASCADE;

-- BUAT ENUMS BARU
CREATE TYPE user_role AS ENUM ('admin', 'user', 'pengawas');
CREATE TYPE task_status AS ENUM ('pending', 'completed', 'in_progress');
CREATE TYPE supervision_type AS ENUM ('academic', 'managerial', 'Akademik', 'Manajerial');

-- TABEL USERS - SESUAI FRONTEND
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role user_role DEFAULT 'user',
    nip VARCHAR(50),
    position VARCHAR(100),
    photo TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABEL SCHOOLS - SESUAI FRONTEND
CREATE TABLE schools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    address TEXT,
    principal VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABEL TASKS - SESUAI FRONTEND
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    photo TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABEL SUPERVISIONS - SESUAI FRONTEND
CREATE TABLE supervisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    type supervision_type DEFAULT 'academic',
    date DATE NOT NULL,
    findings TEXT,
    recommendations TEXT,
    photo TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABEL ADDITIONAL_TASKS - SESUAI FRONTEND
CREATE TABLE additional_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    school_id UUID REFERENCES schools(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    status task_status DEFAULT 'pending',
    photo TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CREATE INDEXES UNTUK PERFORMANCE
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_date ON tasks(date);
CREATE INDEX idx_supervisions_user_id ON supervisions(user_id);
CREATE INDEX idx_supervisions_school_id ON supervisions(school_id);
CREATE INDEX idx_supervisions_date ON supervisions(date);
CREATE INDEX idx_additional_tasks_user_id ON additional_tasks(user_id);
CREATE INDEX idx_additional_tasks_school_id ON additional_tasks(school_id);
CREATE INDEX idx_additional_tasks_date ON additional_tasks(date);

-- INSERT DATA SAMPLE
INSERT INTO users (username, password, name, role, nip, position) VALUES
('admin', '$2b$10$K7L1OJ45/4Y2nIvL0DXbu.b7Q5Qr4WzO.BhHb9gYRt5h8K9L0DXbu', 'Administrator', 'admin', '123456789', 'Administrator Sistem'),
('wawan', '$2b$10$K7L1OJ45/4Y2nIvL0DXbu.b7Q5Qr4WzO.BhHb9gYRt5h8K9L0DXbu', 'Wawan Setiawan', 'user', '987654321', 'Pengawas Sekolah')
ON CONFLICT (username) DO NOTHING;

INSERT INTO schools (name, address, principal, phone, email) VALUES
('SDN 1 Garut', 'Jl. Raya Garut No. 1', 'Drs. Ahmad Suryadi', '0262-123456', 'sdn1garut@email.com'),
('SMPN 2 Garut', 'Jl. Pendidikan No. 2', 'Dra. Siti Nurhalimah', '0262-123457', 'smpn2garut@email.com'),
('SMAN 1 Garut', 'Jl. Merdeka No. 3', 'Dr. Budi Santoso, M.Pd', '0262-123458', 'sman1garut@email.com')
ON CONFLICT DO NOTHING;

-- ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE supervisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE additional_tasks ENABLE ROW LEVEL SECURITY;

-- CREATE RLS POLICIES - AKSES TERBUKA UNTUK DEVELOPMENT
CREATE POLICY "Enable read access for all users" ON users FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON users FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON users FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON schools FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON schools FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON schools FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON schools FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON tasks FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON tasks FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON tasks FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON supervisions FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON supervisions FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON supervisions FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON supervisions FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON additional_tasks FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON additional_tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON additional_tasks FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON additional_tasks FOR DELETE USING (true);

-- GRANT PERMISSIONS
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated;
```

## Setelah SQL berhasil dijalankan:

1. **Test koneksi aplikasi**
   - Jalankan aplikasi dengan `npm run dev`
   - Test login dengan username: admin, password: admin123
   - Test login dengan username: wawan, password: wawan123

2. **Test input data**
   - Coba input data di semua fitur
   - Pastikan data tersimpan dengan benar di Supabase

3. **Verifikasi di Supabase Dashboard**
   - Cek di Table Editor apakah data masuk
   - Pastikan struktur tabel sesuai dengan frontend