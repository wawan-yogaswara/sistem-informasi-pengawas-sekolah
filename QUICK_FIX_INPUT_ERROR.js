// 🚀 QUICK FIX INPUT ERROR - SIMPLE VERSION
// Script sederhana untuk mengatasi error input dan load semua data

console.log('🚀 QUICK FIX INPUT ERROR');

const WAWAN_USER_ID = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';

(async function() {
  try {
    console.log('🔧 Fixing input error and loading all data...');
    
    // 1. Fix user authentication
    const authUser = localStorage.getItem('auth_user');
    if (authUser) {
      const userData = JSON.parse(authUser);
      userData.id = WAWAN_USER_ID;
      localStorage.setItem('auth_user', JSON.stringify(userData));
    }
    
    // 2. Clear cache
    localStorage.removeItem('reports_activities_cache');
    
    // 3. Close any error dialogs
    const errorDialogs = document.querySelectorAll('[role="dialog"], .modal');
    errorDialogs.forEach(dialog => {
      const closeBtn = dialog.querySelector('button[aria-label="Close"], .close, button');
      if (closeBtn) closeBtn.click();
    });
    
    // 4. Load all data from Supabase
    const allActivities = [];
    let totalLoaded = 0;
    
    // Load tasks
    try {
      const tasksResponse = await fetch(`/api/tasks-daily?user_id=${WAWAN_USER_ID}`);
      if (tasksResponse.ok) {
        const tasks = await tasksResponse.json();
        console.log(`📋 Loaded ${tasks.length} tasks`);
        totalLoaded += tasks.length;
        tasks.forEach(task => {
          allActivities.push({
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
      }
    } catch (error) {
      console.log('Tasks error:', error.message);
    }
    
    // Load supervisions
    try {
      const supervisionsResponse = await fetch(`/api/supervisions?user_id=${WAWAN_USER_ID}`);
      if (supervisionsResponse.ok) {
        const supervisions = await supervisionsResponse.json();
        console.log(`🔍 Loaded ${supervisions.length} supervisions`);
        totalLoaded += supervisions.length;
        supervisions.forEach(supervision => {
          allActivities.push({
            id: supervision.id,
            type: 'Supervisi',
            title: `Supervisi ${supervision.school_name || 'Sekolah'}`,
            date: supervision.date || supervision.created_at,
            location: supervision.school_name || 'Sekolah Binaan',
            organizer: 'Pengawas Sekolah',
            description: supervision.findings || supervision.recommendations || '',
            photo1: supervision.photo1,
            photo2: supervision.photo2,
            createdAt: supervision.created_at,
            source: 'supabase'
          });
        });
      }
    } catch (error) {
      console.log('Supervisions error:', error.message);
    }
    
    // Load activities (additional tasks)
    try {
      const activitiesResponse = await fetch(`/api/activities?user_id=${WAWAN_USER_ID}`);
      if (activitiesResponse.ok) {
        const activities = await activitiesResponse.json();
        console.log(`➕ Loaded ${activities.length} additional tasks`);
        totalLoaded += activities.length;
        activities.forEach(activity => {
          allActivities.push({
            id: activity.id,
            type: 'Tugas Tambahan',
            title: activity.name || activity.title || 'Kegiatan Tambahan',
            date: activity.date || activity.created_at,
            location: activity.location || 'Tempat Kegiatan',
            organizer: activity.organizer || 'Pengawas Sekolah',
            description: activity.description || '',
            photo1: activity.photo1,
            photo2: activity.photo2,
            createdAt: activity.created_at,
            source: 'supabase'
          });
        });
      }
    } catch (error) {
      console.log('Activities error:', error.message);
    }
    
    // 5. Sort by date
    const sortedActivities = allActivities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    // 6. Calculate statistics
    const tugasPokok = sortedActivities.filter(a => a.type === 'Tugas Pokok').length;
    const supervisi = sortedActivities.filter(a => a.type === 'Supervisi').length;
    const tugasTambahan = sortedActivities.filter(a => a.type === 'Tugas Tambahan').length;
    const withPhotos = sortedActivities.filter(a => a.photo1 || a.photo2).length;
    
    console.log(`✅ Total loaded: ${sortedActivities.length} activities`);
    console.log(`📋 Tugas Pokok: ${tugasPokok}`);
    console.log(`🔍 Supervisi: ${supervisi}`);
    console.log(`➕ Tugas Tambahan: ${tugasTambahan}`);
    console.log(`📸 With Photos: ${withPhotos}`);
    
    // 7. Cache for React
    localStorage.setItem('reports_activities_cache', JSON.stringify(sortedActivities));
    
    // 8. Dispatch events
    window.dispatchEvent(new CustomEvent('updateReportsData', { 
      detail: { activities: sortedActivities } 
    }));
    
    // 9. Show success message
    const message = `✅ BERHASIL!\n\nTotal: ${sortedActivities.length} aktivitas dimuat\n📋 ${tugasPokok} Tugas Pokok\n🔍 ${supervisi} Supervisi\n➕ ${tugasTambahan} Tugas Tambahan\n📸 ${withPhotos} dengan foto\n\nSilakan refresh halaman atau buka halaman Laporan untuk melihat semua data.`;
    
    alert(message);
    
    console.log('🎉 Quick fix completed! Data should now be available.');
    
  } catch (error) {
    console.error('❌ Quick fix failed:', error);
    alert('Error: ' + error.message + '\n\nCoba refresh halaman dan jalankan script lagi.');
  }
})();