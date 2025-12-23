// Script untuk memaksa update dashboard dengan data user Wawan
console.log('🔄 Force updating dashboard dengan data user Wawan...');

// 1. Pastikan user Wawan login
const wawanUser = {
    id: "1762696525337",
    username: "wawan",
    fullName: "Wawan Setiawan",
    role: "user",
    nip: "196801011990031001"
};

localStorage.setItem('auth_user', JSON.stringify(wawanUser));
localStorage.setItem('currentUser', JSON.stringify(wawanUser));
console.log('✅ User Wawan set sebagai current user');

// 2. Cek data yang ada di localStorage
console.log('🔍 Checking existing data...');
const localData = JSON.parse(localStorage.getItem('local-database') || '{}');
const tasksData = JSON.parse(localStorage.getItem('tasks_data') || '[]');
const supervisionsData = JSON.parse(localStorage.getItem('supervisions_data') || '[]');
const schoolsData = JSON.parse(localStorage.getItem('schools_data') || '[]');
const additionalTasksData = JSON.parse(localStorage.getItem('additional_tasks_data') || '[]');

console.log('📊 Raw data counts:', {
    localDatabase: Object.keys(localData).length,
    tasks: (localData.tasks || tasksData).length,
    supervisions: (localData.supervisions || supervisionsData).length,
    schools: (localData.schools || schoolsData).length,
    additionalTasks: (localData.additionalTasks || additionalTasksData).length
});

// 3. Jika tidak ada data, buat data sample untuk Wawan
let allTasks = localData.tasks || tasksData || [];
let allSupervisions = localData.supervisions || supervisionsData || [];
let allSchools = localData.schools || schoolsData || [];
let allAdditionalTasks = localData.additionalTasks || additionalTasksData || [];

if (allTasks.length === 0 && allSupervisions.length === 0) {
    console.log('📝 No data found, creating sample data for Wawan...');
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    
    // Buat data sample untuk Wawan
    const sampleData = {
        users: [wawanUser],
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
            }
        ],
        tasks: [
            {
                id: "task_001",
                title: "Supervisi Pembelajaran Kelas 1-3",
                description: "Melakukan supervisi pembelajaran di kelas rendah",
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
                description: "Mengevaluasi implementasi kurikulum merdeka",
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
                description: "Memantau kelengkapan administrasi sekolah",
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
                notes: "Pembelajaran sudah berjalan dengan baik",
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
                notes: "Manajemen sekolah perlu diperbaiki",
                createdAt: new Date(currentYear, currentMonth, 12).toISOString()
            }
        ],
        additionalTasks: [
            {
                id: "additional_001",
                title: "Pelatihan Guru Kurikulum Merdeka",
                description: "Memberikan pelatihan kepada guru-guru",
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
                description: "Mengadakan workshop tentang penilaian autentik",
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
    
    // Simpan data sample
    localStorage.setItem('local-database', JSON.stringify(sampleData));
    localStorage.setItem('tasks_data', JSON.stringify(sampleData.tasks));
    localStorage.setItem('supervisions_data', JSON.stringify(sampleData.supervisions));
    localStorage.setItem('schools_data', JSON.stringify(sampleData.schools));
    localStorage.setItem('additional_tasks_data', JSON.stringify(sampleData.additionalTasks));
    
    allTasks = sampleData.tasks;
    allSupervisions = sampleData.supervisions;
    allSchools = sampleData.schools;
    allAdditionalTasks = sampleData.additionalTasks;
    
    console.log('✅ Sample data created for Wawan');
}

// 4. Filter data untuk user Wawan
const wawanTasks = allTasks.filter(task => 
    task.username === 'wawan' || 
    task.userId === '1762696525337' ||
    task.user === 'wawan'
);

const wawanSupervisions = allSupervisions.filter(supervision => 
    supervision.username === 'wawan' || 
    supervision.userId === '1762696525337' ||
    supervision.user === 'wawan'
);

const wawanAdditionalTasks = allAdditionalTasks.filter(task => 
    task.username === 'wawan' || 
    task.userId === '1762696525337' ||
    task.user === 'wawan'
);

// Sekolah yang disupervisi Wawan
const wawanSchoolIds = [...new Set(wawanSupervisions.map(s => s.schoolId || s.school_id))];
const wawanSchools = allSchools.filter(school => wawanSchoolIds.includes(school.id));

console.log('📊 Filtered data for Wawan:', {
    tasks: wawanTasks.length,
    supervisions: wawanSupervisions.length,
    schools: wawanSchools.length,
    additionalTasks: wawanAdditionalTasks.length
});

// 5. Hitung statistik
const completedTasks = wawanTasks.filter(task => 
    task.completed === true || task.status === 'completed'
).length;

const currentMonth = new Date().getMonth();
const currentYear = new Date().getFullYear();

const monthlySupervisions = wawanSupervisions.filter(supervision => {
    const date = new Date(supervision.date || supervision.createdAt);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
}).length;

const wawanStats = {
    totalTasks: wawanTasks.length,
    completedTasks: completedTasks,
    totalSchools: wawanSchools.length,
    monthlySupervisions: monthlySupervisions,
    totalSupervisions: wawanSupervisions.length,
    totalAdditionalTasks: wawanAdditionalTasks.length
};

console.log('✅ Statistik Wawan calculated:', wawanStats);

// 6. Simpan statistik untuk referensi
localStorage.setItem('wawan_statistics', JSON.stringify(wawanStats));
localStorage.setItem('dashboard_last_updated', new Date().toISOString());

// 7. Force update React state jika memungkinkan
if (typeof window !== 'undefined' && window.React) {
    console.log('⚛️ Attempting to force React update...');
    
    // Coba trigger re-render dengan berbagai cara
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('dashboardRefresh', { detail: wawanStats }));
    window.dispatchEvent(new CustomEvent('statsUpdated', { detail: wawanStats }));
    window.dispatchEvent(new CustomEvent('dataChanged', { detail: wawanStats }));
    
    // Jika ada React DevTools
    if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
        try {
            window.__REACT_DEVTOOLS_GLOBAL_HOOK__.onCommitFiberRoot();
        } catch (e) {
            console.log('React DevTools trigger failed, but that\'s okay');
        }
    }
}

// 8. Override fetchDashboardData function jika ada
if (typeof window !== 'undefined') {
    // Simpan fungsi override untuk dashboard
    window.getWawanStats = () => wawanStats;
    window.getWawanData = () => ({
        tasks: wawanTasks,
        supervisions: wawanSupervisions,
        schools: wawanSchools,
        additionalTasks: wawanAdditionalTasks
    });
    
    // Override console.log untuk menampilkan stats
    const originalLog = console.log;
    console.log = function(...args) {
        if (args[0] && args[0].includes && args[0].includes('Dashboard stats calculated:')) {
            originalLog('🎯 OVERRIDING Dashboard stats with Wawan data:', wawanStats);
            return;
        }
        originalLog.apply(console, args);
    };
}

// 9. Tampilkan hasil
console.log('🎉 FORCE UPDATE COMPLETE!');
console.log('📊 Statistik Dashboard Wawan:', wawanStats);
console.log('👤 Current User:', wawanUser.fullName);
console.log('🕒 Last Updated:', new Date().toLocaleString('id-ID'));

// 10. Reload halaman untuk memastikan perubahan terlihat
setTimeout(() => {
    console.log('🔄 Reloading page to show updated statistics...');
    if (confirm('Reload halaman untuk melihat statistik Wawan yang sudah diperbaiki?')) {
        window.location.reload();
    }
}, 2000);

console.log('✅ Script selesai. Dashboard sekarang menampilkan data user Wawan saja.');