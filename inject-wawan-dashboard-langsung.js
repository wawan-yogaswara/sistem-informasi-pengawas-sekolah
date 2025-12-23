// Script inject langsung data wawan ke dashboard (tanpa refresh)
// Jalankan di console saat halaman dashboard sudah terbuka

console.log('⚡ Inject data wawan langsung ke dashboard...');

function injectWawanDashboard() {
  // 1. Set session wawan
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
  const localData = JSON.parse(localStorage.getItem('local-database') || '{}');
  
  // 3. Filter data untuk wawan
  const wawaData = {
    tasks: (localData.tasks || []).filter(item => 
      item.username === 'wawan' || 
      item.userId === '1762696525337' ||
      item.user_id === '1762696525337'
    ),
    supervisions: (localData.supervisions || []).filter(item => 
      item.username === 'wawan' || 
      item.userId === '1762696525337' ||
      item.user_id === '1762696525337'
    ),
    schools: (localData.schools || []).filter(item => 
      item.username === 'wawan' || 
      item.userId === '1762696525337' ||
      item.user_id === '1762696525337'
    ),
    additionalTasks: (localData.additionalTasks || []).filter(item => 
      item.username === 'wawan' || 
      item.userId === '1762696525337' ||
      item.user_id === '1762696525337'
    )
  };
  
  console.log('📊 Data wawan ditemukan:', {
    tasks: wawaData.tasks.length,
    supervisions: wawaData.supervisions.length,
    schools: wawaData.schools.length,
    additionalTasks: wawaData.additionalTasks.length
  });
  
  // 4. Hitung statistik
  const completedTasks = wawaData.tasks.filter(task => 
    task.completed === true || 
    task.status === 'completed' || 
    task.finished === true ||
    task.state === 'completed'
  ).length;
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlySupervisions = wawaData.supervisions.filter(supervision => {
    const date = new Date(supervision.date || supervision.createdAt);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  }).length;
  
  const finalStats = {
    totalTasks: wawaData.tasks.length,
    completedTasks: completedTasks,
    totalSchools: wawaData.schools.length,
    monthlySupervisions: monthlySupervisions,
    totalSupervisions: wawaData.supervisions.length,
    totalAdditionalTasks: wawaData.additionalTasks.length
  };
  
  console.log('📈 Statistik final:', finalStats);
  
  // 5. Update DOM langsung
  const statElements = document.querySelectorAll('.text-3xl.font-bold');
  
  if (statElements.length >= 6) {
    statElements[0].textContent = finalStats.totalTasks;
    statElements[1].textContent = finalStats.completedTasks;
    statElements[2].textContent = finalStats.totalSchools;
    statElements[3].textContent = finalStats.monthlySupervisions;
    statElements[4].textContent = finalStats.totalSupervisions;
    statElements[5].textContent = finalStats.totalAdditionalTasks;
    
    console.log('✅ Statistik berhasil diupdate di DOM!');
    
    // Update progress bar
    if (finalStats.totalTasks > 0) {
      const percentage = Math.round((finalStats.completedTasks / finalStats.totalTasks) * 100);
      const progressBar = document.querySelector('.bg-gradient-to-r.from-green-400.to-green-600');
      const percentageText = document.querySelector('.text-sm.font-bold.text-green-600');
      
      if (progressBar) {
        progressBar.style.width = `${percentage}%`;
      }
      
      if (percentageText) {
        percentageText.textContent = `${percentage}%`;
      }
      
      console.log(`📊 Progress bar updated: ${percentage}%`);
    }
    
    // Update completed/pending counts
    const completedCountElement = document.querySelector('.bg-green-50 .text-2xl.font-bold.text-green-600');
    const pendingCountElement = document.querySelector('.bg-blue-50 .text-2xl.font-bold.text-blue-600');
    
    if (completedCountElement) {
      completedCountElement.textContent = finalStats.completedTasks;
    }
    
    if (pendingCountElement) {
      pendingCountElement.textContent = finalStats.totalTasks - finalStats.completedTasks;
    }
    
  } else {
    console.log('⚠️ Elemen statistik tidak ditemukan');
  }
  
  // 6. Simpan ke localStorage untuk persistensi
  localStorage.setItem('wawan_dashboard_stats', JSON.stringify(finalStats));
  
  // 7. Trigger custom event
  window.dispatchEvent(new CustomEvent('wawanStatsReady', {
    detail: { stats: finalStats }
  }));
  
  return finalStats;
}

// Jalankan inject
const result = injectWawanDashboard();

console.log('🎯 HASIL INJECT:');
console.log(`📋 Total Tugas: ${result.totalTasks}`);
console.log(`✅ Tugas Selesai: ${result.completedTasks}`);
console.log(`🏫 Sekolah Binaan: ${result.totalSchools}`);
console.log(`👁️ Supervisi Bulan Ini: ${result.monthlySupervisions}`);
console.log(`📊 Total Supervisi: ${result.totalSupervisions}`);
console.log(`➕ Tugas Tambahan: ${result.totalAdditionalTasks}`);

alert('⚡ Data wawan berhasil diinjek ke dashboard!');