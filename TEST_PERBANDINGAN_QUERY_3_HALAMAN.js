// TEST PERBANDINGAN: Query Supabase 3 Halaman
// Jalankan di browser console untuk membandingkan query

console.log('🧪 TESTING: Perbandingan Query Supabase 3 Halaman');
console.log('='.repeat(60));

// Test semua query dengan pattern yang sama
async function testAllQueries() {
  console.log('🔍 Testing all queries with same pattern...');
  
  if (!window.supabase) {
    console.log('❌ Supabase client not available');
    return false;
  }
  
  const results = {};
  
  // Test 1: Tasks Query (yang bekerja)
  console.log('\n📋 Test 1: Tasks Query');
  try {
    const startTime = Date.now();
    const { data: tasksData, error: tasksError } = await window.supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    if (tasksError) {
      console.log('❌ Tasks error:', tasksError.message);
      results.tasks = { success: false, error: tasksError.message, duration };
    } else {
      console.log(`✅ Tasks success: ${tasksData?.length || 0} records (${duration}ms)`);
      results.tasks = { success: true, count: tasksData?.length || 0, duration };
    }
  } catch (error) {
    console.log('❌ Tasks exception:', error);
    results.tasks = { success: false, error: error.message, duration: 0 };
  }
  
  // Test 2: Supervisions Query (yang bekerja)
  console.log('\n🔍 Test 2: Supervisions Query');
  try {
    const startTime = Date.now();
    const { data: supervisionsData, error: supervisionsError } = await window.supabase
      .from('supervisions')
      .select('*')
      .order('created_at', { ascending: false });
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    if (supervisionsError) {
      console.log('❌ Supervisions error:', supervisionsError.message);
      results.supervisions = { success: false, error: supervisionsError.message, duration };
    } else {
      console.log(`✅ Supervisions success: ${supervisionsData?.length || 0} records (${duration}ms)`);
      results.supervisions = { success: true, count: supervisionsData?.length || 0, duration };
    }
  } catch (error) {
    console.log('❌ Supervisions exception:', error);
    results.supervisions = { success: false, error: error.message, duration: 0 };
  }
  
  // Test 3: Additional Tasks Query (yang bermasalah - test dengan pattern sederhana)
  console.log('\n➕ Test 3: Additional Tasks Query (Simple Pattern)');
  try {
    const startTime = Date.now();
    const { data: additionalTasksData, error: additionalTasksError } = await window.supabase
      .from('additional_tasks')
      .select('*')
      .order('created_at', { ascending: false });
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    if (additionalTasksError) {
      console.log('❌ Additional Tasks error:', additionalTasksError.message);
      results.additionalTasks = { success: false, error: additionalTasksError.message, duration };
    } else {
      console.log(`✅ Additional Tasks success: ${additionalTasksData?.length || 0} records (${duration}ms)`);
      results.additionalTasks = { success: true, count: additionalTasksData?.length || 0, duration };
      
      // Show user_ids in data
      if (additionalTasksData && additionalTasksData.length > 0) {
        const userIds = [...new Set(additionalTasksData.map(item => item.user_id))];
        console.log('👥 User IDs in additional tasks:', userIds);
      }
    }
  } catch (error) {
    console.log('❌ Additional Tasks exception:', error);
    results.additionalTasks = { success: false, error: error.message, duration: 0 };
  }
  
  // Test 4: Additional Tasks dengan User Filter (pattern lama yang bermasalah)
  console.log('\n➕ Test 4: Additional Tasks Query (With User Filter)');
  try {
    const userData = localStorage.getItem('auth_user');
    if (!userData) {
      console.log('⚠️ No user data for filtered test');
      results.additionalTasksFiltered = { success: false, error: 'No user data', duration: 0 };
    } else {
      const currentUser = JSON.parse(userData);
      const userId = currentUser.username || currentUser.id;
      console.log('🔑 Testing with user_id:', userId);
      
      const startTime = Date.now();
      const { data: filteredData, error: filteredError } = await window.supabase
        .from('additional_tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      if (filteredError) {
        console.log('❌ Filtered Additional Tasks error:', filteredError.message);
        results.additionalTasksFiltered = { success: false, error: filteredError.message, duration };
      } else {
        console.log(`✅ Filtered Additional Tasks success: ${filteredData?.length || 0} records (${duration}ms)`);
        results.additionalTasksFiltered = { success: true, count: filteredData?.length || 0, duration };
      }
    }
  } catch (error) {
    console.log('❌ Filtered Additional Tasks exception:', error);
    results.additionalTasksFiltered = { success: false, error: error.message, duration: 0 };
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 COMPARISON SUMMARY:');
  console.log('='.repeat(60));
  
  Object.entries(results).forEach(([table, result]) => {
    const status = result.success ? '✅' : '❌';
    const count = result.count !== undefined ? `${result.count} records` : 'N/A';
    const duration = result.duration ? `${result.duration}ms` : 'N/A';
    const error = result.error ? `Error: ${result.error}` : '';
    
    console.log(`${status} ${table.toUpperCase()}:`);
    console.log(`   Count: ${count}`);
    console.log(`   Duration: ${duration}`);
    if (error) console.log(`   ${error}`);
    console.log('');
  });
  
  // Analysis
  console.log('🎯 ANALYSIS:');
  
  const allSimpleQueriesWork = results.tasks?.success && results.supervisions?.success && results.additionalTasks?.success;
  const filteredQueryWorks = results.additionalTasksFiltered?.success;
  
  if (allSimpleQueriesWork) {
    console.log('✅ All simple queries (without user filter) work perfectly');
    console.log('💡 SOLUTION: Use simple query pattern for additional-tasks');
  } else {
    console.log('❌ Some simple queries failed - check Supabase connection');
  }
  
  if (filteredQueryWorks && results.additionalTasksFiltered.count > 0) {
    console.log('✅ User-filtered query works and has data');
    console.log('💡 SOLUTION: User filter is OK, but check user_id mapping');
  } else if (filteredQueryWorks && results.additionalTasksFiltered.count === 0) {
    console.log('⚠️ User-filtered query works but returns no data');
    console.log('💡 SOLUTION: Check user_id in data or use simple query');
  } else {
    console.log('❌ User-filtered query failed');
    console.log('💡 SOLUTION: Use simple query without user filter');
  }
  
  return results;
}

// Test React Query states
function testReactQueryStates() {
  console.log('\n🔍 Testing React Query States...');
  
  if (!window.queryClient) {
    console.log('❌ React Query client not available');
    return false;
  }
  
  const queries = [
    { key: ['tasks'], name: 'Tasks' },
    { key: ['supervisions'], name: 'Supervisions' },
    { key: ['additional-tasks'], name: 'Additional Tasks' }
  ];
  
  queries.forEach(({ key, name }) => {
    const queryState = window.queryClient.getQueryState(key);
    const queryData = window.queryClient.getQueryData(key);
    
    console.log(`📊 ${name}:`);
    console.log(`   Status: ${queryState?.status || 'not found'}`);
    console.log(`   Loading: ${queryState?.isFetching || false}`);
    console.log(`   Data: ${Array.isArray(queryData) ? queryData.length + ' records' : 'no data'}`);
    console.log(`   Error: ${queryState?.error?.message || 'none'}`);
    console.log('');
  });
}

// Force refresh all queries
async function forceRefreshAll() {
  console.log('\n🔄 Force refreshing all queries...');
  
  if (!window.queryClient) {
    console.log('❌ React Query client not available');
    return false;
  }
  
  try {
    // Clear all caches
    window.queryClient.removeQueries(['tasks']);
    window.queryClient.removeQueries(['supervisions']);
    window.queryClient.removeQueries(['additional-tasks']);
    
    console.log('✅ All caches cleared');
    
    // Trigger refetch if functions are available
    const refetchFunctions = [
      { name: 'Tasks', fn: window.refetchTasks },
      { name: 'Supervisions', fn: window.refetchSupervisions },
      { name: 'Additional Tasks', fn: window.refetchAdditionalTasks }
    ];
    
    for (const { name, fn } of refetchFunctions) {
      if (fn) {
        console.log(`🔄 Refetching ${name}...`);
        await fn();
        console.log(`✅ ${name} refetched`);
      } else {
        console.log(`⚠️ ${name} refetch function not available`);
      }
    }
    
  } catch (error) {
    console.log('❌ Force refresh error:', error);
  }
}

// Export functions
window.testAllQueries = testAllQueries;
window.testReactQueryStates = testReactQueryStates;
window.forceRefreshAll = forceRefreshAll;

console.log('\n📋 AVAILABLE COMMANDS:');
console.log('- testAllQueries() - Compare all 3 queries');
console.log('- testReactQueryStates() - Check React Query states');
console.log('- forceRefreshAll() - Clear cache and refetch all');

console.log('\n🎯 QUICK START:');
console.log('Run: testAllQueries()');

// Auto-run after 2 seconds
setTimeout(() => {
  console.log('\n🚀 Auto-running query comparison...');
  testAllQueries();
}, 2000);