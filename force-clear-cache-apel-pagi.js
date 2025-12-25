// FORCE CLEAR CACHE APEL PAGI - Jalankan di halaman laporan
const forceClearCacheApelPagi = () => {
  console.log('🧹 FORCE CLEAR CACHE untuk Apel Pagi...');
  
  try {
    // 1. Clear React Query cache
    if (window.queryClient) {
      console.log('🗑️ Clearing React Query cache...');
      window.queryClient.clear();
      window.queryClient.invalidateQueries();
      window.queryClient.refetchQueries();
    }
    
    // 2. Clear localStorage cache
    const cacheKeys = [
      'activities_cache',
      'additional_tasks_cache', 
      'reports_cache',
      'all-activities',
      'tasks_data',
      'additional_tasks_data'
    ];
    
    cacheKeys.forEach(key => {
      if (localStorage.getItem(key)) {
        console.log(`🗑️ Clearing localStorage: ${key}`);
        localStorage.removeItem(key);
      }
    });
    
    // 3. Clear session storage
    if (sessionStorage.length > 0) {
      console.log('🗑️ Clearing sessionStorage...');
      sessionStorage.clear();
    }
    
    // 4. Force reload dengan cache bypass
    console.log('🔄 Force reloading with cache bypass...');
    setTimeout(() => {
      window.location.reload(true); // Force reload
    }, 1000);
    
    console.log('✅ Cache cleared! Page will reload in 1 second.');
    
  } catch (error) {
    console.error('❌ Error clearing cache:', error);
  }
};

// Jalankan
forceClearCacheApelPagi();