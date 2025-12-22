# 🚀 Cara Menggunakan Script Update Config Project Baru

## 📋 Persiapan

### 1. Buat Project Supabase Baru
1. Buka https://supabase.com/dashboard
2. Klik **"New Project"**
3. Isi detail project:
   - **Name**: School Guard Manager (atau nama lain)
   - **Database Password**: Buat password yang kuat
   - **Region**: Pilih yang terdekat (Singapore/Tokyo)
4. Klik **"Create new project"**
5. **Tunggu sampai project ready** (biasanya 2-3 menit)

### 2. Dapatkan Credentials
1. Setelah project ready, pergi ke **Settings > API**
2. Copy **Project URL** (contoh: https://abcdefgh.supabase.co)
3. Copy **anon public key** (key yang panjang)
4. (Opsional) Copy **service_role key** jika diperlukan

## 🔧 Menjalankan Script

### 1. Buka Terminal/Command Prompt
```bash
# Pastikan di root directory project
cd /path/to/school-guard-manager

# Jalankan script
node update-config-project-baru.js
```

### 2. Ikuti Instruksi
Script akan menanyakan:
1. **Project URL baru**: Paste URL dari Supabase dashboard
2. **Anon public key**: Paste key dari Supabase dashboard  
3. **Service role key**: (Opsional) Tekan Enter untuk skip

### 3. Verifikasi Input
Script akan memvalidasi:
- ✅ Format URL benar (harus berisi supabase.co)
- ✅ Key tidak kosong dan valid
- ✅ Tidak ada karakter aneh atau typo

## 📁 File yang Dihasilkan

Setelah script selesai, akan ada file baru:

### Konfigurasi
- ✅ `.env` - Updated dengan credentials baru
- ✅ `client/src/lib/supabase.ts` - Updated client config
- ✅ `netlify-env-vars-new.txt` - Untuk Netlify deployment
- ✅ `vercel-env-vars-new.txt` - Untuk Vercel deployment

### Database
- ✅ `supabase-schema-[project-ref].sql` - Schema untuk project baru
- ✅ `SETUP_[PROJECT-REF].md` - Dokumentasi lengkap

### Utilities
- ✅ `quick-setup-[project-ref].sh` - Script setup otomatis
- ✅ `.env.backup.[timestamp]` - Backup konfigurasi lama

## 🎯 Langkah Selanjutnya

### 1. Setup Database Schema
```bash
# Buka Supabase Dashboard
https://supabase.com/dashboard/project/[project-ref]/sql

# Copy paste isi file:
supabase-schema-[project-ref].sql

# Klik "Run" untuk execute
```

### 2. Test Koneksi
```bash
# Test koneksi ke Supabase
node test-supabase-connection-simple.js

# Jika berhasil, lanjut test aplikasi
npm run dev
```

### 3. Setup Environment Variables (untuk Deploy)

#### Netlify:
1. Buka Netlify Dashboard > Site Settings > Environment Variables
2. Copy paste isi file: `netlify-env-vars-new.txt`

#### Vercel:
1. Buka Vercel Dashboard > Settings > Environment Variables  
2. Copy paste isi file: `vercel-env-vars-new.txt`

## 🔧 Troubleshooting

### Error: File tidak ditemukan
```bash
# Pastikan di root directory
ls -la .env client/src/lib/supabase.ts

# Jika tidak ada, Anda di directory yang salah
cd /path/to/correct/directory
```

### Error: URL tidak valid
- Pastikan URL format: `https://[project-ref].supabase.co`
- Tidak ada spasi atau karakter tambahan
- Copy langsung dari Supabase dashboard

### Error: Key tidak valid  
- Pastikan key tidak mengandung "Ej8Ej8Ej8..." (key rusak)
- Copy fresh dari Supabase dashboard Settings > API
- Pastikan copy key yang benar (anon public, bukan service role)

### Koneksi Test Gagal
```bash
# Cek apakah project Supabase ready
# Buka dashboard, pastikan tidak ada loading

# Test manual
curl -H "apikey: [your-key]" [your-url]/rest/v1/
```

## 💡 Tips

### Backup Otomatis
Script otomatis backup konfigurasi lama ke:
- `.env.backup.[timestamp]`
- `supabase.ts.backup.[timestamp]`

### Multiple Projects
Anda bisa menjalankan script berkali-kali untuk project berbeda.
File akan di-generate dengan nama unik berdasarkan project reference.

### Quick Setup
Setelah script selesai, gunakan:
```bash
# Jalankan quick setup
bash quick-setup-[project-ref].sh
```

## 📞 Support

Jika ada masalah:
1. Cek file `SETUP_[PROJECT-REF].md` untuk dokumentasi lengkap
2. Pastikan semua file yang diperlukan ada
3. Verifikasi credentials di Supabase dashboard
4. Test koneksi manual jika perlu

---
🎉 **Selamat! Project Supabase baru siap digunakan!**