// NUCLEAR FIX REPORTS - Copy paste ke browser console di halaman Laporan

console.log('💥 NUCLEAR FIX REPORTS - Tugas Tambahan dengan Foto');

// 1. FORCE USER ID
const userData = localStorage.getItem('auth_user');
if (userData) {
  const user = JSON.parse(userData);
  user.id = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';
  user.username = 'wawan';
  localStorage.setItem('auth_user', JSON.stringify(user));
  console.log('✅ User ID forced for reports');
}

// 2. CLEAR REPORTS CACHE
localStorage.removeItem('reports_activities_cache');
console.log('✅ Reports cache cleared');

// 3. TEST API ENDPOINTS
const testAPIs = async () => {
  const userId = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';
  
  console.log('📡 Testing API endpoints...');
  
  // Test activities API
  try {
    const response = await fetch(`/api/activities?user_id=${userId}`);
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Activities API: ${data.length} items`);
      if (data.length > 0) {
        console.log('📊 Sample activity:', {
          title: data[0].title,
          photo: data[0].photo ? 'EXISTS' : 'MISSING',
          photo1: data[0].photo1 ? 'EXISTS' : 'MISSING'
        });
      }
    }
  } catch (error) {
    console.log('❌ Activities API failed:', error);
  }
  
  // Test tasks API
  try {
    const response = await fetch(`/api/tasks-daily?user_id=${userId}`);
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Tasks API: ${data.length} items`);
    }
  } catch (error) {
    console.log('❌ Tasks API failed:', error);
  }
  
  // Test supervisions API
  try {
    const response = await fetch(`/api/supervisions?user_id=${userId}`);
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Supervisions API: ${data.length} items`);
    }
  } catch (error) {
    console.log('❌ Supervisions API failed:', error);
  }
};

// 4. RUN TESTS AND REFRESH
testAPIs().then(() => {
  console.log('🔄 Refreshing page in 2 seconds...');
  setTimeout(() => {
    window.location.reload();
  }, 2000);
});

console.log('🎯 Fix applied - page will refresh automatically');