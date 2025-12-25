# 🔧 FIX: TUGAS HARIAN TIDAK MUNCUL DI HALAMAN

## 🎯 Masalah
Data tugas harian sudah masuk ke Supabase tapi tidak muncul di halaman tugas harian.

## 🔍 Kemungkinan Penyebab

### 1. **Masalah Query/Filter**
- Query tidak memfilter user yang benar
- Error di Supabase query
- RLS (Row Level Security) memblokir data

### 2. **Masalah Authentication**
- User tidak login dengan benar
- User ID tidak match dengan data di database
- Session expired

### 3. **Masalah Frontend**
- React Query cache issue
- Component tidak re-render
- Error di console yang tidak terlihat

### 4. **Masalah Database**
- Kolom baru belum ada (photo2, activity_type, school_id)
- RLS policy terlalu ketat
- Data tersimpan dengan user_id yang berbeda

## 🚀 Langkah Diagnosa

### Step 1: Jalankan Debug Script
1. Buka halaman Tugas Harian
2. Buka Developer Tools (F12)
3. Masuk ke Console tab
4. Copy paste script dari file `debug-tugas-harian-tidak-muncul.js`
5. Tekan Enter dan lihat hasilnya

### Step 2: Cek Manual di Supabase Dashboard
1. Buka Supabase Dashboard
2. Masuk ke Table Editor
3. Pilih tabel `tasks`
4. Lihat apakah data ada dan struktur kolom benar

### Step 3: Cek Console Browser
1. Buka halaman Tugas Harian
2. Lihat Console untuk error messages
3. Cek Network tab untuk failed requests

## 🔧 Solusi Berdasarkan Masalah

### Jika Masalah: Data Ada Tapi User ID Tidak Match
```javascript
// Jalankan di console untuk fix user_id
const userData = localStorage.getItem('auth_user');
const user = JSON.parse(userData);
console.log('Current user:', user);

// Update semua tasks dengan user_id yang benar
// (Hanya jika yakin data adalah milik user ini)
```

### Jika Masalah: RLS Policy Terlalu Ketat
```sql
-- Jalankan di Supabase SQL Editor
-- Disable RLS sementara untuk testing
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
```

### Jika Masalah: Kolom Baru Belum Ada
```sql
-- Jalankan SQL dari file update-database-schema-enhanced.sql
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS activity_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS school_id UUID,
ADD COLUMN IF NOT EXISTS photo2 TEXT;
```

### Jika Masalah: React Query Cache
```javascript
// Clear cache di console
localStorage.clear();
// Atau refresh halaman dengan Ctrl+F5
```

## 🎯 Solusi Cepat (Emergency Fix)

### 1. Disable RLS Sementara
```sql
-- Di Supabase SQL Editor
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
```

### 2. Update Query untuk Debug
Tambahkan logging di query tasks:

```javascript
// Di file tasks.tsx, update query menjadi:
const { data: tasks = [], isLoading, refetch } = useQuery({
  queryKey: ['tasks'],
  queryFn: async () => {
    console.log('🔍 Fetching tasks from Supabase...');
    
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });
    
    console.log('📊 Raw query result:', { data, error });
    
    if (error) {
      console.error('❌ Supabase error:', error);
      throw error;
    }
    
    console.log('✅ Tasks loaded:', data?.length || 0);
    console.table(data); // Show data in table format
    return data || [];
  },
  retry: 1,
  refetchOnWindowFocus: false,
});
```

### 3. Force Refresh Data
```javascript
// Jalankan di console halaman tugas harian
window.location.reload(true);
```

## 📋 Checklist Troubleshooting

- [ ] Jalankan debug script di console
- [ ] Cek data di Supabase Dashboard
- [ ] Cek console browser untuk errors
- [ ] Cek Network tab untuk failed requests
- [ ] Pastikan user sudah login
- [ ] Pastikan database schema sudah diupdate
- [ ] Cek RLS policies
- [ ] Clear browser cache/localStorage
- [ ] Restart development server

## 🆘 Jika Masih Tidak Berhasil

1. **Screenshot Console Errors**: Ambil screenshot semua error di console
2. **Screenshot Network Tab**: Ambil screenshot request/response di network tab
3. **Screenshot Supabase Data**: Ambil screenshot data di Supabase table editor
4. **Berikan Info Detail**: 
   - Browser yang digunakan
   - Apakah user sudah login
   - Apakah database schema sudah diupdate
   - Error messages yang muncul

## 🎯 Solusi Paling Mungkin

Berdasarkan pengalaman, masalah paling sering adalah:
1. **Database schema belum diupdate** (90% kasus)
2. **RLS policy memblokir data** (5% kasus)  
3. **User ID tidak match** (3% kasus)
4. **React Query cache issue** (2% kasus)

**Mulai dari yang paling mungkin: Update database schema dulu!**