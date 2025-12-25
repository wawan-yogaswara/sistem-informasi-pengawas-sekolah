// CONSOLE TEST LANGSUNG - Copy paste ke browser console
// Test untuk masalah field mapping dan React Query

console.log('🔧 CONSOLE TEST LANGSUNG - Field Mapping Issue');

// 1. TEST API ENDPOINT LANGSUNG
const testAPI = async () => {
  console.log('📡 Testing API endpoint...');
  
  const userId = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';
  const response = await fetch(`/api/activities?user_id=${userId}`);
  
  if (!response.ok) {
    console.error('❌ API failed:', response.status);
    return;
  }
  
  const data = await response.json();
  console.log(`✅ API returned ${data.length} activities`);
  
  if (data.length > 0) {
    const sample = data[0];
    console.log('📊 Sample data structure:', {
      id: sample.id,
      title: sample.title,
      photo: sample.photo ? 'EXISTS' : 'MISSING',
      photo1: sample.photo1 ? 'EXISTS' : 'MISSING', 
      photo2: sample.photo2 ? 'EXISTS' : 'MISSING',
      user_id: sample.user_id
    });
    
    // Check field mapping issue
    if (sample.photo1 && !sample.photo) {
      console.log('⚠️ FIELD MAPPING ISSUE DETECTED: API has photo1 but frontend expects photo');
    } else if (sample.photo) {
      console.log('✅ Field mapping OK: photo field exists');
    }
  }
  
  return data;
};

// 2. FIX USER ID
const fixUserId = () => {
  console.log('👤 Fixing user ID...');
  
  const userData = localStorage.getItem('auth_user');
  if (userData) {
    const user = JSON.parse(userData);
    if (user.username === 'wawan') {
      user.id = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';
      localStorage.setItem('auth_user', JSON.stringify(user));
      console.log('✅ User ID fixed for Wawan');
    }
  }
};

// 3. CLEAR CACHE
const clearCache = () => {
  console.log('🧹 Clearing cache...');
  
  localStorage.removeItem('additional_tasks_cache');
  localStorage.removeItem('reports_activities_cache');
  
  if (window.queryClient) {
    window.queryClient.clear();
    console.log('✅ React Query cache cleared');
  }
};

// 4. FORCE REFRESH REACT QUERY
const forceRefresh = async () => {
  console.log('🔄 Force refreshing React Query...');
  
  if (window.queryClient) {
    await window.queryClient.invalidateQueries({ queryKey: ['additional-tasks'] });
    await window.queryClient.refetchQueries({ queryKey: ['additional-tasks'] });
    console.log('✅ React Query refreshed');
  }
};

// 5. CHECK DOM ELEMENTS
const checkDOM = () => {
  console.log('🎯 Checking DOM elements...');
  
  const taskCards = document.querySelectorAll('.hover\\:shadow-md, [data-testid="task-card"]');
  console.log(`📋 Found ${taskCards.length} task cards in DOM`);
  
  if (taskCards.length === 0) {
    console.log('❌ No task cards found - React component not rendering data');
  } else {
    console.log('✅ Task cards found in DOM');
  }
  
  return taskCards.length;
};

// 6. COMPREHENSIVE FIX
const comprehensiveFix = async () => {
  console.log('🚀 Running comprehensive fix...');
  
  // Step 1: Fix user ID
  fixUserId();
  
  // Step 2: Clear cache
  clearCache();
  
  // Step 3: Test API
  const data = await testAPI();
  
  // Step 4: Force refresh
  await forceRefresh();
  
  // Step 5: Check DOM after 2 seconds
  setTimeout(() => {
    const cardCount = checkDOM();
    
    if (data && data.length > 0 && cardCount === 0) {
      console.log('❌ DATA EXISTS BUT NOT RENDERED - React component issue');
      console.log('🔄 Try refreshing the page manually');
    } else if (cardCount > 0) {
      console.log('✅ SUCCESS - Data is now visible');
    }
  }, 2000);
  
  return data;
};

// AUTO RUN
console.log('🚀 Starting comprehensive fix...');
comprehensiveFix();

// MANUAL FUNCTIONS
window.testAPI = testAPI;
window.fixUserId = fixUserId;
window.clearCache = clearCache;
window.forceRefresh = forceRefresh;
window.checkDOM = checkDOM;
window.comprehensiveFix = comprehensiveFix;

console.log('📋 Manual functions available:');
console.log('  - testAPI() - Test API endpoint');
console.log('  - fixUserId() - Fix user ID');
console.log('  - clearCache() - Clear all cache');
console.log('  - forceRefresh() - Force React Query refresh');
console.log('  - checkDOM() - Check DOM elements');
console.log('  - comprehensiveFix() - Run all fixes');