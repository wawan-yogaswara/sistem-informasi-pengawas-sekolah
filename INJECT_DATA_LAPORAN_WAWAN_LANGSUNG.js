// 🚀 INJECT DATA LAPORAN WAWAN LANGSUNG
// Copy paste script ini ke console browser di halaman laporan

console.log('🚀 INJECTING WAWAN DATA TO REPORTS PAGE...');
console.log('==========================================');

// 1. Fix user ID di localStorage
const currentUser = localStorage.getItem('auth_user');
if (currentUser) {
  const userData = JSON.parse(currentUser);
  console.log('👤 Current user:', userData.username);
  
  if (userData.username === 'wawan') {
    // Update dengan user_id yang benar dari Supabase
    const correctUserId = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';
    userData.id = correctUserId;
    localStorage.setItem('auth_user', JSON.stringify(userData));
    console.log('✅ Updated Wawan user_id to:', correctUserId);
  }
}

// 2. Force reload data dengan user_id yang benar
async function loadWawanActivitiesDirectly() {
  console.log('📊 Loading Wawan activities directly from Supabase...');
  
  const wawanUserId = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';
  const activities = [];
  
  try {
    // Load tasks
    const tasksResponse = await fetch('/api/tasks-daily');
    if (tasksResponse.ok) {
      const tasksData = await tasksResponse.json();
      const wawanTasks = tasksData.filter(task => task.user_id === wawanUserId);
      console.log(`📋 Found ${wawanTasks.length} tasks for Wawan`);
      
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
          source: 'supabase-direct'
        });
      });
    }
    
    // Load additional tasks
    const additionalResponse = await fetch('/api/activities');
    if (additionalResponse.ok) {
      const additionalData = await additionalResponse.json();
      const wawanAdditional = additionalData.filter(task => task.user_id === wawanUserId);
      console.log(`➕ Found ${wawanAdditional.length} additional tasks for Wawan`);
      
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
          source: 'supabase-direct'
        });
      });
    }
    
    // Load supervisions
    const supervisionsResponse = await fetch('/api/supervisions');
    if (supervisionsResponse.ok) {
      const supervisionsData = await supervisionsResponse.json();
      const wawanSupervisions = supervisionsData.filter(supervision => supervision.user_id === wawanUserId);
      console.log(`🔍 Found ${wawanSupervisions.length} supervisions for Wawan`);
      
      wawanSupervisions.forEach(supervision => {
        activities.push({
          id: supervision.id,
          type: 'Supervisi',
          title: `Supervisi Sekolah`,
          date: supervision.date || supervision.created_at,
          location: 'Sekolah Binaan',
          organizer: 'Pengawas Sekolah',
          description: supervision.findings || supervision.recommendations || '',
          photo1: supervision.photo1,
          photo2: supervision.photo2,
          source: 'supabase-direct'
        });
      });
    }
    
    console.log(`📊 Total activities loaded: ${activities.length}`);
    
    // Display summary
    const tugasPokok = activities.filter(a => a.type === 'Tugas Pokok').length;
    const tugasTambahan = activities.filter(a => a.type === 'Tugas Tambahan').length;
    const supervisi = activities.filter(a => a.type === 'Supervisi').length;
    const withPhotos = activities.filter(a => a.photo1 || a.photo2).length;
    
    console.log('📈 SUMMARY AKTIVITAS WAWAN:');
    console.log(`   - Tugas Pokok: ${tugasPokok}`);
    console.log(`   - Tugas Tambahan: ${tugasTambahan}`);
    console.log(`   - Supervisi: ${supervisi}`);
    console.log(`   - Dengan Foto: ${withPhotos}`);
    
    // Show activities details
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
    
    if (activities.length > 0) {
      console.log('✅ SUCCESS: Data Wawan ditemukan!');
      console.log('🔄 Refreshing page to show data...');
      
      // Refresh page to show data
      setTimeout(() => {
        location.reload();
      }, 2000);
    } else {
      console.log('❌ No activities found for Wawan');
      console.log('💡 Try running migration script or check user_id');
    }
    
  } catch (error) {
    console.error('❌ Error loading activities:', error);
  }
}

// 3. Execute the function
loadWawanActivitiesDirectly();

// 4. Also inject some CSS to highlight Wawan data
const style = document.createElement('style');
style.textContent = `
  .wawan-highlight {
    border: 2px solid #28a745 !important;
    background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%) !important;
  }
  
  .wawan-badge {
    background: #28a745 !important;
    color: white !important;
    font-weight: bold !important;
  }
`;
document.head.appendChild(style);

console.log('🎨 Added CSS highlighting for Wawan data');
console.log('✅ Script completed! Check the reports page in 2 seconds...');