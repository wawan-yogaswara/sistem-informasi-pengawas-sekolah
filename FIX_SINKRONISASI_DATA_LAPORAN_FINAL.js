// FIX: Sinkronisasi data laporan dengan input halaman lain
// Problem: Reports page data doesn't match input from tasks, supervisions, additional tasks pages

console.log('🔧 FIXING DATA SYNCHRONIZATION ISSUES');
console.log('=====================================');

// COMPREHENSIVE FIX SCRIPT
const fixDataSynchronization = async () => {
  try {
    console.log('1. 🧹 Clearing cache...');
    
    // Clear all relevant cache
    localStorage.removeItem('reports_activities_cache');
    localStorage.removeItem('tasks_cache');
    localStorage.removeItem('supervisions_cache');
    localStorage.removeItem('activities_cache');
    
    console.log('✅ Cache cleared');
    
    console.log('2. 🔍 Testing API endpoints...');
    
    // Get current user
    const userData = localStorage.getItem('auth_user');
    if (!userData) {
      console.error('❌ No user data found');
      return;
    }
    
    const currentUser = JSON.parse(userData);
    let userId = currentUser.id;
    
    // For wawan user, use the correct ID
    if (currentUser.username === 'wawan') {
      userId = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';
    }
    
    console.log('👤 Using user_id:', userId);
    
    // Test all API endpoints
    const endpoints = [
      { name: 'Tasks', url: `/api/tasks-daily?user_id=${encodeURIComponent(userId)}` },
      { name: 'Supervisions', url: `/api/supervisions?user_id=${encodeURIComponent(userId)}` },
      { name: 'Additional Tasks', url: `/api/activities?user_id=${encodeURIComponent(userId)}` }
    ];
    
    const results = {};
    
    for (const endpoint of endpoints) {
      try {
        console.log(`📡 Testing ${endpoint.name} API...`);
        const response = await fetch(endpoint.url);
        
        if (response.ok) {
          const data = await response.json();
          results[endpoint.name] = data;
          console.log(`✅ ${endpoint.name}: ${data.length} records found`);
          
          // Log sample data structure
          if (data.length > 0) {
            console.log(`📋 ${endpoint.name} sample fields:`, Object.keys(data[0]));
          }
        } else {
          console.error(`❌ ${endpoint.name} API error:`, response.status, response.statusText);
          results[endpoint.name] = [];
        }
      } catch (error) {
        console.error(`❌ ${endpoint.name} API failed:`, error.message);
        results[endpoint.name] = [];
      }
    }
    
    console.log('3. 📊 Data summary:');
    console.log('   - Tasks:', results.Tasks?.length || 0);
    console.log('   - Supervisions:', results.Supervisions?.length || 0);
    console.log('   - Additional Tasks:', results['Additional Tasks']?.length || 0);
    
    console.log('4. 🔄 Triggering reports page refresh...');
    
    // Combine all data for reports page
    const allActivities = [];
    
    // Process tasks
    if (results.Tasks && results.Tasks.length > 0) {
      results.Tasks.forEach(task => {
        allActivities.push({
          id: task.id,
          type: 'Tugas Pokok',
          title: task.title || 'Tugas Harian',
          date: task.date || task.created_at,
          location: task.location || task.school || 'Sekolah Binaan',
          organizer: 'Pengawas Sekolah',
          description: task.description || '',
          photo1: task.photo,     // FIXED: Use correct field mapping
          photo2: task.photo2,
          createdAt: task.created_at,
          source: 'api-tasks'
        });
      });
    }
    
    // Process supervisions
    if (results.Supervisions && results.Supervisions.length > 0) {
      results.Supervisions.forEach(supervision => {
        allActivities.push({
          id: supervision.id,
          type: 'Supervisi',
          title: `Supervisi ${supervision.school_name || 'Sekolah'}`,
          date: supervision.date || supervision.created_at,
          location: supervision.school_name || 'Sekolah Binaan',
          organizer: 'Pengawas Sekolah',
          description: supervision.findings || supervision.recommendations || '',
          photo1: supervision.photo,     // FIXED: Use correct field mapping
          photo2: supervision.photo2,
          createdAt: supervision.created_at,
          source: 'api-supervisions'
        });
      });
    }
    
    // Process additional tasks
    if (results['Additional Tasks'] && results['Additional Tasks'].length > 0) {
      results['Additional Tasks'].forEach(task => {
        allActivities.push({
          id: task.id,
          type: 'Tugas Tambahan',
          title: task.title || task.name || 'Kegiatan Tambahan',
          date: task.date || task.created_at,
          location: task.location || 'Tempat Kegiatan',
          organizer: task.organizer || 'Pengawas Sekolah',
          description: task.description || '',
          photo1: task.photo,     // FIXED: Use correct field mapping
          photo2: task.photo2,
          createdAt: task.created_at,
          source: 'api-activities'
        });
      });
    }
    
    // Sort by date (newest first)
    allActivities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    console.log(`📋 Total activities combined: ${allActivities.length}`);
    
    // Cache the combined data
    localStorage.setItem('reports_activities_cache', JSON.stringify(allActivities));
    
    // Trigger reports page update
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('updateReportsData', {
        detail: { activities: allActivities }
      }));
    }
    
    console.log('✅ Data synchronization completed!');
    console.log('📄 Reports page should now show updated data');
    
    return allActivities;
    
  } catch (error) {
    console.error('❌ Data synchronization failed:', error);
    throw error;
  }
};

// AUTO-RUN THE FIX
console.log('🚀 Starting data synchronization fix...');
fixDataSynchronization()
  .then(activities => {
    console.log('🎉 SUCCESS! Data synchronization completed');
    console.log(`📊 Total activities: ${activities.length}`);
    console.log('💡 Go to Reports page to see updated data');
  })
  .catch(error => {
    console.error('💥 FAILED! Data synchronization error:', error);
    console.log('🔧 Try running the fix manually or check API endpoints');
  });

// EXPORT FOR MANUAL USE
if (typeof window !== 'undefined') {
  window.fixDataSynchronization = fixDataSynchronization;
  console.log('💻 Manual fix available: window.fixDataSynchronization()');
}