# TROUBLESHOOT INPUT TIDAK MASUK SUPABASE

## Masalah yang Dilaporkan
- ❌ Input supervisi tidak masuk ke Supabase
- ❌ Input tugas tambahan tidak masuk ke Supabase
- ❌ Data hanya tersimpan di localStorage

## Langkah Troubleshooting

### 1. CEK KONEKSI SUPABASE
```javascript
// Jalankan di console browser:
console.log('Supabase client:', supabase);
```

### 2. CEK USER AUTHENTICATION
```javascript
// Jalankan di console browser:
const userData = localStorage.getItem('auth_user');
console.log('User data:', userData ? JSON.parse(userData) : 'No user data');
```

### 3. CEK STRUKTUR TABEL
```javascript
// Copy paste script dari: cek-semua-tabel-supabase-lengkap.js
```

### 4. TEST INPUT MANUAL
```javascript
// Test Tasks:
// Copy paste script dari: test-tugas-supabase-langsung.js

// Test Supervisions:
// Copy paste script dari: test-supervisi-supabase-langsung.js

// Test Additional Tasks:
// Copy paste script dari: test-additional-tasks-supabase-langsung.js
```

### 5. CEK RLS POLICIES
Buka Supabase Dashboard → Authentication → Policies
- Pastikan ada policies untuk setiap tabel
- Atau jalankan SQL: `fix-rls-policies-supabase.sql`

### 6. FIX USER CONTEXT
```javascript
// Copy paste script dari: fix-supabase-user-context.js
```

## Kemungkinan Penyebab

### 1. RLS (Row Level Security) Issues
**Gejala**: Error "new row violates row-level security policy"
**Solusi**: 
- Jalankan `fix-rls-policies-supabase.sql` di Supabase SQL Editor
- Atau disable RLS sementara untuk testing

### 2. User Context Tidak Ter-set
**Gejala**: Query berhasil tapi tidak ada data yang dikembalikan
**Solusi**: 
- Jalankan `fix-supabase-user-context.js`
- Set user context sebelum query

### 3. Schema Mismatch
**Gejala**: Error "column does not exist"
**Solusi**: 
- Periksa struktur tabel di Supabase Dashboard
- Pastikan field names sesuai dengan code

### 4. Permission Issues
**Gejala**: Error "permission denied"
**Solusi**: 
- Periksa API keys di `.env`
- Pastikan menggunakan service role key untuk admin operations

## Solusi Cepat

### Opsi 1: Disable RLS Sementara
```sql
-- Jalankan di Supabase SQL Editor:
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE supervisions DISABLE ROW LEVEL SECURITY;
ALTER TABLE additional_tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE schools DISABLE ROW LEVEL SECURITY;
```

### Opsi 2: Set Policies yang Permissive
```sql
-- Jalankan di Supabase SQL Editor:
-- Allow all operations for testing
CREATE POLICY "Allow all for testing" ON tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for testing" ON supervisions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for testing" ON additional_tasks FOR ALL USING (true) WITH CHECK (true);
```

### Opsi 3: Update Supabase Client
Pastikan menggunakan service role key di `.env`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_service_role_key
```

## Langkah Verifikasi

### 1. Test di Supabase Dashboard
- Buka Table Editor
- Coba insert data manual
- Pastikan data masuk

### 2. Test di Browser Console
- Jalankan script test
- Periksa error di console
- Lihat network tab untuk request/response

### 3. Test di Aplikasi
- Coba input data baru
- Periksa console untuk log
- Refresh halaman untuk lihat data

## Jika Masih Bermasalah

### 1. Periksa Environment Variables
```javascript
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 20) + '...');
```

### 2. Periksa Network Requests
- Buka Developer Tools → Network
- Coba input data
- Lihat request ke Supabase
- Periksa response status dan error

### 3. Periksa Supabase Logs
- Buka Supabase Dashboard → Logs
- Lihat error logs
- Periksa API logs

## Kontak Support
Jika semua langkah di atas tidak berhasil:
1. Screenshot error di console
2. Screenshot network requests
3. Screenshot Supabase logs
4. Berikan informasi environment (browser, OS, dll)