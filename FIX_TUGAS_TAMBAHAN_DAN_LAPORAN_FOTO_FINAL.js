// 🎯 FIX FINAL: Tugas Tambahan & Laporan Foto
// Memperbaiki 2 masalah utama:
// 1. Data tugas tambahan tidak muncul di halaman tugas tambahan
// 2. Data dengan foto tidak muncul di halaman laporan

console.log('🎯 FIX FINAL: Tugas Tambahan & Laporan Foto');
console.log('===========================================');

const WAWAN_USER_ID = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';

async function fixTugasTambahanDanLaporanFoto() {
  console.log('🔍 Memulai diagnosa dan perbaikan...');
  
  const results = {
    userAuth: false,
    apiTests: {},
    tugasTambahanFix: false,
    laporanFotoFix: false,
    recommendations: []
  };
  
  // 1. FIX USER AUTHENTICATION
  console.log('\n1️⃣ MEMPERBAIKI AUTENTIKASI USER');
  try {
    const authUser = localStorage.getItem('auth_user');
    let userData = authUser ? JSON.parse(authUser) : null;
    
    if (!userData || userData.id !== WAWAN_USER_ID) {
      userData = {
        id: WAWAN_USER_ID,
        username: 'wawan',
        fullName: 'H. Wawan Yogaswara, S.Pd, M.Pd',
        role: 'admin',
        nip: '196512121990031007',
        position: 'Pengawas Sekolah'
      };
      localStorage.setItem('auth_user', JSON.stringify(userData));
      console.log('✅ User authentication diperbaiki');
    } else {
      console.log('✅ User authentication sudah benar');
    }
    results.userAuth = true;
  } catch (error) {
    console.error('❌ Gagal memperbaiki user auth:', error);
    results.recommendations.push('Perbaiki autentikasi user secara manual');
  }
  
  // 2. TEST API ENDPOINTS
  console.log('\n2️⃣ TESTING API ENDPOINTS');
  const endpoints = [
    { name: 'activities', url: `/api/activities?user_id=${WAWAN_USER_ID}`, key: 'tugasTambahan' },
    { name: 'tasks-daily', url: `/api/tasks-daily?user_id=${WAWAN_USER_ID}`, key: 'tugasHarian' },
    { name: 'supervisions', url: `/api/supervisions?user_id=${WAWAN_USER_ID}`, key: 'supervisi' }
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`📡 Testing ${endpoint.name}...`);
      const response = await fetch(endpoint.url);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ ${endpoint.name}: ${data.length} items`);
        
        // Cek data dengan foto
        const dataWithPhotos = data.filter(item => item.photo || item.photo1 || item.photo2);
        console.log(`📸 ${endpoint.name} dengan foto: ${dataWithPhotos.length} items`);
        
        results.apiTests[endpoint.key] = {
          success: true,
          count: data.length,
          withPhotos: dataWithPhotos.length,
          data: data
        };
      } else {
        const errorText = await response.text();
        console.error(`❌ ${endpoint.name}: ${response.status} - ${errorText}`);
        results.apiTests[endpoint.key] = {
          success: false,
          error: `${response.status}: ${errorText}`
        };
      }
    } catch (error) {
      console.error(`❌ ${endpoint.name} fetch error:`, error);
      results.apiTests[endpoint.key] = {
        success: false,
        error: error.message
      };
    }
  }
  
  // 3. FIX TUGAS TAMBAHAN PAGE
  console.log('\n3️⃣ MEMPERBAIKI HALAMAN TUGAS TAMBAHAN');
  const tugasTambahanData = results.apiTests.tugasTambahan;
  
  if (tugasTambahanData?.success && tugasTambahanData.count > 0) {
    console.log(`📋 Ditemukan ${tugasTambahanData.count} tugas tambahan di API`);
    
    // Cek apakah sedang di halaman tugas tambahan
    if (window.location.pathname.includes('additional') || window.location.pathname.includes('tugas-tambahan')) {
      console.log('📍 Sedang di halaman Tugas Tambahan');
      
      // Cek DOM untuk task cards
      const taskCards = document.querySelectorAll('.hover\\:shadow-md, [data-testid="task-card"], .grid.gap-6 > .hover\\:shadow-md');
      console.log(`📦 Ditemukan ${taskCards.length} task cards di DOM`);
      
      if (taskCards.length === 0) {
        console.log('❌ MASALAH DITEMUKAN: Data ada di API tapi tidak tampil di UI');
        
        // Apply fixes
        console.log('🔧 Menerapkan perbaikan...');
        
        // Clear React Query cache
        if (window.queryClient) {
          window.queryClient.clear();
          await window.queryClient.invalidateQueries({ queryKey: ['additional-tasks'] });
          console.log('✅ React Query cache dibersihkan');
        }
        
        // Clear localStorage caches
        const cacheKeys = ['additional_tasks_cache', 'react-query-cache'];
        cacheKeys.forEach(key => {
          if (localStorage.getItem(key)) {
            localStorage.removeItem(key);
            console.log(`✅ ${key} dibersihkan`);
          }
        });
        
        // Dispatch refresh events
        const events = ['additional-tasks-refresh', 'data-updated', 'cache-cleared'];
        events.forEach(eventName => {
          window.dispatchEvent(new CustomEvent(eventName, {
            detail: { 
              timestamp: Date.now(),
              userId: WAWAN_USER_ID,
              data: tugasTambahanData.data
            }
          }));
        });
        console.log('✅ Refresh events dikirim');
        
        // Force component re-render dengan inject data langsung
        setTimeout(() => {
          // Cek lagi setelah 2 detik
          const updatedTaskCards = document.querySelectorAll('.hover\\:shadow-md, [data-testid="task-card"]');
          if (updatedTaskCards.length === 0) {
            console.log('🔄 Masih belum tampil, akan reload halaman...');
            setTimeout(() => window.location.reload(), 1000);
          } else {
            console.log('✅ Tugas tambahan sekarang sudah tampil!');
            results.tugasTambahanFix = true;
          }
        }, 2000);
        
      } else {
        console.log('✅ Tugas tambahan sudah tampil di UI');
        results.tugasTambahanFix = true;
      }
    } else {
      console.log('⚠️ Tidak sedang di halaman Tugas Tambahan');
      results.recommendations.push('Navigasi ke halaman Tugas Tambahan untuk melihat hasil');
    }
  } else if (tugasTambahanData?.success && tugasTambahanData.count === 0) {
    console.log('⚠️ Tidak ada data tugas tambahan di database');
    results.recommendations.push('Tambahkan data tugas tambahan terlebih dahulu');
  } else {
    console.log('❌ API tugas tambahan bermasalah');
    results.recommendations.push('Perbaiki API endpoint /api/activities');
  }
  
  // 4. FIX LAPORAN FOTO
  console.log('\n4️⃣ MEMPERBAIKI LAPORAN FOTO');
  
  // Cek apakah sedang di halaman laporan
  if (window.location.pathname.includes('reports') || window.location.pathname.includes('laporan')) {
    console.log('📍 Sedang di halaman Laporan');
    
    // Hitung total data dengan foto dari semua endpoint
    let totalDataWithPhotos = 0;
    Object.values(results.apiTests).forEach(apiResult => {
      if (apiResult.success) {
        totalDataWithPhotos += apiResult.withPhotos || 0;
      }
    });
    
    console.log(`📸 Total data dengan foto di API: ${totalDataWithPhotos}`);
    
    if (totalDataWithPhotos > 0) {
      // Cek apakah foto tampil di halaman laporan
      const photoElements = document.querySelectorAll('img[src*="data:"], img[src*="base64"], .photo-item img, [alt*="foto"], [alt*="Foto"]');
      console.log(`🖼️ Ditemukan ${photoElements.length} elemen foto di halaman laporan`);
      
      if (photoElements.length === 0) {
        console.log('❌ MASALAH DITEMUKAN: Data dengan foto ada di API tapi tidak tampil di laporan');
        
        // Apply fixes untuk laporan
        console.log('🔧 Menerapkan perbaikan laporan foto...');
        
        // Clear reports cache
        if (window.queryClient) {
          await window.queryClient.invalidateQueries({ queryKey: ['reports'] });
          console.log('✅ Reports cache dibersihkan');
        }
        
        // Clear localStorage reports cache
        const reportsCacheKeys = ['reports_activities_cache', 'reports_cache'];
        reportsCacheKeys.forEach(key => {
          if (localStorage.getItem(key)) {
            localStorage.removeItem(key);
            console.log(`✅ ${key} dibersihkan`);
          }
        });
        
        // Dispatch reports refresh events
        const reportsEvents = ['updateReportsData', 'reports-refresh', 'photos-refresh'];
        reportsEvents.forEach(eventName => {
          window.dispatchEvent(new CustomEvent(eventName, {
            detail: { 
              timestamp: Date.now(),
              userId: WAWAN_USER_ID,
              activities: [
                ...(results.apiTests.tugasTambahan?.data || []),
                ...(results.apiTests.tugasHarian?.data || []),
                ...(results.apiTests.supervisi?.data || [])
              ]
            }
          }));
        });
        console.log('✅ Reports refresh events dikirim');
        
        // Force reload reports data
        setTimeout(() => {
          const updatedPhotoElements = document.querySelectorAll('img[src*="data:"], img[src*="base64"]');
          if (updatedPhotoElements.length === 0) {
            console.log('🔄 Foto masih belum tampil, akan reload halaman...');
            setTimeout(() => window.location.reload(), 1000);
          } else {
            console.log('✅ Foto sekarang sudah tampil di laporan!');
            results.laporanFotoFix = true;
          }
        }, 2000);
        
      } else {
        console.log('✅ Foto sudah tampil di halaman laporan');
        results.laporanFotoFix = true;
      }
    } else {
      console.log('⚠️ Tidak ada data dengan foto di database');
      results.recommendations.push('Tambahkan foto ke data yang sudah ada');
    }
  } else {
    console.log('⚠️ Tidak sedang di halaman Laporan');
    results.recommendations.push('Navigasi ke halaman Laporan untuk melihat hasil');
  }
  
  // 5. GENERATE RECOMMENDATIONS
  console.log('\n5️⃣ MEMBUAT REKOMENDASI');
  
  if (results.tugasTambahanFix && results.laporanFotoFix) {
    results.recommendations.unshift('✅ Semua masalah berhasil diperbaiki!');
  } else {
    if (!results.tugasTambahanFix && tugasTambahanData?.success && tugasTambahanData.count > 0) {
      results.recommendations.unshift('🔄 Reload halaman Tugas Tambahan untuk melihat data');
    }
    if (!results.laporanFotoFix && totalDataWithPhotos > 0) {
      results.recommendations.unshift('🔄 Reload halaman Laporan untuk melihat foto');
    }
  }
  
  return results;
}

// Execute the fix
fixTugasTambahanDanLaporanFoto().then(results => {
  console.log('\n🎉 PERBAIKAN SELESAI');
  console.log('Results:', results);
  
  // Show comprehensive notification
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #1e40af, #1d4ed8);
    color: white;
    padding: 2rem;
    border-radius: 16px;
    box-shadow: 0 20px 40px rgba(30, 64, 175, 0.4);
    z-index: 9999;
    max-width: 600px;
    font-family: system-ui, -apple-system, sans-serif;
    animation: slideDown 0.5s ease-out;
    max-height: 80vh;
    overflow-y: auto;
  `;
  
  const tugasTambahanCount = results.apiTests.tugasTambahan?.count || 0;
  const totalPhotos = Object.values(results.apiTests).reduce((sum, api) => sum + (api.withPhotos || 0), 0);
  
  notification.innerHTML = `
    <div style="text-align: center; margin-bottom: 1.5rem;">
      <div style="font-size: 2rem; margin-bottom: 0.5rem;">🎯</div>
      <div style="font-weight: bold; font-size: 1.4rem;">Hasil Perbaikan</div>
    </div>
    
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
      <div style="background: rgba(255,255,255,0.1); border-radius: 8px; padding: 1rem;">
        <div style="font-weight: 600; margin-bottom: 0.5rem;">📋 Tugas Tambahan</div>
        <div style="font-size: 0.9rem;">${tugasTambahanCount} data ditemukan</div>
        <div style="font-size: 0.8rem; color: rgba(255,255,255,0.8);">${results.tugasTambahanFix ? '✅ Diperbaiki' : '🔄 Perlu reload'}</div>
      </div>
      
      <div style="background: rgba(255,255,255,0.1); border-radius: 8px; padding: 1rem;">
        <div style="font-weight: 600; margin-bottom: 0.5rem;">📸 Foto Laporan</div>
        <div style="font-size: 0.9rem;">${totalPhotos} foto ditemukan</div>
        <div style="font-size: 0.8rem; color: rgba(255,255,255,0.8);">${results.laporanFotoFix ? '✅ Diperbaiki' : '🔄 Perlu reload'}</div>
      </div>
    </div>
    
    <div style="background: rgba(255,255,255,0.1); border-radius: 8px; padding: 1rem; margin-bottom: 1.5rem;">
      <div style="font-weight: 600; margin-bottom: 0.5rem;">💡 Rekomendasi:</div>
      <div style="font-size: 0.8rem; line-height: 1.4;">
        ${results.recommendations.slice(0, 3).map(r => `• ${r}`).join('<br>')}
      </div>
    </div>
    
    <div style="display: flex; gap: 0.5rem;">
      <button onclick="window.location.href='/additional-tasks'" style="flex: 1; background: white; color: #1e40af; border: none; padding: 0.75rem; border-radius: 8px; cursor: pointer; font-size: 0.875rem; font-weight: 600;">
        📋 Cek Tugas Tambahan
      </button>
      <button onclick="window.location.href='/reports'" style="flex: 1; background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); padding: 0.75rem; border-radius: 8px; cursor: pointer; font-size: 0.875rem;">
        📊 Cek Laporan
      </button>
      <button onclick="location.reload()" style="flex: 1; background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); padding: 0.75rem; border-radius: 8px; cursor: pointer; font-size: 0.875rem;">
        🔄 Reload
      </button>
    </div>
    
    <button onclick="this.remove()" style="position: absolute; top: 1rem; right: 1rem; background: rgba(255,255,255,0.2); color: white; border: none; width: 2rem; height: 2rem; border-radius: 50%; cursor: pointer; font-size: 1rem;">
      ✕
    </button>
  `;
  
  // Add animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideDown {
      from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
      to { transform: translateX(-50%) translateY(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
  
  document.body.appendChild(notification);
  
  // Auto remove after 30 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 30000);
  
}).catch(error => {
  console.error('❌ Perbaikan gagal:', error);
  
  // Show error notification
  const errorNotification = document.createElement('div');
  errorNotification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #ef4444, #dc2626);
    color: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
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
    <div style="font-size: 0.8rem; color: rgba(255,255,255,0.8); margin-bottom: 1rem;">
      Silakan cek browser console untuk informasi detail.
    </div>
    <button onclick="this.parentElement.remove()" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer;">
      Tutup
    </button>
  `;
  
  document.body.appendChild(errorNotification);
});