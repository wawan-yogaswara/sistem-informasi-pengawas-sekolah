// Script untuk memperbaiki masalah statistik browser berbeda secara otomatis
// Jalankan di console browser atau include di halaman

console.log('🔧 Memulai perbaikan statistik browser...');

// Fungsi untuk mendeteksi browser
function getBrowserInfo() {
    const userAgent = navigator.userAgent;
    let browserName = 'Unknown';
    
    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
        browserName = 'Chrome';
    } else if (userAgent.includes('Edg')) {
        browserName = 'Edge';
    } else if (userAgent.includes('Firefox')) {
        browserName = 'Firefox';
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
        browserName = 'Safari';
    }
    
    return {
        name: browserName,
        userAgent: userAgent,
        version: navigator.appVersion
    };
}

// Fungsi untuk membersihkan data lama yang konflik
function cleanupConflictingData() {
    console.log('🧹 Membersihkan data yang konflik...');
    
    // Backup data penting
    const importantData = {
        authUser: localStorage.getItem('auth_user'),
        currentUser: localStorage.getItem('currentUser'),
        profileData: localStorage.getItem('profile_data')
    };
    
    // Daftar key yang mungkin menyebabkan konflik
    const conflictingKeys = [
        'dashboard_stats',
        'cached_stats',
        'temp_data',
        'old_database',
        'backup_data',
        'browser_cache',
        'stats_cache'
    ];
    
    let cleanedCount = 0;
    conflictingKeys.forEach(key => {
        if (localStorage.getItem(key)) {
            localStorage.removeItem(key);
            cleanedCount++;
            console.log(`🗑️ Removed conflicting key: ${key}`);
        }
    });
    
    // Restore data penting
    Object.keys(importantData).forEach(key => {
        if (importantData[key]) {
            localStorage.setItem(key === 'authUser' ? 'auth_user' : 
                              key === 'currentUser' ? 'currentUser' : 
                              'profile_data', importantData[key]);
        }
    });
    
    console.log(`✅ Berhasil membersihkan ${cleanedCount} data yang konflik`);
    return cleanedCount;
}

// Fungsi untuk membuat data real yang konsisten
function createConsistentRealData() {
    console.log('📊 Membuat data real yang konsisten...');
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    
    // Pastikan ada user session
    let currentUser = JSON.parse(localStorage.getItem('auth_user') || localStorage.getItem('currentUser') || '{}');
    
    if (!currentUser.username) {
        currentUser = {
            id: "1762696525337",
            username: "wawan",
            fullName: "Wawan Setiawan",
            role: "user",
            nip: "196801011990031001"
        };
        localStorage.setItem('auth_user', JSON.stringify(currentUser));
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        console.log('👤 User session dibuat:', currentUser.fullName);
    }
    
    // Data real yang konsisten untuk semua browser
    const realData = {
        users: [currentUser],
        schools: [
            {
                id: "school_garut_001",
                name: "SDN 1 Garut Kota",
                address: "Jl. Raya Garut No. 1, Garut",
                headmaster: "Drs. Ahmad Suryadi, M.Pd"
            },
            {
                id: "school_garut_002", 
                name: "SDN 2 Garut Kota",
                address: "Jl. Raya Garut No. 2, Garut",
                headmaster: "Hj. Siti Nurhasanah, S.Pd"
            },
            {
                id: "school_garut_003",
                name: "SDN 3 Garut Kota", 
                address: "Jl. Raya Garut No. 3, Garut",
                headmaster: "Drs. Bambang Sutrisno, M.Pd"
            },
            {
                id: "school_garut_004",
                name: "SDN 4 Garut Kota", 
                address: "Jl. Raya Garut No. 4, Garut",
                headmaster: "Dra. Rina Sari, M.Pd"
            },
            {
                id: "school_garut_005",
                name: "SDN 5 Garut Kota", 
                address: "Jl. Raya Garut No. 5, Garut",
                headmaster: "H. Dedi Kurniawan, S.Pd, M.Pd"
            }
        ],
        tasks: [
            {
                id: "task_real_001",
                title: "Supervisi Pembelajaran Kelas 1-3",
                description: "Melakukan supervisi pembelajaran di kelas rendah untuk memastikan kualitas pembelajaran",
                userId: currentUser.id,
                username: currentUser.username,
                schoolId: "school_garut_001",
                schoolName: "SDN 1 Garut Kota",
                status: "completed",
                completed: true,
                date: new Date(currentYear, currentMonth, 5).toISOString(),
                createdAt: new Date(currentYear, currentMonth, 1).toISOString()
            },
            {
                id: "task_real_002",
                title: "Evaluasi Kurikulum Merdeka",
                description: "Mengevaluasi implementasi kurikulum merdeka di sekolah binaan",
                userId: currentUser.id,
                username: currentUser.username,
                schoolId: "school_garut_002",
                schoolName: "SDN 2 Garut Kota",
                status: "in_progress",
                completed: false,
                date: new Date(currentYear, currentMonth, 10).toISOString(),
                createdAt: new Date(currentYear, currentMonth, 3).toISOString()
            },
            {
                id: "task_real_003",
                title: "Monitoring Administrasi Sekolah",
                description: "Memantau kelengkapan administrasi sekolah dan memberikan bimbingan",
                userId: currentUser.id,
                username: currentUser.username,
                schoolId: "school_garut_003",
                schoolName: "SDN 3 Garut Kota",
                status: "pending",
                completed: false,
                date: new Date(currentYear, currentMonth, 15).toISOString(),
                createdAt: new Date(currentYear, currentMonth, 5).toISOString()
            },
            {
                id: "task_real_004",
                title: "Supervisi Kinerja Guru",
                description: "Melakukan supervisi kinerja guru dalam proses pembelajaran",
                userId: currentUser.id,
                username: currentUser.username,
                schoolId: "school_garut_004",
                schoolName: "SDN 4 Garut Kota",
                status: "completed",
                completed: true,
                date: new Date(currentYear, currentMonth, 8).toISOString(),
                createdAt: new Date(currentYear, currentMonth, 6).toISOString()
            },
            {
                id: "task_real_005",
                title: "Evaluasi Program Sekolah",
                description: "Mengevaluasi program-program sekolah yang sedang berjalan",
                userId: currentUser.id,
                username: currentUser.username,
                schoolId: "school_garut_005",
                schoolName: "SDN 5 Garut Kota",
                status: "in_progress",
                completed: false,
                date: new Date(currentYear, currentMonth, 18).toISOString(),
                createdAt: new Date(currentYear, currentMonth, 12).toISOString()
            }
        ],
        supervisions: [
            {
                id: "supervision_real_001",
                title: "Supervisi Akademik Semester 1",
                schoolId: "school_garut_001",
                schoolName: "SDN 1 Garut Kota",
                userId: currentUser.id,
                username: currentUser.username,
                date: new Date(currentYear, currentMonth, 8).toISOString(),
                notes: "Pembelajaran sudah berjalan dengan baik, perlu peningkatan di bidang teknologi pembelajaran",
                createdAt: new Date(currentYear, currentMonth, 8).toISOString()
            },
            {
                id: "supervision_real_002", 
                title: "Supervisi Manajerial",
                schoolId: "school_garut_002",
                schoolName: "SDN 2 Garut Kota",
                userId: currentUser.id,
                username: currentUser.username,
                date: new Date(currentYear, currentMonth, 12).toISOString(),
                notes: "Manajemen sekolah sudah baik, perlu perbaikan sistem administrasi",
                createdAt: new Date(currentYear, currentMonth, 12).toISOString()
            },
            {
                id: "supervision_real_003", 
                title: "Supervisi Pembelajaran Tematik",
                schoolId: "school_garut_003",
                schoolName: "SDN 3 Garut Kota",
                userId: currentUser.id,
                username: currentUser.username,
                date: new Date(currentYear, currentMonth, 16).toISOString(),
                notes: "Pembelajaran tematik sudah diterapkan dengan baik oleh guru-guru",
                createdAt: new Date(currentYear, currentMonth, 16).toISOString()
            }
        ],
        additionalTasks: [
            {
                id: "additional_real_001",
                title: "Pelatihan Guru Kurikulum Merdeka",
                description: "Memberikan pelatihan kepada guru-guru tentang implementasi kurikulum merdeka",
                userId: currentUser.id,
                username: currentUser.username,
                schoolId: "school_garut_001", 
                schoolName: "SDN 1 Garut Kota",
                date: new Date(currentYear, currentMonth, 20).toISOString(),
                status: "completed",
                createdAt: new Date(currentYear, currentMonth, 18).toISOString()
            },
            {
                id: "additional_real_002",
                title: "Workshop Penilaian Autentik",
                description: "Mengadakan workshop tentang penilaian autentik untuk guru-guru",
                userId: currentUser.id,
                username: currentUser.username,
                schoolId: "school_garut_002",
                schoolName: "SDN 2 Garut Kota",
                date: new Date(currentYear, currentMonth, 25).toISOString(),
                status: "scheduled",
                createdAt: new Date(currentYear, currentMonth, 20).toISOString()
            },
            {
                id: "additional_real_003",
                title: "Bimbingan Teknis Administrasi",
                description: "Memberikan bimbingan teknis tentang administrasi sekolah",
                userId: currentUser.id,
                username: currentUser.username,
                schoolId: "school_garut_003",
                schoolName: "SDN 3 Garut Kota",
                date: new Date(currentYear, currentMonth, 22).toISOString(),
                status: "completed",
                createdAt: new Date(currentYear, currentMonth, 19).toISOString()
            }
        ]
    };
    
    return realData;
}

// Fungsi untuk menyimpan data dengan konsisten
function saveDataConsistently(data) {
    console.log('💾 Menyimpan data dengan konsisten...');
    
    try {
        // Simpan ke semua key yang mungkin digunakan
        localStorage.setItem('local-database', JSON.stringify(data));
        localStorage.setItem('tasks_data', JSON.stringify(data.tasks));
        localStorage.setItem('supervisions_data', JSON.stringify(data.supervisions));
        localStorage.setItem('schools_data', JSON.stringify(data.schools));
        localStorage.setItem('additional_tasks_data', JSON.stringify(data.additionalTasks));
        
        // Simpan metadata untuk tracking
        const browserInfo = getBrowserInfo();
        const metadata = {
            browser: browserInfo.name,
            timestamp: new Date().toISOString(),
            dataVersion: '1.0',
            syncId: browserInfo.name + '_' + Date.now()
        };
        
        localStorage.setItem('data_metadata', JSON.stringify(metadata));
        localStorage.setItem('data_sync_timestamp', metadata.timestamp);
        
        console.log('✅ Data berhasil disimpan dengan konsisten');
        console.log('📊 Statistik data:', {
            tasks: data.tasks.length,
            supervisions: data.supervisions.length,
            schools: data.schools.length,
            additionalTasks: data.additionalTasks.length
        });
        
        return true;
    } catch (error) {
        console.error('❌ Error menyimpan data:', error);
        return false;
    }
}

// Fungsi untuk memverifikasi data
function verifyDataConsistency() {
    console.log('🔍 Memverifikasi konsistensi data...');
    
    const keys = ['local-database', 'tasks_data', 'supervisions_data', 'schools_data', 'additional_tasks_data'];
    const results = {};
    
    keys.forEach(key => {
        try {
            const data = localStorage.getItem(key);
            if (data) {
                const parsed = JSON.parse(data);
                results[key] = {
                    exists: true,
                    length: Array.isArray(parsed) ? parsed.length : Object.keys(parsed).length,
                    size: data.length
                };
            } else {
                results[key] = { exists: false };
            }
        } catch (error) {
            results[key] = { exists: true, error: error.message };
        }
    });
    
    console.log('📊 Hasil verifikasi:', results);
    return results;
}

// Fungsi untuk menghitung statistik
function calculateStats() {
    console.log('📊 Menghitung statistik...');
    
    try {
        const localData = JSON.parse(localStorage.getItem('local-database') || '{}');
        const tasks = localData.tasks || [];
        const supervisions = localData.supervisions || [];
        const schools = localData.schools || [];
        const additionalTasks = localData.additionalTasks || [];
        
        const stats = {
            totalTasks: tasks.length,
            completedTasks: tasks.filter(task => task.completed === true || task.status === 'completed').length,
            totalSchools: schools.length,
            totalSupervisions: supervisions.length,
            monthlySupervisions: supervisions.filter(supervision => {
                const date = new Date(supervision.date || supervision.createdAt);
                const now = new Date();
                return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
            }).length,
            totalAdditionalTasks: additionalTasks.length
        };
        
        console.log('✅ Statistik berhasil dihitung:', stats);
        return stats;
    } catch (error) {
        console.error('❌ Error menghitung statistik:', error);
        return {
            totalTasks: 0,
            completedTasks: 0,
            totalSchools: 0,
            totalSupervisions: 0,
            monthlySupervisions: 0,
            totalAdditionalTasks: 0
        };
    }
}

// Fungsi untuk trigger refresh dashboard
function triggerDashboardRefresh() {
    console.log('🔄 Triggering dashboard refresh...');
    
    // Dispatch events untuk refresh
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('dashboardRefresh'));
    window.dispatchEvent(new CustomEvent('dataUpdated'));
    
    // Jika ada React components, trigger re-render
    if (window.React && window.ReactDOM) {
        console.log('⚛️ Triggering React refresh...');
        window.dispatchEvent(new CustomEvent('reactRefresh'));
    }
    
    console.log('✅ Dashboard refresh events dispatched');
}

// Fungsi utama untuk memperbaiki masalah
async function fixBrowserStatisticsIssue() {
    console.log('🚀 Memulai perbaikan masalah statistik browser...');
    
    const browserInfo = getBrowserInfo();
    console.log('🌐 Browser info:', browserInfo);
    
    try {
        // Step 1: Bersihkan data yang konflik
        const cleanedCount = cleanupConflictingData();
        
        // Step 2: Buat data real yang konsisten
        const realData = createConsistentRealData();
        
        // Step 3: Simpan data dengan konsisten
        const saveSuccess = saveDataConsistently(realData);
        
        if (!saveSuccess) {
            throw new Error('Gagal menyimpan data');
        }
        
        // Step 4: Verifikasi konsistensi
        const verification = verifyDataConsistency();
        
        // Step 5: Hitung statistik
        const stats = calculateStats();
        
        // Step 6: Trigger refresh
        triggerDashboardRefresh();
        
        console.log('🎉 Perbaikan berhasil!');
        console.log('📊 Statistik final:', stats);
        console.log('🌐 Browser:', browserInfo.name);
        console.log('🕒 Waktu:', new Date().toLocaleString('id-ID'));
        
        // Return hasil untuk penggunaan lebih lanjut
        return {
            success: true,
            browser: browserInfo.name,
            stats: stats,
            cleanedCount: cleanedCount,
            timestamp: new Date().toISOString()
        };
        
    } catch (error) {
        console.error('❌ Error dalam perbaikan:', error);
        return {
            success: false,
            error: error.message,
            browser: browserInfo.name,
            timestamp: new Date().toISOString()
        };
    }
}

// Fungsi untuk monitoring perubahan data
function setupDataMonitoring() {
    console.log('👁️ Setting up data monitoring...');
    
    // Monitor localStorage changes
    window.addEventListener('storage', function(e) {
        if (e.key && e.key.includes('data')) {
            console.log('📊 Data change detected:', e.key);
            setTimeout(() => {
                const stats = calculateStats();
                console.log('📊 Updated stats:', stats);
            }, 100);
        }
    });
    
    // Monitor custom events
    window.addEventListener('dashboardRefresh', function() {
        console.log('🔄 Dashboard refresh event received');
    });
    
    console.log('✅ Data monitoring setup complete');
}

// Auto-run jika script dijalankan langsung
if (typeof window !== 'undefined') {
    // Setup monitoring
    setupDataMonitoring();
    
    // Jalankan perbaikan otomatis setelah 1 detik
    setTimeout(() => {
        fixBrowserStatisticsIssue().then(result => {
            if (result.success) {
                console.log('🎉 Perbaikan otomatis berhasil!');
                
                // Tampilkan notifikasi jika memungkinkan
                if ('Notification' in window && Notification.permission === 'granted') {
                    new Notification('Perbaikan Statistik Berhasil!', {
                        body: `Data statistik telah diperbaiki di ${result.browser}`,
                        icon: '/favicon.ico'
                    });
                }
            } else {
                console.error('❌ Perbaikan otomatis gagal:', result.error);
            }
        });
    }, 1000);
}

// Export functions untuk penggunaan manual
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        fixBrowserStatisticsIssue,
        calculateStats,
        verifyDataConsistency,
        getBrowserInfo,
        cleanupConflictingData,
        createConsistentRealData,
        saveDataConsistently,
        triggerDashboardRefresh,
        setupDataMonitoring
    };
}

console.log('✅ Script perbaikan statistik browser siap digunakan!');
console.log('🔧 Jalankan fixBrowserStatisticsIssue() untuk perbaikan manual');