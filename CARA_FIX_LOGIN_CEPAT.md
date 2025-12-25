# 🚨 Cara Fix Login Gagal - Solusi Cepat

## Masalah
- Login gagal dengan error di console
- Username/password tidak diterima
- Redirect tidak berfungsi

## Solusi Darurat (5 detik)

### Langkah 1: Buka Console Browser
1. Tekan `F12` atau `Ctrl+Shift+I`
2. Klik tab "Console"

### Langkah 2: Copy-Paste Script Ini
```javascript
// EMERGENCY LOGIN - Copy paste semua kode ini ke console
localStorage.clear();
window.emergencyLogin = function(u, p) {
  const users = {
    admin: { id: 'admin-123', username: 'admin', full_name: 'Administrator', role: 'admin' },
    wawan: { id: '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e', username: 'wawan', full_name: 'Wawan Yogaswara', role: 'user' }
  };
  const passwords = { admin: 'admin123', wawan: 'wawan123' };
  if (passwords[u] === p) {
    localStorage.setItem('auth_user', JSON.stringify(users[u]));
    localStorage.setItem('auth_token', u + '-token-' + Date.now());
    console.log('✅ Login berhasil!');
    window.location.href = '/';
    return true;
  }
  console.log('❌ Login gagal');
  return false;
};
console.log('🎯 Ketik: emergencyLogin("admin", "admin123")');
```

### Langkah 3: Login
Ketik salah satu perintah ini di console:
```javascript
emergencyLogin("admin", "admin123")
```
atau
```javascript
emergencyLogin("wawan", "wawan123")
```

## Kredensial Valid
- **Admin**: username `admin`, password `admin123`
- **Wawan**: username `wawan`, password `wawan123`

## Jika Masih Gagal
1. Refresh halaman (`F5`)
2. Ulangi langkah di atas
3. Pastikan server berjalan di `localhost:5000`

## Penyebab Masalah
- Konfigurasi Supabase tidak valid
- Token authentication expired
- Network error ke database

## Fix Permanen
Jalankan script `fix-login-emergency.js` yang sudah dibuat untuk solusi yang lebih lengkap.