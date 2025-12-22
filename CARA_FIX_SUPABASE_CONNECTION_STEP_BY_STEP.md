# 🔧 Cara Fix Koneksi Supabase - Step by Step

## 🚨 Masalah yang Teridentifikasi

Berdasarkan diagnosa, masalah utama adalah:
- **Supabase API Key tidak valid** (berulang "Ej8Ej8Ej8...")
- **Koneksi DNS/Internet** mungkin bermasalah
- **Schema database** belum di-setup

## 📋 Langkah Perbaikan

### Step 1: Dapatkan Supabase Key yang Valid

1. **Buka Supabase Dashboard**
   ```
   https://supabase.com/dashboard
   ```

2. **Login dan pilih project Anda**
   - Jika belum punya project, buat project baru
   - Nama project: `school-guard-manager`

3. **Pergi ke Settings > API**
   - Klik menu "Settings" di sidebar kiri
   - Pilih "API" 
   - Copy "anon public" key (bukan service_role key!)

4. **Update file .env**
   ```env
   SUPABASE_URL=https://[your-project-ref].supabase.co
   SUPABASE_ANON_KEY=[your-anon-key-here]
   VITE_SUPABASE_URL=https://[your-project-ref].supabase.co
   VITE_SUPABASE_ANON_KEY=[your-anon-key-here]
   ```

### Step 2: Setup Database Schema

Setelah key valid, jalankan:

```bash
node setup-supabase-schema.js
```

### Step 3: Test Koneksi

```bash
node fix-supabase-connection.js
```

## 🛠️ Alternatif: Buat Project Supabase Baru

Jika project lama bermasalah:

1. **Buat project baru di Supabase**
   - Nama: `school-guard-manager-new`
   - Region: Southeast Asia (Singapore)
   - Database password: buat password yang kuat

2. **Setup schema dengan SQL Editor**
   ```sql
   -- Buat tabel users
   CREATE TABLE users (
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
   CREATE TABLE schools (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     name VARCHAR(200) NOT NULL,
     address TEXT,
     principal VARCHAR(100),
     phone VARCHAR(20),
     email VARCHAR(100),
     created_at TIMESTAMP DEFAULT NOW()
   );

   -- Buat tabel tasks
   CREATE TABLE tasks (
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
   CREATE TABLE supervisions (
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
   CREATE TABLE additional_tasks (
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
   ```

3. **Enable Row Level Security (RLS)**
   ```sql
   -- Enable RLS untuk semua tabel
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;
   ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
   ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
   ALTER TABLE supervisions ENABLE ROW LEVEL SECURITY;
   ALTER TABLE additional_tasks ENABLE ROW LEVEL SECURITY;

   -- Buat policy untuk akses public (sementara untuk development)
   CREATE POLICY "Allow all operations" ON users FOR ALL USING (true);
   CREATE POLICY "Allow all operations" ON schools FOR ALL USING (true);
   CREATE POLICY "Allow all operations" ON tasks FOR ALL USING (true);
   CREATE POLICY "Allow all operations" ON supervisions FOR ALL USING (true);
   CREATE POLICY "Allow all operations" ON additional_tasks FOR ALL USING (true);
   ```

## 🔍 Troubleshooting

### Jika masih error "Failed to fetch":

1. **Periksa koneksi internet**
   ```bash
   ping supabase.com
   ```

2. **Periksa DNS**
   ```bash
   nslookup [your-project-ref].supabase.co
   ```

3. **Coba dengan VPN** jika ada blocking ISP

4. **Periksa firewall/antivirus**

### Jika error "Invalid API key":

1. Pastikan menggunakan "anon public" key, bukan "service_role"
2. Copy ulang key dari dashboard
3. Pastikan tidak ada spasi di awal/akhir key

### Jika error "relation does not exist":

1. Jalankan SQL schema di atas
2. Atau gunakan migration script

## ✅ Verifikasi Berhasil

Setelah semua langkah, Anda harus melihat:
```
✅ Koneksi Supabase berhasil!
✅ Tabel users siap
🎉 Aplikasi sekarang dapat menyimpan data ke Supabase
```

## 📞 Bantuan Lebih Lanjut

Jika masih bermasalah, jalankan:
```bash
node fix-supabase-connection.js
```

Script akan memberikan diagnosa detail dan saran perbaikan.