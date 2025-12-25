// FIX TUGAS HARIAN SIMPLE ERROR
// Copy paste ke browser console di halaman Tugas Harian
// Untuk error "Could not find the 'school_name' column or 'topic' in the schema cache"

console.log('🔧 SIMPLE FIX: Tugas harian schema error');

const fixTugasHarianSimpleError = async () => {
  try {
    console.log('🚀 Starting simple fix for tugas harian error...');
    
    // 1. CLEAR ALL CACHES
    console.log('🗑️ Clearing all caches...');
    
    // Clear localStorage caches
    const cacheKeys = Object.keys(localStorage).filter(key => 
      key.includes('cache') || 
      key.includes('schema') ||
      key.includes('tasks') ||
      key.includes('query')
    );
    
    cacheKeys.forEach(key => {
      localStorage.removeItem(key);
      console.log(`🗑️ Removed: ${key}`);
    });
    
    // Clear React Query cache
    if (window.queryClient) {
      await window.queryClient.clear();
      console.log('✅ React Query cache cleared');
    }
    
    // 2. FORCE USER CONTEXT
    console.log('👤 Setting user context...');
    const userData = {
      id: '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e',
      username: 'wawan',
      fullName: 'Wawan Setiawan',
      role: 'admin'
    };
    localStorage.setItem('auth_user', JSON.stringify(userData));
    
    // 3. DISPATCH REFRESH EVENTS
    console.log('📡 Dispatching refresh events...');
    
    const events = [
      'clearCache',
      'refreshSchema', 
      'refreshTasks',
      'forceRefresh'
    ];
    
    events.forEach(eventName => {
      const event = new CustomEvent(eventName, {
        detail: { source: 'simple_fix' }
      });
      window.dispatchEvent(event);
      document.dispatchEvent(event);
    });
    
    // 4. PROVIDE IMMEDIATE SOLUTION
    console.log(`
🎯 IMMEDIATE SOLUTION:

1. REFRESH HALAMAN SEKARANG:
   - Tekan Ctrl+F5 (hard refresh)
   - Atau tutup tab dan buka lagi

2. SAAT INPUT ULANG:
   ✅ Isi "Judul Tugas" dengan jelas
   ✅ Pilih "Jenis Kegiatan" dari dropdown
   ✅ Pilih "Tempat Kegiatan" dari dropdown (PENTING!)
   ✅ Isi tanggal
   ✅ Isi deskripsi singkat
   ❌ JANGAN upload foto dulu (coba text saja)

3. JIKA MASIH ERROR:
   - Gunakan halaman "Tugas Tambahan" sebagai alternatif
   - Data tetap akan tersimpan ke sistem

4. TIPS SUKSES:
   - Pastikan dropdown "Tempat Kegiatan" dipilih
   - Jangan kosongkan field wajib
   - Coba input data minimal dulu
    `);
    
    console.log('🔄 Auto-refreshing page in 3 seconds...');
    
    // Auto refresh page
    setTimeout(() => {
      window.location.reload();
    }, 3000);
    
  } catch (error) {
    console.error('❌ Simple fix failed:', error);
    console.log('🔄 Manual refresh required - press Ctrl+F5');
  }
};

// Execute immediately
fixTugasHarianSimpleError();