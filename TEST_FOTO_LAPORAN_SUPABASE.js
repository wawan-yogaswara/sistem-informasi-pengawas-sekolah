// Script untuk test foto di halaman laporan dengan data dari Supabase
// Jalankan di console browser di halaman laporan

console.log('🧪 Testing foto laporan dengan data Supabase...');

// Test koneksi Supabase
async function testSupabaseData() {
  try {
    console.log('🔍 Fetching data from Supabase...');
    
    // Get current user
    const userData = localStorage.getItem('auth_user');
    if (!userData) {
      console.log('❌ No user data found');
      return;
    }
    
    const currentUser = JSON.parse(userData);
    let userId = currentUser.id;
    if (currentUser.username === 'wawan') {
      userId = '1762696525337';
    }
    
    console.log('👤 Testing for user:', currentUser.username, 'ID:', userId);
    
    // Test each endpoint
    const endpoints = [
      { name: 'Tasks', url: '/api/tasks-daily' },
      { name: 'Supervisions', url: '/api/supervisions' },
      { name: 'Activities', url: '/api/activities' },
      { name: 'Schools', url: '/api/schools' }
    ];
    
    let totalActivitiesWithPhotos = 0;
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint.url);
        if (response.ok) {
          const data = await response.json();
          const userData = data.filter(item => 
            item.user_id === userId || item.userId === userId
          );
          
          const withPhotos = userData.filter(item => item.photo1 || item.photo2);
          totalActivitiesWithPhotos += withPhotos.length;
          
          console.log(`✅ ${endpoint.name}:`, {
            total: data.length,
            userSpecific: userData.length,
            withPhotos: withPhotos.length
          });
          
          // Log sample photos
          if (withPhotos.length > 0) {
            console.log(`📸 Sample photos from ${endpoint.name}:`, 
              withPhotos.slice(0, 2).map(item => ({
                id: item.id,
                photo1: item.photo1 ? (item.photo1.startsWith('data:') ? 'base64' : item.photo1) : null,
                photo2: item.photo2 ? (item.photo2.startsWith('data:') ? 'base64' : item.photo2) : null
              }))
            );
          }
        } else {
          console.log(`❌ ${endpoint.name}: HTTP ${response.status}`);
        }
      } catch (error) {
        console.error(`❌ ${endpoint.name} error:`, error);
      }
    }
    
    console.log(`📊 Total activities with photos: ${totalActivitiesWithPhotos}`);
    
    // Test foto loading
    if (totalActivitiesWithPhotos > 0) {
      console.log('🖼️ Testing foto loading...');
      testPhotoLoading();
    } else {
      console.log('⚠️ No activities with photos found');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Test foto loading
function testPhotoLoading() {
  const images = document.querySelectorAll('img[alt*="Foto"]');
  console.log(`🖼️ Found ${images.length} foto elements on page`);
  
  images.forEach((img, index) => {
    const imgElement = img as HTMLImageElement;
    console.log(`📸 Foto ${index + 1}:`, {
      src: imgElement.src,
      alt: imgElement.alt,
      loaded: imgElement.complete && imgElement.naturalHeight !== 0,
      naturalWidth: imgElement.naturalWidth,
      naturalHeight: imgElement.naturalHeight
    });
    
    // Add load event listener
    imgElement.addEventListener('load', () => {
      console.log(`✅ Foto ${index + 1} loaded successfully`);
    });
    
    imgElement.addEventListener('error', () => {
      console.log(`❌ Foto ${index + 1} failed to load:`, imgElement.src);
    });
  });
}

// Force refresh data
function forceRefreshData() {
  console.log('🔄 Forcing data refresh...');
  
  // Clear any cached data
  localStorage.removeItem('local-database');
  localStorage.setItem('data_source', 'supabase');
  localStorage.setItem('force_supabase_only', 'true');
  
  // Refresh page
  setTimeout(() => {
    location.reload();
  }, 1000);
}

// Run tests
console.log('🚀 Starting Supabase foto test...');
testSupabaseData();

// Add helper functions to window for manual testing
window.testSupabaseData = testSupabaseData;
window.testPhotoLoading = testPhotoLoading;
window.forceRefreshData = forceRefreshData;

console.log('💡 Helper functions available:');
console.log('- testSupabaseData() - Test data from Supabase');
console.log('- testPhotoLoading() - Test foto loading');
console.log('- forceRefreshData() - Force refresh with Supabase data');