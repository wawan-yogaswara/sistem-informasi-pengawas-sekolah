// DIAGNOSA PRODUCTION NETLIFY - Foto tidak muncul di laporan
// Script untuk mendiagnosa masalah foto tidak muncul di production Netlify

console.log('🔍 DIAGNOSA PRODUCTION NETLIFY - Foto tidak muncul di laporan');

// 1. CEK ENVIRONMENT PRODUCTION
function cekEnvironmentProduction() {
  console.log('🌐 Mengecek environment production...');
  
  console.log('📍 Current URL:', window.location.href);
  console.log('🏠 Hostname:', window.location.hostname);
  console.log('🔗 Origin:', window.location.origin);
  
  // Cek apakah ini Netlify production
  if (window.location.hostname.includes('netlify.app')) {
    console.log('✅ Running on Netlify production');
    return true;
  } else {
    console.log('⚠️ Not running on Netlify production');
    return false;
  }
}

// 2. CEK USER LOGIN STATUS
function cekUserLoginStatus() {
  console.log('👤 Mengecek status login user...');
  
  const userData = localStorage.getItem('auth_user');
  if (!userData) {
    console.error('❌ User tidak login - tidak ada data di localStorage');
    console.log('💡 Solusi: Login terlebih dahulu sebagai user wawan');
    return null;
  }
  
  const user = JSON.parse(userData);
  console.log('✅ User login ditemukan:', {
    username: user.username,
    id: user.id,
    fullName: user.fullName
  });
  
  // Cek apakah user ID sudah benar untuk Wawan
  if (user.username === 'wawan') {
    const correctId = '421cdb28-f2af-4f1f-aa5f-c59a3d661a2e';
    if (user.id !== correctId) {
      console.log('🔧 User ID Wawan perlu diperbaiki...');
      user.id = correctId;
      localStorage.setItem('auth_user', JSON.stringify(user));
      console.log('✅ User ID Wawan diperbaiki ke:', correctId);
    } else {
      console.log('✅ User ID Wawan sudah benar');
    }
  }
  
  return user;
}

// 3. TEST API ENDPOINTS
async function testAPIEndpoints(userId) {
  console.log('🔗 Testing API endpoints...');
  
  const endpoints = [
    { name: 'Tasks Daily', url: `/api/tasks-daily?user_id=${encodeURIComponent(userId)}` },
    { name: 'Supervisions', url: `/api/supervisions?user_id=${encodeURIComponent(userId)}` },
    { name: 'Activities', url: `/api/activities?user_id=${encodeURIComponent(userId)}` },
    { name: 'Schools', url: '/api/schools' }
  ];
  
  const results = {};
  
  for (const endpoint of endpoints) {
    try {
      console.log(`📡 Testing ${endpoint.name}:`, endpoint.url);
      const response = await fetch(endpoint.url);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ ${endpoint.name} OK:`, data.length, 'records');
        results[endpoint.name] = { status: 'OK', count: data.length, data: data.slice(0, 2) };
        
        // Log sample data untuk debugging
        if (data.length > 0) {
          console.log(`📋 Sample ${endpoint.name} data:`, data[0]);
          
          // Cek foto khusus untuk data yang ada foto
          if (data[0].photo || data[0].photo1 || data[0].photo2) {
            console.log(`📸 ${endpoint.name} photo fields:`, {
              photo: data[0].photo ? (data[0].photo.startsWith('data:') ? 'base64' : data[0].photo) : null,
              photo1: data[0].photo1 ? (data[0].photo1.startsWith('data:') ? 'base64' : data[0].photo1) : null,
              photo2: data[0].photo2 ? (data[0].photo2.startsWith('data:') ? 'base64' : data[0].photo2) : null
            });
          }
        }
      } else {
        const errorText = await response.text();
        console.error(`❌ ${endpoint.name} FAILED:`, response.status, errorText);
        results[endpoint.name] = { status: 'FAILED', error: `${response.status}: ${errorText}` };
      }
    } catch (error) {
      console.error(`❌ ${endpoint.name} ERROR:`, error);
      results[endpoint.name] = { status: 'ERROR', error: error.message };
    }
  }
  
  return results;
}

// 4. TEST SUPABASE DIRECT CONNECTION
async function testSupabaseDirect(userId) {
  console.log('🗄️ Testing Supabase direct connection...');
  
  try {
    const supabaseUrl = 'https://fmxeboullgcewzjpql.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZteGVib3VsbGdjZXd6anBxbCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM0NTk5NzI4LCJleHAiOjIwNTAxNzU3Mjh9.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';
    
    // Test tasks table
    const tasksResponse = await fetch(`${supabaseUrl}/rest/v1/tasks?user_id=eq.${userId}&select=*&limit=5`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (tasksResponse.ok) {
      const tasksData = await tasksResponse.json();
      console.log('✅ Supabase tasks direct:', tasksData.length, 'records');
      if (tasksData.length > 0) {
        console.log('📋 Sample task from Supabase:', tasksData[0]);
      }
    } else {
      console.error('❌ Supabase tasks direct failed:', tasksResponse.status);
    }
    
    // Test additional_tasks table
    const additionalResponse = await fetch(`${supabaseUrl}/rest/v1/additional_tasks?user_id=eq.${userId}&select=*&limit=5`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (additionalResponse.ok) {
      const additionalData = await additionalResponse.json();
      console.log('✅ Supabase additional_tasks direct:', additionalData.length, 'records');
      if (additionalData.length > 0) {
        console.log('📋 Sample additional_task from Supabase:', additionalData[0]);
      }
    } else {
      console.error('❌ Supabase additional_tasks direct failed:', additionalResponse.status);
    }
    
    // Test supervisions table
    const supervisionsResponse = await fetch(`${supabaseUrl}/rest/v1/supervisions?user_id=eq.${userId}&select=*&limit=5`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (supervisionsResponse.ok) {
      const supervisionsData = await supervisionsResponse.json();
      console.log('✅ Supabase supervisions direct:', supervisionsData.length, 'records');
      if (supervisionsData.length > 0) {
        console.log('📋 Sample supervision from Supabase:', supervisionsData[0]);
      }
    } else {
      console.error('❌ Supabase supervisions direct failed:', supervisionsResponse.status);
    }
    
  } catch (error) {
    console.error('❌ Supabase direct connection error:', error);
  }
}

// 5. CEK HALAMAN REPORTS CURRENT STATE
function cekHalamanReports() {
  console.log('📄 Mengecek halaman reports current state...');
  
  // Cek apakah ada data activities di state
  const activitiesElements = document.querySelectorAll('[data-activity-id]');
  console.log('📊 Activities elements found:', activitiesElements.length);
  
  // Cek apakah ada pesan "Belum ada aktivitas"
  const noActivitiesMessage = document.querySelector('h3');
  if (noActivitiesMessage && noActivitiesMessage.textContent?.includes('Belum ada aktivitas')) {
    console.log('⚠️ Halaman menampilkan "Belum ada aktivitas"');
  }
  
  // Cek apakah ada loading state
  const loadingElement = document.querySelector('.animate-spin');
  if (loadingElement) {
    console.log('⏳ Halaman masih dalam loading state');
  }
  
  // Cek localStorage cache
  const cachedData = localStorage.getItem('reports_activities_cache');
  if (cachedData) {
    try {
      const parsed = JSON.parse(cachedData);
      console.log('📦 Found cached data:', parsed.length, 'activities');
    } catch (error) {
      console.log('❌ Cached data corrupted');
    }
  } else {
    console.log('📦 No cached data found');
  }
}

// 6. MAIN DIAGNOSIS FUNCTION
async function diagnosaProduction() {
  console.log('🚨 MEMULAI DIAGNOSA PRODUCTION...');
  
  // Step 1: Cek environment
  const isProduction = cekEnvironmentProduction();
  if (!isProduction) {
    console.log('⚠️ Tidak berjalan di production Netlify');
    return;
  }
  
  // Step 2: Cek user login
  const user = cekUserLoginStatus();
  if (!user) {
    console.log('❌ User tidak login - diagnosa dihentikan');
    console.log('💡 Silakan login terlebih dahulu di:', window.location.origin + '/login');
    return;
  }
  
  // Step 3: Cek halaman reports
  cekHalamanReports();
  
  // Step 4: Test API endpoints
  console.log('🔗 Testing API endpoints...');
  const apiResults = await testAPIEndpoints(user.id);
  
  // Step 5: Test Supabase direct
  await testSupabaseDirect(user.id);
  
  // Step 6: Generate diagnosis report
  console.log('📋 DIAGNOSIS REPORT:');
  console.log('==================');
  console.log('Environment: Netlify Production ✅');
  console.log('User Login:', user.username, '✅');
  console.log('User ID:', user.id);
  
  console.log('\nAPI Endpoints Status:');
  Object.entries(apiResults).forEach(([name, result]) => {
    const status = result.status === 'OK' ? '✅' : '❌';
    console.log(`${status} ${name}: ${result.status}${result.count !== undefined ? ` (${result.count} records)` : ''}`);
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
  });
  
  // Step 7: Recommendations
  console.log('\n🔧 REKOMENDASI:');
  
  const hasFailedAPIs = Object.values(apiResults).some(r => r.status !== 'OK');
  const hasNoData = Object.values(apiResults).every(r => r.count === 0);
  
  if (hasFailedAPIs) {
    console.log('1. ❌ Ada API endpoints yang gagal - cek Netlify environment variables');
    console.log('2. 🔧 Pastikan SUPABASE_URL dan SUPABASE_ANON_KEY sudah diset di Netlify');
  } else if (hasNoData) {
    console.log('1. 📊 API endpoints OK tapi tidak ada data');
    console.log('2. 💾 Coba input data baru di halaman Tugas Harian/Supervisi/Kegiatan Tambahan');
    console.log('3. 🔄 Atau jalankan emergency fix untuk force load data');
  } else {
    console.log('1. ✅ API endpoints OK dan ada data');
    console.log('2. 🔄 Coba refresh halaman atau clear cache browser');
    console.log('3. 🔧 Atau jalankan emergency fix untuk force reload data');
  }
  
  console.log('\n📞 Jika masih bermasalah, hubungi developer dengan screenshot console ini');
}

// JALANKAN DIAGNOSA
diagnosaProduction();

// INSTRUKSI PENGGUNAAN
console.log(`
🔧 CARA MENGGUNAKAN DIAGNOSA:

1. Buka halaman reports di production: https://sistem-informasi-pengawas-kcdu.netlify.app/reports
2. Tekan F12 untuk buka Developer Tools
3. Masuk ke tab Console
4. Copy-paste script ini dan tekan Enter
5. Lihat hasil diagnosa di console
6. Ikuti rekomendasi yang diberikan

📝 LANGKAH SELANJUTNYA:
- Jika API gagal: Cek environment variables di Netlify
- Jika tidak ada data: Input data baru atau jalankan emergency fix
- Jika ada data tapi tidak muncul: Jalankan emergency fix untuk force reload
`);