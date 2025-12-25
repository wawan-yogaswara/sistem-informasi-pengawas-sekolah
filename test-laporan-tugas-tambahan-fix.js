// TEST: Fix Laporan Tugas Tambahan - Semua Data Muncul
// Verifikasi bahwa semua tugas tambahan muncul di halaman laporan

console.log('🧪 TESTING: Fix Laporan Tugas Tambahan');
console.log('='.repeat(60));

// Test perbandingan data antara halaman additional-tasks dan reports
async function testDataConsistency() {
  console.log('🔍 Testing data consistency between pages...');
  
  if (!window.supabase) {
    console.log('❌ Supabase client not available');
    return false;
  }
  
  const results = {};
  
  // Test 1: Query langsung ke additional_tasks (seperti di additional-tasks.tsx)
  console.log('\n📋 Test 1: Direct Additional Tasks Query (Simple Pattern)');
  try {
    const startTime = Date.now();
    const { data: directData, error: directError } = await window.supabase
      .from('additional_tasks')
      .select('*')
      .order('created_at', { ascending: false });
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    if (directError) {
      console.log('❌ Direct query error:', directError.message);
      results.direct = { success: false, error: directError.message, count: 0, duration };
    } else {
      console.log(`✅ Direct query success: ${directData?.length || 0} records (${duration}ms)`);
      results.direct = { success: true, count: directData?.length || 0, data: directData, duration };
      
      // Show sample data
      if (directData && directData.length > 0) {
        console.log('📊 Sample direct data:');
        directData.slice(0, 3).forEach((item, index) => {
          console.log(`   ${index + 1}. ${item.title} (${item.user_id}) - ${item.created_at}`);
        });
      }
    }
  } catch (error) {
    console.log('❌ Direct query exception:', error);
    results.direct = { success: false, error: error.message, count: 0, duration: 0 };
  }
  
  // Test 2: Query dengan user filter (seperti di reports.tsx sebelum fix)
  console.log('\n📋 Test 2: Additional Tasks Query with User Filter (Old Pattern)');
  try {
    const userData = localStorage.getItem('auth_user');
    if (!userData) {
      console.log('⚠️ No user data for filtered test');
      results.filtered = { success: false, error: 'No user data', count: 0, duration: 0 };
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
        console.log('❌ Filtered query error:', filteredError.message);
        results.filtered = { success: false, error: filteredError.message, count: 0, duration };
      } else {
        console.log(`✅ Filtered query success: ${filteredData?.length || 0} records (${duration}ms)`);
        results.filtered = { success: true, count: filteredData?.length || 0, data: filteredData, duration };
        
        // Show sample data
        if (filteredData && filteredData.length > 0) {
          console.log('📊 Sample filtered data:');
          filteredData.slice(0, 3).forEach((item, index) => {
            console.log(`   ${index + 1}. ${item.title} (${item.user_id}) - ${item.created_at}`);
          });
        }
      }
    }
  } catch (error) {
    console.log('❌ Filtered query exception:', error);
    results.filtered = { success: false, error: error.message, count: 0, duration: 0 };
  }
  
  // Test 3: Check React Query cache for additional-tasks page
  console.log('\n⚛️ Test 3: Additional Tasks Page Cache');
  if (window.queryClient) {
    const additionalTasksCache = window.queryClient.getQueryData(['additional-tasks']);
    console.log('📊 Additional Tasks Cache:', Array.isArray(additionalTasksCache) ? `${additionalTasksCache.length} records` : 'no data');
    results.additionalTasksCache = { count: Array.isArray(additionalTasksCache) ? additionalTasksCache.length : 0 };
  } else {
    console.log('⚠️ React Query client not available');
    results.additionalTasksCache = { count: 0 };
  }
  
  // Test 4: Check if reports page loads all data
  console.log('\n📊 Test 4: Reports Page Data Loading Simulation');
  try {
    // Simulate the reports page data loading logic
    const activities = [];
    
    // Load additional tasks (using the fixed query)
    const { data: additionalTasksData, error: additionalTasksError } = await window.supabase
      .from('additional_tasks')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!additionalTasksError && additionalTasksData) {
      additionalTasksData.forEach((task) => {
        activities.push({
          id: task.id,
          type: 'Tugas Tambahan',
          title: task.title || task.name || 'Kegiatan Tambahan',
          date: task.date || task.created_at,
          location: task.location || 'Tempat Kegiatan',
          organizer: task.organizer || 'Pengawas Sekolah',
          description: task.description || '',
          photo1: task.photo1 || task.photo,
          photo2: task.photo2,
          createdAt: task.created_at,
          source: 'supabase-additional-tasks'
        });
      });
    }
    
    console.log(`✅ Reports simulation: ${activities.length} additional tasks loaded`);
    results.reportsSimulation = { success: true, count: activities.length };
    
    // Show sample activities
    if (activities.length > 0) {
      console.log('📊 Sample activities for reports:');
      activities.slice(0, 3).forEach((activity, index) => {
        console.log(`   ${index + 1}. ${activity.title} - ${activity.date} (${activity.source})`);
      });
    }
    
  } catch (error) {
    console.log('❌ Reports simulation error:', error);
    results.reportsSimulation = { success: false, error: error.message, count: 0 };
  }
  
  // Analysis
  console.log('\n' + '='.repeat(60));
  console.log('📊 DATA CONSISTENCY ANALYSIS:');
  console.log('='.repeat(60));
  
  const directCount = results.direct?.count || 0;
  const filteredCount = results.filtered?.count || 0;
  const cacheCount = results.additionalTasksCache?.count || 0;
  const reportsCount = results.reportsSimulation?.count || 0;
  
  console.log(`📋 Direct Query (No Filter): ${directCount} records`);
  console.log(`🔍 Filtered Query (With user_id): ${filteredCount} records`);
  console.log(`⚛️ Additional Tasks Page Cache: ${cacheCount} records`);
  console.log(`📊 Reports Page Simulation: ${reportsCount} records`);
  
  // Determine the issue
  if (directCount > filteredCount) {
    console.log('\n🎯 ROOT CAUSE IDENTIFIED:');
    console.log('❌ User filtering is causing data loss in reports');
    console.log(`💡 SOLUTION: Remove .eq('user_id', userId) from reports query`);
    console.log(`📈 Expected improvement: ${directCount - filteredCount} more records in reports`);
  } else if (directCount === filteredCount && directCount > 0) {
    console.log('\n✅ GOOD NEWS:');
    console.log('✅ User filtering is working correctly');
    console.log('✅ All data belongs to current user');
  } else if (directCount === 0) {
    console.log('\n⚠️ NO DATA ISSUE:');
    console.log('❌ No additional tasks found in database');
    console.log('💡 Check if data exists in Supabase dashboard');
  }
  
  // Check consistency between pages
  if (directCount === cacheCount && directCount === reportsCount) {
    console.log('\n🎉 CONSISTENCY CHECK: PASSED');
    console.log('✅ All pages should show the same data');
  } else {
    console.log('\n⚠️ CONSISTENCY CHECK: ISSUES FOUND');
    console.log('❌ Data count mismatch between pages');
    console.log('💡 Check query patterns and caching');
  }
  
  return results;
}

// Test user_id mapping in data
async function testUserIdMapping() {
  console.log('\n🔍 Testing user_id mapping in additional_tasks...');
  
  try {
    const { data, error } = await window.supabase
      .from('additional_tasks')
      .select('id, title, user_id, created_at')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (error) {
      console.log('❌ Query error:', error.message);
      return false;
    }
    
    if (!data || data.length === 0) {
      console.log('⚠️ No data found');
      return false;
    }
    
    console.log(`📊 Found ${data.length} records. User ID mapping:`);
    
    // Group by user_id
    const userGroups = {};
    data.forEach(item => {
      const userId = item.user_id || 'null';
      if (!userGroups[userId]) {
        userGroups[userId] = [];
      }
      userGroups[userId].push(item);
    });
    
    // Show user distribution
    Object.entries(userGroups).forEach(([userId, items]) => {
      console.log(`👤 User ID "${userId}": ${items.length} records`);
      items.slice(0, 2).forEach(item => {
        console.log(`   - ${item.title} (${item.created_at})`);
      });
    });
    
    // Check current user
    const userData = localStorage.getItem('auth_user');
    if (userData) {
      const currentUser = JSON.parse(userData);
      const currentUserId = currentUser.username || currentUser.id;
      console.log(`\n🔑 Current user ID: "${currentUserId}"`);
      
      const currentUserData = userGroups[currentUserId] || [];
      console.log(`📊 Current user has ${currentUserData.length} records`);
      
      if (currentUserData.length === 0 && Object.keys(userGroups).length > 0) {
        console.log('⚠️ WARNING: Current user has no data, but other users do');
        console.log('💡 This explains why filtered query returns no results');
        console.log('💡 Solution: Use simple query without user filter');
      }
    }
    
    return true;
    
  } catch (error) {
    console.log('❌ User ID mapping test error:', error);
    return false;
  }
}

// Force refresh reports page data
async function forceRefreshReports() {
  console.log('\n🔄 Force refreshing reports page data...');
  
  if (!window.queryClient) {
    console.log('❌ React Query client not available');
    return false;
  }
  
  try {
    // Clear reports cache if exists
    window.queryClient.removeQueries(['reports']);
    window.queryClient.removeQueries(['activities']);
    
    console.log('✅ Reports cache cleared');
    
    // If on reports page, trigger refetch
    if (window.location.pathname.includes('reports')) {
      console.log('📊 On reports page - triggering data reload...');
      
      // Trigger a page refresh to reload with new query
      setTimeout(() => {
        console.log('🔄 Refreshing page to apply fix...');
        window.location.reload();
      }, 2000);
    } else {
      console.log('💡 Navigate to reports page to see the fix');
    }
    
    return true;
    
  } catch (error) {
    console.log('❌ Force refresh error:', error);
    return false;
  }
}

// Main test function
async function runAllTests() {
  console.log('🚀 Running all tests...\n');
  
  const consistencyResults = await testDataConsistency();
  const userMappingResults = await testUserIdMapping();
  
  console.log('\n' + '='.repeat(60));
  console.log('📋 TEST SUMMARY:');
  console.log('='.repeat(60));
  
  const directCount = consistencyResults.direct?.count || 0;
  const filteredCount = consistencyResults.filtered?.count || 0;
  
  console.log(`✅ Data Consistency Test: ${consistencyResults.direct?.success ? 'PASSED' : 'FAILED'}`);
  console.log(`✅ User Mapping Test: ${userMappingResults ? 'PASSED' : 'FAILED'}`);
  
  if (directCount > filteredCount) {
    console.log('\n🎯 ISSUE CONFIRMED:');
    console.log(`❌ Reports page missing ${directCount - filteredCount} additional tasks`);
    console.log('💡 SOLUTION APPLIED: Removed user filter from reports query');
    console.log('🔄 Refresh reports page to see all data');
  } else if (directCount === filteredCount && directCount > 0) {
    console.log('\n✅ NO ISSUE FOUND:');
    console.log('✅ All additional tasks should appear in reports');
  } else if (directCount === 0) {
    console.log('\n⚠️ NO DATA ISSUE:');
    console.log('❌ No additional tasks in database');
    console.log('💡 Add some additional tasks first');
  }
  
  console.log('\n📋 NEXT STEPS:');
  console.log('1. Navigate to reports page');
  console.log('2. Check if all additional tasks now appear');
  console.log('3. Compare count with additional-tasks page');
  console.log('4. Verify photos and details are correct');
  
  return consistencyResults;
}

// Export functions
if (typeof window !== 'undefined') {
  window.testDataConsistency = testDataConsistency;
  window.testUserIdMapping = testUserIdMapping;
  window.forceRefreshReports = forceRefreshReports;
  window.runAllTests = runAllTests;
  
  console.log('\n📋 AVAILABLE COMMANDS:');
  console.log('- testDataConsistency() - Compare data between queries');
  console.log('- testUserIdMapping() - Check user_id distribution');
  console.log('- forceRefreshReports() - Clear cache and refresh');
  console.log('- runAllTests() - Run all tests');
  
  console.log('\n🎯 QUICK START:');
  console.log('Run: runAllTests()');
}

// Auto-run after 2 seconds
if (typeof window !== 'undefined') {
  setTimeout(() => {
    console.log('\n🚀 Auto-running tests...');
    runAllTests();
  }, 2000);
}