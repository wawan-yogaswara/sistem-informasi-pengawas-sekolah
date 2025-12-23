# Cara Menampilkan Data User Wawan ke Dashboard - SIMPLE

## Langkah Mudah:

### 1. Buka Dashboard
- Buka halaman dashboard di browser
- Pastikan Anda sudah di halaman dashboard

### 2. Buka Console Browser
- Tekan `F12` atau klik kanan -> Inspect Element
- Pilih tab `Console`

### 3. Copy Paste Script Ini:

```javascript
// Script inject data wawan ke dashboard
console.log('📊 Menampilkan data wawan...');

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

// Ambil data dari localStorage
const data = JSON.parse(localStorage.getItem('local-database') || '{}');

// Filter data wawan
const tasks = (data.tasks || []).filter(t => t.username === 'wawan' || t.userId === '1762696525337');
const supervisions = (data.supervisions || []).filter(s => s.username === 'wawan' || s.userId === '1762696525337');
const schools = (data.schools || []).filter(sc => sc.username === 'wawan' || sc.userId === '1762696525337');
const additionalTasks = (data.additionalTasks || []).filter(at => at.username === 'wawan' || at.userId === '1762696525337');

// Hitung statistik
const completedTasks = tasks.filter(t => t.completed === true || t.status === 'completed').length;
const currentMonth = new Date().getMonth();
const monthlySupervisions = supervisions.filter(s => {
  const date = new Date(s.date || s.createdAt);
  return date.getMonth() === currentMonth;
}).length;

const stats = {
  totalTasks: tasks.length,
  completedTasks: completedTasks,
  totalSchools: schools.length,
  monthlySupervisions: monthlySupervisions,
  totalSupervisions: supervisions.length,
  totalAdditionalTasks: additionalTasks.length
};

// Update DOM langsung
const elements = document.querySelectorAll('.text-3xl.font-bold');
if (elements.length >= 6) {
  elements[0].textContent = stats.totalTasks;
  elements[1].textContent = stats.completedTasks;
  elements[2].textContent = stats.totalSchools;
  elements[3].textContent = stats.monthlySupervisions;
  elements[4].textContent = stats.totalSupervisions;
  elements[5].textContent = stats.totalAdditionalTasks;
  console.log('✅ Dashboard updated!');
}

// Update progress bar
if (stats.totalTasks > 0) {
  const percentage = Math.round((stats.completedTasks / stats.totalTasks) * 100);
  const progressBar = document.querySelector('.bg-gradient-to-r.from-green-400.to-green-600');
  if (progressBar) progressBar.style.width = `${percentage}%`;
  
  const percentageText = document.querySelector('.text-sm.font-bold.text-green-600');
  if (percentageText) percentageText.textContent = `${percentage}%`;
}

// Simpan untuk persistensi
localStorage.setItem('wawan_dashboard_stats', JSON.stringify(stats));

console.log('📊 Data wawan berhasil ditampilkan:', stats);
alert('✅ Data wawan berhasil ditampilkan di dashboard!');
```

### 4. Tekan Enter
- Script akan langsung berjalan
- Dashboard akan menampilkan data user wawan
- Tidak perlu refresh halaman

## Hasil yang Diharapkan:

Dashboard akan menampilkan:
- **Total Tugas**: Jumlah tugas user wawan
- **Tugas Selesai**: Tugas yang sudah completed
- **Sekolah Binaan**: Sekolah yang ditugaskan ke wawan
- **Supervisi Bulan Ini**: Supervisi bulan ini
- **Total Supervisi**: Semua supervisi wawan
- **Tugas Tambahan**: Tugas tambahan wawan

## Jika Tidak Berhasil:

1. **Refresh halaman** dan coba lagi
2. Pastikan data sudah ada di localStorage dengan script:
   ```javascript
   console.log(JSON.parse(localStorage.getItem('local-database') || '{}'));
   ```
3. Gunakan script alternatif di file `inject-wawan-dashboard-langsung.js`

## File Script Alternatif:

- `simple-dashboard-wawan.js` - Script sederhana dengan refresh
- `inject-wawan-dashboard-langsung.js` - Script inject tanpa refresh
- `tampilkan-data-wawan-ke-dashboard.js` - Script lengkap dengan validasi

Pilih salah satu yang paling cocok untuk situasi Anda.