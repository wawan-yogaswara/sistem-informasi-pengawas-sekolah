// 🔍 SCRIPT DEBUGGING FRONTEND TASKS
// Jalankan di browser console pada halaman Tasks

console.log('🔍 DEBUGGING FRONTEND TASKS DATA');
console.log('=================================');

// 1. Cek authentication
const authUser = localStorage.getItem('auth_user');
console.log('👤 Auth User:', authUser ? JSON.parse(authUser) : '❌ Tidak ada auth user');

// 2. Cek Supabase client
if (typeof window !== 'undefined' && window.supabase) {
  console.log('✅ Supabase client tersedia');
  
  // Test manual query
  console.log('🔍 Testing manual Supabase query...');
  
  window.supabase
    .from('tasks')
    .select(`
      *,
      schools (
        id,
        name
      )
    `)
    .order('created_at', { ascending: false })
    .then(result => {
      console.log('📊 Manual query result:', result);
      if (result.error) {
        console.error('❌ Query error:', result.error);
      } else {
        console.log('✅ Query success, data count:', result.data?.length || 0);
        if (result.data && result.data.length > 0) {
          console.log('📝 Sample task:', result.data[0]);
        }
      }
    })
    .catch(err => {
      console.error('❌ Query exception:', err);
    });
    
} else {
  console.log('❌ Supabase client tidak tersedia di window');
}

// 3. Cek React Query cache (jika tersedia)
if (typeof window !== 'undefined' && window.__REACT_QUERY_DEVTOOLS_GLOBAL_HOOK__) {
  console.log('✅ React Query DevTools tersedia');
} else {
  console.log('❌ React Query DevTools tidak tersedia');
}

// 4. Cek network requests
console.log('🌐 NETWORK DEBUGGING:');
console.log('1. Buka Network tab di DevTools');
console.log('2. Filter by XHR/Fetch');
console.log('3. Refresh halaman atau trigger query');
console.log('4. Lihat request ke Supabase API');

// 5. Cek console errors
console.log('🐛 CEK CONSOLE ERRORS:');
console.log('- Error 401/403: Masalah authentication');
console.log('- Error 500: Masalah server/database');
console.log('- Error CORS: Masalah konfigurasi domain');

// 6. Manual test schools query
if (typeof window !== 'undefined' && window.supabase) {
  console.log('🏫 Testing schools query...');
  
  window.supabase
    .from('schools')
    .select('id, name')
    .order('name', { ascending: true })
    .then(result => {
      console.log('🏫 Schools query result:', result);
      if (result.error) {
        console.error('❌ Schools error:', result.error);
      } else {
        console.log('✅ Schools success, count:', result.data?.length || 0);
      }
    });
}

console.log('');
console.log('📋 NEXT STEPS:');
console.log('1. Lihat hasil query di atas');
console.log('2. Cek Network tab untuk request details');
console.log('3. Jika ada error, copy error message');
console.log('4. Refresh halaman dan coba lagi');