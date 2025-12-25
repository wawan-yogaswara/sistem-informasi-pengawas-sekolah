// 🚨 DIAGNOSA MENDALAM LAPORAN - SEKARANG
// Script untuk mendiagnosa masalah laporan yang tidak muncul

console.log('🚨 DIAGNOSA MENDALAM LAPORAN - SEKARANG');
console.log('==========================================');

const WAWAN_USER_ID = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';

async function diagnosaMendalam() {
  console.log('🔍 Memulai diagnosa mendalam...');
  
  // 1. Cek user authentication
  console.log('\n1️⃣ CEK USER AUTHENTICATION');
  const authUser = localStorage.getItem('auth_user');
  if (authUser) {
    const userData = JSON.parse(authUser);
    console.log('✅ User ditemukan:', userData.username);
    console.log('🔑 User ID:', userData.id);
    
    if (userData.username === 'wawan' && userData.id !== WAWAN_USER_ID) {
      console.log('⚠️ User ID tidak sesuai! Memperbaiki...');
      userData.id = WAWAN_USER_ID;
      localStorage.setItem('auth_user', JSON.stringify(userData));
      console.log('✅ User ID diperbaiki ke:', WAWAN_USER_ID);
    }
  } else {
    console.log('❌ User tidak ditemukan di localStorage');
    return;
  }
  
  // 2. Test koneksi ke API endpoints
  console.log('\n2️⃣ TEST KONEKSI API ENDPOINTS');
  
  try {
    // Test tasks endpoint
    console.log('\n📋 Testing /api/tasks-daily...');
    const tasksUrl = `/api/tasks-daily?user_id=${encodeURIComponent(WAWAN_USER_ID)}`;
    console.log('URL:', tasksUrl);
    
    const tasksResponse = await fetch(tasksUrl);
    console.log('Status:', tasksResponse.status);
    
    if (tasksResponse.ok) {
      const tasksData = await tasksResponse.json();
      console.log('✅ Tasks berhasil:', tasksData.length, 'items');
      if (tasksData.length > 0) {
        console.log('📋 Sample task:', tasksData[0]);
      }
    } else {
      const errorText = await tasksResponse.text();
      console.log('❌ Tasks error:', errorText);
    }
    
    // Test supervisions endpoint
    console.log('\n🔍 Testing /api/supervisions...');
    const supervisionsUrl = `/api/supervisions?user_id=${encodeURIComponent(WAWAN_USER_ID)}`;
    console.log('URL:', supervisionsUrl);
    
    const supervisionsResponse = await fetch(supervisionsUrl);
    console.log('Status:', supervisionsResponse.status);
    
    if (supervisionsResponse.ok) {
      const supervisionsData = await supervisionsResponse.json();
      console.log('✅ Supervisions berhasil:', supervisionsData.length, 'items');
      if (supervisionsData.length > 0) {
        console.log('🔍 Sample supervision:', supervisionsData[0]);
      }
    } else {
      const errorText = await supervisionsResponse.text();
      console.log('❌ Supervisions error:', errorText);
    }
    
    // Test activities endpoint
    console.log('\n➕ Testing /api/activities...');
    const activitiesUrl = `/api/activities?user_id=${encodeURIComponent(WAWAN_USER_ID)}`;
    console.log('URL:', activitiesUrl);
    
    const activitiesResponse = await fetch(activitiesUrl);
    console.log('Status:', activitiesResponse.status);
    
    if (activitiesResponse.ok) {
      const activitiesData = await activitiesResponse.json();
      console.log('✅ Activities berhasil:', activitiesData.length, 'items');
      if (activitiesData.length > 0) {
        console.log('➕ Sample activity:', activitiesData[0]);
      }
    } else {
      const errorText = await activitiesResponse.text();
      console.log('❌ Activities error:', errorText);
    }
    
  } catch (error) {
    console.error('❌ Error testing API:', error);
  }
  
  // 3. Cek React component state
  console.log('\n3️⃣ CEK REACT COMPONENT STATE');
  
  // Cari React component di DOM
  const reactRoot = document.querySelector('#root');
  if (reactRoot) {
    console.log('✅ React root ditemukan');
    
    // Cari loading indicator
    const loadingElement = document.querySelector('[class*="animate-spin"]');
    if (loadingElement) {
      console.log('⏳ Masih dalam status loading');
    }
    
    // Cari empty state message
    const emptyMessages = document.querySelectorAll('h3, p, div');
    let foundEmptyState = false;
    emptyMessages.forEach(el => {
      const text = el.textContent || '';
      if (text.includes('Belum ada aktivitas') || text.includes('tidak ada aktivitas')) {
        console.log('📭 Empty state ditemukan:', text);
        foundEmptyState = true;
      }
    });
    
    if (!foundEmptyState) {
      console.log('🤔 Tidak ada empty state message ditemukan');
    }
  }
  
  // 4. Cek network requests di browser
  console.log('\n4️⃣ CEK NETWORK REQUESTS');
  console.log('💡 Buka Developer Tools > Network tab untuk melihat request API');
  console.log('💡 Refresh halaman dan lihat apakah ada request ke /api/tasks-daily, /api/supervisions, /api/activities');
  
  // 5. Force reload data
  console.log('\n5️⃣ FORCE RELOAD DATA');
  
  // Dispatch custom event untuk force reload
  const reloadEvent = new CustomEvent('forceReloadReports', {
    detail: { userId: WAWAN_USER_ID }
  });
  window.dispatchEvent(reloadEvent);
  console.log('📡 Event force reload dispatched');
  
  // Clear any cached data
  localStorage.removeItem('reports_activities_cache');
  console.log('🗑️ Cache cleared');
  
  console.log('\n✅ DIAGNOSA SELESAI');
  console.log('📋 LANGKAH SELANJUTNYA:');
  console.log('1. Lihat hasil test API di atas');
  console.log('2. Jika API mengembalikan data, masalah di frontend');
  console.log('3. Jika API tidak mengembalikan data, masalah di backend/database');
  console.log('4. Refresh halaman untuk melihat apakah force reload berhasil');
}

// Jalankan diagnosa
diagnosaMendalam();