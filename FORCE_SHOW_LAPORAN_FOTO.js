// 🖼️ FORCE SHOW LAPORAN FOTO
// Script khusus untuk memaksa foto muncul di halaman laporan

console.log('🖼️ FORCE SHOW LAPORAN FOTO');
console.log('==========================');

const WAWAN_USER_ID = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';

async function forceShowLaporanFoto() {
  console.log('🔍 Memaksa foto muncul di halaman laporan...');
  
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
    
    // 2. Get data from all APIs
    console.log('📡 Fetching data from all APIs...');
    const endpoints = [
      { name: 'activities', url: `/api/activities?user_id=${WAWAN_USER_ID}` },
      { name: 'tasks-daily', url: `/api/tasks-daily?user_id=${WAWAN_USER_ID}` },
      { name: 'supervisions', url: `/api/supervisions?user_id=${WAWAN_USER_ID}` }
    ];
    
    const allData = [];
    let totalPhotos = 0;
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint.url);
        if (response.ok) {
          const data = await response.json();
          console.log(`✅ ${endpoint.name}: ${data.length} items`);
          
          // Count photos
          const withPhotos = data.filter(item => item.photo || item.photo1 || item.photo2);
          console.log(`📸 ${endpoint.name} dengan foto: ${withPhotos.length} items`);
          totalPhotos += withPhotos.length;
          
          // Add to all data with proper formatting for reports
          data.forEach(item => {
            allData.push({
              id: item.id,
              type: endpoint.name === 'activities' ? 'Tugas Tambahan' : 
                    endpoint.name === 'supervisions' ? 'Supervisi' : 'Tugas Pokok',
              title: item.title || item.name || 'Kegiatan',
              date: item.date || item.created_at,
              location: item.location || 'Tempat Kegiatan',
              organizer: item.organizer || 'Pengawas Sekolah',
              description: item.description || item.findings || '',
              photo1: item.photo || item.photo1,
              photo2: item.photo2,
              createdAt: item.created_at,
              source: 'supabase'
            });
          });
        } else {
          console.error(`❌ ${endpoint.name}: ${response.status}`);
        }
      } catch (error) {
        console.error(`❌ ${endpoint.name} error:`, error);
      }
    }
    
    console.log(`📊 Total data: ${allData.length}, Total dengan foto: ${totalPhotos}`);
    
    if (totalPhotos === 0) {
      console.log('⚠️ No photos found in data');
      return { success: false, reason: 'no_photos_in_data' };
    }
    
    // 3. Clear reports caches
    console.log('🗑️ Clearing reports caches...');
    const cacheKeys = [
      'reports_activities_cache',
      'reports_cache',
      'react-query-cache'
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
      await window.queryClient.invalidateQueries({ queryKey: ['reports'] });
      console.log('✅ React Query cache cleared');
    }
    
    // 5. Check if we're on the reports page
    const currentPath = window.location.pathname;
    if (!currentPath.includes('reports') && !currentPath.includes('laporan')) {
      console.log('📍 Not on reports page, redirecting...');
      window.location.href = '/reports';
      return { success: true, reason: 'redirected' };
    }
    
    // 6. Check current photos in DOM
    const existingPhotos = document.querySelectorAll('img[src*="data:"], img[src*="base64"], .photo-item img');
    console.log(`🖼️ Current DOM has ${existingPhotos.length} photo elements`);
    
    if (existingPhotos.length >= totalPhotos) {
      console.log('✅ Photos already visible in DOM');
      return { success: true, reason: 'already_visible' };
    }
    
    // 7. Force inject data into reports
    console.log('💉 Force injecting data into reports...');
    
    // Store data in localStorage for reports page to pick up
    localStorage.setItem('reports_activities_cache', JSON.stringify(allData));
    
    // 8. Dispatch refresh events
    console.log('📡 Dispatching refresh events...');
    const events = [
      'updateReportsData',
      'reports-refresh',
      'photos-refresh',
      'data-updated',
      'cache-cleared'
    ];
    
    events.forEach(eventName => {
      window.dispatchEvent(new CustomEvent(eventName, {
        detail: { 
          timestamp: Date.now(),
          userId: WAWAN_USER_ID,
          activities: allData,
          force: true
        }
      }));
    });
    
    // 9. Wait and check if photos appear
    console.log('⏳ Waiting for photos to appear...');
    
    return new Promise((resolve) => {
      let attempts = 0;
      const maxAttempts = 10;
      
      const checkInterval = setInterval(() => {
        attempts++;
        const updatedPhotos = document.querySelectorAll('img[src*="data:"], img[src*="base64"]');
        console.log(`🔍 Attempt ${attempts}: Found ${updatedPhotos.length} photos`);
        
        if (updatedPhotos.length > 0) {
          clearInterval(checkInterval);
          console.log('✅ SUCCESS: Photos now visible!');
          resolve({ success: true, reason: 'forced_refresh_worked', photos: updatedPhotos.length });
        } else if (attempts >= maxAttempts) {
          clearInterval(checkInterval);
          console.log('⚠️ Photos still not visible after refresh attempts');
          
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
    console.error('❌ Force show photos failed:', error);
    return { success: false, reason: 'error', error: error.message };
  }
}

// Execute the force show
forceShowLaporanFoto().then(result => {
  console.log('\n🎉 FORCE SHOW PHOTOS COMPLETED');
  console.log('Result:', result);
  
  // Show notification
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    left: 20px;
    background: linear-gradient(135deg, #7c3aed, #6d28d9);
    color: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 8px 25px rgba(124, 58, 237, 0.4);
    z-index: 9999;
    max-width: 400px;
    font-family: system-ui, -apple-system, sans-serif;
    animation: slideIn 0.5s ease-out;
  `;
  
  let title, message, action;
  
  switch (result.reason) {
    case 'no_photos_in_data':
      title = '⚠️ Tidak Ada Foto';
      message = 'Tidak ada data dengan foto di database. Silakan tambahkan foto ke data yang sudah ada.';
      action = '<button onclick="window.location.href=\'/additional-tasks\'" style="background: white; color: #7c3aed; border: none; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; margin-top: 1rem;">Tambah Foto</button>';
      break;
      
    case 'forced_refresh_worked':
      title = '✅ Berhasil!';
      message = `Foto sekarang sudah tampil di laporan (${result.photos} foto).`;
      action = '';
      break;
      
    case 'already_visible':
      title = '✅ Foto Sudah Tampil';
      message = 'Foto sudah tampil dengan benar di halaman laporan.';
      action = '';
      break;
      
    case 'redirected':
      title = '🔄 Redirect';
      message = 'Mengarahkan ke halaman Laporan...';
      action = '';
      break;
      
    case 'need_page_reload':
      title = '🔄 Reload Diperlukan';
      message = 'Halaman akan di-reload untuk menampilkan foto.';
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
      from { transform: translateX(-100%); opacity: 0; }
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
  console.error('❌ Force show photos script failed:', error);
});