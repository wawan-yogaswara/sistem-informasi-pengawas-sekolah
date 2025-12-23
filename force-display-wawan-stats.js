// Script untuk memaksa menampilkan statistik data user wawan di dashboard
console.log('🚀 Memaksa menampilkan statistik user wawan...');

// 1. Set user session wawan
const localData = JSON.parse(localStorage.getItem('local-database') || '{}');
const wawaUser = localData.users?.find(u => u.username === 'wawan');

if (wawaUser) {
    localStorage.setItem('auth_user', JSON.stringify(wawaUser));
    localStorage.setItem('currentUser', JSON.stringify(wawaUser));
    console.log('✅ User wawan session set');
} else {
    console.log('❌ User wawan tidak ditemukan');
}

// 2. Hitung statistik langsung dari data yang ada
const tasks = localData.tasks || [];
const supervisions = localData.supervisions || [];
const additionalTasks = localData.additionalTasks || [];
const schools = localData.schools || [];

// Filter data untuk user wawan (ID: 1762696525337)
const wawanTasks = tasks.filter(task => task.userId === '1762696525337');
const wawanSupervisions = supervisions.filter(supervision => supervision.userId === '1762696525337');
const wawanAdditionalTasks = additionalTasks.filter(task => task.userId === '1762696525337');
const wawanSchools = schools.filter(school => school.userId === '1762696525337');

console.log('📊 Data user wawan yang ditemukan:');
console.log('- Tasks:', wawanTasks.length);
console.log('- Supervisions:', wawanSupervisions.length);
console.log('- Additional Tasks:', wawanAdditionalTasks.length);
console.log('- Schools:', wawanSchools.length);

// 3. Hitung statistik
const completedTasks = wawanTasks.filter(task => task.completed === true || task.status === 'completed').length;
const currentMonth = new Date().getMonth();
const currentYear = new Date().getFullYear();
const monthlySupervisions = wawanSupervisions.filter(supervision => {
    const date = new Date(supervision.date || supervision.createdAt);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
}).length;

const stats = {
    totalTasks: wawanTasks.length,
    completedTasks,
    totalSchools: wawanSchools.length,
    monthlySupervisions,
    totalSupervisions: wawanSupervisions.length,
    totalAdditionalTasks: wawanAdditionalTasks.length
};

console.log('📈 Statistik yang dihitung:', stats);

// 4. Simpan statistik ke localStorage untuk dipaksa tampil
localStorage.setItem('dashboard_stats_wawan', JSON.stringify(stats));

// 5. Inject statistik langsung ke dashboard jika ada
if (window.location.pathname === '/' || window.location.pathname === '/dashboard') {
    // Cari elemen statistik dan update langsung
    setTimeout(() => {
        const statElements = document.querySelectorAll('[class*="text-3xl"][class*="font-bold"]');
        
        if (statElements.length >= 6) {
            statElements[0].textContent = stats.totalTasks.toString(); // Total Tugas
            statElements[1].textContent = stats.completedTasks.toString(); // Tugas Selesai
            statElements[2].textContent = stats.totalSchools.toString(); // Sekolah Binaan
            statElements[3].textContent = stats.monthlySupervisions.toString(); // Supervisi Bulan Ini
            statElements[4].textContent = stats.totalSupervisions.toString(); // Total Supervisi
            statElements[5].textContent = stats.totalAdditionalTasks.toString(); // Tugas Tambahan
            
            console.log('✅ Statistik berhasil diinjeksi ke dashboard!');
        } else {
            console.log('⚠️ Elemen statistik tidak ditemukan, akan reload halaman');
            window.location.reload();
        }
    }, 2000);
}

// 6. Trigger React state update jika memungkinkan
window.dispatchEvent(new CustomEvent('forceStatsUpdate', { 
    detail: stats 
}));

console.log('✅ Script selesai. Dashboard akan menampilkan statistik user wawan.');