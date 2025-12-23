# 📊 Solusi Simpel Statistik Dashboard User Wawan

## 🎯 Tujuan
Menampilkan statistik dashboard berdasarkan data user Wawan yang tersimpan di localStorage saja.

## 🚀 Solusi Cepat (Copy-Paste ke Console)

Buka Console Browser (F12 → Console) dan jalankan script ini:

```javascript
// 📊 Script Simpel Statistik Dashboard User Wawan
console.log('🔄 Loading statistik user Wawan...');

// 1. Set user Wawan sebagai current user
const wawanUser = {
    id: "1762696525337",
    username: "wawan", 
    fullName: "Wawan Setiawan",
    role: "user",
    nip: "196801011990031001"
};
localStorage.setItem('auth_user', JSON.stringify(wawanUser));
localStorage.setItem('currentUser', JSON.stringify(wawanUser));

// 2. Ambil semua data dari localStorage
const localData = JSON.parse(localStorage.getItem('local-database') || '{}');
const tasksData = JSON.parse(localStorage.getItem('tasks_data') || '[]');
const supervisionsData = JSON.parse(localStorage.getItem('supervisions_data') || '[]');
const schoolsData = JSON.parse(localStorage.getItem('schools_data') || '[]');
const additionalTasksData = JSON.parse(localStorage.getItem('additional_tasks_data') || '[]');

// 3. Gabungkan data
const allTasks = localData.tasks || tasksData || [];
const allSupervisions = localData.supervisions || supervisionsData || [];
const allSchools = localData.schools || schoolsData || [];
const allAdditionalTasks = localData.additionalTasks || additionalTasksData || [];

// 4. Filter hanya data user Wawan
const wawanTasks = allTasks.filter(task => 
    task.username === 'wawan' || task.userId === '1762696525337'
);

const wawanSupervisions = allSupervisions.filter(supervision => 
    supervision.username === 'wawan' || supervision.userId === '1762696525337'
);

const wawanAdditionalTasks = allAdditionalTasks.filter(task => 
    task.username === 'wawan' || task.userId === '1762696525337'
);

// 5. Sekolah yang disupervisi Wawan
const wawanSchoolIds = [...new Set(wawanSupervisions.map(s => s.schoolId || s.school_id))];
const wawanSchools = allSchools.filter(school => wawanSchoolIds.includes(school.id));

// 6. Hitung statistik
const completedTasks = wawanTasks.filter(task => 
    task.completed === true || task.status === 'completed'
).length;

const currentMonth = new Date().getMonth();
const currentYear = new Date().getFullYear();

const monthlySupervisions = wawanSupervisions.filter(supervision => {
    const date = new Date(supervision.date || supervision.createdAt);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
}).length;

const wawanStats = {
    totalTasks: wawanTasks.length,
    completedTasks: completedTasks,
    totalSchools: wawanSchools.length,
    monthlySupervisions: monthlySupervisions,
    totalSupervisions: wawanSupervisions.length,
    totalAdditionalTasks: wawanAdditionalTasks.length
};

// 7. Simpan statistik
localStorage.setItem('wawan_statistics', JSON.stringify(wawanStats));

// 8. Trigger refresh
window.dispatchEvent(new Event('storage'));
window.dispatchEvent(new CustomEvent('dashboardRefresh'));

// 9. Tampilkan hasil
console.log('✅ Statistik User Wawan:', wawanStats);
console.log('📋 Data Wawan:', {
    tasks: wawanTasks.length,
    supervisions: wawanSupervisions.length, 
    schools: wawanSchools.length,
    additionalTasks: wawanAdditionalTasks.length
});

// 10. Reload halaman untuk melihat perubahan
setTimeout(() => {
    if (confirm('Reload halaman untuk melihat statistik terbaru?')) {
        window.location.reload();
    }
}, 1000);

console.log('🎉 Selesai! Statistik dashboard user Wawan berhasil dimuat.');
```

## 📋 Hasil yang Diharapkan

Setelah menjalankan script:
- Dashboard akan menampilkan statistik berdasarkan data user Wawan saja
- Data diambil dari localStorage yang sudah ada
- Tidak ada data user lain yang ditampilkan
- Statistik akan konsisten di semua browser

## 🔍 Verifikasi

Untuk memverifikasi hasilnya, jalankan:

```javascript
// Cek statistik yang tersimpan
const stats = JSON.parse(localStorage.getItem('wawan_statistics') || '{}');
console.log('📊 Statistik Wawan:', stats);

// Cek user yang aktif
const currentUser = JSON.parse(localStorage.getItem('auth_user') || '{}');
console.log('👤 User aktif:', currentUser.fullName);
```

## 🛠️ Troubleshooting

### Jika statistik masih nol:
1. Pastikan ada data di localStorage:
   ```javascript
   console.log('Data check:', {
       localDatabase: !!localStorage.getItem('local-database'),
       tasksData: !!localStorage.getItem('tasks_data'),
       supervisionsData: !!localStorage.getItem('supervisions_data')
   });
   ```

2. Cek apakah data memiliki username/userId yang benar:
   ```javascript
   const tasks = JSON.parse(localStorage.getItem('tasks_data') || '[]');
   console.log('Sample task:', tasks[0]);
   ```

### Jika masih ada masalah:
- Jalankan script `fix-dashboard-statistik-wawan-simple.js` untuk solusi lengkap
- Atau reload halaman dan coba lagi

---

**Catatan**: Script ini hanya mengambil dan menampilkan data yang sudah ada di localStorage untuk user Wawan. Tidak ada data dummy atau data user lain yang akan ditampilkan.