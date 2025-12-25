# DIAGNOSA: Tugas Tambahan Tidak Muncul di Localhost

## Situasi
❌ **Data Tugas Tambahan tidak muncul di localhost:5000**
❌ **Masalah yang sama seperti di production**

## Langkah Diagnosa

### 1. Cek Server Status
```bash
# Pastikan server berjalan
npm run dev

# Cek di browser: http://localhost:5000
```

### 2. Cek User Login
- Login dengan user `wawan`
- Password: `password123`
- Pastikan login berhasil

### 3. Test di Browser Console
```javascript
// Copy paste script dari DEBUG_LOCALHOST_TUGAS_TAMBAHAN.js
// Atau jalankan manual:

// Cek user data
const userData = localStorage.getItem('auth_user');
console.log('User data:', JSON.parse(userData));

// Test query Supabase
const user = JSON.parse(userData);
const userId = user.username || user.id;

supabase
  .from('additional_tasks')
  .select('*')
  .eq('user_id', userId)
  .then(({ data, error }) => {
    console.log('Query result:', { data, error });
  });
```

### 4. Kemungkinan Masalah

#### A. Server Tidak Berjalan
**Gejala**: Halaman tidak bisa diakses
**Solusi**: 
```bash
npm run dev
```

#### B. User Tidak Login
**Gejala**: Redirect ke halaman login
**Solusi**: Login dengan user wawan

#### C. Supabase Connection Error
**Gejala**: Error di console tentang Supabase
**Solusi**: Cek file `.env` dan credentials Supabase

#### D. Data Tidak Ada di Database
**Gejala**: Query berhasil tapi data kosong
**Solusi**: Cek langsung di Supabase dashboard

#### E. User ID Mismatch
**Gejala**: Data ada tapi tidak muncul untuk user tertentu
**Solusi**: Cek user_id di database vs localStorage

### 5. Quick Fix Options

#### Option 1: Reset User Session
```javascript
// Clear localStorage dan login ulang
localStorage.clear();
// Refresh page dan login ulang
```

#### Option 2: Force Refresh Query
```javascript
// Clear React Query cache
window.queryClient?.invalidateQueries(['additional-tasks']);
```

#### Option 3: Test dengan User ID Berbeda
```javascript
// Test dengan semua user_id yang ada di database
supabase
  .from('additional_tasks')
  .select('*')
  .then(({ data }) => {
    const userIds = [...new Set(data.map(item => item.user_id))];
    console.log('Available user IDs:', userIds);
  });
```

## Target Hasil
✅ **Data Tugas Tambahan muncul di localhost**
✅ **Console log menunjukkan data berhasil dimuat**
✅ **Tidak ada error di browser console**

## Jika Masih Bermasalah
1. Screenshot browser console
2. Screenshot halaman Tugas Tambahan
3. Screenshot Supabase dashboard (tabel additional_tasks)
4. Laporkan hasil diagnosa