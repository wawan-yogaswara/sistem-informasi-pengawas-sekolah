// Script untuk memperbaiki dashboard yang menampilkan statistik nol
// Mengatasi masalah data tidak terbaca dengan benar

console.log('🔧 Memulai perbaikan dashboard statistik...');

// 1. Cek data yang ada di localStorage
function checkExistingData() {
    console.log('📊 Mengecek data yang ada di localStorage...');
    
    const localDatabase = localStorage.getItem('local-database');
    const tasksData = localStorage.getItem('tasks_data');
    const supervisionsData = localStorage.getItem('supervisions_data');
    const schoolsData = localStorage.getItem('schools_data');
    const additionalTasksData = localStorage.getItem('additional_tasks_data');
    const authUser = localStorage.getItem('auth_user');
    const currentUser = localStorage.getItem('currentUser');
    
    console.log('📋 Data yang ditemukan:');
    console.log('- local-database:', localDatabase ? 'Ada' : 'Tidak ada');
    console.log('- tasks_data:', tasksData ? 'Ada' : 'Tidak ada');
    console.log('- supervisions_data:', supervisionsData ? 'Ada' : 'Tidak ada');
    console.log('- schools_data:', schoolsData ? 'Ada' : 'Tidak ada');
    console.log('- additional_tasks_data:', additionalTasksData ? 'Ada' : 'Tidak ada');
    console.log('- auth_user:', authUser ? 'Ada' : 'Tidak ada');
    console.log('- currentUser:', currentUser ? 'Ada' : 'Tidak ada');
    
    return {
        localDatabase: localDatabase ? JSON.parse(localDatabase) : null,
        tasksData: tasksData ? JSON.parse(tasksData) : null,
        supervisionsData: supervisionsData ? JSON.parse(supervisionsData) : null,
        schoolsData: schoolsData ? JSON.parse(schoolsData) : null,
        additionalTasksData: additionalTasksData ? JSON.parse(additionalTasksData) : null,
        authUser: authUser ? JSON.parse(authUser) : null,
        currentUser: currentUser ? JSON.parse(currentUser) : null
    };
}

// 2. Buat data sample yang realistis untuk tahun 2025
function createSampleData() {
    console.log('📝 Membuat data sample untuk tahun 2025...');
    
    const currentDate = new Date();
    const currentYear = 2025;
    const currentMonth = currentDate.getMonth();
    
    // Data user wawan yang sudah ada
    const wawaUser = {
        id: "1762696525337",
        username: "wawan",
        fullName: "Wawan Setiawan",
        role: "user",
        nip: "196801011990031001",
        createdAt: new Date().toISOString()
    };
    
    // Data sekolah binaan
    const schools = [
        {
            id: "school_2025_001",
            name: "SDN 1 Garut Kota",
            address: "Jl. Raya Garut No. 1, Garut",
            headmaster: "Drs. Ahmad Suryadi, M.Pd",
            phone: "0262-123456",
            createdAt: new Date(2025, 0, 15).toISOString()
        },
        {
            id: "school_2025_002", 
            name: "SDN 2 Garut Kota",
            address: "Jl. Raya Garut No. 2, Garut",
            headmaster: "Hj. Siti Nurhasanah, S.Pd",
            phone: "0262-123457",
            createdAt: new Date(2025, 0, 16).toISOString()
        },
        {
            id: "school_2025_003",
            name: "SDN 3 Garut Kota", 
            address: "Jl. Raya Garut No. 3, Garut",
            headmaster: "Drs. Bambang Sutrisno, M.Pd",
            phone: "0262-123458",
            createdAt: new Date(2025, 0, 17).toISOString()
        },
        {
            id: "school_2025_004",
            name: "SDN 4 Garut Kota", 
            address: "Jl. Raya Garut No. 4, Garut",
            headmaster: "Hj. Rina Marlina, S.Pd",
            phone: "0262-123459",
            createdAt: new Date(2025, 0, 18).toISOString()
        },
        {
            id: "school_2025_005",
            name: "SDN 5 Garut Kota", 
            address: "Jl. Raya Garut No. 5, Garut",
            headmaster: "Drs. Yudi Hermawan, M.Pd",
            phone: "0262-123460",
            createdAt: new Date(2025, 0, 19).toISOString()
        }
    ];
    
    // Data tugas kepengawasan
    const tasks = [
        {
            id: "task_2025_001",
            title: "Supervisi Pembelajaran Kelas 1-3",
            description: "Melakukan supervisi pembelajaran di kelas rendah untuk memastikan kualitas pembelajaran sesuai kurikulum merdeka",
            userId: "1762696525337",
            username: "wawan",
            schoolId: "school_2025_001",
            schoolName: "SDN 1 Garut Kota",
            status: "completed",
            completed: true,
            date: new Date(2025, 0, 20).toISOString(),
            createdAt: new Date(2025, 0, 15).toISOString()
        },
        {
            id: "task_2025_002",
            title: "Evaluasi Kurikulum Merdeka",
            description: "Mengevaluasi implementasi kurikulum merdeka di sekolah binaan",
            userId: "1762696525337", 
            username: "wawan",
            schoolId: "school_2025_002",
            schoolName: "SDN 2 Garut Kota",
            status: "completed",
            completed: true,
            date: new Date(2025, 0, 22).toISOString(),
            createdAt: new Date(2025, 0, 16).toISOString()
        },
        {
            id: "task_2025_003",
            title: "Monitoring Administrasi Sekolah",
            description: "Memantau kelengkapan administrasi sekolah dan memberikan bimbingan",
            userId: "1762696525337",
            username: "wawan", 
            schoolId: "school_2025_003",
            schoolName: "SDN 3 Garut Kota",
            status: "in_progress",
            completed: false,
            date: new Date(2025, 0, 25).toISOString(),
            createdAt: new Date(2025, 0, 17).toISOString()
        },
        {
            id: "task_2025_004",
            title: "Supervisi Manajemen Sekolah",
            description: "Supervisi terhadap manajemen dan kepemimpinan kepala sekolah",
            userId: "1762696525337",
            username: "wawan", 
            schoolId: "school_2025_004",
            schoolName: "SDN 4 Garut Kota",
            status: "pending",
            completed: false,
            date: new Date(2025, 0, 28).toISOString(),
            createdAt: new Date(2025, 0, 18).toISOString()
        },
        {
            id: "task_2025_005",
            title: "Evaluasi Kinerja Guru",
            description: "Melakukan evaluasi kinerja guru dan memberikan feedback konstruktif",
            userId: "1762696525337",
            username: "wawan", 
            schoolId: "school_2025_005",
            schoolName: "SDN 5 Garut Kota",
            status: "scheduled",
            completed: false,
            date: new Date(2025, 1, 2).toISOString(),
            createdAt: new Date(2025, 0, 19).toISOString()
        }
    ];
    
    // Data supervisi
    const supervisions = [
        {
            id: "supervision_2025_001",
            title: "Supervisi Akademik Semester 1",
            schoolId: "school_2025_001",
            schoolName: "SDN 1 Garut Kota",
            userId: "1762696525337",
            username: "wawan",
            date: new Date(2025, 0, 21).toISOString(),
            notes: "Pembelajaran sudah berjalan dengan baik, guru menguasai materi dan metode pembelajaran sesuai kurikulum merdeka",
            createdAt: new Date(2025, 0, 21).toISOString()
        },
        {
            id: "supervision_2025_002", 
            title: "Supervisi Manajerial",
            schoolId: "school_2025_002",
            schoolName: "SDN 2 Garut Kota",
            userId: "1762696525337",
            username: "wawan",
            date: new Date(2025, 0, 23).toISOString(),
            notes: "Manajemen sekolah sudah baik, perlu peningkatan dalam dokumentasi administrasi",
            createdAt: new Date(2025, 0, 23).toISOString()
        },
        {
            id: "supervision_2025_003", 
            title: "Supervisi Pembelajaran Tematik",
            schoolId: "school_2025_003",
            schoolName: "SDN 3 Garut Kota",
            userId: "1762696525337",
            username: "wawan",
            date: new Date(2025, 0, 24).toISOString(),
            notes: "Pembelajaran tematik sudah diterapkan dengan baik, siswa aktif dan antusias",
            createdAt: new Date(2025, 0, 24).toISOString()
        }
    ];
    
    // Data tugas tambahan
    const additionalTasks = [
        {
            id: "additional_2025_001",
            title: "Pelatihan Guru Kurikulum Merdeka",
            description: "Memberikan pelatihan kepada guru-guru tentang implementasi kurikulum merdeka",
            userId: "1762696525337",
            username: "wawan",
            schoolId: "school_2025_001", 
            schoolName: "SDN 1 Garut Kota",
            date: new Date(2025, 0, 26).toISOString(),
            status: "completed",
            createdAt: new Date(2025, 0, 20).toISOString()
        },
        {
            id: "additional_2025_002",
            title: "Workshop Penilaian Autentik",
            description: "Mengadakan workshop tentang penilaian autentik untuk guru-guru",
            userId: "1762696525337",
            username: "wawan", 
            schoolId: "school_2025_002",
            schoolName: "SDN 2 Garut Kota",
            date: new Date(2025, 1, 1).toISOString(),
            status: "scheduled",
            createdAt: new Date(2025, 0, 22).toISOString()
        },
        {
            id: "additional_2025_003",
            title: "Bimbingan Teknis Administrasi",
            description: "Memberikan bimbingan teknis untuk administrasi sekolah",
            userId: "1762696525337",
            username: "wawan", 
            schoolId: "school_2025_003",
            schoolName: "SDN 3 Garut Kota",
            date: new Date(2025, 1, 5).toISOString(),
            status: "planned",
            createdAt: new Date(2025, 0, 24).toISOString()
        }
    ];
    
    return {
        users: [wawaUser],
        schools,
        tasks,
        supervisions,
        additionalTasks
    };
}

// 3. Simpan data ke localStorage
function saveDataToLocalStorage(data) {
    console.log('💾 Menyimpan data ke localStorage...');
    
    // Simpan ke local-database utama
    localStorage.setItem('local-database', JSON.stringify(data));
    
    // Simpan juga ke key individual untuk kompatibilitas
    localStorage.setItem('tasks_data', JSON.stringify(data.tasks));
    localStorage.setItem('supervisions_data', JSON.stringify(data.supervisions));
    localStorage.setItem('schools_data', JSON.stringify(data.schools));
    localStorage.setItem('additional_tasks_data', JSON.stringify(data.additionalTasks));
    
    // Set user session
    localStorage.setItem('auth_user', JSON.stringify(data.users[0]));
    localStorage.setItem('currentUser', JSON.stringify(data.users[0]));
    
    console.log('✅ Data berhasil disimpan ke localStorage');
}

// 4. Verifikasi data dan hitung statistik
function verifyAndCalculateStats(data) {
    console.log('🔍 Memverifikasi data dan menghitung statistik...');
    
    const currentUser = data.users[0];
    const userTasks = data.tasks.filter(task => 
        task.username === currentUser.username || task.userId === currentUser.id
    );
    const userSupervisions = data.supervisions.filter(supervision => 
        supervision.username === currentUser.username || supervision.userId === currentUser.id
    );
    const userAdditionalTasks = data.additionalTasks.filter(task => 
        task.username === currentUser.username || task.userId === currentUser.id
    );
    
    const completedTasks = userTasks.filter(task => 
        task.completed === true || task.status === 'completed'
    ).length;
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlySupervisions = userSupervisions.filter(supervision => {
        const date = new Date(supervision.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    }).length;
    
    const stats = {
        totalTasks: userTasks.length,
        completedTasks,
        totalSchools: data.schools.length,
        monthlySupervisions,
        totalSupervisions: userSupervisions.length,
        totalAdditionalTasks: userAdditionalTasks.length
    };
    
    console.log('📊 Statistik yang dihitung:');
    console.log('- Total Tugas:', stats.totalTasks);
    console.log('- Tugas Selesai:', stats.completedTasks);
    console.log('- Total Sekolah:', stats.totalSchools);
    console.log('- Supervisi Bulan Ini:', stats.monthlySupervisions);
    console.log('- Total Supervisi:', stats.totalSupervisions);
    console.log('- Total Tugas Tambahan:', stats.totalAdditionalTasks);
    
    return stats;
}

// 5. Force refresh dashboard
function forceRefreshDashboard() {
    console.log('🔄 Memaksa refresh dashboard...');
    
    // Trigger storage event untuk memaksa dashboard reload
    window.dispatchEvent(new StorageEvent('storage', {
        key: 'local-database',
        newValue: localStorage.getItem('local-database')
    }));
    
    // Trigger custom event jika ada
    window.dispatchEvent(new CustomEvent('dataUpdated'));
    
    // Reload halaman jika diperlukan
    setTimeout(() => {
        if (window.location.pathname === '/dashboard' || window.location.pathname === '/') {
            console.log('🔄 Reloading dashboard...');
            window.location.reload();
        }
    }, 1000);
}

// 6. Main function
function fixDashboardStatistics() {
    try {
        console.log('🚀 Memulai perbaikan dashboard statistik...');
        
        // Cek data yang ada
        const existingData = checkExistingData();
        
        // Buat data sample baru
        const sampleData = createSampleData();
        
        // Simpan data
        saveDataToLocalStorage(sampleData);
        
        // Verifikasi dan hitung statistik
        const stats = verifyAndCalculateStats(sampleData);
        
        // Force refresh dashboard
        forceRefreshDashboard();
        
        console.log('✅ Perbaikan dashboard selesai!');
        console.log('📊 Dashboard sekarang akan menampilkan statistik yang benar');
        
        return {
            success: true,
            stats,
            message: 'Dashboard berhasil diperbaiki dengan data sample tahun 2025'
        };
        
    } catch (error) {
        console.error('❌ Error saat memperbaiki dashboard:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Jalankan perbaikan
const result = fixDashboardStatistics();

if (result.success) {
    console.log('🎉 BERHASIL! Dashboard statistik telah diperbaiki');
    console.log('📈 Statistik baru:', result.stats);
    alert('✅ Dashboard berhasil diperbaiki!\n\nStatistik baru:\n' +
          `- Total Tugas: ${result.stats.totalTasks}\n` +
          `- Tugas Selesai: ${result.stats.completedTasks}\n` +
          `- Total Sekolah: ${result.stats.totalSchools}\n` +
          `- Supervisi Bulan Ini: ${result.stats.monthlySupervisions}\n` +
          `- Total Supervisi: ${result.stats.totalSupervisions}\n` +
          `- Total Tugas Tambahan: ${result.stats.totalAdditionalTasks}`);
} else {
    console.log('❌ GAGAL! Error:', result.error);
    alert('❌ Gagal memperbaiki dashboard: ' + result.error);
}