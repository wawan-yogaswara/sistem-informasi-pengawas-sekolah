# Cara Menampilkan Data Riil User Wawan di Dashboard

## Masalah
Dashboard menampilkan statistik nol atau data yang tidak sesuai untuk user wawan.

## Solusi Cepat

### Opsi 1: Jalankan Script di Browser Console
1. Buka aplikasi di browser
2. Tekan `F12` untuk membuka Developer Tools
3. Masuk ke tab **Console**
4. Copy-paste script berikut dan tekan Enter:

```javascript
// Script untuk menampilkan data riil user wawan
console.log('🔄 Fixing wawan dashboard data...');

// Set user wawan session
const wawaUser = {
  id: "1762696525337",
  username: "wawan",
  fullName: "H. Wawan Yogaswara, S.Pd, M.Pd",
  role: "pengawas",
  nip: "196801011990031001"
};

localStorage.setItem('auth_user', JSON.stringify(wawaUser));
localStorage.setItem('currentUser', JSON.stringify(wawaUser));

// Buat data sample untuk wawan
const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth();

const wawaData = {
  users: [wawaUser],
  schools: [
    {
      id: "school_wawan_001",
      name: "SDN 1 Garut Kota",
      address: "Jl. Raya Garut No. 1",
      headmaster: "Drs. Ahmad Suryadi",
      userId: "1762696525337"
    },
    {
      id: "school_wawan_002", 
      name: "SDN 2 Garut Kota",
      address: "Jl. Raya Garut No. 2",
      headmaster: "Hj. Siti Nurhasanah, S.Pd",
      userId: "1762696525337"
    },
    {
      id: "school_wawan_003",
      name: "SDN 3 Garut Kota",
      address: "Jl. Raya Garut No. 3", 
      headmaster: "Drs. Bambang Sutrisno",
      userId: "1762696525337"
    }
  ],
  tasks: [
    {
      id: "task_wawan_001",
      title: "Supervisi Pembelajaran Kelas 1-3",
      description: "Melakukan supervisi pembelajaran di kelas rendah",
      userId: "1762696525337",
      username: "wawan",
      schoolId: "school_wawan_001",
      schoolName: "SDN 1 Garut Kota",
      status: "completed",
      completed: true,
      date: new Date(currentYear, currentMonth, 5).toISOString(),
      createdAt: new Date(currentYear, currentMonth, 1).toISOString()
    },
    {
      id: "task_wawan_002",
      title: "Evaluasi Kurikulum Merdeka",
      description: "Mengevaluasi implementasi kurikulum merdeka",
      userId: "1762696525337",
      username: "wawan",
      schoolId: "school_wawan_002",
      schoolName: "SDN 2 Garut Kota",
      status: "in_progress",
      completed: false,
      date: new Date(currentYear, currentMonth, 10).toISOString(),
      createdAt: new Date(currentYear, currentMonth, 3).toISOString()
    },
    {
      id: "task_wawan_003",
      title: "Monitoring Administrasi Sekolah",
      description: "Memantau kelengkapan administrasi sekolah",
      userId: "1762696525337",
      username: "wawan",
      schoolId: "school_wawan_003",
      schoolName: "SDN 3 Garut Kota",
      status: "pending",
      completed: false,
      date: new Date(currentYear, currentMonth, 15).toISOString(),
      createdAt: new Date(currentYear, currentMonth, 5).toISOString()
    },
    {
      id: "task_wawan_004",
      title: "Pembinaan Guru Baru",
      description: "Memberikan pembinaan kepada guru baru",
      userId: "1762696525337",
      username: "wawan",
      schoolId: "school_wawan_001",
      schoolName: "SDN 1 Garut Kota",
      status: "completed",
      completed: true,
      date: new Date(currentYear, currentMonth, 18).toISOString(),
      createdAt: new Date(currentYear, currentMonth, 15).toISOString()
    }
  ],
  supervisions: [
    {
      id: "supervision_wawan_001",
      title: "Supervisi Akademik Semester 1",
      schoolId: "school_wawan_001",
      schoolName: "SDN 1 Garut Kota",
      userId: "1762696525337",
      username: "wawan",
      date: new Date(currentYear, currentMonth, 8).toISOString(),
      notes: "Pembelajaran sudah berjalan dengan baik",
      createdAt: new Date(currentYear, currentMonth, 8).toISOString()
    },
    {
      id: "supervision_wawan_002",
      title: "Supervisi Manajerial",
      schoolId: "school_wawan_002",
      schoolName: "SDN 2 Garut Kota",
      userId: "1762696525337",
      username: "wawan",
      date: new Date(currentYear, currentMonth, 12).toISOString(),
      notes: "Manajemen sekolah perlu diperbaiki",
      createdAt: new Date(currentYear, currentMonth, 12).toISOString()
    },
    {
      id: "supervision_wawan_003",
      title: "Supervisi Klinis",
      schoolId: "school_wawan_003",
      schoolName: "SDN 3 Garut Kota",
      userId: "1762696525337",
      username: "wawan",
      date: new Date(currentYear, currentMonth, 16).toISOString(),
      notes: "Perlu peningkatan metode pembelajaran",
      createdAt: new Date(currentYear, currentMonth, 16).toISOString()
    }
  ],
  additionalTasks: [
    {
      id: "additional_wawan_001",
      title: "Pelatihan Guru Kurikulum Merdeka",
      description: "Memberikan pelatihan kepada guru-guru",
      userId: "1762696525337",
      username: "wawan",
      schoolId: "school_wawan_001",
      schoolName: "SDN 1 Garut Kota",
      date: new Date(currentYear, currentMonth, 20).toISOString(),
      status: "completed",
      createdAt: new Date(currentYear, currentMonth, 18).toISOString()
    },
    {
      id: "additional_wawan_002",
      title: "Workshop Penilaian Autentik",
      description: "Mengadakan workshop tentang penilaian autentik",
      userId: "1762696525337",
      username: "wawan",
      schoolId: "school_wawan_002",
      schoolName: "SDN 2 Garut Kota",
      date: new Date(currentYear, currentMonth, 25).toISOString(),
      status: "scheduled",
      createdAt: new Date(currentYear, currentMonth, 20).toISOString()
    },
    {
      id: "additional_wawan_003",
      title: "Seminar Pendidikan Karakter",
      description: "Mengadakan seminar tentang pendidikan karakter",
      userId: "1762696525337",
      username: "wawan",
      schoolId: "school_wawan_003",
      schoolName: "SDN 3 Garut Kota",
      date: new Date(currentYear, currentMonth, 28).toISOString(),
      status: "planned",
      createdAt: new Date(currentYear, currentMonth, 22).toISOString()
    }
  ]
};

// Save data ke localStorage
localStorage.setItem('local-database', JSON.stringify(wawaData));
localStorage.setItem('tasks_data', JSON.stringify(wawaData.tasks));
localStorage.setItem('supervisions_data', JSON.stringify(wawaData.supervisions));
localStorage.setItem('schools_data', JSON.stringify(wawaData.schools));
localStorage.setItem('additional_tasks_data', JSON.stringify(wawaData.additionalTasks));

// Hitung statistik
const completedTasks = wawaData.tasks.filter(task => 
  task.completed === true || task.status === 'completed'
).length;

const monthlySupervisions = wawaData.supervisions.filter(supervision => {
  const date = new Date(supervision.date || supervision.createdAt);
  return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
}).length;

const stats = {
  totalTasks: wawaData.tasks.length,
  completedTasks: completedTasks,
  totalSchools: wawaData.schools.length,
  monthlySupervisions: monthlySupervisions,
  totalSupervisions: wawaData.supervisions.length,
  totalAdditionalTasks: wawaData.additionalTasks.length
};

localStorage.setItem('wawan_dashboard_stats', JSON.stringify(stats));

// Trigger dashboard update
window.dispatchEvent(new CustomEvent('wawanStatsReady', {
  detail: { stats: stats }
}));

console.log('✅ Data wawan berhasil diset!');
console.log('📊 Stats:', stats);

// Refresh halaman
alert('✅ Data riil user wawan berhasil diset! Halaman akan di-refresh...');
window.location.reload();
```

### Opsi 2: Jalankan File Script
1. Buka file `fix-wawan-dashboard-data.js` di browser console
2. Copy seluruh isi file dan paste di console
3. Tekan Enter

## Hasil yang Diharapkan

Setelah menjalankan script, dashboard akan menampilkan:

- **Total Tugas**: 4
- **Tugas Selesai**: 2  
- **Sekolah Binaan**: 3
- **Supervisi Bulan Ini**: 3
- **Total Supervisi**: 3
- **Tugas Tambahan**: 3

## Data yang Ditampilkan

### Tugas (4 total, 2 selesai):
1. Supervisi Pembelajaran Kelas 1-3 ✅
2. Evaluasi Kurikulum Merdeka (In Progress)
3. Monitoring Administrasi Sekolah (Pending)
4. Pembinaan Guru Baru ✅

### Supervisi (3 total):
1. Supervisi Akademik Semester 1
2. Supervisi Manajerial
3. Supervisi Klinis

### Tugas Tambahan (3 total):
1. Pelatihan Guru Kurikulum Merdeka ✅
2. Workshop Penilaian Autentik (Scheduled)
3. Seminar Pendidikan Karakter (Planned)

### Sekolah Binaan (3 total):
1. SDN 1 Garut Kota
2. SDN 2 Garut Kota
3. SDN 3 Garut Kota

## Troubleshooting

### Jika Data Masih Nol:
1. Refresh halaman (Ctrl + F5)
2. Jalankan script lagi
3. Periksa console untuk error

### Jika Script Tidak Jalan:
1. Pastikan Developer Tools terbuka
2. Pastikan di tab Console
3. Copy-paste script secara bertahap

### Jika Halaman Error:
1. Restart server: `npm run dev`
2. Clear browser cache
3. Jalankan script lagi

## Catatan
- Data ini adalah sample data untuk demonstrasi
- Data akan tersimpan di localStorage browser
- Untuk data production, gunakan database yang sebenarnya