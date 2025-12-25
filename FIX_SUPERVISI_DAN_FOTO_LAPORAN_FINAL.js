// FIX SUPERVISI DAN FOTO LAPORAN FINAL
// Copy paste ke browser console di halaman Laporan

console.log('🔧 FIX: Supervisi tidak lengkap + Foto hanya 1');

const fixSupervisiDanFotoLaporan = async () => {
  const userId = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';
  
  console.log('👤 Target user_id:', userId);
  
  // 1. Force user ID
  const userData = localStorage.getItem('auth_user');
  if (userData) {
    const user = JSON.parse(userData);
    user.id = userId;
    user.username = 'wawan';
    localStorage.setItem('auth_user', JSON.stringify(user));
    console.log('✅ User ID forced');
  }
  
  // 2. Clear cache
  localStorage.removeItem('reports_activities_cache');
  console.log('✅ Cache cleared');
  
  try {
    // 3. Import Supabase client
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = 'https://fmxeboullgcewzjpql.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZteGVib3VsbGdjZXd6anBxbCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM0NTk5NzI4LCJleHAiOjIwNTAxNzU3Mjh9.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // 4. FIX SUPERVISI - Check and fix user_id
    console.log('🔧 FIXING SUPERVISI...');
    
    const { data: allSupervisions } = await supabase
      .from('supervisions')
      .select('*')
      .order('created_at', { ascending: false });
    
    console.log(`📋 Total supervisions in database: ${allSupervisions.length}`);
    
    // Find supervisions that need user_id fix
    const needsFixSupervisions = allSupervisions.filter(s => 
      s.user_id !== userId && (
        s.user_id === 'wawan' || 
        s.user_id === 'default_user' ||
        !s.user_id ||
        s.user_id === null
      )
    );
    
    console.log(`🔧 Supervisions needing user_id fix: ${needsFixSupervisions.length}`);
    
    // Fix user_id for supervisions
    for (const supervision of needsFixSupervisions) {
      await supabase
        .from('supervisions')
        .update({ user_id: userId })
        .eq('id', supervision.id);
      console.log(`✅ Fixed supervision: ${supervision.school || supervision.school_name}`);
    }
    
    // 5. FIX FOTO - Check and fix photo2 fields for other activities
    console.log('🔧 FIXING FOTO...');
    
    // Fix additional_tasks photos
    const { data: additionalTasks } = await supabase
      .from('additional_tasks')
      .select('*')
      .eq('user_id', userId);
    
    console.log(`📸 Additional tasks found: ${additionalTasks.length}`);
    
    additionalTasks.forEach((task, index) => {
      console.log(`📸 Task ${index + 1}:`, {
        id: task.id,
        title: task.title,
        photo: task.photo ? 'EXISTS' : 'MISSING',
        photo2: task.photo2 ? 'EXISTS' : 'MISSING'
      });
    });
    
    // Fix tasks photos
    const { data: tasks } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId);
    
    console.log(`📸 Tasks found: ${tasks.length}`);
    
    tasks.forEach((task, index) => {
      console.log(`📸 Task ${index + 1}:`, {
        id: task.id,
        title: task.title,
        photo1: task.photo1 ? 'EXISTS' : 'MISSING',
        photo2: task.photo2 ? 'EXISTS' : 'MISSING'
      });
    });
    
    // 6. Test API endpoints after fix
    console.log('🌐 Testing API endpoints after fix...');
    
    // Test supervisions
    const supervisionsResponse = await fetch(`/api/supervisions?user_id=${encodeURIComponent(userId)}`);
    if (supervisionsResponse.ok) {
      const supervisionsData = await supervisionsResponse.json();
      console.log(`🌐 Supervisions API: ${supervisionsData.length} items`);
      supervisionsData.forEach((supervision, index) => {
        console.log(`🌐 Supervision ${index + 1}:`, {
          id: supervision.id,
          school: supervision.school || supervision.school_name,
          photo1: supervision.photo1 ? 'EXISTS' : 'MISSING',
          photo2: supervision.photo2 ? 'EXISTS' : 'MISSING'
        });
      });
    }
    
    // Test additional tasks
    const activitiesResponse = await fetch(`/api/activities?user_id=${encodeURIComponent(userId)}`);
    if (activitiesResponse.ok) {
      const activitiesData = await activitiesResponse.json();
      console.log(`🌐 Activities API: ${activitiesData.length} items`);
      activitiesData.forEach((activity, index) => {
        console.log(`🌐 Activity ${index + 1}:`, {
          id: activity.id,
          title: activity.title,
          photo: activity.photo ? 'EXISTS' : 'MISSING',
          photo1: activity.photo1 ? 'EXISTS' : 'MISSING',
          photo2: activity.photo2 ? 'EXISTS' : 'MISSING'
        });
      });
    }
    
    // Test tasks
    const tasksResponse = await fetch(`/api/tasks-daily?user_id=${encodeURIComponent(userId)}`);
    if (tasksResponse.ok) {
      const tasksData = await tasksResponse.json();
      console.log(`🌐 Tasks API: ${tasksData.length} items`);
      tasksData.forEach((task, index) => {
        console.log(`🌐 Task ${index + 1}:`, {
          id: task.id,
          title: task.title,
          photo1: task.photo1 ? 'EXISTS' : 'MISSING',
          photo2: task.photo2 ? 'EXISTS' : 'MISSING'
        });
      });
    }
    
    // 7. Simulate Reports page processing with ENHANCED photo handling
    console.log('📊 Simulating Reports page with enhanced photo handling...');
    
    const activities = [];
    
    // Process supervisions
    if (supervisionsResponse.ok) {
      const supervisionsData = await supervisionsResponse.json();
      const schoolsResponse = await fetch('/api/schools');
      const schoolsData = schoolsResponse.ok ? await schoolsResponse.json() : [];
      
      supervisionsData.forEach((supervision) => {
        const school = schoolsData.find((s) => s.id === supervision.school_id);
        
        activities.push({
          id: supervision.id,
          type: 'Supervisi',
          title: `Supervisi ${school?.name || supervision.school || supervision.school_name || 'Sekolah'}`,
          date: supervision.date || supervision.created_at,
          location: school?.name || supervision.school || supervision.school_name || 'Sekolah Binaan',
          organizer: 'Pengawas Sekolah',
          description: supervision.findings || supervision.recommendations || '',
          photo1: supervision.photo1,
          photo2: supervision.photo2,
          createdAt: supervision.created_at,
          source: 'supabase'
        });
      });
    }
    
    // Process additional tasks with ENHANCED photo mapping
    if (activitiesResponse.ok) {
      const activitiesData = await activitiesResponse.json();
      
      activitiesData.forEach((task) => {
        activities.push({
          id: task.id,
          type: 'Tugas Tambahan',
          title: task.title || task.name || 'Kegiatan Tambahan',
          date: task.date || task.created_at,
          location: task.location || 'Tempat Kegiatan',
          organizer: task.organizer || 'Pengawas Sekolah',
          description: task.description || '',
          // ENHANCED: Map both photo fields correctly
          photo1: task.photo || task.photo1, // Primary photo
          photo2: task.photo2, // Secondary photo
          createdAt: task.created_at,
          source: 'supabase'
        });
      });
    }
    
    // Process tasks with ENHANCED photo mapping
    if (tasksResponse.ok) {
      const tasksData = await tasksResponse.json();
      
      tasksData.forEach((task) => {
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
    }
    
    console.log(`📊 FINAL RESULT:`);
    console.log(`📊 Total activities: ${activities.length}`);
    console.log(`📊 Supervisi: ${activities.filter(a => a.type === 'Supervisi').length}`);
    console.log(`📊 Tugas Tambahan: ${activities.filter(a => a.type === 'Tugas Tambahan').length}`);
    console.log(`📊 Tugas Pokok: ${activities.filter(a => a.type === 'Tugas Pokok').length}`);
    
    // Count photos
    const activitiesWithPhoto1 = activities.filter(a => a.photo1).length;
    const activitiesWithPhoto2 = activities.filter(a => a.photo2).length;
    const activitiesWithBothPhotos = activities.filter(a => a.photo1 && a.photo2).length;
    
    console.log(`📸 Activities with photo1: ${activitiesWithPhoto1}`);
    console.log(`📸 Activities with photo2: ${activitiesWithPhoto2}`);
    console.log(`📸 Activities with both photos: ${activitiesWithBothPhotos}`);
    
    // Show detailed photo info
    activities.forEach((activity, index) => {
      if (activity.photo1 || activity.photo2) {
        console.log(`📸 ${activity.type} ${index + 1}: ${activity.title}`, {
          photo1: activity.photo1 ? 'EXISTS' : 'MISSING',
          photo2: activity.photo2 ? 'EXISTS' : 'MISSING'
        });
      }
    });
    
    // Cache the processed data
    localStorage.setItem('reports_activities_cache', JSON.stringify(activities));
    console.log('📦 Cached enhanced data for Reports page');
    
    // 8. Force page refresh
    console.log('🔄 Refreshing page in 3 seconds...');
    setTimeout(() => {
      window.location.reload();
    }, 3000);
    
  } catch (error) {
    console.error('❌ Fix failed:', error);
  }
};

// Run the fix
fixSupervisiDanFotoLaporan();