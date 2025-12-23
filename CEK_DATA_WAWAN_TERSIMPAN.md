# Cara Cek Data User Wawan Tersimpan di localStorage

## Masalah
Data yang diinput oleh user Wawan tidak muncul di dashboard dan halaman lainnya.

## Cara Cek Data

### 1. Buka Developer Console
- Tekan F12 di browser Chrome
- Pilih tab "Console"

### 2. Jalankan Script Pemeriksaan
Copy dan paste script ini ke console:

```javascript
// Cek data user Wawan
const authUser = JSON.parse(localStorage.getItem('auth_user') || '{}');
const tasksData = JSON.parse(localStorage.getItem('tasks_data') || '[]');
const supervisionsData = JSON.parse(localStorage.getItem('supervisions_data') || '[]');
const additionalTasksData = JSON.parse(localStorage.getItem('additional_tasks_data') || '[]');

console.log('Current User:', authUser);
console.log('Total Tasks:', tasksData.length);
console.log('Total Supervisions:', supervisionsData.length);
console.log('Total Additional Tasks:', additionalTasksData.length);

// Filter data untuk user Wawan
const wawaTasks = tasksData.filter(t => 
  t.userId === '1762696525337' || 
  t.username === 'wawan'
);

console.log('Wawan Tasks:', wawaTasks.length);
console.log('Detail:', wawaTasks);
```

### 3. Cek Hasil
- Jika `Total Tasks: 0` → Data tidak tersimpan
- Jika `Wawan Tasks: 0` tapi `Total Tasks > 0` → Data tersimpan tapi tidak terhubung dengan user Wawan
- Jika `Wawan Tasks > 0` → Data tersimpan dengan benar

## Penyebab Masalah

### 1. User ID Tidak Tersimpan
Saat menginput data, user ID tidak disertakan atau salah.

**Solusi:**
```javascript
// Pastikan user Wawan tersimpan dengan benar
const wawaUser = {
    id: "1762696525337",
    username: "wawan",
    fullName: "Wawan Setiawan",
    role: "user",
    nip: "196801011990031001"
};

localStorage.setItem('auth_user', JSON.stringify(wawaUser));
localStorage.setItem('currentUser', JSON.stringify(wawaUser));
```

### 2. Data Tersimpan Tanpa User ID
Data tersimpan tapi tidak ada field `userId` atau `username`.

**Solusi - Perbaiki Data yang Ada:**
```javascript
// Ambil semua tasks
const tasksData = JSON.parse(localStorage.getItem('tasks_data') || '[]');

// Tambahkan user ID ke semua tasks yang belum punya
const fixedTasks = tasksData.map(task => {
  if (!task.userId && !task.username) {
    return {
      ...task,
      userId: '1762696525337',
      username: 'wawan'
    };
  }
  return task;
});

// Simpan kembali
localStorage.setItem('tasks_data', JSON.stringify(fixedTasks));
console.log('✅ Tasks diperbaiki!');
```

### 3. Data Tersimpan di Tempat yang Salah
Data mungkin tersimpan di `local-database` tapi tidak di `tasks_data`.

**Solusi - Sync Data:**
```javascript
// Ambil dari local-database
const localDatabase = JSON.parse(localStorage.getItem('local-database') || '{}');

// Sync ke individual keys
if (localDatabase.tasks) {
  localStorage.setItem('tasks_data', JSON.stringify(localDatabase.tasks));
}
if (localDatabase.supervisions) {
  localStorage.setItem('supervisions_data', JSON.stringify(localDatabase.supervisions));
}
if (localDatabase.additionalTasks) {
  localStorage.setItem('additional_tasks_data', JSON.stringify(localDatabase.additionalTasks));
}

console.log('✅ Data di-sync!');
```

## Cara Test Setelah Perbaikan

1. Refresh halaman dashboard
2. Cek apakah statistik muncul
3. Buka halaman Tasks/Supervisions/Additional Tasks
4. Cek apakah data muncul di list

## Script Lengkap untuk Perbaikan

Jalankan script `check-localStorage-data.js` di console untuk diagnosis lengkap:

```javascript
// Load script
const script = document.createElement('script');
script.src = '/check-localStorage-data.js';
document.head.appendChild(script);
```

Atau copy isi file `check-localStorage-data.js` dan paste ke console.

## Catatan Penting

- Data di localStorage bersifat per-domain dan per-browser
- Jika buka di browser berbeda, data tidak akan sama
- Jika clear cache/cookies, data akan hilang
- Untuk production, gunakan database (Supabase) bukan localStorage