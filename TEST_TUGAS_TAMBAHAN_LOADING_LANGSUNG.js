// TEST LANGSUNG: Tugas Tambahan Loading Issue
// Jalankan di browser console pada halaman additional-tasks

console.log('🧪 TESTING: Tugas Tambahan Loading Issue');
console.log('='.repeat(50));

// STEP 1: Check if we're on the right page
if (!window.location.pathname.includes('additional-tasks')) {
  console.log('⚠️ WARNING: Tidak berada di halaman additional-tasks');
  console.log('Silakan buka halaman additional-tasks terlebih dahulu');
} else {
  console.log('✅ Berada di halaman additional-tasks');
}

// STEP 2: Check Supabase availability
if (!window.supabase) {
  console.log('❌ ERROR: Supabase client tidak tersedia');
} else {
  console.log('✅ Supabase client tersedia');
}

// STEP 3: Check user authentication
const userData = localStorage.getItem('auth_user');
if (!userData) {
  console.log('❌ ERROR: Tidak ada data user - silakan login');
} else {
  const currentUser = JSON.parse(userData);
  console.log('✅ User data tersedia:', {
    username: currentUser.username,
    id: currentUser.id,
    fullName: currentUser.fullName
  });
}

// STEP 4: Test query langsung
async function testDirectQuery() {
  console.log('\n🔍 TESTING: Direct Query ke Supabase');
  
  try {
    const currentUser = JSON.parse(localStorage.getItem('auth_user'));
    const userId = currentUser.username || currentUser.id;
    
    console.log(`🔑 Testing dengan user_id: "${userId}"`);
    
    // Test 1: Query semua data
    console.log('\n📊 Test 1: Query semua data additional_tasks');
    const { data: allData, error: allError } = await window.supabase
      .from('additional_tasks')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (allError) {
      console.log('❌ Error:', allError);
      return false;
    }
    
    console.log(`✅ Total records: ${allData?.length || 0}`);
    
    if (allData && allData.length > 0) {
      console.log('📋 Sample data:');
      allData.slice(0, 3).forEach((item, index) => {
        console.log(`  ${index + 1}. "${item.title}" (user_id: ${item.user_id})`);
      });
      
      // Show unique user_ids
      const uniqueUserIds = [...new Set(allData.map(item => item.user_id))];
      console.log('👥 Unique user_ids:', uniqueUserIds);
    }
    
    // Test 2: Query dengan filter user
    console.log(`\n📊 Test 2: Query dengan filter user_id = "${userId}"`);
    const { data: userData, error: userError } = await window.supabase
      .from('additional_tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (userError) {
      console.log('❌ Error:', userError);
      return false;
    }
    
    console.log(`✅ Records for user: ${userData?.length || 0}`);
    
    if (userData && userData.length > 0) {
      console.log('📋 User data:');
      userData.forEach((item, index) => {
        console.log(`  ${index + 1}. "${item.title}" (${item.date})`);
      });
    } else {
      console.log('⚠️ Tidak ada data untuk user ini');
      
      if (allData && allData.length > 0) {
        console.log('💡 Coba gunakan salah satu user_id ini:');
        uniqueUserIds.forEach(id => console.log(`  - "${id}"`));
      }
    }
    
    return { allData, userData, userId };
    
  } catch (error) {
    console.log('❌ Test query error:', error);
    return false;
  }
}

// STEP 5: Test React Query state
function testReactQueryState() {
  console.log('\n🔍 TESTING: React Query State');
  
  if (window.queryClient) {
    console.log('✅ React Query client tersedia');
    
    // Get additional-tasks query
    const query = window.queryClient.getQueryData(['additional-tasks']);
    console.log('📊 Current query data:', query);
    
    // Get query state
    const queryState = window.queryClient.getQueryState(['additional-tasks']);
    console.log('📊 Query state:', {
      status: queryState?.status,
      isFetching: queryState?.isFetching,
      isLoading: queryState?.isLoading,
      error: queryState?.error?.message
    });
    
  } else {
    console.log('❌ React Query client tidak tersedia');
  }
}

// STEP 6: Force refresh function
async function forceRefresh() {
  console.log('\n🔄 FORCE REFRESH: Clearing cache and refetching');
  
  try {
    // Clear cache
    if (window.queryClient) {
      window.queryClient.removeQueries(['additional-tasks']);
      console.log('✅ Cache cleared');
    }
    
    // Trigger refetch if available
    if (window.refetchAdditionalTasks) {
      console.log('🔄 Triggering refetch...');
      await window.refetchAdditionalTasks();
      console.log('✅ Refetch completed');
    } else {
      console.log('⚠️ Refetch function tidak tersedia');
    }
    
  } catch (error) {
    console.log('❌ Force refresh error:', error);
  }
}

// STEP 7: Complete diagnosis
async function runCompleteTest() {
  console.log('\n🚀 RUNNING COMPLETE TEST...');
  console.log('='.repeat(50));
  
  // Test direct query
  const queryResult = await testDirectQuery();
  
  // Test React Query state
  testReactQueryState();
  
  // Summary
  console.log('\n📋 TEST SUMMARY:');
  
  if (!queryResult) {
    console.log('❌ CRITICAL: Query test failed');
    console.log('💡 SOLUTION: Check Supabase connection and authentication');
  } else if (queryResult.userData && queryResult.userData.length > 0) {
    console.log('✅ SUCCESS: Data exists for current user');
    console.log('💡 SOLUTION: Issue might be in React component - try force refresh');
  } else if (queryResult.allData && queryResult.allData.length > 0) {
    console.log('⚠️ PARTIAL: Data exists but not for current user');
    console.log('💡 SOLUTION: Check user_id mapping or use different user_id');
  } else {
    console.log('❌ NO DATA: No additional tasks in database');
    console.log('💡 SOLUTION: Add some test data first');
  }
  
  return queryResult;
}

// Export functions
window.testDirectQuery = testDirectQuery;
window.testReactQueryState = testReactQueryState;
window.forceRefresh = forceRefresh;
window.runCompleteTest = runCompleteTest;

console.log('\n📋 AVAILABLE COMMANDS:');
console.log('- runCompleteTest() - Run all tests');
console.log('- testDirectQuery() - Test Supabase queries');
console.log('- testReactQueryState() - Check React Query state');
console.log('- forceRefresh() - Clear cache and refetch');

console.log('\n🎯 QUICK START:');
console.log('Jalankan: runCompleteTest()');

// Auto-run after 2 seconds
setTimeout(() => {
  console.log('\n🚀 Auto-running complete test...');
  runCompleteTest();
}, 2000);