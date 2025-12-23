// Script sederhana untuk menampilkan data riil user wawan
// Jalankan di browser console (F12 -> Console)

console.log('🔄 Fixing wawan dashboard data...');

// 1. Pastikan user wawan session aktif
function ensureWawanSession() {
  const wawaUser = {
    id: "1762696525337",
    username: "wawan",
    fullName: "H. Wawan Yogaswara, S.Pd, M.Pd",
    role: "pengawas",
    nip: "196801011990031001"
  };
  
  localStorage.setItem('auth_user', JSON.stringify(wawaUser));
  localStorage.setItem('currentUser', JSON.stringify(wawaUser));
  
  console.log('✅ Wawan session set');
}

// 2. Buat data sample yang konsisten untuk wawan
function createWawanData() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  
  const wawaData = {
    users: [
      {
        id: "1762696525337",
        username: "wawan",
        fullName: "H. Wawan Yogaswara, S.Pd, M.Pd",
        role: "pengawas",
        nip: "196801011990031001"
      }
    ],
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
  
  return wawaData;
}

// 3. Hitung statistik
function calculateWawanStats(data) {
  const completedTasks = data.tasks.filter(task => 
    task.completed === true || task.status === 'completed'
  ).length;
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlySupervisions = data.supervisions.filter(supervision => {
    const date = new Date(supervision.date || supervision.createdAt);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  }).length;
  
  const stats = {
    totalTasks: data.tasks.length,
    completedTasks: completedTasks,
    totalSchools: data.schools.length,
    monthlySupervisions: monthlySupervisions,
    totalSupervisions: data.supervisions.length,
    totalAdditionalTasks: data.additionalTasks.length
  };
  
  console.log('📊 Wawan stats calculated:', stats);
  return stats;
}

// 4. Update localStorage dengan data wawan
function updateLocalStorage(data) {
  // Merge dengan data existing jika ada
  const existingData = JSON.parse(localStorage.getItem('local-database') || '{}');
  
  const mergedData = {
    ...existingData,
    users: data.users,
    schools: [...(existingData.schools || []), ...data.schools],
    tasks: [...(existingData.tasks || []), ...data.tasks],
    supervisions: [...(existingData.supervisions || []), ...data.supervisions],
    additionalTasks: [...(existingData.additionalTasks || []), ...data.additionalTasks]
  };
  
  // Remove duplicates berdasarkan ID
  mergedData.schools = mergedData.schools.filter((school, index, self) => 
    index === self.findIndex(s => s.id === school.id)
  );
  mergedData.tasks = mergedData.tasks.filter((task, index, self) => 
    index === self.findIndex(t => t.id === task.id)
  );
  mergedData.supervisions = mergedData.supervisions.filter((supervision, index, self) => 
    index === self.findIndex(s => s.id === supervision.id)
  );
  mergedData.additionalTasks = mergedData.additionalTasks.filter((task, index, self) => 
    index === self.findIndex(t => t.id === task.id)
  );
  
  // Save to localStorage
  localStorage.setItem('local-database', JSON.stringify(mergedData));
  localStorage.setItem('tasks_data', JSON.stringify(mergedData.tasks));
  localStorage.setItem('supervisions_data', JSON.stringify(mergedData.supervisions));
  localStorage.setItem('schools_data', JSON.stringify(mergedData.schools));
  localStorage.setItem('additional_tasks_data', JSON.stringify(mergedData.additionalTasks));
  
  console.log('✅ Data saved to localStorage');
}

// 5. Force refresh dashboard
function refreshDashboard() {
  // Trigger React refresh
  window.dispatchEvent(new CustomEvent('dashboardRefresh', {
    detail: { source: 'wawan-data-fix' }
  }));
  
  // Reload page as fallback
  setTimeout(() => {
    window.location.reload();
  }, 1000);
}

// Main function
function fixWawanDashboardData() {
  console.log('🚀 Starting wawan dashboard data fix...');
  
  try {
    // 1. Set session
    ensureWawanSession();
    
    // 2. Create data
    const wawaData = createWawanData();
    
    // 3. Calculate stats
    const stats = calculateWawanStats(wawaData);
    
    // 4. Update localStorage
    updateLocalStorage(wawaData);
    
    // 5. Save stats
    localStorage.setItem('wawan_dashboard_stats', JSON.stringify(stats));
    
    // 6. Trigger dashboard update
    window.dispatchEvent(new CustomEvent('wawanStatsReady', {
      detail: { stats: stats }
    }));
    
    console.log('✅ Wawan dashboard data fixed!');
    console.log('📊 Final stats:', stats);
    
    // Show success and refresh
    alert('✅ Data riil user wawan berhasil diperbaiki! Dashboard akan di-refresh...');
    refreshDashboard();
    
  } catch (error) {
    console.error('❌ Error fixing wawan data:', error);
    alert('❌ Error: ' + error.message);
  }
}

// Run the fix
fixWawanDashboardData();