// TEST: Additional Tasks Loading Fix
// Verifikasi apakah fix query sederhana sudah bekerja

console.log('🧪 TESTING: Additional Tasks Loading Fix');
console.log('='.repeat(50));

// Test current implementation
async function testAdditionalTasksLoading() {
  console.log('🔍 Testing additional tasks loading...');
  
  // Check if we're in browser environment
  if (typeof window === 'undefined') {
    console.log('❌ This test must be run in browser console');
    return false;
  }
  
  // Check if Supabase is available
  if (!window.supabase) {
    console.log('❌ Supabase client not available');
    console.log('💡 Make sure you are on the application page');
    return false;
  }
  
  console.log('✅ Environment check passed');
  
  // Test 1: Direct Supabase query (simple pattern)
  console.log('\n📋 Test 1: Direct Supabase Query (Simple Pattern)');
  try {
    const startTime = Date.now();
    const { data, error } = await window.supabase
      .from('additional_tasks')
      .select('*')
      .order('created_at', { ascending: false });
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    if (error) {
      console.log('❌ Query failed:', error.message);
      console.log('🔍 Error details:', error);
      return false;
    }
    
    console.log(`✅ Query successful: ${data?.length || 0} records (${duration}ms)`);
    
    if (data && data.length > 0) {
      console.log('📊 Sample data:');
      console.log('   First record:', {
        id: data[0].id,
        title: data[0].title,
        user_id: data[0].user_id,
        created_at: data[0].created_at
      });
      
      // Check user_ids in data
      const userIds = [...new Set(data.map(item => item.user_id))];
      console.log('👥 Unique user_ids:', userIds);
    } else {
      console.log('⚠️ No data found in additional_tasks table');
    }
    
  } catch (error) {
    console.log('❌ Query exception:', error);
    return false;
  }
  
  // Test 2: Check React Query state
  console.log('\n⚛️ Test 2: React Query State');
  if (window.queryClient) {
    const queryState = window.queryClient.getQueryState(['additional-tasks']);
    const queryData = window.queryClient.getQueryData(['additional-tasks']);
    
    console.log('📊 React Query State:');
    console.log('   Status:', queryState?.status || 'not found');
    console.log('   Loading:', queryState?.isFetching || false);
    console.log('   Error:', queryState?.error?.message || 'none');
    console.log('   Data:', Array.isArray(queryData) ? `${queryData.length} records` : 'no data');
    
    if (queryState?.error) {
      console.log('🔍 React Query Error Details:', queryState.error);
    }
  } else {
    console.log('⚠️ React Query client not available');
  }
  
  // Test 3: Check if refetch function is available
  console.log('\n🔄 Test 3: Refetch Function');
  if (window.refetchAdditionalTasks) {
    console.log('✅ Refetch function available');
    try {
      console.log('🔄 Triggering refetch...');
      await window.refetchAdditionalTasks();
      console.log('✅ Refetch completed');
      
      // Check data after refetch
      const newQueryData = window.queryClient?.getQueryData(['additional-tasks']);
      console.log('📊 Data after refetch:', Array.isArray(newQueryData) ? `${newQueryData.length} records` : 'no data');
      
    } catch (error) {
      console.log('❌ Refetch failed:', error);
    }
  } else {
    console.log('⚠️ Refetch function not available');
    console.log('💡 Make sure you are on the additional-tasks page');
  }
  
  // Test 4: Compare with working queries
  console.log('\n🔍 Test 4: Compare with Working Queries');
  
  const queries = [
    { table: 'tasks', name: 'Tasks (Working)' },
    { table: 'supervisions', name: 'Supervisions (Working)' },
    { table: 'additional_tasks', name: 'Additional Tasks (Fixed)' }
  ];
  
  for (const { table, name } of queries) {
    try {
      const { data, error } = await window.supabase
        .from(table)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) {
        console.log(`❌ ${name}: ${error.message}`);
      } else {
        console.log(`✅ ${name}: ${data?.length || 0} records`);
      }
    } catch (error) {
      console.log(`❌ ${name}: Exception - ${error.message}`);
    }
  }
  
  return true;
}

// Test UI state
function testUIState() {
  console.log('\n🖥️ Testing UI State...');
  
  // Check if we're on additional-tasks page
  const currentPath = window.location.pathname;
  console.log('📍 Current path:', currentPath);
  
  if (!currentPath.includes('additional-tasks')) {
    console.log('⚠️ Not on additional-tasks page');
    console.log('💡 Navigate to /additional-tasks to test UI');
    return false;
  }
  
  // Check for loading state
  const loadingElement = document.querySelector('[data-testid="loading"]') || 
                        document.querySelector('.text-muted-foreground:contains("Memuat data")');
  
  if (loadingElement) {
    console.log('⏳ Page is still loading');
  } else {
    console.log('✅ Page loaded');
  }
  
  // Check for data display
  const taskCards = document.querySelectorAll('[class*="card"]');
  const emptyState = document.querySelector('.text-center');
  
  console.log('📊 UI Elements:');
  console.log('   Task cards:', taskCards.length);
  console.log('   Empty state:', emptyState ? 'visible' : 'not visible');
  
  return true;
}

// Main test function
async function runAllTests() {
  console.log('🚀 Running all tests...\n');
  
  const supabaseTest = await testAdditionalTasksLoading();
  const uiTest = testUIState();
  
  console.log('\n' + '='.repeat(50));
  console.log('📋 TEST SUMMARY:');
  console.log('='.repeat(50));
  console.log(`✅ Supabase Query Test: ${supabaseTest ? 'PASSED' : 'FAILED'}`);
  console.log(`✅ UI State Test: ${uiTest ? 'PASSED' : 'FAILED'}`);
  
  if (supabaseTest && uiTest) {
    console.log('\n🎉 ALL TESTS PASSED!');
    console.log('💡 Additional tasks loading should be working now');
  } else {
    console.log('\n❌ SOME TESTS FAILED');
    console.log('💡 Check the error messages above for debugging');
  }
  
  console.log('\n📋 NEXT STEPS:');
  console.log('1. Navigate to /additional-tasks page');
  console.log('2. Check if data loads without "Memuat data..." message');
  console.log('3. Try adding a new additional task');
  console.log('4. Verify data appears immediately');
}

// Export functions for manual testing
if (typeof window !== 'undefined') {
  window.testAdditionalTasksLoading = testAdditionalTasksLoading;
  window.testUIState = testUIState;
  window.runAllTests = runAllTests;
  
  console.log('\n📋 AVAILABLE COMMANDS:');
  console.log('- testAdditionalTasksLoading() - Test Supabase queries');
  console.log('- testUIState() - Test UI state');
  console.log('- runAllTests() - Run all tests');
  
  console.log('\n🎯 QUICK START:');
  console.log('1. Open browser console on additional-tasks page');
  console.log('2. Run: runAllTests()');
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
  console.log('\n⏰ Auto-running tests in 3 seconds...');
  setTimeout(runAllTests, 3000);
}