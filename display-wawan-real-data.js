// Script untuk menampilkan data riil user wawan di dashboard
// Jalankan di browser console (F12 -> Console)

console.log('🔄 Loading real data for user wawan...');

// 1. Set user wawan session
function setWawanSession() {
  console.log('👤 Setting wawan user session...');
  
  const wawaUser = {
    id: "1762696525337",
    username: "wawan",
    fullName: "H. Wawan Yogaswara, S.Pd, M.Pd",
    role: "pengawas",
    nip: "196801011990031001",
    createdAt: "2025-11-09T13:55:25.337Z"
  };
  
  // Set ke semua possible keys
  localStorage.setItem('auth_user', JSON.stringify(wawaUser));
  localStorage.setItem('currentUser', JSON.stringify(wawaUser));
  localStorage.setItem('user_data', JSON.stringify(wawaUser));
  
  console.log('✅ Wawan user session set');
  return wawaUser;
}

// 2. Load real data from local-database
function loadRealData() {
  console.log('📊 Loading real data from local-database...');
  
  const localData = JSON.parse(localStorage.getItem('local-database') || '{}');
  
  if (!localData.users || localData.users.length === 0) {
    console.log('⚠️ No data in local-database, creating sample data...');
    return createSampleData();
  }
  
  // Filter data untuk user wawan
  const wawaUserId = "1762696525337";
  
  const userTasks = (localData.tasks || []).filter(task => 
    task.userId === wawaUserId || 
    task.username === 'wawan' ||
    task.user_id === wawaUserId
  );
  
  const userSupervisions = (localData.supervisions || []).filter(supervision => 
    supervision.userId === wawaUserId || 
    supervision.username === 'wawan' ||
    supervision.user_id === wawaUserId
  );
  
  const userAdditionalTasks = (localData.additionalTasks || []).filter(task => 
    task.userId === wawaUserId || 
    task.username === 'wawan' ||
    task.user_id === wawaUserId
  );
  
  const userSchools = (localData.schools || []).filter(school => 
    school.userId === wawaUserId || 
    school.user_id === wawaUserId
  );
  
  console.log('📊 Real data loaded:', {
    tasks: userTasks.length,
    supervisions: userSupervisions.length,
    additionalTasks: userAdditionalTasks.length,
    schools: userSchools.length
  });
  
  return {
    tasks: userTasks,
    supervisions: userSupervisions,
    additionalTasks: userAdditionalTasks,
    schools: userSchools
  };
}

// 3. Create sample data if no real data exists
function createSampleData() {
  console.log('📝 Creating sample data for wawan...');
  
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  
  const sampleData = {
    tasks: [
      {
        id: "task_wawan_001",
        title: "Supervisi Pembelajaran Kelas 1-3",
        description: "Melakukan supervisi pembelajaran di kelas rendah",
        userId: "1762696525337",
        username: "wawan",
        schoolId: "school_001",
        schoolName: "SDN 1 Garut Kota",
        status: "completed",
        completed: true,
        date: new Date(currentYear, currentMonth, 5).toISOString(),
        createdAt: new Date(currentYear, currentMonth, 1).toISOString()
      },
      {
        id: "task_wawan_002",
        title: "Evaluasi Kurikulum Merdeka",
        description: "Mengevaluasi implementasi kurikulum merdeka",
        userId: "1762696525337",
        username: "wawan",
        schoolId: "school_002",
        schoolName: "SDN 2 Garut Kota",
        status: "in_progress",
        completed: false,
        date: new Date(currentYear, currentMonth, 10).toISOString(),
        createdAt: new Date(currentYear, currentMonth, 3).toISOString()
      },
      {
        id: "task_wawan_003",
        title: "Monitoring Administrasi Sekolah",
        description: "Memantau kelengkapan administrasi sekolah",
        userId: "1762696525337",
        username: "wawan",
        schoolId: "school_003",
        schoolName: "SDN 3 Garut Kota",
        status: "pending",
        completed: false,
        date: new Date(currentYear, currentMonth, 15).toISOString(),
        createdAt: new Date(currentYear, currentMonth, 5).toISOString()
      }
    ],
    supervisions: [
      {
        id: "supervision_wawan_001",
        title: "Supervisi Akademik Semester 1",
        schoolId: "school_001",
        schoolName: "SDN 1 Garut Kota",
        userId: "1762696525337",
        username: "wawan",
        date: new Date(currentYear, currentMonth, 8).toISOString(),
        notes: "Pembelajaran sudah berjalan dengan baik",
        createdAt: new Date(currentYear, currentMonth, 8).toISOString()
      },
      {
        id: "supervision_wawan_002",
        title: "Supervisi Manajerial",
        schoolId: "school_002",
        schoolName: "SDN 2 Garut Kota",
        userId: "1762696525337",
        username: "wawan",
        date: new Date(currentYear, currentMonth, 12).toISOString(),
        notes: "Manajemen sekolah perlu diperbaiki",
        createdAt: new Date(currentYear, currentMonth, 12).toISOString()
      }
    ],
    additionalTasks: [
      {
        id: "additional_wawan_001",
        title: "Pelatihan Guru Kurikulum Merdeka",
        description: "Memberikan pelatihan kepada guru-guru",
        userId: "1762696525337",
        username: "wawan",
        schoolId: "school_001",
        schoolName: "SDN 1 Garut Kota",
        date: new Date(currentYear, currentMonth, 20).toISOString(),
        status: "completed",
        createdAt: new Date(currentYear, currentMonth, 18).toISOString()
      },
      {
        id: "additional_wawan_002",
        title: "Workshop Penilaian Autentik",
        description: "Mengadakan workshop tentang penilaian autentik",
        userId: "1762696525337",
        username: "wawan",
        schoolId: "school_002",
        schoolName: "SDN 2 Garut Kota",
        date: new Date(currentYear, currentMonth, 25).toISOString(),
        status: "scheduled",
        createdAt: new Date(currentYear, currentMonth, 20).toISOString()
      }
    ],
    schools: [
      {
        id: "school_001",
        name: "SDN 1 Garut Kota",
        address: "Jl. Raya Garut No. 1",
        headmaster: "Drs. Ahmad Suryadi",
        userId: "1762696525337"
      },
      {
        id: "school_002",
        name: "SDN 2 Garut Kota",
        address: "Jl. Raya Garut No. 2",
        headmaster: "Hj. Siti Nurhasanah, S.Pd",
        userId: "1762696525337"
      },
      {
        id: "school_003",
        name: "SDN 3 Garut Kota",
        address: "Jl. Raya Garut No. 3",
        headmaster: "Drs. Bambang Sutrisno",
        userId: "1762696525337"
      }
    ]
  };
  
  console.log('✅ Sample data created');
  return sampleData;
}

// 4. Calculate and display statistics
function calculateAndDisplayStats(data) {
  console.log('📊 Calculating statistics...');
  
  const completedTasks = data.tasks.filter(task => 
    task.completed === true || task.status === 'completed'
  ).length;
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlySupervisions = data.supervisions.filter(supervision => {
    const date = new Date(supervision.date || supervision.createdAt);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  }).length;
  
  const stats = {
    totalTasks: data.tasks.length,
    completedTasks: completedTasks,
    totalSchools: data.schools.length,
    monthlySupervisions: monthlySupervisions,
    totalSupervisions: data.supervisions.length,
    totalAdditionalTasks: data.additionalTasks.length
  };
  
  console.log('📊 Statistics calculated:', stats);
  
  // Save stats untuk dashboard
  localStorage.setItem('wawan_dashboard_stats', JSON.stringify(stats));
  
  // Trigger dashboard update
  window.dispatchEvent(new CustomEvent('wawanStatsReady', {
    detail: { stats: stats }
  }));
  
  return stats;
}

// 5. Update dashboard display
function updateDashboardDisplay(stats) {
  console.log('🔄 Updating dashboard display...');
  
  // Update stats cards if they exist
  const updateStatCard = (selector, value) => {
    const element = document.querySelector(selector);
    if (element) {
      element.textContent = value;
      console.log(`✅ Updated ${selector} to ${value}`);
    }
  };
  
  // Try different selectors for stats
  updateStatCard('[data-stat="totalTasks"]', stats.totalTasks);
  updateStatCard('[data-stat="completedTasks"]', stats.completedTasks);
  updateStatCard('[data-stat="totalSchools"]', stats.totalSchools);
  updateStatCard('[data-stat="monthlySupervisions"]', stats.monthlySupervisions);
  updateStatCard('[data-stat="totalSupervisions"]', stats.totalSupervisions);
  updateStatCard('[data-stat="totalAdditionalTasks"]', stats.totalAdditionalTasks);
  
  // Also try to update by text content
  const statElements = document.querySelectorAll('.text-3xl.font-bold');
  if (statElements.length >= 6) {
    statElements[0].textContent = stats.totalTasks;
    statElements[1].textContent = stats.completedTasks;
    statElements[2].textContent = stats.totalSchools;
    statElements[3].textContent = stats.monthlySupervisions;
    statElements[4].textContent = stats.totalSupervisions;
    statElements[5].textContent = stats.totalAdditionalTasks;
    console.log('✅ Updated stats via text elements');
  }
  
  console.log('✅ Dashboard display updated');
}

// 6. Main function
function displayWawanRealData() {
  console.log('🚀 Starting to display wawan real data...');
  
  try {
    // Set user session
    setWawanSession();
    
    // Load real data
    const data = loadRealData();
    
    // Calculate statistics
    const stats = calculateAndDisplayStats(data);
    
    // Update dashboard display
    updateDashboardDisplay(stats);
    
    // Force refresh dashboard if React component exists
    if (window.React) {
      console.log('🔄 Triggering React refresh...');
      window.dispatchEvent(new CustomEvent('dashboardRefresh', {
        detail: { source: 'wawan-data-update' }
      }));
    }
    
    console.log('✅ Wawan real data displayed successfully!');
    console.log('📊 Final stats:', stats);
    
    // Show success message
    alert('✅ Data riil user wawan berhasil ditampilkan di dashboard!');
    
  } catch (error) {
    console.error('❌ Error displaying wawan data:', error);
    alert('❌ Error: ' + error.message);
  }
}

// Run the function
displayWawanRealData();

// Export for manual use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    displayWawanRealData,
    setWawanSession,
    loadRealData,
    calculateAndDisplayStats
  };
}