// Script untuk memperbaiki data dashboard user Wawan
console.log('🔧 Starting dashboard data fix for user Wawan...');

// 1. Set user Wawan dengan benar
const wawaUser = {
    id: "1762696525337",
    username: "wawan",
    fullName: "Wawan Setiawan",
    role: "user",
    nip: "196801011990031001"
};

console.log('👤 Setting user Wawan data...');
localStorage.setItem('auth_user', JSON.stringify(wawaUser));
localStorage.setItem('currentUser', JSON.stringify(wawaUser));
localStorage.setItem('user_data', JSON.stringify(wawaUser));

// 2. Buat data sample yang realistis untuk Wawan
const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth();

const sampleData = {
    users: [
        {
            id: "1762696525337",
            username: "wawan",
            fullName: "Wawan Setiawan",
            role: "user",
            nip: "196801011990031001"
        }
    ],
    schools: [
        {
            id: "school_001",
            name: "SDN 1 Garut Kota",
            address: "Jl. Raya Garut No. 1",
            headmaster: "Drs. Ahmad Suryadi"
        },
        {
            id: "school_002", 
            name: "SDN 2 Garut Kota",
            address: "Jl. Raya Garut No. 2",
            headmaster: "Hj. Siti Nurhasanah, S.Pd"
        },
        {
            id: "school_003",
            name: "SDN 3 Garut Kota", 
            address: "Jl. Raya Garut No. 3",
            headmaster: "Drs. Bambang Sutrisno"
        },
        {
            id: "school_004",
            name: "SDN 4 Garut Kota", 
            address: "Jl. Raya Garut No. 4",
            headmaster: "Dra. Rina Sari"
        },
        {
            id: "school_005",
            name: "SDN 5 Garut Kota", 
            address: "Jl. Raya Garut No. 5",
            headmaster: "H. Dedi Kurniawan, S.Pd"
        }
    ],
    tasks: [
        {
            id: "task_001",
            title: "Supervisi Pembelajaran Kelas 1-3",
            description: "Melakukan supervisi pembelajaran di kelas rendah untuk memastikan kualitas pembelajaran sesuai standar",
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
            status: "completed",
            completed: true,
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
            status: "in_progress",
            completed: false,
            date: new Date(currentYear, currentMonth, 15).toISOString(),
            createdAt: new Date(currentYear, currentMonth, 5).toISOString()
        },
        {
            id: "task_004",
            title: "Supervisi Manajerial Kepala Sekolah",
            description: "Melakukan supervisi manajerial terhadap kepemimpinan kepala sekolah",
            userId: "1762696525337",
            username: "wawan", 
            schoolId: "school_004",
            schoolName: "SDN 4 Garut Kota",
            status: "pending",
            completed: false,
            date: new Date(currentYear, currentMonth, 20).toISOString(),
            createdAt: new Date(currentYear, currentMonth, 8).toISOString()
        },
        {
            id: "task_005",
            title: "Evaluasi Program Sekolah",
            description: "Mengevaluasi program-program sekolah dan memberikan rekomendasi perbaikan",
            userId: "1762696525337",
            username: "wawan", 
            schoolId: "school_005",
            schoolName: "SDN 5 Garut Kota",
            status: "completed",
            completed: true,
            date: new Date(currentYear, currentMonth, 25).toISOString(),
            createdAt: new Date(currentYear, currentMonth, 12).toISOString()
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
            notes: "Pembelajaran sudah berjalan dengan baik, guru menguasai materi dengan baik",
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
            notes: "Manajemen sekolah perlu diperbaiki, terutama dalam hal administrasi",
            createdAt: new Date(currentYear, currentMonth, 12).toISOString()
        },
        {
            id: "supervision_003", 
            title: "Supervisi Pembelajaran IPA",
            schoolId: "school_003",
            schoolName: "SDN 3 Garut Kota",
            userId: "1762696525337",
            username: "wawan",
            date: new Date(currentYear, currentMonth, 18).toISOString(),
            notes: "Pembelajaran IPA sudah menggunakan metode eksperimen sederhana",
            createdAt: new Date(currentYear, currentMonth, 18).toISOString()
        },
        {
            id: "supervision_004", 
            title: "Supervisi Administrasi Guru",
            schoolId: "school_004",
            schoolName: "SDN 4 Garut Kota",
            userId: "1762696525337",
            username: "wawan",
            date: new Date(currentYear, currentMonth, 22).toISOString(),
            notes: "Administrasi guru sudah lengkap dan tertata dengan baik",
            createdAt: new Date(currentYear, currentMonth, 22).toISOString()
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
            status: "completed",
            createdAt: new Date(currentYear, currentMonth, 20).toISOString()
        },
        {
            id: "additional_003",
            title: "Bimbingan Teknis Administrasi",
            description: "Memberikan bimbingan teknis administrasi sekolah kepada kepala sekolah",
            userId: "1762696525337",
            username: "wawan", 
            schoolId: "school_003",
            schoolName: "SDN 3 Garut Kota",
            date: new Date(currentYear, currentMonth + 1, 5).toISOString(),
            status: "scheduled",
            createdAt: new Date(currentYear, currentMonth, 25).toISOString()
        }
    ]
};

console.log('📊 Creating sample data...');
console.log(`- ${sampleData.tasks.length} tasks`);
console.log(`- ${sampleData.supervisions.length} supervisions`);
console.log(`- ${sampleData.schools.length} schools`);
console.log(`- ${sampleData.additionalTasks.length} additional tasks`);

// 3. Simpan data ke localStorage
localStorage.setItem('local-database', JSON.stringify(sampleData));
localStorage.setItem('tasks_data', JSON.stringify(sampleData.tasks));
localStorage.setItem('supervisions_data', JSON.stringify(sampleData.supervisions));
localStorage.setItem('schools_data', JSON.stringify(sampleData.schools));
localStorage.setItem('additional_tasks_data', JSON.stringify(sampleData.additionalTasks));

// 4. Hapus data dummy 2024 jika ada
console.log('🗑️ Cleaning up 2024 dummy data...');
const cleanData = (data) => {
    return data.filter(item => {
        const itemDate = new Date(item.date || item.createdAt || item.created_at);
        return itemDate.getFullYear() !== 2024;
    });
};

// Clean existing data
const existingLocalData = JSON.parse(localStorage.getItem('local-database') || '{}');
if (existingLocalData.tasks) {
    existingLocalData.tasks = cleanData(existingLocalData.tasks);
}
if (existingLocalData.supervisions) {
    existingLocalData.supervisions = cleanData(existingLocalData.supervisions);
}
if (existingLocalData.additionalTasks) {
    existingLocalData.additionalTasks = cleanData(existingLocalData.additionalTasks);
}

// Update with cleaned data
localStorage.setItem('local-database', JSON.stringify(existingLocalData));

// 5. Verifikasi data
console.log('✅ Verifying data...');
const verifyData = () => {
    const currentUser = JSON.parse(localStorage.getItem('auth_user') || '{}');
    const localData = JSON.parse(localStorage.getItem('local-database') || '{}');
    
    const tasks = localData.tasks || [];
    const supervisions = localData.supervisions || [];
    const schools = localData.schools || [];
    const additionalTasks = localData.additionalTasks || [];
    
    // Filter for current user
    const userTasks = tasks.filter(task => 
        task.username === currentUser.username || 
        task.userId === currentUser.id ||
        (currentUser.username === 'wawan' && task.userId === '1762696525337')
    );
    
    const userSupervisions = supervisions.filter(supervision => 
        supervision.username === currentUser.username || 
        supervision.userId === currentUser.id ||
        (currentUser.username === 'wawan' && supervision.userId === '1762696525337')
    );
    
    const userAdditionalTasks = additionalTasks.filter(task => 
        task.username === currentUser.username || 
        task.userId === currentUser.id ||
        (currentUser.username === 'wawan' && task.userId === '1762696525337')
    );
    
    // Calculate stats
    const completedTasks = userTasks.filter(task => 
        task.completed === true || task.status === 'completed'
    ).length;
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlySupervisions = userSupervisions.filter(supervision => {
        const date = new Date(supervision.date || supervision.createdAt);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    }).length;
    
    const stats = {
        totalTasks: userTasks.length,
        completedTasks,
        totalSchools: schools.length,
        monthlySupervisions,
        totalSupervisions: userSupervisions.length,
        totalAdditionalTasks: userAdditionalTasks.length
    };
    
    console.log('📊 Final Dashboard Stats for Wawan:');
    console.log(`- Total Tugas: ${stats.totalTasks}`);
    console.log(`- Tugas Selesai: ${stats.completedTasks}`);
    console.log(`- Sekolah Binaan: ${stats.totalSchools}`);
    console.log(`- Supervisi Bulan Ini: ${stats.monthlySupervisions}`);
    console.log(`- Total Supervisi: ${stats.totalSupervisions}`);
    console.log(`- Tugas Tambahan: ${stats.totalAdditionalTasks}`);
    
    return stats;
};

const finalStats = verifyData();

console.log('✅ Dashboard data fix completed!');
console.log('🔄 Please refresh the dashboard page to see the updated data.');

// Trigger storage event to notify other tabs
window.dispatchEvent(new StorageEvent('storage', {
    key: 'local-database',
    newValue: localStorage.getItem('local-database')
}));

// Return stats for verification
finalStats;