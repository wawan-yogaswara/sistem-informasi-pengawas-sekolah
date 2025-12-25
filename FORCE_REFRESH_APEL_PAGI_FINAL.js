// FORCE REFRESH APEL PAGI FINAL - Copy paste ke console di halaman laporan
const forceRefreshApelPagiFinal = async () => {
  console.log('🔄 FORCE REFRESH APEL PAGI FINAL...');
  
  try {
    // 1. Clear semua cache
    console.log('🧹 Clearing all caches...');
    
    if (window.queryClient) {
      window.queryClient.clear();
      window.queryClient.invalidateQueries();
    }
    
    // Clear localStorage cache
    const cacheKeys = [
      'activities_cache',
      'additional_tasks_cache',
      'reports_cache',
      'all-activities'
    ];
    
    cacheKeys.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        console.log(`🗑️ Cleared: ${key}`);
      }
    });
    
    // 2. Test API langsung untuk memastikan data ada
    console.log('🧪 Testing API...');
    const response = await fetch('/api/tasks');
    const data = await response.json();
    
    console.log(`📊 Total tasks from API: ${data.length}`);
    
    // Cari data apel dengan berbagai kemungkinan field
    const apelTasks = data.filter(task => {
      const searchFields = [
        task.title,
        task.name, 
        task.description
      ].filter(Boolean).map(field => field.toLowerCase());
      
      return searchFields.some(field => field.includes('apel'));
    });
    
    console.log(`🌅 Apel tasks found: ${apelTasks.length}`);
    
    if (apelTasks.length > 0) {
      console.log('✅ Data Apel ditemukan:');
      apelTasks.forEach((task, i) => {
        console.log(`${i+1}. Title: ${task.title || 'N/A'}`);
        console.log(`   Name: ${task.name || 'N/A'}`);
        console.log(`   Description: ${task.description || 'N/A'}`);
        console.log(`   Date: ${task.date}`);
        console.log(`   User ID: ${task.user_id}`);
        console.log('---');
      });
      
      // 3. Simulate reports page processing
      console.log('📄 Simulating reports page processing...');
      const activities = [];
      
      data.forEach((task) => {
        activities.push({
          id: task.id,
          type: 'Tugas Tambahan',
          title: task.title || task.name || task.description || 'Kegiatan Tambahan',
          date: task.date,
          location: task.location || 'Tidak Diketahui',
          organizer: task.organizer || 'Pengawas Sekolah',
          description: task.description || task.title || task.name,
          photo1: task.photo1 || task.photo,
          photo2: task.photo2,
          createdAt: task.created_at
        });
      });
      
      const processedApelTasks = activities.filter(activity => 
        activity.title && activity.title.toLowerCase().includes('apel')
      );
      
      console.log(`📋 Processed apel activities: ${processedApelTasks.length}`);
      processedApelTasks.forEach(activity => {
        console.log(`✅ ${activity.title} - ${activity.date}`);
      });
      
      if (processedApelTasks.length > 0) {
        console.log('🎉 Data Apel siap ditampilkan di laporan!');
      }
      
    } else {
      console.log('❌ Tidak ada data Apel ditemukan');
    }
    
    // 4. Force refresh halaman
    console.log('🔄 Refreshing page in 2 seconds...');
    setTimeout(() => {
      window.location.reload();
    }, 2000);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
};

// JALANKAN
forceRefreshApelPagiFinal();