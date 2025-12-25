// 🔧 CONSOLE FIX REPORTS SUPABASE
// Copy paste script ini ke console browser di halaman laporan (/reports)

console.log('🔧 FIXING REPORTS DATA LOADING FROM SUPABASE...');
console.log('===============================================');

// 1. Fix user ID Wawan ke UUID yang benar
const currentUser = localStorage.getItem('auth_user');
if (currentUser) {
  const userData = JSON.parse(currentUser);
  console.log('👤 Current user:', userData.username);
  
  if (userData.username === 'wawan') {
    userData.id = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';
    localStorage.setItem('auth_user', JSON.stringify(userData));
    console.log('✅ Updated Wawan user_id to UUID:', userData.id);
  }
}

// 2. Test load semua data dari Supabase
async function loadAndTestSupabaseData() {
  const wawanUserId = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';
  
  console.log('📊 Loading data from Supabase APIs...');
  
  try {
    // Load semua data sekaligus
    const [tasksResponse, additionalResponse, supervisionsResponse, schoolsResponse] = await Promise.all([
      fetch('/api/tasks-daily'),
      fetch('/api/activities'), 
      fetch('/api/supervisions'),
      fetch('/api/schools')
    ]);
    
    // Parse responses
    const tasks = tasksResponse.ok ? await tasksResponse.json() : [];
    const additional = additionalResponse.ok ? await additionalResponse.json() : [];
    const supervisions = supervisionsResponse.ok ? await supervisionsResponse.json() : [];
    const schools = schoolsResponse.ok ? await schoolsResponse.json() : [];
    
    console.log('📋 API Response Summary:');
    console.log(`  Tasks API: ${tasksResponse.status} - ${tasks.length} records`);
    console.log(`  Additional API: ${additionalResponse.status} - ${additional.length} records`);
    console.log(`  Supervisions API: ${supervisionsResponse.status} - ${supervisions.length} records`);
    console.log(`  Schools API: ${schoolsResponse.status} - ${schools.length} records`);
    
    // Filter untuk Wawan
    const wawanTasks = tasks.filter(t => t.user_id === wawanUserId);
    const wawanAdditional = additional.filter(t => t.user_id === wawanUserId);
    const wawanSupervisions = supervisions.filter(s => s.user_id === wawanUserId);
    
    console.log('\n🎯 WAWAN DATA FILTERED:');
    console.log(`📋 Tugas Pokok: ${wawanTasks.length}`);
    console.log(`➕ Tugas Tambahan: ${wawanAdditional.length}`);
    console.log(`🔍 Supervisi: ${wawanSupervisions.length}`);
    
    // Detail data
    console.log('\n📝 DETAIL DATA WAWAN:');
    
    if (wawanTasks.length > 0) {
      console.log('📋 Tasks:');
      wawanTasks.forEach((task, i) => {
        console.log(`  ${i+1}. ${task.title} (${new Date(task.created_at).toLocaleDateString()})`);
      });
    }
    
    if (wawanAdditional.length > 0) {
      console.log('➕ Additional Tasks:');
      wawanAdditional.forEach((task, i) => {
        console.log(`  ${i+1}. ${task.name || task.title} (${new Date(task.created_at).toLocaleDateString()})`);
      });
    }
    
    if (wawanSupervisions.length > 0) {
      console.log('🔍 Supervisions:');
      wawanSupervisions.forEach((supervision, i) => {
        const school = schools.find(s => s.id === supervision.school_id);
        console.log(`  ${i+1}. Supervisi ${school?.name || 'Sekolah'} (${new Date(supervision.created_at).toLocaleDateString()})`);
      });
    }
    
    const totalActivities = wawanTasks.length + wawanAdditional.length + wawanSupervisions.length;
    
    console.log(`\n📊 TOTAL AKTIVITAS WAWAN: ${totalActivities}`);
    
    if (totalActivities > 0) {
      console.log('\n✅ SUCCESS: Data Wawan ditemukan di Supabase!');
      console.log('🔄 Refreshing page untuk menampilkan data...');
      
      // Refresh page setelah 3 detik
      setTimeout(() => {
        location.reload();
      }, 3000);
    } else {
      console.log('\n❌ PROBLEM: Tidak ada data Wawan ditemukan');
      console.log('💡 POSSIBLE CAUSES:');
      console.log('   - User_id tidak cocok');
      console.log('   - Data belum dimigrasi ke Supabase');
      console.log('   - API endpoint bermasalah');
      
      // Debug: tampilkan semua user_id yang ada
      const allUserIds = [
        ...new Set([
          ...tasks.map(t => t.user_id),
          ...additional.map(t => t.user_id),
          ...supervisions.map(s => s.user_id)
        ])
      ];
      
      console.log('\n🔍 ALL USER_IDS IN DATABASE:');
      allUserIds.forEach(userId => {
        const taskCount = tasks.filter(t => t.user_id === userId).length;
        const additionalCount = additional.filter(t => t.user_id === userId).length;
        const supervisionCount = supervisions.filter(s => s.user_id === userId).length;
        const total = taskCount + additionalCount + supervisionCount;
        
        if (total > 0) {
          console.log(`  ${userId}: ${total} activities (T:${taskCount}, A:${additionalCount}, S:${supervisionCount})`);
        }
      });
    }
    
  } catch (error) {
    console.error('❌ ERROR loading data:', error);
  }
}

// 3. Execute the function
loadAndTestSupabaseData();

console.log('\n📋 INSTRUCTIONS:');
console.log('1. Make sure you are on /reports page');
console.log('2. Wait for data loading to complete');
console.log('3. Page will auto-refresh if data is found');
console.log('4. Check console output for detailed info');