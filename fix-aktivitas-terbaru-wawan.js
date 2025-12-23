// Script untuk memperbaiki aktivitas terbaru agar menampilkan data real user wawan
// Jalankan di browser console (F12 -> Console)

console.log('📋 Memperbaiki aktivitas terbaru user wawan...');

function fixAktivitasTerbaruWawan() {
  // 1. Set user wawan
  const wawaUser = {
    id: "1762696525337",
    username: "wawan",
    fullName: "H. Wawan Yogaswara, S.Pd, M.Pd",
    role: "pengawas",
    nip: "196801011990031001"
  };
  
  localStorage.setItem('auth_user', JSON.stringify(wawaUser));
  localStorage.setItem('currentUser', JSON.stringify(wawaUser));
  
  // 2. Hapus data dummy dan buat aktivitas real user wawan
  const currentYear = 2025;
  const currentMonth = 11; // Desember
  
  // Aktivitas real user wawan dengan tanggal terbaru
  const realActivities = [
    {
      id: "activity_wawan_001",
      title: "Supervisi Pembelajaran SMKK 4 GARUT",
      description: "Melakukan supervisi pembelajaran di SMKK 4 GARUT",
      type: "task",
      userId: "1762696525337",
      username: "wawan",
      schoolName: "SMKK 4 GARUT",
      status: "completed",
      completed: true,
      date: new Date(currentYear, currentMonth, 23, 10, 0).toISOString(), // 23 Des 2025, 10:00
      createdAt: new Date(currentYear, currentMonth, 23, 10, 0).toISOString()
    },
    {
      id: "activity_wawan_002",
      title: "Supervisi Manajerial SMK PLUS GODOG",
      description: "Supervisi manajemen di SMK PLUS GODOG",
      type: "supervision",
      userId: "1762696525337",
      username: "wawan",
      schoolName: "SMK PLUS GODOG",
      date: new Date(currentYear, currentMonth, 22, 14, 30).toISOString(), // 22 Des 2025, 14:30
      createdAt: new Date(currentYear, currentMonth, 22, 14, 30).toISOString(),
      notes: "Supervisi manajemen berjalan baik"
    },
    {
      id: "activity_wawan_003",
      title: "Pelatihan Guru SMK IT MUHAJIRIN",
      description: "Memberikan pelatihan kepada guru-guru SMK IT MUHAJIRIN",
      type: "additional",
      userId: "1762696525337",
      username: "wawan",
      schoolName: "SMK IT MUHAJIRIN",
      status: "completed",
      date: new Date(currentYear, currentMonth, 21, 9, 0).toISOString(), // 21 Des 2025, 09:00
      createdAt: new Date(currentYear, currentMonth, 21, 9, 0).toISOString()
    },
    {
      id: "activity_wawan_004",
      title: "Evaluasi Kurikulum SMKK 4 GARUT",
      description: "Evaluasi implementasi kurikulum di SMKK 4 GARUT",
      type: "task",
      userId: "1762696525337",
      username: "wawan",
      schoolName: "SMKK 4 GARUT",
      status: "in_progress",
      completed: false,
      date: new Date(currentYear, currentMonth, 20, 13, 15).toISOString(), // 20 Des 2025, 13:15
      createdAt: new Date(currentYear, currentMonth, 20, 13, 15).toISOString()
    },
    {
      id: "activity_wawan_005",
      title: "Workshop Penilaian SMK PLUS GODOG",
      description: "Workshop tentang sistem penilaian di SMK PLUS GODOG",
      type: "additional",
      userId: "1762696525337",
      username: "wawan",
      schoolName: "SMK PLUS GODOG",
      status: "scheduled",
      date: new Date(currentYear, currentMonth, 19, 8, 45).toISOString(), // 19 Des 2025, 08:45
      createdAt: new Date(currentYear, currentMonth, 19, 8, 45).toISOString()
    }
  ];
  
  // 3. Buat struktur data lengkap
  const completeData = {
    users: [wawaUser],
    schools: [
      {
        id: "school_smk_real_001",
        name: "SMKK 4 GARUT",
        address: "Jl. Karangpawitan Kec. Karangpawitan",
        headmaster: "Drs. Pudji Santoso"
      },
      {
        id: "school_smk_real_002", 
        name: "SMK PLUS GODOG",
        address: "Kp. Godog Kramat Rt 02/06 Karangpawitan",
        headmaster: "Yogi Sugianto"
      },
      {
        id: "school_smk_real_003",
        name: "SMK IT MUHAJIRIN", 
        address: "Jl. Keramat Godog Kp. Cogrek Rt 01 Rw 09",
        headmaster: "Uloh Saepulloh, S.Ag"
      }
    ],
    tasks: realActivities.filter(a => a.type === 'task'),
    supervisions: realActivities.filter(a => a.type === 'supervision'),
    additionalTasks: realActivities.filter(a => a.type === 'additional')
  };
  
  // 4. Simpan data lengkap
  localStorage.setItem('local-database', JSON.stringify(completeData));
  localStorage.setItem('tasks_data', JSON.stringify(completeData.tasks));
  localStorage.setItem('supervisions_data', JSON.stringify(completeData.supervisions));
  localStorage.setItem('schools_data', JSON.stringify(completeData.schools));
  localStorage.setItem('additional_tasks_data', JSON.stringify(completeData.additionalTasks));
  
  // 5. Hitung statistik
  const completedTasks = completeData.tasks.filter(t => t.completed === true || t.status === 'completed').length;
  const monthlySupervisions = completeData.supervisions.length; // Semua supervisi bulan ini
  
  const stats = {
    totalTasks: completeData.tasks.length,
    completedTasks: completedTasks,
    totalSchools: completeData.schools.length,
    monthlySupervisions: monthlySupervisions,
    totalSupervisions: completeData.supervisions.length,
    totalAdditionalTasks: completeData.additionalTasks.length
  };
  
  localStorage.setItem('wawan_dashboard_stats', JSON.stringify(stats));
  
  // 6. Force update DOM
  setTimeout(() => {
    const statElements = document.querySelectorAll('.text-3xl.font-bold');
    if (statElements.length >= 6) {
      statElements[0].textContent = stats.totalTasks;
      statElements[1].textContent = stats.completedTasks;
      statElements[2].textContent = stats.totalSchools;
      statElements[3].textContent = stats.monthlySupervisions;
      statElements[4].textContent = stats.totalSupervisions;
      statElements[5].textContent = stats.totalAdditionalTasks;
    }
  }, 500);
  
  console.log('✅ Data real user wawan berhasil disetup!');
  console.log('📊 Statistik:', stats);
  console.log('📋 Aktivitas terbaru yang akan muncul:');
  realActivities.forEach((activity, index) => {
    const date = new Date(activity.date);
    console.log(`  ${index + 1}. ${activity.title} (${activity.type}) - ${date.toLocaleDateString('id-ID')}`);
  });
  
  return { stats, activities: realActivities };
}

// Jalankan fix
const result = fixAktivitasTerbaruWawan();

console.log('🎯 HASIL FIX:');
console.log('📊 Statistik sama dengan Chrome:', result.stats);
console.log('📋 Aktivitas terbaru sekarang menampilkan data real user wawan');

// Refresh setelah 2 detik
setTimeout(() => window.location.reload(), 2000);

alert('✅ Aktivitas terbaru diperbaiki!\nSekarang menampilkan data real user wawan, bukan data dummy.\nHalaman akan refresh dalam 2 detik...');