// COMPREHENSIVE ADDITIONAL TASKS FIX
// Copy paste this entire script into browser console on Additional Tasks page

console.log('🚀 COMPREHENSIVE ADDITIONAL TASKS FIX - Starting...');

// 1. VERIFY USER ID AND FIX IF NEEDED
const fixUserIdIssue = () => {
  console.log('👤 Step 1: Fixing User ID...');
  
  const userData = localStorage.getItem('auth_user');
  if (!userData) {
    console.error('❌ No auth_user found in localStorage');
    return false;
  }
  
  const user = JSON.parse(userData);
  console.log('Current user data:', user);
  
  // Fix Wawan user ID
  if (user.username === 'wawan' || !user.id || user.id.length < 20) {
    user.id = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';
    localStorage.setItem('auth_user', JSON.stringify(user));
    console.log('✅ User ID fixed for Wawan:', user.id);
  }
  
  return user.id;
};

// 2. TEST API ENDPOINT DIRECTLY
const testAPIEndpoint = async (userId) => {
  console.log('📡 Step 2: Testing API endpoint...');
  
  try {
    const response = await fetch(`/api/activities?user_id=${encodeURIComponent(userId)}`);
    console.log('API Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', response.status, errorText);
      return null;
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
        user_id: sample.user_id,
        created_at: sample.created_at
      });
      
      // Check field mapping
      if (sample.photo1 && !sample.photo) {
        console.log('⚠️ FIELD MAPPING ISSUE: API has photo1 but frontend expects photo');
      } else if (sample.photo) {
        console.log('✅ Field mapping OK: photo field exists');
      }
    } else {
      console.log('⚠️ No data returned from API');
    }
    
    return data;
  } catch (error) {
    console.error('❌ API Test failed:', error);
    return null;
  }
};

// 3. CLEAR ALL CACHES
const clearAllCaches = () => {
  console.log('🧹 Step 3: Clearing all caches...');
  
  // Clear localStorage caches
  const cacheKeys = [
    'additional_tasks_cache',
    'reports_activities_cache',
    'activities_cache'
  ];
  
  cacheKeys.forEach(key => {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
      console.log(`✅ Cleared ${key}`);
    }
  });
  
  // Clear React Query cache if available
  if (window.queryClient) {
    window.queryClient.clear();
    console.log('✅ React Query cache cleared');
  }
  
  // Clear browser cache (if possible)
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        caches.delete(name);
      });
      console.log('✅ Browser caches cleared');
    });
  }
};

// 4. FORCE REACT QUERY REFRESH
const forceReactQueryRefresh = async () => {
  console.log('🔄 Step 4: Force refreshing React Query...');
  
  if (!window.queryClient) {
    console.log('⚠️ React Query client not found');
    return;
  }
  
  try {
    // Invalidate all queries
    await window.queryClient.invalidateQueries();
    
    // Specifically target additional-tasks query
    await window.queryClient.invalidateQueries({ queryKey: ['additional-tasks'] });
    await window.queryClient.refetchQueries({ queryKey: ['additional-tasks'] });
    
    // Force clear the specific query data
    window.queryClient.setQueryData(['additional-tasks'], null);
    
    console.log('✅ React Query refreshed');
  } catch (error) {
    console.error('❌ React Query refresh failed:', error);
  }
};

// 5. CHECK DOM ELEMENTS
const checkDOMElements = () => {
  console.log('🎯 Step 5: Checking DOM elements...');
  
  // Check for task cards
  const taskCards = document.querySelectorAll('[class*="hover:shadow-md"], [class*="Card"], .card');
  console.log(`📋 Found ${taskCards.length} potential task cards`);
  
  // Check for loading state
  const loadingElements = document.querySelectorAll('[class*="loading"], [class*="spinner"]');
  console.log(`⏳ Found ${loadingElements.length} loading elements`);
  
  // Check for empty state
  const emptyStateElements = document.querySelectorAll('[class*="empty"], [class*="no-data"]');
  console.log(`📭 Found ${emptyStateElements.length} empty state elements`);
  
  // Check for error messages
  const errorElements = document.querySelectorAll('[class*="error"], [class*="alert"]');
  console.log(`❌ Found ${errorElements.length} error elements`);
  
  return {
    taskCards: taskCards.length,
    loading: loadingElements.length,
    empty: emptyStateElements.length,
    errors: errorElements.length
  };
};

// 6. INJECT DATA DIRECTLY (EMERGENCY FIX)
const injectDataDirectly = (apiData) => {
  console.log('💉 Step 6: Injecting data directly...');
  
  if (!apiData || apiData.length === 0) {
    console.log('⚠️ No data to inject');
    return;
  }
  
  // Try to find React Query client and inject data
  if (window.queryClient) {
    window.queryClient.setQueryData(['additional-tasks'], apiData);
    console.log('✅ Data injected into React Query');
  }
  
  // Dispatch custom event to force re-render
  const event = new CustomEvent('forceAdditionalTasksUpdate', {
    detail: { tasks: apiData }
  });
  window.dispatchEvent(event);
  console.log('✅ Custom event dispatched');
};

// 7. FORCE PAGE REFRESH IF NEEDED
const forcePageRefresh = () => {
  console.log('🔄 Step 7: Checking if page refresh is needed...');
  
  setTimeout(() => {
    const domCheck = checkDOMElements();
    
    if (domCheck.taskCards === 0 && domCheck.loading === 0) {
      console.log('❌ No task cards found and not loading - page refresh may be needed');
      console.log('🔄 Refreshing page in 3 seconds...');
      
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } else {
      console.log('✅ Task cards found or page is loading - no refresh needed');
    }
  }, 2000);
};

// MAIN EXECUTION FUNCTION
const runComprehensiveFix = async () => {
  console.log('🚀 Running comprehensive fix...');
  
  try {
    // Step 1: Fix user ID
    const userId = fixUserIdIssue();
    if (!userId) {
      console.error('❌ Failed to fix user ID');
      return;
    }
    
    // Step 2: Test API
    const apiData = await testAPIEndpoint(userId);
    
    // Step 3: Clear caches
    clearAllCaches();
    
    // Step 4: Force React Query refresh
    await forceReactQueryRefresh();
    
    // Step 5: Check DOM
    const initialDOMCheck = checkDOMElements();
    console.log('Initial DOM check:', initialDOMCheck);
    
    // Step 6: Inject data if needed
    if (apiData && apiData.length > 0) {
      injectDataDirectly(apiData);
    }
    
    // Step 7: Force refresh if needed
    forcePageRefresh();
    
    // Final status
    console.log('🎉 Comprehensive fix completed!');
    console.log('📊 Summary:', {
      userIdFixed: !!userId,
      apiDataFound: apiData ? apiData.length : 0,
      cachesCleared: true,
      reactQueryRefreshed: !!window.queryClient
    });
    
    return {
      success: true,
      userId,
      apiData,
      domCheck: initialDOMCheck
    };
    
  } catch (error) {
    console.error('❌ Comprehensive fix failed:', error);
    return { success: false, error };
  }
};

// AUTO-RUN THE FIX
console.log('🚀 Starting comprehensive fix in 1 second...');
setTimeout(runComprehensiveFix, 1000);

// MAKE FUNCTIONS AVAILABLE FOR MANUAL USE
window.fixUserIdIssue = fixUserIdIssue;
window.testAPIEndpoint = testAPIEndpoint;
window.clearAllCaches = clearAllCaches;
window.forceReactQueryRefresh = forceReactQueryRefresh;
window.checkDOMElements = checkDOMElements;
window.injectDataDirectly = injectDataDirectly;
window.runComprehensiveFix = runComprehensiveFix;

console.log('📋 Manual functions available:');
console.log('  - fixUserIdIssue() - Fix user ID');
console.log('  - testAPIEndpoint(userId) - Test API');
console.log('  - clearAllCaches() - Clear all caches');
console.log('  - forceReactQueryRefresh() - Force React Query refresh');
console.log('  - checkDOMElements() - Check DOM elements');
console.log('  - injectDataDirectly(data) - Inject data directly');
console.log('  - runComprehensiveFix() - Run all fixes');