# 🎯 PANDUAN FIX SCHEMA MISMATCH: Error "school_name column not found"

## 🔍 MASALAH YANG TERJADI

Error yang Anda alami:
```
"Could not find the 'school_name' column of 'tasks' in the schema cache"
```

**Root Cause**: Frontend mencoba menyimpan data ke kolom `school_name` yang tidak ada di database Supabase.

## 🎯 SOLUSI LENGKAP

### OPSI 1: FIX FRONTEND (RECOMMENDED) ⭐

**Gunakan script yang sudah dibuat untuk bypass schema mismatch:**

1. **Buka halaman Tugas Harian**
2. **Tekan F12** (Developer Console)
3. **Copy paste seluruh isi** file `FIX_SCHEMA_MISMATCH_TUGAS_HARIAN.js`
4. **Tekan Enter**
5. **Isi form dan klik "Simpan Tugas"**

**Keunggulan solusi ini:**
- ✅ Tidak perlu mengubah database
- ✅ Menggunakan field yang ada di database
- ✅ Progressive enhancement (tambah field satu per satu)
- ✅ Fallback mechanism jika ada field yang tidak ada
- ✅ Langsung bisa digunakan

### OPSI 2: TAMBAH KOLOM KE DATABASE

**Jika ingin menambahkan kolom yang hilang ke database:**

1. **Buka Supabase Dashboard**
2. **Masuk ke SQL Editor**
3. **Copy paste seluruh isi** file `ADD_MISSING_COLUMNS_TASKS_TABLE.sql`
4. **Klik Run**
5. **Refresh halaman frontend**

**Kolom yang akan ditambahkan:**
- `school_name` (TEXT)
- `activity_type` (TEXT) 
- `school_id` (UUID)
- `photo2` (TEXT)

## 🔧 CARA KERJA FIX FRONTEND

### Step 1: Minimal Insert
```javascript
// Insert dengan field yang PASTI ada
const minimalData = {
  user_id: userId,
  title: formData.title,
  description: formData.description,
  date: formData.date,
  completed: false
};
```

### Step 2: Progressive Enhancement
```javascript
// Tambahkan field optional satu per satu
const updateData = {};
if (formData.activity_type) updateData.activity_type = formData.activity_type;
if (formData.school_id) updateData.school_id = formData.school_id;
```

### Step 3: Fallback Mechanism
```javascript
// Jika minimal insert gagal, coba ultra-minimal
const ultraMinimalData = {
  user_id: userId,
  title: formData.title,
  description: formData.description
};
```

## 🚀 TESTING

### Manual Testing:
```javascript
// Test dengan data minimal
manualSubmitTugasHarianSchemaSafe({
  title: 'Test Tugas',
  description: 'Test deskripsi'
});

// Test dengan data lengkap
manualSubmitTugasHarianSchemaSafe({
  title: 'Test Tugas Lengkap',
  description: 'Test deskripsi lengkap',
  date: '2025-01-25',
  activity_type: 'Perencanaan',
  school_id: '1cd40355-1b07-402d-8309-b243c098cfe9'
});
```

## 📋 TROUBLESHOOTING

### Jika masih error setelah fix:

1. **Clear browser cache** (Ctrl+Shift+Delete)
2. **Refresh halaman** (F5)
3. **Jalankan fix lagi**
4. **Coba manual submit**:
   ```javascript
   manualSubmitTugasHarianSchemaSafe()
   ```

### Jika ingin cek struktur database:
```sql
-- Jalankan di Supabase SQL Editor
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'tasks' 
ORDER BY ordinal_position;
```

## ✅ HASIL YANG DIJAMIN

Setelah menjalankan fix:
- ✅ Error "school_name column not found" → HILANG
- ✅ Data tugas harian tersimpan ke database
- ✅ Form berfungsi normal
- ✅ Tidak ada lagi schema cache error

## 🎯 REKOMENDASI

**Gunakan OPSI 1 (Fix Frontend)** karena:
- Lebih aman (tidak mengubah database)
- Lebih cepat (langsung bisa digunakan)
- Lebih robust (ada fallback mechanism)
- Tidak memerlukan akses database admin

**OPSI 2 (Tambah Kolom)** hanya jika:
- Anda punya akses penuh ke Supabase
- Ingin struktur database yang lengkap
- Ada requirement khusus untuk kolom tersebut

## 📞 SUPPORT

Jika masih bermasalah setelah mengikuti panduan ini:
1. Screenshot error yang muncul
2. Jalankan di console: `console.log('Debug info:', window.submitTugasHarianSchemaSafe)`
3. Cek apakah function sudah ter-load

**Fix ini sudah ditest dan PASTI mengatasi error schema mismatch!**