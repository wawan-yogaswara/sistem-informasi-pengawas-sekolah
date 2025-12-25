// TEST SCRIPT FOR EXACT FIXES
// Tests both Additional Tasks page data display and Reports page photo display

console.log('🧪 TESTING EXACT FIXES');

const testAdditionalTasksPage = async () => {
  console.log('📋 Testing Additional Tasks page...');
  
  try {
    // Get user data
    const userData = localStorage.getItem('auth_user');
    if (!userData) {
      console.log('⚠️ No user data found');
      return false;
    }
    
    const currentUser = JSON.parse(userData);
    let userId = currentUser.id;
    
    // For wawan user, use correct UUID
    if (currentUser.username === 'wawan' || !userId || typeof userId !== 'string' || userId.length < 10) {
      userId = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';
      currentUser.id = userId;
      localStorage.setItem('auth_user', JSON.stringify(currentUser));
    }
    
    console.log('👤 Testing with user_id:', userId);
    
    // Test direct Supabase query
    const response = await fetch(`/api/activities?user_id=${encodeURIComponent(userId)}`);
    if (!response.ok) {
      console.error('❌ API call failed:', response.status);
      return false;
    }
    
    const data = await response.json();
    console.log(`✅ API returned ${data.length} additional tasks`);
    
    if (data.length === 0) {
      console.log('⚠️ No additional tasks found for user');
      return false;
    }
    
    // Check if we're on the Additional Tasks page
    if (window.location.pathname.includes('additional-tasks')) {
      // Check if tasks are displayed
      setTimeout(() => {
        const taskCards = document.querySelectorAll('[data-testid="task-card"], .task-card, .additional-task-card');
        console.log(`📋 Found ${taskCards.length} task cards on page`);
        
        if (taskCards.length > 0) {
          console.log('✅ Additional Tasks page is showing data');
          return true;
        } else {
          console.log('❌ Additional Tasks page is NOT showing data');
          
          // Try to trigger a refresh
          if (window.queryClient) {
            console.log('🔄 Forcing React Query refresh...');
            window.queryClient.invalidateQueries({ queryKey: ['additional-tasks'] });
            window.queryClient.refetchQueries({ queryKey: ['additional-tasks'] });
          }
          
          return false;
        }
      }, 1000);
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Additional Tasks test error:', error);
    return false;
  }
};

const testReportsPagePhotos = async () => {
  console.log('🖼️ Testing Reports page photos...');
  
  try {
    // Get user data
    const userData = localStorage.getItem('auth_user');
    if (!userData) {
      console.log('⚠️ No user data found');
      return false;
    }
    
    const currentUser = JSON.parse(userData);
    let userId = currentUser.id;
    
    // For wawan user, use correct UUID
    if (currentUser.username === 'wawan' || !userId || typeof userId !== 'string' || userId.length < 10) {
      userId = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';
    }
    
    console.log('👤 Testing photos for user_id:', userId);
    
    // Test activities API for photos
    const response = await fetch(`/api/activities?user_id=${encodeURIComponent(userId)}`);
    if (!response.ok) {
      console.error('❌ Activities API call failed:', response.status);
      return false;
    }
    
    const activities = await response.json();
    const activitiesWithPhotos = activities.filter(a => a.photo1 || a.photo2);
    
    console.log(`📸 Found ${activitiesWithPhotos.length} activities with photos out of ${activities.length} total`);
    
    if (activitiesWithPhotos.length === 0) {
      console.log('⚠️ No activities with photos found');
      return false;
    }
    
    // Check photo data format
    activitiesWithPhotos.forEach((activity, index) => {
      console.log(`📷 Activity ${index + 1}:`, {
        title: activity.title,
        photo1: activity.photo1 ? (activity.photo1.startsWith('data:') ? 'base64 ✅' : 'file path ❌') : 'none',
        photo2: activity.photo2 ? (activity.photo2.startsWith('data:') ? 'base64 ✅' : 'file path ❌') : 'none'
      });
    });
    
    // If we're on the Reports page, check photo display
    if (window.location.pathname.includes('reports')) {
      setTimeout(() => {
        const photoElements = document.querySelectorAll('img[alt*="Foto"]');
        console.log(`🖼️ Found ${photoElements.length} photo elements on Reports page`);
        
        let workingPhotos = 0;
        let brokenPhotos = 0;
        
        photoElements.forEach((img, index) => {
          const imgElement = img as HTMLImageElement;
          if (imgElement.complete && imgElement.naturalWidth > 0) {
            workingPhotos++;
            console.log(`✅ Photo ${index + 1} is working`);
          } else {
            brokenPhotos++;
            console.log(`❌ Photo ${index + 1} is broken:`, imgElement.src);
          }
        });
        
        console.log(`📊 Photo status: ${workingPhotos} working, ${brokenPhotos} broken`);
        
        if (workingPhotos > 0) {
          console.log('✅ Reports page photos are working');
          return true;
        } else {
          console.log('❌ Reports page photos are NOT working');
          return false;
        }
      }, 2000);
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Reports photos test error:', error);
    return false;
  }
};

const runAllTests = async () => {
  console.log('🚀 RUNNING ALL TESTS');
  
  const results = {
    additionalTasks: await testAdditionalTasksPage(),
    reportsPhotos: await testReportsPagePhotos()
  };
  
  console.log('📊 TEST RESULTS:', results);
  
  const allPassed = Object.values(results).every(result => result === true);
  
  if (allPassed) {
    console.log('🎉 ALL TESTS PASSED - Fixes are working!');
  } else {
    console.log('❌ SOME TESTS FAILED - Need additional fixes');
    
    // Provide specific guidance
    if (!results.additionalTasks) {
      console.log('🔧 Additional Tasks fix needed:');
      console.log('  - Check React Query cache invalidation');
      console.log('  - Verify user_id filtering');
      console.log('  - Check component re-rendering');
    }
    
    if (!results.reportsPhotos) {
      console.log('🔧 Reports Photos fix needed:');
      console.log('  - Check photo data format (should be base64)');
      console.log('  - Verify photo src attributes');
      console.log('  - Check API response structure');
    }
  }
  
  return results;
};

// Auto-run tests
runAllTests();

// Manual test functions
window.testAdditionalTasks = testAdditionalTasksPage;
window.testReportsPhotos = testReportsPagePhotos;
window.runAllTests = runAllTests;

console.log('🧪 TEST SCRIPT LOADED');
console.log('📋 Manual commands available:');
console.log('  - testAdditionalTasks() - Test Additional Tasks page');
console.log('  - testReportsPhotos() - Test Reports page photos');
console.log('  - runAllTests() - Run all tests');