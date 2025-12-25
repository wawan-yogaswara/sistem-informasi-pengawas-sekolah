// 🧪 TEST API ENDPOINTS LANGSUNG
// Script untuk menguji semua API endpoints secara langsung

console.log('🧪 TEST API ENDPOINTS LANGSUNG');
console.log('==============================');

const WAWAN_USER_ID = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';

async function testAllEndpoints() {
  console.log('🚀 Memulai test semua endpoints...');
  
  // Test 1: Tasks endpoint dengan user_id
  console.log('\n1️⃣ TEST TASKS ENDPOINT');
  try {
    const url = `/api/tasks-daily?user_id=${encodeURIComponent(WAWAN_USER_ID)}`;
    console.log('🔗 URL:', url);
    
    const response = await fetch(url);
    console.log('📊 Status:', response.status);
    console.log('📊 Headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Data berhasil:', data.length, 'items');
      if (data.length > 0) {
        console.log('📋 Sample data:', data[0]);
      } else {
        console.log('⚠️ Data kosong untuk user:', WAWAN_USER_ID);
        
        // Test tanpa filter
        console.log('🔄 Testing tanpa user_id filter...');
        const allResponse = await fetch('/api/tasks-daily');
        if (allResponse.ok) {
          const allData = await allResponse.json();
          console.log('📋 Total tasks di database:', allData.length);
          
          // Cari data untuk wawan
          const wawanTasks = allData.filter(task => 
            task.user_id === WAWAN_USER_ID || 
            task.user_id === 'wawan' ||
            (task.title && task.title.toLowerCase().includes('wawan'))
          );
          console.log('📋 Tasks untuk Wawan ditemukan:', wawanTasks.length);
          
          if (wawanTasks.length > 0) {
            console.log('📋 Sample Wawan task:', wawanTasks[0]);
          }
        }
      }
    } else {
      const errorText = await response.text();
      console.error('❌ Error response:', errorText);
    }
  } catch (error) {
    console.error('❌ Network error:', error);
  }
  
  // Test 2: Supervisions endpoint
  console.log('\n2️⃣ TEST SUPERVISIONS ENDPOINT');
  try {
    const url = `/api/supervisions?user_id=${encodeURIComponent(WAWAN_USER_ID)}`;
    console.log('🔗 URL:', url);
    
    const response = await fetch(url);
    console.log('📊 Status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Data berhasil:', data.length, 'items');
      if (data.length > 0) {
        console.log('🔍 Sample data:', data[0]);
      } else {
        console.log('⚠️ Data kosong untuk user:', WAWAN_USER_ID);
        
        // Test tanpa filter
        const allResponse = await fetch('/api/supervisions');
        if (allResponse.ok) {
          const allData = await allResponse.json();
          console.log('🔍 Total supervisions di database:', allData.length);
          
          const wawanSupervisions = allData.filter(supervision => 
            supervision.user_id === WAWAN_USER_ID || 
            supervision.user_id === 'wawan'
          );
          console.log('🔍 Supervisions untuk Wawan:', wawanSupervisions.length);
          
          if (wawanSupervisions.length > 0) {
            console.log('🔍 Sample Wawan supervision:', wawanSupervisions[0]);
          }
        }
      }
    } else {
      const errorText = await response.text();
      console.error('❌ Error response:', errorText);
    }
  } catch (error) {
    console.error('❌ Network error:', error);
  }
  
  // Test 3: Activities endpoint
  console.log('\n3️⃣ TEST ACTIVITIES ENDPOINT');
  try {
    const url = `/api/activities?user_id=${encodeURIComponent(WAWAN_USER_ID)}`;
    console.log('🔗 URL:', url);
    
    const response = await fetch(url);
    console.log('📊 Status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Data berhasil:', data.length, 'items');
      if (data.length > 0) {
        console.log('➕ Sample data:', data[0]);
      } else {
        console.log('⚠️ Data kosong untuk user:', WAWAN_USER_ID);
        
        // Test tanpa filter
        const allResponse = await fetch('/api/activities');
        if (allResponse.ok) {
          const allData = await allResponse.json();
          console.log('➕ Total activities di database:', allData.length);
          
          const wawanActivities = allData.filter(activity => 
            activity.user_id === WAWAN_USER_ID || 
            activity.user_id === 'wawan'
          );
          console.log('➕ Activities untuk Wawan:', wawanActivities.length);
          
          if (wawanActivities.length > 0) {
            console.log('➕ Sample Wawan activity:', wawanActivities[0]);
          }
        }
      }
    } else {
      const errorText = await response.text();
      console.error('❌ Error response:', errorText);
    }
  } catch (error) {
    console.error('❌ Network error:', error);
  }
  
  // Test 4: Schools endpoint (untuk referensi)
  console.log('\n4️⃣ TEST SCHOOLS ENDPOINT');
  try {
    const response = await fetch('/api/schools');
    console.log('📊 Status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Schools data:', data.length, 'items');
    } else {
      const errorText = await response.text();
      console.error('❌ Schools error:', errorText);
    }
  } catch (error) {
    console.error('❌ Schools network error:', error);
  }
  
  console.log('\n✅ TEST SELESAI');
  console.log('📋 KESIMPULAN:');
  console.log('- Jika semua endpoint mengembalikan data, masalah di React component');
  console.log('- Jika endpoint mengembalikan data kosong, masalah di database atau user_id');
  console.log('- Jika endpoint error, masalah di server atau konfigurasi');
}

// Jalankan test
testAllEndpoints();