// Script simpel untuk menampilkan statistik dashboard user Wawan dari localStorage
console.log('🔄 Memuat statistik dashboard untuk user Wawan...');

// Fungsi untuk mengambil dan menampilkan statistik user Wawan
function loadWawanStatistics() {
    console.log('📊 Mengambil data user Wawan dari localStorage...');
    
    // Ambil data dari localStorage
    const localData = JSON.parse(localStorage.getItem('local-database') || '{}');
    const tasksData = JSON.parse(localStorage.getItem('tasks_data') || '[]');
    const supervisionsData = JSON.parse(localStorage.getItem('supervisions_data') || '[]');
    const schoolsData = JSON.parse(localStorage.getItem('schools_data') || '[]');
    const additionalTasksData = JSON.parse(localStorage.getItem('additional_tasks_data') || '[]');
    
    // Gabungkan data dari berbagai sumber
    let allTasks = localData.tasks || tasksData || [];
    let allSupervisions = localData.supervisions || supervisionsData || [];
    let allSchools = localData.schools || schoolsData || [];
    let allAdditionalTasks = localData.additionalTasks || additionalTasksData || [];
    
    console.log('📋 Data mentah:', {
        tasks: allTasks.length,
        supervisions: allSupervisions.length,
        schools: allSchools.length,
        additionalTasks: allAdditionalTasks.length
    });
    
    // Filter hanya data user Wawan
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
    
    // Sekolah yang pernah disupervisi Wawan
    const wawanSchoolIds = [...new Set(wawanSupervisions.map(s => s.schoolId || s.school_id))];
    const wawanSchools = allSchools.filter(school => 
        wawanSchoolIds.includes(school.id)
    );
    
    // Hitung statistik
    const completedTasks = wawanTasks.filter(task => 
        task.completed === true || task.status === 'completed'
    ).length;
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlySupervisions = wawanSupervisions.filter(supervision => {
        const date = new Date(supervision.date || supervision.createdAt);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    }).length;
    
    const statistics = {
        totalTasks: wawanTasks.length,
        completedTasks: completedTasks,
        totalSchools: wawanSchools.length,
        monthlySupervisions: monthlySupervisions,
        totalSupervisions: wawanSupervisions.length,
        totalAdditionalTasks: wawanAdditionalTasks.length
    };
    
    console.log('✅ Statistik user Wawan:', statistics);
    
    return {
        statistics,
        data: {
            tasks: wawanTasks,
            supervisions: wawanSupervisions,
            schools: wawanSchools,
            additionalTasks: wawanAdditionalTasks
        }
    };
}

// Fungsi untuk memperbarui tampilan dashboard
function updateDashboardDisplay(stats) {
    console.log('🎨 Memperbarui tampilan dashboard...');
    
    // Update elemen statistik jika ada
    const updateElement = (selector, value) => {
        const element = document.querySelector(selector);
        if (element) {
            element.textContent = value;
            console.log(`✅ Updated ${selector}: ${value}`);
        }
    };
    
    // Coba berbagai selector yang mungkin digunakan
    updateElement('[data-stat="totalTasks"]', stats.totalTasks);
    updateElement('[data-stat="completedTasks"]', stats.completedTasks);
    updateElement('[data-stat="totalSchools"]', stats.totalSchools);
    updateElement('[data-stat="monthlySupervisions"]', stats.monthlySupervisions);
    updateElement('[data-stat="totalSupervisions"]', stats.totalSupervisions);
    updateElement('[data-stat="totalAdditionalTasks"]', stats.totalAdditionalTasks);
    
    // Update berdasarkan teks yang mungkin ada
    const textSelectors = [
        'Total Tugas',
        'Tugas Selesai', 
        'Sekolah Binaan',
        'Supervisi Bulan Ini',
        'Total Supervisi',
        'Tugas Tambahan'
    ];
    
    textSelectors.forEach(text => {
        const elements = Array.from(document.querySelectorAll('*')).filter(el => 
            el.textContent && el.textContent.includes(text) && el.children.length === 0
        );
        
        elements.forEach(el => {
            const parent = el.parentElement;
            if (parent) {
                const numberElement = parent.querySelector('.text-3xl, .text-2xl, .stat-number, .font-bold');
                if (numberElement) {
                    let value = 0;
                    switch(text) {
                        case 'Total Tugas': value = stats.totalTasks; break;
                        case 'Tugas Selesai': value = stats.completedTasks; break;
                        case 'Sekolah Binaan': value = stats.totalSchools; break;
                        case 'Supervisi Bulan Ini': value = stats.monthlySupervisions; break;
                        case 'Total Supervisi': value = stats.totalSupervisions; break;
                        case 'Tugas Tambahan': value = stats.totalAdditionalTasks; break;
                    }
                    numberElement.textContent = value;
                    console.log(`✅ Updated ${text}: ${value}`);
                }
            }
        });
    });
    
    console.log('🎨 Tampilan dashboard berhasil diperbarui');
}

// Fungsi untuk trigger refresh React components
function triggerReactRefresh() {
    console.log('⚛️ Triggering React refresh...');
    
    // Dispatch events untuk React
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('dashboardRefresh'));
    window.dispatchEvent(new CustomEvent('statsUpdated'));
    
    // Jika ada React DevTools, trigger refresh
    if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
        console.log('⚛️ React DevTools detected, triggering refresh...');
        window.__REACT_DEVTOOLS_GLOBAL_HOOK__.onCommitFiberRoot();
    }
    
    console.log('⚛️ React refresh events dispatched');
}

// Fungsi utama
function fixDashboardStatistics() {
    console.log('🚀 Memulai perbaikan statistik dashboard...');
    
    try {
        // 1. Pastikan user Wawan login
        const currentUser = JSON.parse(localStorage.getItem('auth_user') || localStorage.getItem('currentUser') || '{}');
        
        if (!currentUser.username || currentUser.username !== 'wawan') {
            console.log('👤 Setting user Wawan sebagai current user...');
            const wawanUser = {
                id: "1762696525337",
                username: "wawan",
                fullName: "Wawan Setiawan",
                role: "user",
                nip: "196801011990031001"
            };
            localStorage.setItem('auth_user', JSON.stringify(wawanUser));
            localStorage.setItem('currentUser', JSON.stringify(wawanUser));
        }
        
        // 2. Load statistik Wawan
        const result = loadWawanStatistics();
        
        // 3. Update tampilan
        updateDashboardDisplay(result.statistics);
        
        // 4. Trigger React refresh
        triggerReactRefresh();
        
        // 5. Simpan statistik untuk referensi
        localStorage.setItem('wawan_statistics', JSON.stringify(result.statistics));
        localStorage.setItem('dashboard_last_updated', new Date().toISOString());
        
        console.log('🎉 Perbaikan statistik dashboard berhasil!');
        console.log('📊 Statistik Wawan:', result.statistics);
        
        return {
            success: true,
            statistics: result.statistics,
            message: 'Dashboard statistik berhasil diperbaiki untuk user Wawan'
        };
        
    } catch (error) {
        console.error('❌ Error dalam perbaikan statistik:', error);
        return {
            success: false,
            error: error.message,
            message: 'Gagal memperbaiki statistik dashboard'
        };
    }
}

// Fungsi untuk monitoring dan auto-refresh
function setupAutoRefresh() {
    console.log('🔄 Setting up auto-refresh...');
    
    // Monitor localStorage changes
    window.addEventListener('storage', function(e) {
        if (e.key && (e.key.includes('tasks') || e.key.includes('supervisions') || e.key.includes('additional'))) {
            console.log('📊 Data changed, refreshing statistics...');
            setTimeout(() => {
                const result = loadWawanStatistics();
                updateDashboardDisplay(result.statistics);
            }, 500);
        }
    });
    
    // Auto-refresh setiap 30 detik
    setInterval(() => {
        console.log('🔄 Auto-refreshing statistics...');
        const result = loadWawanStatistics();
        updateDashboardDisplay(result.statistics);
    }, 30000);
    
    console.log('✅ Auto-refresh setup complete');
}

// Jalankan perbaikan
console.log('🎯 Menjalankan perbaikan statistik dashboard untuk user Wawan...');

// Setup auto-refresh
setupAutoRefresh();

// Jalankan perbaikan utama
const result = fixDashboardStatistics();

// Tampilkan hasil
if (result.success) {
    console.log('🎉 BERHASIL! Statistik dashboard user Wawan telah diperbaiki');
    console.log('📊 Statistik:', result.statistics);
    
    // Tampilkan notifikasi jika memungkinkan
    if (typeof alert !== 'undefined') {
        setTimeout(() => {
            alert(`✅ Statistik Dashboard Diperbaiki!\n\nTotal Tugas: ${result.statistics.totalTasks}\nTugas Selesai: ${result.statistics.completedTasks}\nTotal Supervisi: ${result.statistics.totalSupervisions}\nSekolah Binaan: ${result.statistics.totalSchools}\nTugas Tambahan: ${result.statistics.totalAdditionalTasks}`);
        }, 1000);
    }
} else {
    console.error('❌ GAGAL! Error:', result.error);
}

// Export untuk penggunaan manual
if (typeof window !== 'undefined') {
    window.fixDashboardStatistics = fixDashboardStatistics;
    window.loadWawanStatistics = loadWawanStatistics;
    window.updateDashboardDisplay = updateDashboardDisplay;
}

console.log('✅ Script selesai. Gunakan fixDashboardStatistics() untuk menjalankan ulang.');