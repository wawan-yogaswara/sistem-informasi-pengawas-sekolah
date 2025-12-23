// Script super sederhana untuk menampilkan data wawan di dashboard
// Copy paste ke browser console dan tekan Enter

console.log('🎯 Menampilkan data wawan di dashboard...');

// 1. Set user wawan
const wawan = {
  id: "1762696525337",
  username: "wawan", 
  fullName: "H. Wawan Yogaswara, S.Pd, M.Pd",
  role: "pengawas",
  nip: "196801011990031001"
};

localStorage.setItem('auth_user', JSON.stringify(wawan));
localStorage.setItem('currentUser', JSON.stringify(wawan));

// 2. Ambil data dari localStorage
const data = JSON.parse(localStorage.getItem('local-database') || '{}');

// 3. Filter data wawan
const tasks = (data.tasks || []).filter(t => t.username === 'wawan' || t.userId === '1762696525337');
const supervisions = (data.supervisions || []).filter(s => s.username === 'wawan' || s.userId === '1762696525337');
const schools = (data.schools || []).filter(sc => sc.username === 'wawan' || sc.userId === '1762696525337');
const additionalTasks = (data.additionalTasks || []).filter(at => at.username === 'wawan' || at.userId === '1762696525337');

// 4. Hitung statistik
const completedTasks = tasks.filter(t => t.completed === true || t.status === 'completed').length;
const currentMonth = new Date().getMonth();
const monthlySupervisions = supervisions.filter(s => {
  const date = new Date(s.date || s.createdAt);
  return date.getMonth() === currentMonth;
}).length;

const stats = {
  totalTasks: tasks.length,
  completedTasks: completedTasks,
  totalSchools: schools.length,
  monthlySupervisions: monthlySupervisions,
  totalSupervisions: supervisions.length,
  totalAdditionalTasks: additionalTasks.length
};

// 5. Simpan dan trigger update
localStorage.setItem('wawan_dashboard_stats', JSON.stringify(stats));
window.dispatchEvent(new CustomEvent('wawanStatsReady', { detail: { stats } }));

console.log('📊 Statistik wawan:', stats);

// 6. Update DOM langsung
setTimeout(() => {
  const elements = document.querySelectorAll('.text-3xl.font-bold');
  if (elements.length >= 6) {
    elements[0].textContent = stats.totalTasks;
    elements[1].textContent = stats.completedTasks;
    elements[2].textContent = stats.totalSchools;
    elements[3].textContent = stats.monthlySupervisions;
    elements[4].textContent = stats.totalSupervisions;
    elements[5].textContent = stats.totalAdditionalTasks;
    console.log('✅ Dashboard updated!');
  }
}, 500);

// 7. Refresh halaman
setTimeout(() => window.location.reload(), 2000);

alert('📊 Data wawan ditampilkan! Refresh dalam 2 detik...');