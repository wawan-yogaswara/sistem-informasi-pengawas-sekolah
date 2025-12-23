// Script untuk mendiagnosis data user wawan di localStorage
// Mengecek apakah data sudah ada dan kenapa tidak bisa di-fetch

console.log('🔍 Mendiagnosis data user wawan di localStorage...');

// 1. Cek semua data yang ada di localStorage
function checkAllLocalStorageData() {
    console.log('📊 Mengecek semua data di localStorage...');
    
    const keys = Object.keys(localStorage);
    console.log('🔑 Keys yang ditemukan di localStorage:', keys);
    
    const relevantData = {};
    
    keys.forEach(key => {
        try {
            const value = localStorage.getItem(key);
            if (value) {
                // Coba parse JSON jika memungkinkan
                try {
                    const parsed = JSON.parse(value);
                    relevantData[key] = parsed;
                    console.log(`✅ ${key}:`, typeof parsed === 'object' ? Object.keys(parsed) : parsed);
                } catch (e) {
                    relevantData[key] = value;
                    console.log(`📝 ${key}:`, value.substring(0, 100) + (value.length > 100 ? '...' : ''));
                }
            }
        } catch (error) {
            console.log(`❌ Error reading ${key}:`, error.message);
        }
    });
    
    return relevantData;
}

// 2. Cek data user wawan secara spesifik
function checkWawanUserData() {
    console.log('👤 Mengecek data user wawan...');
    
    const authUser = localStorage.getItem('auth_user');
    const currentUser = localStorage.getItem('currentUser');
    const userData = localStorage.getItem('user_data');
    
    console.log('🔍 Data user yang ditemukan:');
    
    if (authUser) {
        try {
            const parsed = JSON.parse(authUser);
            console.log('✅ auth_user:', parsed);
        } catch (e) {
            console.log('❌ auth_user tidak bisa di-parse:', authUser);
        }
    } else {
        console.log('❌ auth_user tidak ditemukan');
    }
    
    if (currentUser) {
        try {
            const parsed = JSON.parse(currentUser);
            console.log('✅ currentUser:', parsed);
        } catch (e) {
            console.log('❌ currentUser tidak bisa di-parse:', currentUser);
        }
    } else {
        console.log('❌ currentUser tidak ditemukan');
    }
    
    if (userData) {
        try {
            const parsed = JSON.parse(userData);
            console.log('✅ user_data:', parsed);
        } catch (e) {
            console.log('❌ user_data tidak bisa di-parse:', userData);
        }
    } else {
        console.log('❌ user_data tidak ditemukan');
    }
}

// 3. Cek data aktivitas untuk user wawan
function checkWawanActivitiesData() {
    console.log('📋 Mengecek data aktivitas untuk user wawan...');
    
    const localDatabase = localStorage.getItem('local-database');
    const tasksData = localStorage.getItem('tasks_data');
    const supervisionsData = localStorage.getItem('supervisions_data');
    const additionalTasksData = localStorage.getItem('additional_tasks_data');
    const schoolsData = localStorage.getItem('schools_data');
    
    let allTasks = [];
    let allSupervisions = [];
    let allAdditionalTasks = [];
    let allSchools = [];
    
    // Cek dari local-database utama
    if (localDatabase) {
        try {
            const db = JSON.parse(localDatabase);
            console.log('📊 local-database structure:', Object.keys(db));
            
            if (db.tasks) {
                allTasks = [...allTasks, ...db.tasks];
                console.log(`📋 Tasks dari local-database: ${db.tasks.length}`);
            }
            if (db.supervisions) {
                allSupervisions = [...allSupervisions, ...db.supervisions];
                console.log(`👁️ Supervisions dari local-database: ${db.supervisions.length}`);
            }
            if (db.additionalTasks) {
                allAdditionalTasks = [...allAdditionalTasks, ...db.additionalTasks];
                console.log(`➕ Additional tasks dari local-database: ${db.additionalTasks.length}`);
            }
            if (db.schools) {
                allSchools = [...allSchools, ...db.schools];
                console.log(`🏫 Schools dari local-database: ${db.schools.length}`);
            }
        } catch (e) {
            console.log('❌ Error parsing local-database:', e.message);
        }
    }
    
    // Cek dari individual keys
    if (tasksData) {
        try {
            const tasks = JSON.parse(tasksData);
            allTasks = [...allTasks, ...tasks];
            console.log(`📋 Tasks dari tasks_data: ${tasks.length}`);
        } catch (e) {
            console.log('❌ Error parsing tasks_data:', e.message);
        }
    }
    
    if (supervisionsData) {
        try {
            const supervisions = JSON.parse(supervisionsData);
            allSupervisions = [...allSupervisions, ...supervisions];
            console.log(`👁️ Supervisions dari supervisions_data: ${supervisions.length}`);
        } catch (e) {
            console.log('❌ Error parsing supervisions_data:', e.message);
        }
    }
    
    if (additionalTasksData) {
        try {
            const additionalTasks = JSON.parse(additionalTasksData);
            allAdditionalTasks = [...allAdditionalTasks, ...additionalTasks];
            console.log(`➕ Additional tasks dari additional_tasks_data: ${additionalTasks.length}`);
        } catch (e) {
            console.log('❌ Error parsing additional_tasks_data:', e.message);
        }
    }
    
    if (schoolsData) {
        try {
            const schools = JSON.parse(schoolsData);
            allSchools = [...allSchools, ...schools];
            console.log(`🏫 Schools dari schools_data: ${schools.length}`);
        } catch (e) {
            console.log('❌ Error parsing schools_data:', e.message);
        }
    }
    
    // Remove duplicates
    allTasks = allTasks.filter((task, index, self) => 
        index === self.findIndex(t => t.id === task.id)
    );
    allSupervisions = allSupervisions.filter((supervision, index, self) => 
        index === self.findIndex(s => s.id === supervision.id)
    );
    allAdditionalTasks = allAdditionalTasks.filter((task, index, self) => 
        index === self.findIndex(t => t.id === task.id)
    );
    allSchools = allSchools.filter((school, index, self) => 
        index === self.findIndex(s => s.id === school.id)
    );
    
    console.log('📊 Total data setelah deduplication:');
    console.log(`📋 Total tasks: ${allTasks.length}`);
    console.log(`👁️ Total supervisions: ${allSupervisions.length}`);
    console.log(`➕ Total additional tasks: ${allAdditionalTasks.length}`);
    console.log(`🏫 Total schools: ${allSchools.length}`);
    
    return {
        tasks: allTasks,
        supervisions: allSupervisions,
        additionalTasks: allAdditionalTasks,
        schools: allSchools
    };
}

// 4. Filter data untuk user wawan
function filterDataForWawan(allData) {
    console.log('🔍 Memfilter data untuk user wawan...');
    
    const wawanIdentifiers = ['wawan', '1762696525337'];
    
    const wawanTasks = allData.tasks.filter(task => {
        const matches = wawanIdentifiers.some(id => 
            task.username === id || 
            task.userId === id || 
            task.user === id || 
            task.user_id === id
        );
        if (matches) {
            console.log('✅ Found wawan task:', task.title || task.name);
        }
        return matches;
    });
    
    const wawanSupervisions = allData.supervisions.filter(supervision => {
        const matches = wawanIdentifiers.some(id => 
            supervision.username === id || 
            supervision.userId === id || 
            supervision.user === id || 
            supervision.user_id === id
        );
        if (matches) {
            console.log('✅ Found wawan supervision:', supervision.title || supervision.name);
        }
        return matches;
    });
    
    const wawanAdditionalTasks = allData.additionalTasks.filter(task => {
        const matches = wawanIdentifiers.some(id => 
            task.username === id || 
            task.userId === id || 
            task.user === id || 
            task.user_id === id
        );
        if (matches) {
            console.log('✅ Found wawan additional task:', task.title || task.name);
        }
        return matches;
    });
    
    console.log('📊 Data wawan yang ditemukan:');
    console.log(`📋 Wawan tasks: ${wawanTasks.length}`);
    console.log(`👁️ Wawan supervisions: ${wawanSupervisions.length}`);
    console.log(`➕ Wawan additional tasks: ${wawanAdditionalTasks.length}`);
    
    return {
        tasks: wawanTasks,
        supervisions: wawanSupervisions,
        additionalTasks: wawanAdditionalTasks,
        schools: allData.schools
    };
}

// 5. Hitung statistik berdasarkan data yang ada
function calculateStatsFromExistingData(wawanData) {
    console.log('📊 Menghitung statistik dari data yang ada...');
    
    const completedTasks = wawanData.tasks.filter(task => 
        task.completed === true || task.status === 'completed'
    ).length;
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlySupervisions = wawanData.supervisions.filter(supervision => {
        const date = new Date(supervision.date || supervision.createdAt);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    }).length;
    
    const stats = {
        totalTasks: wawanData.tasks.length,
        completedTasks,
        totalSchools: wawanData.schools.length,
        monthlySupervisions,
        totalSupervisions: wawanData.supervisions.length,
        totalAdditionalTasks: wawanData.additionalTasks.length
    };
    
    console.log('📈 Statistik yang dihitung:');
    console.log('- Total Tugas:', stats.totalTasks);
    console.log('- Tugas Selesai:', stats.completedTasks);
    console.log('- Total Sekolah:', stats.totalSchools);
    console.log('- Supervisi Bulan Ini:', stats.monthlySupervisions);
    console.log('- Total Supervisi:', stats.totalSupervisions);
    console.log('- Total Tugas Tambahan:', stats.totalAdditionalTasks);
    
    return stats;
}

// 6. Identifikasi masalah
function identifyProblems(stats, wawanData) {
    console.log('🔍 Mengidentifikasi masalah...');
    
    const problems = [];
    
    if (stats.totalTasks === 0) {
        problems.push('❌ Tidak ada data tugas untuk user wawan');
    }
    
    if (stats.totalSupervisions === 0) {
        problems.push('❌ Tidak ada data supervisi untuk user wawan');
    }
    
    if (stats.totalAdditionalTasks === 0) {
        problems.push('❌ Tidak ada data tugas tambahan untuk user wawan');
    }
    
    if (stats.totalSchools === 0) {
        problems.push('❌ Tidak ada data sekolah');
    }
    
    // Cek apakah ada data tapi tidak ter-filter dengan benar
    const authUser = localStorage.getItem('auth_user');
    const currentUser = localStorage.getItem('currentUser');
    
    if (!authUser && !currentUser) {
        problems.push('❌ Tidak ada data user session (auth_user/currentUser)');
    }
    
    // Cek format data
    wawanData.tasks.forEach((task, index) => {
        if (!task.userId && !task.username && !task.user && !task.user_id) {
            problems.push(`❌ Task ${index + 1} tidak memiliki identifier user`);
        }
    });
    
    if (problems.length === 0) {
        console.log('✅ Tidak ada masalah yang ditemukan dengan data');
    } else {
        console.log('🚨 Masalah yang ditemukan:');
        problems.forEach(problem => console.log(problem));
    }
    
    return problems;
}

// 7. Berikan rekomendasi perbaikan
function provideRecommendations(problems, stats, wawanData) {
    console.log('💡 Memberikan rekomendasi perbaikan...');
    
    const recommendations = [];
    
    if (stats.totalTasks === 0 && stats.totalSupervisions === 0 && stats.totalAdditionalTasks === 0) {
        recommendations.push('📝 Perlu membuat data sample atau mengimpor data yang sudah ada');
    } else if (stats.totalTasks > 0 || stats.totalSupervisions > 0 || stats.totalAdditionalTasks > 0) {
        recommendations.push('✅ Data sudah ada, masalah mungkin di dashboard component');
        recommendations.push('🔄 Coba refresh halaman atau clear cache browser');
    }
    
    const authUser = localStorage.getItem('auth_user');
    const currentUser = localStorage.getItem('currentUser');
    
    if (!authUser && !currentUser) {
        recommendations.push('👤 Perlu set user session dengan data user wawan');
    }
    
    if (wawanData.tasks.some(task => !task.userId && !task.username)) {
        recommendations.push('🔧 Perlu memperbaiki format data tasks dengan menambahkan userId/username');
    }
    
    console.log('💡 Rekomendasi:');
    recommendations.forEach(rec => console.log(rec));
    
    return recommendations;
}

// Main function
function diagnoseWawanData() {
    try {
        console.log('🚀 Memulai diagnosa data user wawan...');
        
        // 1. Cek semua data localStorage
        const allData = checkAllLocalStorageData();
        
        // 2. Cek data user wawan
        checkWawanUserData();
        
        // 3. Cek data aktivitas
        const activitiesData = checkWawanActivitiesData();
        
        // 4. Filter untuk user wawan
        const wawanData = filterDataForWawan(activitiesData);
        
        // 5. Hitung statistik
        const stats = calculateStatsFromExistingData(wawanData);
        
        // 6. Identifikasi masalah
        const problems = identifyProblems(stats, wawanData);
        
        // 7. Berikan rekomendasi
        const recommendations = provideRecommendations(problems, stats, wawanData);
        
        console.log('✅ Diagnosa selesai!');
        
        return {
            success: true,
            stats,
            problems,
            recommendations,
            wawanData
        };
        
    } catch (error) {
        console.error('❌ Error saat diagnosa:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Jalankan diagnosa
const result = diagnoseWawanData();

if (result.success) {
    console.log('🎯 HASIL DIAGNOSA:');
    console.log('📊 Statistik:', result.stats);
    console.log('🚨 Masalah:', result.problems.length, 'ditemukan');
    console.log('💡 Rekomendasi:', result.recommendations.length, 'diberikan');
    
    // Tampilkan ringkasan
    if (result.stats.totalTasks > 0 || result.stats.totalSupervisions > 0) {
        console.log('✅ DATA SUDAH ADA! Dashboard seharusnya bisa menampilkan statistik.');
        console.log('🔄 Coba refresh halaman atau periksa component dashboard.');
    } else {
        console.log('❌ DATA KOSONG! Perlu membuat atau mengimpor data.');
    }
} else {
    console.log('❌ DIAGNOSA GAGAL:', result.error);
}