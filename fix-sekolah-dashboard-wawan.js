// Script untuk memperbaiki data sekolah agar tampil di dashboard user wawan
// Jalankan di browser console (F12 -> Console)

console.log('🔧 Memperbaiki data sekolah untuk dashboard wawan...');

function fixSekolahDashboardWawan() {
  // 1. Set user wawan
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
  
  // 2. Ambil data sekolah yang ada
  const localDatabase = JSON.parse(localStorage.getItem('local-database') || '{}');
  let schools = localDatabase.schools || [];
  
  // Jika tidak ada di local-database, ambil dari schools_data
  if (schools.length === 0) {
    const schoolsData = JSON.parse(localStorage.getItem('schools_data') || '[]');
    schools = schoolsData;
  }
  
  console.log('📊 Data sekolah yang ditemukan:', schools.length);
  schools.forEach((school, index) => {
    console.log(`  ${index + 1}. ${school.name}`);
  });
  
  // 3. Pastikan semua sekolah memiliki userId untuk user wawan
  const updatedSchools = schools.map(school => {
    // Jika sekolah belum memiliki userId, assign ke wawan
    if (!school.userId && !school.user_id && !school.assignedTo && !school.supervisor) {
      console.log(`🔧 Menambahkan userId ke sekolah: ${school.name}`);
      return {
        ...school,
        userId: "1762696525337",
        user_id: "1762696525337",
        username: "wawan",
        assignedTo: "wawan",
        supervisor: "wawan"
      };
    }
    
    // Jika sudah ada userId tapi bukan wawan, update ke wawan
    if (school.userId && school.userId !== "1762696525337") {
      console.log(`🔧 Mengupdate userId sekolah ${school.name} ke wawan`);
      return {
        ...school,
        userId: "1762696525337",
        user_id: "1762696525337",
        username: "wawan",
        assignedTo: "wawan",
        supervisor: "wawan"
      };
    }
    
    // Jika sudah benar, pastikan semua field terisi
    return {
      ...school,
      userId: school.userId || "1762696525337",
      user_id: school.user_id || "1762696525337",
      username: school.username || "wawan",
      assignedTo: school.assignedTo || "wawan",
      supervisor: school.supervisor || "wawan"
    };
  });
  
  console.log('✅ Semua sekolah sudah diupdate untuk user wawan');
  
  // 4. Update database
  const updatedDatabase = {
    ...localDatabase,
    schools: updatedSchools
  };
  
  localStorage.setItem('local-database', JSON.stringify(updatedDatabase));
  localStorage.setItem('schools_data', JSON.stringify(updatedSchools));
  
  console.log('💾 Database berhasil diupdate');
  
  // 5. Hitung ulang statistik dashboard
  const tasks = (localDatabase.tasks || []).filter(t => 
    t.username === 'wawan' || t.userId === '1762696525337' || t.user_id === '1762696525337'
  );
  
  const supervisions = (localDatabase.supervisions || []).filter(s => 
    s.username === 'wawan' || s.userId === '1762696525337' || s.user_id === '1762696525337'
  );
  
  const additionalTasks = (localDatabase.additionalTasks || []).filter(at => 
    at.username === 'wawan' || at.userId === '1762696525337' || at.user_id === '1762696525337'
  );
  
  const completedTasks = tasks.filter(t => t.completed === true || t.status === 'completed').length;
  
  const currentMonth = new Date().getMonth();
  const monthlySupervisions = supervisions.filter(s => {
    const date = new Date(s.date || s.createdAt);
    return date.getMonth() === currentMonth;
  }).length;
  
  const stats = {
    totalTasks: tasks.length,
    completedTasks: completedTasks,
    totalSchools: updatedSchools.length, // Sekarang menggunakan semua sekolah
    monthlySupervisions: monthlySupervisions,
    totalSupervisions: supervisions.length,
    totalAdditionalTasks: additionalTasks.length
  };
  
  console.log('📊 Statistik dashboard yang baru:', stats);
  
  // 6. Update DOM langsung
  const statElements = document.querySelectorAll('.text-3xl.font-bold');
  if (statElements.length >= 6) {
    statElements[0].textContent = stats.totalTasks;
    statElements[1].textContent = stats.completedTasks;
    statElements[2].textContent = stats.totalSchools; // Ini yang diperbaiki
    statElements[3].textContent = stats.monthlySupervisions;
    statElements[4].textContent = stats.totalSupervisions;
    statElements[5].textContent = stats.totalAdditionalTasks;
    
    console.log('✅ Dashboard berhasil diupdate!');
  }
  
  // 7. Simpan statistik
  localStorage.setItem('wawan_dashboard_stats', JSON.stringify(stats));
  
  // 8. Trigger event
  window.dispatchEvent(new CustomEvent('wawanStatsReady', {
    detail: { stats: stats }
  }));
  
  return {
    totalSchools: updatedSchools.length,
    stats: stats,
    updatedSchools: updatedSchools
  };
}

// Jalankan perbaikan
const result = fixSekolahDashboardWawan();

console.log('🎯 HASIL PERBAIKAN:');
console.log(`📊 Total Sekolah Binaan: ${result.totalSchools}`);
console.log(`📋 Total Tugas: ${result.stats.totalTasks}`);
console.log(`✅ Tugas Selesai: ${result.stats.completedTasks}`);
console.log(`👁️ Supervisi Bulan Ini: ${result.stats.monthlySupervisions}`);
console.log(`📊 Total Supervisi: ${result.stats.totalSupervisions}`);
console.log(`➕ Tugas Tambahan: ${result.stats.totalAdditionalTasks}`);

console.log('\n🏫 Sekolah yang sekarang ditampilkan:');
result.updatedSchools.forEach((school, index) => {
  console.log(`  ${index + 1}. ${school.name} (assigned to: ${school.assignedTo})`);
});

alert(`🎯 Perbaikan selesai! Dashboard sekarang menampilkan ${result.totalSchools} sekolah binaan.`);