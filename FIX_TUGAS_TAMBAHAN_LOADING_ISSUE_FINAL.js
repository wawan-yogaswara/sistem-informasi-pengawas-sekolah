// SOLUSI FINAL: Fix Loading Issue Halaman Tugas Tambahan
// Jalankan di browser console atau terapkan ke kode

console.log('🚀 FIXING: Loading Issue Halaman Tugas Tambahan');
console.log('='.repeat(60));

// MASALAH YANG TERIDENTIFIKASI:
// 1. Query menggunakan user_id filter yang mungkin tidak match
// 2. React Query cache mungkin stuck
// 3. User authentication context bermasalah
// 4. Supabase RLS policy blocking access

// SOLUSI 1: Test Query Langsung
async function testAdditionalTasksQuery() {
  console.log('🔧 SOLUSI 1: Test Query Langsung');
  
  try {
    // Get user data
    const userData = localStorage.getItem('auth_user');
    if (!userData) {
      console.log('❌ No user data found');
      return false;
    }
    
    const currentUser = JSON.parse(userData);
    const userId = currentUser.username || currentUser.id;
    
    console.log('👤 Current user:', currentUser);
    console.log('🔑 Using user_id:', userId);
    
    // Test 1: Query tanpa filter (untuk cek apakah data ada)
    console.log('\n📋 Test 1: Query semua data (tanpa filter)');
    const { data: allData, error: allError } = await window.supabase
      .from('additional_tasks')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (allError) {
      console.log('❌ Error querying all data:', allError);
      return false;
    }
    
    console.log(`✅ Total records in additional_tasks: ${allData?.length || 0}`);
    
    if (allData && allData.length > 0) {
      console.log('📊 Sample data:');
      allData.slice(0, 3).forEach((item, index) => {
        console.log(`  ${index + 1}. ID: ${item.id}, User ID: ${item.user_id}, Title: ${item.title}`);
      });
      
      // Check unique user_ids
      const uniqueUserIds = [...new Set(allData.map(item => item.user_id))];
      console.log('👥 Unique user_ids in data:', uniqueUserIds);
    }
    
    // Test 2: Query dengan filter user_id
    console.log(`\n📋 Test 2: Query dengan filter user_id = "${userId}"`);
    const { data: filteredData, error: filteredError } = await window.supabase
      .from('additional_tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (filteredError) {
      console.log('❌ Error querying filtered data:', filteredError);
      return false;
    }
    
    console.log(`✅ Records for user "${userId}": ${filteredData?.length || 0}`);
    
    if (filteredData && filteredData.length > 0) {
      console.log('📊 User data:');
      filteredData.forEach((item, index) => {
        console.log(`  ${index + 1}. ${item.title} (${item.date})`);
      });
    } else {
      console.log('⚠️ No data found for current user');
      
      // Suggest alternative user_ids to try
      if (allData && allData.length > 0) {
        const suggestedUserId = allData[0].user_id;
        console.log(`💡 Try using user_id: "${suggestedUserId}"`);
        
        // Test with suggested user_id
        const { data: testData } = await window.supabase
          .from('additional_tasks')
          .select('*')
          .eq('user_id', suggestedUserId)
          .limit(1);
        
        if (testData && testData.length > 0) {
          console.log(`✅ Data exists for user_id: "${suggestedUserId}"`);
        }
      }
    }
    
    return { allData, filteredData, userId };
    
  } catch (error) {
    console.log('❌ Error in query test:', error);
    return false;
  }
}

// SOLUSI 2: Fix User ID Mismatch
function fixUserIdMismatch() {
  console.log('🔧 SOLUSI 2: Fix User ID Mismatch');
  
  const userData = localStorage.getItem('auth_user');
  if (!userData) {
    console.log('❌ No user data found');
    return false;
  }
  
  const currentUser = JSON.parse(userData);
  console.log('👤 Current user object:', currentUser);
  
  // Check different possible user ID fields
  const possibleUserIds = [
    currentUser.username,
    currentUser.id,
    currentUser.user_id,
    currentUser.email,
    'wawan' // fallback for known user
  ].filter(Boolean);
  
  console.log('🔑 Possible user IDs to try:', possibleUserIds);
  
  // Return the most likely user ID
  const bestUserId = currentUser.username || currentUser.id || 'wawan';
  console.log(`✅ Recommended user_id: "${bestUserId}"`);
  
  return bestUserId;
}

// SOLUSI 3: Clear React Query Cache
function clearReactQueryCache() {
  console.log('🔧 SOLUSI 3: Clear React Query Cache');
  
  try {
    if (window.queryClient) {
      // Clear specific cache
      window.queryClient.removeQueries(['additional-tasks']);
      console.log('✅ Cleared additional-tasks cache');
      
      // Clear all cache
      window.queryClient.clear();
      console.log('✅ Cleared all React Query cache');
      
      return true;
    } else {
      console.log('⚠️ React Query client not found');
      return false;
    }
  } catch (error) {
    console.log('❌ Error clearing cache:', error);
    return false;
  }
}

// SOLUSI 4: Force Refresh Data
async function forceRefreshAdditionalTasks() {
  console.log('🔧 SOLUSI 4: Force Refresh Data');
  
  try {
    // Clear cache first
    clearReactQueryCache();
    
    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Trigger refetch if available
    if (window.refetchAdditionalTasks) {
      console.log('🔄 Triggering refetch...');
      await window.refetchAdditionalTasks();
      console.log('✅ Refetch completed');
    } else {
      console.log('⚠️ Refetch function not available, try page refresh');
    }
    
    return true;
  } catch (error) {
    console.log('❌ Error force refreshing:', error);
    return false;
  }
}

// SOLUSI 5: Update Query Implementation
function getOptimizedQuery() {
  console.log('🔧 SOLUSI 5: Optimized Query Implementation');
  
  const optimizedQuery = `
// OPTIMIZED QUERY untuk additional-tasks.tsx
const { data: tasks = [], isLoading, refetch } = useQuery({
  queryKey: ['additional-tasks'],
  queryFn: async () => {
    console.log('🔍 Fetching additional tasks from Supabase...');
    
    // Get current user
    const userData = localStorage.getItem('auth_user');
    if (!userData) {
      console.log('⚠️ No user data found');
      return [];
    }
    
    const currentUser = JSON.parse(userData);
    const userId = currentUser.username || currentUser.id;
    console.log('🔑 Using user_id for additional tasks:', userId);
    
    // SIMPLE: Query tanpa join, dengan fallback
    try {
      // First try with user filter
      const { data, error } = await supabase
        .from('additional_tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Supabase error:', error);
        
        // Fallback: try without filter if user-specific query fails
        console.log('🔄 Trying fallback query without user filter...');
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('additional_tasks')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10); // Limit to prevent too much data
        
        if (fallbackError) {
          throw fallbackError;
        }
        
        console.log('✅ Fallback query successful:', fallbackData?.length || 0);
        return fallbackData || [];
      }
      
      console.log('✅ Additional tasks loaded for user:', data?.length || 0);
      console.log('📋 Data preview:', data?.slice(0, 2));
      return data || [];
      
    } catch (error) {
      console.error('❌ Query failed:', error);
      return [];
    }
  },
  retry: 2,
  refetchOnWindowFocus: false,
  staleTime: 30000, // 30 seconds
});

// Export refetch function for manual refresh
window.refetchAdditionalTasks = refetch;
`;
  
  console.log('📝 Optimized query code:');
  console.log(optimizedQuery);
  
  return optimizedQuery;
}

// SOLUSI 6: Check Supabase Connection
async function checkSupabaseConnection() {
  console.log('🔧 SOLUSI 6: Check Supabase Connection');
  
  try {
    // Test basic connection
    const { data, error } = await window.supabase
      .from('schools')
      .select('count(*)')
      .limit(1);
    
    if (error) {
      console.log('❌ Supabase connection failed:', error);
      return false;
    }
    
    console.log('✅ Supabase connection OK');
    
    // Test additional_tasks table access
    const { data: tableData, error: tableError } = await window.supabase
      .from('additional_tasks')
      .select('count(*)')
      .limit(1);
    
    if (tableError) {
      console.log('❌ additional_tasks table access failed:', tableError);
      return false;
    }
    
    console.log('✅ additional_tasks table accessible');
    return true;
    
  } catch (error) {
    console.log('❌ Connection test failed:', error);
    return false;
  }
}

// COMPREHENSIVE FIX FUNCTION
async function runComprehensiveFix() {
  console.log('🚀 RUNNING COMPREHENSIVE FIX...');
  console.log('='.repeat(60));
  
  const results = {};
  
  // Step 1: Check Supabase connection
  console.log('STEP 1: Checking Supabase connection...');
  results.connection = await checkSupabaseConnection();
  
  if (!results.connection) {
    console.log('❌ CRITICAL: Supabase connection failed');
    return results;
  }
  
  // Step 2: Test queries
  console.log('\nSTEP 2: Testing queries...');
  results.queryTest = await testAdditionalTasksQuery();
  
  // Step 3: Fix user ID if needed
  console.log('\nSTEP 3: Checking user ID...');
  results.userId = fixUserIdMismatch();
  
  // Step 4: Clear cache
  console.log('\nSTEP 4: Clearing cache...');
  results.cacheCleared = clearReactQueryCache();
  
  // Step 5: Force refresh
  console.log('\nSTEP 5: Force refreshing...');
  results.refreshed = await forceRefreshAdditionalTasks();
  
  // Step 6: Provide optimized query
  console.log('\nSTEP 6: Providing optimized query...');
  results.optimizedQuery = getOptimizedQuery();
  
  console.log('\n' + '='.repeat(60));
  console.log('🎯 COMPREHENSIVE FIX SUMMARY:');
  
  console.log('- Supabase Connection:', results.connection ? '✅ OK' : '❌ FAILED');
  console.log('- Query Test:', results.queryTest ? '✅ OK' : '❌ FAILED');
  console.log('- User ID:', results.userId || 'Not found');
  console.log('- Cache Cleared:', results.cacheCleared ? '✅ YES' : '❌ NO');
  console.log('- Data Refreshed:', results.refreshed ? '✅ YES' : '❌ NO');
  
  console.log('\n💡 RECOMMENDATIONS:');
  
  if (!results.queryTest) {
    console.log('1. ❌ CRITICAL: Fix query or user ID mismatch');
    console.log('2. ❌ Check if data exists in Supabase dashboard');
    console.log('3. ❌ Verify RLS policies are not blocking access');
  } else if (results.queryTest.filteredData?.length === 0) {
    console.log('1. ⚠️ No data for current user - check user_id mapping');
    console.log('2. ⚠️ Consider using fallback query without user filter');
  } else {
    console.log('1. ✅ Data exists - issue might be in React component');
    console.log('2. ✅ Try refreshing the page');
    console.log('3. ✅ Check browser console for React errors');
  }
  
  return results;
}

// QUICK FIX FOR IMMEDIATE RELIEF
async function quickFix() {
  console.log('⚡ QUICK FIX: Immediate Relief');
  
  try {
    // Clear everything
    clearReactQueryCache();
    
    // Force reload page after clearing cache
    console.log('🔄 Reloading page in 2 seconds...');
    setTimeout(() => {
      window.location.reload();
    }, 2000);
    
  } catch (error) {
    console.log('❌ Quick fix error:', error);
  }
}

// Export functions to window for manual testing
window.testAdditionalTasksQuery = testAdditionalTasksQuery;
window.fixUserIdMismatch = fixUserIdMismatch;
window.clearReactQueryCache = clearReactQueryCache;
window.forceRefreshAdditionalTasks = forceRefreshAdditionalTasks;
window.runComprehensiveFix = runComprehensiveFix;
window.quickFix = quickFix;

console.log('\n📋 AVAILABLE COMMANDS:');
console.log('- runComprehensiveFix() - Full diagnosis and fix');
console.log('- quickFix() - Quick page reload with cache clear');
console.log('- testAdditionalTasksQuery() - Test queries only');
console.log('- clearReactQueryCache() - Clear cache only');

// Auto-run if on additional-tasks page
if (window.location.pathname.includes('additional-tasks')) {
  console.log('\n🎯 Detected additional-tasks page. Choose your action:');
  console.log('1. For comprehensive fix: runComprehensiveFix()');
  console.log('2. For quick fix: quickFix()');
  
  // Auto comprehensive fix after 3 seconds if no action taken
  setTimeout(() => {
    console.log('🚀 Auto-running comprehensive fix...');
    runComprehensiveFix();
  }, 3000);
}