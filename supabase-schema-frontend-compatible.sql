-- Schema Supabase yang sesuai dengan Frontend
-- Hapus semua tabel yang ada dan buat ulang dengan struktur yang benar

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS additional_tasks CASCADE;
DROP TABLE IF EXISTS supervisions CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS schools CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop existing enums if they exist
DROP TYPE IF EXISTS role CASCADE;
DROP TYPE IF EXISTS task_category CASCADE;
DROP TYPE IF EXISTS supervision_type CASCADE;

-- Create enums
CREATE TYPE role AS ENUM ('admin', 'pengawas');
CREATE TYPE task_category AS ENUM ('Perencanaan', 'Pendampingan', 'Pelaporan');
CREATE TYPE supervision_type AS ENUM ('Akademik', 'Manajerial');

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role role NOT NULL DEFAULT 'pengawas',
    nip TEXT,
    rank TEXT, -- Pangkat/Golongan/Ruang
    office_name TEXT, -- Nama Kantor
    office_address TEXT, -- Alamat Kantor
    home_address TEXT, -- Alamat Rumah
    phone TEXT, -- Nomor Telepon
    photo_url TEXT, -- Foto Profil
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Schools table
CREATE TABLE schools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    contact TEXT NOT NULL,
    principal_name TEXT,
    principal_nip TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Tasks table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category task_category NOT NULL,
    description TEXT,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    photo1 TEXT,
    photo2 TEXT,
    date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Events table
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    school_id UUID REFERENCES schools(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    time TEXT NOT NULL,
    description TEXT,
    reminded BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Supervisions table
CREATE TABLE supervisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    type supervision_type NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    teacher_name TEXT,
    teacher_nip TEXT,
    findings TEXT NOT NULL,
    recommendations TEXT,
    photo1 TEXT,
    photo2 TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Additional Tasks table - SESUAI DENGAN FRONTEND
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

-- Create indexes for better performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_schools_user_id ON schools(user_id);
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_supervisions_user_id ON supervisions(user_id);
CREATE INDEX idx_additional_tasks_user_id ON additional_tasks(user_id);
CREATE INDEX idx_additional_tasks_date ON additional_tasks(date);

-- Insert default admin user
INSERT INTO users (username, password, full_name, role) VALUES 
('admin', '$2b$10$K7L1OJ45/4Y2nIvL0DXbu.b7Q5Qr4WzO.BhHb9gYRt5h8K9L0DXbu', 'Administrator', 'admin'),
('wawan', '$2b$10$K7L1OJ45/4Y2nIvL0DXbu.b7Q5Qr4WzO.BhHb9gYRt5h8K9L0DXbu', 'Wawan Pengawas', 'pengawas')
ON CONFLICT (username) DO NOTHING;

-- Insert sample school for testing
INSERT INTO schools (user_id, name, address, contact, principal_name) 
SELECT u.id, 'SMK Negeri 1 Garut', 'Jl. Raya Garut No. 1', '0262-123456', 'Drs. Budi Santoso'
FROM users u WHERE u.username = 'wawan'
ON CONFLICT DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE supervisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE additional_tasks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid()::text = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid()::text = id);

-- For now, allow all operations (you can restrict later)
CREATE POLICY "Allow all operations" ON schools FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON tasks FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON events FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON supervisions FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON additional_tasks FOR ALL USING (true);

-- Grant permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated;