-- Schema Sederhana untuk Sistem Informasi Pengawas Sekolah
-- Copy dan paste ke Supabase SQL Editor

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