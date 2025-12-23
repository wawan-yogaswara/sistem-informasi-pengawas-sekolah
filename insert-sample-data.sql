-- Insert sample data setelah schema berhasil dibuat
-- Jalankan setelah create-supabase-schema-simple.sql berhasil

-- Insert sample users
INSERT INTO users (username, password, role, name, nip, position) VALUES
('admin', '$2b$10$rQZ9QmjQZ9QmjQZ9QmjQZOeKq7QZ9QmjQZ9QmjQZ9QmjQZ9QmjQZ9Q', 'admin', 'Administrator', '123456789', 'Administrator Sistem'),
('wawan', '$2b$10$rQZ9QmjQZ9QmjQZ9QmjQZOeKq7QZ9QmjQZ9QmjQZ9QmjQZ9QmjQZ9Q', 'user', 'Wawan Setiawan', '987654321', 'Pengawas Sekolah')
ON CONFLICT (username) DO NOTHING;

-- Insert sample schools
INSERT INTO schools (name, address, principal, phone, email) VALUES
('SDN 1 Garut', 'Jl. Raya Garut No. 1', 'Drs. Ahmad Suryadi', '0262-123456', 'sdn1garut@email.com'),
('SMPN 2 Garut', 'Jl. Pendidikan No. 2', 'Dra. Siti Nurhalimah', '0262-123457', 'smpn2garut@email.com'),
('SMAN 1 Garut', 'Jl. Merdeka No. 3', 'Dr. Budi Santoso, M.Pd', '0262-123458', 'sman1garut@email.com');