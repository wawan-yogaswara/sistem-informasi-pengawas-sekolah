// Script untuk test endpoint tanpa autentikasi
// Jalankan di console browser

console.log('🧪 Testing endpoints tanpa autentikasi...');

async function testEndpoints() {
  const endpoints = [
    '/api/tasks-daily',
    '/api/supervisions', 
    '/api/activities',
    '/api/schools',
    '/api/health',
    '/api/test'
  ];
  
  console.log('🔍 Testing endpoints...');
  
  for (const endpoint of endpoints) {
    try {
      console.log(`\n📡 Testing ${endpoint}...`);
      const response = await fetch(endpoint);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ ${endpoint}: ${response.status} - ${Array.isArray(data) ? data.length + ' items' : 'OK'}`);
        
        // Log sample data for arrays
        if (Array.isArray(data) && data.length > 0) {
          console.log(`📋 Sample data:`, data[0]);
          
          // Check for photos
          const withPhotos = data.filter(item => item.photo1 || item.photo2);
          console.log(`📸 Items with photos: ${withPhotos.length}`);
          
          if (withPhotos.length > 0) {
            console.log(`📷 Sample photo data:`, {
              id: withPhotos[0].id,
              hasPhoto1: !!withPhotos[0].photo1,
              hasPhoto2: !!withPhotos[0].photo2,
              photo1Type: withPhotos[0].photo1 ? (withPhotos[0].photo1.startsWith('data:') ? 'base64' : 'path') : null,
              photo2Type: withPhotos[0].photo2 ? (withPhotos[0].photo2.startsWith('data:') ? 'base64' : 'path') : null
            });
          }
        }
      } else {
        console.log(`❌ ${endpoint}: ${response.status} - ${response.statusText}`);
        const errorText = await response.text();
        console.log(`Error details:`, errorText);
      }
    } catch (error) {
      console.error(`❌ ${endpoint}: Network error -`, error);
    }
  }
  
  console.log('\n🎯 Testing specific user data...');
  try {
    const response = await fetch('/api/dev/user/wawan');
    if (response.ok) {
      const data = await response.json();
      console.log('✅ User wawan data:', {
        user: data.user?.username,
        tasks: data.tasks?.length || 0,
        supervisions: data.supervisions?.length || 0,
        additionalTasks: data.additionalTasks?.length || 0,
        schools: data.schools?.length || 0
      });
      
      // Check photos in user data
      const allActivities = [
        ...(data.tasks || []),
        ...(data.supervisions || []),
        ...(data.additionalTasks || [])
      ];
      
      const withPhotos = allActivities.filter(item => item.photo1 || item.photo2);
      console.log(`📸 Total activities with photos: ${withPhotos.length}`);
      
    } else {
      console.log(`❌ User wawan: ${response.status}`);
    }
  } catch (error) {
    console.error('❌ User wawan: Error -', error);
  }
}

// Run test
testEndpoints();

// Add helper function to window
window.testEndpoints = testEndpoints;
console.log('💡 Helper function available: testEndpoints()');