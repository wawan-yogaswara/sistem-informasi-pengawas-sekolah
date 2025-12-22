# 🔧 SOLUSI LENGKAP: HALAMAN KOSONG DI LOCALHOST

## 🚨 MASALAH YANG DITEMUKAN

Halaman kosong saat mengakses localhost dapat disebabkan oleh beberapa faktor:

1. **Server belum berjalan** atau crash
2. **Port conflict** atau sudah digunakan aplikasi lain
3. **Routing issue** - redirect loop atau auth problem
4. **JavaScript error** yang mencegah React render
5. **Cache browser** yang corrupt
6. **Dependencies** yang belum terinstall

## ✅ SOLUSI STEP-BY-STEP

### STEP 1: Pastikan Server Berjalan

```bash
# 1. Buka terminal di folder project
cd sistem-informasi-pengawas-sekolah

# 2. Install dependencies (jika belum)
npm install

# 3. Jalankan server
npm run dev
```

**Expected Output:**
```
✓ Local admin user already exists
✓ Using local file-based storage (data persisted in local-database.json)
Server running on http://localhost:5000
```

### STEP 2: Test Koneksi Server

**Opsi A: Gunakan Script Debug**
```bash
# Windows PowerShell
.\debug-localhost.ps1

# Atau buka file test
# Buka test-localhost-simple.html di browser
```

**Opsi B: Test Manual**
```bash
# Test API endpoint
curl http://localhost:5000/api/test

# Expected response:
# {"message":"Server is running!","status":"success","timestamp":"...","version":"1.0.0"}
```

### STEP 3: Akses Aplikasi dengan Benar

1. **Buka browser** (Chrome/Firefox/Edge)
2. **Akses URL:** `http://localhost:5000/login`
3. **Login dengan:**
   - Username: `admin`
   - Password: `admin123`

### STEP 4: Jika Masih Kosong - Troubleshooting

#### A. Cek Console Browser
1. Tekan **F12** untuk buka Developer Tools
2. Lihat tab **Console** - ada error JavaScript?
3. Lihat tab **Network** - ada request yang gagal?

#### B. Clear Cache & Storage
```javascript
// Jalankan di Console browser (F12)
localStorage.clear();
sessionStorage.clear();
location.reload(true);
```

#### C. Cek Port Conflict
```bash
# Windows - cek port 5000
netstat -an | findstr :5000

# Jika ada conflict, ubah port di server/index.ts
const PORT = process.env.PORT || 5001;
```

#### D. Restart Server
```bash
# Stop server (Ctrl+C)
# Kemudian restart
npm run dev
```

## 🛠️ TROUBLESHOOTING ADVANCED

### Masalah 1: "Cannot GET /"
**Penyebab:** Vite middleware tidak setup dengan benar
**Solusi:**
```bash
# Restart server dan pastikan tidak ada error
npm run dev
```

### Masalah 2: JavaScript Error di Console
**Penyebab:** Dependency issue atau syntax error
**Solusi:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Masalah 3: Redirect Loop ke /login
**Penyebab:** Auth token issue
**Solusi:**
```javascript
// Clear storage di browser console
localStorage.removeItem('auth_token');
localStorage.removeItem('user_data');
location.href = '/login';
```

### Masalah 4: Port Already in Use
**Solusi:**
```bash
# Kill process di port 5000 (Windows)
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# Atau gunakan port lain
set PORT=5001 && npm run dev
```

## 🎯 QUICK FIX COMMANDS

### Windows (PowerShell)
```powershell
# Quick start
.\quick-start.bat

# Debug
.\debug-localhost.ps1

# Manual restart
taskkill /F /IM node.exe 2>$null; npm run dev
```

### Manual Test URLs
```
✅ http://localhost:5000/api/test
✅ http://localhost:5000/api/health  
✅ http://localhost:5000/login
✅ http://localhost:5000/
```

## 📋 CHECKLIST DEBUGGING

- [ ] Server berjalan tanpa error
- [ ] Port 5000 tidak bentrok
- [ ] API endpoint `/api/test` merespons
- [ ] Browser console tidak ada error
- [ ] Cache sudah di-clear
- [ ] Akses langsung ke `/login`
- [ ] Credentials admin/admin123 benar

## 🔍 DIAGNOSTIC TOOLS

### 1. Test File HTML
Buka `test-localhost-simple.html` di browser untuk test otomatis

### 2. PowerShell Script
```powershell
.\debug-localhost.ps1
```

### 3. Manual cURL Test
```bash
curl -v http://localhost:5000/api/test
curl -v http://localhost:5000/login
```

## 🚀 SOLUSI ALTERNATIF

### Jika Localhost Tidak Bisa
```bash
# 1. Build production
npm run build

# 2. Serve static files
npx serve dist

# 3. Akses di http://localhost:3000
```

### Jika Port 5000 Bentrok
```bash
# Ubah port di server/index.ts
const PORT = process.env.PORT || 5001;

# Atau set environment
set PORT=5001
npm run dev
```

### Jika Dependencies Bermasalah
```bash
# Clean install
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
npm run dev
```

## ✅ HASIL YANG DIHARAPKAN

Setelah mengikuti panduan ini:

1. ✅ Server berjalan di `http://localhost:5000`
2. ✅ Halaman login muncul dengan form
3. ✅ Bisa login dengan admin/admin123
4. ✅ Dashboard muncul dengan sidebar
5. ✅ Semua menu berfungsi normal

## 🆘 JIKA MASIH BERMASALAH

### Cek File Penting:
- `client/index.html` - Entry point HTML
- `client/src/main.tsx` - Entry point React  
- `client/src/App.tsx` - Komponen utama
- `server/index.ts` - Server backend
- `vite.config.ts` - Konfigurasi Vite

### Error Umum & Solusi:
1. **"Module not found"** → `npm install`
2. **"Port in use"** → Ganti port atau kill process
3. **"Cannot connect"** → Restart server
4. **"Blank page"** → Clear cache + check console
5. **"Login loop"** → Clear localStorage

### Kontak Support:
Jika masih bermasalah, sertakan:
- Screenshot error console
- Output `npm run dev`
- OS dan browser yang digunakan

---

**💡 TIP:** Selalu gunakan incognito mode untuk test, dan pastikan tidak ada extension browser yang mengblokir JavaScript!