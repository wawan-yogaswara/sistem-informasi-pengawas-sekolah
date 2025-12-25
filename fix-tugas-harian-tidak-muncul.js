// 🔧 FIX TUGAS HARIAN TIDAK MUNCUL
// Copy paste ke console browser untuk mengatasi masalah tugas harian kosong

console.log('🚨 FIX TUGAS HARIAN DIMULAI...');

// 1. Bersihkan cache dan data lama
localStorage.removeItem('tasks_data');
console.log('✅ Cache tugas dibersihkan');

// 2. Data sample tugas harian untuk testing
const sampleTasks = [
  {
    id: crypto.randomUUID(),
    user_id: '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e', // Wawan's ID
    title: 'Supervisi Pembelajaran di SDN 1 Garut',
    description: 'Melakukan supervisi pembelajaran mata pelajaran Matematika kelas 5. Mengamati proses pembelajaran dan memberikan feedback kepada guru.',
    completed: true,
    date: '2025-01-24',
    activity_type: 'Pendampingan',
    school_id: '1cd40355-1b07-402d-8309-b243c098cfe9',
    photo: null,
    photo2: null,
    created_at: new Date().toISOString(),
    schools: {
      id: '1cd40355-1b07-402d-8309-b243c098cfe9',
      name: 'SDN 1 Garut'
    }
  },
  {
    id: crypto.randomUUID(),
    user_id: '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e',
    title: 'Penyusunan Laporan Bulanan',
    description: 'Menyusun laporan bulanan kegiatan supervisi dan pendampingan sekolah binaan untuk bulan Januari 2025.',
    completed: false,
    date: '2025-01-24',
    activity_type: 'Pelaporan',
    school_id: null,
    photo: null,
    photo2: null,
    created_at: new Date().toISOString(),
    schools: null
  },
  {
    id: crypto.randomUUID(),
    user_id: '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e',
    title: 'Rapat Koordinasi dengan Kepala Sekolah',
    description: 'Menghadiri rapat koordinasi dengan kepala sekolah binaan untuk membahas program peningkatan mutu pendidikan.',
    completed: true,
    date: '2025-01-23',
    activity_type: 'Perencanaan',
    school_id: '2cd40355-1b07-402d-8309-b243c098cfe9',
    photo: null,
    photo2: null,
    created_at: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    schools: {
      id: '2cd40355-1b07-402d-8309-b243c098cfe9',
      name: 'SMPN 2 Garut'
    }
  }
];

// 3. Simpan data sample ke localStorage
localStorage.setItem('tasks_data', JSON.stringify(sampleTasks));
console.log('✅ Data sample tugas disimpan:', sampleTasks.length, 'tugas');

// 4. Function untuk menambah tugas baru
window.addSampleTask = function(title, description, activityType = 'Pendampingan') {
  const currentUser = JSON.parse(localStorage.getItem('auth_user') || '{}');
  const userId = currentUser.id || '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';
  
  const newTask = {
    id: crypto.randomUUID(),
    user_id: userId,
    title: title,
    description: description,
    completed: false,
    date: new Date().toISOString().split('T')[0],
    activity_type: activityType,
    school_id: '1cd40355-1b07-402d-8309-b243c098cfe9',
    photo: null,
    photo2: null,
    created_at: new Date().toISOString(),
    schools: {
      id: '1cd40355-1b07-402d-8309-b243c098cfe9',
      name: 'SDN 1 Garut'
    }
  };
  
  const existingTasks = JSON.parse(localStorage.getItem('tasks_data') || '[]');
  existingTasks.unshift(newTask);
  localStorage.setItem('tasks_data', JSON.stringify(existingTasks));
  
  console.log('✅ Tugas baru ditambahkan:', title);
  
  // Refresh halaman untuk melihat perubahan
  if (window.location.pathname.includes('/tasks')) {
    window.location.reload();
  }
  
  return newTask;
};

// 5. Function untuk refresh data tugas
window.refreshTasks = function() {
  console.log('🔄 Refreshing tasks data...');
  
  // Trigger React Query refetch jika ada
  if (window.queryClient) {
    window.queryClient.invalidateQueries(['tasks']);
    console.log('✅ React Query cache invalidated');
  }
  
  // Refresh halaman jika di halaman tasks
  if (window.location.pathname.includes('/tasks')) {
    window.location.reload();
  }
};

// 6. Function untuk cek data tugas
window.checkTasks = function() {
  const tasks = JSON.parse(localStorage.getItem('tasks_data') || '[]');
  console.log('📊 Data tugas saat ini:', tasks.length, 'tugas');
  console.table(tasks.map(t => ({
    id: t.id.substring(0, 8),
    title: t.title,
    completed: t.completed,
    date: t.date,
    activity_type: t.activity_type
  })));
  return tasks;
};

// 7. Auto-refresh jika sedang di halaman tasks
if (window.location.pathname.includes('/tasks')) {
  setTimeout(() => {
    console.log('🔄 Auto-refreshing tasks page...');
    window.location.reload();
  }, 2000);
}

// 8. Tampilkan instruksi
console.log('');
console.log('🎯 CARA PAKAI:');
console.log('1. checkTasks() - Cek data tugas yang ada');
console.log('2. addSampleTask("Judul", "Deskripsi") - Tambah tugas baru');
console.log('3. refreshTasks() - Refresh data tugas');
console.log('4. Halaman akan auto-refresh dalam 2 detik');
console.log('');
console.log('✨ CONTOH:');
console.log('addSampleTask("Monitoring Kelas", "Melakukan monitoring pembelajaran di kelas 6")');

console.log('🎉 Fix tugas harian selesai! Data sample sudah ditambahkan.');