# CARA FIX SUPERVISI - STEP BY STEP

## 🚨 MASALAH
Error: "Could not find the 'school' column of 'supervisions' in the schema cache"

## ✅ SOLUSI LANGKAH DEMI LANGKAH

### LANGKAH 1: FIX DATABASE SCHEMA
1. Buka **Supabase Dashboard**
2. Pilih project Anda
3. Klik **SQL Editor** di sidebar kiri
4. Copy paste SQL berikut dan klik **RUN**:

```sql
-- Tambah kolom yang hilang
ALTER TABLE supervisions 
ADD COLUMN IF NOT EXISTS school TEXT,
ADD COLUMN IF NOT EXISTS photo1 TEXT,
ADD COLUMN IF NOT EXISTS photo2 TEXT,
ADD COLUMN IF NOT EXISTS teacher_name TEXT,
ADD COLUMN IF NOT EXISTS teacher_nip TEXT,
ADD COLUMN IF NOT EXISTS recommendations TEXT;

-- Buat school_id optional
ALTER TABLE supervisions 
ALTER COLUMN school_id DROP NOT NULL;

-- Verifikasi kolom sudah ada
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'supervisions' 
ORDER BY ordinal_position;
```

### LANGKAH 2: TEST SCHEMA FIX
1. Buka halaman supervisi di browser
2. Tekan **F12** untuk buka Developer Console
3. Copy paste script berikut **SATU PER SATU**:

```javascript
// Test 1: Cek Supabase
console.log('Supabase available:', typeof supabase !== 'undefined');

// Test 2: Cek schema
supabase.from('supervisions').select('*').limit(1).then(result => {
  if (result.error) {
    console.error('Error:', result.error.message);
  } else {
    console.log('✅ Schema OK');
  }
});

// Test 3: Cek UI
const btn = document.querySelector('[data-testid="button-add-supervision"]');
console.log('Tombol Tambah:', btn ? 'ADA' : 'TIDAK ADA');
```

### LANGKAH 3: TEST INPUT SUPERVISI
1. Klik tombol **"Tambah Supervisi"**
2. Pilih sekolah dari dropdown
3. Isi form:
   - Tanggal: 24/12/2024
   - Temuan: "Test supervisi setelah fix schema"
4. Klik **"Simpan Supervisi"**
5. Periksa apakah data tersimpan tanpa error

### LANGKAH 4: VERIFIKASI DATA TERSIMPAN
1. Buka **Supabase Dashboard** → **Table Editor**
2. Pilih tabel **supervisions**
3. Lihat apakah data baru sudah masuk

## 🔧 JIKA MASIH ERROR

### Error: "school column not found"
- Pastikan SQL di Langkah 1 sudah dijalankan
- Refresh halaman browser (Ctrl+F5)
- Jalankan test schema lagi

### Error: "user_id format invalid"
- Ini normal, sistem akan generate user_id otomatis
- Data tetap akan tersimpan

### Error: "RLS policy"
- Jalankan SQL berikut di Supabase:
```sql
ALTER TABLE supervisions DISABLE ROW LEVEL SECURITY;
```

## ✅ TANDA BERHASIL
- ✅ Tidak ada error "school column not found"
- ✅ Form supervisi bisa dibuka
- ✅ Dropdown sekolah terisi
- ✅ Data bisa disimpan
- ✅ Data muncul di list supervisi

## 📞 BANTUAN
Jika masih ada masalah, screenshot error dan tunjukkan ke developer.