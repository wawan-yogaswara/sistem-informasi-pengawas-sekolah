# Final Steps: Fix Netlify Environment Variables

## Masalah yang Ditemukan:
1. Data input baru tidak masuk ke Supabase
2. Browser sync issue (Edge vs Chrome/Opera)
3. Environment variables Netlify belum lengkap

## Solusi:

### 1. Update Environment Variables di Netlify

Buka: https://app.netlify.com/sites/sistem-informasi-pengawas-kcdo/settings/env

**Tambahkan variables berikut:**

```
USE_LOCAL_STORAGE=false
SESSION_SECRET=schoolguard-secret-key-2024
VITE_SUPABASE_URL=https://glhaliktsrcvnznbgxqt.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsaGFsaWt0c3Jjdm56bmJneHF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzNjYyMjQsImV4cCI6MjA4MTk0MjIyNH0._kaFo2h7rCdouJp2rpb1lmEvlR6gAc0c3AnRjM_PhP4
```

**Pastikan NODE_ENV = production** (bukan development)

### 2. Deploy Ulang

Setelah update environment variables:
1. Klik "Deploy" di Netlify dashboard
2. Atau push commit baru ke GitHub

### 3. Test Setelah Deploy

Jalankan test ini untuk memverifikasi:

```bash
# Test koneksi Supabase
node test-netlify-supabase-final.js

# Test API endpoints
curl -X GET "https://sistem-informasi-pengawas-kcdo.netlify.app/api/schools"
```

### 4. Verifikasi Browser Sync

1. Buka aplikasi di Edge
2. Input data baru (tugas tambahan/aktivitas)
3. Buka aplikasi di Chrome/Opera
4. Data harus muncul di semua browser

## Expected Results:

✅ Data input langsung masuk ke Supabase
✅ Data sinkron antar browser
✅ Tidak ada lagi fallback ke localStorage
✅ Dashboard menampilkan data real-time

## Jika Masih Ada Masalah:

1. Check browser console untuk error
2. Verifikasi environment variables di Netlify
3. Pastikan Supabase RLS policies benar
4. Test koneksi dengan script yang disediakan