# 🔧 Panduan Fix Netlify-Supabase: Masalah Penyimpanan Data

## 🎯 Situasi Saat Ini
- ✅ Netlify sudah terkoneksi ke Supabase (via extension)
- ❌ Data tidak tersimpan dengan benar
- ❌ Key Supabase di lokal masih tidak valid

## 🔍 Diagnosa Masalah

### Masalah Utama:
1. **Key lokal tidak valid** - Berulang "Ej8Ej8Ej8..."
2. **Environment variables Netlify** - Mungkin belum diset dengan benar
3. **Database schema** - Mungkin belum di-setup
4. **RLS Policy** - Mungkin memblokir insert data

## 🚀 Solusi Lengkap

### Step 1: Dapatkan Key Supabase yang Benar

1. **Buka Supabase Dashboard:**
   ```
   https://supabase.com/dashboard
   ```

2. **Pilih Project Anda:**
   - Project yang sudah dikoneksikan ke Netlify
   - Nama project: `fmxeboullgcewzjpql`

3. **Pergi ke Settings > API:**
   - Klik "Settings" di sidebar
   - Pilih "API"
   - Copy **"anon public"** key (BUKAN service_role!)

4. **Update File .env Lokal:**
   ```env
   SUPABASE_URL=https://fmxeboullgcewzjpql.supabase.co
   SUPABASE_ANON_KEY=[paste-key-yang-benar-disini]
   VITE_SUPABASE_URL=https://fmxeboullgcewzjpql.supabase.co
   VITE_SUPABASE_ANON_KEY=[paste-key-yang-benar-disini]
   ```

### Step 2: Setup Database Schema

1. **Buka Supabase SQL Editor:**
   ```
   https://supabase.com/dashboard/project/fmxeboullgcewzjpql/sql
   ```

2. **Jalankan SQL Schema:**
   - Copy isi file `supabase-schema-complete.sql`
   - Paste di SQL Editor
   - Klik "Run"

3. **Verifikasi Tabel Dibuat:**
   - Pergi ke Table Editor
   - Pastikan tabel users, schools, tasks, dll sudah ada

### Step 3: Set Environment Variables di Netlify

1. **Buka Netlify Dashboard:**
   ```
   https://app.netlify.com
   ```

2. **Pilih Site Anda**

3. **Pergi ke Site Settings > Environment Variables:**
   - Klik "Site settings"
   - Pilih "Environment variables"
   - Klik "Add a variable"

4. **Tambahkan Variables:**
   ```
   Key: VITE_SUPABASE_URL
   Value: https://fmxeboullgcewzjpql.supabase.co
   
   Key: VITE_SUPABASE_ANON_KEY
   Value: [paste-key-yang-benar-disini]
   ```

5. **Redeploy Site:**
   - Pergi ke Deploys
   - Klik "Trigger deploy" > "Deploy site"

### Step 4: Test Koneksi Lokal

```bash
node test-supabase-connection-simple.js
```

**Hasil yang diharapkan:**
```
✅ Koneksi Supabase berhasil!
📊 Response: [{"count": 1}]
```

### Step 5: Test Penyimpanan Data

1. **Jalankan aplikasi lokal:**
   ```bash
   npm run dev
   ```

2. **Login ke aplikasi**

3. **Coba input data:**
   - Tambah sekolah
   - Tambah tugas
   - Tambah supervisi

4. **Periksa di Supabase Dashboard:**
   - Buka Table Editor
   - Lihat apakah data masuk

## 🔍 Troubleshooting

### Masalah: Data tidak tersimpan

**Kemungkinan Penyebab:**

1. **RLS Policy terlalu ketat:**
   ```sql
   -- Jalankan di SQL Editor untuk sementara
   ALTER TABLE users DISABLE ROW LEVEL SECURITY;
   ALTER TABLE schools DISABLE ROW LEVEL SECURITY;
   ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
   ```

2. **Key masih salah:**
   - Pastikan copy "anon public" key, bukan "service_role"
   - Periksa tidak ada spasi di awal/akhir

3. **Tabel belum ada:**
   - Jalankan ulang schema SQL
   - Periksa di Table Editor

4. **Network error:**
   - Coba dengan VPN
   - Periksa firewall

### Masalah: Error "relation does not exist"

**Solusi:**
```sql
-- Jalankan di Supabase SQL Editor
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

-- Enable RLS dan buat policy
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations on users" ON users FOR ALL USING (true);
```

### Masalah: Error "permission denied"

**Solusi:**
```sql
-- Buat policy yang lebih permisif (untuk development)
DROP POLICY IF EXISTS "Allow all operations on users" ON users;
CREATE POLICY "Allow all operations on users" ON users FOR ALL USING (true);
```

## 📋 Checklist Verifikasi

- [ ] Key Supabase sudah benar (tidak berulang)
- [ ] File .env lokal sudah diupdate
- [ ] Database schema sudah di-setup
- [ ] Tabel sudah ada di Supabase
- [ ] RLS policy sudah dibuat
- [ ] Environment variables Netlify sudah diset
- [ ] Site Netlify sudah di-redeploy
- [ ] Test koneksi lokal berhasil
- [ ] Test insert data berhasil

## 🎉 Hasil Akhir yang Diharapkan

1. **Lokal Development:**
   - Data tersimpan ke Supabase
   - Tidak ada error di console
   - Data muncul di Supabase dashboard

2. **Netlify Production:**
   - Data tersimpan ke Supabase
   - Aplikasi berfungsi normal
   - Tidak ada error 401/403

## 📞 Tools Helper

- `diagnosa-netlify-supabase-connection.js` - Diagnosa masalah
- `test-supabase-connection-simple.js` - Test koneksi
- `test-supabase-interactive.html` - Test via browser
- `supabase-schema-complete.sql` - Schema database lengkap

---

**💡 Tip:** Jika masih bermasalah, jalankan `node diagnosa-netlify-supabase-connection.js` untuk diagnosa detail.