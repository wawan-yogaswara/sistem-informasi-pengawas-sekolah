// DEBUG APEL PAGI LANGSUNG - Copy paste ke browser console di halaman laporan
const debugApelPagiLangsung = async () => {
  console.log('🔍 DEBUG APEL PAGI LANGSUNG...');
  
  try {
    // 1. Cek user yang sedang login
    const authUser = localStorage.getItem('auth_user');
    const currentUser = localStorage.getItem('currentUser');
    
    console.log('👤 Auth user:', authUser);
    console.log('👤 Current user:', currentUser);
    
    let userId = 'default_user';
    if (authUser) {
      const user = JSON.parse(authUser);
      userId = user.id || user.username || 'default_user';
    } else if (currentUser) {
      const user = JSON.parse(currentUser);
      userId = user.id || user.username || 'default_user';
    }
    
    console.log('🆔 Final User ID:', userId);
    
    // 2. Test API endpoint langsung
    console.log('\n🌐 Testing API endpoints...');
    
    // Test dengan user_id
    console.log('📡 Testing /api/tasks with user_id...');
    const response1 = await fetch(`/api/tasks?user_id=${userId}`);
    console.log('Response status:', response1.status);
    
    if (response1.ok) {
      const data1 = await response1.json();
      console.log('📊 Data with user_id:', data1.length, 'items');
      const apelTasks1 = data1.filter(task => 
        (task.title && task.title.toLowerCase().includes('apel')) ||
        (task.name && task.name.toLowerCase().includes('apel'))
      );
      console.log('🌅 Apel tasks with user_id:', apelTasks1.length);
      apelTasks1.forEach(task => console.log(`  - ${task.title || task.name} (${task.user_id})`));
    } else {
      console.log('❌ Error with user_id:', await response1.text());
    }
    
    // Test tanpa user_id
    console.log('\n📡 Testing /api/tasks without user_id...');
    const response2 = await fetch('/api/tasks');
    console.log('Response status:', response2.status);
    
    if (response2.ok) {
      const data2 = await response2.json();
      console.log('📊 Data without user_id:', data2.length, 'items');
      const apelTasks2 = data2.filter(task => 
        (task.title && task.title.toLowerCase().includes('apel')) ||
        (task.name && task.name.toLowerCase().includes('apel'))
      );
      console.log('🌅 Apel tasks without user_id:', apelTasks2.length);
      apelTasks2.forEach(task => console.log(`  - ${task.title || task.name} (user: ${task.user_id})`));
      
      // Show all user_ids in data
      const userIds = [...new Set(data2.map(task => task.user_id))];
      console.log('👥 All user_ids in data:', userIds);
    } else {
      console.log('❌ Error without user_id:', await response2.text());
    }
    
    // 3. Test React Query cache
    console.log('\n🗄️ Checking React Query cache...');
    if (window.queryClient) {
      const cache = window.queryClient.getQueryCache();
      console.log('Cache queries:', cache.getAll().map(q => q.queryKey));
    } else {
      console.log('No queryClient found');
    }
    
    // 4. Simulate reports page query
    console.log('\n📄 Simulating reports page query...');
    const baseUrl = window.location.origin;
    
    try {
      // Simulate the exact query from reports page
      let additionalTasksResponse = await fetch(`${baseUrl}/api/tasks?user_id=${userId}`);
      let additionalTasks = [];
      
      if (additionalTasksResponse.ok) {
        additionalTasks = await additionalTasksResponse.json();
        console.log('✅ First query successful:', additionalTasks.length, 'tasks');
      } else {
        console.log('❌ First query failed:', additionalTasksResponse.status);
      }
      
      // Fallback query
      if (additionalTasks.length === 0) {
        console.log('🔄 Trying fallback query...');
        additionalTasksResponse = await fetch(`${baseUrl}/api/tasks`);
        if (additionalTasksResponse.ok) {
          additionalTasks = await additionalTasksResponse.json();
          console.log('✅ Fallback query successful:', additionalTasks.length, 'tasks');
        } else {
          console.log('❌ Fallback query failed:', additionalTasksResponse.status);
        }
      }
      
      // Process like reports page
      const activities = [];
      additionalTasks.forEach((task) => {
        activities.push({
          id: task.id,
          type: 'Tugas Tambahan',
          title: task.title || task.name,
          date: task.date,
          location: task.location,
          organizer: task.organizer || 'Pengawas Sekolah',
          description: task.description,
          photo1: task.photo1 || task.photo,
          photo2: task.photo2,
          createdAt: task.created_at
        });
      });
      
      const apelActivities = activities.filter(activity => 
        activity.title && activity.title.toLowerCase().includes('apel')
      );
      
      console.log('📋 Final processed activities:', activities.length);
      console.log('🌅 Final apel activities:', apelActivities.length);
      apelActivities.forEach(activity => {
        console.log(`  ✅ ${activity.title} - ${activity.date}`);
      });
      
    } catch (error) {
      console.error('❌ Simulation error:', error);
    }
    
    console.log('\n💡 DIAGNOSIS COMPLETE');
    
  } catch (error) {
    console.error('❌ Debug error:', error);
  }
};

// Jalankan debug
debugApelPagiLangsung();