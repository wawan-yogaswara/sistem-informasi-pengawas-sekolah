// SIMPLE FIX: API endpoints untuk tugas harian dan supervisi di laporan
// Copy paste ke browser console di halaman Laporan

console.log('🔧 SIMPLE FIX: API endpoints untuk tugas harian dan supervisi di laporan');

const fixReportsApiEndpoints = async () => {
  const userId = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';
  
  try {
    console.log('🚀 Starting simple API endpoints fix...');
    
    // 1. Set user context
    const userData = {
      id: userId,
      username: 'wawan',
      fullName: 'Wawan Setiawan',
      role: 'admin'
    };
    localStorage.setItem('auth_user', JSON.stringify(userData));
    
    // 2. Test and fix API endpoints directly
    console.log('🌐 Testing API endpoints...');
    
    const activities = [];
    
    // Test tasks-daily API
    try {
      console.log('📋 Testing /api/tasks-daily...');
      const tasksResponse = await fetch(`/api/tasks-daily?user_id=${encodeURIComponent(userId)}`);
      
      if (tasksResponse.ok) {
        const tasksData = await tasksResponse.json();
        console.log(`✅ Tasks-daily API: ${tasksData.length} records`);
        
        tasksData.forEach((task) => {
          activities.push({
            id: task.id,
            type: 'Tugas Pokok',
            title: task.title || 'Tugas Harian',
            date: task.date || task.created_at,
            location: task.school || task.location || 'Sekolah Binaan',
            organizer: 'Pengawas Sekolah',
            description: task.description || '',
            photo1: task.photo1 || task.photo,
            photo2: task.photo2,
            createdAt: task.created_at,
            source: 'api_tasks_daily'
          });
        });
      } else {
        console.error('❌ Tasks-daily API failed:', tasksResponse.status);
        const errorText = await tasksResponse.text();
        console.error('Error details:', errorText);
      }
    } catch (error) {
      console.error('❌ Tasks-daily API error:', error);
    }
    
    // Test supervisions API
    try {
      console.log('🔍 Testing /api/supervisions...');
      const supervisionsResponse = await fetch(`/api/supervisions?user_id=${encodeURIComponent(userId)}`);
      
      if (supervisionsResponse.ok) {
        const supervisionsData = await supervisionsResponse.json();
        console.log(`✅ Supervisions API: ${supervisionsData.length} records`);
        
        supervisionsData.forEach((supervision) => {
          activities.push({
            id: supervision.id,
            type: 'Supervisi',
            title: `Supervisi ${supervision.school_name || supervision.school || 'Sekolah'}`,
            date: supervision.date || supervision.created_at,
            location: supervision.school_name || supervision.school || 'Sekolah Binaan',
            organizer: 'Pengawas Sekolah',
            description: supervision.findings || supervision.recommendations || '',
            photo1: supervision.photo1,
            photo2: supervision.photo2,
            createdAt: supervision.created_at,
            source: 'api_supervisions'
          });
        });
      } else {
        console.error('❌ Supervisions API failed:', supervisionsResponse.status);
        const errorText = await supervisionsResponse.text();
        console.error('Error details:', errorText);
      }
    } catch (error) {
      console.error('❌ Supervisions API error:', error);
    }
    
    // Test additional tasks API
    try {
      console.log('➕ Testing /api/activities...');
      const activitiesResponse = await fetch(`/api/activities?user_id=${encodeURIComponent(userId)}`);
      
      if (activitiesResponse.ok) {
        const activitiesData = await activitiesResponse.json();
        console.log(`✅ Activities API: ${activitiesData.length} records`);
        
        activitiesData.forEach((task) => {
          activities.push({
            id: task.id,
            type: 'Tugas Tambahan',
            title: task.name || task.title || 'Kegiatan Tambahan',
            date: task.date || task.created_at,
            location: task.location || 'Tempat Kegiatan',
            organizer: task.organizer || 'Pengawas Sekolah',
            description: task.description || '',
            photo1: task.photo || task.photo1,
            photo2: task.photo2,
            createdAt: task.created_at,
            source: 'api_activities'
          });
        });
      } else {
        console.error('❌ Activities API failed:', activitiesResponse.status);
        const errorText = await activitiesResponse.text();
        console.error('Error details:', errorText);
      }
    } catch (error) {
      console.error('❌ Activities API error:', error);
    }
    
    // Sort activities by date
    const sortedActivities = activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    console.log(`📊 Total activities from APIs: ${sortedActivities.length}`);
    console.log('📋 Breakdown:');
    console.log(`  - Tugas Pokok: ${sortedActivities.filter(a => a.type === 'Tugas Pokok').length}`);
    console.log(`  - Supervisi: ${sortedActivities.filter(a => a.type === 'Supervisi').length}`);
    console.log(`  - Tugas Tambahan: ${sortedActivities.filter(a => a.type === 'Tugas Tambahan').length}`);
    
    if (sortedActivities.length > 0) {
      // 3. Cache the data for reports page
      console.log('💾 Caching data for reports page...');
      localStorage.setItem('reports_activities_cache', JSON.stringify(sortedActivities));
      
      // 4. Dispatch update events
      console.log('📡 Dispatching update events...');
      const updateEvent = new CustomEvent('updateReportsData', {
        detail: {
          activities: sortedActivities,
          source: 'api_fix',
          timestamp: Date.now()
        }
      });
      window.dispatchEvent(updateEvent);
      
      // 5. Show preview
      console.log('📋 Activities preview:');
      sortedActivities.slice(0, 5).forEach((activity, index) => {
        console.log(`  ${index + 1}. ${activity.type}: ${activity.title} (${activity.date}) [${activity.source}]`);
      });
      
      console.log(`
🎉 API FIX COMPLETED! 🎉

✅ ${sortedActivities.length} activities loaded from APIs
✅ Data cached for reports page
✅ Update events dispatched

Refreshing page in 2 seconds...
      `);
      
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } else {
      console.log(`
⚠️ NO DATA FOUND FROM APIs

This could mean:
1. No data exists in the database for user ${userId}
2. API endpoints are not working correctly
3. Database connection issues

Try running the enhanced fix script instead.
      `);
    }
    
  } catch (error) {
    console.error('❌ Simple API fix failed:', error);
    console.log('🔄 Refreshing page...');
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }
};

// Execute the simple API fix
console.log('🚀 Executing simple API endpoints fix...');
fixReportsApiEndpoints();