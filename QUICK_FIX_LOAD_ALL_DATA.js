// 🚀 QUICK FIX - LOAD ALL DATA FROM SUPABASE
// Script sederhana untuk memuat semua data Supabase ke halaman laporan

console.log('🚀 QUICK FIX - LOAD ALL DATA FROM SUPABASE');

const WAWAN_USER_ID = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';

(async function() {
  try {
    console.log('🔧 Starting quick fix...');
    
    // Fix user ID
    const authUser = localStorage.getItem('auth_user');
    if (authUser) {
      const userData = JSON.parse(authUser);
      userData.id = WAWAN_USER_ID;
      localStorage.setItem('auth_user', JSON.stringify(userData));
    }
    
    // Clear cache
    localStorage.removeItem('reports_activities_cache');
    
    // Load all data
    const allActivities = [];
    
    // Load tasks
    const tasksResponse = await fetch(`/api/tasks-daily?user_id=${WAWAN_USER_ID}`);
    if (tasksResponse.ok) {
      const tasks = await tasksResponse.json();
      console.log(`📋 Loaded ${tasks.length} tasks`);
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
    
    // Load supervisions
    const supervisionsResponse = await fetch(`/api/supervisions?user_id=${WAWAN_USER_ID}`);
    if (supervisionsResponse.ok) {
      const supervisions = await supervisionsResponse.json();
      console.log(`🔍 Loaded ${supervisions.length} supervisions`);
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
    
    // Load activities
    const activitiesResponse = await fetch(`/api/activities?user_id=${WAWAN_USER_ID}`);
    if (activitiesResponse.ok) {
      const activities = await activitiesResponse.json();
      console.log(`➕ Loaded ${activities.length} additional tasks`);
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
    
    // Sort by date
    const sortedActivities = allActivities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    console.log(`✅ Total loaded: ${sortedActivities.length} activities`);
    console.log(`📋 Tugas Pokok: ${sortedActivities.filter(a => a.type === 'Tugas Pokok').length}`);
    console.log(`🔍 Supervisi: ${sortedActivities.filter(a => a.type === 'Supervisi').length}`);
    console.log(`➕ Tugas Tambahan: ${sortedActivities.filter(a => a.type === 'Tugas Tambahan').length}`);
    
    // Cache for React
    localStorage.setItem('reports_activities_cache', JSON.stringify(sortedActivities));
    
    // Dispatch events
    window.dispatchEvent(new CustomEvent('updateReportsData', { 
      detail: { activities: sortedActivities } 
    }));
    
    // Show success message
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
      position: fixed; top: 20px; right: 20px; z-index: 9999;
      background: linear-gradient(135deg, #10b981, #059669);
      color: white; padding: 1.5rem; border-radius: 12px;
      box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
      max-width: 350px; font-family: system-ui, -apple-system, sans-serif;
    `;
    
    successDiv.innerHTML = `
      <div style="font-weight: bold; font-size: 1.1rem; margin-bottom: 1rem; text-align: center;">
        ✅ Semua Data Berhasil Dimuat!
      </div>
      <div style="font-size: 0.9rem; line-height: 1.4; margin-bottom: 1rem;">
        📊 Total: ${sortedActivities.length} aktivitas<br>
        📋 ${sortedActivities.filter(a => a.type === 'Tugas Pokok').length} Tugas Pokok<br>
        🔍 ${sortedActivities.filter(a => a.type === 'Supervisi').length} Supervisi<br>
        ➕ ${sortedActivities.filter(a => a.type === 'Tugas Tambahan').length} Tugas Tambahan<br>
        📸 ${sortedActivities.filter(a => a.photo1 || a.photo2).length} dengan foto
      </div>
      <div style="text-align: center;">
        <button onclick="location.reload()" style="background: white; color: #10b981; padding: 0.5rem 1rem; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; margin-right: 0.5rem;">
          🔄 Refresh Sekarang
        </button>
        <button onclick="this.parentElement.parentElement.remove()" style="background: rgba(255,255,255,0.2); color: white; padding: 0.5rem 1rem; border: 1px solid rgba(255,255,255,0.3); border-radius: 6px; cursor: pointer;">
          ✕
        </button>
      </div>
    `;
    
    document.body.appendChild(successDiv);
    
    // Auto remove after 15 seconds
    setTimeout(() => {
      if (successDiv.parentElement) {
        successDiv.remove();
      }
    }, 15000);
    
    console.log('🎉 Quick fix completed! Refresh halaman untuk melihat semua data.');
    
  } catch (error) {
    console.error('❌ Quick fix failed:', error);
    alert('Error: ' + error.message);
  }
})();