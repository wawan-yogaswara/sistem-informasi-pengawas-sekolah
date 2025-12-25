# 🔧 Fix Konfigurasi Supabase & Netlify

## 🚨 Masalah yang Ditemukan

Data input tidak masuk ke Supabase karena ada masalah konfigurasi di level:
1. **Row Level Security (RLS) Policies** - Terlalu ketat
2. **Schema Database** - Kolom tidak sesuai dengan API
3. **Environment Variables** - Mungkin tidak ter-load dengan benar
4. **User ID Mismatch** - ID user tidak sesuai dengan yang ada di database

## 🔍 Diagnosis Masalah

### 1. Jalankan Diagnosis Otomatis
```javascript
// Buka Console Browser (F12) dan jalankan:
// Copy script dari diagnosa-supabase-netlify-config.js
```

### 2. Cek Manual di Supabase Dashboard
1. Buka https://supabase.com/dashboard/project/glhaliktsrcvnznbgxqt
2. Pilih **Table Editor**
3. Cek apakah tabel `tasks` dan `additional_tasks` ada
4. Cek apakah ada data terbaru

## ✅ Solusi Step-by-Step

### Step 1: Fix Database Schema & RLS
1. **Buka Supabase SQL Editor**
   - URL: https://supabase.com/dashboard/project/glhaliktsrcvnznbgxqt/sql

2. **Jalankan SQL Fix**
   ```sql
   -- Copy dan paste seluruh isi file fix-supabase-rls-policies.sql
   ```

3. **Verifikasi Hasil**
   - Cek apakah ada error
   - Pastikan semua tabel terlihat di Table Editor

### Step 2: Fix Environment Variables

#### A. Update Netlify Environment Variables
1. **Buka Netlify Dashboard**
   - https://app.netlify.com/sites/[your-site-name]/settings/deploys

2. **Tambah/Update Environment Variables**
   ```
   VITE_SUPABASE_URL=https://glhaliktsrcvnznbgxqt.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsaGFsaWt0c3Jjdm56bmJneHF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzNjYyMjQsImV4cCI6MjA4MTk0MjIyNH0._kaFo2h7rCdouJp2rpb1lmEvlR6gAc0c3AnRjM_PhP4
   DATABASE_URL=postgresql://postgres.glhaliktsrcvnznbgxqt:schoolguard2024@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
   NODE_ENV=production
   ```

3. **Redeploy Site**
   - Klik **Trigger deploy** untuk rebuild dengan env vars baru

#### B. Verifikasi Environment Variables
```javascript
// Di console browser setelah deploy:
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY);
```

### Step 3: Fix User ID Mismatch

#### A. Cek User ID di Database
1. **Buka Supabase Table Editor**
2. **Pilih tabel `users`**
3. **Catat ID untuk user `wawan`**

#### B. Update User Session
```javascript
// Di console browser:
const correctUserId = '4d803b6e-853b-4cfe-8fdf-0389f8d8efb3'; // ID dari database
const authUser = JSON.parse(localStorage.getItem('auth_user'));
authUser.id = correctUserId;
localStorage.setItem('auth_user', JSON.stringify(authUser));
console.log('✅ User ID updated:', authUser);
```

### Step 4: Test Insert Data

#### A. Test Manual Insert
```javascript
// Di console browser:
async function testInsert() {
  const user = JSON.parse(localStorage.getItem('auth_user'));
  
  const testData = {
    user_id: user.id,
    title: `Test Fix Config - ${new Date().toLocaleTimeString()}`,
    category: 'Test',
    description: 'Test setelah fix konfigurasi',
    completed: false,
    date: new Date().toISOString().split('T')[0],
    photo1: null,
    created_at: new Date().toISOString()
  };
  
  const response = await fetch('https://glhaliktsrcvnznbgxqt.supabase.co/rest/v1/tasks', {
    method: 'POST',
    headers: {
      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsaGFsaWt0c3Jjdm56bmJneHF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzNjYyMjQsImV4cCI6MjA4MTk0MjIyNH0._kaFo2h7rCdouJp2rpb1lmEvlR6gAc0c3AnRjM_PhP4',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsaGFsaWt0c3Jjdm56bmJneHF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzNjYyMjQsImV4cCI6MjA4MTk0MjIyNH0._kaFo2h7rCdouJp2rpb1lmEvlR6gAc0c3AnRjM_PhP4',
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(testData)
  });
  
  if (response.ok) {
    const result = await response.json();
    console.log('✅ Test insert berhasil:', result[0]);
    return true;
  } else {
    const error = await response.text();
    console.error('❌ Test insert gagal:', response.status, error);
    return false;
  }
}

testInsert();
```

#### B. Verifikasi di Supabase Dashboard
1. **Refresh Table Editor**
2. **Cek tabel `tasks`**
3. **Pastikan data test muncul**

## 🔧 Troubleshooting Masalah Umum

### Masalah 1: RLS Policy Error (403 Forbidden)
**Solusi:**
```sql
-- Jalankan di Supabase SQL Editor:
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE additional_tasks DISABLE ROW LEVEL SECURITY;
```

### Masalah 2: Column Does Not Exist
**Solusi:**
```sql
-- Tambah kolom yang hilang:
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'Umum';
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS photo1 TEXT;
ALTER TABLE additional_tasks ADD COLUMN IF NOT EXISTS name VARCHAR(200);
ALTER TABLE additional_tasks ADD COLUMN IF NOT EXISTS location VARCHAR(200);
```

### Masalah 3: User ID Not Found
**Solusi:**
```javascript
// Reset user session dengan ID yang benar:
const authUser = {
  id: '4d803b6e-853b-4cfe-8fdf-0389f8d8efb3',
  username: 'wawan',
  full_name: 'Wawan Setiawan',
  role: 'user',
  nip: '987654321',
  position: 'Pengawas Sekolah'
};
localStorage.setItem('auth_user', JSON.stringify(authUser));
```

### Masalah 4: Environment Variables Tidak Ter-load
**Solusi:**
```javascript
// Override di runtime:
window.VITE_SUPABASE_URL = 'https://glhaliktsrcvnznbgxqt.supabase.co';
window.VITE_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsaGFsaWt0c3Jjdm56bmJneHF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzNjYyMjQsImV4cCI6MjA4MTk0MjIyNH0._kaFo2h7rCdouJp2rpb1lmEvlR6gAc0c3AnRjM_PhP4';
```

## ✅ Verifikasi Final

### 1. Cek Konfigurasi
```javascript
// Jalankan diagnosis lengkap:
window.diagnosisSupabase.runAll();
```

### 2. Test Input Data Baru
1. **Login ke aplikasi**
2. **Tambah aktivitas/tugas baru**
3. **Cek console** - harus ada log sukses
4. **Cek Supabase dashboard** - data harus muncul

### 3. Test Cross-Browser
1. **Buka browser lain**
2. **Login dengan user sama**
3. **Data harus sinkron**

## 🎯 Hasil yang Diharapkan

Setelah fix konfigurasi:
- ✅ Data input baru masuk ke Supabase
- ✅ Data sinkron di semua browser
- ✅ Tidak ada error 403/401 di console
- ✅ Environment variables ter-load dengan benar
- ✅ RLS policies tidak mengblokir insert

## 📞 Jika Masih Bermasalah

1. **Cek Supabase Project Status**
   - https://status.supabase.com/

2. **Regenerate API Keys**
   - Buka Supabase Settings → API
   - Generate new anon key jika perlu

3. **Reset Database**
   - Jalankan ulang schema SQL
   - Clear semua data dan mulai fresh

4. **Contact Support**
   - Berikan screenshot error console
   - Berikan hasil diagnosis script