// Script test cepat untuk memverifikasi masalah Edge vs Chrome
// Jalankan di console browser untuk cek status data

console.log('🧪 Test Edge vs Chrome Sync - Quick Check');

function quickTest() {
    const browser = navigator.userAgent.includes('Edg') ? 'Edge' : 
                   navigator.userAgent.includes('Chrome') ? 'Chrome' : 'Other';
    
    console.log(`🌐 Browser: ${browser}`);
    
    // Cek data localStorage
    const localData = JSON.parse(localStorage.getItem('local-database') || '{}');
    const authUser = JSON.parse(localStorage.getItem('auth_user') || '{}');
    const tasksData = JSON.parse(localStorage.getItem('tasks_data') || '[]');
    const supervisionsData = JSON.parse(localStorage.getItem('supervisions_data') || '[]');
    const schoolsData = JSON.parse(localStorage.getItem('schools_data') || '[]');
    
    // Hitung statistik
    const stats = {
        browser: browser,
        hasMainData: !!localData.tasks,
        hasUserSession: !!authUser.username,
        tasks: {
            fromMain: (localData.tasks || []).length,
            fromSeparate: tasksData.length,
            completed: (localData.tasks || []).filter(t => t.completed).length
        },
        supervisions: {
            fromMain: (localData.supervisions || []).length,
            fromSeparate: supervisionsData.length
        },
        schools: {
            fromMain: (localData.schools || []).length,
            fromSeparate: schoolsData.length
        }
    };
    
    console.log('📊 Data Status:');
    console.log(`  User Session: ${stats.hasUserSession ? '✅ Ada' : '❌ Tidak ada'} (${authUser.username || 'N/A'})`);
    console.log(`  Main Database: ${stats.hasMainData ? '✅ Ada' : '❌ Tidak ada'}`);
    console.log(`  Tasks: ${stats.tasks.fromMain} (${stats.tasks.completed} selesai)`);
    console.log(`  Supervisions: ${stats.supervisions.fromMain}`);
    console.log(`  Schools: ${stats.schools.fromMain}`);
    
    // Identifikasi masalah
    let issues = [];
    
    if (!stats.hasUserSession) {
        issues.push('❌ Tidak ada user session');
    }
    
    if (!stats.hasMainData) {
        issues.push('❌ Tidak ada data utama');
    }
    
    if (browser === 'Edge') {
        if (stats.tasks.fromMain === 0 || stats.supervisions.fromMain === 0) {
            issues.push('🔴 Edge: Statistik kosong/salah');
        }
        if (stats.schools.fromMain > 0) {
            console.log('✅ Edge: Data sekolah binaan ada');
        }
    } else if (browser === 'Chrome') {
        if (stats.tasks.fromMain > 0 && stats.supervisions.fromMain === 0) {
            issues.push('🟡 Chrome: Ada tugas tapi tidak ada aktivitas');
        }
        if (stats.tasks.fromMain > 0) {
            console.log('✅ Chrome: Data statistik ada');
        }
    }
    
    // Tampilkan hasil
    if (issues.length === 0) {
        console.log('🎉 TIDAK ADA MASALAH: Data sudah konsisten!');
        console.log('📊 Expected stats: 4 tugas (2 selesai), 3 sekolah, 3 supervisi');
        
        const isCorrect = 
            stats.tasks.fromMain === 4 &&
            stats.tasks.completed === 2 &&
            stats.schools.fromMain === 3 &&
            stats.supervisions.fromMain === 3;
            
        if (isCorrect) {
            console.log('✅ PERFECT: Semua data sudah benar!');
        } else {
            console.log('⚠️ Data ada tapi belum sesuai expected values');
        }
    } else {
        console.log('🚨 MASALAH DITEMUKAN:');
        issues.forEach(issue => console.log(`  ${issue}`));
        console.log('\n💡 SOLUSI:');
        console.log('  1. Jalankan: fix-edge-chrome-sync-final.js');
        console.log('  2. Atau buka: FIX_MASALAH_EDGE_CHROME_FINAL.html');
        console.log('  3. Atau jalankan: diagnosa-masalah-browser-berbeda.js');
    }
    
    return {
        browser,
        stats,
        issues,
        needsFix: issues.length > 0
    };
}

// Jalankan test
const result = quickTest();

// Tampilkan ringkasan
console.log('\n📋 RINGKASAN TEST:');
console.log(`Browser: ${result.browser}`);
console.log(`Status: ${result.needsFix ? '❌ Perlu perbaikan' : '✅ OK'}`);
console.log(`Issues: ${result.issues.length}`);

if (result.needsFix) {
    console.log('\n🔧 Jalankan salah satu script perbaikan untuk mengatasi masalah ini.');
} else {
    console.log('\n🎉 Data sudah konsisten antara Edge dan Chrome!');
}

// Return result untuk penggunaan lebih lanjut
window.edgeChromeTestResult = result;