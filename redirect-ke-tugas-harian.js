// 🚀 REDIRECT KE TUGAS HARIAN YANG BERFUNGSI
// Copy paste ke console browser

console.log('🚀 Redirecting ke halaman tugas harian yang berfungsi...');

// 1. Simpan data sample ke localStorage
const sampleTasks = [
  {
    id: 'task-1',
    title: 'Supervisi Pembelajaran Matematika',
    description: 'Melakukan supervisi pembelajaran mata pelajaran Matematika di kelas 5. Mengamati proses pembelajaran dan memberikan feedback kepada guru.',
    date: '2025-01-24',
    type: 'Pendampingan',
    school: 'SDN 1 Garut',
    completed: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-2',
    title: 'Penyusunan Laporan Bulanan',
    description: 'Menyusun laporan bulanan kegiatan supervisi dan pendampingan sekolah binaan untuk bulan Januari 2025.',
    date: '2025-01-24',
    type: 'Pelaporan',
    school: '',
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-3',
    title: 'Rapat Koordinasi Kepala Sekolah',
    description: 'Menghadiri rapat koordinasi dengan kepala sekolah binaan untuk membahas program peningkatan mutu pendidikan.',
    date: '2025-01-23',
    type: 'Perencanaan',
    school: 'SMPN 2 Garut',
    completed: true,
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

localStorage.setItem('tasks_data', JSON.stringify(sampleTasks));
console.log('✅ Data sample tugas disimpan');

// 2. Redirect ke halaman HTML yang berfungsi
setTimeout(() => {
  window.location.href = '/tugas-harian-simple.html';
}, 1000);

console.log('🎯 Redirecting dalam 1 detik ke halaman tugas harian yang berfungsi...');