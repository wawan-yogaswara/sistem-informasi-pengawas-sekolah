// DIAGNOSA LOADING LAPORAN SUPABASE
// Jalankan di browser console localhost:5000/reports

console.log('🔍 DIAGNOSA: Loading Lama Halaman Laporan - Koneksi Supabase');
console.log('');

// Test 1: Cek koneksi Supabase basic
async function testSupabaseConnection() {
  console.log('📋 Test 1: Koneksi Supabase Basic');
  
  try {
    // Cek apakah supabase client tersedia
    if (!window.supabase) {
      console.log('❌ Supabase client tidak tersedia di window');
      return false;
    }
    
    console.log('✅ Supabase client tersedia');
    
    // Test simple query ke tabel yang pasti ada
    const startTime = Date.now();
    const { data, error } = await window.supabase
      .from('schools')
      .select('count(*)')
      .limit(1);
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`⏱️ Query duration: ${duration}ms`);
    
    if (error) {
      console.log('❌ Supabase connection error:', error.message);
      console.log('- Error details:', error);
      return false;
    } else {
      console.log('✅ Supabase connection OK');
      console.log(`- Response time: ${duration}ms`);
      
      if (duration > 3000) {
        console.log('⚠️ WARNING: Response time > 3 seconds (slow connection)');
      } else if (duration > 1000) {
        console.log('⚠️ WARNING: Response time > 1 second (moderate delay)');
      }
      
      return true;
    }
  } catch (error) {
    console.log('❌ Error testing Supabase connection:', error);
    return false;
  }
}

// Test 2: Cek query individual untuk setiap tabel
async function testIndividualQueries() {
  console.log('📋 Test 2: Query Individual untuk Setiap Tabel');
  
  const tables = [
    { name: 'tasks', label: 'Tugas Harian' },
    { name: 'supervisions', label: 'Supervisi' },
    { name: 'additional_tasks', label: 'Tugas Tambahan' }
  ];
  
  const results = {};
  
  for (const table of tables) {
    try {
      console.log(`🔍 Testing ${table.label} (${table.name})...`);
      
      const startTime = Date.now();
      const { data, error } = await window.supabase
        .from(table.name)
        .select('count(*)')
        .limit(1);
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      if (error) {
        console.log(`❌ ${table.label} error:`, error.message);
        results[table.name] = { success: false, error: error.message, duration };
      } else {
        console.log(`✅ ${table.label} OK (${duration}ms)`);
        results[table.name] = { success: true, duration };
      }
      
    } catch (error) {
      console.log(`❌ ${table.label} exception:`, error);
      results[table.name] = { success: false, error: error.message, duration: 0 };
    }
  }
  
  console.log('📊 Summary:');
  Object.entries(results).forEach(([table, result]) => {
    const status = result.success ? '✅' : '❌';
    const duration = result.duration ? `${result.duration}ms` : 'N/A';
    console.log(`- ${table}: ${status} ${duration}`);
  });
  
  return results;
}

// Test 3: Cek user authentication
function testUserAuth() {
  console.log('📋 Test 3: User Authentication');
  
  const authUser = localStorage.getItem('auth_user');
  const userData = localStorage.getItem('user_data');
  
  console.log('- auth_user exists:', !!authUser);
  console.log('- user_data exists:', !!userData);
  
  if (authUser) {
    try {
      const user = JSON.parse(authUser);
      console.log('- User ID:', user.id || user.username);
      console.log('- User name:', user.fullName || user.username);
      
      if (!user.id && !user.username) {
        console.log('⚠️ WARNING: User tidak memiliki ID yang valid');
        return false;
      }
      
      return true;
    } catch (e) {
      console.log('❌ Error parsing auth_user:', e);
      return false;
    }
  } else {
    console.log('❌ Tidak ada data user - perlu login ulang');
    return false;
  }
}

// Test 4: Cek network performance
async function testNetworkPerformance() {
  console.log('📋 Test 4: Network Performance');
  
  try {
    // Test multiple small queries untuk mengukur latency
    const queries = [];
    const startTime = Date.now();
    
    for (let i = 0; i < 3; i++) {
      queries.push(
        window.supabase
          .from('schools')
          .select('id')
          .limit(1)
      );
    }
    
    const results = await Promise.all(queries);
    const endTime = Date.now();
    const totalDuration = endTime - startTime;
    const avgDuration = totalDuration / 3;
    
    console.log(`- Total time for 3 queries: ${totalDuration}ms`);
    console.log(`- Average time per query: ${avgDuration}ms`);
    
    if (avgDuration > 2000) {
      console.log('❌ SLOW: Average > 2 seconds per query');
      return 'slow';
    } else if (avgDuration > 1000) {
      console.log('⚠️ MODERATE: Average > 1 second per query');
      return 'moderate';
    } else {
      console.log('✅ FAST: Average < 1 second per query');
      return 'fast';
    }
    
  } catch (error) {
    console.log('❌ Network performance test failed:', error);
    return 'error';
  }
}

// Test 5: Cek React Query cache
function testReactQueryCache() {
  console.log('📋 Test 5: React Query Cache');
  
  // Cek apakah ada query yang stuck
  if (window.queryClient) {
    console.log('✅ React Query client tersedia');
    
    // Cek query cache
    const queryCache = window.queryClient.getQueryCache();
    const queries = queryCache.getAll();
    
    console.log(`- Total queries in cache: ${queries.length}`);
    
    queries.forEach((query, index) => {
      const key = query.queryKey;
      const state = query.state;
      
      console.log(`- Query ${index + 1}:`, {
        key: key,
        status: state.status,
        isFetching: state.isFetching,
        isLoading: state.isLoading,
        error: state.error?.message
      });
      
      if (state.isFetching && state.status === 'loading') {
        console.log(`⚠️ Query ${key} is stuck in loading state`);
      }
    });
    
  } else {
    console.log('⚠️ React Query client tidak tersedia');
  }
}

// Test 6: Cek environment variables
function testEnvironmentConfig() {
  console.log('📋 Test 6: Environment Configuration');
  
  // Cek apakah ada config Supabase yang bisa diakses
  if (window.supabase && window.supabase.supabaseUrl) {
    console.log('✅ Supabase URL configured:', window.supabase.supabaseUrl);
  } else {
    console.log('⚠️ Supabase URL tidak terdeteksi');
  }
  
  // Cek localStorage untuk config
  const supabaseConfig = localStorage.getItem('supabase-config');
  if (supabaseConfig) {
    console.log('✅ Supabase config found in localStorage');
  } else {
    console.log('⚠️ No Supabase config in localStorage');
  }
}

// Test 7: Simulate reports page loading
async function testReportsPageLoading() {
  console.log('📋 Test 7: Simulate Reports Page Loading');
  
  try {
    // Get user
    const userData = localStorage.getItem('auth_user');
    if (!userData) {
      console.log('❌ No user data for reports loading test');
      return false;
    }
    
    const currentUser = JSON.parse(userData);
    const userId = currentUser.username || currentUser.id;
    
    console.log('🔍 Simulating reports page data loading...');
    
    const startTime = Date.now();
    
    // Simulate the exact queries from reports page
    const [tasksResult, supervisionsResult, additionalTasksResult] = await Promise.all([
      window.supabase.from('tasks').select('*').order('created_at', { ascending: false }),
      window.supabase.from('supervisions').select('*').order('created_at', { ascending: false }),
      window.supabase.from('additional_tasks').select('*').eq('user_id', userId).order('created_at', { ascending: false })
    ]);
    
    const endTime = Date.now();
    const totalDuration = endTime - startTime;
    
    console.log(`⏱️ Total loading time: ${totalDuration}ms`);
    
    // Check results
    const tasksCount = tasksResult.data?.length || 0;
    const supervisionsCount = supervisionsResult.data?.length || 0;
    const additionalTasksCount = additionalTasksResult.data?.length || 0;
    
    console.log('📊 Data loaded:');
    console.log(`- Tasks: ${tasksCount} records`);
    console.log(`- Supervisions: ${supervisionsCount} records`);
    console.log(`- Additional Tasks: ${additionalTasksCount} records`);
    
    // Check for errors
    if (tasksResult.error) console.log('❌ Tasks error:', tasksResult.error.message);
    if (supervisionsResult.error) console.log('❌ Supervisions error:', supervisionsResult.error.message);
    if (additionalTasksResult.error) console.log('❌ Additional Tasks error:', additionalTasksResult.error.message);
    
    if (totalDuration > 5000) {
      console.log('❌ VERY SLOW: Total loading > 5 seconds');
      return 'very_slow';
    } else if (totalDuration > 3000) {
      console.log('⚠️ SLOW: Total loading > 3 seconds');
      return 'slow';
    } else {
      console.log('✅ ACCEPTABLE: Total loading < 3 seconds');
      return 'acceptable';
    }
    
  } catch (error) {
    console.log('❌ Reports loading simulation failed:', error);
    return 'error';
  }
}

// Comprehensive diagnosis
async function runComprehensiveDiagnosis() {
  console.log('🚀 MENJALANKAN COMPREHENSIVE DIAGNOSIS...');
  console.log('='.repeat(60));
  
  const results = {};
  
  // Test 1: Basic connection
  results.connection = await testSupabaseConnection();
  console.log('');
  
  // Test 2: Individual queries
  results.queries = await testIndividualQueries();
  console.log('');
  
  // Test 3: User auth
  results.auth = testUserAuth();
  console.log('');
  
  // Test 4: Network performance
  results.network = await testNetworkPerformance();
  console.log('');
  
  // Test 5: React Query cache
  testReactQueryCache();
  console.log('');
  
  // Test 6: Environment config
  testEnvironmentConfig();
  console.log('');
  
  // Test 7: Reports loading simulation
  results.reportsLoading = await testReportsPageLoading();
  console.log('');
  
  // Final analysis
  console.log('='.repeat(60));
  console.log('🎯 DIAGNOSIS SUMMARY:');
  console.log('- Supabase Connection:', results.connection ? '✅ OK' : '❌ FAILED');
  console.log('- User Authentication:', results.auth ? '✅ OK' : '❌ FAILED');
  console.log('- Network Performance:', results.network);
  console.log('- Reports Loading:', results.reportsLoading);
  
  // Recommendations
  console.log('');
  console.log('💡 RECOMMENDATIONS:');
  
  if (!results.connection) {
    console.log('1. ❌ Fix Supabase connection first');
  } else if (!results.auth) {
    console.log('1. ❌ Fix user authentication (logout/login)');
  } else if (results.network === 'slow' || results.reportsLoading === 'slow') {
    console.log('1. ⚠️ Optimize queries or check internet connection');
    console.log('2. ⚠️ Consider adding loading states');
    console.log('3. ⚠️ Implement query caching');
  } else if (results.reportsLoading === 'very_slow') {
    console.log('1. ❌ Critical performance issue - check Supabase plan/limits');
    console.log('2. ❌ Consider pagination or data limiting');
  } else {
    console.log('1. ✅ Connection looks good - check React Query implementation');
    console.log('2. ✅ Consider adding better loading indicators');
  }
}

// Export functions
window.testSupabaseConnection = testSupabaseConnection;
window.testIndividualQueries = testIndividualQueries;
window.testUserAuth = testUserAuth;
window.testNetworkPerformance = testNetworkPerformance;
window.testReportsPageLoading = testReportsPageLoading;
window.runComprehensiveDiagnosis = runComprehensiveDiagnosis;

console.log('📋 INSTRUKSI DIAGNOSA:');
console.log('1. Pastikan berada di localhost:5000/reports');
console.log('2. Jalankan: runComprehensiveDiagnosis()');
console.log('3. Atau test individual:');
console.log('   - testSupabaseConnection()');
console.log('   - testNetworkPerformance()');
console.log('   - testReportsPageLoading()');
console.log('');

// Auto-run jika di halaman reports
if (window.location.pathname.includes('reports')) {
  console.log('🎯 Detected reports page. Running diagnosis in 3 seconds...');
  setTimeout(() => {
    runComprehensiveDiagnosis();
  }, 3000);
}