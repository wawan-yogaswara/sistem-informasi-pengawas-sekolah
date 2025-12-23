# 🔧 PANDUAN FIX NETLIFY LOGIN ISSUE

## 🚨 MASALAH: "tenant or user not found"

Error ini terjadi karena aplikasi Netlify tidak dapat terhubung dengan database Supabase atau environment variables tidak diset dengan benar.

---

## ✅ LANGKAH PERBAIKAN:

### **1. Verifikasi Environment Variables di Netlify**

1. **Buka Netlify Dashboard:**
   - Go to: https://app.netlify.com
   - Pilih site: `sistem-informasi-pengawas-kcdxi`

2. **Check Environment Variables:**
   - Go to: **Site settings** → **Environment variables**
   - Pastikan ada variables berikut:

```
VITE_SUPABASE_URL=https://glhaliktsrcvnznbgxqt.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsaGFsaWt0c3Jjdm56bmJneHF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzNjYyMjQsImV4cCI6MjA4MTk0MjIyNH0._kaFo2h7rCdouJp2rpb1lmEvlR6gAc0c3AnRjM_PhP4
DATABASE_URL=postgresql://postgres.glhaliktsrcvnznbgxqt:schoolguard2024@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
JWT_SECRET=schoolguard-secret-key-2024
NODE_ENV=production
```

3. **Jika Variables Tidak Ada:**
   - Click **"Add variable"**
   - Masukkan satu per satu dari list di atas
   - Click **"Save"**

### **2. Test Koneksi Supabase**

1. **Buka Test Page:**
   ```
   https://sistem-informasi-pengawas-kcdxi.netlify.app/test-netlify-supabase-connection.html
   ```

2. **Jalankan Tests:**
   - Click **"Check Environment Variables"**
   - Click **"Test Connection"**
   - Click **"Check Users Table"**
   - Click **"Test Admin Login"**

3. **Expected Results:**
   - ✅ Environment variables found
   - ✅ Connection successful
   - ✅ Users table accessible
   - ✅ Admin user found

### **3. Redeploy Aplikasi**

Setelah environment variables diset:

1. **Trigger Redeploy:**
   - Go to **Deploys** tab
   - Click **"Trigger deploy"** → **"Deploy site"**

2. **Wait for Deploy:**
   - Tunggu hingga status **"Published"** (hijau)
   - Biasanya 2-3 menit

### **4. Test Login**

Setelah redeploy selesai:

1. **Buka Aplikasi:**
   ```
   https://sistem-informasi-pengawas-kcdxi.netlify.app/
   ```

2. **Test Login:**
   - **Username:** admin
   - **Password:** admin123
   
   **ATAU**
   
   - **Username:** wawan
   - **Password:** wawan123

---

## 🔍 TROUBLESHOOTING:

### **Jika Masih Error "tenant or user not found":**

1. **Check Browser Console:**
   - Press F12 → Console tab
   - Look for error messages
   - Screenshot errors

2. **Check Network Tab:**
   - Press F12 → Network tab
   - Try login
   - Look for failed API calls
   - Check response details

3. **Verify Supabase Database:**
   - Go to: https://supabase.com/dashboard
   - Select project: `glhaliktsrcvnznbgxqt`
   - Go to **Table Editor**
   - Check `users` table has data

### **Jika Environment Variables Tidak Muncul:**

1. **Manual Add via Netlify CLI:**
   ```bash
   netlify env:set VITE_SUPABASE_URL "https://glhaliktsrcvnznbgxqt.supabase.co"
   netlify env:set VITE_SUPABASE_ANON_KEY "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   ```

2. **Or via netlify.toml:**
   ```toml
   [build.environment]
     VITE_SUPABASE_URL = "https://glhaliktsrcvnznbgxqt.supabase.co"
     VITE_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   ```

### **Jika Database Connection Gagal:**

1. **Check Supabase Status:**
   - Go to: https://status.supabase.com
   - Verify all services operational

2. **Regenerate API Keys:**
   - Go to Supabase dashboard
   - Settings → API
   - Copy new anon key
   - Update Netlify environment variables

---

## 📋 QUICK CHECKLIST:

- [ ] Environment variables diset di Netlify
- [ ] Redeploy triggered dan selesai
- [ ] Test connection page working
- [ ] Users table accessible
- [ ] Login credentials correct (admin/admin123, wawan/wawan123)
- [ ] No console errors
- [ ] Network requests successful

---

## 🎯 EXPECTED RESULT:

Setelah semua langkah:
- ✅ Login page loading
- ✅ No "tenant or user not found" error
- ✅ Successful login dengan admin/admin123
- ✅ Dashboard accessible
- ✅ All features working

---

## 📞 JIKA MASIH BERMASALAH:

1. **Screenshot error messages**
2. **Check browser console logs**
3. **Verify Netlify build logs**
4. **Test with different browser**
5. **Clear browser cache**

**Kemungkinan besar masalahnya di environment variables yang belum diset di Netlify!**