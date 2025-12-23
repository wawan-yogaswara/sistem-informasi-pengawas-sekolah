-- Schema untuk Sistem Informasi Pengawas Sekolah
-- Jalankan di Supabase SQL Editor: https://supabase.com/dashboard/project/glhaliktsrcvnznbgxqt/sql

-- Buat tabel users
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user',
  name VARCHAR(100) NOT NULL,
  nip VARCHAR(50),
  position VARCHAR(100),
  photo TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Buat tabel schools
CREATE TABLE IF NOT EXISTS schools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  address TEXT,
  principal VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Buat tabel tasks
CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  photo TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Buat tabel supervisions
CREATE TABLE IF NOT EXISTS supervisions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  school_id UUID REFERENCES schools(id),
  type VARCHAR(20) DEFAULT 'academic',
  date DATE NOT NULL,
  findings TEXT,
  recommendations TEXT,
  photo TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Buat tabel additional_tasks
CREATE TABLE IF NOT EXISTS additional_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  school_id UUID REFERENCES schools(id),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  photo TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample users
INSERT INTO users (username, password, role, name, nip, position) VALUES
('admin', '$2b$10$rQZ9QmjQZ9QmjQZ9QmjQZOeKq7QZ9QmjQZ9QmjQZ9QmjQZ9QmjQZ9Q', 'admin', 'Administrator', '123456789', 'Administrator Sistem'),
('wawan', '$2b$10$rQZ9QmjQZ9QmjQZ9QmjQZOeKq7QZ9QmjQZ9QmjQZ9QmjQZ9QmjQZ9Q', 'user', 'Wawan Setiawan', '987654321', 'Pengawas Sekolah')
ON CONFLICT (username) DO NOTHING;

-- Insert sample schools
INSERT INTO schools (name, address, principal, phone, email) VALUES
('SDN 1 Garut', 'Jl. Raya Garut No. 1', 'Drs. Ahmad Suryadi', '0262-123456', 'sdn1garut@email.com'),
('SMPN 2 Garut', 'Jl. Pendidikan No. 2', 'Dra. Siti Nurhalimah', '0262-123457', 'smpn2garut@email.com'),
('SMAN 1 Garut', 'Jl. Merdeka No. 3', 'Dr. Budi Santoso, M.Pd', '0262-123458', 'sman1garut@email.com')
ON CONFLICT (name) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE supervisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE additional_tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (sesuaikan dengan kebutuhan keamanan)
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