// Script untuk inject statistik user wawan langsung ke React state dashboard
console.log('💉 Injecting statistik user wawan ke dashboard...');

// 1. Ambil data dari localStorage
const localData = JSON.parse(localStorage.getItem('local-database') || '{}');
console.log('📊 Data loaded from localStorage');

// 2. Set user session wawan
const wawaUser = localData.users?.find(u => u.username === 'wawan');
if (wawaUser) {
    localStorage.setItem('auth_user', JSON.stringify(wawaUser));
    localStorage.setItem('currentUser', JSON.stringify(wawaUser));
    console.log('✅ Wawan user session set');
}

// 3. Filter dan hitung data wawan
const wawanId = '1762696525337';
const wawanTasks = (localData.tasks || []).filter(task => task.userId === wawanId);
const wawanSupervisions = (localData.supervisions || []).filter(supervision => supervision.userId === wawanId);
const wawanAdditionalTasks = (localData.additionalTasks || []).filter(task => task.userId === wawanId);
const wawanSchools = (localData.schools || []).filter(school => school.userId === wawanId);

const stats = {
    totalTasks: wawanTasks.length,
    completedTasks: wawanTasks.filter(task => task.completed === true || task.status === 'completed').length,
    totalSchools: wawanSchools.length,
    monthlySupervisions: wawanSupervisions.filter(supervision => {
        const date = new Date(supervision.date || supervision.createdAt);
        return date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear();
    }).length,
    totalSupervisions: wawanSupervisions.length,
    totalAdditionalTasks: wawanAdditionalTasks.length
};

console.log('📈 Statistik wawan:', stats);

// 4. Simpan ke localStorage dengan key khusus
localStorage.setItem('wawan_dashboard_stats', JSON.stringify(stats));
localStorage.setItem('wawan_filtered_data', JSON.stringify({
    tasks: wawanTasks,
    supervisions: wawanSupervisions,
    additionalTasks: wawanAdditionalTasks,
    schools: wawanSchools
}));

// 5. Force update DOM elements
function updateStatsDOM() {
    const statCards = document.querySelectorAll('.text-3xl.font-bold');
    
    if (statCards.length >= 6) {
        statCards[0].textContent = stats.totalTasks;
        statCards[1].textContent = stats.completedTasks;
        statCards[2].textContent = stats.totalSchools;
        statCards[3].textContent = stats.monthlySupervisions;
        statCards[4].textContent = stats.totalSupervisions;
        statCards[5].textContent = stats.totalAdditionalTasks;
        
        console.log('✅ DOM elements updated with wawan stats');
        return true;
    }
    return false;
}

// 6. Coba update DOM sekarang
if (!updateStatsDOM()) {
    // Jika belum ada, tunggu dan coba lagi
    setTimeout(() => {
        if (!updateStatsDOM()) {
            console.log('🔄 DOM belum ready, reloading page...');
            window.location.reload();
        }
    }, 3000);
}

// 7. Trigger custom event untuk React component
window.dispatchEvent(new CustomEvent('wawanStatsReady', {
    detail: { stats, data: { wawanTasks, wawanSupervisions, wawanAdditionalTasks, wawanSchools } }
}));

console.log('✅ Statistik user wawan berhasil diinjeksi!');