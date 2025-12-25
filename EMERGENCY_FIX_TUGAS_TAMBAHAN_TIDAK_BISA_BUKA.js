// EMERGENCY FIX: Tugas Tambahan Tidak Bisa Buka
// Jalankan di browser console localhost:5000

console.log('🛠️ EMERGENCY FIX: Tugas Tambahan Tidak Bisa Buka');
console.log('');

// Fix 1: Clear cache dan refresh
function fixClearCache() {
  console.log('🔧 Fix 1: Clear Cache dan Refresh');
  
  // Clear localStorage yang mungkin corrupt
  const keysToRemove = [
    'additional-tasks-cache',
    'react-query-cache',
    'supabase-cache'
  ];
  
  keysToRemove.forEach(key => {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
      console.log('- Removed:', key);
    }
  });
  
  // Clear sessionStorage
  sessionStorage.clear();
  console.log('- Cleared sessionStorage');
  
  console.log('✅ Cache cleared. Refresh halaman sekarang.');
}

// Fix 2: Reset user session
function fixResetUserSession() {
  console.log('🔧 Fix 2: Reset User Session');
  
  const authUser = localStorage.getItem('auth_user');
  if (authUser) {
    try {
      const user = JSON.parse(authUser);
      console.log('- Current user:', user.username || user.id);
      
      // Recreate clean user session
      const cleanUser = {
        id: user.id || user.username,
        username: user.username,
        fullName: user.fullName || user.full_name,
        role: user.role || 'pengawas'
      };
      
      localStorage.setItem('auth_user', JSON.stringify(cleanUser));
      console.log('✅ User session reset');
      
    } catch (e) {
      console.log('❌ Error parsing user data, removing...');
      localStorage.removeItem('auth_user');
      console.log('⚠️ Perlu login ulang');
    }
  } else {
    console.log('❌ Tidak ada user session - perlu login');
  }
}

// Fix 3: Force reload React Query
function fixForceReloadQuery() {
  console.log('🔧 Fix 3: Force Reload React Query');
  
  // Jika React Query tersedia
  if (window.queryClient) {
    window.queryClient.invalidateQueries(['additional-tasks']);
    window.queryClient.refetchQueries(['additional-tasks']);
    console.log('✅ React Query invalidated and refetched');
  } else {
    console.log('⚠️ React Query client tidak tersedia');
  }
  
  // Alternative: reload halaman
  console.log('🔄 Reloading halaman...');
  setTimeout(() => {
    window.location.reload();
  }, 1000);
}

// Fix 4: Manual Supabase test
async function fixTestSupabaseManual() {
  console.log('🔧 Fix 4: Manual Supabase Test');
  
  try {
    // Get user
    const authUser = localStorage.getItem('auth_user');
    if (!authUser) {
      console.log('❌ Tidak ada user - login dulu');
      return;
    }
    
    const user = JSON.parse(authUser);
    const userId = user.username || user.id;
    
    console.log('- Testing dengan user_id:', userId);
    
    // Manual fetch ke Supabase (jika supabase tersedia)
    if (window.supabase) {
      const { data, error } = await window.supabase
        .from('additional_tasks')
        .select('*')
        .eq('user_id', userId)
        .limit(5);
      
      if (error) {
        console.log('❌ Supabase error:', error.message);
        console.log('- Error details:', error);
        
        // Common fixes
        if (error.message.includes('401')) {
          console.log('🔧 Fix: Authentication error - coba login ulang');
        }
        if (error.message.includes('permission')) {
          console.log('🔧 Fix: Permission error - cek RLS policies');
        }
      } else {
        console.log('✅ Supabase query berhasil');
        console.log('- Data found:', data?.length || 0);
        console.log('- Sample data:', data?.[0]);
      }
    } else {
      console.log('❌ Supabase client tidak tersedia');
    }
    
  } catch (error) {
    console.log('❌ Error testing Supabase:', error);
  }
}

// Fix 5: Navigate ulang ke halaman
function fixNavigateToPage() {
  console.log('🔧 Fix 5: Navigate Ulang ke Halaman');
  
  // Clear current path dan navigate ulang
  if (window.location.pathname !== '/additional-tasks') {
    console.log('- Navigating to /additional-tasks...');
    window.location.href = '/additional-tasks';
  } else {
    console.log('- Already on /additional-tasks, reloading...');
    window.location.reload();
  }
}

// Fix 6: Emergency login
function fixEmergencyLogin() {
  console.log('🔧 Fix 6: Emergency Login');
  
  // Create emergency user session
  const emergencyUser = {
    id: 'wawan',
    username: 'wawan',
    fullName: 'Wawan Yogaswara',
    role: 'pengawas'
  };
  
  localStorage.setItem('auth_user', JSON.stringify(emergencyUser));
  localStorage.setItem('user_data', JSON.stringify(emergencyUser));
  
  console.log('✅ Emergency user session created');
  console.log('- User:', emergencyUser.fullName);
  console.log('🔄 Reloading halaman...');
  
  setTimeout(() => {
    window.location.reload();
  }, 1000);
}

// Comprehensive fix
async function runComprehensiveFix() {
  console.log('🚀 MENJALANKAN COMPREHENSIVE FIX...');
  console.log('='.repeat(50));
  
  // Step 1: Clear cache
  fixClearCache();
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Step 2: Reset user session
  fixResetUserSession();
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Step 3: Test Supabase
  await fixTestSupabaseManual();
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Step 4: Force reload
  console.log('🔄 Final step: Reloading halaman...');
  setTimeout(() => {
    window.location.reload();
  }, 2000);
}

// Export functions
window.fixClearCache = fixClearCache;
window.fixResetUserSession = fixResetUserSession;
window.fixForceReloadQuery = fixForceReloadQuery;
window.fixTestSupabaseManual = fixTestSupabaseManual;
window.fixNavigateToPage = fixNavigateToPage;
window.fixEmergencyLogin = fixEmergencyLogin;
window.runComprehensiveFix = runComprehensiveFix;

console.log('📋 INSTRUKSI EMERGENCY FIX:');
console.log('1. Coba: runComprehensiveFix() - fix menyeluruh');
console.log('2. Atau coba satu per satu:');
console.log('   - fixClearCache() - bersihkan cache');
console.log('   - fixResetUserSession() - reset user session');
console.log('   - fixTestSupabaseManual() - test Supabase manual');
console.log('   - fixEmergencyLogin() - buat session emergency');
console.log('3. Jika masih error, coba logout dan login ulang');
console.log('');

// Auto-run jika di halaman additional-tasks
if (window.location.pathname.includes('additional-tasks')) {
  console.log('🎯 Detected additional-tasks page. Running auto-fix in 3 seconds...');
  setTimeout(() => {
    runComprehensiveFix();
  }, 3000);
}