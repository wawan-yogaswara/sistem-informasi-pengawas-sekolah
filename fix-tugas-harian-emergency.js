// EMERGENCY FIX: Tugas Harian Tidak Muncul
// Jalankan script ini di console browser untuk fix cepat

console.log('🚨 EMERGENCY FIX: Tugas Harian Tidak Muncul');

// 1. Clear cache dan reload
function clearCacheAndReload() {
  console.log('\n1️⃣ CLEAR CACHE DAN RELOAD');
  
  // Clear localStorage
  const keysToKeep = ['auth_user']; // Keep login data
  const allKeys = Object.keys(localStorage);
  
  allKeys.forEach(key => {
    if (!keysToKeep.includes(key)) {
      localStorage.removeItem(key);
    }
  });
  
  console.log('✅ Cache cleared (kecuali auth_user)');
  
  // Force reload
  setTimeout(() => {
    console.log('🔄 Reloading page...');
    window.location.reload(true);
  }, 1000);
}

// 2. Test koneksi Supabase langsung
async function testSupabaseConnection() {
  console.log('\n2️⃣ TEST KONEKSI SUPABASE LANGSUNG');
  
  try {
    // Get Supabase config from environment atau hardcode untuk testing
    const supabaseUrl = 'https://your-project.supabase.co'; // Ganti dengan URL Supabase Anda
    const supabaseKey = 'your-anon-key'; // Ganti dengan anon key Anda
    
    // Test dengan fetch langsung
    const response = await fetch(`${supabaseUrl}/rest/v1/tasks?select=*`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error('❌ HTTP Error:', response.status, response.statusText);
      return false;
    }
    
    const data = await response.json();
    console.log('✅ Direct Supabase connection successful');
    console.log(`📊 Total tasks found: ${data.length}`);
    console.table(data.slice(0, 3)); // Show first 3 records
    
    return data;
  } catch (error) {
    console.error('❌ Direct connection failed:', error);
    return false;
  }
}

// 3. Force refresh React Query
function forceRefreshReactQuery() {
  console.log('\n3️⃣ FORCE REFRESH REACT QUERY');
  
  // Try to find and trigger refetch
  const buttons = document.querySelectorAll('button');
  const refreshButton = Array.from(buttons).find(btn => 
    btn.textContent?.includes('Tambah Tugas') || 
    btn.textContent?.includes('Refresh')
  );
  
  if (refreshButton) {
    console.log('🔄 Found refresh button, clicking...');
    refreshButton.click();
  }
  
  // Try to trigger window focus event (React Query refetch on focus)
  window.dispatchEvent(new Event('focus'));
  
  console.log('✅ React Query refresh triggered');
}

// 4. Check dan fix user authentication
function checkAndFixAuth() {
  console.log('\n4️⃣ CHECK DAN FIX USER AUTH');
  
  const userData = localStorage.getItem('auth_user');
  
  if (!userData) {
    console.error('❌ User tidak login! Redirect ke login...');
    window.location.href = '/login';
    return false;
  }
  
  try {
    const user = JSON.parse(userData);
    console.log('✅ User login detected:', user);
    
    // Ensure user has proper ID
    if (!user.id || user.id.length < 10) {
      const newId = `user-${user.username || 'anonymous'}-${Date.now()}`;
      user.id = newId;
      localStorage.setItem('auth_user', JSON.stringify(user));
      console.log('🔧 Fixed user ID:', newId);
    }
    
    return user;
  } catch (error) {
    console.error('❌ Error parsing user data:', error);
    localStorage.removeItem('auth_user');
    window.location.href = '/login';
    return false;
  }
}

// 5. Inject debug info ke halaman
function injectDebugInfo() {
  console.log('\n5️⃣ INJECT DEBUG INFO');
  
  // Create debug panel
  const debugPanel = document.createElement('div');
  debugPanel.id = 'debug-panel';
  debugPanel.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: #000;
    color: #0f0;
    padding: 10px;
    border-radius: 5px;
    font-family: monospace;
    font-size: 12px;
    z-index: 9999;
    max-width: 300px;
  `;
  
  debugPanel.innerHTML = `
    <div><strong>🔧 DEBUG TUGAS HARIAN</strong></div>
    <div id="debug-status">Checking...</div>
    <button onclick="window.debugFix.runAll()" style="margin-top: 5px; padding: 5px;">
      🚀 Run All Fixes
    </button>
    <button onclick="document.getElementById('debug-panel').remove()" style="margin-top: 5px; padding: 5px; margin-left: 5px;">
      ❌ Close
    </button>
  `;
  
  document.body.appendChild(debugPanel);
  
  // Update status
  setTimeout(() => {
    const statusEl = document.getElementById('debug-status');
    if (statusEl) {
      statusEl.innerHTML = `
        <div>✅ Debug panel active</div>
        <div>📊 Check console for details</div>
      `;
    }
  }, 1000);
  
  console.log('✅ Debug panel injected');
}

// 6. Run all fixes
async function runAllFixes() {
  console.log('\n🚀 RUNNING ALL EMERGENCY FIXES...');
  
  // Check auth first
  const user = checkAndFixAuth();
  if (!user) return;
  
  // Test connection
  await testSupabaseConnection();
  
  // Force refresh
  forceRefreshReactQuery();
  
  // Wait a bit then clear cache and reload
  setTimeout(() => {
    console.log('\n⏰ Auto-reloading in 3 seconds...');
    setTimeout(clearCacheAndReload, 3000);
  }, 2000);
}

// 7. Export to window for manual use
window.debugFix = {
  clearCacheAndReload,
  testSupabaseConnection,
  forceRefreshReactQuery,
  checkAndFixAuth,
  injectDebugInfo,
  runAllFixes
};

// Auto-run
console.log('\n🎯 EMERGENCY FIX LOADED');
console.log('📋 Available functions:');
console.log('- window.debugFix.runAllFixes() - Run semua fix');
console.log('- window.debugFix.clearCacheAndReload() - Clear cache & reload');
console.log('- window.debugFix.testSupabaseConnection() - Test koneksi');
console.log('- window.debugFix.checkAndFixAuth() - Fix authentication');

// Inject debug panel
injectDebugInfo();

// Auto-run basic checks
setTimeout(() => {
  console.log('\n🔄 AUTO-RUNNING BASIC CHECKS...');
  checkAndFixAuth();
  forceRefreshReactQuery();
}, 1000);