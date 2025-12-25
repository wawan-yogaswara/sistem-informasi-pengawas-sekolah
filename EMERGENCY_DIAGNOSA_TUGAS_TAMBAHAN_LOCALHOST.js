// EMERGENCY DIAGNOSA TUGAS TAMBAHAN LOCALHOST
// Jalankan di browser console localhost:5000 untuk diagnosa cepat

console.log('🚨 EMERGENCY DIAGNOSA: Halaman Tugas Tambahan Tidak Bisa Terbuka');
console.log('');

// Test 1: Cek apakah halaman bisa diakses
function testPageAccess() {
  console.log('📋 Test 1: Akses Halaman Tugas Tambahan');
  
  const currentPath = window.location.pathname;
  console.log('- Current path:', currentPath);
  
  if (currentPath.includes('additional-tasks')) {
    console.log('✅ Halaman tugas tambahan berhasil diakses');
    return true;
  } else {
    console.log('❌ Tidak berada di halaman tugas tambahan');
    console.log('🔧 Solusi: Navigate ke /additional-tasks');
    return false;
  }
}

// Test 2: Cek error di console
function testConsoleErrors() {
  console.log('📋 Test 2: Cek Error di Console');
  console.log('- Lihat console untuk error merah');
  console.log('- Cari error terkait Supabase, React Query, atau komponen');
  console.log('- Error umum: 401 Unauthorized, Network Error, Component Error');
}

// Test 3: Cek loading state
function testLoadingState() {
  console.log('📋 Test 3: Cek Loading State');
  
  // Cek loading text
  const loadingElements = document.querySelectorAll('*');
  let hasLoadingText = false;
  
  loadingElements.forEach(el => {
    if (el.textContent && el.textContent.includes('Memuat data')) {
      hasLoadingText = true;
    }
  });
  
  console.log('- Loading state aktif:', hasLoadingText);
  
  if (hasLoadingText) {
    console.log('⏳ Halaman masih loading, tunggu beberapa detik');
  } else {
    console.log('✅ Loading selesai atau tidak ada loading state');
  }
}

// Test 4: Cek user authentication
function testUserAuth() {
  console.log('📋 Test 4: Cek User Authentication');
  
  const authUser = localStorage.getItem('auth_user');
  const userData = localStorage.getItem('user_data');
  
  console.log('- auth_user exists:', !!authUser);
  console.log('- user_data exists:', !!userData);
  
  if (authUser) {
    try {
      const user = JSON.parse(authUser);
      console.log('- User ID:', user.id || user.username);
      console.log('- User name:', user.fullName || user.username);
    } catch (e) {
      console.log('❌ Error parsing auth_user:', e);
    }
  } else {
    console.log('❌ Tidak ada data user - perlu login ulang');
  }
}

// Test 5: Cek Supabase connection
async function testSupabaseConnection() {
  console.log('📋 Test 5: Cek Supabase Connection');
  
  try {
    // Import supabase (jika tersedia di window)
    if (window.supabase) {
      console.log('✅ Supabase client tersedia');
      
      // Test simple query
      const { data, error } = await window.supabase
        .from('additional_tasks')
        .select('count(*)')
        .limit(1);
      
      if (error) {
        console.log('❌ Supabase error:', error.message);
      } else {
        console.log('✅ Supabase connection OK');
      }
    } else {
      console.log('⚠️ Supabase client tidak tersedia di window');
    }
  } catch (error) {
    console.log('❌ Error testing Supabase:', error);
  }
}

// Test 6: Cek React Query
function testReactQuery() {
  console.log('📋 Test 6: Cek React Query State');
  
  // Cek apakah ada React Query DevTools
  if (window.__REACT_QUERY_DEVTOOLS__) {
    console.log('✅ React Query DevTools tersedia');
  }
  
  // Cek query cache (jika tersedia)
  console.log('- Buka React DevTools untuk melihat query state');
  console.log('- Cari query dengan key: ["additional-tasks"]');
}

// Test 7: Cek DOM elements
function testDOMElements() {
  console.log('📋 Test 7: Cek DOM Elements');
  
  const addButton = document.querySelector('[data-testid="button-add-supervision"]') || 
                   document.querySelector('button:contains("Tambah")');
  const cards = document.querySelectorAll('[class*="Card"]');
  const emptyState = document.querySelector('*:contains("Belum ada kegiatan")');
  
  console.log('- Add button found:', !!addButton);
  console.log('- Task cards found:', cards.length);
  console.log('- Empty state found:', !!emptyState);
  
  if (cards.length === 0 && !emptyState) {
    console.log('❌ Tidak ada data dan tidak ada empty state - kemungkinan error');
  }
}

// Test 8: Network requests
function testNetworkRequests() {
  console.log('📋 Test 8: Cek Network Requests');
  console.log('- Buka Network tab di DevTools');
  console.log('- Refresh halaman dan lihat request ke Supabase');
  console.log('- Cari request yang gagal (status 4xx atau 5xx)');
  console.log('- URL Supabase biasanya: https://[project].supabase.co/rest/v1/additional_tasks');
}

// Jalankan semua test
async function runEmergencyDiagnosis() {
  console.log('🚀 MEMULAI EMERGENCY DIAGNOSA...');
  console.log('='.repeat(50));
  
  testPageAccess();
  console.log('');
  
  testConsoleErrors();
  console.log('');
  
  testLoadingState();
  console.log('');
  
  testUserAuth();
  console.log('');
  
  await testSupabaseConnection();
  console.log('');
  
  testReactQuery();
  console.log('');
  
  testDOMElements();
  console.log('');
  
  testNetworkRequests();
  console.log('');
  
  console.log('='.repeat(50));
  console.log('🎯 LANGKAH SELANJUTNYA:');
  console.log('1. Cek error merah di console');
  console.log('2. Cek Network tab untuk request yang gagal');
  console.log('3. Pastikan user sudah login');
  console.log('4. Coba refresh halaman');
  console.log('5. Jika masih error, coba logout dan login ulang');
}

// Export functions
window.testPageAccess = testPageAccess;
window.testUserAuth = testUserAuth;
window.testSupabaseConnection = testSupabaseConnection;
window.runEmergencyDiagnosis = runEmergencyDiagnosis;

// Auto run
console.log('📋 INSTRUKSI:');
console.log('1. Buka localhost:5000/additional-tasks');
console.log('2. Jalankan: runEmergencyDiagnosis()');
console.log('3. Atau jalankan test individual seperti: testUserAuth()');
console.log('');

// Jalankan diagnosa otomatis jika di halaman yang tepat
if (window.location.pathname.includes('additional-tasks')) {
  setTimeout(() => {
    runEmergencyDiagnosis();
  }, 1000);
}