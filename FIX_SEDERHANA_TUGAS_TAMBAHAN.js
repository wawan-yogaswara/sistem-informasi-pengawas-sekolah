// 🔧 FIX SEDERHANA TUGAS TAMBAHAN
// Script sederhana untuk memperbaiki masalah tugas tambahan tidak muncul

console.log('🔧 FIX SEDERHANA TUGAS TAMBAHAN');
console.log('==============================');

const WAWAN_USER_ID = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';

async function fixSederhanaTugasTambahan() {
  console.log('🔧 Memulai perbaikan sederhana...');
  
  // 1. PASTIKAN USER AUTHENTICATION BENAR
  console.log('1️⃣ Memperbaiki user authentication...');
  const userData = {
    id: WAWAN_USER_ID,
    username: 'wawan',
    fullName: 'H. Wawan Yogaswara, S.Pd, M.Pd',
    role: 'admin',
    nip: '196512121990031007',
    position: 'Pengawas Sekolah'
  };
  localStorage.setItem('auth_user', JSON.stringify(userData));
  console.log('✅ User authentication diperbaiki');
  
  // 2. CEK DATA DI API
  console.log('2️⃣ Mengecek data di API...');
  try {
    const response = await fetch(`/api/activities?user_id=${WAWAN_USER_ID}`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const apiData = await response.json();
    console.log(`✅ API mengembalikan ${apiData.length} data`);
    
    if (apiData.length === 0) {
      console.log('⚠️ Tidak ada data di API');
      return { success: false, reason: 'no_data', message: 'Tidak ada data tugas tambahan di database' };
    }
    
    // 3. CEK APAKAH DI HALAMAN YANG BENAR
    console.log('3️⃣ Mengecek halaman...');
    const currentPath = window.location.pathname;
    if (!currentPath.includes('additional') && !currentPath.includes('tugas-tambahan')) {
      console.log('⚠️ Tidak di halaman tugas tambahan, redirect...');
      window.location.href = '/additional-tasks';
      return { success: true, reason: 'redirected', message: 'Mengarahkan ke halaman tugas tambahan' };
    }
    
    // 4. CEK DOM ELEMENTS
    console.log('4️⃣ Mengecek DOM elements...');
    const taskCards = document.querySelectorAll('.hover\\:shadow-md, [data-testid="task-card"]');
    console.log(`📋 Ditemukan ${taskCards.length} task cards di DOM`);
    
    if (taskCards.length >= apiData.length) {
      console.log('✅ Data sudah tampil dengan benar');
      return { success: true, reason: 'already_visible', message: 'Data sudah tampil dengan benar' };
    }
    
    // 5. FORCE REFRESH REACT QUERY
    console.log('5️⃣ Force refresh React Query...');
    if (window.queryClient) {
      // Clear cache
      window.queryClient.clear();
      console.log('✅ React Query cache dibersihkan');
      
      // Invalidate specific query
      await window.queryClient.invalidateQueries({ queryKey: ['additional-tasks'] });
      console.log('✅ Additional tasks query di-invalidate');
      
      // Force refetch
      await window.queryClient.refetchQueries({ queryKey: ['additional-tasks'] });
      console.log('✅ Query di-refetch');
    } else {
      console.log('⚠️ React Query client tidak ditemukan');
    }
    
    // 6. CLEAR LOCALSTORAGE CACHE
    console.log('6️⃣ Membersihkan localStorage cache...');
    const cacheKeys = [
      'additional_tasks_cache',
      'react-query-cache',
      'additional-tasks-cache'
    ];
    
    cacheKeys.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        console.log(`✅ ${key} dibersihkan`);
      }
    });
    
    // 7. DISPATCH REFRESH EVENTS
    console.log('7️⃣ Mengirim refresh events...');
    const events = [
      'additional-tasks-refresh',
      'data-updated',
      'cache-cleared',
      'force-refresh'
    ];
    
    events.forEach(eventName => {
      window.dispatchEvent(new CustomEvent(eventName, {
        detail: { 
          timestamp: Date.now(),
          userId: WAWAN_USER_ID,
          data: apiData
        }
      }));
    });
    console.log('✅ Refresh events dikirim');
    
    // 8. TUNGGU DAN CEK LAGI
    console.log('8️⃣ Menunggu dan mengecek hasil...');
    
    return new Promise((resolve) => {
      let attempts = 0;
      const maxAttempts = 5;
      
      const checkInterval = setInterval(() => {
        attempts++;
        const updatedTaskCards = document.querySelectorAll('.hover\\:shadow-md, [data-testid="task-card"]');
        console.log(`🔍 Percobaan ${attempts}: ${updatedTaskCards.length} cards ditemukan`);
        
        if (updatedTaskCards.length > 0) {
          clearInterval(checkInterval);
          console.log('✅ BERHASIL: Data sekarang tampil!');
          resolve({ 
            success: true, 
            reason: 'fixed', 
            message: `Berhasil! ${updatedTaskCards.length} tugas tambahan sekarang tampil`,
            cards: updatedTaskCards.length
          });
        } else if (attempts >= maxAttempts) {
          clearInterval(checkInterval);
          console.log('⚠️ Data masih belum tampil, akan reload halaman...');
          
          // Last resort: reload page
          setTimeout(() => {
            window.location.reload();
          }, 1000);
          
          resolve({ 
            success: false, 
            reason: 'need_reload', 
            message: 'Halaman akan di-reload untuk menampilkan data'
          });
        }
      }, 1000);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
    return { success: false, reason: 'error', message: error.message };
  }
}

// JALANKAN FIX
fixSederhanaTugasTambahan().then(result => {
  console.log('\n🎉 HASIL PERBAIKAN:', result);
  
  // Show simple notification
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: ${result.success ? 'linear-gradient(135deg, #059669, #047857)' : 'linear-gradient(135deg, #dc2626, #b91c1c)'};
    color: white;
    padding: 2rem;
    border-radius: 16px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    z-index: 9999;
    max-width: 500px;
    text-align: center;
    font-family: system-ui, -apple-system, sans-serif;
    animation: popIn 0.3s ease-out;
  `;
  
  const icon = result.success ? '✅' : '❌';
  const title = result.success ? 'Perbaikan Berhasil!' : 'Perbaikan Gagal';
  
  notification.innerHTML = `
    <div style="font-size: 3rem; margin-bottom: 1rem;">${icon}</div>
    <div style="font-weight: bold; font-size: 1.5rem; margin-bottom: 1rem;">
      ${title}
    </div>
    <div style="font-size: 1rem; line-height: 1.5; margin-bottom: 2rem;">
      ${result.message}
    </div>
    <div style="display: flex; gap: 1rem; justify-content: center;">
      ${result.success && result.reason !== 'redirected' ? 
        '<button onclick="window.location.href=\'/additional-tasks\'" style="background: white; color: #059669; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; font-weight: 600;">Lihat Tugas Tambahan</button>' : 
        ''
      }
      <button onclick="this.parentElement.parentElement.remove()" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer;">
        Tutup
      </button>
    </div>
  `;
  
  // Add animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes popIn {
      from { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
      to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
  
  document.body.appendChild(notification);
  
  // Auto remove after 10 seconds if successful
  if (result.success && result.reason !== 'need_reload') {
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 10000);
  }
  
}).catch(error => {
  console.error('❌ Fix gagal:', error);
  
  // Show error notification
  const errorNotification = document.createElement('div');
  errorNotification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #dc2626, #b91c1c);
    color: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 8px 25px rgba(220, 38, 38, 0.4);
    z-index: 9999;
    max-width: 400px;
    font-family: system-ui, -apple-system, sans-serif;
  `;
  
  errorNotification.innerHTML = `
    <div style="font-weight: bold; font-size: 1.2rem; margin-bottom: 1rem;">
      ❌ Perbaikan Gagal
    </div>
    <div style="font-size: 0.9rem; margin-bottom: 1rem;">
      ${error.message}
    </div>
    <button onclick="this.parentElement.remove()" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer;">
      Tutup
    </button>
  `;
  
  document.body.appendChild(errorNotification);
});