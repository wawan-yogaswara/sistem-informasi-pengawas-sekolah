// Debug API call untuk additional tasks
console.log('🔍 Debugging API Call untuk Additional Tasks...');

// 1. Cek authentication
function checkAuth() {
  const authUser = localStorage.getItem('auth_user');
  const authToken = localStorage.getItem('auth_token');
  
  console.log('🔐 Auth Status:');
  console.log('   User:', authUser ? JSON.parse(authUser) : 'Tidak ada');
  console.log('   Token:', authToken ? 'Ada' : 'Tidak ada');
  
  return { authUser, authToken };
}

// 2. Test GET request
async function testGetAdditionalTasks() {
  try {
    console.log('📥 Testing GET /api/additional-tasks...');
    
    const response = await fetch('/api/additional-tasks', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ GET berhasil:', data);
      return data;
    } else {
      const error = await response.text();
      console.error('❌ GET gagal:', error);
    }
  } catch (error) {
    console.error('❌ Error GET request:', error);
  }
}

// 3. Test POST request
async function testPostAdditionalTask() {
  try {
    console.log('📤 Testing POST /api/additional-tasks...');
    
    const testData = {
      title: 'Debug Test Task',
      description: 'Test task untuk debugging',
      date: '2025-01-15',
      status: 'pending'
    };
    
    const response = await fetch('/api/additional-tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
      body: JSON.stringify(testData)
    });
    
    console.log('POST Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ POST berhasil:', data);
      return data;
    } else {
      const error = await response.text();
      console.error('❌ POST gagal:', error);
    }
  } catch (error) {
    console.error('❌ Error POST request:', error);
  }
}

// 4. Cek network tab
function checkNetworkRequests() {
  console.log('🌐 Cek Network Tab di DevTools untuk melihat request yang sebenarnya dikirim');
  console.log('   - Apakah ada request ke /api/additional-tasks?');
  console.log('   - Apa status code response-nya?');
  console.log('   - Apa isi request body-nya?');
}

// 5. Cek React Query
function debugReactQuery() {
  console.log('⚛️ Debug React Query:');
  
  // Cek apakah ada query client di window
  if (window.queryClient) {
    console.log('   Query Client ada');
    
    // Cek cache untuk additional-tasks
    const queryCache = window.queryClient.getQueryCache();
    const queries = queryCache.getAll();
    
    console.log('   Total queries di cache:', queries.length);
    
    const additionalTasksQuery = queries.find(q => 
      q.queryKey && q.queryKey.includes('additional-tasks')
    );
    
    if (additionalTasksQuery) {
      console.log('   Additional tasks query:', additionalTasksQuery);
      console.log('   Query state:', additionalTasksQuery.state);
    } else {
      console.log('   Tidak ada query additional-tasks di cache');
    }
  } else {
    console.log('   Query Client tidak ditemukan di window');
  }
}

// Jalankan semua debug
async function runAllDebug() {
  console.log('🚀 Memulai debug lengkap...\n');
  
  // 1. Check auth
  const auth = checkAuth();
  
  if (!auth.authToken) {
    console.error('❌ Tidak ada auth token, silakan login dulu');
    return;
  }
  
  // 2. Test GET
  await testGetAdditionalTasks();
  
  // 3. Test POST
  await testPostAdditionalTask();
  
  // 4. Check network
  checkNetworkRequests();
  
  // 5. Debug React Query
  debugReactQuery();
  
  console.log('\n🎯 Debug selesai. Cek hasil di atas.');
}

// Jalankan debug
runAllDebug();