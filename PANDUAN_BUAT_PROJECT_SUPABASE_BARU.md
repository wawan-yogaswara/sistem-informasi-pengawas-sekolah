# 🚀 Panduan Buat Project Supabase Baru - School Guard Manager

## 🎯 Situasi Saat Ini
- ❌ Project lama (fmxeboullgcewzjpql) di-pause karena limit 2 project
- ✅ Akan buat project baru untuk School Guard Manager
- ✅ Setup fresh dengan konfigurasi yang benar

## 📋 Langkah Buat Project Baru

### Step 1: Buat Project Supabase Baru

1. **Buka Supabase Dashboard:**
   ```
   https://supabase.com/dashboard
   ```

2. **Klik "New Project"**

3. **Isi Detail Project:**
   - **Name:** `school-guard-manager`
   - **Database Password:** Buat password yang kuat (simpan baik-baik!)
   - **Region:** `Southeast Asia (Singapore)` (untuk performa terbaik)
   - **Pricing Plan:** Free (cukup untuk development)

4. **Klik "Create new project"**
   - Tunggu 2-3 menit sampai project selesai dibuat
   - Status akan berubah dari "Setting up project" ke "Project ready"

### Step 2: Dapatkan Konfigurasi Project Baru

1. **Setelah project ready, pergi ke Settings > API**

2. **Copy konfigurasi berikut:**
   - **Project URL:** `https://[new-project-ref].supabase.co`
   - **anon public key:** (key yang panjang, bukan service_role!)

3. **Catat konfigurasi ini** - akan digunakan untuk update aplikasi

### Step 3: Setup Database Schema

1. **Buka SQL Editor:**
   ```
   https://supabase.com/dashboard/project/[new-project-ref]/sql
   ```

2. **Jalankan SQL Schema:**
   - Copy isi file: `supabase-schema-setup.sql`
   - Paste di SQL Editor
   - Klik "Run"

3. **Verifikasi Tabel Dibuat:**
   - Pergi ke Table Editor
   - Pastikan tabel: users, schools, tasks, supervisions, additional_tasks

## 🔧 Update Aplikasi dengan Project Baru

### Step 4: Update File .env

```env
# Ganti dengan konfigurasi project baru
SUPABASE_URL=https://[new-project-ref].supabase.co
SUPABASE_ANON_KEY=[new-anon-key]
VITE_SUPABASE_URL=https://[new-project-ref].supabase.co
VITE_SUPABASE_ANON_KEY=[new-anon-key]
```

### Step 5: Update Client Supabase

File `client/src/lib/supabase.ts` akan otomatis menggunakan environment variables baru.

### Step 6: Test Koneksi

```bash
node test-supabase-connection-simple.js
```

**Hasil yang diharapkan:**
```
✅ Koneksi Supabase berhasil!
📊 Response: [{"count": 1}]
```

### Step 7: Setup Netlify Environment Variables

1. **Buka Netlify Dashboard:**
   ```
   https://app.netlify.com
   ```

2. **Pilih site > Site settings > Environment variables**

3. **Update/Tambahkan variables:**
   ```
   VITE_SUPABASE_URL = https://[new-project-ref].supabase.co
   VITE_SUPABASE_ANON_KEY = [new-anon-key]
   ```

4. **Redeploy site:**
   - Pergi ke Deploys
   - Klik "Trigger deploy"

## 📊 Keuntungan Project Baru

### ✅ Advantages:
- **Fresh start** - tidak ada konfigurasi lama yang bermasalah
- **Key valid** - langsung dari dashboard, tidak berulang
- **Schema bersih** - setup dari awal dengan struktur yang benar
- **Performance optimal** - region Singapore untuk Indonesia
- **No conflicts** - tidak ada masalah dengan project lama

### 🗑️ Cleanup Project Lama:
- Project lama (fmxeboullgcewzjpql) bisa di-delete setelah project baru berfungsi
- Atau biarkan di-pause jika masih diperlukan

## 🎯 Timeline Estimasi

| Langkah | Waktu | Status |
|---------|-------|--------|
| Buat project Supabase | 3-5 menit | ⏳ Waiting |
| Dapatkan konfigurasi | 1 menit | ⏳ Waiting |
| Setup database schema | 2 menit | ⏳ Waiting |
| Update .env file | 1 menit | ⏳ Waiting |
| Test koneksi | 1 menit | ⏳ Waiting |
| Setup Netlify env vars | 2 menit | ⏳ Waiting |
| **Total** | **10-12 menit** | ⏳ Waiting |

## 🛠️ Tools yang Siap Digunakan

Setelah project baru dibuat, tools ini siap digunakan:
- `test-supabase-connection-simple.js` - Test koneksi
- `supabase-schema-setup.sql` - Schema database
- `netlify-supabase-helper.html` - Helper interaktif
- `test-data-saving-netlify-supabase.js` - Test penyimpanan data

## 💡 Tips Penting

1. **Simpan konfigurasi project baru** di tempat yang aman
2. **Gunakan region Singapore** untuk performa terbaik
3. **Catat database password** - akan diperlukan untuk advanced features
4. **Test lokal dulu** sebelum deploy ke Netlify
5. **Backup data local** sebelum migrasi (jika ada)

---

**🚀 Setelah project baru dibuat, semua masalah koneksi akan teratasi dan aplikasi siap production!**