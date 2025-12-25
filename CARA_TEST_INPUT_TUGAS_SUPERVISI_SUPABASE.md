# CARA TEST INPUT TUGAS DAN SUPERVISI KE SUPABASE

## Masalah yang Diperbaiki
- Input tugas baru tidak masuk ke Supabase
- Input supervisi tidak masuk ke Supabase
- Data hanya tersimpan di localStorage

## Perbaikan yang Dilakukan

### 1. Halaman Tasks (Tugas)
- ✅ Sudah menggunakan Supabase langsung
- ✅ Query menggunakan `supabase.from('tasks')`
- ✅ Insert menggunakan `supabase.from('tasks').insert()`
- ✅ Delete dan Update juga menggunakan Supabase

### 2. Halaman Supervisions (Supervisi)
- ✅ Diperbaiki dari localStorage ke Supabase langsung
- ✅ Query menggunakan `supabase.from('supervisions')`
- ✅ Insert menggunakan `supabase.from('supervisions').insert()`
- ✅ Update dan Delete juga menggunakan Supabase
- ✅ Field mapping diperbaiki (teacher_name, teacher_nip)

## Cara Test

### 1. Test Manual di Browser
1. Buka halaman Tasks atau Supervisions
2. Coba tambah data baru
3. Periksa di console browser apakah ada error
4. Periksa di Supabase dashboard apakah data masuk

### 2. Test dengan Script Console

#### Test Tugas:
```javascript
// Copy paste script dari test-tugas-supabase-langsung.js ke console browser
```

#### Test Supervisi:
```javascript
// Copy paste script dari test-supervisi-supabase-langsung.js ke console browser
```

### 3. Periksa di Supabase Dashboard
1. Login ke https://supabase.com
2. Pilih project Anda
3. Buka Table Editor
4. Periksa tabel `tasks` dan `supervisions`
5. Lihat apakah data baru masuk

## Troubleshooting

### Jika Input Masih Tidak Masuk:

1. **Periksa Console Browser**
   ```javascript
   // Buka Developer Tools (F12)
   // Lihat tab Console untuk error
   ```

2. **Periksa Koneksi Supabase**
   ```javascript
   // Test di console:
   console.log('Supabase client:', supabase);
   ```

3. **Periksa User Authentication**
   ```javascript
   // Test di console:
   const userData = localStorage.getItem('auth_user');
   console.log('User data:', userData ? JSON.parse(userData) : 'No user data');
   ```

4. **Periksa Schema Database**
   - Pastikan tabel `tasks` dan `supervisions` ada
   - Pastikan field sesuai dengan yang digunakan di code

### Field yang Digunakan:

#### Tabel Tasks:
- id (uuid, primary key)
- user_id (text)
- title (text)
- description (text)
- completed (boolean)
- date (date)
- photo (text, base64)
- created_at (timestamp)

#### Tabel Supervisions:
- id (uuid, primary key)
- user_id (text)
- school (text)
- type (text)
- date (date)
- teacher_name (text)
- teacher_nip (text)
- findings (text)
- recommendations (text)
- photo1 (text, base64)
- photo2 (text, base64)
- created_at (timestamp)

## Langkah Selanjutnya

1. Test input data baru di kedua halaman
2. Periksa apakah data masuk ke Supabase
3. Jika masih ada masalah, jalankan script test di console
4. Periksa error di console browser
5. Laporkan hasil test