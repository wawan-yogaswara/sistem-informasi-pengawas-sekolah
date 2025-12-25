// FORCE REFRESH LAPORAN APEL PAGI - Jalankan di halaman laporan
const forceRefreshLaporanApelPagi = () => {
  try {
    console.log('🔄 Force refresh laporan untuk menampilkan Apel Pagi...');
    
    // Clear query cache jika menggunakan React Query
    if (window.queryClient) {
      console.log('🗑️ Clearing React Query cache...');
      window.queryClient.invalidateQueries(['all-activities']);
      window.queryClient.refetchQueries(['all-activities']);
    }
    
    // Clear localStorage cache jika ada
    const cacheKeys = [
      'activities_cache',
      'additional_tasks_cache',
      'reports_cache'
    ];
    
    cacheKeys.forEach(key => {
      if (localStorage.getItem(key)) {
        console.log(`🗑️ Clearing ${key}...`);
        localStorage.removeItem(key);
      }
    });
    
    // Force reload halaman
    console.log('🔄 Reloading page...');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
    
    console.log('✅ Refresh initiated. Page will reload in 1 second.');
    
  } catch (error) {
    console.error('❌ Error during refresh:', error);
  }
};

// Jalankan
forceRefreshLaporanApelPagi();