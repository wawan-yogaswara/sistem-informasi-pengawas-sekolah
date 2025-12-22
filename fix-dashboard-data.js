// Script untuk memperbaiki data dashboard dan menambahkan data sample
console.log('🔧 Memperbaiki data dashboard...');

// Fungsi untuk membuat data sample
function createSampleData() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  
  // Data sample untuk user wawan
  const sampleData = {
    users: [
      {
        id: "1762696424712",
        username: "admin",
        password: "$2b$10$iM4m2MQgxLSX2HuTXMjbLOTXMLMde0pJyO3dIyF.MoP6tgqVz4UGe",
        fullName: "Administrator",
        role: "admin",
        createdAt: "2025-11-09T13:53:44.712Z",
        nip: "",
        rank: "",
        officeName: "",
        officeAddress: "",
        homeAddress: "",
        phone: "",
        photoUrl: null
      },
      {
        id: "1762696525337",
        username: "wawan",
        password: "$2b$10$hashedpassword",
        fullName: "Wawan Setiawan",
        role: "user",
        createdAt: "2025-01-15T10:00:00.000Z",
        nip: "196801011990031001",
        rank: "Pengawas Sekolah",
        officeName: "Dinas Pendidikan Kabupaten Garut",
        officeAddress: "Jl. Pembangunan No. 1 Garut",
        homeAddress: "Jl. Merdeka No. 123 Garut",
        phone: "081234567890",
        photoUrl: null
      }
    ],
    schools: [
      {
        id: "school_001",
        name: "SDN 1 Garut Kota",
        address: "Jl. Raya Garut No. 1",
        headmaster: "Drs. Ahmad Suryadi",
        phone: "0262-123456",
        email: "sdn1garut@gmail.com",
        createdAt: currentDate.toISOString()
      },
      {
        id: "school_002", 
        name: "SDN 2 Garut Kota",
        address: "Jl. Raya Garut No. 2",
        headmaster: "Hj. Siti Nurhasanah, S.Pd",
        phone: "0262-123457",
        email: "sdn2garut@gmail.com",
        createdAt: currentDate.toISOString()
      },
      {
        id: "school_003",
        name: "SDN 3 Garut Kota", 
        address: "Jl. Raya Garut No. 3",
        headmaster: "Drs. Bambang Sutrisno",
        phone: "0262-123458",
        email: "sdn3garut@gmail.com",
        createdAt: currentDate.toISOString()
      }
    ],
    tasks: [
      {
        id: "task_001",
        title: "Supervisi Pembelajaran Kelas 1-3",
        description: "Melakukan supervisi pembelajaran di kelas rendah untuk memastikan kualitas pembelajaran",
        userId: "1762696525337",
        username: "wawan",
        schoolId: "school_001",
        schoolName: "SDN 1 Garut Kota",
        status: "completed",
        completed: true,
        date: new Date(currentYear, currentMonth, 5).toISOString(),
        createdAt: new Date(currentYear, currentMonth, 1).toISOString()
      },
      {
        id: "task_002",
        title: "Evaluasi Kurikulum Merdeka",
        description: "Mengevaluasi implementasi kurikulum merdeka di sekolah binaan",
        userId: "1762696525337", 
        username: "wawan",
        schoolId: "school_002",
        schoolName: "SDN 2 Garut Kota",
        status: "in_progress",
        completed: false,
        date: new Date(currentYear, currentMonth, 10).toISOString(),
        createdAt: new Date(currentYear, currentMonth, 3).toISOString()
      },
      {
        id: "task_003",
        title: "Monitoring Administrasi Sekolah",
        description: "Memantau kelengkapan administrasi sekolah dan memberikan bimbingan",
        userId: "1762696525337",
        username: "wawan", 
        schoolId: "school_003",
        schoolName: "SDN 3 Garut Kota",
        status: "pending",
        completed: false,
        date: new Date(currentYear, currentMonth, 15).toISOString(),
        createdAt: new Date(currentYear, currentMonth, 5).toISOString()
      }
    ],
    supervisions: [
      {
        id: "supervision_001",
        title: "Supervisi Akademik Semester 1",
        schoolId: "school_001",
        schoolName: "SDN 1 Garut Kota",
        userId: "1762696525337",
        username: "wawan",
        date: new Date(currentYear, currentMonth, 8).toISOString(),
        notes: "Pembelajaran sudah berjalan dengan baik, perlu peningkatan media pembelajaran",
        recommendations: "Menambah media pembelajaran interaktif",
        createdAt: new Date(currentYear, currentMonth, 8).toISOString()
      },
      {
        id: "supervision_002", 
        title: "Supervisi Manajerial",
        schoolId: "school_002",
        schoolName: "SDN 2 Garut Kota",
        userId: "1762696525337",
        username: "wawan",
        date: new Date(currentYear, currentMonth, 12).toISOString(),
        notes: "Manajemen sekolah perlu diperbaiki dalam hal administrasi",
        recommendations: "Melengkapi dokumen administrasi sekolah",
        createdAt: new Date(currentYear, currentMonth, 12).toISOString()
      }
    ],
    additionalTasks: [
      {
        id: "additional_001",
        title: "Pelatihan Guru Kurikulum Merdeka",
        description: "Memberikan pelatihan kepada guru-guru tentang implementasi kurikulum merdeka",
        userId: "1762696525337",
        username: "wawan",
        schoolId: "school_001", 
        schoolName: "SDN 1 Garut Kota",
        date: new Date(currentYear, currentMonth, 20).toISOString(),
        status: "completed",
        createdAt: new Date(currentYear, currentMonth, 18).toISOString()
      },
      {
        id: "additional_002",
        title: "Workshop Penilaian Autentik",
        description: "Mengadakan workshop tentang penilaian autentik untuk guru-guru",
        userId: "1762696525337",
        username: "wawan", 
        schoolId: "school_002",
        schoolName: "SDN 2 Garut Kota",
        date: new Date(currentYear, currentMonth, 25).toISOString(),
        status: "scheduled",
        createdAt: new Date(currentYear, currentMonth, 20).toISOString()
      }
    ]
  };
  
  return sampleData;
}

// Fungsi untuk menyimpan data ke localStorage
function saveDataToLocalStorage() {
  try {
    const sampleData = createSampleData();
    
    // Simpan ke local-database
    localStorage.setItem('local-database', JSON.stringify(sampleData));
    console.log('✅ Data berhasil disimpan ke local-database');
    
    // Simpan juga ke individual keys untuk kompatibilitas
    localStorage.setItem('tasks_data', JSON.stringify(sampleData.tasks));
    localStorage.setItem('supervisions_data', JSON.stringify(sampleData.supervisions));
    localStorage.setItem('schools_data', JSON.stringify(sampleData.schools));
    localStorage.setItem('additional_tasks_data', JSON.stringify(sampleData.additionalTasks));
    
    console.log('✅ Data berhasil disimpan ke individual keys');
    
    // Set user session untuk wawan
    const wawaUser = {
      id: "1762696525337",
      username: "wawan",
      fullName: "Wawan Setiawan",
      role: "user",
      nip: "196801011990031001"
    };
    
    localStorage.setItem('auth_user', JSON.stringify(wawaUser));
    localStorage.setItem('currentUser', JSON.stringify(wawaUser));
    localStorage.setItem('user_data', JSON.stringify(wawaUser));
    
    console.log('✅ User session berhasil diset untuk wawan');
    
    // Tampilkan ringkasan data
    console.log('📊 Ringkasan data yang ditambahkan:');
    console.log(`- Users: ${sampleData.users.length}`);
    console.log(`- Schools: ${sampleData.schools.length}`);
    console.log(`- Tasks: ${sampleData.tasks.length}`);
    console.log(`- Supervisions: ${sampleData.supervisions.length}`);
    console.log(`- Additional Tasks: ${sampleData.additionalTasks.length}`);
    
    return sampleData;
    
  } catch (error) {
    console.error('❌ Error menyimpan data:', error);
    return null;
  }
}

// Fungsi untuk memverifikasi data
function verifyData() {
  try {
    const localData = JSON.parse(localStorage.getItem('local-database') || '{}');
    const authUser = JSON.parse(localStorage.getItem('auth_user') || '{}');
    
    console.log('🔍 Verifikasi data:');
    console.log('- Local database:', Object.keys(localData));
    console.log('- Auth user:', authUser.username || 'tidak ada');
    
    if (localData.tasks && localData.tasks.length > 0) {
      console.log('✅ Data tasks tersedia');
    } else {
      console.log('❌ Data tasks tidak tersedia');
    }
    
    if (localData.supervisions && localData.supervisions.length > 0) {
      console.log('✅ Data supervisions tersedia');
    } else {
      console.log('❌ Data supervisions tidak tersedia');
    }
    
    if (localData.schools && localData.schools.length > 0) {
      console.log('✅ Data schools tersedia');
    } else {
      console.log('❌ Data schools tidak tersedia');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error verifikasi data:', error);
    return false;
  }
}

// Jalankan script
console.log('🚀 Memulai perbaikan data dashboard...');
const result = saveDataToLocalStorage();

if (result) {
  console.log('✅ Perbaikan data selesai!');
  verifyData();
  console.log('🔄 Silakan refresh halaman dashboard untuk melihat perubahan');
} else {
  console.log('❌ Perbaikan data gagal!');
}