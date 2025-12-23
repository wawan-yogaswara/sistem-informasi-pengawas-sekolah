// Script untuk langsung inject data ke localStorage dan fix dashboard zero
console.log('🚀 INJECTING DATA LANGSUNG KE LOCALSTORAGE...');

// Hapus data lama yang mungkin corrupt
console.log('🗑️ Clearing old data...');
localStorage.removeItem('local-database');
localStorage.removeItem('auth_user');
localStorage.removeItem('currentUser');
localStorage.removeItem('user_data');
localStorage.removeItem('tasks_data');
localStorage.removeItem('supervisions_data');
localStorage.removeItem('schools_data');
localStorage.removeItem('additional_tasks_data');

// Buat data sample dengan tanggal saat ini
const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth();

console.log(`📅 Using current date: ${currentDate.toISOString()}`);

// Data sample lengkap
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
            photoUrl: null
        },
        {
            id: "1762696525337",
            username: "wawan",
            password: "$2b$10$hashedpassword",
            fullName: "Wawan Setiawan",
            full_name: "Wawan Setiawan",
            role: "user",
            createdAt: "2025-01-15T10:00:00.000Z",
            nip: "196801011990031001",
            rank: "Pengawas Sekolah",
            officeName: "Dinas Pendidikan Kabupaten Garut",
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
            user_id: "1762696525337",
            username: "wawan",
            user: "wawan",
            schoolId: "school_001",
            schoolName: "SDN 1 Garut Kota",
            status: "completed",
            completed: true,
            date: new Date(currentYear, currentMonth, 5).toISOString(),
            createdAt: new Date(currentYear, currentMonth, 1).toISOString(),
            created_at: new Date(currentYear, currentMonth, 1).toISOString()
        },
        {
            id: "task_002",
            title: "Evaluasi Kurikulum Merdeka",
            description: "Mengevaluasi implementasi kurikulum merdeka di sekolah binaan",
            userId: "1762696525337",
            user_id: "1762696525337", 
            username: "wawan",
            user: "wawan",
            schoolId: "school_002",
            schoolName: "SDN 2 Garut Kota",
            status: "in_progress",
            completed: false,
            date: new Date(currentYear, currentMonth, 10).toISOString(),
            createdAt: new Date(currentYear, currentMonth, 3).toISOString(),
            created_at: new Date(currentYear, currentMonth, 3).toISOString()
        },
        {
            id: "task_003",
            title: "Monitoring Administrasi Sekolah",
            description: "Memantau kelengkapan administrasi sekolah dan memberikan bimbingan",
            userId: "1762696525337",
            user_id: "1762696525337",
            username: "wawan",
            user: "wawan", 
            schoolId: "school_003",
            schoolName: "SDN 3 Garut Kota",
            status: "pending",
            completed: false,
            date: new Date(currentYear, currentMonth, 15).toISOString(),
            createdAt: new Date(currentYear, currentMonth, 5).toISOString(),
            created_at: new Date(currentYear, currentMonth, 5).toISOString()
        }
    ],
    supervisions: [
        {
            id: "supervision_001",
            title: "Supervisi Akademik Semester 1",
            schoolId: "school_001",
            school_id: "school_001",
            schoolName: "SDN 1 Garut Kota",
            userId: "1762696525337",
            user_id: "1762696525337",
            username: "wawan",
            user: "wawan",
            date: new Date(currentYear, currentMonth, 8).toISOString(),
            notes: "Pembelajaran sudah berjalan dengan baik, perlu peningkatan media pembelajaran",
            recommendations: "Menambah media pembelajaran interaktif",
            createdAt: new Date(currentYear, currentMonth, 8).toISOString(),
            created_at: new Date(currentYear, currentMonth, 8).toISOString()
        },
        {
            id: "supervision_002", 
            title: "Supervisi Manajerial",
            schoolId: "school_002",
            school_id: "school_002",
            schoolName: "SDN 2 Garut Kota",
            userId: "1762696525337",
            user_id: "1762696525337",
            username: "wawan",
            user: "wawan",
            date: new Date(currentYear, currentMonth, 12).toISOString(),
            notes: "Manajemen sekolah perlu diperbaiki dalam hal administrasi",
            recommendations: "Melengkapi dokumen administrasi sekolah",
            createdAt: new Date(currentYear, currentMonth, 12).toISOString(),
            created_at: new Date(currentYear, currentMonth, 12).toISOString()
        }
    ],
    additionalTasks: [
        {
            id: "additional_001",
            title: "Pelatihan Guru Kurikulum Merdeka",
            description: "Memberikan pelatihan kepada guru-guru tentang implementasi kurikulum merdeka",
            userId: "1762696525337",
            user_id: "1762696525337",
            username: "wawan",
            user: "wawan",
            schoolId: "school_001", 
            schoolName: "SDN 1 Garut Kota",
            date: new Date(currentYear, currentMonth, 20).toISOString(),
            status: "completed",
            createdAt: new Date(currentYear, currentMonth, 18).toISOString(),
            created_at: new Date(currentYear, currentMonth, 18).toISOString()
        },
        {
            id: "additional_002",
            title: "Workshop Penilaian Autentik",
            description: "Mengadakan workshop tentang penilaian autentik untuk guru-guru",
            userId: "1762696525337",
            user_id: "1762696525337",
            username: "wawan",
            user: "wawan", 
            schoolId: "school_002",
            schoolName: "SDN 2 Garut Kota",
            date: new Date(currentYear, currentMonth, 25).toISOString(),
            status: "scheduled",
            createdAt: new Date(currentYear, currentMonth, 20).toISOString(),
            created_at: new Date(currentYear, currentMonth, 20).toISOString()
        }
    ]
};

// Inject data ke localStorage
console.log('💾 Injecting to local-database...');
localStorage.setItem('local-database', JSON.stringify(sampleData));

console.log('💾 Injecting to individual keys...');
localStorage.setItem('tasks_data', JSON.stringify(sampleData.tasks));
localStorage.setItem('supervisions_data', JSON.stringify(sampleData.supervisions));
localStorage.setItem('schools_data', JSON.stringify(sampleData.schools));
localStorage.setItem('additional_tasks_data', JSON.stringify(sampleData.additionalTasks));

// Set user session
const wawaUser = {
    id: "1762696525337",
    username: "wawan",
    fullName: "Wawan Setiawan",
    full_name: "Wawan Setiawan",
    role: "user",
    nip: "196801011990031001",
    rank: "Pengawas Sekolah",
    officeName: "Dinas Pendidikan Kabupaten Garut"
};

console.log('👤 Setting user session...');
localStorage.setItem('auth_user', JSON.stringify(wawaUser));
localStorage.setItem('currentUser', JSON.stringify(wawaUser));
localStorage.setItem('user_data', JSON.stringify(wawaUser));

// Verifikasi data
console.log('🔍 Verifying data...');
const verification = JSON.parse(localStorage.getItem('local-database') || '{}');
console.log(`✅ Tasks: ${verification.tasks?.length || 0}`);
console.log(`✅ Supervisions: ${verification.supervisions?.length || 0}`);
console.log(`✅ Schools: ${verification.schools?.length || 0}`);
console.log(`✅ Additional Tasks: ${verification.additionalTasks?.length || 0}`);

const userVerification = JSON.parse(localStorage.getItem('auth_user') || '{}');
console.log(`✅ User: ${userVerification.username} (${userVerification.fullName})`);

console.log('🎉 DATA INJECTION SELESAI!');
console.log('🔄 Silakan refresh halaman dashboard untuk melihat perubahan');

// Auto refresh jika di browser
if (typeof window !== 'undefined') {
    console.log('🔄 Auto refreshing in 3 seconds...');
    setTimeout(() => {
        window.location.reload();
    }, 3000);
}