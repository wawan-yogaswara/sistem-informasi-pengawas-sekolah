-- Setup Row Level Security (RLS) dan Policies
-- Jalankan setelah schema dan data berhasil dibuat

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE supervisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE additional_tasks ENABLE ROW LEVEL SECURITY;

-- Create policies untuk akses public (bisa disesuaikan nanti)
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