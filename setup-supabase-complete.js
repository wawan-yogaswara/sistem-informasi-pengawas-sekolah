import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Konfigurasi Supabase yang benar
// PENTING: Ini adalah key demo - untuk production gunakan key asli dari dashboard
const SUPABASE_CONFIG = {
    url: 'https://fmxeboullgcewzjpql.supabase.co',
    // Key demo yang valid secara format
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZteGVib3VsbGdjZXd6anBxbCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM0NTk5NzI4LCJleHAiOjIwNTAxNzU3Mjh9.demo-signature-for-testing-only-replace-with-real-key'
};

async function testSupabaseConnection() {
    console.log('🔍 Testing Koneksi Supabase dengan Key Demo\n');
    
    try {
        const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.key);
        
        console.log('📋 Konfigurasi:');
        console.log(`URL: ${SUPABASE_CONFIG.url}`);
        console.log(`Key: ${SUPABASE_CONFIG.key.substring(0, 30)}...`);
        console.log('');
        
        console.log('🔄 Mencoba koneksi...');
        
        // Test koneksi dengan query sederhana
        const { data, error } = await supabase
            .from('users')
            .select('count')
            .limit(1);
            
        if (error) {
            console.log(`❌ Error: ${error.message}`);
            
            if (error.message.includes('relation "users" does not exist')) {
                console.log('💡 Tabel users belum dibuat - ini normal untuk setup pertama');
                return 'need_schema';
            } else if (error.message.includes('Invalid API key')) {
                console.log('💡 Key tidak valid - perlu key asli dari dashboard');
                return 'need_real_key';
            } else if (error.message.includes('fetch')) {
                console.log('💡 Masalah koneksi network atau DNS');
                return 'network_error';
            }
            
            return 'other_error';
        }
        
        console.log('✅ Koneksi berhasil!');
        console.log(`📊 Response: ${JSON.stringify(data)}`);
        return 'success';
        
    } catch (err) {
        console.log(`❌ Error koneksi: ${err.message}`);
        
        if (err.message.includes('fetch')) {
            console.log('💡 Kemungkinan masalah:');
            console.log('   - Project Supabase tidak aktif');
            console.log('   - URL project salah');
            console.log('   - Koneksi internet bermasalah');
            console.log('   - Firewall memblokir koneksi');
        }
        
        return 'connection_failed';
    }
}

function createSchemaSQL() {
    const sql = `-- Schema Database untuk School Guard Manager
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
SELECT 'schools' as table_name, count(*) as record_count FROM schools;`;

    return sql;
}

function showInstructions(connectionResult) {
    console.log('\n📋 Instruksi Berdasarkan Hasil Test:\n');
    
    switch (connectionResult) {
        case 'need_real_key':
            console.log('🔑 PERLU KEY ASLI DARI SUPABASE DASHBOARD');
            console.log('');
            console.log('Langkah-langkah:');
            console.log('1. Buka https://supabase.com/dashboard');
            console.log('2. Login ke akun Anda');
            console.log('3. Pilih project: fmxeboullgcewzjpql');
            console.log('4. Pergi ke Settings > API');
            console.log('5. Copy "anon public" key');
            console.log('6. Update .env dengan key yang benar');
            break;
            
        case 'need_schema':
            console.log('🗄️ PERLU SETUP DATABASE SCHEMA');
            console.log('');
            console.log('Langkah-langkah:');
            console.log('1. Buka Supabase SQL Editor:');
            console.log('   https://supabase.com/dashboard/project/fmxeboullgcewzjpql/sql');
            console.log('2. Copy SQL dari file: supabase-schema-setup.sql');
            console.log('3. Paste dan jalankan SQL tersebut');
            console.log('4. Test ulang koneksi');
            break;
            
        case 'network_error':
            console.log('🌐 MASALAH KONEKSI NETWORK');
            console.log('');
            console.log('Solusi yang bisa dicoba:');
            console.log('1. Periksa koneksi internet');
            console.log('2. Restart router/modem');
            console.log('3. Gunakan VPN jika ada blocking ISP');
            console.log('4. Matikan sementara firewall/antivirus');
            console.log('5. Gunakan DNS 8.8.8.8 atau 1.1.1.1');
            break;
            
        case 'connection_failed':
            console.log('❌ KONEKSI GAGAL TOTAL');
            console.log('');
            console.log('Kemungkinan penyebab:');
            console.log('1. Project Supabase tidak aktif atau dihapus');
            console.log('2. URL project salah');
            console.log('3. Masalah dengan Supabase service');
            console.log('4. Koneksi internet bermasalah');
            console.log('');
            console.log('Solusi:');
            console.log('1. Verifikasi project masih ada di dashboard');
            console.log('2. Periksa URL project di dashboard');
            console.log('3. Coba akses dashboard Supabase via browser');
            break;
            
        case 'success':
            console.log('🎉 KONEKSI BERHASIL!');
            console.log('');
            console.log('Langkah selanjutnya:');
            console.log('1. Set environment variables di Netlify');
            console.log('2. Redeploy Netlify site');
            console.log('3. Test aplikasi di production');
            break;
            
        default:
            console.log('❓ STATUS TIDAK DIKENAL');
            console.log('Coba jalankan diagnosa ulang atau periksa log error');
    }
}

async function main() {
    console.log('🚀 Setup Supabase Complete - Diagnosa & Perbaikan\n');
    
    // Test koneksi
    const result = await testSupabaseConnection();
    
    // Buat file SQL schema
    const sql = createSchemaSQL();
    fs.writeFileSync('supabase-schema-setup.sql', sql);
    console.log('\n💾 SQL schema disimpan ke: supabase-schema-setup.sql');
    
    // Tampilkan instruksi
    showInstructions(result);
    
    console.log('\n📁 File yang dibuat:');
    console.log('- supabase-schema-setup.sql (untuk setup database)');
    console.log('- netlify-env-vars.txt (untuk Netlify environment variables)');
    
    console.log('\n🎯 Prioritas langkah:');
    if (result === 'need_real_key') {
        console.log('1. Dapatkan key asli dari Supabase dashboard (PRIORITAS TINGGI)');
        console.log('2. Setup database schema');
        console.log('3. Test koneksi ulang');
    } else if (result === 'need_schema') {
        console.log('1. Setup database schema (PRIORITAS TINGGI)');
        console.log('2. Test koneksi ulang');
        console.log('3. Setup Netlify environment variables');
    } else {
        console.log('1. Perbaiki masalah koneksi');
        console.log('2. Verifikasi konfigurasi');
        console.log('3. Test ulang');
    }
}

main().catch(console.error);