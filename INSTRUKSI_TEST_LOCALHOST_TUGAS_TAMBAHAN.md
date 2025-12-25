# INSTRUKSI: Test Tugas Tambahan di Localhost

## Langkah-Langkah Test

### 1. Start Server
```bash
# Buka terminal di folder project
npm run dev

# Tunggu sampai server berjalan di http://localhost:5000
```

### 2. Test dengan Quick Test Page
```bash
# Buka file QUICK_TEST_LOCALHOST.html di browser
# Atau akses: http://localhost:5000/QUICK_TEST_LOCALHOST.html
```

### 3. Login ke Aplikasi
- Buka http://localhost:5000
- Login dengan:
  - **Username**: `wawan`
  - **Password**: `password123`

### 4. Test Halaman Tugas Tambahan
- Klik menu "Tugas Tambahan"
- Buka browser console (F12)
- Lihat log yang muncul

### 5. Manual Debug di Console
```javascript
// Copy paste script ini di browser console:

// 1. Cek user data
const userData = localStorage.getItem('auth_user');
console.log('User data:', JSON.parse(userData));

// 2. Test query langsung
const user = JSON.parse(userData);
const userId = user.username || user.id;
console.log('Using userId:', userId);

// 3. Test Supabase query
supabase
  .from('additional_tasks')
  .select('*')
  .eq('user_id', userId)
  .then(({ data, error }) => {
    if (error) {
      console.error('Query error:', error);
    } else {
      console.log('Query success:', data?.length || 0, 'records');
      console.log('Data:', data);
    }
  });

// 4. Test semua data
supabase
  .from('additional_tasks')
  .select('*')
  .then(({ data, error }) => {
    if (error) {
      console.error('All data error:', error);
    } else {
      console.log('Total records:', data?.length || 0);
      const userIds = [...new Set(data?.map(item => item.user_id))];
      console.log('User IDs:', userIds);
    }
  });
```

## Yang Harus Dicek

### ✅ Hasil yang Diharapkan:
- Server berjalan di localhost:5000
- User berhasil login
- Console log: "EMERGENCY: Using user_id for additional tasks: wawan"
- Console log: "EMERGENCY: Additional tasks loaded: [jumlah]"
- Data Tugas Tambahan muncul di halaman

### ❌ Jika Ada Masalah:

#### Problem 1: Server Tidak Berjalan
**Gejala**: Cannot connect to localhost:5000
**Solusi**: 
```bash
npm install
npm run dev
```

#### Problem 2: Login Gagal
**Gejala**: Tidak bisa masuk atau redirect terus
**Solusi**: 
- Cek username/password
- Clear localStorage: `localStorage.clear()`

#### Problem 3: Supabase Error
**Gejala**: Error di console tentang Supabase
**Solusi**: 
- Cek file `.env`
- Pastikan SUPABASE_URL dan SUPABASE_ANON_KEY benar

#### Problem 4: Data Kosong
**Gejala**: Query berhasil tapi data 0
**Solusi**: 
- Cek user_id di database
- Tambah data test manual

#### Problem 5: User ID Mismatch
**Gejala**: Ada data tapi tidak untuk user ini
**Solusi**: 
- Cek user_id yang tersimpan di database
- Bandingkan dengan localStorage

## Quick Fixes

### Fix 1: Reset Everything
```javascript
// Clear semua cache
localStorage.clear();
sessionStorage.clear();
// Refresh page
location.reload();
```

### Fix 2: Force Query
```javascript
// Force query dengan user berbeda
supabase
  .from('additional_tasks')
  .select('*')
  .eq('user_id', 'wawan')  // hardcode user
  .then(console.log);
```

### Fix 3: Add Test Data
```javascript
// Tambah data test
supabase
  .from('additional_tasks')
  .insert({
    title: 'Test Task',
    description: 'Test Description',
    user_id: 'wawan',
    date: new Date().toISOString().split('T')[0],
    location: 'Test Location'
  })
  .then(console.log);
```

## Target Hasil
🎯 **Data Tugas Tambahan muncul di localhost:5000**
🎯 **Tidak ada error di browser console**
🎯 **Query log menunjukkan data berhasil dimuat**

## Jika Masih Bermasalah
Laporkan hasil dengan:
1. Screenshot browser console
2. Screenshot halaman Tugas Tambahan  
3. Output dari Quick Test page
4. Informasi user_id yang digunakan