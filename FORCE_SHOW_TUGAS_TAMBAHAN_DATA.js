// 🚀 FORCE SHOW TUGAS TAMBAHAN DATA
// Script khusus untuk memaksa data tugas tambahan muncul di halaman

console.log('🚀 FORCE SHOW TUGAS TAMBAHAN DATA');
console.log('=================================');

const WAWAN_USER_ID = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';

async function forceShowTugasTambahanData() {
  console.log('🔍 Memaksa data tugas tambahan muncul...');
  
  try {
    // 1. Fix user authentication first
    const userData = {
      id: WAWAN_USER_ID,
      username: 'wawan',
      fullName: 'H. Wawan Yogaswara, S.Pd, M.Pd',
      role: 'admin',
      nip: '196512121990031007',
      position: 'Pengawas Sekolah'
    };
    localStorage.setItem('auth_user', JSON.stringify(userData));
    console.log('✅ User authentication fixed');
    
    // 2. Get data from API
    console.log('📡 Fetching data from API...');
    const response = await fetch(`/api/activities?user_id=${WAWAN_USER_ID}`);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const apiData = await response.json();
    console.log(`✅ API returned ${apiData.length} items`);
    
    if (apiData.length === 0) {
      console.log('⚠️ No data in API - cannot force show');
      return { success: false, reason: 'no_data_in_api' };
    }
    
    // 3. Clear all caches
    console.log('🗑️ Clearing all caches...');
    const cacheKeys = [
      'additional_tasks_cache',
      'react-query-cache',
      'additional-tasks-cache'
    ];
    
    cacheKeys.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        console.log(`✅ Cleared ${key}`);
      }
    });
    
    // 4. Clear React Query cache
    if (window.queryClient) {
      window.queryClient.clear();
      await window.queryClient.invalidateQueries({ queryKey: ['additional-tasks'] });
      console.log('✅ React Query cache cleared');
    }
    
    // 5. Check if we're on the additional tasks page
    const currentPath = window.location.pathname;
    if (!currentPath.includes('additional') && !currentPath.includes('tugas-tambahan')) {
      console.log('📍 Not on additional tasks page, redirecting...');
      window.location.href = '/additional-tasks';
      return { success: true, reason: 'redirected' };
    }
    
    // 6. Check current DOM state
    const existingCards = document.querySelectorAll('.hover\\:shadow-md, [data-testid="task-card"]');
    console.log(`📦 Current DOM has ${existingCards.length} task cards`);
    
    if (existingCards.length >= apiData.length) {
      console.log('✅ Data already visible in DOM');
      return { success: true, reason: 'already_visible' };
    }
    
    // 7. Force refresh events
    console.log('📡 Dispatching refresh events...');
    const events = [
      'additional-tasks-refresh',
      'data-updated',
      'cache-cleared',
      'user-updated',
      'force-refresh'
    ];
    
    events.forEach(eventName => {
      window.dispatchEvent(new CustomEvent(eventName, {
        detail: { 
          timestamp: Date.now(),
          userId: WAWAN_USER_ID,
          data: apiData,
          force: true
        }
      }));
    });
    
    // 8. Wait and check if data appears
    console.log('⏳ Waiting for data to appear...');
    
    return new Promise((resolve) => {
      let attempts = 0;
      const maxAttempts = 10;
      
      const checkInterval = setInterval(() => {
        attempts++;
        const updatedCards = document.querySelectorAll('.hover\\:shadow-md, [data-testid="task-card"]');
        console.log(`🔍 Attempt ${attempts}: Found ${updatedCards.length} cards`);
        
        if (updatedCards.length > 0) {
          clearInterval(checkInterval);
          console.log('✅ SUCCESS: Data now visible!');
          resolve({ success: true, reason: 'forced_refresh_worked', cards: updatedCards.length });
        } else if (attempts >= maxAttempts) {
          clearInterval(checkInterval);
          console.log('⚠️ Data still not visible after refresh attempts');
          
          // Last resort: reload page
          console.log('🔄 Last resort: Reloading page...');
          setTimeout(() => {
            window.location.reload();
          }, 1000);
          
          resolve({ success: false, reason: 'need_page_reload' });
        }
      }, 1000);
    });
    
  } catch (error) {
    console.error('❌ Force show failed:', error);
    return { success: false, reason: 'error', error: error.message };
  }
}

// Execute the force show
forceShowTugasTambahanData().then(result => {
  console.log('\n🎉 FORCE SHOW COMPLETED');
  console.log('Result:', result);
  
  // Show notification
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #059669, #047857);
    color: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 8px 25px rgba(5, 150, 105, 0.4);
    z-index: 9999;
    max-width: 400px;
    font-family: system-ui, -apple-system, sans-serif;
    animation: slideIn 0.5s ease-out;
  `;
  
  let title, message, action;
  
  switch (result.reason) {
    case 'no_data_in_api':
      title = '⚠️ Tidak Ada Data';
      message = 'Tidak ada data tugas tambahan di database. Silakan tambahkan data terlebih dahulu.';
      action = '<button onclick="window.location.href=\'/additional-tasks\'" style="background: white; color: #059669; border: none; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; margin-top: 1rem;">Tambah Data</button>';
      break;
      
    case 'forced_refresh_worked':
      title = '✅ Berhasil!';
      message = `Data tugas tambahan sekarang sudah tampil (${result.cards} items).`;
      action = '';
      break;
      
    case 'already_visible':
      title = '✅ Data Sudah Tampil';
      message = 'Data tugas tambahan sudah tampil dengan benar di halaman.';
      action = '';
      break;
      
    case 'redirected':
      title = '🔄 Redirect';
      message = 'Mengarahkan ke halaman Tugas Tambahan...';
      action = '';
      break;
      
    case 'need_page_reload':
      title = '🔄 Reload Diperlukan';
      message = 'Halaman akan di-reload untuk menampilkan data.';
      action = '';
      break;
      
    default:
      title = '❌ Error';
      message = result.error || 'Terjadi kesalahan yang tidak diketahui.';
      action = '<button onclick="window.location.reload()" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; margin-top: 1rem;">Reload</button>';
  }
  
  notification.innerHTML = `
    <div style="font-weight: bold; font-size: 1.2rem; margin-bottom: 1rem;">
      ${title}
    </div>
    <div style="font-size: 0.9rem; line-height: 1.4; margin-bottom: 1rem;">
      ${message}
    </div>
    ${action}
    <button onclick="this.parentElement.remove()" style="position: absolute; top: 0.5rem; right: 0.5rem; background: rgba(255,255,255,0.2); color: white; border: none; width: 1.5rem; height: 1.5rem; border-radius: 50%; cursor: pointer; font-size: 0.8rem;">
      ✕
    </button>
  `;
  
  // Add animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
  
  document.body.appendChild(notification);
  
  // Auto remove after 8 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 8000);
  
}).catch(error => {
  console.error('❌ Force show script failed:', error);
});