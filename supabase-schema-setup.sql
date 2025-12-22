-- Schema Database untuk School Guard Manager
-- Jalankan di Supabase SQL Editor: https://supabase.com/dashboard/project/fmxeboullgcewzjpql/sql

-- Hapus tabel jika sudah ada (opsional)
-- DROP TABLE IF EXISTS additional_tasks CASCADE;
-- DROP TABLE IF EXISTS supervisions CASCADE;
-- DROP TABLE IF EXISTS tasks CASCADE;
-- DROP TABLE IF EXISTS schools CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;

-- Buat tabel users
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  name VARCHAR(100) NOT NULL,
  nip VARCHAR(50),
  position VARCHAR(100),
  photo TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Buat tabel schools
CREATE TABLE IF NOT EXISTS schools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  address TEXT,
  principal VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Buat tabel tasks
CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  photo TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Buat tabel supervisions
CREATE TABLE IF NOT EXISTS supervisions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  type VARCHAR(20) DEFAULT 'academic' CHECK (type IN ('academic', 'managerial')),
  date DATE NOT NULL,
  findings TEXT,
  recommendations TEXT,
  photo TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Buat tabel additional_tasks
CREATE TABLE IF NOT EXISTS additional_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  photo TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE supervisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE additional_tasks ENABLE ROW LEVEL SECURITY;

-- Buat policies (permisif untuk development)
DROP POLICY IF EXISTS "Allow all operations on users" ON users;
CREATE POLICY "Allow all operations on users" ON users FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all operations on schools" ON schools;
CREATE POLICY "Allow all operations on schools" ON schools FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all operations on tasks" ON tasks;
CREATE POLICY "Allow all operations on tasks" ON tasks FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all operations on supervisions" ON supervisions;
CREATE POLICY "Allow all operations on supervisions" ON supervisions FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all operations on additional_tasks" ON additional_tasks;
CREATE POLICY "Allow all operations on additional_tasks" ON additional_tasks FOR ALL USING (true);

-- Insert sample data
INSERT INTO users (id, username, password, role, name, nip, position) VALUES
('admin-uuid-1234-5678-9012-123456789012', 'admin', '$2b$10$rQZ9QmjQZ9QmjQZ9QmjQZO', 'admin', 'Administrator', '123456789', 'Administrator Sistem'),
('user-uuid-1234-5678-9012-123456789012', 'wawan', '$2b$10$rQZ9QmjQZ9QmjQZ9QmjQZO', 'user', 'Wawan Setiawan', '987654321', 'Pengawas Sekolah')
ON CONFLICT (username) DO NOTHING;

INSERT INTO schools (id, name, address, principal, phone, email) VALUES
('school-uuid-1234-5678-9012-123456789001', 'SDN 1 Garut', 'Jl. Raya Garut No. 1', 'Drs. Ahmad Suryadi', '0262-123456', 'sdn1garut@email.com'),
('school-uuid-1234-5678-9012-123456789002', 'SDN 2 Garut', 'Jl. Raya Garut No. 2', 'Dra. Siti Nurhaliza', '0262-123457', 'sdn2garut@email.com'),
('school-uuid-1234-5678-9012-123456789003', 'SMPN 1 Garut', 'Jl. Pendidikan No. 1', 'Dr. Budi Santoso', '0262-123458', 'smpn1garut@email.com')
ON CONFLICT (id) DO NOTHING;

-- Verifikasi setup
SELECT 'Setup completed successfully!' as status;
SELECT 'users' as table_name, count(*) as record_count FROM users
UNION ALL
SELECT 'schools' as table_name, count(*) as record_count FROM schools;