# Cara Fix Login "Password Salah"

## Masalah
- Login menampilkan "Username atau password salah"
- Error di console browser
- User tidak bisa masuk aplikasi

## Solusi Cepat

### 1. Reset Password di Supabase
Jalankan SQL dari file `fix-login-password-salah.sql` di Supabase SQL Editor.

### 2. Gunakan Kredensial Test
Setelah menjalankan SQL, coba login dengan:

**User Admin:**
- Username: `admin`
- Password: `admin123`

**User Wawan:**
- Username: `wawan` 
- Password: `wawan123`

**User Test (Baru):**
- Username: `test`
- Password: `test123`

### 3. Jika Masih Error

#### Cek di Console Browser (F12)
Lihat error yang muncul dan screenshot untuk analisis lebih lanjut.

#### Clear Cache dan Storage
```javascript
// Jalankan di Console Browser
localStorage.clear();
sessionStorage.clear();
location.reload();
```

#### Test API Login Langsung
```javascript
// Test di Console Browser
fetch('/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'test',
    password: 'test123'
  })
})
.then(res => res.json())
.then(data => console.log('Login result:', data))
.catch(err => console.error('Login error:', err));
```

### 4. Alternatif: Login Manual
Jika API bermasalah, set user manual di localStorage:

```javascript
// Jalankan di Console Browser
const testUser = {
  id: 'test-uuid-1234-5678-9012-123456789012',
  username: 'test',
  name: 'User Test',
  role: 'user',
  nip: '123456789',
  position: 'Pengawas Test'
};

localStorage.setItem('user', JSON.stringify(testUser));
location.href = '/dashboard';
```

## Kemungkinan Penyebab

### 1. Password Hash Tidak Cocok
- Database menggunakan bcrypt hash
- Frontend mengirim plain text
- Perlu sinkronisasi hashing

### 2. User Tidak Ada di Database
- Tabel users kosong
- User belum dibuat
- ID tidak match

### 3. API Endpoint Bermasalah
- Server tidak berjalan
- Route login error
- Database connection issue

### 4. Frontend Issue
- Form tidak mengirim data dengan benar
- JavaScript error
- Network issue

## Langkah Debugging

### 1. Cek Database
```sql
-- Di Supabase SQL Editor
SELECT * FROM users WHERE username = 'admin';
```

### 2. Cek Server
Pastikan server berjalan di port yang benar (biasanya 5000 atau 3000).

### 3. Cek Network Tab
Di Developer Tools > Network, lihat apakah request login terkirim dan response-nya.

### 4. Cek Console Errors
Lihat error JavaScript yang mungkin menghalangi proses login.

## File Terkait
- `fix-login-password-salah.sql` - SQL untuk reset password
- `api/login.js` - Endpoint login API
- `client/src/pages/login.tsx` - Halaman login frontend

## Kontak
Jika masih bermasalah, screenshot error console dan kirim ke developer.