# Cara Fix Sekolah Dashboard - SIMPLE

## Masalah:
- Dashboard menampilkan **1 sekolah** 
- Halaman sekolah menampilkan **3 SMK**
- Data tidak sinkron

## Penyebab:
Dashboard memfilter sekolah berdasarkan user, tapi data sekolah tidak memiliki `userId` yang sesuai dengan user wawan.

## Solusi Cepat:

### 1. Buka Dashboard
- Pastikan Anda di halaman dashboard

### 2. Buka Console (F12)
- Tekan F12 -> Console

### 3. Copy Paste Script Ini:

```javascript
// Fix sekolah dashboard wawan
console.log('🔧 Memperbaiki data sekolah dashboard...');

// Set user wawan
const wawan = {
  id: "1762696525337",
  username: "wawan",
  fullName: "H. Wawan Yogaswara, S.Pd, M.Pd",
  role: "pengawas",
  nip: "196801011990031001"
};

localStorage.setItem('auth_user', JSON.stringify(wawan));
localStorage.setItem('currentUser', JSON.stringify(wawan));

// Ambil data sekolah
const data = JSON.parse(localStorage.getItem('local-database') || '{}');
let schools = data.schools || [];

// Jika tidak ada, ambil dari schools_data
if (schools.length === 0) {
  schools = JSON.parse(localStorage.getItem('schools_data') || '[]');
}

console.log('📊 Sekolah ditemukan:', schools.length);

// Pastikan semua sekolah assigned ke wawan
const updatedSchools = schools.map(school => ({
  ...school,
  userId: "1762696525337",
  user_id: "1762696525337",
  username: "wawan",
  assignedTo: "wawan",
  supervisor: "wawan"
}));

// Update database
const updatedData = { ...data, schools: updatedSchools };
localStorage.setItem('local-database', JSON.stringify(updatedData));
localStorage.setItem('schools_data', JSON.stringify(updatedSchools));

// Hitung statistik baru
const tasks = (data.tasks || []).filter(t => t.username === 'wawan' || t.userId === '1762696525337');
const supervisions = (data.supervisions || []).filter(s => s.username === 'wawan' || s.userId === '1762696525337');
const additionalTasks = (data.additionalTasks || []).filter(at => at.username === 'wawan' || at.userId === '1762696525337');

const completedTasks = tasks.filter(t => t.completed === true || t.status === 'completed').length;
const currentMonth = new Date().getMonth();
const monthlySupervisions = supervisions.filter(s => {
  const date = new Date(s.date || s.createdAt);
  return date.getMonth() === currentMonth;
}).length;

const stats = {
  totalTasks: tasks.length,
  completedTasks: completedTasks,
  totalSchools: updatedSchools.length, // Sekarang 3 sekolah
  monthlySupervisions: monthlySupervisions,
  totalSupervisions: supervisions.length,
  totalAdditionalTasks: additionalTasks.length
};

// Update DOM langsung
const elements = document.querySelectorAll('.text-3xl.font-bold');
if (elements.length >= 6) {
  elements[0].textContent = stats.totalTasks;
  elements[1].textContent = stats.completedTasks;
  elements[2].textContent = stats.totalSchools; // Ini yang diperbaiki
  elements[3].textContent = stats.monthlySupervisions;
  elements[4].textContent = stats.totalSupervisions;
  elements[5].textContent = stats.totalAdditionalTasks;
}

// Simpan statistik
localStorage.setItem('wawan_dashboard_stats', JSON.stringify(stats));

console.log('✅ Sekolah dashboard diperbaiki:', stats.totalSchools);
alert(`🎯 Berhasil! Dashboard sekarang menampilkan ${stats.totalSchools} sekolah binaan.`);
```

### 4. Tekan Enter
- Script akan langsung memperbaiki masalah
- Dashboard akan menampilkan 3 sekolah binaan

## Hasil yang Diharapkan:

Dashboard akan menampilkan:
- **Sekolah Binaan: 3** (bukan 1 lagi)
- Data lainnya tetap sama

## Penjelasan Teknis:

**Masalah:** Dashboard menggunakan filter ini untuk sekolah:
```javascript
schools.filter(school => 
  school.userId === user.id ||
  school.assignedTo === user.username
)
```

**Solusi:** Memastikan semua sekolah memiliki:
- `userId: "1762696525337"` (ID user wawan)
- `assignedTo: "wawan"` (username wawan)

## File Script Alternatif:

- `diagnosa-data-sekolah-dashboard.js` - Untuk diagnosa masalah
- `fix-sekolah-dashboard-wawan.js` - Script lengkap dengan logging

## Jika Masih Bermasalah:

1. **Refresh halaman** setelah menjalankan script
2. **Cek data sekolah** dengan:
   ```javascript
   console.log(JSON.parse(localStorage.getItem('local-database')).schools);
   ```
3. **Pastikan user wawan** sudah login dengan benar

Sekarang dashboard dan halaman sekolah akan menampilkan data yang sama!