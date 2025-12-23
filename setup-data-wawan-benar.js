// Script untuk setup data wawan yang benar
// Jalankan di browser console (F12 -> Console)

console.log('🔧 Setup data wawan yang benar...');

function setupDataWawanBenar() {
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
  
  // 2. Buat data yang benar untuk tahun 2025
  const currentDate = new Date();
  const currentYear = 2025; // Pastikan tahun 2025
  const currentMonth = 11; // Desember (0-based)
  
  const correctData = {
    users: [wawaUser],
    
    // 3 sekolah SMK yang Anda input
    schools: [
      {
        id: "school_smk_001",
        name: "SMKK 4 GARUT",
        address: "Jl. Karangpawitan Kec. Karangpawitan",
        headmaster: "Drs. Pudji Santoso",
        phone: "082115166530",
        nip: "196603091992031005"
      },
      {
        id: "school_smk_002",
        name: "SMK PLUS GODOG",
        address: "Kp. Godog Kramat Rt 02/06 Karangpawitan",
        headmaster: "Yogi Sugianto",
        phone: "+62 857-2367-8324"
      },
      {
        id: "school_smk_003",
        name: "SMK IT MUHAJIRIN",
        address: "Jl. Keramat Godog Kp. Cogrek Rt 01 Rw 09",
        headmaster: "Uloh Saepulloh, S.Ag",
        phone: "0813-2399-3965"
      }
    ],
    
    // 4 tugas (2 selesai, 2 belum)
    tasks: [
      {
        id: "task_wawan_001",
        title: "Supervisi Pembelajaran SMK",
        description: "Supervisi pembelajaran di SMKK 4 GARUT",
        userId: "1762696525337",
        username: "wawan",
        schoolId: "school_smk_001",
        schoolName: "SMKK 4 GARUT",
        status: "completed",
        completed: true,
        finished: true,
        date: new Date(currentYear, currentMonth, 5).toISOString(),
        createdAt: new Date(currentYear, currentMonth, 1).toISOString()
      },
      {
        id: "task_wawan_002",
        title: "Pembinaan Guru SMK Plus",
        description: "Pembinaan guru di SMK PLUS GODOG",
        userId: "1762696525337",
        username: "wawan",
        schoolId: "school_smk_002",
        schoolName: "SMK PLUS GODOG",
        status: "completed",
        completed: true,
        finished: true,
        date: new Date(currentYear, currentMonth, 8).toISOString(),
        createdAt: new Date(currentYear, currentMonth, 3).toISOString()
      },
      {
        id: "task_wawan_003",
        title: "Evaluasi Kurikulum SMK IT",
        description: "Evaluasi kurikulum di SMK IT MUHAJIRIN",
        userId: "1762696525337",
        username: "wawan",
        schoolId: "school_smk_003",
        schoolName: "SMK IT MUHAJIRIN",
        status: "in_progress",
        completed: false,
        finished: false,
        date: new Date(currentYear, currentMonth, 12).toISOString(),
        createdAt: new Date(currentYear, currentMonth, 5).toISOString()
      },
      {
        id: "task_wawan_004",
        title: "Monitoring Administrasi",
        description: "Monitoring administrasi sekolah",
        userId: "1762696525337",
        username: "wawan",
        schoolId: "school_smk_001",
        schoolName: "SMKK 4 GARUT",
        status: "pending",
        completed: false,
        finished: false,
        date: new Date(currentYear, currentMonth, 15).toISOString(),
        createdAt: new Date(currentYear, currentMonth, 7).toISOString()
      }
    ],
    
    // 3 supervisi
    supervisions: [
      {
        id: "supervision_wawan_001",
        title: "Supervisi Akademik SMKK 4",
        schoolId: "school_smk_001",
        schoolName: "SMKK 4 GARUT",
        userId: "1762696525337",
        username: "wawan",
        date: new Date(currentYear, currentMonth, 10).toISOString(),
        notes: "Pembelajaran sudah berjalan dengan baik",
        createdAt: new Date(currentYear, currentMonth, 10).toISOString()
      },
      {
        id: "supervision_wawan_002",
        title: "Supervisi Manajerial SMK Plus",
        schoolId: "school_smk_002",
        schoolName: "SMK PLUS GODOG",
        userId: "1762696525337",
        username: "wawan",
        date: new Date(currentYear, currentMonth, 14).toISOString(),
        notes: "Manajemen sekolah perlu diperbaiki",
        createdAt: new Date(currentYear, currentMonth, 14).toISOString()
      },
      {
        id: "supervision_wawan_003",
        title: "Supervisi Klinis SMK IT",
        schoolId: "school_smk_003",
        schoolName: "SMK IT MUHAJIRIN",
        userId: "1762696525337",
        username: "wawan",
        date: new Date(currentYear, currentMonth, 18).toISOString(),
        notes: "Perlu peningkatan metode pembelajaran",
        createdAt: new Date(currentYear, currentMonth, 18).toISOString()
      }
    ],
    
    // 3 tugas tambahan
    additionalTasks: [
      {
        id: "additional_wawan_001",
        title: "Pelatihan Guru Kurikulum Merdeka",
        description: "Pelatihan untuk guru-guru SMK",
        userId: "1762696525337",
        username: "wawan",
        schoolId: "school_smk_001",
        schoolName: "SMKK 4 GARUT",
        date: new Date(currentYear, currentMonth, 20).toISOString(),
        status: "completed",
        createdAt: new Date(currentYear, currentMonth, 18).toISOString()
      },
      {
        id: "additional_wawan_002",
        title: "Workshop Penilaian Autentik",
        description: "Workshop untuk SMK Plus",
        userId: "1762696525337",
        username: "wawan",
        schoolId: "school_smk_002",
        schoolName: "SMK PLUS GODOG",
        date: new Date(currentYear, currentMonth, 22).toISOString(),
        status: "scheduled",
        createdAt: new Date(currentYear, currentMonth, 20).toISOString()
      },
      {
        id: "additional_wawan_003",
        title: "Seminar Pendidikan Karakter",
        description: "Seminar untuk SMK IT",
        userId: "1762696525337",
        username: "wawan",
        schoolId: "school_smk_003",
        schoolName: "SMK IT MUHAJIRIN",
        date: new Date(currentYear, currentMonth, 25).toISOString(),
        status: "planned",
        createdAt: new Date(currentYear, currentMonth, 22).toISOString()
      }
    ]
  };
  
  // 3. Simpan data
  localStorage.setItem('local-database', JSON.stringify(correctData));
  localStorage.setItem('tasks_data', JSON.stringify(correctData.tasks));
  localStorage.setItem('supervisions_data', JSON.stringify(correctData.supervisions));
  localStorage.setItem('schools_data', JSON.stringify(correctData.schools));
  localStorage.setItem('additional_tasks_data', JSON.stringify(correctData.additionalTasks));
  
  // 4. Hitung statistik yang benar
  const completedTasks = correctData.tasks.filter(task => 
    task.completed === true || task.status === 'completed'
  ).length;
  
  const monthlySupervisions = correctData.supervisions.filter(supervision => {
    const date = new Date(supervision.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  }).length;
  
  const stats = {
    totalTasks: 4,
    completedTasks: 2, // 2 tugas selesai
    totalSchools: 3,   // 3 SMK
    monthlySupervisions: 3, // 3 supervisi bulan ini
    totalSupervisions: 3,
    totalAdditionalTasks: 3
  };
  
  localStorage.setItem('wawan_dashboard_stats', JSON.stringify(stats));
  
  console.log('✅ Data wawan yang benar sudah disetup!');
  console.log('📊 Statistik:', stats);
  
  return stats;
}

// Jalankan setup
const result = setupDataWawanBenar();

console.log('🎯 HASIL SETUP:');
console.log(`📋 Total Tugas: ${result.totalTasks}`);
console.log(`✅ Tugas Selesai: ${result.completedTasks}`);
console.log(`🏫 Sekolah Binaan: ${result.totalSchools} (3 SMK)`);
console.log(`👁️ Supervisi Bulan Ini: ${result.monthlySupervisions}`);
console.log(`📊 Total Supervisi: ${result.totalSupervisions}`);
console.log(`➕ Tugas Tambahan: ${result.totalAdditionalTasks}`);

alert('✅ Data wawan yang benar sudah disetup! Refresh halaman untuk melihat hasilnya.');