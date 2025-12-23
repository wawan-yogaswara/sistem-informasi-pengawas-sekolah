// Script sederhana untuk menampilkan data user wawan ke statistik dashboard
// Jalankan di browser console (F12 -> Console)

console.log('📊 Menampilkan data user wawan ke dashboard...');

function tampilkanDataWawanKeDashboard() {
  // 1. Pastikan user wawan sudah login
  const wawaUser = {
    id: "1762696525337",
    username: "wawan",
    fullName: "H. Wawan Yogaswara, S.Pd, M.Pd",
    role: "pengawas",
    nip: "196801011990031001"
  };
  
  localStorage.setItem('auth_user', JSON.stringify(wawaUser));
  localStorage.setItem('currentUser', JSON.stringify(wawaUser));
  console.log('✅ User wawan session set');
  
  // 2. Ambil data yang sudah ada di localStorage
  const localData = JSON.parse(localStorage.getItem('local-database') || '{}');
  
  console.log('📋 Data yang ditemukan:', {
    tasks: localData.tasks?.length || 0,
    supervisions: localData.supervisions?.length || 0,
    schools: localData.schools?.length || 0,
    additionalTasks: localData.additionalTasks?.length || 0
  });
  
  // 3. Filter data untuk user wawan
  const userTasks = (localData.tasks || []).filter(task => 
    task.username === 'wawan' || 
    task.userId === '1762696525337' ||
    task.user_id === '1762696525337'
  );
  
  const userSupervisions = (localData.supervisions || []).filter(supervision => 
    supervision.username === 'wawan' || 
    supervision.userId === '1762696525337' ||
    supervision.user_id === '1762696525337'
  );
  
  const userSchools = (localData.schools || []).filter(school => 
    school.username === 'wawan' || 
    school.userId === '1762696525337' ||
    school.user_id === '1762696525337'
  );
  
  const userAdditionalTasks = (localData.additionalTasks || []).filter(task => 
    task.username === 'wawan' || 
    task.userId === '1762696525337' ||
    task.user_id === '1762696525337'
  );
  
  console.log('🔍 Data user wawan yang ditemukan:', {
    tasks: userTasks.length,
    supervisions: userSupervisions.length,
    schools: userSchools.length,
    additionalTasks: userAdditionalTasks.length
  });
  
  // 4. Hitung statistik
  const completedTasks = userTasks.filter(task => 
    task.completed === true || 
    task.status === 'completed' || 
    task.finished === true
  ).length;
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlySupervisions = userSupervisions.filter(supervision => {
    const date = new Date(supervision.date || supervision.createdAt);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  }).length;
  
  const stats = {
    totalTasks: userTasks.length,
    completedTasks: completedTasks,
    totalSchools: userSchools.length,
    monthlySupervisions: monthlySupervisions,
    totalSupervisions: userSupervisions.length,
    totalAdditionalTasks: userAdditionalTasks.length
  };
  
  console.log('📊 Statistik yang akan ditampilkan:', stats);
  
  // 5. Simpan statistik ke localStorage
  localStorage.setItem('wawan_dashboard_stats', JSON.stringify(stats));
  
  // 6. Trigger event untuk update dashboard
  window.dispatchEvent(new CustomEvent('wawanStatsReady', {
    detail: { stats: stats }
  }));
  
  // 7. Update DOM langsung jika elemen sudah ada
  setTimeout(() => {
    console.log('🎯 Mengupdate elemen DOM...');
    
    // Cari elemen statistik berdasarkan class
    const statElements = document.querySelectorAll('.text-3xl.font-bold');
    
    if (statElements.length >= 6) {
      statElements[0].textContent = stats.totalTasks.toString();
      statElements[1].textContent = stats.completedTasks.toString();
      statElements[2].textContent = stats.totalSchools.toString();
      statElements[3].textContent = stats.monthlySupervisions.toString();
      statElements[4].textContent = stats.totalSupervisions.toString();
      statElements[5].textContent = stats.totalAdditionalTasks.toString();
      
      console.log('✅ Elemen DOM berhasil diupdate');
    } else {
      console.log('⚠️ Elemen statistik tidak ditemukan, akan refresh halaman');
    }
    
    // Update progress bar juga
    const progressBar = document.querySelector('.bg-gradient-to-r.from-green-400.to-green-600');
    if (progressBar && stats.totalTasks > 0) {
      const percentage = (stats.completedTasks / stats.totalTasks) * 100;
      progressBar.style.width = `${percentage}%`;
      
      // Update persentase text
      const percentageText = document.querySelector('.text-sm.font-bold.text-green-600');
      if (percentageText) {
        percentageText.textContent = `${Math.round(percentage)}%`;
      }
    }
    
  }, 500);
  
  // 8. Refresh halaman setelah 2 detik untuk memastikan update
  setTimeout(() => {
    console.log('🔄 Refresh halaman untuk memastikan data tampil...');
    window.location.reload();
  }, 2000);
  
  return stats;
}

// Jalankan fungsi
const result = tampilkanDataWawanKeDashboard();

console.log('✅ Script selesai dijalankan!');
console.log('📊 Data yang akan ditampilkan di dashboard:');
console.log(`  - Total Tugas: ${result.totalTasks}`);
console.log(`  - Tugas Selesai: ${result.completedTasks}`);
console.log(`  - Sekolah Binaan: ${result.totalSchools}`);
console.log(`  - Supervisi Bulan Ini: ${result.monthlySupervisions}`);
console.log(`  - Total Supervisi: ${result.totalSupervisions}`);
console.log(`  - Tugas Tambahan: ${result.totalAdditionalTasks}`);

alert('📊 Data user wawan siap ditampilkan di dashboard! Halaman akan refresh dalam 2 detik...');