// 🔧 FIX REPORTS DATA LOADING FROM SUPABASE
// Script untuk memperbaiki pengambilan data di halaman laporan

console.log('🔧 FIXING REPORTS DATA LOADING FROM SUPABASE...');
console.log('================================================');

// 1. Update user_id di localStorage untuk Wawan
const currentUser = localStorage.getItem('auth_user');
if (currentUser) {
  const userData = JSON.parse(currentUser);
  console.log('👤 Current user:', userData.username);
  
  if (userData.username === 'wawan') {
    // Update dengan UUID yang benar dari Supabase
    userData.id = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';
    localStorage.setItem('auth_user', JSON.stringify(userData));
    console.log('✅ Updated Wawan user_id to UUID:', userData.id);
  }
}

// 2. Function untuk load data langsung dari Supabase
async function loadAllActivitiesFromSupabase() {
  console.log('📊 Loading all activities from Supabase...');
  
  const wawanUserId = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';
  const activities = [];
  
  try {
    // Load tasks (Tugas Pokok)
    console.log('📋 Loading tasks...');
    const tasksResponse = await fetch('/api/tasks-daily');
    if (tasksResponse.ok) {
      const tasksData = await tasksResponse.json();
      console.log(`📋 Total tasks from API: ${tasksData.length}`);
      
      // Filter untuk user Wawan
      const wawanTasks = tasksData.filter(task => task.user_id === wawanUserId);
      console.log(`🎯 Wawan tasks: ${wawanTasks.length}`);
      
      wawanTasks.forEach(task => {
        activities.push({
          id: task.id,
          type: 'Tugas Pokok',
          title: task.title || 'Tugas Harian',
          date: task.date || task.created_at,
          location: 'Sekolah Binaan',
          organizer: 'Pengawas Sekolah',
          description: task.description || '',
          photo1: task.photo1,
          photo2: task.photo2,
          createdAt: task.created_at,
          source: 'supabase'
        });
      });
    } else {
      console.log('❌ Failed to load tasks:', tasksResponse.status);
    }
    
    // Load additional tasks (Tugas Tambahan)
    console.log('➕ Loading additional tasks...');
    const additionalResponse = await fetch('/api/activities');
    if (additionalResponse.ok) {
      const additionalData = await additionalResponse.json();
      console.log(`➕ Total additional tasks from API: ${additionalData.length}`);
      
      const wawanAdditional = additionalData.filter(task => task.user_id === wawanUserId);
      console.log(`🎯 Wawan additional tasks: ${wawanAdditional.length}`);
      
      wawanAdditional.forEach(task => {
        activities.push({
          id: task.id,
          type: 'Tugas Tambahan',
          title: task.name || task.title || 'Kegiatan Tambahan',
          date: task.date || task.created_at,
          location: task.location || 'Tempat Kegiatan',
          organizer: task.organizer || 'Pengawas Sekolah',
          description: task.description || '',
          photo1: task.photo1,
          photo2: task.photo2,
          createdAt: task.created_at,
          source: 'supabase'
        });
      });
    } else {
      console.log('❌ Failed to load additional tasks:', additionalResponse.status);
    }
    
    // Load supervisions (Supervisi) - INI YANG PENTING!
    console.log('🔍 Loading supervisions...');
    const supervisionsResponse = await fetch('/api/supervisions');
    if (supervisionsResponse.ok) {
      const supervisionsData = await supervisionsResponse.json();
      console.log(`🔍 Total supervisions from API: ${supervisionsData.length}`);
      
      // Filter untuk user Wawan
      const wawanSupervisions = supervisionsData.filter(supervision => supervision.user_id === wawanUserId);
      console.log(`🎯 Wawan supervisions: ${wawanSupervisions.length}`);
      
      // Load schools untuk mendapatkan nama sekolah
      const schoolsResponse = await fetch('/api/schools');
      const schoolsData = schoolsResponse.ok ? await schoolsResponse.json() : [];
      
      wawanSupervisions.forEach(supervision => {
        // Cari nama sekolah
        const school = schoolsData.find(s => s.id === supervision.school_id);
        
        activities.push({
          id: supervision.id,
          type: 'Supervisi',
          title: `Supervisi ${school?.name || 'Sekolah'}`,
          date: supervision.date || supervision.created_at,
          location: school?.name || 'Sekolah Binaan',
          organizer: 'Pengawas Sekolah',
          description: supervision.findings || supervision.recommendations || '',
          photo1: supervision.photo1,
          photo2: supervision.photo2,
          createdAt: supervision.created_at,
          source: 'supabase'
        });
      });
    } else {
      console.log('❌ Failed to load supervisions:', supervisionsResponse.status);
    }
    
    // Summary
    const totalActivities = activities.length;
    const tugasPokok = activities.filter(a => a.type === 'Tugas Pokok').length;
    const tugasTambahan = activities.filter(a => a.type === 'Tugas Tambahan').length;
    const supervisi = activities.filter(a => a.type === 'Supervisi').length;
    const withPhotos = activities.filter(a => a.photo1 || a.photo2).length;
    
    console.log('\n📊 SUMMARY AKTIVITAS WAWAN:');
    console.log('==========================');
    console.log(`📋 Tugas Pokok: ${tugasPokok}`);
    console.log(`➕ Tugas Tambahan: ${tugasTambahan}`);
    console.log(`🔍 Supervisi: ${supervisi}`);
    console.log(`📸 Dengan Foto: ${withPhotos}`);
    console.log(`📊 TOTAL: ${totalActivities}`);
    
    // Detail aktivitas
    console.log('\n📋 DETAIL AKTIVITAS:');
    activities.forEach((activity, index) => {
      console.log(`${index + 1}. [${activity.type}] ${activity.title}`);
      console.log(`   📅 ${new Date(activity.date).toLocaleDateString()}`);
      console.log(`   📍 ${activity.location}`);
      if (activity.photo1 || activity.photo2) {
        console.log(`   📸 ${[activity.photo1, activity.photo2].filter(Boolean).length} foto`);
      }
      console.log('');
    });
    
    if (totalActivities > 0) {
      console.log('✅ SUCCESS: Data Wawan berhasil dimuat dari Supabase!');
      console.log('🔄 Refreshing page untuk menampilkan data...');
      
      // Refresh page setelah 2 detik
      setTimeout(() => {
        location.reload();
      }, 2000);
    } else {
      console.log('❌ No activities found for Wawan');
      console.log('💡 Check if user_id is correct or data exists in Supabase');
    }
    
  } catch (error) {
    console.error('❌ Error loading activities:', error);
  }
}

// 3. Override fungsi loadActivitiesFromSupabase di reports page
if (typeof window !== 'undefined' && window.location.pathname.includes('reports')) {
  console.log('🎯 Detected reports page, overriding data loading...');
  
  // Wait for page to load then execute
  setTimeout(() => {
    loadAllActivitiesFromSupabase();
  }, 1000);
} else {
  console.log('📍 Current page:', window.location.pathname);
  console.log('💡 Navigate to reports page first, then run this script');
}

console.log('\n🎯 INSTRUCTIONS:');
console.log('1. Make sure you are on the reports page (/reports)');
console.log('2. This script will automatically load Wawan data from Supabase');
console.log('3. Page will refresh automatically to show the data');
console.log('4. Check console for detailed loading progress');