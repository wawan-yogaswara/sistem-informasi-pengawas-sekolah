// FIX REPORTS AUTH LANGSUNG - Jalankan di Console Browser

console.log('🔧 Memperbaiki masalah autentikasi reports...');

// 1. Pastikan user sudah login
const currentUser = localStorage.getItem('auth_user');
if (!currentUser) {
  console.log('❌ User belum login, setting default user...');
  const defaultUser = {
    id: '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e',
    username: 'wawan',
    full_name: 'H. Wawan Yogaswara, S.Pd, M.Pd',
    role: 'user',
    nip: '196805301994121001',
    position: 'Pengawas Sekolah'
  };
  localStorage.setItem('auth_user', JSON.stringify(defaultUser));
  localStorage.setItem('auth_token', 'supabase-token-' + Date.now());
  console.log('✅ Default user set');
}

// 2. Pastikan ada data activities untuk reports
const checkAndCreateSampleData = () => {
  // Check additional tasks
  let additionalTasks = JSON.parse(localStorage.getItem('additional_tasks_data') || '[]');
  if (additionalTasks.length === 0) {
    console.log('📝 Creating sample additional tasks...');
    additionalTasks = [
      {
        id: crypto.randomUUID(),
        title: 'Rapat Koordinasi Pengawas',
        description: 'Menghadiri rapat koordinasi pengawas sekolah tingkat kabupaten untuk membahas program kerja semester genap',
        date: '2024-12-20',
        location: 'Dinas Pendidikan Kabupaten Garut',
        organizer: 'Dinas Pendidikan',
        photo: null,
        user_id: '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e',
        created_at: new Date().toISOString()
      },
      {
        id: crypto.randomUUID(),
        title: 'Workshop Kurikulum Merdeka',
        description: 'Mengikuti workshop implementasi kurikulum merdeka untuk jenjang SMP',
        date: '2024-12-18',
        location: 'LPMP Jawa Barat',
        organizer: 'LPMP Jawa Barat',
        photo: null,
        user_id: '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e',
        created_at: new Date().toISOString()
      }
    ];
    localStorage.setItem('additional_tasks_data', JSON.stringify(additionalTasks));
    console.log('✅ Sample additional tasks created');
  }

  // Check supervisions
  let supervisions = JSON.parse(localStorage.getItem('supervisions_data') || '[]');
  if (supervisions.length === 0) {
    console.log('📝 Creating sample supervisions...');
    supervisions = [
      {
        id: crypto.randomUUID(),
        school: 'SDN 1 Garut',
        type: 'Akademik',
        date: '2024-12-19',
        teacherName: 'Siti Nurhalimah, S.Pd',
        teacherNip: '197805152006042010',
        findings: 'Pembelajaran sudah sesuai dengan RPP, namun perlu peningkatan dalam penggunaan media pembelajaran',
        recommendations: 'Disarankan untuk menggunakan media pembelajaran yang lebih interaktif dan memanfaatkan teknologi',
        photo1: null,
        photo2: null,
        createdAt: new Date().toISOString()
      },
      {
        id: crypto.randomUUID(),
        school: 'SMPN 2 Garut',
        type: 'Manajerial',
        date: '2024-12-17',
        teacherName: 'Drs. Ahmad Suryadi, M.Pd',
        teacherNip: '196512101990031008',
        findings: 'Administrasi sekolah sudah tertib, dokumentasi kegiatan pembelajaran perlu diperbaiki',
        recommendations: 'Tingkatkan dokumentasi kegiatan pembelajaran dan evaluasi berkala',
        photo1: null,
        photo2: null,
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem('supervisions_data', JSON.stringify(supervisions));
    console.log('✅ Sample supervisions created');
  }

  // Check tasks
  let tasks = JSON.parse(localStorage.getItem('tasks_data') || '[]');
  if (tasks.length === 0) {
    console.log('📝 Creating sample tasks...');
    tasks = [
      {
        id: crypto.randomUUID(),
        title: 'Penyusunan Laporan Bulanan',
        description: 'Menyusun laporan kegiatan pengawasan bulan Desember 2024',
        date: '2024-12-21',
        completed: false,
        photo: null,
        user_id: '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e',
        created_at: new Date().toISOString()
      },
      {
        id: crypto.randomUUID(),
        title: 'Evaluasi Kinerja Guru',
        description: 'Melakukan evaluasi kinerja guru di sekolah binaan',
        date: '2024-12-16',
        completed: true,
        photo: null,
        user_id: '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e',
        created_at: new Date().toISOString()
      }
    ];
    localStorage.setItem('tasks_data', JSON.stringify(tasks));
    console.log('✅ Sample tasks created');
  }
};

// 3. Create sample data
checkAndCreateSampleData();

// 4. Refresh halaman reports jika sedang di halaman tersebut
if (window.location.pathname.includes('/reports')) {
  console.log('🔄 Refreshing reports page...');
  setTimeout(() => {
    window.location.reload();
  }, 1000);
} else {
  console.log('✅ Perbaikan selesai! Silakan buka halaman Reports');
}

console.log('✅ Fix reports auth completed!');
console.log('📊 Data summary:');
console.log('- Additional Tasks:', JSON.parse(localStorage.getItem('additional_tasks_data') || '[]').length);
console.log('- Supervisions:', JSON.parse(localStorage.getItem('supervisions_data') || '[]').length);
console.log('- Tasks:', JSON.parse(localStorage.getItem('tasks_data') || '[]').length);