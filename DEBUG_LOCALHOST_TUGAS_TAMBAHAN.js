// DEBUG: Test Tugas Tambahan di localhost:5000
// Script untuk debugging masalah data tidak muncul

console.log('🔍 DEBUG: Tugas Tambahan di localhost:5000');

// Test 1: Cek apakah server berjalan
async function testServerStatus() {
  try {
    console.log('\n📡 Testing server status...');
    const response = await fetch('http://localhost:5000/api/test');
    if (response.ok) {
      console.log('✅ Server localhost:5000 berjalan');
    } else {
      console.log('❌ Server response error:', response.status);
    }
  } catch (error) {
    console.log('❌ Server tidak dapat diakses:', error.message);
  }
}

// Test 2: Cek user data di localStorage
function testUserData() {
  console.log('\n👤 Testing user data...');
  const userData = localStorage.getItem('auth_user');
  if (userData) {
    const user = JSON.parse(userData);
    console.log('✅ User data found:', {
      username: user.username,
      id: user.id,
      fullName: user.fullName
    });
    return user;
  } else {
    console.log('❌ No user data in localStorage');
    return null;
  }
}

// Test 3: Test query langsung ke Supabase
async function testSupabaseQuery() {
  try {
    console.log('\n🔍 Testing Supabase query...');
    
    const userData = localStorage.getItem('auth_user');
    if (!userData) {
      console.log('❌ No user data');
      return;
    }
    
    const currentUser = JSON.parse(userData);
    const userId = currentUser.username || currentUser.id;
    console.log('🔑 Using userId:', userId);
    
    // Test dengan supabase client global
    if (typeof supabase !== 'undefined') {
      const { data, error } = await supabase
        .from('additional_tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Supabase error:', error);
      } else {
        console.log('✅ Supabase query success!');
        console.log('📊 Data count:', data?.length || 0);
        console.log('📋 Data preview:', data?.slice(0, 2));
        return data;
      }
    } else {
      console.log('❌ Supabase client not available');
    }
    
  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

// Test 4: Cek semua data tanpa filter
async function testAllData() {
  try {
    console.log('\n🔍 Testing all data without filter...');
    
    if (typeof supabase !== 'undefined') {
      const { data, error } = await supabase
        .from('additional_tasks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Query error:', error);
      } else {
        console.log('✅ All data query success!');
        console.log('📊 Total records:', data?.length || 0);
        
        // Cek user_id yang ada
        const userIds = [...new Set(data?.map(item => item.user_id))];
        console.log('👥 User IDs in database:', userIds);
        
        // Cek data per user
        userIds.forEach(userId => {
          const userTasks = data?.filter(item => item.user_id === userId);
          console.log(`📋 User ${userId}: ${userTasks?.length || 0} tasks`);
        });
        
        return data;
      }
    } else {
      console.log('❌ Supabase client not available');
    }
    
  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

// Test 5: Cek React Query cache
function testReactQueryCache() {
  console.log('\n🔄 Testing React Query cache...');
  
  // Cek apakah ada cache data
  if (window.queryClient) {
    const cacheData = window.queryClient.getQueryData(['additional-tasks']);
    console.log('📦 Cache data:', cacheData);
    
    // Clear cache
    window.queryClient.invalidateQueries(['additional-tasks']);
    console.log('🗑️ Cache cleared');
  } else {
    console.log('❌ React Query client not available');
  }
}

// Jalankan semua test
async function runAllTests() {
  console.log('🧪 Running all debug tests...');
  
  await testServerStatus();
  const user = testUserData();
  
  if (user) {
    await testSupabaseQuery();
    await testAllData();
    testReactQueryCache();
  }
  
  console.log('\n📝 NEXT STEPS:');
  console.log('1. Jika server tidak berjalan: npm run dev');
  console.log('2. Jika user data kosong: login ulang');
  console.log('3. Jika Supabase error: cek koneksi dan credentials');
  console.log('4. Jika data kosong: cek user_id di database');
}

// Auto run
runAllTests();

// Export untuk manual testing
window.debugAdditionalTasks = {
  testServerStatus,
  testUserData,
  testSupabaseQuery,
  testAllData,
  testReactQueryCache,
  runAllTests
};