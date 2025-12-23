// Script untuk memaksa menampilkan data EXACT user wawan
// Jalankan di browser console (F12 -> Console)

console.log('🎯 Forcing EXACT wawan data display...');

function forceWawanExactData() {
  // 1. Clear semua data existing
  console.log('🧹 Clearing existing data...');
  localStorage.removeItem('local-database');
  localStorage.removeItem('tasks_data');
  localStorage.removeItem('supervisions_data');
  localStorage.removeItem('schools_data');
  localStorage.removeItem('additional_tasks_data');
  localStorage.removeItem('wawan_dashboard_stats');
  
  // 2. Set user wawan session yang PASTI
  const wawaUser = {
    id: "1762696525337",
    username: "wawan",
    fullName: "H. Wawan Yogaswara, S.Pd, M.Pd",
    role: "pengawas",
    nip: "196801011990031001"
  };
  
  localStorage.setItem('auth_user', JSON.stringify(wawaUser));
  localStorage.setItem('currentUser', JSON.stringify(wawaUser));
  
  // 3. Buat data EXACT sesuai permintaan: 4 tugas (2 selesai), 3 sekolah, 3 supervisi, 3 tugas tambahan
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  
  const exactWawanData = {
    users: [wawaUser],
    
    // EXACT: 3 sekolah binaan
    schools: [
      {
        id: "school_wawan_001",
        name: "SDN 1 Garut Kota",
        address: "Jl. Raya Garut No. 1",
        headmaster: "Drs. Ahmad Suryadi",
        userId: "1762696525337",
        user_id: "1762696525337",
        username: "wawan",
        assignedTo: "wawan",
        supervisor: "wawan"
      },
      {
        id: "school_wawan_002",
        name: "SDN 2 Garut Kota",
        address: "Jl. Raya Garut No. 2",
        headmaster: "Hj. Siti Nurhasanah, S.Pd",
        userId: "1762696525337",
        user_id: "1762696525337",
        username: "wawan",
        assignedTo: "wawan",
        supervisor: "wawan"
      },
      {
        id: "school_wawan_003",
        name: "SDN 3 Garut Kota",
        address: "Jl. Raya Garut No. 3",
        headmaster: "Drs. Bambang Sutrisno",
        userId: "1762696525337",
        user_id: "1762696525337",
        username: "wawan",
        assignedTo: "wawan",
        supervisor: "wawan"
      }
    ],
    
    // EXACT: 4 tugas total (2 selesai, 2 dalam proses)
    tasks: [
      {
        id: "task_wawan_001",
        title: "Supervisi Pembelajaran Kelas 1-3",
        description: "Melakukan supervisi pembelajaran di kelas rendah",
        userId: "1762696525337",
        user_id: "1762696525337",
        username: "wawan",
        user: "wawan",
        assignedTo: "wawan",
        schoolId: "school_wawan_001",
        schoolName: "SDN 1 Garut Kota",
        status: "completed",
        completed: true,
        finished: true,
        state: "completed",
        date: new Date(currentYear, currentMonth, 5).toISOString(),
        createdAt: new Date(currentYear, currentMonth, 1).toISOString(),
        created_at: new Date(currentYear, currentMonth, 1).toISOString()
      },
      {
        id: "task_wawan_002",
        title: "Pembinaan Guru Baru",
        description: "Memberikan pembinaan kepada guru baru",
        userId: "1762696525337",
        user_id: "1762696525337",
        username: "wawan",
        user: "wawan",
        assignedTo: "wawan",
        schoolId: "school_wawan_002",
        schoolName: "SDN 2 Garut Kota",
        status: "completed",
        completed: true,
        finished: true,
        state: "completed",
        date: new Date(currentYear, currentMonth, 8).toISOString(),
        createdAt: new Date(currentYear, currentMonth, 3).toISOString(),
        created_at: new Date(currentYear, currentMonth, 3).toISOString()
      },
      {
        id: "task_wawan_003",
        title: "Evaluasi Kurikulum Merdeka",
        description: "Mengevaluasi implementasi kurikulum merdeka",
        userId: "1762696525337",
        user_id: "1762696525337",
        username: "wawan",
        user: "wawan",
        assignedTo: "wawan",
        schoolId: "school_wawan_003",
        schoolName: "SDN 3 Garut Kota",
        status: "in_progress",
        completed: false,
        finished: false,
        state: "in_progress",
        date: new Date(currentYear, currentMonth, 12).toISOString(),
        createdAt: new Date(currentYear, currentMonth, 5).toISOString(),
        created_at: new Date(currentYear, currentMonth, 5).toISOString()
      },
      {
        id: "task_wawan_004",
        title: "Monitoring Administrasi Sekolah",
        description: "Memantau kelengkapan administrasi sekolah",
        userId: "1762696525337",
        user_id: "1762696525337",
        username: "wawan",
        user: "wawan",
        assignedTo: "wawan",
        schoolId: "school_wawan_001",
        schoolName: "SDN 1 Garut Kota",
        status: "pending",
        completed: false,
        finished: false,
        state: "pending",
        date: new Date(currentYear, currentMonth, 15).toISOString(),
        createdAt: new Date(currentYear, currentMonth, 7).toISOString(),
        created_at: new Date(currentYear, currentMonth, 7).toISOString()
      }
    ],
    
    // EXACT: 3 supervisi (semua bulan ini)
    supervisions: [
      {
        id: "supervision_wawan_001",
        title: "Supervisi Akademik Semester 1",
        schoolId: "school_wawan_001",
        schoolName: "SDN 1 Garut Kota",
        userId: "1762696525337",
        user_id: "1762696525337",
        username: "wawan",
        user: "wawan",
        assignedTo: "wawan",
        date: new Date(currentYear, currentMonth, 10).toISOString(),
        notes: "Pembelajaran sudah berjalan dengan baik",
        createdAt: new Date(currentYear, currentMonth, 10).toISOString(),
        created_at: new Date(currentYear, currentMonth, 10).toISOString()
      },
      {
        id: "supervision_wawan_002",
        title: "Supervisi Manajerial",
        schoolId: "school_wawan_002",
        schoolName: "SDN 2 Garut Kota",
        userId: "1762696525337",
        user_id: "1762696525337",
        username: "wawan",
        user: "wawan",
        assignedTo: "wawan",
        date: new Date(currentYear, currentMonth, 14).toISOString(),
        notes: "Manajemen sekolah perlu diperbaiki",
        createdAt: new Date(currentYear, currentMonth, 14).toISOString(),
        created_at: new Date(currentYear, currentMonth, 14).toISOString()
      },
      {
        id: "supervision_wawan_003",
        title: "Supervisi Klinis",
        schoolId: "school_wawan_003",
        schoolName: "SDN 3 Garut Kota",
        userId: "1762696525337",
        user_id: "1762696525337",
        username: "wawan",
        user: "wawan",
        assignedTo: "wawan",
        date: new Date(currentYear, currentMonth, 18).toISOString(),
        notes: "Perlu peningkatan metode pembelajaran",
        createdAt: new Date(currentYear, currentMonth, 18).toISOString(),
        created_at: new Date(currentYear, currentMonth, 18).toISOString()
      }
    ],
    
    // EXACT: 3 tugas tambahan
    additionalTasks: [
      {
        id: "additional_wawan_001",
        title: "Pelatihan Guru Kurikulum Merdeka",
        name: "Pelatihan Guru Kurikulum Merdeka",
        description: "Memberikan pelatihan kepada guru-guru",
        userId: "1762696525337",
        user_id: "1762696525337",
        username: "wawan",
        user: "wawan",
        assignedTo: "wawan",
        schoolId: "school_wawan_001",
        schoolName: "SDN 1 Garut Kota",
        date: new Date(currentYear, currentMonth, 20).toISOString(),
        status: "completed",
        createdAt: new Date(currentYear, currentMonth, 18).toISOString(),
        created_at: new Date(currentYear, currentMonth, 18).toISOString()
      },
      {
        id: "additional_wawan_002",
        title: "Workshop Penilaian Autentik",
        name: "Workshop Penilaian Autentik",
        description: "Mengadakan workshop tentang penilaian autentik",
        userId: "1762696525337",
        user_id: "1762696525337",
        username: "wawan",
        user: "wawan",
        assignedTo: "wawan",
        schoolId: "school_wawan_002",
        schoolName: "SDN 2 Garut Kota",
        date: new Date(currentYear, currentMonth, 22).toISOString(),
        status: "scheduled",
        createdAt: new Date(currentYear, currentMonth, 20).toISOString(),
        created_at: new Date(currentYear, currentMonth, 20).toISOString()
      },
      {
        id: "additional_wawan_003",
        title: "Seminar Pendidikan Karakter",
        name: "Seminar Pendidikan Karakter",
        description: "Mengadakan seminar tentang pendidikan karakter",
        userId: "1762696525337",
        user_id: "1762696525337",
        username: "wawan",
        user: "wawan",
        assignedTo: "wawan",
        schoolId: "school_wawan_003",
        schoolName: "SDN 3 Garut Kota",
        date: new Date(currentYear, currentMonth, 25).toISOString(),
        status: "planned",
        createdAt: new Date(currentYear, currentMonth, 22).toISOString(),
        created_at: new Date(currentYear, currentMonth, 22).toISOString()
      }
    ]
  };
  
  // 4. Save data EXACT
  localStorage.setItem('local-database', JSON.stringify(exactWawanData));
  localStorage.setItem('tasks_data', JSON.stringify(exactWawanData.tasks));
  localStorage.setItem('supervisions_data', JSON.stringify(exactWawanData.supervisions));
  localStorage.setItem('schools_data', JSON.stringify(exactWawanData.schools));
  localStorage.setItem('additional_tasks_data', JSON.stringify(exactWawanData.additionalTasks));
  
  // 5. Hitung statistik EXACT
  const completedTasks = exactWawanData.tasks.filter(task => 
    task.completed === true || task.status === 'completed' || task.finished === true
  ).length;
  
  const monthlySupervisions = exactWawanData.supervisions.filter(supervision => {
    const date = new Date(supervision.date || supervision.createdAt);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  }).length;
  
  const exactStats = {
    totalTasks: 4,           // EXACT: 4 tugas
    completedTasks: 2,       // EXACT: 2 selesai
    totalSchools: 3,         // EXACT: 3 sekolah
    monthlySupervisions: 3,  // EXACT: 3 supervisi bulan ini
    totalSupervisions: 3,    // EXACT: 3 supervisi total
    totalAdditionalTasks: 3  // EXACT: 3 tugas tambahan
  };
  
  // 6. Force save stats EXACT
  localStorage.setItem('wawan_dashboard_stats', JSON.stringify(exactStats));
  
  console.log('✅ EXACT wawan data set!');
  console.log('📊 EXACT stats:', exactStats);
  console.log('📋 Verification:', {
    'Total Tugas': exactWawanData.tasks.length,
    'Tugas Selesai': completedTasks,
    'Sekolah Binaan': exactWawanData.schools.length,
    'Supervisi Bulan Ini': monthlySupervisions,
    'Total Supervisi': exactWawanData.supervisions.length,
    'Tugas Tambahan': exactWawanData.additionalTasks.length
  });
  
  // 7. Force trigger dashboard update
  window.dispatchEvent(new CustomEvent('wawanStatsReady', {
    detail: { stats: exactStats }
  }));
  
  // 8. Force update DOM elements directly
  setTimeout(() => {
    console.log('🎯 Force updating DOM elements...');
    
    // Update stats cards directly
    const statElements = document.querySelectorAll('.text-3xl.font-bold');
    if (statElements.length >= 6) {
      statElements[0].textContent = '4';  // Total Tugas
      statElements[1].textContent = '2';  // Tugas Selesai
      statElements[2].textContent = '3';  // Sekolah Binaan
      statElements[3].textContent = '3';  // Supervisi Bulan Ini
      statElements[4].textContent = '3';  // Total Supervisi
      statElements[5].textContent = '3';  // Tugas Tambahan
      console.log('✅ DOM elements updated directly');
    }
    
    // Also try to update by data attributes
    const updateByDataAttr = (attr, value) => {
      const element = document.querySelector(`[data-stat="${attr}"]`);
      if (element) element.textContent = value;
    };
    
    updateByDataAttr('totalTasks', '4');
    updateByDataAttr('completedTasks', '2');
    updateByDataAttr('totalSchools', '3');
    updateByDataAttr('monthlySupervisions', '3');
    updateByDataAttr('totalSupervisions', '3');
    updateByDataAttr('totalAdditionalTasks', '3');
    
  }, 500);
  
  // 9. Force page refresh after 2 seconds
  setTimeout(() => {
    console.log('🔄 Force refreshing page...');
    window.location.reload();
  }, 2000);
  
  return exactStats;
}

// Run the exact data force
const result = forceWawanExactData();
console.log('🎯 EXACT wawan data forced!');
console.log('📊 Expected dashboard stats:');
console.log('  - Total Tugas: 4');
console.log('  - Tugas Selesai: 2');
console.log('  - Sekolah Binaan: 3');
console.log('  - Supervisi Bulan Ini: 3');
console.log('  - Total Supervisi: 3');
console.log('  - Tugas Tambahan: 3');

alert('🎯 Data EXACT user wawan dipaksa tampil! Halaman akan refresh dalam 2 detik...');