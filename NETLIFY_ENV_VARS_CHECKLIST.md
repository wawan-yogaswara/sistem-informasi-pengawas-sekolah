# Checklist Environment Variables Netlify

## Variables yang HARUS ada di Netlify:

1. **DATABASE_URL**
   ```
   postgresql://postgres.glhaliktsrcvnznbgxqt:schoolguard2024@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
   ```

2. **JWT_SECRET**
   ```
   schoolguard-secret-key-2024
   ```

3. **NODE_ENV**
   ```
   production
   ```
   ⚠️ PENTING: Harus "production", bukan "development"

4. **SUPABASE_ANON_KEY**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsaGFsaWt0c3Jjdm56bmJneHF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzNjYyMjQsImV4cCI6MjA4MTk0MjIyNH0._kaFo2h7rCdouJp2rpb1lmEvlR6gAc0c3AnRjM_PhP4
   ```

5. **SUPABASE_URL**
   ```
   https://glhaliktsrcvnznbgxqt.supabase.co
   ```

## Variables yang PERLU DITAMBAHKAN:

6. **USE_LOCAL_STORAGE**
   ```
   false
   ```

7. **SESSION_SECRET**
   ```
   schoolguard-secret-key-2024
   ```

8. **VITE_SUPABASE_URL** (untuk client-side)
   ```
   https://glhaliktsrcvnznbgxqt.supabase.co
   ```

9. **VITE_SUPABASE_ANON_KEY** (untuk client-side)
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsaGFsaWt0c3Jjdm56bmJneHF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzNjYyMjQsImV4cCI6MjA4MTk0MjIyNH0._kaFo2h7rCdouJp2rpb1lmEvlR6gAc0c3AnRjM_PhP4
   ```

## Langkah Perbaikan:

1. Buka: https://app.netlify.com/sites/sistem-informasi-pengawas-kcdo/settings/env
2. Periksa variables yang sudah ada
3. Tambahkan variables yang belum ada (nomor 6-9)
4. Pastikan semua scope: "All scopes"
5. Pastikan context: "Same value in all deploy contexts"
6. Save dan deploy ulang

## Setelah Update:

1. Deploy ulang aplikasi
2. Test input data baru
3. Verifikasi data masuk ke Supabase
4. Test sinkronisasi antar browser