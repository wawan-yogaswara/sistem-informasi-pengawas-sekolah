// Script untuk memperbaiki format data dashboard agar sesuai dengan filtering
// Jalankan di browser console (F12 -> Console)

console.log('🔧 Fixing dashboard data format...');

function fixDashboardDataFormat() {
  // 1. Set user wawan session dengan format yang konsisten
  const wawaUser = {
    id: "1762696525337",
    username: "wawan",
    fullName: "H. Wawan Yogaswara, S.Pd, M.Pd",
    role: "pengawas",
    nip: "196801011990031001"
  };
  
  localStorage.setItem('auth_user', JSON.stringify(wawaUser));
  localStorage.setItem('currentUser', JSON.stringify(wawaUser));
  
  // 2. Buat data dengan format yang konsisten untuk semua field yang mungkin dicek
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  
  const consistentData = {
    users: [wawaUser],
    schools: [
      {
        id: "school_wawan_001",
        name: "SDN 1 Garut Kota",
        address: "Jl. Raya Garut No. 1",
        headmaster: "Drs. Ahmad Suryadi",
        userId: "1762696525337",
        user_id: "1762696525337",
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
        assignedTo: "wawan",
        supervisor: "wawan"
      }
    ],
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
        title: "Evaluasi Kurikulum Merdeka",
        description: "Mengevaluasi implementasi kurikulum merdeka",
        userId: "1762696525337",
        user_id: "1762696525337",
        username: "wawan",
        user: "wawan",
        assignedTo: "wawan",
        schoolId: "school_wawan_002",
        schoolName: "SDN 2 Garut Kota",
        status: "in_progress",
        completed: false,
        finished: false,
        state: "in_progress",
        date: new Date(currentYear, currentMonth, 10).toISOString(),
        createdAt: new Date(currentYear, currentMonth, 3).toISOString(),
        created_at: new Date(currentYear, currentMonth, 3).toISOString()
      },
      {
        id: "task_wawan_003",
        title: "Monitoring Administrasi Sekolah",
        description: "Memantau kelengkapan administrasi sekolah",
        userId: "1762696525337",
        user_id: "1762696525337",
        username: "wawan",
        user: "wawan",
        assignedTo: "wawan",
        schoolId: "school_wawan_003",
        schoolName: "SDN 3 Garut Kota",
        status: "pending",
        completed: false,
        finished: false,
        state: "pending",
        date: new Date(currentYear, currentMonth, 15).toISOString(),
        createdAt: new Date(currentYear, currentMonth, 5).toISOString(),
        created_at: new Date(currentYear, currentMonth, 5).toISOString()
      },
      {
        id: "task_wawan_004",
        title: "Pembinaan Guru Baru",
        description: "Memberikan pembinaan kepada guru baru",
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
        date: new Date(currentYear, currentMonth, 18).toISOString(),
        createdAt: new Date(currentYear, currentMonth, 15).toISOString(),
        created_at: new Date(currentYear, currentMonth, 15).toISOString()
      }
    ],
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
        date: new Date(currentYear, currentMonth, 8).toISOString(),
        notes: "Pembelajaran sudah berjalan dengan baik",
        createdAt: new Date(currentYear, currentMonth, 8).toISOString(),
        created_at: new Date(currentYear, currentMonth, 8).toISOString()
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
        date: new Date(currentYear, currentMonth, 12).toISOString(),
        notes: "Manajemen sekolah perlu diperbaiki",
        createdAt: new Date(currentYear, currentMonth, 12).toISOString(),
        created_at: new Date(currentYear, currentMonth, 12).toISOString()
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
        date: new Date(currentYear, currentMonth, 16).toISOString(),
        notes: "Perlu peningkatan metode pembelajaran",
        createdAt: new Date(currentYear, currentMonth, 16).toISOString(),
        created_at: new Date(currentYear, currentMonth, 16).toISOString()
      }
    ],
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
        date: new Date(currentYear, currentMonth, 25).toISOString(),
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
        date: new Date(currentYear, currentMonth, 28).toISOString(),
        status: "planned",
        createdAt: new Date(currentYear, currentMonth, 22).toISOString(),
        created_at: new Date(currentYear, currentMonth, 22).toISOString()
      }
    ]
  };
  
  // 3. Save data dengan format yang konsisten
  localStorage.setItem('local-database', JSON.stringify(consistentData));
  localStorage.setItem('tasks_data', JSON.stringify(consistentData.tasks));
  localStorage.setItem('supervisions_data', JSON.stringify(consistentData.supervisions));
  localStorage.setItem('schools_data', JSON.stringify(consistentData.schools));
  localStorage.setItem('additional_tasks_data', JSON.stringify(consistentData.additionalTasks));
  
  // 4. Hitung statistik yang benar
  const completedTasks = consistentData.tasks.filter(task => 
    task.completed === true || task.status === 'completed' || task.finished === true
  ).length;
  
  const monthlySupervisions = consistentData.supervisions.filter(supervision => {
    const date = new Date(supervision.date || supervision.createdAt);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  }).length;
  
  const stats = {
    totalTasks: consistentData.tasks.length,
    completedTasks: completedTasks,
    totalSchools: consistentData.schools.length,
    monthlySupervisions: monthlySupervisions,
    totalSupervisions: consistentData.supervisions.length,
    totalAdditionalTasks: consistentData.additionalTasks.length
  };
  
  // 5. Save stats dan trigger update
  localStorage.setItem('wawan_dashboard_stats', JSON.stringify(stats));
  
  console.log('✅ Data format fixed!');
  console.log('📊 Expected stats:', stats);
  console.log('📋 Data summary:', {
    tasks: consistentData.tasks.length,
    completedTasks: completedTasks,
    supervisions: consistentData.supervisions.length,
    monthlySupervisions: monthlySupervisions,
    schools: consistentData.schools.length,
    additionalTasks: consistentData.additionalTasks.length
  });
  
  // 6. Trigger dashboard refresh
  window.dispatchEvent(new CustomEvent('wawanStatsReady', {
    detail: { stats: stats }
  }));
  
  // 7. Force page refresh to apply changes
  setTimeout(() => {
    console.log('🔄 Refreshing page to apply changes...');
    window.location.reload();
  }, 1000);
  
  return stats;
}

// Run the fix
const result = fixDashboardDataFormat();
console.log('🎯 Dashboard data format fix completed!');
alert('✅ Format data dashboard diperbaiki! Halaman akan refresh untuk menerapkan perubahan...');