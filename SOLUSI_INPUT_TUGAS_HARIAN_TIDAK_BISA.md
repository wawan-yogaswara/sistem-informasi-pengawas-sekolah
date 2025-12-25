# SOLUSI: Input Tugas Harian Tidak Bisa

## MASALAH
User tidak bisa input data di halaman Tugas Harian. Muncul error "Could not find the 'school_name' column or 'topic' in the schema cache".

## PENYEBAB
1. **Schema Mismatch**: Form frontend menggunakan field yang tidak sesuai dengan database
2. **Cache Issues**: Schema cache yang corrupt atau outdated
3. **API Endpoint Issues**: API tidak menangani field dengan benar

## SOLUSI CEPAT (EMERGENCY)

### 1. EMERGENCY FIX (Recommended)
**File**: `EMERGENCY_FIX_INPUT_TUGAS_HARIAN.js`

**Cara Pakai**:
1. Buka halaman **Tugas Harian**
2. Buka **Developer Console** (F12)
3. Copy paste script dari file `EMERGENCY_FIX_INPUT_TUGAS_HARIAN.js`
4. Tekan **Enter**
5. Isi form seperti biasa dan klik **Simpan Tugas**

**Fitur**:
- ✅ Override form submit handler
- ✅ Override save button handler
- ✅ Clear semua cache
- ✅ Direct database insert
- ✅ Manual submit function backup

### 2. SCHEMA MISMATCH FIX
**File**: `FIX_INPUT_TUGAS_HARIAN_SCHEMA_MISMATCH.js`

**Cara Pakai**:
1. Buka halaman **Tugas Harian**
2. Buka **Developer Console** (F12)
3. Copy paste script dari file `FIX_INPUT_TUGAS_HARIAN_SCHEMA_MISMATCH.js`
4. Tekan **Enter**
5. Tunggu proses selesai (auto refresh)

**Fitur**:
- ✅ Diagnosis schema database
- ✅ Test API endpoints
- ✅ Clear cache comprehensive
- ✅ Manual workaround function

## CARA MANUAL JIKA SCRIPT GAGAL

### 1. Manual Submit via Console
```javascript
// Buka console (F12) dan jalankan:
submitTugasHarianManual()
```

### 2. Manual Submit dengan Data Custom
```javascript
// Buka console (F12) dan jalankan:
manualSubmitTugasHarian({
  title: 'Judul Tugas Anda',
  description: 'Deskripsi kegiatan',
  date: '2025-01-25',
  location: 'SMAN 4 GARUT',
  school: 'SMAN 4 GARUT'
});
```

### 3. Direct Database Insert
```javascript
// Setup Supabase
const { createClient } = await import('@supabase/supabase-js');
const supabase = createClient(
  'https://fmxeboullgcewzjpql.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZteGVib3VsbGdjZXd6anBxbCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM0NTk5NzI4LCJleHAiOjIwNTAxNzU3Mjh9.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8'
);

// Insert data
const { data, error } = await supabase
  .from('tasks')
  .insert([{
    title: 'Judul Tugas',
    description: 'Deskripsi',
    date: '2025-01-25',
    location: 'SMAN 4 GARUT',
    school: 'SMAN 4 GARUT',
    user_id: '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e',
    created_at: new Date().toISOString()
  }])
  .select();

console.log('Result:', data, error);
```

## TROUBLESHOOTING

### Jika masih error "schema cache":
1. Clear browser cache completely
2. Restart browser
3. Jalankan emergency fix lagi

### Jika tombol Simpan tidak respond:
1. Jalankan: `submitTugasHarianManual()`
2. Atau refresh halaman dan coba lagi

### Jika data tidak tersimpan:
1. Cek console untuk error messages
2. Cek koneksi internet
3. Cek apakah Supabase accessible

## VERIFIKASI HASIL

Setelah berhasil input:
1. ✅ Data muncul di halaman Tugas Harian
2. ✅ Data muncul di halaman Laporan sebagai "Tugas Pokok"
3. ✅ Tidak ada error di console

## FIELD MAPPING

Form menggunakan field:
- **Judul Tugas** → `title`
- **Deskripsi** → `description`  
- **Tanggal** → `date`
- **Tempat Kegiatan** → `location` dan `school`
- **Foto** → `photo1`, `photo2`

Database menyimpan ke tabel `tasks` dengan struktur:
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY,
  title TEXT,
  description TEXT,
  date DATE,
  location TEXT,
  school TEXT,
  user_id UUID,
  photo1 TEXT,
  photo2 TEXT,
  created_at TIMESTAMP
);
```

## REKOMENDASI

1. **Gunakan Emergency Fix** untuk solusi cepat
2. **Clear cache browser** secara berkala
3. **Monitor console** untuk error messages
4. **Backup data** sebelum input banyak data

## HASIL YANG DIHARAPKAN

Setelah fix berhasil:
- ✅ Form input berfungsi normal
- ✅ Data tersimpan ke database
- ✅ Muncul di halaman Tugas Harian
- ✅ Muncul di halaman Laporan
- ✅ Tidak ada error schema cache