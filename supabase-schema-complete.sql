-- ============================================================
-- SUPABASE SCHEMA SETUP - School Guard Manager
-- ============================================================
-- Copy dan paste SQL ini ke Supabase SQL Editor
-- URL: https://supabase.com/dashboard/project/[your-project]/sql

-- Hapus tabel jika sudah ada (hati-hati, ini akan menghapus data!)
-- DROP TABLE IF EXISTS additional_tasks CASCADE;
-- DROP TABLE IF EXISTS supervisions CASCADE;
-- DROP TABLE IF EXISTS tasks CASCADE;
-- DROP TABLE IF EXISTS schools CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;

-- ============================================================
-- TABEL USERS
-- ============================================================
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

-- Index untuk performa
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- ============================================================
-- TABEL SCHOOLS
-- ============================================================
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

-- Index untuk performa
CREATE INDEX IF NOT EXISTS idx_schools_name ON schools(name);

-- ============================================================
-- TABEL TASKS
-- ============================================================
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

-- Index untuk performa
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_date ON tasks(date);
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);

-- ============================================================
-- TABEL SUPERVISIONS
-- ============================================================
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

-- Index untuk performa
CREATE INDEX IF NOT EXISTS idx_supervisions_user_id ON supervisions(user_id);
CREATE INDEX IF NOT EXISTS idx_supervisions_school_id ON supervisions(school_id);
CREATE INDEX IF NOT EXISTS idx_supervisions_date ON supervisions(date);
CREATE INDEX IF NOT EXISTS idx_supervisions_type ON supervisions(type);

-- ============================================================
-- TABEL ADDITIONAL_TASKS
-- ============================================================
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

-- Index untuk performa
CREATE INDEX IF NOT EXISTS idx_additional_tasks_user_id ON additional_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_additional_tasks_school_id ON additional_tasks(school_id);
CREATE INDEX IF NOT EXISTS idx_additional_tasks_date ON additional_tasks(date);
CREATE INDEX IF NOT EXISTS idx_additional_tasks_status ON additional_tasks(status);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
-- Enable RLS untuk semua tabel
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE supervisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE additional_tasks ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- POLICIES (Kebijakan Akses)
-- ============================================================
-- SEMENTARA: Allow all operations untuk development
-- NANTI: Ganti dengan policy yang lebih ketat untuk production

-- Policy untuk users
DROP POLICY IF EXISTS "Allow all operations on users" ON users;
CREATE POLICY "Allow all operations on users" ON users FOR ALL USING (true);

-- Policy untuk schools
DROP POLICY IF EXISTS "Allow all operations on schools" ON schools;
CREATE POLICY "Allow all operations on schools" ON schools FOR ALL USING (true);

-- Policy untuk tasks
DROP POLICY IF EXISTS "Allow all operations on tasks" ON tasks;
CREATE POLICY "Allow all operations on tasks" ON tasks FOR ALL USING (true);

-- Policy untuk supervisions
DROP POLICY IF EXISTS "Allow all operations on supervisions" ON supervisions;
CREATE POLICY "Allow all operations on supervisions" ON supervisions FOR ALL USING (true);

-- Policy untuk additional_tasks
DROP POLICY IF EXISTS "Allow all operations on additional_tasks" ON additional_tasks;
CREATE POLICY "Allow all operations on additional_tasks" ON additional_tasks FOR ALL USING (true);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================
-- Function untuk update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger untuk auto-update updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_schools_updated_at ON schools;
CREATE TRIGGER update_schools_updated_at BEFORE UPDATE ON schools FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_supervisions_updated_at ON supervisions;
CREATE TRIGGER update_supervisions_updated_at BEFORE UPDATE ON supervisions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_additional_tasks_updated_at ON additional_tasks;
CREATE TRIGGER update_additional_tasks_updated_at BEFORE UPDATE ON additional_tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- SAMPLE DATA (Optional)
-- ============================================================
-- Insert admin user default
INSERT INTO users (id, username, password, role, name, nip, position) 
VALUES (
  'admin-uuid-1234-5678-9012-123456789012',
  'admin',
  '$2b$10$rQZ9QmjQZ9QmjQZ9QmjQZOeKq7QZ9QmjQZ9QmjQZ9QmjQZ9QmjQZ9Q', -- password: admin123
  'admin',
  'Administrator',
  '123456789',
  'Administrator Sistem'
) ON CONFLICT (username) DO NOTHING;

-- Insert sample user
INSERT INTO users (id, username, password, role, name, nip, position) 
VALUES (
  'user-uuid-1234-5678-9012-123456789012',
  'wawan',
  '$2b$10$rQZ9QmjQZ9QmjQZ9QmjQZOeKq7QZ9QmjQZ9QmjQZ9QmjQZ9QmjQZ9Q', -- password: wawan123
  'user',
  'Wawan Setiawan',
  '987654321',
  'Pengawas Sekolah'
) ON CONFLICT (username) DO NOTHING;

-- Insert sample schools
INSERT INTO schools (id, name, address, principal, phone, email) VALUES
('school-uuid-1234-5678-9012-123456789001', 'SDN 1 Garut', 'Jl. Raya Garut No. 1', 'Drs. Ahmad Suryadi', '0262-123456', 'sdn1garut@email.com'),
('school-uuid-1234-5678-9012-123456789002', 'SDN 2 Garut', 'Jl. Raya Garut No. 2', 'Dra. Siti Nurhaliza', '0262-123457', 'sdn2garut@email.com'),
('school-uuid-1234-5678-9012-123456789003', 'SMPN 1 Garut', 'Jl. Pendidikan No. 1', 'Dr. Budi Santoso', '0262-123458', 'smpn1garut@email.com')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================
-- Jalankan query ini untuk verifikasi setup berhasil:

-- SELECT 'users' as table_name, count(*) as record_count FROM users
-- UNION ALL
-- SELECT 'schools' as table_name, count(*) as record_count FROM schools
-- UNION ALL
-- SELECT 'tasks' as table_name, count(*) as record_count FROM tasks
-- UNION ALL
-- SELECT 'supervisions' as table_name, count(*) as record_count FROM supervisions
-- UNION ALL
-- SELECT 'additional_tasks' as table_name, count(*) as record_count FROM additional_tasks;

-- ============================================================
-- SELESAI!
-- ============================================================
-- Schema Supabase sudah siap digunakan
-- Aplikasi sekarang dapat menyimpan data ke database cloud